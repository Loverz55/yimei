# 图像生成模块 - 数据库配置方式

## ✅ 已完成的重构

我们已经将AI Provider的配置从环境变量改为**数据库存储**，实现了：
- ✅ 动态添加/删除 AI服务配置
- ✅ 支持多个相同类型的Provider（比如多个Stability账号）
- ✅ 运行时切换，无需重启服务
- ✅ 基于优先级自动选择Provider

## 架构变化

### 之前（环境变量方式）
```env
STABILITY_API_KEY="sk-xxx"
OPENAI_API_KEY="sk-xxx"
```
- ❌ 硬编码在环境变量
- ❌ 每个类型只能配置一个
- ❌ 修改需要重启服务

### 现在（数据库方式）
```sql
AiModelConfig 表
├── id (配置ID)
├── name (配置名称)
├── provider (类型: stability/openai/aliyun)
├── apiKey (API密钥)
├── enabled (是否启用)
├── priority (优先级，数字越大越优先)
└── ...
```
- ✅ 存储在数据库
- ✅ 支持多个配置
- ✅ 运行时动态切换

## 使用流程

### 1. 初始化数据库

```bash
cd backend

# 更新数据库结构
pnpm run dbpush

# 插入示例配置（可选，也可以通过API添加）
psql $DATABASE_URL < seed-providers.sql
```

### 2. 添加Provider配置

#### 方式1：直接SQL插入
```sql
INSERT INTO "AiModelConfig" (
  "name",
  "provider",
  "type",
  "modelId",
  "baseUrl",
  "apiKey",
  "enabled",
  "priority",
  "description",
  "createdAt",
  "updatedAt"
) VALUES (
  'Stability AI - 主账号',
  'stability',
  'image-gen',
  'stable-diffusion-xl-1024-v1-0',
  'https://api.stability.ai',
  'sk-你的API Key',
  true,
  100,
  'Stability AI SDXL 1.0模型',
  NOW(),
  NOW()
);
```

#### 方式2：通过数据库管理工具
使用 Prisma Studio:
```bash
pnpm run dbstudio
```

#### 方式3：未来的管理API（待实现）
```bash
POST /api/ai-model-config
```

### 3. 启动服务

```bash
pnpm run start:dev
```

服务启动时会自动从数据库加载所有 `enabled=true` 的配置。

### 4. 调用图片生成API

#### 自动选择Provider（推荐）
```json
POST /api/image-gen/generate
{
  "prompt": "一张医美海报",
  "provider": "auto"  // 自动选择优先级最高的可用Provider
}
```

#### 指定Provider类型
```json
{
  "prompt": "一张医美海报",
  "provider": "stability"  // 使用stability类型的第一个可用配置
}
```

#### 指定具体配置ID（最精确）
```json
{
  "prompt": "一张医美海报",
  "configId": 1  // 使用ID为1的配置
}
```

### 5. 查看可用Providers

```bash
GET /api/image-gen/providers/list
```

响应：
```json
{
  "code": 0,
  "data": [
    {
      "id": 1,
      "name": "Stability AI - 主账号",
      "provider": "stability",
      "modelId": "stable-diffusion-xl-1024-v1-0",
      "description": "...",
      "priority": 100
    },
    {
      "id": 2,
      "name": "OpenAI DALL-E 3",
      "provider": "openai",
      "modelId": "dall-e-3",
      "priority": 50
    }
  ]
}
```

### 6. 动态更新配置

修改数据库后，重新加载配置：
```bash
POST /api/image-gen/providers/reload
```

响应：
```json
{
  "code": 0,
  "msg": "Provider配置已重新加载，当前2个可用",
  "data": { "success": true, "count": 2 }
}
```

## Provider优先级规则

系统按以下顺序选择Provider：

1. **用户指定configId** → 直接使用该配置
2. **用户指定provider类型** → 使用该类型的第一个可用配置
3. **auto自动选择** → 按优先级（priority）从高到低尝试，返回第一个验证成功的

## 数据库表结构

```prisma
model AiModelConfig {
  id          Int      @id @default(autoincrement())
  name        String   // 配置名称，如 "Stability AI - 主账号"
  provider    String   // provider类型: stability, openai, aliyun
  type        String   @default("image-gen") // 服务类型: image-gen, text-gen, embedding
  modelId     String?  // 具体模型ID
  baseUrl     String   // API基础URL
  apiKey      String   // API密钥
  config      Json?    // 额外配置（JSON格式）
  enabled     Boolean  @default(true) // 是否启用
  priority    Int      @default(0) // 优先级，数字越大优先级越高
  description String?  // 描述信息
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([provider, type, enabled])
  @@index([enabled, priority])
}
```

## 常见场景

### 场景1：添加第二个Stability账号

```sql
INSERT INTO "AiModelConfig" (
  "name", "provider", "type", "baseUrl", "apiKey", "enabled", "priority"
) VALUES (
  'Stability AI - 备用账号',
  'stability',
  'image-gen',
  'https://api.stability.ai',
  'sk-backup-key',
  true,
  90  -- 优先级低于主账号
);
```

### 场景2：启用DALL-E作为备选

```sql
UPDATE "AiModelConfig"
SET "enabled" = true, "priority" = 80
WHERE "provider" = 'openai';
```

### 场景3：禁用某个配置

```sql
UPDATE "AiModelConfig"
SET "enabled" = false
WHERE "id" = 1;
```

然后调用 `POST /api/image-gen/providers/reload` 生效。

### 场景4：调整优先级

```sql
-- 让OpenAI优先级最高
UPDATE "AiModelConfig"
SET "priority" = 200
WHERE "provider" = 'openai';
```

## 监控和日志

查看服务日志，可以看到Provider加载情况：

```
[ImageGenService] Loading image generation providers from database...
[ImageGenService] Loaded provider: stability (ID: 1, Name: Stability AI - 主账号)
[ImageGenService] Loaded provider: openai (ID: 2, Name: OpenAI DALL-E 3)
[ImageGenService] Total 2 providers loaded
```

生成图片时会记录使用的Provider：

```
[ImageGenService] Generating image for user 123
[ImageGenService] Auto-selected provider: stability-1
[StabilityProvider] Generating image with Stability AI (config 1): 一张医美海报
```

## 下一步计划

- [ ] 实现Provider配置管理API（CRUD）
- [ ] 添加配置验证功能（测试API Key是否有效）
- [ ] 添加成本统计（按配置维度）
- [ ] 添加请求限流（按配置维度）
- [ ] 支持配置级别的参数预设
