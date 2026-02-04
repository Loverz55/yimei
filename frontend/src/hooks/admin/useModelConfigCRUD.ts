"use client";

import { useState } from "react";
import {
  createModelConfigApi,
  updateModelConfigApi,
  deleteModelConfigApi,
  validateModelConfigApi,
} from "@/api/modelconfig";
import type {
  CreateModelConfigDto,
  UpdateModelConfigDto,
  ModelConfig,
} from "@/type/modelconfig";
import { toast } from "sonner";

/**
 * 模型配置CRUD操作Hook配置
 */
export interface UseModelConfigCRUDOptions {
  /** 成功后的回调 */
  onSuccess?: () => void;
  /** 失败后的回调 */
  onError?: (error: Error) => void;
}

/**
 * 模型配置CRUD操作Hook返回类型
 */
export interface UseModelConfigCRUDReturn {
  /** 创建配置 */
  create: (data: CreateModelConfigDto) => Promise<boolean>;
  /** 更新配置 */
  update: (id: number, data: UpdateModelConfigDto) => Promise<boolean>;
  /** 删除配置 */
  remove: (id: number) => Promise<boolean>;
  /** 切换启用/禁用状态 */
  toggleEnabled: (config: ModelConfig) => Promise<boolean>;
  /** 验证配置 */
  validate: (id: number) => Promise<boolean>;
  /** 是否正在提交 */
  submitting: boolean;
}

/**
 * 模型配置CRUD操作Hook
 *
 * 封装所有CRUD操作的逻辑,包括创建、更新、删除、验证和切换启用状态
 *
 * @example
 * ```tsx
 * const { create, update, remove, toggleEnabled, validate, submitting } =
 *   useModelConfigCRUD({
 *     onSuccess: () => reload(),
 *   });
 *
 * // 创建
 * await create(formData);
 *
 * // 更新
 * await update(id, formData);
 *
 * // 删除
 * await remove(id);
 * ```
 */
export function useModelConfigCRUD(
  options: UseModelConfigCRUDOptions = {}
): UseModelConfigCRUDReturn {
  const { onSuccess, onError } = options;
  const [submitting, setSubmitting] = useState(false);

  const create = async (data: CreateModelConfigDto): Promise<boolean> => {
    try {
      setSubmitting(true);
      const res = await createModelConfigApi(data);
      if (res.code === 0) {
        toast.success("配置创建成功");
        if (onSuccess) onSuccess();
        return true;
      } else {
        toast.error("配置创建失败", {
          description: res.msg,
        });
        return false;
      }
    } catch (error: any) {
      toast.error("配置创建失败", {
        description: error.message,
      });
      if (onError) onError(error);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const update = async (
    id: number,
    data: UpdateModelConfigDto
  ): Promise<boolean> => {
    try {
      setSubmitting(true);
      const res = await updateModelConfigApi(id, data);
      if (res.code === 0) {
        toast.success("配置更新成功");
        if (onSuccess) onSuccess();
        return true;
      } else {
        toast.error("配置更新失败", {
          description: res.msg,
        });
        return false;
      }
    } catch (error: any) {
      toast.error("配置更新失败", {
        description: error.message,
      });
      if (onError) onError(error);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (id: number): Promise<boolean> => {
    try {
      const res = await deleteModelConfigApi(id);
      if (res.code === 0) {
        toast.success("配置删除成功");
        if (onSuccess) onSuccess();
        return true;
      } else {
        toast.error("配置删除失败", {
          description: res.msg,
        });
        return false;
      }
    } catch (error: any) {
      toast.error("配置删除失败", {
        description: error.message,
      });
      if (onError) onError(error);
      return false;
    }
  };

  const toggleEnabled = async (config: ModelConfig): Promise<boolean> => {
    try {
      const res = await updateModelConfigApi(config.id, {
        enabled: !config.enabled,
      });
      if (res.code === 0) {
        toast.success(config.enabled ? "配置已禁用" : "配置已启用");
        if (onSuccess) onSuccess();
        return true;
      } else {
        toast.error("操作失败", {
          description: res.msg,
        });
        return false;
      }
    } catch (error: any) {
      toast.error("操作失败", {
        description: error.message,
      });
      if (onError) onError(error);
      return false;
    }
  };

  const validate = async (id: number): Promise<boolean> => {
    try {
      const loadingToast = toast.loading("验证配置中...");
      const res = await validateModelConfigApi(id);
      toast.dismiss(loadingToast);

      if (res.code === 0 && res.data?.valid) {
        toast.success("配置验证成功", {
          description: "API Key 有效",
        });
        return true;
      } else {
        toast.error("配置验证失败", {
          description: res.msg || "API Key 无效",
        });
        return false;
      }
    } catch (error: any) {
      toast.error("配置验证失败", {
        description: error.message,
      });
      if (onError) onError(error);
      return false;
    }
  };

  return {
    create,
    update,
    remove,
    toggleEnabled,
    validate,
    submitting,
  };
}
