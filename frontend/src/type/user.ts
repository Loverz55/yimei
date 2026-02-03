export interface LoginCredentials {
  loginId: string;
  password: string;
}

export interface User {
  userId: number;
  loginId: string;
  nickname: string;
  role: number;
}

// 登录返回的 data
export interface LoginData {
  user: User;
  token: string;
}

// 注册返回的 data
export interface RegisterData {
  user: User;
  token: string;
}
