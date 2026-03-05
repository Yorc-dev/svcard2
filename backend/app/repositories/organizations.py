from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional

from app.models.organizations import Organization


class OrganizationRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_user_id(self, user_id: int) -> Optional[Organization]:
        result = await self.session.execute(
            select(Organization).where(Organization.user_id == user_id)
        )
        return result.scalar_one_or_none()

    async def get_by_id(self, org_id: int) -> Optional[Organization]:
        return await self.session.get(Organization, org_id)

    async def create(self, user_id: int, **kwargs) -> Organization:
        org = Organization(user_id=user_id, **kwargs)
        self.session.add(org)
        await self.session.commit()
        await self.session.refresh(org)
        return org

    async def update(self, org: Organization, data: dict) -> Organization:
        for key, value in data.items():
            setattr(org, key, value)
        await self.session.commit()
        await self.session.refresh(org)
        return org
