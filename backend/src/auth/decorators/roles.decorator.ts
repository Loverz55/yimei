import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

export enum Role {
  /** 普通用户 */
  USER = 0,
  /** 医生 */
  DOCTOR = 1,
  /** 超级管理员 */
  ADMIN = 2,
}

/**
 * 角色装饰器，用于标记路由所需的用户角色
 * @param roles 允许访问的角色数组
 * @example @Roles(Role.ADMIN) // 仅允许超管访问
 * @example @Roles(Role.ADMIN, Role.DOCTOR) // 允许超管和医生访问
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
