"use client";

import { useEffect } from "react";
import { useAtom } from "jotai";
import { generationHistoryAtom } from "@/store/imageGen";
import { getHistoryImgApi, getByIdImgApi } from "@/api/imagegen";
import type { ImageGenerationHistory } from "@/type/imagegen";
import { toast } from "sonner";
import { useAsyncOperation } from "@/hooks/common";

/**
 * 生成历史Hook返回类型
 */
export interface UseGenerationHistoryReturn {
  /** 历史记录列表 */
  history: ImageGenerationHistory[];
  /** 加载历史记录 */
  loadHistory: (
    limit?: number,
    offset?: number
  ) => Promise<ImageGenerationHistory[] | null>;
  /** 查看详情 */
  viewDetail: (id: number) => Promise<ImageGenerationHistory | null>;
  /** 加载状态 */
  loading: boolean;
}

/**
 * 生成历史Hook
 *
 * 管理图片生成历史记录的加载和查看,集成Jotai全局状态
 *
 * @example
 * ```tsx
 * const { history, loadHistory, viewDetail, loading } = useGenerationHistory();
 *
 * // 加载历史
 * useEffect(() => {
 *   loadHistory();
 * }, []);
 *
 * // 查看详情
 * const handleViewDetail = async (id: number) => {
 *   const detail = await viewDetail(id);
 *   console.log(detail);
 * };
 * ```
 */
export function useGenerationHistory(): UseGenerationHistoryReturn {
  const [history, setHistory] = useAtom(generationHistoryAtom);

  const { execute: loadHistory, loading } = useAsyncOperation(
    async (limit: number = 20, offset: number = 0) => {
      const res = await getHistoryImgApi(limit, offset);

      if (res.code === 0 && res.data) {
        setHistory(res.data);
        return res.data;
      } else {
        throw new Error(res.msg || "加载历史记录失败");
      }
    },
    {
      showToast: false, // 不显示成功提示
      errorMessage: "加载历史记录失败",
    }
  );

  const { execute: viewDetail } = useAsyncOperation(
    async (id: number) => {
      const res = await getByIdImgApi(id);

      if (res.code === 0 && res.data) {
        return res.data;
      } else {
        throw new Error(res.msg || "加载详情失败");
      }
    },
    {
      showToast: false,
      errorMessage: "加载详情失败",
    }
  );

  // 组件挂载时加载历史记录
  useEffect(() => {
    if (history.length === 0) {
      loadHistory();
    }
  }, []);

  return {
    history,
    loadHistory,
    viewDetail,
    loading,
  };
}
