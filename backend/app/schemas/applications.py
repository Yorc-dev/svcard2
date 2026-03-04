from pydantic import BaseModel, EmailStr
from pydantic_extra_types.phone_numbers import PhoneNumber


class ApplicationReadSchema(BaseModel):
    id: int
    first_name: str
    phone_number: PhoneNumber

    class Config:
        from_attributes = True


class ApplicationCreateSchema(BaseModel):
    first_name: str
    phone_number: PhoneNumber
