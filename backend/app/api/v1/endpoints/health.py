"""Health check endpoints."""

from fastapi import APIRouter, status
from fastapi.responses import JSONResponse

from app import __version__
from app.core.config import get_settings
from app.core.database import check_database_connection
from app.core.response import success_response
from app.schemas.common import HealthData

router = APIRouter(tags=["Health"])


@router.get(
    "/health",
    summary="Application health check",
    response_description="Service and database status",
)
def health_check() -> JSONResponse:
    """Return application health and optional database connectivity."""
    settings = get_settings()
    database_ok = check_database_connection()

    payload = HealthData(
        status="ok" if database_ok else "degraded",
        app=settings.app_name,
        environment=settings.app_env,
        version=__version__,
        database="up" if database_ok else "down",
    )

    # App is reachable even when DB is down; report degraded with 200
    # so load balancers can still probe the process during Sprint 01.
    return success_response(
        data=payload.model_dump(),
        message="Health check completed",
        status_code=status.HTTP_200_OK,
    )


@router.get(
    "/ready",
    summary="Readiness probe",
    response_description="Ready only when database is reachable",
)
def readiness_check() -> JSONResponse:
    """Return ready when the database connection succeeds."""
    settings = get_settings()
    database_ok = check_database_connection()

    if not database_ok:
        from app.core.response import error_response

        return error_response(
            message="Database is not ready",
            errors={"database": "down"},
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        )

    payload = HealthData(
        status="ok",
        app=settings.app_name,
        environment=settings.app_env,
        version=__version__,
        database="up",
    )
    return success_response(
        data=payload.model_dump(),
        message="Service is ready",
    )
