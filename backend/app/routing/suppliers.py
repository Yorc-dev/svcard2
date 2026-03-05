from fastapi import APIRouter, Depends
from typing import List, Annotated

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.core.deps import get_current_user
from app.models.users import Users
from app.repositories.suppliers import SupplierRepository
from app.services.suppliers import SupplierService
from app.schemas.suppliers import SupplierRead
from app.i18n.i18n import get_locale

router = APIRouter(prefix="/suppliers", tags=["suppliers"])


def get_supplier_service(session: AsyncSession = Depends(get_db)) -> SupplierService:
    repo = SupplierRepository(session)
    return SupplierService(repo)


@router.get("/list", response_model=List[SupplierRead])
async def list_suppliers(
    locale: Annotated[str, Depends(get_locale)],
    current_user: Users = Depends(get_current_user),
    service: SupplierService = Depends(get_supplier_service),
):
    return await service.list_suppliers()
