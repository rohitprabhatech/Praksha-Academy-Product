"""RBAC tables: roles, permissions, role_permissions."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlalchemy import Boolean, DateTime, Enum, String, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.mixins import TimestampMixin, uuid_fk, uuid_pk


class Role(TimestampMixin, Base):
    __tablename__ = "roles"
    __table_args__ = (UniqueConstraint("scope", "code", name="uk_roles_scope_code"),)

    id: Mapped[str] = uuid_pk()
    scope: Mapped[str] = mapped_column(
        Enum("platform", "tenant", name="role_scope", native_enum=True),
        nullable=False,
    )
    code: Mapped[str] = mapped_column(String(50), nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    is_system: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default="0")


class Permission(TimestampMixin, Base):
    __tablename__ = "permissions"
    __table_args__ = (UniqueConstraint("scope", "code", name="uk_permissions_scope_code"),)

    id: Mapped[str] = uuid_pk()
    scope: Mapped[str] = mapped_column(
        Enum("platform", "tenant", name="permission_scope", native_enum=True),
        nullable=False,
    )
    code: Mapped[str] = mapped_column(String(100), nullable=False)
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    module: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    description: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)


class RolePermission(Base):
    __tablename__ = "role_permissions"

    role_id: Mapped[str] = uuid_fk("roles.id", ondelete="CASCADE", primary_key=True)
    permission_id: Mapped[str] = uuid_fk(
        "permissions.id", ondelete="CASCADE", primary_key=True, index=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False),
        nullable=False,
        server_default=func.current_timestamp(),
    )
