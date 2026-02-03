/**
 * 统一响应格式
 */
export interface Result<T = any> {
  code: number; // 0: 成功, 1: 失败
  msg: string;
  data?: T;
}

/**
 * 成功响应
 */
export function success<T = any>(msg: string, data?: T): Result<T> {
  return {
    code: 0,
    msg,
    data,
  };
}

/**
 * 失败响应
 */
export function fail<T = any>(msg: string, data?: T): Result<T> {
  return {
    code: 1,
    msg,
    data,
  };
}
