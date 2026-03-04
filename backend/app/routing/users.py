from fastapi import APIRouter, Depends, HTTPException, status

from typing import Annotated

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.repositories.users import UserRepository
from app.services.users import UserService
from app.schemas.users import UserRegister, UserLogin, TokenResponse, User
from app.core.deps import get_current_user
from app.models.users import Users
from app.utils.permissions import require_moderator_or_admin
from app.i18n.i18n import get_locale

router = APIRouter(prefix="/users", tags=["Auth"])

def get_user_service(session: AsyncSession = Depends(get_db)):
    repo = UserRepository(session)
    return UserService(repo)

@router.post("/register", response_model=TokenResponse)
async def register(
    user: UserRegister,
    locale: Annotated[str, Depends(get_locale)],
    service: UserService = Depends(get_user_service)
):
    token = await service.register(user.full_name, user.email, user.password, user.tin, user.phone_number, locale)
    return {"access_token": token}

@router.post("/login", response_model=TokenResponse)
async def login(
    user: UserLogin,
    locale: Annotated[str, Depends(get_locale)],
    service: UserService = Depends(get_user_service),
):
    token = await service.login(user.email, user.password, locale)
    return {"access_token": token}

@router.get("/me", response_model=User)
async def read_current_user(
    locale: Annotated[str, Depends(get_locale)],
    current_user: Users = Depends(get_current_user)
    ):
    return current_user

@router.get("/", response_model=list[User])
async def list_users(
    locale: Annotated[str, Depends(get_locale)],
    skip: int = 0,
    limit: int = 100,
    service: UserService = Depends(get_user_service),
    current_user: Users = Depends(get_current_user)
):
    return await service.list_users(skip=skip, limit=limit)

@router.get("/{user_id}", response_model=User)
async def get_user_detail(
    user_id: int,
    service: UserService = Depends(get_user_service),
    _: None = Depends(require_moderator_or_admin)
    # current_user: Users = Depends(get_current_user),
):
    try:
        user = await service.get_user(user_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

@router.get("/confirm/{code}")
async def confirm_user(activation_code: str, service: UserService = Depends(get_user_service)):
    success = await service.confirm_user(activation_code)
    if not success:
        raise HTTPException(status_code=400, detail="Invalid activation code")
    return {"detail": "User activated!"}


# тестово, переделать на норм архитектуру

from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends
from app.models.token_blacklist import TokenBlacklist

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")



@router.post("/logout")
async def logout(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
):
    blacklisted = TokenBlacklist(token=token)
    db.add(blacklisted)
    await db.commit()

    return {"message": "Successfully logged out"}