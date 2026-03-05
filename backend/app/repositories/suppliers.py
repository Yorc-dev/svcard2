from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.models.suppliers import Supplier


class SupplierRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def list(self) -> List[Supplier]:
        result = await self.session.execute(select(Supplier))
        return result.scalars().all()

    async def get_by_id(self, supplier_id: int):
        return await self.session.get(Supplier, supplier_id)

    async def create(self, **kwargs) -> Supplier:
        supplier = Supplier(**kwargs)
        self.session.add(supplier)
        await self.session.commit()
        await self.session.refresh(supplier)
        return supplier
