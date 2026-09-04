"""Owner — academic classes."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_role
from app.core.response import success_response
from app.schemas.owner import ClassCreate, ClassUpdate
from app.services.academic_service import AcademicService

router = APIRouter(prefix="/owner/classes", tags=["Owner — Classes"])
service = AcademicService()


@router.get("")
def list_classes(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    return success_response(
        data=service.list_classes(db, current_user.get("tenant_id"))
    )


@router.post("")
def create_class(
    body: ClassCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = service.create_class(
        db, current_user.get("tenant_id"), body, current_user["sub"]
    )
    return success_response(data=data, message="Class created")


@router.put("/{class_id}")
def update_class(
    class_id: str,
    body: ClassUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = service.update_class(
        db, class_id, current_user.get("tenant_id"), body, current_user["sub"]
    )
    return success_response(data=data, message="Class updated")


@router.delete("/{class_id}")
def delete_class(
    class_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    service.delete_class(db, class_id, current_user.get("tenant_id"))
    return success_response(message="Class deleted")
