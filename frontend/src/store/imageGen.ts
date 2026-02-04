import { atom } from 'jotai';
import type { ProviderConfig, ImageGenerationHistory } from '@/type/imagegen';

/**
 * 可用的Provider列表
 */
export const providersAtom = atom<ProviderConfig[]>([]);

/**
 * 当前选中的Provider配置ID
 */
export const selectedProviderIdAtom = atom<number | undefined>(undefined);

/**
 * 是否正在生成图片
 */
export const isGeneratingAtom = atom<boolean>(false);

/**
 * 当前生成的图片结果
 */
export const currentGeneratedImageAtom = atom<{
  id: number;
  imageUrl: string;
  provider: string;
  configId: number;
  model?: string;
  createdAt: string;
} | null>(null);

/**
 * 生成历史记录
 */
export const generationHistoryAtom = atom<ImageGenerationHistory[]>([]);

/**
 * 错误信息
 */
export const generationErrorAtom = atom<string | null>(null);
