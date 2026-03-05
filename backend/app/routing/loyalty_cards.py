from fastapi import APIRouter, Depends
from typing import List, Annotated

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.core.deps import get_current_user
from app.models.users import Users
from app.repositories.loyalty_cards import LoyaltyCardRepository
from app.repositories.organizations import OrganizationRepository
from app.services.loyalty_cards import LoyaltyCardService
from app.schemas.loyalty_cards import LoyaltyCardRead
from app.i18n.i18n import get_locale

router = APIRouter(prefix="/loyalty-cards", tags=["loyalty_cards"])


def get_card_service(session: AsyncSession = Depends(get_db)) -> LoyaltyCardService:
    card_repo = LoyaltyCardRepository(session)
    org_repo = OrganizationRepository(session)
    return LoyaltyCardService(card_repo, org_repo)


@router.get("/list", response_model=List[LoyaltyCardRead])
async def list_loyalty_cards(
    locale: Annotated[str, Depends(get_locale)],
    current_user: Users = Depends(get_current_user),
    service: LoyaltyCardService = Depends(get_card_service),
):
    return await service.list_cards_for_user(current_user.id, locale)
