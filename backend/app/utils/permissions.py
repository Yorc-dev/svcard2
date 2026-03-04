from fastapi import Depends, HTTPException, status
from app.core.deps import get_current_user
from app.models.users import Users
from app.utils.choices import RoleChoices
from app.i18n.i18n import get_locale, t
from typing import Annotated

async def require_admin(
    locale: Annotated[str, Depends(get_locale)],
    current_user: Users = Depends(get_current_user)
):
    if current_user.role != RoleChoices.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=t("permissions.admin_required", locale)
        )
    return current_user

async def require_moderator(
    locale: Annotated[str, Depends(get_locale)],
    current_user: Users = Depends(get_current_user)
):
    if current_user.role != RoleChoices.MODERATOR:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=t("permissions.moderator_required", locale)
        )
    return current_user

async def require_moderator_or_admin(
    locale: Annotated[str, Depends(get_locale)],
    current_user: Users = Depends(get_current_user)
):
    if current_user.role not in (RoleChoices.MODERATOR, RoleChoices.ADMIN):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=t("permissions.moderator_or_admin_required", locale)
        )
    return current_user