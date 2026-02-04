"use client";

import { useState, Dispatch, SetStateAction } from "react";
import type { ModelConfig, CreateModelConfigDto } from "@/type/modelconfig";

/**
 * 模型配置对话框Hook返回类型
 */
export interface UseModelConfigDialogReturn {
  /** 对话框是否打开 */
  isOpen: boolean;
  /** 打开对话框 */
  open: () => void;
  /** 关闭对话框 */
  close: () => void;
  /** 正在编辑的配置(null表示创建模式) */
  editingConfig: ModelConfig | null;
  /** 是否为编辑模式 */
  isEditMode: boolean;
  /** 表单数据 */
  formData: CreateModelConfigDto;
  /** 设置表单数据 */
  setFormData: Dispatch<SetStateAction<CreateModelConfigDto>>;
  /** 更新表单字段 */
  updateField: <K extends keyof CreateModelConfigDto>(
    key: K,
    value: CreateModelConfigDto[K]
  ) => void;
  /** 重置表单 */
  resetForm: () => void;
  /** 开始创建(打开对话框并重置表单) */
  startCreate: () => void;
  /** 开始编辑(打开对话框并填充数据) */
  startEdit: (config: ModelConfig) => void;
}

/** 默认表单数据 */
const defaultFormData: CreateModelConfigDto = {
  name: "",
  provider: "openai",
  type: "image-gen",
  baseUrl: "",
  apiKey: "",
  enabled: true,
  priority: 0,
};

/**
 * 模型配置对话框Hook
 *
 * 管理创建/编辑对话框的状态和表单数据
 *
 * @example
 * ```tsx
 * const dialog = useModelConfigDialog();
 *
 * // 创建
 * <Button onClick={dialog.startCreate}>添加配置</Button>
 *
 * // 编辑
 * <Button onClick={() => dialog.startEdit(config)}>编辑</Button>
 *
 * // 对话框
 * <Dialog open={dialog.isOpen} onOpenChange={dialog.close}>
 *   <Input
 *     value={dialog.formData.name}
 *     onChange={(e) => dialog.updateField("name", e.target.value)}
 *   />
 * </Dialog>
 * ```
 */
export function useModelConfigDialog(): UseModelConfigDialogReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<ModelConfig | null>(null);
  const [formData, setFormData] = useState<CreateModelConfigDto>(defaultFormData);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const updateField = <K extends keyof CreateModelConfigDto>(
    key: K,
    value: CreateModelConfigDto[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetForm = () => {
    setFormData(defaultFormData);
  };

  const startCreate = () => {
    setEditingConfig(null);
    resetForm();
    open();
  };

  const startEdit = (config: ModelConfig) => {
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
    open();
  };

  const isEditMode = editingConfig !== null;

  return {
    isOpen,
    open,
    close,
    editingConfig,
    isEditMode,
    formData,
    setFormData,
    updateField,
    resetForm,
    startCreate,
    startEdit,
  };
}
