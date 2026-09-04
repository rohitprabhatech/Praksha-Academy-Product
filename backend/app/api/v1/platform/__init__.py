"""Platform admin API routers."""

from fastapi import APIRouter

from app.api.v1.platform import audit, plans, settings, tenants

platform_router = APIRouter()
platform_router.include_router(tenants.router)
platform_router.include_router(plans.router)
platform_router.include_router(settings.router)
platform_router.include_router(audit.router)
