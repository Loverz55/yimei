"use client";

import { useState, useEffect } from "react";
import {
  modelListApi,
  createModelConfigApi,
  updateModelConfigApi,
  deleteModelConfigApi,
  validateModelConfigApi,
} from "@/api/modelconfig";
import type {
  ModelConfig,
  CreateModelConfigDto,
  UpdateModelConfigDto,
  QueryModelConfigDto,
  ProviderType,
  ServiceType,
} from "@/type/modelconfig";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function ModelConfigList() {
  const [configs, setConfigs] = useState<ModelConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [query, setQuery] = useState<QueryModelConfigDto>({});

  // 对话框状态
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<ModelConfig | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // 删除确认对话框
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingConfig, setDeletingConfig] = useState<ModelConfig | null>(null);

  // 表单数据
  const [formData, setFormData] = useState<CreateModelConfigDto>({
    name: "",
    provider: "openai",
    type: "image-gen",
    baseUrl: "",
    apiKey: "",
    enabled: true,
    priority: 0,
  });

  useEffect(() => {
    loadConfigs();
  }, [page, query]);

  const loadConfigs = async () => {
    try {
      setLoading(true);
      const res = await modelListApi({ ...query, page, pageSize });
      if (res.code === 0 && res.data) {
        setConfigs(res.data.list || []);
        setTotal(res.data.total || 0);
      }
    } catch (error: any) {
      toast.error("加载模型配置失败", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingConfig(null);
    setFormData({
      name: "",
      provider: "openai",
      type: "image-gen",
      baseUrl: "",
      apiKey: "",
      enabled: true,
      priority: 0,
    });
    setDialogOpen(true);
  };

  const handleEdit = (config: ModelConfig) => {
    setEditingConfig(config);
    setFormData({
      name: config.name,
      provider: config.provider,
      type: config.type,
      modelId: config.modelId,
      baseUrl: config.baseUrl,
      apiKey: config.apiKey,
      enabled: config.enabled,
      priority: config.priority,
      description: config.description,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      if (editingConfig) {
        // 更新
        const updateData: UpdateModelConfigDto = { ...formData };
        const res = await updateModelConfigApi(editingConfig.id, updateData);
        if (res.code === 0) {
          toast.success("配置更新成功");
          setDialogOpen(false);
          await loadConfigs();
        } else {
          toast.error("配置更新失败", {
            description: res.msg,
          });
        }
      } else {
        // 创建
        const res = await createModelConfigApi(formData);
        if (res.code === 0) {
          toast.success("配置创建成功");
          setDialogOpen(false);
          await loadConfigs();
        } else {
          toast.error("配置创建失败", {
            description: res.msg,
          });
        }
      }
    } catch (error: any) {
      toast.error(editingConfig ? "配置更新失败" : "配置创建失败", {
        description: error.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (config: ModelConfig) => {
    setDeletingConfig(config);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingConfig) return;

    try {
      const res = await deleteModelConfigApi(deletingConfig.id);
      if (res.code === 0) {
        toast.success("配置删除成功");
        setDeleteDialogOpen(false);
        await loadConfigs();
      } else {
        toast.error("配置删除失败", {
          description: res.msg,
        });
      }
    } catch (error: any) {
      toast.error("配置删除失败", {
        description: error.message,
      });
    }
  };

  const handleToggleEnabled = async (config: ModelConfig) => {
    try {
      const res = await updateModelConfigApi(config.id, {
        enabled: !config.enabled,
      });
      if (res.code === 0) {
        toast.success(config.enabled ? "配置已禁用" : "配置已启用");
        await loadConfigs();
      } else {
        toast.error("操作失败", {
          description: res.msg,
        });
      }
    } catch (error: any) {
      toast.error("操作失败", {
        description: error.message,
      });
    }
  };

  const handleValidate = async (config: ModelConfig) => {
    try {
      const loadingToast = toast.loading("验证配置中...");
      const res = await validateModelConfigApi(config.id);
      toast.dismiss(loadingToast);

      if (res.code === 0 && res.data?.valid) {
        toast.success("配置验证成功", {
          description: "API Key 有效",
        });
      } else {
        toast.error("配置验证失败", {
          description: res.msg || "API Key 无效",
        });
      }
    } catch (error: any) {
      toast.error("配置验证失败", {
        description: error.message,
      });
    }
  };

  const handleFilterChange = (key: keyof QueryModelConfigDto, value: any) => {
    setQuery((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPage(1);
  };

  if (loading && configs.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-3">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-sm text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      {/* 操作栏和筛选 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">模型配置列表</h3>
            <p className="text-sm text-muted-foreground mt-1">
              共 {total} 个配置
            </p>
          </div>
          <Button onClick={handleCreate}>添加配置</Button>
        </div>

        {/* 筛选条件 */}
        <div className="flex gap-3">
          <Select
            value={query.provider || "all"}
            onValueChange={(value) =>
              handleFilterChange("provider", value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Provider类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部Provider</SelectItem>
              <SelectItem value="stability">Stability</SelectItem>
              <SelectItem value="openai">OpenAI</SelectItem>
              <SelectItem value="aliyun">阿里云</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={query.type || "all"}
            onValueChange={(value) =>
              handleFilterChange("type", value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="服务类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部类型</SelectItem>
              <SelectItem value="image-gen">图像生成</SelectItem>
              <SelectItem value="text-gen">文本生成</SelectItem>
              <SelectItem value="embedding">向量嵌入</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={
              query.enabled === undefined
                ? "all"
                : query.enabled
                  ? "enabled"
                  : "disabled"
            }
            onValueChange={(value) =>
              handleFilterChange(
                "enabled",
                value === "all" ? undefined : value === "enabled"
              )
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="启用状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="enabled">已启用</SelectItem>
              <SelectItem value="disabled">已禁用</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 配置列表 */}
      {configs.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">暂无模型配置</p>
          <Button className="mt-4" onClick={handleCreate}>
            添加第一个配置
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {configs.map((config) => (
            <Card key={config.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="text-lg font-semibold">{config.name}</h4>
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      {config.provider}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
                      {config.type}
                    </span>
                    {!config.enabled && (
                      <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400">
                        已禁用
                      </span>
                    )}
                    <span className="text-sm text-muted-foreground">
                      优先级: {config.priority}
                    </span>
                  </div>
                  {config.modelId && (
                    <p className="text-sm text-muted-foreground mt-1">
                      模型: {config.modelId}
                    </p>
                  )}
                  {config.description && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {config.description}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    API地址: {config.baseUrl}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(config)}
                  >
                    编辑
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleValidate(config)}
                  >
                    验证
                  </Button>
                  <Button
                    variant={config.enabled ? "outline" : "default"}
                    size="sm"
                    onClick={() => handleToggleEnabled(config)}
                  >
                    {config.enabled ? "禁用" : "启用"}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(config)}
                  >
                    删除
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            上一页
          </Button>
          <span className="text-sm text-muted-foreground">
            第 {page} / {totalPages} 页
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            下一页
          </Button>
        </div>
      )}

      {/* 创建/编辑对话框 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingConfig ? "编辑模型配置" : "创建模型配置"}
            </DialogTitle>
            <DialogDescription>
              {editingConfig
                ? "修改现有的模型配置信息"
                : "添加新的AI模型配置"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">配置名称 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="例如：OpenAI DALL-E 3"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="provider">Provider类型 *</Label>
                <Select
                  value={formData.provider}
                  onValueChange={(value: ProviderType) =>
                    setFormData({ ...formData, provider: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="stability">Stability AI</SelectItem>
                    <SelectItem value="aliyun">阿里云</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="type">服务类型 *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: ServiceType) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image-gen">图像生成</SelectItem>
                    <SelectItem value="text-gen">文本生成</SelectItem>
                    <SelectItem value="embedding">向量嵌入</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="modelId">模型ID</Label>
              <Input
                id="modelId"
                value={formData.modelId || ""}
                onChange={(e) =>
                  setFormData({ ...formData, modelId: e.target.value })
                }
                placeholder="例如：dall-e-3"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="baseUrl">API基础URL *</Label>
              <Input
                id="baseUrl"
                value={formData.baseUrl}
                onChange={(e) =>
                  setFormData({ ...formData, baseUrl: e.target.value })
                }
                placeholder="https://api.openai.com/v1"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="apiKey">API Key *</Label>
              <Input
                id="apiKey"
                type="password"
                value={formData.apiKey}
                onChange={(e) =>
                  setFormData({ ...formData, apiKey: e.target.value })
                }
                placeholder="sk-..."
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="priority">优先级</Label>
              <Input
                id="priority"
                type="number"
                value={formData.priority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">
                数字越大优先级越高
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">描述信息</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="配置说明..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="enabled"
                checked={formData.enabled}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, enabled: checked })
                }
              />
              <Label htmlFor="enabled">启用此配置</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={submitting}
            >
              取消
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting
                ? editingConfig
                  ? "更新中..."
                  : "创建中..."
                : editingConfig
                  ? "更新"
                  : "创建"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除配置 "{deletingConfig?.name}" 吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
