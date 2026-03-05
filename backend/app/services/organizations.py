from fastapi import HTTPException, status
from typing import Optional

from app.repositories.organizations import OrganizationRepository
from app.models.organizations import Organization
from app.schemas.organizations import OrganizationCreate, OrganizationUpdate
from app.i18n.i18n import t


class OrganizationService:
    def __init__(self, repository: OrganizationRepository):
        self.repository = repository

    async def get_my_organization(self, user_id: int, locale: str) -> Organization:
        org = await self.repository.get_by_user_id(user_id)
        if not org:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=t("errors.not_found", locale),
            )
        return org

    async def update_organization(
        self,
        user_id: int,
        data: OrganizationUpdate,
        locale: str,
    ) -> Organization:
        org = await self.repository.get_by_user_id(user_id)
        if not org:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=t("errors.not_found", locale),
            )
        update_data = data.model_dump(exclude_unset=True)
        return await self.repository.update(org, update_data)
