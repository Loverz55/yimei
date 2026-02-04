from datetime import datetime
from enum import Enum
from sqlalchemy import String, DateTime, Integer, Text, ForeignKey, Enum as SQLEnum, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class ImageQualityStatus(str, Enum):
    """图片质量状态"""
    PENDING = "pending"  # 待检测
    PASSED = "passed"  # 通过
    FAILED = "failed"  # 不合格


class SkinIssueType(str, Enum):
    """皮肤问题类型"""
    ACNE = "acne"  # 痘痘
    SPOT = "spot"  # 斑点
    WRINKLE = "wrinkle"  # 皱纹
    PORE = "pore"  # 毛孔


class SimulationStatus(str, Enum):
    """模拟状态"""
    PROCESSING = "processing"  # 处理中
    COMPLETED = "completed"  # 完成
    FAILED = "failed"  # 失败


class FaceImage(Base):
    """面部图片模型"""
    __tablename__ = "face_images"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    file_path: Mapped[str] = mapped_column(String(500))
    quality_status: Mapped[ImageQualityStatus] = mapped_column(
        SQLEnum(ImageQualityStatus), default=ImageQualityStatus.PENDING
    )
    quality_score: Mapped[float | None] = mapped_column(default=None)
    quality_issues: Mapped[dict | None] = mapped_column(JSON, default=None)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # 关系
    analyses: Mapped[list["SkinAnalysis"]] = relationship(back_populates="image", cascade="all, delete-orphan")


class SkinAnalysis(Base):
    """皮肤分析结果模型"""
    __tablename__ = "skin_analyses"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    image_id: Mapped[int] = mapped_column(ForeignKey("face_images.id"), index=True)
    issue_type: Mapped[SkinIssueType] = mapped_column(SQLEnum(SkinIssueType))
    severity: Mapped[int] = mapped_column(Integer)  # 严重程度 1-10
    detected_areas: Mapped[dict] = mapped_column(JSON)  # 检测区域坐标
    confidence: Mapped[float] = mapped_column()  # 置信度
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # 关系
    image: Mapped["FaceImage"] = relationship(back_populates="analyses")
    simulations: Mapped[list["Simulation"]] = relationship(back_populates="analysis", cascade="all, delete-orphan")


class Simulation(Base):
    """模拟效果记录模型"""
    __tablename__ = "simulations"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    analysis_id: Mapped[int] = mapped_column(ForeignKey("skin_analyses.id"), index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    treatment_type: Mapped[str] = mapped_column(String(100))  # 治疗类型
    simulated_image_path: Mapped[str] = mapped_column(String(500))
    comparison_image_path: Mapped[str | None] = mapped_column(String(500), default=None)
    status: Mapped[SimulationStatus] = mapped_column(
        SQLEnum(SimulationStatus), default=SimulationStatus.PROCESSING
    )
    parameters: Mapped[dict | None] = mapped_column(JSON, default=None)  # 模拟参数
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime, default=None)

    # 关系
    analysis: Mapped["SkinAnalysis"] = relationship(back_populates="simulations")
