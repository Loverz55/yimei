"use client";

import { useEffect } from "react";
import { useAtom } from "jotai";
import { providersAtom, selectedProviderIdAtom } from "@/store/imageGen";
import { getProvidersImgApi } from "@/api/imagegen";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function ProviderSelector() {
  const [providers, setProviders] = useAtom(providersAtom);
  const [selectedProviderId, setSelectedProviderId] = useAtom(
    selectedProviderIdAtom,
  );

  useEffect(() => {
    // 加载可用的Provider列表
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      const { data, msg, code } = await getProvidersImgApi();

      if (!data || code !== 0) {
        toast.error(msg);
        return;
      }
      setProviders(data);

      // 默认选择第一个
      if (data.length > 0 && !selectedProviderId) {
        setSelectedProviderId(data[0].id);
      }
    } catch (error: any) {
      toast.error("加载Provider列表失败", {
        description: error.message,
      });
    }
  };

  if (providers.length === 0) {
    return (
      <div className="space-y-2">
        <Label>AI服务提供商</Label>
        <p className="text-sm text-muted-foreground">
          暂无可用的AI服务，请联系管理员配置
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="provider">AI服务提供商</Label>
      <select
        id="provider"
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        value={selectedProviderId || ""}
        onChange={(e) => setSelectedProviderId(Number(e.target.value))}
      >
        <option value="">自动选择（按优先级）</option>
        {providers.map((provider) => (
          <option key={provider.id} value={provider.id}>
            {provider.name} - {provider.provider}
            {provider.description && ` (${provider.description})`}
          </option>
        ))}
      </select>
      <p className="text-xs text-muted-foreground">
        选择特定的AI服务，或留空自动选择优先级最高的可用服务
      </p>
    </div>
  );
}
