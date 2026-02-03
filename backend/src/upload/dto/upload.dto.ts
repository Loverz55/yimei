import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const CrateuploadSchema = z.object({
  contentType: z.string().min(1, { message: '必须要上传类型' }),
});

export class CreateUploadDto extends createZodDto(CrateuploadSchema) {}

// 确认上传成功的DTO
const ConfirmUploadSchema = z.object({
  fileId: z.number().int().positive({ message: '文件ID必须是正整数' }),
  size: z.number().int().positive().optional(), // 文件大小（可选）
});

export class ConfirmUploadDto extends createZodDto(ConfirmUploadSchema) {}

export class UpdateUploadDto {}
