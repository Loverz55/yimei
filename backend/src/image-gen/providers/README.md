# 图像生成 Provider 说明

## 架构设计

### Provider 管理方式

当前实现使用了**工厂模式**和**策略模式**的组合：

1. **动态创建**: Provider 实例根据数据库配置动态创建，而不是在模块启动时静态注入
2. **配置驱动**: 每个 Provider 实例都关联一个特定的数据库配置（AiModelConfig）
3. **多实例支持**: 同一个 Provider 类型（如 GeminiProvider）可以有多个实例，对应不同的配置

### 为什么不使用完全的 NestJS 依赖注入？

虽然 Provider 类使用了 `@Injectable()` 装饰器，但它们并不直接注册在模块的 `providers` 中。原因是：

1. **动态性**: Provider 需要根据数据库中的配置动态创建，数量和类型在运行时确定
2. **配置绑定**: 每个 Provider 实例需要绑定到特定的配置 ID
3. **灵活性**: 用户可以在运行时通过数据库添加/修改配置，无需重启服务

### 添加新的 Provider

要添加新的 Provider（如阿里云、百度文心一格等），只需：

1. 创建新的 Provider 类，继承 `BaseImageProvider`
2. 在 `ImageGenService` 的 `providerClassMap` 中注册
3. 不需要修改 `ImageGenModule` 的 providers 配置

```typescript
// 示例：添加阿里云 Provider
private providerClassMap = new Map<
  string,
  new (httpService: HttpService) => BaseImageProvider
>([
  ['stability', StabilityProvider],
  ['openai', OpenAIProvider],
  ['gemini', GeminiProvider],
  ['aliyun', AliyunProvider], // 添加新的 Provider
]);
```

## 支持的 Provider

### 1. Stability AI

- **Provider Type**: `stability`
- **支持的功能**: 文生图、图生图修复
- **模型**: Stable Diffusion XL 等

### 2. OpenAI DALL-E

- **Provider Type**: `openai`
- **支持的功能**: 文生图、图生图编辑
- **模型**: DALL-E 2, DALL-E 3

### 3. Google Gemini Imagen

- **Provider Type**: `gemini`
- **支持的功能**: 文生图、图生图修复
- **模型**:
  - `imagen-3.0-fast-generate-001` - 快速生成
  - `imagen-3.0-generate-001` - 标准质量
  - `imagen-3.0-capability-001` - 完整能力（支持编辑）

## Gemini Provider 使用指南

### 获取 API Key

1. 访问 [Google AI Studio](https://aistudio.google.com/app/apikey)
2. 创建新的 API Key
3. 将 API Key 保存到数据库配置中

### 数据库配置

参考 `gemini-setup.sql` 文件添加配置：

```sql
INSERT INTO "AiModelConfig" (
  name,
  provider,
  type,
  "modelId",
  "baseUrl",
  "apiKey",
  config,
  enabled,
  priority,
  description
) VALUES (
  'Gemini Imagen 3 Fast',
  'gemini',
  'image-gen',
  'imagen-3.0-fast-generate-001',
  'https://generativelanguage.googleapis.com/v1beta',
  'YOUR_API_KEY',
  '{"personGeneration": "allow_adult"}',
  true,
  5,
  'Google Gemini Imagen 3 快速生成'
);
```

### 配置参数说明

- **name**: 配置名称（自定义）
- **provider**: 必须是 `'gemini'`
- **type**: 必须是 `'image-gen'`
- **modelId**: Gemini 模型 ID（可选，默认使用 fast 模型）
- **baseUrl**: API 基础 URL（默认：`https://generativelanguage.googleapis.com/v1beta`）
- **apiKey**: 你的 Gemini API Key
- **config**: JSON 格式的额外配置
  - `personGeneration`: `'allow_adult'` | `'dont_allow'` - 是否允许生成人物
- **enabled**: 是否启用该配置
- **priority**: 优先级（数字越大优先级越高）

### 支持的参数

#### 文生图 (generateImage)

- **prompt**: 提示词（必填）
- **aspectRatio**: 宽高比
  - 支持: `1:1`, `9:16`, `16:9`, `4:3`, `3:4`
  - 默认: `1:1`
- **negativePrompt**: 负面提示词
- **samples**: 生成数量（默认：1）
- **seed**: 随机种子（可选）

#### 图生图修复 (inpaint)

- **imageUrl**: 原始图片 URL（必填）
- **maskUrl**: 遮罩图片 URL（必填）
- **prompt**: 修改描述（必填）
- **negativePrompt**: 负面提示词
- **seed**: 随机种子（可选）

### API 使用示例

#### 生成图片

```http
POST /api/image-gen/generate
Content-Type: application/json

{
  "prompt": "一只可爱的猫咪在花园里玩耍",
  "provider": "gemini",
  "aspectRatio": "16:9",
  "negativePrompt": "模糊，低质量"
}
```

#### 图片修复

```http
POST /api/image-gen/inpaint
Content-Type: application/json

{
  "imageId": 123,
  "maskId": 124,
  "prompt": "在这里添加一只蝴蝶",
  "provider": "gemini"
}
```

### 返回格式

Gemini Provider 返回 base64 编码的图片数据，系统会自动上传到 S3 并返回可访问的 URL。

```json
{
  "id": 1,
  "imageUrl": "https://your-bucket.s3.amazonaws.com/generated/1234567890.png",
  "provider": "gemini",
  "configId": 5,
  "model": "imagen-3.0-fast-generate-001",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## 性能对比

| Provider | 生成速度 | 图片质量 | 价格 | 特点 |
|---------|---------|---------|------|------|
| Gemini Fast | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 💰💰 | 快速生成，适合批量 |
| Gemini Standard | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 💰💰💰 | 高质量，细节丰富 |
| DALL-E 3 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 💰💰💰💰 | 提示词理解强 |
| Stability AI | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 💰💰 | 可控性强，参数多 |

## 常见问题

### 1. API Key 无效

确保你的 API Key 是从 Google AI Studio 获取的，并且已启用 Imagen API。

### 2. 不支持的宽高比

Gemini 仅支持特定的宽高比。如果传入不支持的比例，系统会自动使用 `1:1`。

### 3. 图片生成失败

- 检查提示词是否违反了内容政策
- 检查 API Key 是否有足够的配额
- 查看日志获取详细错误信息

### 4. 如何重新加载配置

```http
POST /api/image-gen/reload
```

这会重新从数据库加载所有 Provider 配置。

## 开发指南

### 测试 Provider

```typescript
// 在测试中使用
const provider = new GeminiProvider(httpService);
provider.setConfig({
  id: 1,
  provider: 'gemini',
  apiKey: 'test-key',
  baseUrl: 'https://test-url',
  // ...其他配置
});

const result = await provider.generateImage('test prompt', {
  aspectRatio: '1:1',
});
```

### 添加新功能

要为 Gemini Provider 添加新功能：

1. 在 `BaseImageProvider` 中添加抽象方法
2. 在 `GeminiProvider` 中实现该方法
3. 更新 `ImageGenService` 以支持新功能
4. 添加相应的 DTO 和 API 端点

## 许可证

Copyright (c) 2024
