from sqlalchemy.orm import Mapped, mapped_column
from app.core.db import Base

class TokenBlacklist(Base):
    __tablename__ = "token_blacklist"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    token: Mapped[str] = mapped_column(unique=True, nullable=False)