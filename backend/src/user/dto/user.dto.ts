import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const roleSchema = z
  .number()
  .int()
  .refine((value) => [0, 1, 2].includes(value), {
    message: 'role must be one of 0(user), 1(doctor), 2(admin)',
  });

const createUserShaema = z.object({
  loginId: z.string().min(1).max(255),
  password: z.string().min(1),
  nickname: z.string().min(1).optional(),
  role: roleSchema.optional(),
});

const updateUserSheama = createUserShaema.partial();

export class CreateUserDto extends createZodDto(createUserShaema) {}

export class UpdateUserDto extends createZodDto(updateUserSheama) {}
