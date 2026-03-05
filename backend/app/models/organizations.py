from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Numeric, ForeignKey
from datetime import datetime, timezone

from app.core.db import Base


class Organization(Base):
    __tablename__ = "organizations"

    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(250), nullable=False)
    inn: Mapped[str] = mapped_column(String(20), unique=True, nullable=True)
    contact_phone: Mapped[str] = mapped_column(String(30), nullable=True)
    contact_person: Mapped[str] = mapped_column(String(250), nullable=True)
    discount: Mapped[float] = mapped_column(Numeric(5, 2), default=1.0, server_default="1.00")
    is_active: Mapped[bool] = mapped_column(default=True, server_default="true")
    created_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(timezone.utc))

    user = relationship("Users", back_populates="organization")
    loyalty_cards = relationship("LoyaltyCard", back_populates="organization")
