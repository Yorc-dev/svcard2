from sqlalchemy.orm import Mapped, mapped_column, relationship

from sqlalchemy import Integer, String

from app.core.db import Base
from app.utils.choices import LegalStatusChoices, RoleChoices


class Users(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    full_name: Mapped[str] = mapped_column(nullable=True)
    email: Mapped[str] = mapped_column(
        String(250),
        unique=True,
        nullable=False
    )
    phone_number: Mapped[str] = mapped_column(
        String(30),
        nullable=True
    )
    tin: Mapped[str] = mapped_column(
        String(20),
        unique=True,
        nullable=True
    )
    legal_status: Mapped[LegalStatusChoices] = mapped_column(nullable=True)
    is_active: Mapped[bool] = mapped_column(default=False)
    role: Mapped[RoleChoices] = mapped_column(default="user")
    password: Mapped[str] = mapped_column(nullable=False)
    activation_code: Mapped[str] = mapped_column(String(100), nullable=True)

    organization = relationship("Organization", back_populates="user", uselist=False)
