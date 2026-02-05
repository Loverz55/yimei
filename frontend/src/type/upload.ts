/**
 * 文件上传相关类型定义
 */

export interface UploadUrlResponse {
  fileId: number;
  key: string;
  url: string;
}

export interface ConfirmUploadRequest {
  fileId: number;
  size?: number;
}

export interface ConfirmUploadResponse {
  fileId: number;
  key: string;
  status: string;
}

export interface FileUrlResponse {
  fileId: number;
  key: string;
  url: string;
  contentType: string;
  size: number;
}
