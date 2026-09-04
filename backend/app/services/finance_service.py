"""Fee structures, invoices, payments, coupons, certificates."""

from __future__ import annotations

import uuid
from decimal import Decimal
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.security import utcnow_naive
from app.models.commerce import Certificate, Coupon, Payment
from app.models.enrollment import Enrollment
from app.models.finance import FeeInvoice, FeeStructure
from app.models.profiles import StudentProfile
from app.schemas.finance import (
    CouponCreate,
    CouponUpdate,
    FeeStructureCreate,
    FeeStructureUpdate,
    GenerateInvoicesRequest,
    IssueCertificateRequest,
    RecordPaymentRequest,
)
from app.utils.ids import new_uuid


class FinanceService:
    def _require_tenant(self, tenant_id: Optional[str]) -> str:
        if not tenant_id:
            raise HTTPException(status.HTTP_403_FORBIDDEN, detail="Tenant context required")
        return tenant_id

    def _student_profile_id(self, db: Session, tenant_id: str, user_id: str) -> str:
        profile = (
            db.query(StudentProfile)
            .filter(
                StudentProfile.user_id == user_id,
                StudentProfile.tenant_id == tenant_id,
                StudentProfile.deleted_at.is_(None),
            )
            .first()
        )
        if not profile:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Student profile not found")
        return profile.id

    # ─── FEE STRUCTURES ───────────────────────────────────────────────────────

    def create_fee_structure(
        self,
        db: Session,
        tenant_id: Optional[str],
        data: FeeStructureCreate,
        actor_id: str,
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        payload = data.model_dump()
        payload["is_optional"] = 1 if data.is_optional else 0
        fs = FeeStructure(
            id=new_uuid(),
            tenant_id=tid,
            created_by=actor_id,
            **payload,
        )
        db.add(fs)
        db.commit()
        db.refresh(fs)
        return {"id": fs.id, "name": fs.name, "amount": float(fs.amount)}

    def list_fee_structures(self, db: Session, tenant_id: Optional[str]) -> list:
        tid = self._require_tenant(tenant_id)
        items = (
            db.query(FeeStructure)
            .filter(FeeStructure.tenant_id == tid, FeeStructure.deleted_at.is_(None))
            .order_by(FeeStructure.created_at.desc())
            .all()
        )
        return [
            {
                "id": i.id,
                "name": i.name,
                "amount": float(i.amount),
                "fee_type": i.fee_type,
                "status": i.status,
                "course_id": i.course_id,
                "batch_id": i.batch_id,
            }
            for i in items
        ]

    def update_fee_structure(
        self,
        db: Session,
        tenant_id: Optional[str],
        fs_id: str,
        data: FeeStructureUpdate,
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        fs = (
            db.query(FeeStructure)
            .filter(
                FeeStructure.id == fs_id,
                FeeStructure.tenant_id == tid,
                FeeStructure.deleted_at.is_(None),
            )
            .first()
        )
        if not fs:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Fee structure not found")
        updates = data.model_dump(exclude_unset=True)
        if "is_optional" in updates:
            updates["is_optional"] = 1 if updates["is_optional"] else 0
        for key, value in updates.items():
            setattr(fs, key, value)
        db.commit()
        return {"id": fs.id, "name": fs.name, "status": fs.status}

    def generate_invoices(
        self,
        db: Session,
        tenant_id: Optional[str],
        fee_structure_id: str,
        data: GenerateInvoicesRequest,
        actor_id: str,
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        fs = (
            db.query(FeeStructure)
            .filter(
                FeeStructure.id == fee_structure_id,
                FeeStructure.tenant_id == tid,
                FeeStructure.deleted_at.is_(None),
            )
            .first()
        )
        if not fs:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Fee structure not found")

        if data.student_ids:
            student_ids = data.student_ids
        else:
            q = db.query(Enrollment).filter(
                Enrollment.tenant_id == tid,
                Enrollment.status == "active",
            )
            if fs.course_id:
                q = q.filter(Enrollment.course_id == fs.course_id)
            if fs.batch_id:
                q = q.filter(Enrollment.batch_id == fs.batch_id)
            student_ids = [e.student_id for e in q.all()]

        generated = 0
        for student_id in student_ids:
            student = (
                db.query(StudentProfile)
                .filter(
                    StudentProfile.id == student_id,
                    StudentProfile.tenant_id == tid,
                    StudentProfile.deleted_at.is_(None),
                )
                .first()
            )
            if not student:
                continue
            total = max(float(fs.amount) - data.discount_amount, 0)
            invoice_number = f"INV-{tid[:8].upper()}-{uuid.uuid4().hex[:8].upper()}"
            db.add(
                FeeInvoice(
                    id=new_uuid(),
                    tenant_id=tid,
                    student_id=student_id,
                    fee_structure_id=fee_structure_id,
                    invoice_number=invoice_number,
                    amount=fs.amount,
                    discount_amount=data.discount_amount,
                    total_amount=total,
                    due_date=data.due_date,
                    notes=data.notes,
                    created_by=actor_id,
                )
            )
            generated += 1

        db.commit()
        return {"generated": generated, "fee_structure": fs.name}

    def list_invoices(
        self,
        db: Session,
        tenant_id: Optional[str],
        student_id: Optional[str] = None,
        invoice_status: Optional[str] = None,
    ) -> list:
        tid = self._require_tenant(tenant_id)
        q = db.query(FeeInvoice).filter(FeeInvoice.tenant_id == tid)
        if student_id:
            q = q.filter(FeeInvoice.student_id == student_id)
        if invoice_status:
            q = q.filter(FeeInvoice.status == invoice_status)
        items = q.order_by(FeeInvoice.due_date.desc()).all()
        return [
            {
                "id": i.id,
                "invoice_number": i.invoice_number,
                "student_id": i.student_id,
                "amount": float(i.amount),
                "discount_amount": float(i.discount_amount),
                "total_amount": float(i.total_amount),
                "paid_amount": float(i.paid_amount),
                "due_date": str(i.due_date),
                "status": i.status,
            }
            for i in items
        ]

    def list_student_invoices(
        self, db: Session, tenant_id: Optional[str], user_id: str
    ) -> list:
        tid = self._require_tenant(tenant_id)
        profile_id = self._student_profile_id(db, tid, user_id)
        return self.list_invoices(db, tid, student_id=profile_id)

    def waive_invoice(
        self,
        db: Session,
        tenant_id: Optional[str],
        invoice_id: str,
        notes: Optional[str],
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        invoice = (
            db.query(FeeInvoice)
            .filter(FeeInvoice.id == invoice_id, FeeInvoice.tenant_id == tid)
            .first()
        )
        if not invoice:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Invoice not found")
        invoice.status = "waived"
        if notes:
            invoice.notes = notes
        db.commit()
        return {"id": invoice.id, "status": invoice.status}

    # ─── PAYMENTS ─────────────────────────────────────────────────────────────

    def record_payment(
        self,
        db: Session,
        tenant_id: Optional[str],
        data: RecordPaymentRequest,
        actor_id: str,
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        student = (
            db.query(StudentProfile)
            .filter(
                StudentProfile.id == data.student_id,
                StudentProfile.tenant_id == tid,
                StudentProfile.deleted_at.is_(None),
            )
            .first()
        )
        if not student:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Student not found")

        payment = Payment(
            id=new_uuid(),
            tenant_id=tid,
            student_id=data.student_id,
            enrollment_id=data.enrollment_id,
            course_id=data.course_id,
            amount=Decimal(str(data.amount)),
            payment_method=data.payment_method,
            transaction_ref=data.transaction_ref,
            status="completed",
            paid_at=utcnow_naive(),
            notes=data.notes,
            created_by=actor_id,
        )
        db.add(payment)
        db.flush()

        if data.fee_invoice_id:
            invoice = (
                db.query(FeeInvoice)
                .filter(FeeInvoice.id == data.fee_invoice_id, FeeInvoice.tenant_id == tid)
                .first()
            )
            if not invoice:
                raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Invoice not found")
            invoice.paid_amount = float(invoice.paid_amount) + data.amount
            invoice.payment_id = payment.id
            if float(invoice.paid_amount) >= float(invoice.total_amount):
                invoice.status = "paid"
            else:
                invoice.status = "partial"

        db.commit()
        return {"payment_id": payment.id, "amount": data.amount, "status": "completed"}

    def get_finance_summary(self, db: Session, tenant_id: Optional[str]) -> dict:
        tid = self._require_tenant(tenant_id)
        total_revenue = (
            db.query(func.sum(Payment.amount))
            .filter(Payment.tenant_id == tid, Payment.status == "completed")
            .scalar()
            or 0
        )
        pending_invoices = (
            db.query(FeeInvoice)
            .filter(
                FeeInvoice.tenant_id == tid,
                FeeInvoice.status.in_(["unpaid", "partial"]),
            )
            .count()
        )
        return {
            "total_revenue": float(total_revenue),
            "pending_invoices": pending_invoices,
        }

    # ─── COUPONS ──────────────────────────────────────────────────────────────

    def create_coupon(
        self,
        db: Session,
        tenant_id: Optional[str],
        data: CouponCreate,
        actor_id: str,
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        code = data.code.upper().strip()
        existing = (
            db.query(Coupon)
            .filter(
                Coupon.tenant_id == tid,
                Coupon.code == code,
                Coupon.deleted_at.is_(None),
            )
            .first()
        )
        if existing:
            raise HTTPException(status.HTTP_409_CONFLICT, detail="Coupon code already exists")

        payload = data.model_dump(exclude={"code"})
        coupon = Coupon(
            id=new_uuid(),
            tenant_id=tid,
            code=code,
            created_by=actor_id,
            **payload,
        )
        db.add(coupon)
        db.commit()
        return {"id": coupon.id, "code": coupon.code}

    def list_coupons(self, db: Session, tenant_id: Optional[str]) -> list:
        tid = self._require_tenant(tenant_id)
        items = (
            db.query(Coupon)
            .filter(Coupon.tenant_id == tid, Coupon.deleted_at.is_(None))
            .order_by(Coupon.created_at.desc())
            .all()
        )
        return [
            {
                "id": c.id,
                "code": c.code,
                "discount_type": c.discount_type,
                "discount_value": float(c.discount_value),
                "status": c.status,
                "used_count": c.used_count,
                "max_uses": c.max_uses,
            }
            for c in items
        ]

    def update_coupon(
        self,
        db: Session,
        tenant_id: Optional[str],
        coupon_id: str,
        data: CouponUpdate,
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        coupon = (
            db.query(Coupon)
            .filter(
                Coupon.id == coupon_id,
                Coupon.tenant_id == tid,
                Coupon.deleted_at.is_(None),
            )
            .first()
        )
        if not coupon:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Coupon not found")
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(coupon, key, value)
        db.commit()
        return {"id": coupon.id, "code": coupon.code, "status": coupon.status}

    def validate_coupon(
        self, db: Session, tenant_id: str, code: str, order_amount: float
    ) -> dict:
        now = utcnow_naive()
        coupon = (
            db.query(Coupon)
            .filter(
                Coupon.tenant_id == tenant_id,
                Coupon.code == code.upper().strip(),
                Coupon.status == "active",
                Coupon.deleted_at.is_(None),
            )
            .first()
        )
        if not coupon:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Invalid coupon code")
        if coupon.valid_from and coupon.valid_from > now:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Coupon not yet valid")
        if coupon.valid_until and coupon.valid_until < now:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Coupon has expired")
        if coupon.max_uses is not None and coupon.used_count >= coupon.max_uses:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Coupon usage limit reached")
        if coupon.min_order_amount and order_amount < float(coupon.min_order_amount):
            raise HTTPException(
                status.HTTP_400_BAD_REQUEST,
                detail=f"Minimum order amount is {coupon.min_order_amount}",
            )

        if coupon.discount_type == "percentage":
            discount = round(order_amount * float(coupon.discount_value) / 100, 2)
        else:
            discount = min(float(coupon.discount_value), order_amount)

        return {
            "coupon_id": coupon.id,
            "code": coupon.code,
            "discount_type": coupon.discount_type,
            "discount_value": float(coupon.discount_value),
            "discount_amount": discount,
            "final_amount": round(order_amount - discount, 2),
        }

    # ─── CERTIFICATES ─────────────────────────────────────────────────────────

    def issue_certificate(
        self,
        db: Session,
        tenant_id: Optional[str],
        data: IssueCertificateRequest,
        actor_id: str,
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        enrollment = (
            db.query(Enrollment)
            .filter(
                Enrollment.id == data.enrollment_id,
                Enrollment.tenant_id == tid,
                Enrollment.student_id == data.student_id,
                Enrollment.course_id == data.course_id,
            )
            .first()
        )
        if not enrollment:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Enrollment not found")

        existing = (
            db.query(Certificate)
            .filter(
                Certificate.tenant_id == tid,
                Certificate.enrollment_id == data.enrollment_id,
            )
            .first()
        )
        if existing and existing.status == "issued":
            raise HTTPException(
                status.HTTP_409_CONFLICT,
                detail="Certificate already issued for this enrollment",
            )

        cert_number = f"CERT-{tid[:6].upper()}-{uuid.uuid4().hex[:10].upper()}"
        if existing:
            existing.certificate_number = cert_number
            existing.file_url = data.file_url
            existing.status = "issued"
            existing.issued_by = actor_id
            existing.issued_at = utcnow_naive()
            db.commit()
            return {"certificate_id": existing.id, "certificate_number": cert_number}

        cert = Certificate(
            id=new_uuid(),
            tenant_id=tid,
            student_id=data.student_id,
            course_id=data.course_id,
            enrollment_id=data.enrollment_id,
            certificate_number=cert_number,
            file_url=data.file_url,
            status="issued",
            issued_by=actor_id,
            issued_at=utcnow_naive(),
        )
        db.add(cert)
        db.commit()
        return {"certificate_id": cert.id, "certificate_number": cert_number}

    def verify_certificate(self, db: Session, cert_number: str) -> dict:
        cert = (
            db.query(Certificate)
            .filter(
                Certificate.certificate_number == cert_number,
                Certificate.status == "issued",
            )
            .first()
        )
        if not cert:
            raise HTTPException(
                status.HTTP_404_NOT_FOUND,
                detail="Certificate not found or revoked",
            )
        return {
            "certificate_number": cert.certificate_number,
            "issued_at": str(cert.issued_at),
            "status": cert.status,
            "valid": True,
        }

    def list_student_certificates(
        self, db: Session, tenant_id: Optional[str], user_id: str
    ) -> list:
        tid = self._require_tenant(tenant_id)
        profile_id = self._student_profile_id(db, tid, user_id)
        items = (
            db.query(Certificate)
            .filter(
                Certificate.tenant_id == tid,
                Certificate.student_id == profile_id,
                Certificate.status == "issued",
            )
            .order_by(Certificate.issued_at.desc())
            .all()
        )
        return [
            {
                "id": c.id,
                "certificate_number": c.certificate_number,
                "course_id": c.course_id,
                "issued_at": str(c.issued_at),
                "file_url": c.file_url,
            }
            for c in items
        ]

    def revoke_certificate(
        self, db: Session, tenant_id: Optional[str], certificate_id: str
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        cert = (
            db.query(Certificate)
            .filter(Certificate.id == certificate_id, Certificate.tenant_id == tid)
            .first()
        )
        if not cert:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Certificate not found")
        cert.status = "revoked"
        db.commit()
        return {"id": cert.id, "status": cert.status}
