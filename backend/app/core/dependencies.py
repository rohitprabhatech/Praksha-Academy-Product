"""Shared FastAPI dependencies (Sprint 01 stubs)."""

from collections.abc import Generator
from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.config import Settings, get_settings
from app.core.database import get_db

DbSession = Annotated[Session, Depends(get_db)]
AppSettings = Annotated[Settings, Depends(get_settings)]


def get_settings_dependency() -> Generator[Settings, None, None]:
    """Yield application settings (explicit dependency helper)."""
    yield get_settings()
