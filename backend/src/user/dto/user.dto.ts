import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const createUserShaema = z.object({
  loginId: z
    .string()
    .min(1, { message: '必须输入登录id' })
    .max(255, { message: '登录id不得超过255长度' }),
  password: z.string().min(1, { message: '必须输入密码' }),
  nickname: z.optional(z.string().min(1, { message: '昵称长度需要超过1' })),
});

const updateUserSheama = createUserShaema.partial();

export class CreateUserDto extends createZodDto(createUserShaema) {}

export class UpdateUserDto extends createZodDto(updateUserSheama) {}
