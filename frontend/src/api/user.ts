import {
  CreateUserDto,
  LoginCredentials,
  LoginData,
  UpdateUserDto,
  UserListData,
  UserListQuery,
} from "@/type/user";
import { api } from ".";

export function loginApi(credentials: LoginCredentials) {
  return api.post<LoginData>("/api/auth/login", credentials);
}

export function getUserListApi(query: UserListQuery = {}) {
  return api.get<UserListData[]>("/api/user", { params: query });
}

export function createUserApi(payload: CreateUserDto) {
  return api.post<UserListData>("/api/user", payload);
}

export function updateUserApi(id: number, payload: UpdateUserDto) {
  return api.patch<UserListData>(`/api/user/${id}`, payload);
}
