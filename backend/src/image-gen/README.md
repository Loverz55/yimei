# 图像生成模块 (Image Generation)

## 概述

图像生成模块为医美平台提供AI驱动的图片生成和编辑功能，支持多家AI服务提供商（Stability AI、OpenAI DALL-E等），可灵活切换。

## 主要功能

### 1. 文生图 (Text-to-Image)
用户输入文字描述，AI生成对应的海报或图片。

### 2. 图片局部修改 (Inpainting)
用户圈选图片不满意的区域，输入修改描述，AI仅修改圈选部分。

## 架构设计

```
┌─────────────────────────────────────────┐
│   ImageGenController (REST API)         │
│   - POST /api/image-gen/generate        │
│   - POST /api/image-gen/inpaint         │
│   - GET  /api/image-gen/history         │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│   ImageGenService                       │
│   - Provider管理                         │
│   - 自动选择可用Provider                  │
│   - 文件上传与数据库记录                   │
└──────────────┬──────────────────────────┘
               │
       ┌───────┼───────┐
       ▼       ▼       ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│Stability │ │  OpenAI  │ │  Aliyun  │
│ Provider │ │ Provider │ │ Provider │
└──────────┘ └──────────┘ └──────────┘
```

## API 接口

### 1. 生成图片

**POST** `/api/image-gen/generate`

**请求体：**
```json
{
  "prompt": "一张医美诊所的宣传海报，现代简约风格，粉色和白色配色",
  "negativePrompt": "模糊，低质量，变形",
  "provider": "auto",  // 可选：auto, stability, openai, aliyun
  "width": 1024,
  "height": 1024,
  "aspectRatio": "1:1",  // 可选：1:1, 16:9, 9:16, 4:3, 3:4
  "steps": 30,
  "cfgScale": 7,
  "samples": 1
}
```

**响应：**
```json
{
  "code": 0,
  "msg": "图片生成成功",
  "data": {
    "id": 123,
    "imageUrl": "https://...",
    "provider": "stability",
    "model": "stable-diffusion-xl-1024-v1-0",
    "createdAt": "2026-02-04T..."
  }
}
```

### 2. 图片局部修改

**POST** `/api/image-gen/inpaint`

**请求体：**
```json
{
  "imageId": 456,          // 原始图片的文件ID
  "maskId": 457,           // 遮罩图片的文件ID（白色=修改区域）
  "prompt": "将这个区域改成绿色植物背景",
  "negativePrompt": "模糊，低质量",
  "provider": "auto",
  "steps": 30,
  "cfgScale": 7
}
```

**响应：** 与生成图片接口相同

### 3. 获取生成历史

**GET** `/api/image-gen/history?limit=20&offset=0`

**响应：**
```json
{
  "code": 0,
  "msg": "获取历史记录成功",
  "data": [
    {
      "id": 123,
      "prompt": "...",
      "provider": "stability",
      "status": "completed",
      "file": {
        "id": 789,
        "key": "generated/2026/2/xxx.png",
        "contentType": "image/png"
      },
      "createdAt": "2026-02-04T..."
    }
  ]
}
```

### 4. 获取单个记录详情

**GET** `/api/image-gen/:id`

## 环境配置

在 `.env` 文件中添加以下配置：

```bash
# Stability AI（推荐，效果好且价格合理）
STABILITY_API_KEY="sk-xxx"
STABILITY_BASE_URL="https://api.stability.ai"

# OpenAI DALL-E（效果最好但价格较高）
OPENAI_API_KEY="sk-xxx"
OPENAI_BASE_URL="https://api.openai.com/v1"

# 阿里云通义万相（国内访问稳定）
ALIYUN_API_KEY="sk-xxx"
ALIYUN_BASE_URL="https://dashscope.aliyuncs.com/api/v1"
```

**注意：** 至少配置一个Provider的API Key，系统会自动选择可用的服务。

## Provider 对比

| 服务商 | 优势 | 劣势 | 价格 | 支持Inpainting |
|--------|------|------|------|----------------|
| **Stability AI** | 开源模型，可控性强，价格合理 | 需要科学上网 | ~$0.02/张 | ✅ 支持 |
| **OpenAI DALL-E** | 图像质量最高，简单易用 | 价格较高，可控性一般 | ~$0.04-0.08/张 | ✅ 支持（仅DALL-E 2） |
| **阿里云通义万相** | 国内访问稳定，无需科学上网 | 内容审核严格 | ~¥0.1/张 | 🚧 待集成 |

## 数据库表

### ImageGeneration 表

```prisma
model ImageGeneration {
  id              Int      @id @default(autoincrement())
  userId          Int
  fileId          Int
  prompt          String   @db.Text
  negativePrompt  String?  @db.Text
  provider        String   // stability/openai/aliyun
  model           String?
  parameters      Json?
  metadata        Json?
  cost            Float?
  status          String   @default("pending")
  type            String   @default("text2img")  // text2img/inpaint
  sourceImageId   Int?     // inpaint时的原始图片
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

## 添加新的 Provider

1. 在 `src/image-gen/providers/` 创建新文件，如 `aliyun.provider.ts`
2. 继承 `BaseImageProvider` 抽象类
3. 实现 `generateImage` 和 `inpaint` 方法
4. 在 `image-gen.module.ts` 中注册：

```typescript
import { AliyunProvider } from './providers/aliyun.provider';

@Module({
  providers: [
    ImageGenService,
    StabilityProvider,
    OpenAIProvider,
    AliyunProvider,  // 添加新Provider
  ],
})
export class ImageGenModule {
  constructor(
    private readonly imageGenService: ImageGenService,
    private readonly aliyunProvider: AliyunProvider,
  ) {
    this.imageGenService.registerProvider(this.aliyunProvider);
  }
}
```

## 测试建议

### 1. 测试文生图功能

```bash
curl -X POST http://localhost:8000/api/image-gen/generate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "一张简约的医美海报，白色背景",
    "provider": "stability",
    "width": 1024,
    "height": 1024
  }'
```

### 2. 测试自动Provider选择

将 `provider` 设为 `"auto"`，系统会自动选择第一个可用的服务。

## 性能优化建议

1. **异步处理：** 对于耗时的图片生成，建议实现任务队列（如 Bull）
2. **缓存策略：** 相同prompt的结果可以缓存
3. **成本控制：** 记录每次生成的成本，设置用户配额
4. **图片CDN：** 生成的图片建议使用CDN加速访问

## 安全注意事项

1. **API Key 保护：** 永远不要将API Key提交到Git仓库
2. **内容审核：** 添加prompt内容审核，避免生成违规内容
3. **频率限制：** 限制单用户的生成频率，防止滥用
4. **权限控制：** 确保用户只能访问自己的生成记录

## 下一步计划

- [ ] 实现阿里云通义万相 Provider
- [ ] 添加任务队列处理长时间生成
- [ ] 实现Prompt优化（Prompt Engineering）
- [ ] 添加风格模板库
- [ ] 支持批量生成
- [ ] 添加LoRA微调模型支持
