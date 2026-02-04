from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.brandguard import (
    VIConfigCreate, VIConfigUpdate, VIConfigResponse,
    PosterTemplateCreate, PosterTemplateResponse,
    GeneratePosterRequest, GeneratedPosterResponse,
    ComplianceCheckRequest, ComplianceCheckResponse
)
from app.services.brandguard import BrandGuardService

router = APIRouter(prefix="/brandguard", tags=["brandguard"])


# 临时用户 ID（实际应从认证中间件获取）
def get_current_user_id() -> int:
    return 1


@router.get("/vi-config", response_model=VIConfigResponse | None)
async def get_vi_config(
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """获取 VI 配置"""
    return await BrandGuardService.get_vi_config(db, user_id)


@router.put("/vi-config", response_model=VIConfigResponse)
async def update_vi_config(
    config: VIConfigUpdate,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """更新 VI 配置"""
    return await BrandGuardService.create_or_update_vi_config(db, user_id, config)


@router.post("/vi-config", response_model=VIConfigResponse)
async def create_vi_config(
    config: VIConfigCreate,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """创建 VI 配置"""
    return await BrandGuardService.create_or_update_vi_config(db, user_id, config)


@router.get("/templates", response_model=list[PosterTemplateResponse])
async def get_templates(
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """获取海报模板列表"""
    return await BrandGuardService.get_templates(db, user_id)


@router.post("/templates", response_model=PosterTemplateResponse)
async def create_template(
    template: PosterTemplateCreate,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """创建海报模板"""
    return await BrandGuardService.create_template(db, user_id, template)


@router.post("/generate", response_model=GeneratedPosterResponse)
async def generate_poster(
    request: GeneratePosterRequest,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """生成品牌海报"""
    return await BrandGuardService.generate_poster(db, user_id, request)


@router.post("/check-compliance", response_model=ComplianceCheckResponse)
async def check_compliance(request: ComplianceCheckRequest):
    """违禁词审查"""
    result = await BrandGuardService.check_compliance(request)
    return result


@router.get("/posters", response_model=list[GeneratedPosterResponse])
async def get_posters(
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """获取已生成海报列表"""
    return await BrandGuardService.get_posters(db, user_id)
