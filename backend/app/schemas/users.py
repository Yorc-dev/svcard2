from pydantic import BaseModel, EmailStr, field_validator

from typing import List, Optional

import re

from app.utils.choices import LegalStatusChoices, RoleChoices


class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    phone_number: str 
    password: str
    tin: str

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str):
        if len(value) < 8:
            raise ValueError("Password must be at least 8 characters long")

        if not re.search(r"[A-Z]", value):
            raise ValueError("Password must contain at least one uppercase letter")

        if not re.search(r"\d", value):
            raise ValueError("Password must contain at least one digit")

        return value


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class User(BaseModel):
    id: int
    full_name: Optional[str]
    email: EmailStr
    phone_number: str
    legal_status: Optional[LegalStatusChoices]
    is_active: bool
    role: Optional[RoleChoices]
