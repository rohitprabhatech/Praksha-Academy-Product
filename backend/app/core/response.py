"""Standard API response helpers and exception handlers."""

from typing import Any, Optional

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException


def success_response(
    data: Any = None,
    message: str = "OK",
    status_code: int = status.HTTP_200_OK,
) -> JSONResponse:
    """Return the project-standard success envelope."""
    return JSONResponse(
        status_code=status_code,
        content={
            "success": True,
            "message": message,
            "data": data,
        },
    )


def error_response(
    message: str,
    *,
    errors: Optional[dict[str, Any]] = None,
    status_code: int = status.HTTP_400_BAD_REQUEST,
) -> JSONResponse:
    """Return the project-standard error envelope."""
    return JSONResponse(
        status_code=status_code,
        content={
            "success": False,
            "message": message,
            "errors": errors or {},
        },
    )


def register_exception_handlers(app: FastAPI) -> None:
    """Attach global exception handlers that use the standard envelope."""

    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(
        request: Request,
        exc: StarletteHTTPException,
    ) -> JSONResponse:
        detail = exc.detail
        if isinstance(detail, dict):
            message = str(detail.get("message", "Request failed"))
            errors = detail.get("errors", {})
        else:
            message = str(detail)
            errors = {}
        return error_response(
            message=message,
            errors=errors if isinstance(errors, dict) else {},
            status_code=exc.status_code,
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request,
        exc: RequestValidationError,
    ) -> JSONResponse:
        field_errors: dict[str, Any] = {}
        for err in exc.errors():
            location = ".".join(str(part) for part in err.get("loc", []) if part != "body")
            field_errors[location or "body"] = err.get("msg", "Invalid value")
        return error_response(
            message="Validation failed",
            errors=field_errors,
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(
        request: Request,
        exc: Exception,
    ) -> JSONResponse:
        # Avoid leaking internals in production; debug message only in development.
        from app.core.config import get_settings

        settings = get_settings()
        message = "Internal server error"
        errors: dict[str, Any] = {}
        if settings.app_debug:
            errors["detail"] = str(exc)
        return error_response(
            message=message,
            errors=errors,
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
