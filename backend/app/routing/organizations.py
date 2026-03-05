from fastapi import APIRouter, Depends
from typing import Annotated

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.core.deps import get_current_user
from app.models.users import Users
from app.repositories.organizations import OrganizationRepository
from app.services.organizations import OrganizationService
from app.schemas.organizations import OrganizationRead, OrganizationUpdate
from app.i18n.i18n import get_locale

router = APIRouter(prefix="/organizations", tags=["organizations"])


def get_org_service(session: AsyncSession = Depends(get_db)) -> OrganizationService:
    repo = OrganizationRepository(session)
    return OrganizationService(repo)


@router.get("/me", response_model=OrganizationRead)
async def get_my_organization(
    locale: Annotated[str, Depends(get_locale)],
    current_user: Users = Depends(get_current_user),
    service: OrganizationService = Depends(get_org_service),
):
    return await service.get_my_organization(current_user.id, locale)


@router.put("/me", response_model=OrganizationRead)
async def update_my_organization(
    data: OrganizationUpdate,
    locale: Annotated[str, Depends(get_locale)],
    current_user: Users = Depends(get_current_user),
    service: OrganizationService = Depends(get_org_service),
):
    return await service.update_organization(current_user.id, data, locale)


@router.patch("/me", response_model=OrganizationRead)
async def patch_my_organization(
    data: OrganizationUpdate,
    locale: Annotated[str, Depends(get_locale)],
    current_user: Users = Depends(get_current_user),
    service: OrganizationService = Depends(get_org_service),
):
    return await service.update_organization(current_user.id, data, locale)
