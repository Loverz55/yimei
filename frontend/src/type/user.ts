export enum UserRole {
  User = 0,
  Doctor = 1,
  Admin = 2,
}

export const UserRoleLabel: Record<UserRole, string> = {
  [UserRole.User]: "普通用户",
  [UserRole.Doctor]: "医生",
  [UserRole.Admin]: "管理员",
};

export const UserRolePermissions: Record<UserRole, string> = {
  [UserRole.User]: "基础功能访问",
  [UserRole.Doctor]: "业务功能 + 医疗配置访问",
  [UserRole.Admin]: "全量后台权限",
};

export interface LoginCredentials {
  loginId: string;
  password: string;
}

export interface User {
  userId: number;
  loginId: string;
  nickname: string;
  role: UserRole;
}

export interface LoginData {
  id: number;
  loginId: string;
  nickname: string;
  role: UserRole;
  token: string;
}

export interface RegisterData {
  user: User;
  token: string;
}

export interface UserListData {
  id: number;
  loginId: string;
  nickname: string;
  role: UserRole;
  createdAt: string;
  updateAt: string;
}

export interface UserListQuery {
  page?: number;
  pageSize?: number;
}

export interface CreateUserDto {
  loginId: string;
  password: string;
  nickname?: string;
  role?: UserRole;
}

export interface UpdateUserDto {
  loginId?: string;
  password?: string;
  nickname?: string;
  role?: UserRole;
}
