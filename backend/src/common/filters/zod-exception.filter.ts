import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { ZodValidationException } from 'nestjs-zod';
import { ZodError } from 'zod';
import { fail } from '../result';

/**
 * Zod 验证异常过滤器
 * 将 Zod 验证错误转换为统一的响应格式
 */
@Catch(ZodValidationException)
export class ZodExceptionFilter implements ExceptionFilter {
  catch(exception: ZodValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // 获取 Zod 错误详情
    const zodErrors = exception.getZodError() as ZodError;

    // 格式化错误消息
    const errorMessages = zodErrors.issues.map((issue) => {
      const field = issue.path.join('.');
      return `${field}: ${issue.message}`;
    });

    const message = `验证失败: ${errorMessages.join('; ')}`;

    // 返回统一的失败响应格式
    response.status(400).json(fail(message, zodErrors.issues));
  }
}
