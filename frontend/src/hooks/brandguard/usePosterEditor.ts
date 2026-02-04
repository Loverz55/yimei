"use client";

import { useState } from "react";
import type { Template } from "@/type/brandguard";

/**
 * 海报编辑器Hook配置
 */
export interface UsePosterEditorOptions {
  /** 模板 */
  template: Template;
  /** 初始内容 */
  initialContent?: string;
  /** 生成成功回调 */
  onSuccess?: (imageUrl: string) => void;
  /** 生成失败回调 */
  onError?: (error: Error) => void;
}

/**
 * 海报编辑器Hook返回类型
 */
export interface UsePosterEditorReturn {
  /** 海报内容 */
  content: string;
  /** 设置内容 */
  setContent: (content: string) => void;
  /** 预览图URL */
  preview: string;
  /** 是否正在生成 */
  generating: boolean;
  /** 生成海报 */
  generatePoster: () => Promise<void>;
  /** 重置 */
  reset: () => void;
}

/**
 * 海报编辑器Hook
 *
 * 封装海报编辑和生成逻辑
 *
 * @example
 * ```tsx
 * const {
 *   content,
 *   setContent,
 *   preview,
 *   generating,
 *   generatePoster,
 * } = usePosterEditor({
 *   template: selectedTemplate,
 *   onSuccess: (imageUrl) => {
 *     console.log('生成成功', imageUrl);
 *   },
 * });
 * ```
 */
export function usePosterEditor(
  options: UsePosterEditorOptions
): UsePosterEditorReturn {
  const { template, initialContent = "", onSuccess, onError } = options;

  const [content, setContent] = useState(initialContent);
  const [preview, setPreview] = useState("");
  const [generating, setGenerating] = useState(false);

  const generatePoster = async (): Promise<void> => {
    if (!content) {
      return;
    }

    setGenerating(true);

    try {
      // TODO: 调用海报生成API
      // const res = await brandguardApi.generatePoster({
      //   templateId: template.id,
      //   content,
      //   size: 'moments'
      // });
      //
      // if (res.code === 0 && res.data) {
      //   setPreview(res.data.imageUrl);
      //   if (onSuccess) {
      //     onSuccess(res.data.imageUrl);
      //   }
      // }

      // 模拟生成（API未实现时使用）
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockImageUrl = `https://via.placeholder.com/800x1200?text=${encodeURIComponent(
        content.substring(0, 20)
      )}`;
      setPreview(mockImageUrl);

      if (onSuccess) {
        onSuccess(mockImageUrl);
      }
    } catch (error: any) {
      console.error("生成海报失败:", error);
      if (onError) {
        onError(error);
      }
    } finally {
      setGenerating(false);
    }
  };

  const reset = () => {
    setContent(initialContent);
    setPreview("");
    setGenerating(false);
  };

  return {
    content,
    setContent,
    preview,
    generating,
    generatePoster,
    reset,
  };
}
