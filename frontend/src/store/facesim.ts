import { atom } from 'jotai';

/**
 * 当前上传的原始图片
 */
export const originalImageAtom = atom<{
  url: string;
  file?: File;
} | null>(null);

/**
 * 选中的区域
 */
export interface RectangleSelection {
  type: 'rectangle';
  x: number; // 相对于图片的 x 坐标（百分比 0-100）
  y: number; // 相对于图片的 y 坐标（百分比 0-100）
  width: number; // 宽度（百分比 0-100）
  height: number; // 高度（百分比 0-100）
}

export interface FreehandSelection {
  type: 'freehand';
  points: Array<{ x: number; y: number }>; // 路径点（百分比 0-100）
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export type SelectionArea = RectangleSelection | FreehandSelection;

export const selectedAreaAtom = atom<SelectionArea | null>(null);

/**
 * 编辑提示词
 */
export const editPromptAtom = atom<string>('');

/**
 * 是否正在处理（生成/编辑）
 */
export const isProcessingAtom = atom<boolean>(false);

/**
 * 当前编辑后的结果图片
 */
export const editedImageAtom = atom<{
  url: string;
  timestamp: number;
} | null>(null);

/**
 * 错误信息
 */
export const errorMessageAtom = atom<string | null>(null);

/**
 * 编辑历史记录
 */
export interface EditHistory {
  id: string;
  originalUrl: string;
  editedUrl: string;
  prompt: string;
  area: SelectionArea;
  createdAt: string;
}

export const editHistoryAtom = atom<EditHistory[]>([]);
