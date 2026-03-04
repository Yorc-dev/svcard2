from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.services.applications import ApplicationService
from app.schemas.applications import ApplicationCreateSchema, ApplicationReadSchema
from app.utils.permissions import require_moderator_or_admin


router = APIRouter(prefix="/applications", tags=["applications"])

@router.post("/create", response_model=ApplicationCreateSchema)
async def create_application(
    data: ApplicationCreateSchema,
    session: AsyncSession = Depends(get_db),
):
    service = ApplicationService(session)
    return await service.create_application(data)


@router.get("/list", response_model=list[ApplicationReadSchema])
async def read_applications(session: AsyncSession = Depends(get_db),
                            _: None = Depends(require_moderator_or_admin)
):
    service = ApplicationService(session)
    return await service.read_applications()