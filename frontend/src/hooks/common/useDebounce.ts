"use client";

import { useState, useEffect } from "react";

/**
 * 防抖Hook
 *
 * 延迟更新值，直到指定的延迟时间内没有新的值变化
 *
 * @param value - 需要防抖的值
 * @param delay - 延迟时间(毫秒)，默认500ms
 *
 * @example
 * ```tsx
 * const [searchTerm, setSearchTerm] = useState("");
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 *
 * // 只有当用户停止输入500ms后才会触发搜索
 * useEffect(() => {
 *   if (debouncedSearchTerm) {
 *     performSearch(debouncedSearchTerm);
 *   }
 * }, [debouncedSearchTerm]);
 * ```
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
