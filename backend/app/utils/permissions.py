from fastapi import Depends, HTTPException, status
from app.services.users import UserService
from app.core.deps import get_current_user
from app.utils.choices import RoleChoices

def require_admin(current_user=Depends(get_current_user)):
    if current_user.role != RoleChoices.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    return current_user

def require_moderator(current_user=Depends(get_current_user)):
    if current_user.role != RoleChoices.MODERATOR:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Moderator privileges required"
        )
    return current_user

def require_moderator_or_admin(current_user=Depends(get_current_user)):
    if current_user.role not in (RoleChoices.MODERATOR, RoleChoices.ADMIN):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Moderator or Admin privileges required"
        )
    return current_user