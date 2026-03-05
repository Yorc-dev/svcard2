from typing import List

from app.repositories.suppliers import SupplierRepository
from app.models.suppliers import Supplier


class SupplierService:
    def __init__(self, repository: SupplierRepository):
        self.repository = repository

    async def list_suppliers(self) -> List[Supplier]:
        return await self.repository.list()
