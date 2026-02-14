import { LoginCredentials, LoginData, UserListData } from "@/type/user";
import { api } from ".";

export function loginApi(credentials: LoginCredentials) {
  return api.post<LoginData>("/api/auth/login", credentials);
}

export function GetUserListApi() {
  return api.get<UserListData[]>("/api/user");
}
