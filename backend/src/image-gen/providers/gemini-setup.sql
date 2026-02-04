-- Gemini Provider 配置示例
-- 在数据库中添加 Gemini 图像生成服务配置

-- 基础配置示例
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
  'YOUR_GEMINI_API_KEY_HERE',
  '{"personGeneration": "allow_adult"}',
  true,
  5,
  'Google Gemini Imagen 3 快速生成模型'
);

-- 高质量配置示例（使用 Imagen 3 标准模型）
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
  'Gemini Imagen 3 Standard',
  'gemini',
  'image-gen',
  'imagen-3.0-generate-001',
  'https://generativelanguage.googleapis.com/v1beta',
  'YOUR_GEMINI_API_KEY_HERE',
  '{"personGeneration": "allow_adult"}',
  true,
  3,
  'Google Gemini Imagen 3 标准模型（更高质量）'
);

-- 编辑能力配置（用于 Inpainting）
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
  'Gemini Imagen 3 Capability',
  'gemini',
  'image-gen',
  'imagen-3.0-capability-001',
  'https://generativelanguage.googleapis.com/v1beta',
  'YOUR_GEMINI_API_KEY_HERE',
  '{"personGeneration": "allow_adult"}',
  true,
  4,
  'Google Gemini Imagen 3 完整能力模型（支持编辑和修复）'
);

-- 配置说明:
-- 1. provider: 必须是 'gemini'
-- 2. type: 必须是 'image-gen'
-- 3. modelId: 可选的 Gemini 模型 ID
--    - imagen-3.0-fast-generate-001: 快速生成
--    - imagen-3.0-generate-001: 标准质量
--    - imagen-3.0-capability-001: 完整能力（支持编辑）
-- 4. baseUrl: Gemini API 基础 URL
--    - 默认: https://generativelanguage.googleapis.com/v1beta
-- 5. apiKey: 你的 Gemini API Key（从 Google AI Studio 获取）
-- 6. config: JSON 格式的额外配置
--    - personGeneration: 'allow_adult' | 'dont_allow' (是否允许生成人物)
-- 7. enabled: true 表示启用
-- 8. priority: 数字越大优先级越高

-- 获取 Gemini API Key:
-- 访问 https://aistudio.google.com/app/apikey
