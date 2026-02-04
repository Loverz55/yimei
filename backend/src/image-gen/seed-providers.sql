-- 示例：添加Stability AI配置
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
  '你的Stability API Key',  -- 替换为实际的API Key
  true,
  100,
  'Stability AI SDXL 1.0模型，适合生成高质量海报',
  NOW(),
  NOW()
);

-- 示例：添加OpenAI DALL-E配置
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
  'OpenAI DALL-E 3',
  'openai',
  'image-gen',
  'dall-e-3',
  'https://api.openai.com/v1',
  '你的OpenAI API Key',  -- 替换为实际的API Key
  false,  -- 默认禁用，成本较高
  50,
  'OpenAI DALL-E 3，质量最高但价格较贵',
  NOW(),
  NOW()
);

-- 示例：添加阿里云通义万相配置（待实现）
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
  '阿里云通义万相',
  'aliyun',
  'image-gen',
  'wanx-v1',
  'https://dashscope.aliyuncs.com/api/v1',
  '你的阿里云API Key',  -- 替换为实际的API Key
  false,  -- 待实现
  30,
  '国内访问稳定，支持中文提示词',
  NOW(),
  NOW()
);
