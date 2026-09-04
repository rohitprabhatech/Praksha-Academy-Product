"""Academic repository — classes, subjects, batches."""

from __future__ import annotations

from typing import Optional

from sqlalchemy.orm import Session

from app.models.academic import AcademicClass, Batch, Subject
from app.models.batch_students import BatchStudent
from app.utils.ids import new_uuid


class AcademicRepository:
    def list_classes(self, db: Session, tenant_id: str) -> list[AcademicClass]:
        return (
            db.query(AcademicClass)
            .filter(
                AcademicClass.tenant_id == tenant_id,
                AcademicClass.deleted_at.is_(None),
            )
            .order_by(AcademicClass.sort_order, AcademicClass.name)
            .all()
        )

    def get_class(
        self, db: Session, class_id: str, tenant_id: str
    ) -> Optional[AcademicClass]:
        return (
            db.query(AcademicClass)
            .filter(
                AcademicClass.id == class_id,
                AcademicClass.tenant_id == tenant_id,
                AcademicClass.deleted_at.is_(None),
            )
            .first()
        )

    def create_class(self, db: Session, tenant_id: str, data: dict) -> AcademicClass:
        obj = AcademicClass(id=new_uuid(), tenant_id=tenant_id, **data)
        db.add(obj)
        db.flush()
        return obj

    def list_subjects(self, db: Session, tenant_id: str) -> list[Subject]:
        return (
            db.query(Subject)
            .filter(Subject.tenant_id == tenant_id, Subject.deleted_at.is_(None))
            .order_by(Subject.name)
            .all()
        )

    def get_subject(
        self, db: Session, subject_id: str, tenant_id: str
    ) -> Optional[Subject]:
        return (
            db.query(Subject)
            .filter(
                Subject.id == subject_id,
                Subject.tenant_id == tenant_id,
                Subject.deleted_at.is_(None),
            )
            .first()
        )

    def create_subject(self, db: Session, tenant_id: str, data: dict) -> Subject:
        obj = Subject(id=new_uuid(), tenant_id=tenant_id, **data)
        db.add(obj)
        db.flush()
        return obj

    def list_batches(self, db: Session, tenant_id: str) -> list[Batch]:
        return (
            db.query(Batch)
            .filter(Batch.tenant_id == tenant_id, Batch.deleted_at.is_(None))
            .order_by(Batch.created_at.desc())
            .all()
        )

    def get_batch(self, db: Session, batch_id: str, tenant_id: str) -> Optional[Batch]:
        return (
            db.query(Batch)
            .filter(
                Batch.id == batch_id,
                Batch.tenant_id == tenant_id,
                Batch.deleted_at.is_(None),
            )
            .first()
        )

    def create_batch(self, db: Session, tenant_id: str, data: dict) -> Batch:
        obj = Batch(id=new_uuid(), tenant_id=tenant_id, **data)
        db.add(obj)
        db.flush()
        return obj

    def list_batch_students(
        self, db: Session, batch_id: str, tenant_id: str
    ) -> list[BatchStudent]:
        return (
            db.query(BatchStudent)
            .filter(
                BatchStudent.batch_id == batch_id,
                BatchStudent.tenant_id == tenant_id,
                BatchStudent.status == "active",
            )
            .all()
        )

    def get_active_batch_student(
        self, db: Session, batch_id: str, student_id: str, tenant_id: str
    ) -> Optional[BatchStudent]:
        return (
            db.query(BatchStudent)
            .filter(
                BatchStudent.batch_id == batch_id,
                BatchStudent.student_id == student_id,
                BatchStudent.tenant_id == tenant_id,
                BatchStudent.status == "active",
            )
            .first()
        )

    def get_batch_student_any(
        self, db: Session, batch_id: str, student_id: str, tenant_id: str
    ) -> Optional[BatchStudent]:
        return (
            db.query(BatchStudent)
            .filter(
                BatchStudent.batch_id == batch_id,
                BatchStudent.student_id == student_id,
                BatchStudent.tenant_id == tenant_id,
            )
            .first()
        )

    def add_batch_student(
        self,
        db: Session,
        tenant_id: str,
        batch_id: str,
        student_id: str,
        added_by: Optional[str],
    ) -> BatchStudent:
        existing = self.get_batch_student_any(db, batch_id, student_id, tenant_id)
        if existing:
            existing.status = "active"
            existing.added_by = added_by
            db.flush()
            return existing
        row = BatchStudent(
            id=new_uuid(),
            tenant_id=tenant_id,
            batch_id=batch_id,
            student_id=student_id,
            added_by=added_by,
            status="active",
        )
        db.add(row)
        db.flush()
        return row
