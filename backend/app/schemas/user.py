from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
from app.models.user import UserRole


class UserBase(BaseModel):
    """用户基础 Schema"""
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    role: UserRole


class UserCreate(UserBase):
    """用户创建 Schema"""
    password: str = Field(..., min_length=6)


class UserResponse(UserBase):
    """用户响应 Schema"""
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    """Token 响应"""
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Token 数据"""
    user_id: int | None = None
    role: UserRole | None = None
