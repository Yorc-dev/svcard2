from fastapi import HTTPException, status
from typing import List

from app.repositories.loyalty_cards import LoyaltyCardRepository
from app.repositories.organizations import OrganizationRepository
from app.models.loyalty_cards import LoyaltyCard
from app.i18n.i18n import t


class LoyaltyCardService:
    def __init__(
        self,
        card_repository: LoyaltyCardRepository,
        org_repository: OrganizationRepository,
    ):
        self.card_repository = card_repository
        self.org_repository = org_repository

    async def list_cards_for_user(self, user_id: int, locale: str) -> List[LoyaltyCard]:
        org = await self.org_repository.get_by_user_id(user_id)
        if not org:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=t("errors.not_found", locale),
            )
        return await self.card_repository.list_by_organization(org.id)
