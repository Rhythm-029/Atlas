from pydantic import BaseModel, Field
from datetime import datetime
from app.models.event import ClubEnum, EventStatus

class EventBase(BaseModel):
    name: str = Field(..., max_length=255)
    club_name: ClubEnum
    description: str
    event_date: datetime

class EventCreate(EventBase):
    pass

class EventUpdateStatus(BaseModel):
    status: EventStatus

class EventResponse(EventBase):
    id: int
    status: EventStatus
    submitted_by: int
    created_at: datetime

    class Config:
        from_attributes = True
