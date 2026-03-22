from datetime import datetime, timezone
from sqlalchemy import String, Boolean, DateTime, Enum, Integer, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum

from app.core.database import Base


class ClubEnum(str, enum.Enum):
    ATLAS_INC = "Atlas INC"
    AGILE = "AGILE"
    STUDENT_COUNCIL = "Student Council"
    HIGHFLYERS = "Highflyers"
    FUTUREPRENEURS = "Futurepreneurs"
    FINTEREST = "Finterest"
    STAGE = "Stage"
    NSS = "NSS"


class EventStatus(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"


class Event(Base):
    __tablename__ = "events"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    club_name: Mapped[ClubEnum] = mapped_column(Enum(ClubEnum), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    event_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    
    status: Mapped[EventStatus] = mapped_column(
        Enum(EventStatus), default=EventStatus.PENDING, nullable=False
    )
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    
    submitted_by: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    
    # Optional relationship if we ever need to load the user directly
    # submitter = relationship("User")
