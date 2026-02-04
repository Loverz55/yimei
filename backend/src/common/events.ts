export const AI_MODEL_CONFIG_CHANGED = 'aiModelConfig.changed';

export type AiModelConfigChangedPayload = {
  type?: string; // 例如 'image-gen'
  configId?: number; // 哪条变了
  action: 'create' | 'update' | 'remove' | 'enable' | 'disable';
};
