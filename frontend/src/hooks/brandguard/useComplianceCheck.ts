"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/common";
import type { ComplianceCheckResult } from "@/type/brandguard";

/**
 * 合规检测Hook配置
 */
export interface UseComplianceCheckOptions {
  /** 防抖延迟时间(毫秒) */
  debounceDelay?: number;
  /** 检测完成回调 */
  onCheckComplete?: (result: ComplianceCheckResult) => void;
}

/**
 * 合规检测Hook返回类型
 */
export interface UseComplianceCheckReturn {
  /** 检测结果 */
  result: ComplianceCheckResult | null;
  /** 是否正在检测 */
  checking: boolean;
  /** 手动触发检测 */
  checkCompliance: (content: string) => Promise<void>;
  /** 重置状态 */
  reset: () => void;
}

/**
 * 合规检测Hook
 *
 * 封装内容合规检测逻辑,支持防抖和自动检测
 *
 * @example
 * ```tsx
 * const { result, checking, checkCompliance } = useComplianceCheck({
 *   debounceDelay: 500,
 * });
 *
 * // 自动检测会在输入停止500ms后触发
 * // 也可以手动触发
 * await checkCompliance(content);
 * ```
 */
export function useComplianceCheck(
  content: string,
  options: UseComplianceCheckOptions = {}
): UseComplianceCheckReturn {
  const { debounceDelay = 500, onCheckComplete } = options;

  const [result, setResult] = useState<ComplianceCheckResult | null>(null);
  const [checking, setChecking] = useState(false);

  // 对输入内容进行防抖
  const debouncedContent = useDebounce(content, debounceDelay);

  const checkCompliance = async (textContent: string): Promise<void> => {
    if (!textContent) {
      setResult(null);
      return;
    }

    setChecking(true);

    try {
      // TODO: 调用合规检测API
      // const res = await brandguardApi.checkCompliance(textContent);
      // if (res.code === 0 && res.data) {
      //   setResult(res.data);
      //   if (onCheckComplete) {
      //     onCheckComplete(res.data);
      //   }
      // }

      // 模拟检测（API未实现时使用）
      await new Promise((resolve) => setTimeout(resolve, 300));
      const mockResult: ComplianceCheckResult = {
        isCompliant: true,
        violations: [],
      };
      setResult(mockResult);

      if (onCheckComplete) {
        onCheckComplete(mockResult);
      }
    } catch (error) {
      console.error("合规检测失败:", error);
    } finally {
      setChecking(false);
    }
  };

  const reset = () => {
    setResult(null);
    setChecking(false);
  };

  // 监听防抖后的内容变化,自动触发检测
  useEffect(() => {
    if (debouncedContent) {
      checkCompliance(debouncedContent);
    } else {
      setResult(null);
    }
  }, [debouncedContent]);

  return {
    result,
    checking,
    checkCompliance,
    reset,
  };
}
