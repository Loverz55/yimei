"use client";

import { useState } from "react";
import { toast } from "sonner";

/**
 * 异步操作配置选项
 */
export interface UseAsyncOperationOptions<T> {
  /** 成功时的回调函数 */
  onSuccess?: (data: T) => void;
  /** 失败时的回调函数 */
  onError?: (error: Error) => void;
  /** 成功提示消息 */
  successMessage?: string;
  /** 错误提示消息 */
  errorMessage?: string;
  /** 是否显示Toast提示 */
  showToast?: boolean;
}

/**
 * 异步操作返回类型
 */
export interface UseAsyncOperationReturn<T, P extends any[]> {
  /** 执行异步操作 */
  execute: (...params: P) => Promise<T | null>;
  /** 加载状态 */
  loading: boolean;
  /** 错误信息 */
  error: Error | null;
  /** 返回数据 */
  data: T | null;
  /** 重置状态 */
  reset: () => void;
}

/**
 * 通用异步操作Hook
 *
 * 封装异步操作的通用逻辑，包括loading状态、错误处理和Toast提示
 *
 * @example
 * ```tsx
 * const { execute, loading, error, data } = useAsyncOperation(
 *   async (id: number) => {
 *     const res = await api.delete(id);
 *     return res.data;
 *   },
 *   {
 *     successMessage: "删除成功",
 *     errorMessage: "删除失败",
 *     onSuccess: () => reload(),
 *   }
 * );
 *
 * // 使用
 * await execute(123);
 * ```
 */
export function useAsyncOperation<T, P extends any[] = []>(
  asyncFn: (...params: P) => Promise<T>,
  options: UseAsyncOperationOptions<T> = {}
): UseAsyncOperationReturn<T, P> {
  const {
    onSuccess,
    onError,
    successMessage,
    errorMessage,
    showToast = true,
  } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = async (...params: P): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await asyncFn(...params);
      setData(result);

      if (showToast && successMessage) {
        toast.success(successMessage);
      }

      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (err: any) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);

      if (showToast) {
        toast.error(errorMessage || "操作失败", {
          description: error.message,
        });
      }

      if (onError) {
        onError(error);
      }

      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setData(null);
  };

  return {
    execute,
    loading,
    error,
    data,
    reset,
  };
}
