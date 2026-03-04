from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.applications import Application


class ApplicationRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_application(self, application: Application) -> Application:
        self.session.add(application)
        await self.session.commit()
        await self.session.refresh(application)
        return application
    
    async def read_application(self) -> list[Application]:
        stmt = select(Application)
        res = await self.session.execute(stmt)
        return res.scalars().all()
    
    