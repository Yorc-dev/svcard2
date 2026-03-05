from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.models.loyalty_cards import LoyaltyCard


class LoyaltyCardRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def list_by_organization(self, organization_id: int) -> List[LoyaltyCard]:
        result = await self.session.execute(
            select(LoyaltyCard).where(LoyaltyCard.organization_id == organization_id)
        )
        return result.scalars().all()

    async def get_by_id(self, card_id: int):
        return await self.session.get(LoyaltyCard, card_id)

    async def create(self, **kwargs) -> LoyaltyCard:
        card = LoyaltyCard(**kwargs)
        self.session.add(card)
        await self.session.commit()
        await self.session.refresh(card)
        return card
