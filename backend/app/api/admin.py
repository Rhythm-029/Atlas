from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from datetime import datetime, timezone

from app.core.database import get_db
from app.core.dependencies import get_current_user, require_role
from app.core.config import settings
from app.models.user import User, UserStatus
from app.models.audit import AuditLog
from app.schemas.user_schema import UserResponse, UserApprovalRequest
from app.services.audit import audit

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/users", response_model=list[UserResponse])
async def get_all_users(
    current_user: User = Depends(require_role("ADMIN")),
    db: AsyncSession = Depends(get_db),
):
    """Get all users (admin only)."""
    result = await db.execute(select(User).order_by(desc(User.created_at)))
    users = result.scalars().all()
    return users


@router.get("/users/pending", response_model=list[UserResponse])
async def get_pending_users(
    current_user: User = Depends(require_role("ADMIN")),
    db: AsyncSession = Depends(get_db),
):
    """Get all pending users awaiting approval."""
    result = await db.execute(
        select(User)
        .where(User.status == UserStatus.PENDING)
        .order_by(desc(User.created_at))
    )
    users = result.scalars().all()
    return users


@router.post("/users/{user_id}/approve")
async def approve_user(
    user_id: int,
    request: Request,
    current_user: User = Depends(require_role("ADMIN")),
    db: AsyncSession = Depends(get_db),
):
    """Approve a pending user."""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if user.status != UserStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"User is already {user.status.value.lower()}"
        )
    
    user.status = UserStatus.APPROVED
    user.is_active = True
    user.approved_at = datetime.now(timezone.utc)
    user.approved_by = current_user.id
    
    await db.commit()
    
    await audit.log_user_action(
        db=db,
        action="user.approve",
        actor=current_user,
        ip_address=request.client.host if request.client else None,
        target_user_id=user.id,
        target_user_email=user.email,
    )
    
    return {"message": f"User {user.email} approved successfully"}


@router.post("/users/{user_id}/reject")
async def reject_user(
    user_id: int,
    request: Request,
    current_user: User = Depends(require_role("ADMIN")),
    db: AsyncSession = Depends(get_db),
):
    """Reject a pending user."""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if user.status != UserStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"User is already {user.status.value.lower()}"
        )
    
    user.status = UserStatus.REJECTED
    user.is_active = False
    
    await db.commit()
    
    await audit.log_user_action(
        db=db,
        action="user.reject",
        actor=current_user,
        ip_address=request.client.host if request.client else None,
        target_user_id=user.id,
        target_user_email=user.email,
    )
    
    return {"message": f"User {user.email} rejected successfully"}


@router.get("/audit")
async def get_audit_logs(
    limit: int = 100,
    offset: int = 0,
    current_user: User = Depends(require_role("ADMIN")),
    db: AsyncSession = Depends(get_db),
):
    """Get audit logs (admin only)."""
    result = await db.execute(
        select(AuditLog)
        .order_by(desc(AuditLog.timestamp))
        .limit(limit)
        .offset(offset)
    )
    logs = result.scalars().all()
    
    return {
        "logs": [
            {
                "id": log.id,
                "user_id": log.user_id,
                "action": log.action,
                "ip_address": log.ip_address,
                "details": log.details,
                "timestamp": log.timestamp.isoformat(),
            }
            for log in logs
        ],
        "limit": limit,
        "offset": offset,
    }


@router.get("/audit/export")
async def export_audit_logs(
    current_user: User = Depends(require_role("ADMIN")),
    db: AsyncSession = Depends(get_db),
):
    """Export all audit logs as JSON."""
    result = await db.execute(
        select(AuditLog).order_by(desc(AuditLog.timestamp))
    )
    logs = result.scalars().all()
    
    return {
        "exported_at": datetime.now(timezone.utc).isoformat(),
        "exported_by": current_user.email,
        "total_logs": len(logs),
        "logs": [
            {
                "id": log.id,
                "user_id": log.user_id,
                "action": log.action,
                "ip_address": log.ip_address,
                "details": log.details,
                "timestamp": log.timestamp.isoformat(),
            }
            for log in logs
        ],
    }
