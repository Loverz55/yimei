import os
import uuid
from pathlib import Path
from datetime import datetime
from fastapi import UploadFile
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.facesim import (
    FaceImage, SkinAnalysis, Simulation,
    ImageQualityStatus, SkinIssueType, SimulationStatus
)

# 配置
UPLOAD_DIR = Path("uploads/facesim")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


class FaceSimService:
    """FaceSim 业务逻辑服务"""

    @staticmethod
    async def upload_image(db: AsyncSession, user_id: int, file: UploadFile) -> FaceImage:
        """上传并质检图片"""
        # 保存文件
        file_ext = Path(file.filename).suffix
        filename = f"{uuid.uuid4()}{file_ext}"
        file_path = UPLOAD_DIR / filename

        content = await file.read()
        with open(file_path, "wb") as f:
            f.write(content)

        # 质检（占位实现）
        quality_result = await FaceSimService._check_image_quality(str(file_path))

        # 创建记录
        image = FaceImage(
            user_id=user_id,
            file_path=str(file_path),
            quality_status=quality_result["status"],
            quality_score=quality_result["score"],
            quality_issues=quality_result["issues"]
        )
        db.add(image)
        await db.commit()
        await db.refresh(image)
        return image

    @staticmethod
    async def _check_image_quality(file_path: str) -> dict:
        """图片质检（AI 占位）"""
        # TODO: 集成真实 AI 质检模型
        return {
            "status": ImageQualityStatus.PASSED,
            "score": 0.92,
            "issues": {
                "brightness": "good",
                "blur": "none",
                "face_detected": True
            }
        }

    @staticmethod
    async def analyze_skin(
        db: AsyncSession,
        image_id: int,
        issue_types: list[SkinIssueType]
    ) -> list[SkinAnalysis]:
        """分析皮肤问题"""
        # 获取图片
        result = await db.execute(select(FaceImage).where(FaceImage.id == image_id))
        image = result.scalar_one_or_none()
        if not image:
            raise ValueError("图片不存在")

        # AI 分析（占位实现）
        analysis_results = await FaceSimService._detect_skin_issues(
            image.file_path, issue_types
        )

        # 保存分析结果
        analyses = []
        for result in analysis_results:
            analysis = SkinAnalysis(
                image_id=image_id,
                issue_type=result["issue_type"],
                severity=result["severity"],
                detected_areas=result["areas"],
                confidence=result["confidence"]
            )
            db.add(analysis)
            analyses.append(analysis)

        await db.commit()
        for analysis in analyses:
            await db.refresh(analysis)
        return analyses

    @staticmethod
    async def _detect_skin_issues(
        file_path: str,
        issue_types: list[SkinIssueType]
    ) -> list[dict]:
        """检测皮肤问题（AI 占位）"""
        # TODO: 集成真实 AI 检测模型
        results = []
        for issue_type in issue_types:
            results.append({
                "issue_type": issue_type,
                "severity": 6,
                "areas": {
                    "regions": [
                        {"x": 100, "y": 150, "width": 50, "height": 50},
                        {"x": 200, "y": 180, "width": 40, "height": 40}
                    ]
                },
                "confidence": 0.87
            })
        return results

    @staticmethod
    async def create_simulation(
        db: AsyncSession,
        user_id: int,
        analysis_id: int,
        treatment_type: str,
        intensity: int
    ) -> Simulation:
        """生成模拟效果图"""
        # 获取分析结果
        result = await db.execute(
            select(SkinAnalysis)
            .options(selectinload(SkinAnalysis.image))
            .where(SkinAnalysis.id == analysis_id)
        )
        analysis = result.scalar_one_or_none()
        if not analysis:
            raise ValueError("分析结果不存在")

        # 创建模拟记录
        simulation = Simulation(
            analysis_id=analysis_id,
            user_id=user_id,
            treatment_type=treatment_type,
            simulated_image_path="",  # 先占位
            status=SimulationStatus.PROCESSING,
            parameters={"intensity": intensity}
        )
        db.add(simulation)
        await db.commit()
        await db.refresh(simulation)

        # 生成模拟图（占位实现）
        simulated_path = await FaceSimService._generate_simulation(
            analysis.image.file_path,
            analysis.issue_type,
            intensity
        )

        # 生成对比图
        comparison_path = await FaceSimService._generate_comparison(
            analysis.image.file_path,
            simulated_path
        )

        # 更新记录
        simulation.simulated_image_path = simulated_path
        simulation.comparison_image_path = comparison_path
        simulation.status = SimulationStatus.COMPLETED
        simulation.completed_at = datetime.utcnow()
        await db.commit()
        await db.refresh(simulation)

        return simulation

    @staticmethod
    async def _generate_simulation(
        original_path: str,
        issue_type: SkinIssueType,
        intensity: int
    ) -> str:
        """生成模拟效果图（AI 占位）"""
        # TODO: 集成真实 AI 模拟模型
        filename = f"sim_{uuid.uuid4()}.jpg"
        output_path = UPLOAD_DIR / filename

        # 占位：复制原图
        import shutil
        shutil.copy(original_path, output_path)

        return str(output_path)

    @staticmethod
    async def _generate_comparison(original_path: str, simulated_path: str) -> str:
        """生成对比图（带水印和免责声明）"""
        # TODO: 使用 PIL 生成真实对比图
        filename = f"comp_{uuid.uuid4()}.jpg"
        output_path = UPLOAD_DIR / filename

        # 占位：复制模拟图
        import shutil
        shutil.copy(simulated_path, output_path)

        return str(output_path)

    @staticmethod
    async def get_simulations(
        db: AsyncSession,
        user_id: int,
        skip: int = 0,
        limit: int = 20
    ) -> tuple[list[Simulation], int]:
        """获取模拟记录列表"""
        # 查询总数
        count_result = await db.execute(
            select(Simulation).where(Simulation.user_id == user_id)
        )
        total = len(count_result.all())

        # 查询列表
        result = await db.execute(
            select(Simulation)
            .where(Simulation.user_id == user_id)
            .order_by(Simulation.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        simulations = result.scalars().all()

        return list(simulations), total

    @staticmethod
    async def get_simulation_detail(
        db: AsyncSession,
        simulation_id: int,
        user_id: int
    ) -> Simulation | None:
        """获取模拟详情"""
        result = await db.execute(
            select(Simulation)
            .options(selectinload(Simulation.analysis))
            .where(
                Simulation.id == simulation_id,
                Simulation.user_id == user_id
            )
        )
        return result.scalar_one_or_none()
