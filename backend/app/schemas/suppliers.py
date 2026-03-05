from pydantic import BaseModel
from typing import Optional
from decimal import Decimal


class SupplierRead(BaseModel):
    id: int
    name: str
    contract_number: Optional[str]
    discount: Optional[Decimal]

    class Config:
        from_attributes = True


class SupplierCreate(BaseModel):
    name: str
    contract_number: Optional[str] = None
    discount: Optional[Decimal] = None


class SupplierUpdate(BaseModel):
    name: Optional[str] = None
    contract_number: Optional[str] = None
    discount: Optional[Decimal] = None
