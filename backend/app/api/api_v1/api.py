from fastapi import APIRouter
from app.api.api_v1.endpoints import auth, habits

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(habits.router, prefix="/habits", tags=["habits"])

