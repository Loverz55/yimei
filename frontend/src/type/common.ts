/**
 * 通用类型定义
 */

// 后端统一返回格式（已在 api/index.tsx 中定义，这里重新导出供业务使用）
export interface Result<T = any> {
  code: number; // 0: 成功, 1: 失败
  msg: string;
  data?: T;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// 分页信息
export interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// 分页查询参数
export interface PaginationQuery {
  page?: number;
  pageSize?: number;
}
