from datetime import datetime
from pydantic import BaseModel, Field
from app.models.facesim import ImageQualityStatus, SkinIssueType, SimulationStatus


# 图片上传
class ImageUploadResponse(BaseModel):
    id: int
    file_path: str
    quality_status: ImageQualityStatus
    quality_score: float | None = None
    quality_issues: dict | None = None
    created_at: datetime

    class Config:
        from_attributes = True


# 皮肤分析
class SkinAnalysisCreate(BaseModel):
    image_id: int
    issue_types: list[SkinIssueType] = Field(default_factory=lambda: [SkinIssueType.ACNE, SkinIssueType.SPOT])


class SkinAnalysisResult(BaseModel):
    id: int
    image_id: int
    issue_type: SkinIssueType
    severity: int
    detected_areas: dict
    confidence: float
    created_at: datetime

    class Config:
        from_attributes = True


class SkinAnalysisResponse(BaseModel):
    image_id: int
    analyses: list[SkinAnalysisResult]


# 模拟效果
class SimulationCreate(BaseModel):
    analysis_id: int
    treatment_type: str = Field(..., description="治疗类型，如：祛痘、祛斑")
    intensity: int = Field(default=5, ge=1, le=10, description="强度 1-10")


class SimulationDetail(BaseModel):
    id: int
    analysis_id: int
    user_id: int
    treatment_type: str
    simulated_image_path: str
    comparison_image_path: str | None
    status: SimulationStatus
    parameters: dict | None
    created_at: datetime
    completed_at: datetime | None

    class Config:
        from_attributes = True


class SimulationListItem(BaseModel):
    id: int
    treatment_type: str
    status: SimulationStatus
    created_at: datetime
    completed_at: datetime | None

    class Config:
        from_attributes = True


class SimulationListResponse(BaseModel):
    total: int
    items: list[SimulationListItem]
