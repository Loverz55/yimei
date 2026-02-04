import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// 登录 Schema
const LoginSchema = z.object({
  loginId: z
    .string()
    .min(1, { message: '登录账号不能为空' })
    .describe('登录账号'),
  password: z.string().min(1, { message: '密码不能为空' }).describe('密码'),
});

// 注册 Schema
const RegisterSchema = z.object({
  loginId: z
    .string()
    .min(1, { message: '登录账号不能为空' })
    .describe('登录账号'),
  password: z.string().min(6, { message: '密码至少6位' }).describe('密码'),
  nickname: z.string().optional().describe('昵称'),
});

//token Schema
export const TokenSchema = z.object({
  id: z.number(),
  loginId: z.string(),
  role: z.number(),
});

// 导出 DTO 类
export class LoginDto extends createZodDto(LoginSchema) {}
export class RegisterDto extends createZodDto(RegisterSchema) {}
export class TokenDto extends createZodDto(TokenSchema) {}
