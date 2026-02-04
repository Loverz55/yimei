"use client";

import { useRef, ChangeEvent } from "react";

/**
 * 文件上传Hook配置
 */
export interface UseFileUploadOptions {
  /** 上传完成回调 */
  onUpload: (file: File) => void;
  /** 接受的文件类型 */
  accept?: string;
}

/**
 * 文件上传Hook返回类型
 */
export interface UseFileUploadReturn {
  /** 文件输入元素引用 */
  fileInputRef: React.RefObject<HTMLInputElement>;
  /** 处理文件选择 */
  handleFileSelect: (e: ChangeEvent<HTMLInputElement>) => void;
  /** 触发文件选择 */
  triggerFileSelect: () => void;
}

/**
 * 文件上传Hook
 *
 * 管理文件选择和上传
 *
 * @example
 * ```tsx
 * const { fileInputRef, handleFileSelect, triggerFileSelect } = useFileUpload({
 *   onUpload: (file) => {
 *     console.log('文件选择完成', file);
 *   },
 *   accept: "image/*",
 * });
 *
 * <input
 *   ref={fileInputRef}
 *   type="file"
 *   accept="image/*"
 *   onChange={handleFileSelect}
 *   className="hidden"
 * />
 * <button onClick={triggerFileSelect}>选择图片</button>
 * ```
 */
export function useFileUpload(
  options: UseFileUploadOptions
): UseFileUploadReturn {
  const { onUpload, accept = "image/*" } = options;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  const triggerFileSelect = (): void => {
    fileInputRef.current?.click();
  };

  return {
    fileInputRef,
    handleFileSelect,
    triggerFileSelect,
  };
}
