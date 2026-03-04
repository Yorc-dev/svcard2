from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer

from typing import Annotated

from jose import jwt, JWTError

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.repositories.users import UserRepository
from app.utils.jwt import SECRET_KEY, ALGORITHM
from app.i18n.i18n import get_locale, t

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

async def get_current_user(
    locale: Annotated[str, Depends(get_locale)],
    token: str = Depends(oauth2_scheme),
    
    session: AsyncSession = Depends(get_db)
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=401, detail=t("auth.invalid_token", locale))

    repo = UserRepository(session)
    user = await repo.get_by_email(email)
    if not user:
        raise HTTPException(status_code=401, detail=t("errors.user_not_found", locale))

    return user