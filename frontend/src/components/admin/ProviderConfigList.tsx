"use client";

import { useState, useEffect } from "react";
import { getProvidersImgApi, reloadProvidersImgApi } from "@/api/imagegen";
import type { ProviderConfig } from "@/type/imagegen";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ProviderConfigList() {
  const [providers, setProviders] = useState<ProviderConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloading, setReloading] = useState(false);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      setLoading(true);
      const res = await getProvidersImgApi();
      if (res.code == 0) {
        setProviders(res.data || []);
      }
    } catch (error: any) {
      toast.error("加载Provider配置失败", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReload = async () => {
    try {
      setReloading(true);
      const res = await reloadProvidersImgApi();
      toast.success(`配置已重新加载`, {
        description: `当前${res.data?.count}个Provider可用`,
      });
      await loadProviders();
    } catch (error: any) {
      toast.error("重新加载失败", {
        description: error.message,
      });
    } finally {
      setReloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-3">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-sm text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 操作栏 */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Provider 配置列表</h3>
          <p className="text-sm text-muted-foreground mt-1">
            共 {providers.length} 个可用配置
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReload} disabled={reloading}>
            {reloading ? "重新加载中..." : "重新加载配置"}
          </Button>
          <Button>添加配置</Button>
        </div>
      </div>

      {/* Provider列表 */}
      {providers.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">暂无Provider配置</p>
          <Button className="mt-4">添加第一个配置</Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {providers.map((provider) => (
            <Card key={provider.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="text-lg font-semibold">{provider.name}</h4>
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      {provider.provider}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      优先级: {provider.priority}
                    </span>
                  </div>
                  {provider.modelId && (
                    <p className="text-sm text-muted-foreground mt-1">
                      模型: {provider.modelId}
                    </p>
                  )}
                  {provider.description && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {provider.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    编辑
                  </Button>
                  <Button variant="outline" size="sm">
                    测试
                  </Button>
                  <Button variant="destructive" size="sm">
                    禁用
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
