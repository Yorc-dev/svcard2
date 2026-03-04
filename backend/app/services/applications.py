from sqlalchemy.ext.asyncio import AsyncSession

from fastapi import Depends

from app.repositories.applications import ApplicationRepository
from app.models.applications import Application
from app.schemas.applications import ApplicationCreateSchema, ApplicationReadSchema
from app.i18n.i18n import t, get_locale

class ApplicationService:
    def __init__(self, session: AsyncSession):
        self.repository = ApplicationRepository(session=session)

    async def create_application(self, data: ApplicationCreateSchema) -> Application:
        application = Application(
            first_name=data.first_name,
            phone_number=data.phone_number,
        )
        return await self.repository.create_application(application)
    
    async def read_applications(self) -> list[Application]:
        return await self.repository.read_application()
