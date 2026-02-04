import { api } from ".";
import type {
  ModelConfig,
  CreateModelConfigDto,
  UpdateModelConfigDto,
  QueryModelConfigDto,
  ValidateConfigDto,
  CostStatsDto,
  RateLimitConfigDto,
  PresetParamsDto,
  ModelConfigListResponse,
  CostStatsResponse,
  RateLimitResponse,
  PresetsResponse,
} from "@/type/modelconfig";

/**
 * 获取所有模型配置（支持筛选和分页）
 */
export const modelListApi = (query?: QueryModelConfigDto) => {
  return api.get<ModelConfigListResponse>("/api/modelconfig", { params: query });
};

/**
 * 根据ID获取单个模型配置
 */
export const getModelConfigApi = (id: number) => {
  return api.get<ModelConfig>(`/api/modelconfig/${id}`);
};

/**
 * 创建模型配置
 */
export const createModelConfigApi = (data: CreateModelConfigDto) => {
  return api.post<ModelConfig>("/api/modelconfig", data);
};

/**
 * 更新模型配置
 */
export const updateModelConfigApi = (id: number, data: UpdateModelConfigDto) => {
  return api.patch<ModelConfig>(`/api/modelconfig/${id}`, data);
};

/**
 * 删除模型配置
 */
export const deleteModelConfigApi = (id: number) => {
  return api.delete(`/api/modelconfig/${id}`);
};

/**
 * 验证配置是否有效（测试API Key）
 */
export const validateModelConfigApi = (id: number, data?: ValidateConfigDto) => {
  return api.post<{ configId: number; valid: boolean; provider: string; name: string }>(`/api/modelconfig/${id}/validate`, data);
};

/**
 * 获取成本统计
 */
export const getCostStatsApi = (id: number, params?: CostStatsDto) => {
  return api.get<CostStatsResponse>(`/api/modelconfig/${id}/cost-stats`, { params });
};

/**
 * 设置请求限流
 */
export const setRateLimitApi = (id: number, data: RateLimitConfigDto) => {
  return api.post<{ configId: number; rateLimit: RateLimitConfigDto }>(`/api/modelconfig/${id}/rate-limit`, data);
};

/**
 * 获取限流配置
 */
export const getRateLimitApi = (id: number) => {
  return api.get<RateLimitResponse>(`/api/modelconfig/${id}/rate-limit`);
};

/**
 * 设置参数预设
 */
export const setPresetApi = (id: number, data: PresetParamsDto) => {
  return api.post<{ configId: number; presetName: string; params: Record<string, any> }>(`/api/modelconfig/${id}/presets`, data);
};

/**
 * 获取所有参数预设
 */
export const getPresetsApi = (id: number) => {
  return api.get<PresetsResponse>(`/api/modelconfig/${id}/presets`);
};

/**
 * 删除参数预设
 */
export const deletePresetApi = (id: number, presetName: string) => {
  return api.delete(`/api/modelconfig/${id}/presets/${presetName}`);
};
