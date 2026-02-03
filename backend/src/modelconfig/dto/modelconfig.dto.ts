import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const createModelSchema = z.object({
  modleId: z.string().min(1, { message: '模型id不能为空' }).describe('模型Id'),
  modleName: z
    .string()
    .min(1, { message: '模型名字不能为空' })
    .optional()
    .describe('模型名字'),
  baseUrl: z.httpUrl({ message: '必须是url格式' }).describe('模型请求url'),
  key: z.string().min(1, { message: '模型key不能为空' }).describe('模型key'),
});

const updateModelSchema = createModelSchema.partial();

export class CreateModelconfigDto extends createZodDto(createModelSchema) {}

export class UpdateModelconfigDto extends createZodDto(updateModelSchema) {}
