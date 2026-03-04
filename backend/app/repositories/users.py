from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from typing import List, Optional

import uuid

from app.models.users import Users


class UserRepository:
    
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_email(self, email: str) -> Users | None:
        result = await self.session.execute(
            select(Users).where(Users.email == email)
        )
        return result.scalar_one_or_none()
    
    async def get_by_tin(self, tin: str) -> Users | None:
        result = await self.session.execute(
            select(Users).where(Users.tin == tin)
        )
        return result.scalar_one_or_none()

    async def create(self, full_name: str, email: str, hashed_password: str, tin: str, phone_number: str) -> Users:
        activation_code = str(uuid.uuid4())
        user = Users(
            full_name=full_name, 
            email=email, 
            password=hashed_password, 
            tin=tin, 
            activation_code=activation_code,
            phone_number=phone_number
            )
        self.session.add(user)
        await self.session.commit()
        await self.session.refresh(user)
        return user
    
    async def get_by_id(self, user_id: int) -> Optional[Users]:
        return await self.session.get(Users, user_id)

    async def list_users(self, skip: int = 0, limit: int = 100) -> List[Users]:
        result = await self.session.execute(
            select(Users).offset(skip).limit(limit)
        )
        return result.scalars().all()
    
    async def activate_user(self, activation_code: str) -> bool:
        res = await self.session.execute(select(Users).where(Users.activation_code == activation_code))
        user = res.scalar_one_or_none()
        if not user:
            return False
        user.is_active = True
        user.activation_code = None
        await self.session.commit()
        return True
    