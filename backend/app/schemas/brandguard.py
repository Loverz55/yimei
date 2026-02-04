from datetime import datetime
from pydantic import BaseModel, Field


class VIConfigBase(BaseModel):
    brand_name: str = Field(..., max_length=100)
    primary_color: str = Field(default="#00A0E9", pattern="^#[0-9A-Fa-f]{6}$")
    secondary_color: str = Field(default="#FFFFFF", pattern="^#[0-9A-Fa-f]{6}$")
    accent_color: str = Field(default="#F2F2F2", pattern="^#[0-9A-Fa-f]{6}$")
    logo_url: str | None = None
    font_family: str = Field(default="PingFang SC", max_length=100)


class VIConfigCreate(VIConfigBase):
    pass


class VIConfigUpdate(BaseModel):
    brand_name: str | None = None
    primary_color: str | None = Field(None, pattern="^#[0-9A-Fa-f]{6}$")
    secondary_color: str | None = Field(None, pattern="^#[0-9A-Fa-f]{6}$")
    accent_color: str | None = Field(None, pattern="^#[0-9A-Fa-f]{6}$")
    logo_url: str | None = None
    font_family: str | None = None


class VIConfigResponse(VIConfigBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PosterTemplateBase(BaseModel):
    name: str = Field(..., max_length=100)
    description: str | None = None
    layout_config: dict
    width: int = Field(default=1080, ge=100, le=4096)
    height: int = Field(default=1920, ge=100, le=4096)
    thumbnail_url: str | None = None


class PosterTemplateCreate(PosterTemplateBase):
    pass


class PosterTemplateResponse(PosterTemplateBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class GeneratePosterRequest(BaseModel):
    template_id: int | None = None
    title: str = Field(..., max_length=200)
    content: str
    custom_config: dict | None = None


class GeneratedPosterResponse(BaseModel):
    id: int
    user_id: int
    template_id: int | None
    title: str
    content: str
    image_url: str
    compliance_checked: bool
    compliance_issues: list | None
    created_at: datetime

    class Config:
        from_attributes = True


class ComplianceCheckRequest(BaseModel):
    content: str


class ComplianceCheckResponse(BaseModel):
    is_compliant: bool
    issues: list[str]
