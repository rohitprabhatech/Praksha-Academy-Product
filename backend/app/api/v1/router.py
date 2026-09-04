"""API v1 router aggregation."""

from fastapi import APIRouter

from app.api.v1 import auth
from app.api.v1.endpoints import health
from app.api.v1.platform import platform_router

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(auth.router)
api_router.include_router(platform_router)
