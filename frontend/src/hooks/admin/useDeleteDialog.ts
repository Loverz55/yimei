"use client";

import { useState } from "react";

/**
 * 删除确认对话框Hook返回类型
 */
export interface UseDeleteDialogReturn<T> {
  /** 对话框是否打开 */
  isOpen: boolean;
  /** 正在删除的项 */
  deletingItem: T | null;
  /** 打开删除确认对话框 */
  openDelete: (item: T) => void;
  /** 关闭对话框 */
  closeDelete: () => void;
  /** 确认删除 */
  confirmDelete: () => Promise<void>;
}

/**
 * 删除确认对话框Hook配置
 */
export interface UseDeleteDialogOptions<T> {
  /** 删除操作函数 */
  onDelete: (item: T) => Promise<boolean>;
  /** 删除成功后的回调 */
  onSuccess?: () => void;
}

/**
 * 删除确认对话框Hook
 *
 * 通用的删除确认对话框管理hook,可用于任何需要删除确认的场景
 *
 * @example
 * ```tsx
 * const deleteDialog = useDeleteDialog<ModelConfig>({
 *   onDelete: async (config) => {
 *     return await crud.remove(config.id);
 *   },
 *   onSuccess: () => {
 *     reload();
 *   },
 * });
 *
 * // 打开删除确认
 * <Button onClick={() => deleteDialog.openDelete(config)}>删除</Button>
 *
 * // 删除确认对话框
 * <AlertDialog open={deleteDialog.isOpen} onOpenChange={deleteDialog.closeDelete}>
 *   <AlertDialogTitle>确认删除 "{deleteDialog.deletingItem?.name}"?</AlertDialogTitle>
 *   <AlertDialogAction onClick={deleteDialog.confirmDelete}>删除</AlertDialogAction>
 * </AlertDialog>
 * ```
 */
export function useDeleteDialog<T>(
  options: UseDeleteDialogOptions<T>
): UseDeleteDialogReturn<T> {
  const { onDelete, onSuccess } = options;

  const [isOpen, setIsOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<T | null>(null);

  const openDelete = (item: T) => {
    setDeletingItem(item);
    setIsOpen(true);
  };

  const closeDelete = () => {
    setIsOpen(false);
    setDeletingItem(null);
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;

    const success = await onDelete(deletingItem);
    if (success) {
      closeDelete();
      if (onSuccess) {
        onSuccess();
      }
    }
  };

  return {
    isOpen,
    deletingItem,
    openDelete,
    closeDelete,
    confirmDelete,
  };
}
