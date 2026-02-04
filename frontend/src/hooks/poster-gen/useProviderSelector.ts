"use client";

import { useEffect } from "react";
import { useAtom, useSetAtom } from "jotai";
import { providersAtom, selectedProviderIdAtom } from "@/store/imageGen";
import { getProvidersImgApi, reloadProvidersImgApi } from "@/api/imagegen";
import type { ProviderConfig } from "@/type/imagegen";
import { toast } from "sonner";
import { useAsyncOperation } from "@/hooks/common";

/**
 * Provider选择器Hook返回类型
 */
export interface UseProviderSelectorReturn {
  /** Provider列表 */
  providers: ProviderConfig[];
  /** 当前选中的Provider ID */
  selectedProviderId: number | undefined;
  /** 选择Provider */
  selectProvider: (id: number) => void;
  /** 加载Providers */
  loadProviders: () => Promise<void>;
  /** 重新加载Providers(管理员) */
  reloadProviders: () => Promise<void>;
  /** 加载状态 */
  loading: boolean;
}

/**
 * Provider选择器Hook
 *
 * 管理图片生成Provider的选择和加载,集成Jotai全局状态
 *
 * @example
 * ```tsx
 * const {
 *   providers,
 *   selectedProviderId,
 *   selectProvider,
 *   loading,
 * } = useProviderSelector();
 *
 * // 选择Provider
 * <select value={selectedProviderId} onChange={(e) => selectProvider(Number(e.target.value))}>
 *   {providers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
 * </select>
 * ```
 */
export function useProviderSelector(): UseProviderSelectorReturn {
  const [providers, setProviders] = useAtom(providersAtom);
  const [selectedProviderId, setSelectedProviderId] = useAtom(
    selectedProviderIdAtom
  );

  // 使用通用异步操作hook
  const { execute: loadProviders, loading } = useAsyncOperation(
    async () => {
      const res = await getProvidersImgApi();

      if (res.code === 0 && res.data) {
        setProviders(res.data);

        // 如果没有选中的Provider,默认选中第一个
        if (!selectedProviderId && res.data.length > 0) {
          setSelectedProviderId(res.data[0].id);
        }

        return res.data;
      } else {
        throw new Error(res.msg || "加载Provider列表失败");
      }
    },
    {
      showToast: false, // 不显示成功提示
      errorMessage: "加载Provider列表失败",
    }
  );

  const { execute: reloadProviders } = useAsyncOperation(
    async () => {
      const res = await reloadProvidersImgApi();

      if (res.code === 0) {
        toast.success(`重新加载成功,共 ${res.data?.count || 0} 个Provider`);
        // 重新加载后刷新列表
        await loadProviders();
        return res.data;
      } else {
        throw new Error(res.msg || "重新加载失败");
      }
    },
    {
      successMessage: "Provider配置已重新加载",
      errorMessage: "重新加载失败",
    }
  );

  const selectProvider = (id: number) => {
    setSelectedProviderId(id);
  };

  // 组件挂载时加载Providers
  useEffect(() => {
    if (providers.length === 0) {
      loadProviders();
    }
  }, []);

  return {
    providers,
    selectedProviderId,
    selectProvider,
    loadProviders,
    reloadProviders,
    loading,
  };
}
