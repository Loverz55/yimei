"use client";

import { useState, useMemo } from "react";

/**
 * 分页配置选项
 */
export interface UsePaginationOptions {
  /** 初始页码，默认1 */
  initialPage?: number;
  /** 初始每页数量，默认20 */
  initialPageSize?: number;
  /** 总数据量 */
  total: number;
}

/**
 * 分页返回类型
 */
export interface UsePaginationReturn {
  /** 当前页码 */
  page: number;
  /** 每页数量 */
  pageSize: number;
  /** 总页数 */
  totalPages: number;
  /** 是否有下一页 */
  hasNextPage: boolean;
  /** 是否有上一页 */
  hasPrevPage: boolean;
  /** 设置页码 */
  setPage: (page: number) => void;
  /** 下一页 */
  nextPage: () => void;
  /** 上一页 */
  prevPage: () => void;
  /** 跳转到第一页 */
  goToFirstPage: () => void;
  /** 跳转到最后一页 */
  goToLastPage: () => void;
}

/**
 * 通用分页Hook
 *
 * 封装分页相关的状态和操作
 *
 * @example
 * ```tsx
 * const { page, totalPages, setPage, nextPage, prevPage } = usePagination({
 *   total: 100,
 *   initialPageSize: 20,
 * });
 *
 * // 页码变化时重新加载数据
 * useEffect(() => {
 *   loadData(page);
 * }, [page]);
 * ```
 */
export function usePagination(
  options: UsePaginationOptions
): UsePaginationReturn {
  const { initialPage = 1, initialPageSize = 20, total } = options;

  const [page, setPage] = useState(initialPage);
  const [pageSize] = useState(initialPageSize);

  const totalPages = useMemo(() => {
    return Math.ceil(total / pageSize);
  }, [total, pageSize]);

  const hasNextPage = useMemo(() => {
    return page < totalPages;
  }, [page, totalPages]);

  const hasPrevPage = useMemo(() => {
    return page > 1;
  }, [page]);

  const nextPage = () => {
    if (hasNextPage) {
      setPage((p) => p + 1);
    }
  };

  const prevPage = () => {
    if (hasPrevPage) {
      setPage((p) => p - 1);
    }
  };

  const goToFirstPage = () => {
    setPage(1);
  };

  const goToLastPage = () => {
    if (totalPages > 0) {
      setPage(totalPages);
    }
  };

  return {
    page,
    pageSize,
    totalPages,
    hasNextPage,
    hasPrevPage,
    setPage,
    nextPage,
    prevPage,
    goToFirstPage,
    goToLastPage,
  };
}
