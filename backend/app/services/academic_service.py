"""Academic classes / subjects / batches business logic."""

from __future__ import annotations

from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import utcnow_naive
from app.repositories.academic_repository import AcademicRepository
from app.repositories.owner_repository import OwnerRepository
from app.schemas.owner import (
    BatchCreate,
    BatchUpdate,
    ClassCreate,
    ClassUpdate,
    SubjectCreate,
    SubjectUpdate,
)

academic_repo = AcademicRepository()
owner_repo = OwnerRepository()


class AcademicService:
    def _require_tenant(self, tenant_id: Optional[str]) -> str:
        if not tenant_id:
            raise HTTPException(
                status.HTTP_403_FORBIDDEN,
                detail="Tenant context required",
            )
        return tenant_id

    def _class_to_dict(self, obj) -> dict:
        return {
            "id": obj.id,
            "name": obj.name,
            "code": obj.code,
            "description": obj.description,
            "sort_order": obj.sort_order,
            "status": obj.status,
        }

    def _subject_to_dict(self, obj) -> dict:
        return {
            "id": obj.id,
            "name": obj.name,
            "code": obj.code,
            "description": obj.description,
            "status": obj.status,
        }

    def _batch_to_dict(self, obj) -> dict:
        return {
            "id": obj.id,
            "name": obj.name,
            "code": obj.code,
            "academic_class_id": obj.academic_class_id,
            "course_id": obj.course_id,
            "start_date": str(obj.start_date) if obj.start_date else None,
            "end_date": str(obj.end_date) if obj.end_date else None,
            "max_students": obj.max_students,
            "status": obj.status,
        }

    # ─── CLASSES ──────────────────────────────────────────────────────────────

    def list_classes(self, db: Session, tenant_id: Optional[str]) -> list[dict]:
        tid = self._require_tenant(tenant_id)
        return [self._class_to_dict(c) for c in academic_repo.list_classes(db, tid)]

    def create_class(
        self, db: Session, tenant_id: Optional[str], data: ClassCreate, actor_id: str
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        payload = data.model_dump()
        payload["created_by"] = actor_id
        obj = academic_repo.create_class(db, tid, payload)
        db.commit()
        return self._class_to_dict(obj)

    def update_class(
        self,
        db: Session,
        class_id: str,
        tenant_id: Optional[str],
        data: ClassUpdate,
        actor_id: str,
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        obj = academic_repo.get_class(db, class_id, tid)
        if not obj:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Class not found")
        updates = data.model_dump(exclude_none=True)
        if "status" in updates and updates["status"] not in {"active", "inactive"}:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Invalid status")
        for key, value in updates.items():
            setattr(obj, key, value)
        obj.updated_by = actor_id
        db.commit()
        return self._class_to_dict(obj)

    def delete_class(
        self, db: Session, class_id: str, tenant_id: Optional[str]
    ) -> None:
        tid = self._require_tenant(tenant_id)
        obj = academic_repo.get_class(db, class_id, tid)
        if not obj:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Class not found")
        obj.deleted_at = utcnow_naive()
        db.commit()

    # ─── SUBJECTS ─────────────────────────────────────────────────────────────

    def list_subjects(self, db: Session, tenant_id: Optional[str]) -> list[dict]:
        tid = self._require_tenant(tenant_id)
        return [self._subject_to_dict(s) for s in academic_repo.list_subjects(db, tid)]

    def create_subject(
        self, db: Session, tenant_id: Optional[str], data: SubjectCreate, actor_id: str
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        payload = data.model_dump()
        payload["created_by"] = actor_id
        obj = academic_repo.create_subject(db, tid, payload)
        db.commit()
        return self._subject_to_dict(obj)

    def update_subject(
        self,
        db: Session,
        subject_id: str,
        tenant_id: Optional[str],
        data: SubjectUpdate,
        actor_id: str,
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        obj = academic_repo.get_subject(db, subject_id, tid)
        if not obj:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Subject not found")
        updates = data.model_dump(exclude_none=True)
        if "status" in updates and updates["status"] not in {"active", "inactive"}:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Invalid status")
        for key, value in updates.items():
            setattr(obj, key, value)
        obj.updated_by = actor_id
        db.commit()
        return self._subject_to_dict(obj)

    def delete_subject(
        self, db: Session, subject_id: str, tenant_id: Optional[str]
    ) -> None:
        tid = self._require_tenant(tenant_id)
        obj = academic_repo.get_subject(db, subject_id, tid)
        if not obj:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Subject not found")
        obj.deleted_at = utcnow_naive()
        db.commit()

    # ─── BATCHES ──────────────────────────────────────────────────────────────

    def list_batches(self, db: Session, tenant_id: Optional[str]) -> list[dict]:
        tid = self._require_tenant(tenant_id)
        return [self._batch_to_dict(b) for b in academic_repo.list_batches(db, tid)]

    def create_batch(
        self, db: Session, tenant_id: Optional[str], data: BatchCreate, actor_id: str
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        if not academic_repo.get_class(db, data.academic_class_id, tid):
            raise HTTPException(
                status.HTTP_404_NOT_FOUND,
                detail="Academic class not found",
            )
        payload = data.model_dump()
        payload["created_by"] = actor_id
        obj = academic_repo.create_batch(db, tid, payload)
        db.commit()
        return self._batch_to_dict(obj)

    def update_batch(
        self,
        db: Session,
        batch_id: str,
        tenant_id: Optional[str],
        data: BatchUpdate,
        actor_id: str,
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        obj = academic_repo.get_batch(db, batch_id, tid)
        if not obj:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Batch not found")
        updates = data.model_dump(exclude_none=True)
        if "status" in updates and updates["status"] not in {
            "active",
            "inactive",
            "completed",
        }:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Invalid status")
        for key, value in updates.items():
            setattr(obj, key, value)
        obj.updated_by = actor_id
        db.commit()
        return self._batch_to_dict(obj)

    def delete_batch(
        self, db: Session, batch_id: str, tenant_id: Optional[str]
    ) -> None:
        tid = self._require_tenant(tenant_id)
        obj = academic_repo.get_batch(db, batch_id, tid)
        if not obj:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Batch not found")
        obj.deleted_at = utcnow_naive()
        db.commit()

    def list_batch_students(
        self, db: Session, batch_id: str, tenant_id: Optional[str]
    ) -> list[dict]:
        tid = self._require_tenant(tenant_id)
        if not academic_repo.get_batch(db, batch_id, tid):
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Batch not found")
        rows = academic_repo.list_batch_students(db, batch_id, tid)
        return [
            {
                "id": row.id,
                "batch_id": row.batch_id,
                "student_id": row.student_id,
                "status": row.status,
                "joined_at": str(row.joined_at) if row.joined_at else None,
            }
            for row in rows
        ]

    def add_student_to_batch(
        self,
        db: Session,
        batch_id: str,
        student_id: str,
        tenant_id: Optional[str],
        added_by: str,
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        if not academic_repo.get_batch(db, batch_id, tid):
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Batch not found")
        if not owner_repo.get_student(db, student_id, tid):
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Student not found")
        if academic_repo.get_active_batch_student(db, batch_id, student_id, tid):
            raise HTTPException(
                status.HTTP_409_CONFLICT,
                detail="Student is already in this batch",
            )
        row = academic_repo.add_batch_student(db, tid, batch_id, student_id, added_by)
        db.commit()
        return {
            "batch_id": row.batch_id,
            "student_id": row.student_id,
            "status": row.status,
        }

    def remove_student_from_batch(
        self,
        db: Session,
        batch_id: str,
        student_id: str,
        tenant_id: Optional[str],
    ) -> None:
        tid = self._require_tenant(tenant_id)
        row = academic_repo.get_active_batch_student(db, batch_id, student_id, tid)
        if not row:
            raise HTTPException(
                status.HTTP_404_NOT_FOUND,
                detail="Student not found in this batch",
            )
        row.status = "removed"
        db.commit()
