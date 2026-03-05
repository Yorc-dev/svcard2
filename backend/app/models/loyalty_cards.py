from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Numeric, ForeignKey
from datetime import datetime, timezone

from app.core.db import Base
from app.utils.choices import LoyaltyCardStatus


class LoyaltyCard(Base):
    __tablename__ = "loyalty_cards"

    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    supplier_id: Mapped[int] = mapped_column(ForeignKey("suppliers.id"), nullable=False)
    organization_id: Mapped[int] = mapped_column(ForeignKey("organizations.id"), nullable=False)
    card_number: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    balance: Mapped[float] = mapped_column(Numeric(12, 2), default=0.0, server_default="0.00")
    status: Mapped[LoyaltyCardStatus] = mapped_column(default=LoyaltyCardStatus.ACTIVE)
    created_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(timezone.utc))
    assigned_at: Mapped[datetime] = mapped_column(nullable=True)

    supplier = relationship("Supplier", back_populates="loyalty_cards")
    organization = relationship("Organization", back_populates="loyalty_cards")
