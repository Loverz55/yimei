import { api } from "./index";
import type {
  GenerateImageRequest,
  InpaintImageRequest,
  ImageGenerationResponse,
  ImageGenerationHistory,
  ProviderConfig,
} from "@/type/imagegen";

/**
 * 图像生成API
 */

/**
 * 生成图片（文生图）
 */
export const generateImgApi = (data: GenerateImageRequest) => {
  return api.post<ImageGenerationResponse>("/api/image-gen/generate", data);
};

/**
 * 图片局部修改（Inpainting）
 */
export const inpaintImgApi = (data: InpaintImageRequest) => {
  return api.post<ImageGenerationResponse>("/api/image-gen/inpaint", data);
};

/**
 * 获取生成历史
 */
export const getHistoryImgApi = (limit = 20, offset = 0) => {
  return api.get<ImageGenerationHistory[]>(
    `/image-gen/history?limit=${limit}&offset=${offset}`,
  );
};

/**
 * 获取单个生成记录详情
 */
export const getByIdImgApi = (id: number) => {
  return api.get<ImageGenerationHistory>(`/api/image-gen/${id}`);
};

/**
 * 获取可用的Provider列表
 */
export const getProvidersImgApi = () => {
  return api.get<ProviderConfig[]>("/api/image-gen/providers/list");
};

/**
 * 重新加载Provider配置（管理员）
 */
export const reloadProvidersImgApi = () => {
  return api.post<{ success: boolean; count: number }>(
    "/api/image-gen/providers/reload",
  );
};
