from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.brandguard import VIConfig, PosterTemplate, GeneratedPoster
from app.schemas.brandguard import (
    VIConfigCreate, VIConfigUpdate, PosterTemplateCreate,
    GeneratePosterRequest, ComplianceCheckRequest
)


# 医疗广告违禁词库
PROHIBITED_WORDS = [
    "根治", "彻底治愈", "永久", "100%", "最好", "最佳", "第一", "唯一",
    "国家级", "最高技术", "最先进", "最新技术", "填补国内空白",
    "绝对", "保证", "包治", "速效", "特效", "全面", "安全", "无副作用",
    "无痛", "无创", "立竿见影", "药到病除", "一次见效", "永不复发",
    "祖传", "秘方", "偏方", "神医", "专家", "权威", "国际领先"
]


class BrandGuardService:
    """BrandGuard 业务逻辑服务"""

    @staticmethod
    async def get_vi_config(db: AsyncSession, user_id: int) -> VIConfig | None:
        """获取用户的 VI 配置"""
        result = await db.execute(
            select(VIConfig).where(VIConfig.user_id == user_id)
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def create_or_update_vi_config(
        db: AsyncSession, user_id: int, config_data: VIConfigCreate | VIConfigUpdate
    ) -> VIConfig:
        """创建或更新 VI 配置"""
        existing = await BrandGuardService.get_vi_config(db, user_id)

        if existing:
            for key, value in config_data.model_dump(exclude_unset=True).items():
                setattr(existing, key, value)
            await db.commit()
            await db.refresh(existing)
            return existing
        else:
            new_config = VIConfig(user_id=user_id, **config_data.model_dump())
            db.add(new_config)
            await db.commit()
            await db.refresh(new_config)
            return new_config

    @staticmethod
    async def get_templates(db: AsyncSession, user_id: int) -> list[PosterTemplate]:
        """获取用户的海报模板列表"""
        result = await db.execute(
            select(PosterTemplate).where(PosterTemplate.user_id == user_id)
        )
        return list(result.scalars().all())

    @staticmethod
    async def create_template(
        db: AsyncSession, user_id: int, template_data: PosterTemplateCreate
    ) -> PosterTemplate:
        """创建海报模板"""
        template = PosterTemplate(user_id=user_id, **template_data.model_dump())
        db.add(template)
        await db.commit()
        await db.refresh(template)
        return template

    @staticmethod
    async def generate_poster(
        db: AsyncSession, user_id: int, request: GeneratePosterRequest
    ) -> GeneratedPoster:
        """生成品牌海报（AI 生成占位）"""
        # TODO: 集成 AI 图像生成服务
        placeholder_url = f"https://placeholder.com/poster_{user_id}_{request.title}.png"

        # 违禁词检查
        compliance_issues = BrandGuardService.check_compliance_sync(request.content)

        poster = GeneratedPoster(
            user_id=user_id,
            template_id=request.template_id,
            title=request.title,
            content=request.content,
            image_url=placeholder_url,
            compliance_checked=True,
            compliance_issues=compliance_issues if compliance_issues else None
        )
        db.add(poster)
        await db.commit()
        await db.refresh(poster)
        return poster

    @staticmethod
    def check_compliance_sync(content: str) -> list[str]:
        """同步违禁词检查"""
        issues = []
        content_lower = content.lower()

        for word in PROHIBITED_WORDS:
            if word in content_lower or word.lower() in content_lower:
                issues.append(f"包含违禁词: {word}")

        return issues

    @staticmethod
    async def check_compliance(request: ComplianceCheckRequest) -> dict:
        """违禁词审查"""
        issues = BrandGuardService.check_compliance_sync(request.content)
        return {
            "is_compliant": len(issues) == 0,
            "issues": issues
        }

    @staticmethod
    async def get_posters(db: AsyncSession, user_id: int) -> list[GeneratedPoster]:
        """获取已生成海报列表"""
        result = await db.execute(
            select(GeneratedPoster)
            .where(GeneratedPoster.user_id == user_id)
            .order_by(GeneratedPoster.created_at.desc())
        )
        return list(result.scalars().all())
