"""Shared utility helpers."""

import uuid


def generate_uuid() -> str:
    """Generate a UUID4 string for primary keys."""
    return str(uuid.uuid4())


def new_uuid() -> str:
    """Alias used by sprint services/repositories."""
    return generate_uuid()
