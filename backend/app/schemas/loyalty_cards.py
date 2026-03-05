from pydantic import BaseModel
from typing import Optional
from decimal import Decimal
from datetime import datetime

from app.utils.choices import LoyaltyCardStatus


class LoyaltyCardRead(BaseModel):
    id: int
    supplier_id: int
    organization_id: int
    card_number: str
    balance: Optional[Decimal]
    status: LoyaltyCardStatus
    created_at: datetime
    assigned_at: Optional[datetime]

    class Config:
        from_attributes = True


class LoyaltyCardCreate(BaseModel):
    supplier_id: int
    organization_id: int
    card_number: str
    balance: Optional[Decimal] = None
    status: Optional[LoyaltyCardStatus] = LoyaltyCardStatus.ACTIVE
    assigned_at: Optional[datetime] = None


class LoyaltyCardUpdate(BaseModel):
    card_number: Optional[str] = None
    balance: Optional[Decimal] = None
    status: Optional[LoyaltyCardStatus] = None
    assigned_at: Optional[datetime] = None
