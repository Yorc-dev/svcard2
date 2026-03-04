from fastapi import HTTPException, status

from typing import List

from app.repositories.users import UserRepository
from app.utils.jwt import hash_password, verify_password, create_access_token
from app.utils.email import send_activation_email
from app.models.users import Users
from app.i18n.i18n import t

class UserService:

    def __init__(self, repository: UserRepository):
        self.repository = repository

    async def register(
            self, 
            full_name: str, 
            email: str, 
            password: str, 
            tin: str, 
            phone_number: str,
            locale: str,
            ):
        existing_user = await self.repository.get_by_email(email)
        existing_tin = await self.repository.get_by_tin(tin)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=t("auth.email_exists", locale)
            )
        if existing_tin:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=t("auth.tin_exists", locale)
            )

        hashed = hash_password(password)
        user = await self.repository.create(full_name, email, hashed, tin, phone_number)
        # await send_activation_email(user.email, user.activation_code)
        token = create_access_token({"sub": user.email})
        return token
    
    async def confirm_user(self, activation_code: str) -> bool:
        return await self.repository.activate_user(activation_code)

    async def login(
            self, 
            email: str, 
            password: str,
            locale: str,
            ):
        user = await self.repository.get_by_email(email)
        if not user or not verify_password(password, user.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=t("auth.invalid_credentials", locale)
            )

        token = create_access_token({"sub": user.email})
        return token
    

    async def get_user(
        self, 
        user_id: int,
        locale: str,
        ) -> Users:
        user = await self.repository.get_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=t("errors.user_not_found", locale)
                )
        return user

    async def list_users(self, skip: int = 0, limit: int = 100) -> List[Users]:
        return await self.repository.list_users(skip=skip, limit=limit)