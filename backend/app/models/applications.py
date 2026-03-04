from sqlalchemy.orm import Mapped, mapped_column

from sqlalchemy import Integer, String

from datetime import datetime, timezone

from app.core.db import Base


class Application(Base):
    __tablename__ = "applications"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    first_name: Mapped[str] = mapped_column(nullable=False)
    phone_number: Mapped[str] = mapped_column(
        String(30),
        nullable=False
    )
