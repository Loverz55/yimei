export enum UserRole {
  User = 0,
  Admin = 1,
}

export const UserRoleLabel: Record<UserRole, string> = {
  [UserRole.User]: "普通用户",
  [UserRole.Admin]: "管理员",
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

// 登录返回的 data（后端直接返回用户信息 + token）
export interface LoginData {
  id: number;
  loginId: string;
  nickname: string;
  role: UserRole;
}

// 注册返回的 data
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
