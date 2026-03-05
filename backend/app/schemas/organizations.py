from pydantic import BaseModel
from typing import Optional
from decimal import Decimal
from datetime import datetime


class OrganizationBase(BaseModel):
    name: str
    inn: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_person: Optional[str] = None
    discount: Optional[Decimal] = None
    is_active: Optional[bool] = None


class OrganizationCreate(OrganizationBase):
    name: str


class OrganizationUpdate(BaseModel):
    name: Optional[str] = None
    inn: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_person: Optional[str] = None
    discount: Optional[Decimal] = None
    is_active: Optional[bool] = None


class OrganizationRead(BaseModel):
    id: int
    user_id: int
    name: str
    inn: Optional[str]
    contact_phone: Optional[str]
    contact_person: Optional[str]
    discount: Optional[Decimal]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
