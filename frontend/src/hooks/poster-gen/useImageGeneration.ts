"use client";

import { useAtom, useSetAtom } from "jotai";
import {
  isGeneratingAtom,
  currentGeneratedImageAtom,
  generationErrorAtom,
} from "@/store/imageGen";
import { generateImgApi } from "@/api/imagegen";
import type {
  GenerateImageRequest,
  ImageGenerationResponse,
} from "@/type/imagegen";
import { toast } from "sonner";

/**
 * 图片生成Hook配置
 */
export interface UseImageGenerationOptions {
  /** 成功后的回调 */
  onSuccess?: (result: ImageGenerationResponse) => void;
  /** 失败后的回调 */
  onError?: (error: Error) => void;
}

/**
 * 图片生成Hook返回类型
 */
export interface UseImageGenerationReturn {
  /** 生成图片 */
  generate: (request: GenerateImageRequest) => Promise<void>;
  /** 是否正在生成 */
  isGenerating: boolean;
  /** 当前生成的图片 */
  currentImage: ImageGenerationResponse | null;
  /** 错误信息 */
  error: string | null;
  /** 重置状态 */
  reset: () => void;
}

/**
 * 图片生成Hook
 *
 * 封装图片生成的核心逻辑,集成Jotai全局状态
 *
 * @example
 * ```tsx
 * const { generate, isGenerating, currentImage, error } = useImageGeneration({
 *   onSuccess: (result) => {
 *     console.log('生成成功', result);
 *   },
 * });
 *
 * // 生成图片
 * await generate({
 *   prompt: "一张海报",
 *   configId: selectedProviderId,
 *   aspectRatio: "1:1",
 * });
 * ```
 */
export function useImageGeneration(
  options: UseImageGenerationOptions = {}
): UseImageGenerationReturn {
  const { onSuccess, onError } = options;

  // 使用Jotai atoms管理全局状态
  const [isGenerating, setIsGenerating] = useAtom(isGeneratingAtom);
  const [currentImage, setCurrentImage] = useAtom(currentGeneratedImageAtom);
  const [error, setError] = useAtom(generationErrorAtom);

  const generate = async (request: GenerateImageRequest): Promise<void> => {
    setIsGenerating(true);
    setError(null);
    setCurrentImage(null);

    try {
      const res = await generateImgApi(request);

      if (res.code !== 0 || !res.data) {
        const errorMsg = res.msg || "图片生成失败";
        setError(errorMsg);
        toast.error(errorMsg);
        if (onError) {
          onError(new Error(errorMsg));
        }
        return;
      }

      const result = res.data;
      setCurrentImage(result);
      toast.success("图片生成成功！");

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error: any) {
      const errorMsg = error.message || "图片生成失败";
      setError(errorMsg);
      toast.error("生成失败", {
        description: errorMsg,
      });

      if (onError) {
        onError(error);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const reset = () => {
    setIsGenerating(false);
    setCurrentImage(null);
    setError(null);
  };

  return {
    generate,
    isGenerating,
    currentImage,
    error,
    reset,
  };
}
