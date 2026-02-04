"use client";

import { useState } from "react";

/**
 * 对话框返回类型
 */
export interface UseDialogReturn {
  /** 对话框是否打开 */
  isOpen: boolean;
  /** 打开对话框 */
  open: () => void;
  /** 关闭对话框 */
  close: () => void;
  /** 切换对话框状态 */
  toggle: () => void;
  /** 设置对话框状态 */
  setIsOpen: (isOpen: boolean) => void;
}

/**
 * 通用对话框Hook
 *
 * 简化对话框状态管理
 *
 * @example
 * ```tsx
 * const dialog = useDialog();
 *
 * return (
 *   <>
 *     <Button onClick={dialog.open}>打开对话框</Button>
 *     <Dialog open={dialog.isOpen} onOpenChange={dialog.setIsOpen}>
 *       <DialogContent>
 *         <Button onClick={dialog.close}>关闭</Button>
 *       </DialogContent>
 *     </Dialog>
 *   </>
 * );
 * ```
 */
export function useDialog(initialState: boolean = false): UseDialogReturn {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  return {
    isOpen,
    open,
    close,
    toggle,
    setIsOpen,
  };
}
