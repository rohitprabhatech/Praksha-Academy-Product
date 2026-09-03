"""Common API response schemas."""

from typing import Any, Generic, Optional, TypeVar

from pydantic import BaseModel, Field

T = TypeVar("T")


class SuccessResponse(BaseModel, Generic[T]):
    """Standard success envelope."""

    success: bool = True
    message: str = "OK"
    data: Optional[T] = None


class ErrorResponse(BaseModel):
    """Standard error envelope."""

    success: bool = False
    message: str
    errors: dict[str, Any] = Field(default_factory=dict)


class HealthData(BaseModel):
    """Health check payload."""

    status: str
    app: str
    environment: str
    version: str
    database: str


class PaginationMeta(BaseModel):
    """Pagination metadata for list endpoints (used from Sprint 04+)."""

    page: int = Field(ge=1)
    page_size: int = Field(ge=1, le=100)
    total_items: int = Field(ge=0)
    total_pages: int = Field(ge=0)
