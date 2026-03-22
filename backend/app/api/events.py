from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timedelta, timezone

from app.core.database import get_db
from app.core.dependencies import get_current_user, get_optional_user
from app.models.user import User, UserRole
from app.models.event import Event, EventStatus
from app.schemas.event_schema import EventCreate, EventResponse, EventUpdateStatus

router = APIRouter(prefix="/events", tags=["events"])

def _get_mock_user_if_none(user: User | None) -> User:
    if user:
        return user
    # Provide a mock admin user if no token is passed (open access mode)
    return User(id=1, email="admin_mock@atlas.local", role=UserRole.ADMIN, is_active=True)

@router.post("/", response_model=EventResponse, status_code=status.HTTP_201_CREATED)
async def create_event(
    event_in: EventCreate,
    db: AsyncSession = Depends(get_db),
    optional_user: User | None = Depends(get_optional_user),
):
    current_user = _get_mock_user_if_none(optional_user)
    # Check for future date
    if event_in.event_date.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Event date must be in the future.",
        )

    # Simple clash check: no events within 4 hours of another event at the same club/campus
    # To keep it simple, let's just warn or prevent if ANY event is within 2 hours of this date
    time_window_start = event_in.event_date - timedelta(hours=2)
    time_window_end = event_in.event_date + timedelta(hours=2)
    
    clash_query = select(Event).where(
        Event.status == EventStatus.APPROVED,
        Event.event_date >= time_window_start,
        Event.event_date <= time_window_end,
    )
    result = await db.execute(clash_query)
    clashing_event = result.scalar_one_or_none()
    
    if clashing_event:
         raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Date clash: There is an already approved event ('{clashing_event.name}') near this time.",
        )

    new_event = Event(
        **event_in.model_dump(),
        submitted_by=current_user.id,
        status=EventStatus.PENDING
    )
    db.add(new_event)
    await db.commit()
    await db.refresh(new_event)
    return new_event


@router.get("/", response_model=list[EventResponse])
async def get_events(
    status_filter: EventStatus | None = None,
    db: AsyncSession = Depends(get_db),
    optional_user: User | None = Depends(get_optional_user),
):
    current_user = _get_mock_user_if_none(optional_user)
    query = select(Event)
    
    if status_filter:
        query = query.where(Event.status == status_filter)
        
    # Order by event date ascending
    query = query.order_by(Event.event_date.asc())
    
    result = await db.execute(query)
    events = result.scalars().all()
    return events


@router.patch("/{event_id}/status", response_model=EventResponse)
async def update_event_status(
    event_id: int,
    status_update: EventUpdateStatus,
    db: AsyncSession = Depends(get_db),
    optional_user: User | None = Depends(get_optional_user),
):
    current_user = _get_mock_user_if_none(optional_user)
    # Only allow Admin (Faculty role) to approve/reject
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only faculty/admins can approve or reject events.",
        )

    result = await db.execute(select(Event).where(Event.id == event_id))
    event = result.scalar_one_or_none()
    
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    event.status = status_update.status
    await db.commit()
    await db.refresh(event)
    return event
