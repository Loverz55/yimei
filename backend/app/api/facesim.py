from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.facesim import (
    ImageUploadResponse,
    SkinAnalysisCreate,
    SkinAnalysisResponse,
    SkinAnalysisResult,
    SimulationCreate,
    SimulationDetail,
    SimulationListResponse,
    SimulationListItem
)
from app.services.facesim import FaceSimService

router = APIRouter(prefix="/facesim", tags=["FaceSim 2D"])


# 临时：获取当前用户 ID（实际应从 JWT token 获取）
async def get_current_user_id() -> int:
    return 1  # TODO: 从认证中间件获取


@router.post("/upload", response_model=ImageUploadResponse)
async def upload_face_image(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """上传面部照片并进行质检"""
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="只支持图片文件"
        )

    image = await FaceSimService.upload_image(db, user_id, file)
    return image


@router.post("/analyze", response_model=SkinAnalysisResponse)
async def analyze_skin_issues(
    data: SkinAnalysisCreate,
    db: AsyncSession = Depends(get_db)
):
    """分析面部皮肤问题"""
    try:
        analyses = await FaceSimService.analyze_skin(
            db, data.image_id, data.issue_types
        )
        return SkinAnalysisResponse(
            image_id=data.image_id,
            analyses=[SkinAnalysisResult.model_validate(a) for a in analyses]
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.post("/simulate", response_model=SimulationDetail)
async def create_simulation(
    data: SimulationCreate,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """生成模拟效果图"""
    try:
        simulation = await FaceSimService.create_simulation(
            db, user_id, data.analysis_id, data.treatment_type, data.intensity
        )
        return simulation
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.get("/simulations", response_model=SimulationListResponse)
async def get_simulations(
    skip: int = 0,
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """获取模拟记录列表"""
    simulations, total = await FaceSimService.get_simulations(
        db, user_id, skip, limit
    )
    return SimulationListResponse(
        total=total,
        items=[SimulationListItem.model_validate(s) for s in simulations]
    )


@router.get("/simulations/{simulation_id}", response_model=SimulationDetail)
async def get_simulation_detail(
    simulation_id: int,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """获取单个模拟详情"""
    simulation = await FaceSimService.get_simulation_detail(
        db, simulation_id, user_id
    )
    if not simulation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="模拟记录不存在"
        )
    return simulation
