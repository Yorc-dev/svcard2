from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Numeric

from app.core.db import Base


class Supplier(Base):
    __tablename__ = "suppliers"

    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(250), nullable=False)
    contract_number: Mapped[str] = mapped_column(String(100), nullable=True)
    discount: Mapped[float] = mapped_column(Numeric(5, 2), default=0.0, server_default="0.00", nullable=True)

    loyalty_cards = relationship("LoyaltyCard", back_populates="supplier")
