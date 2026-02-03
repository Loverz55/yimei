import { LoginCredentials, LoginData } from "@/type/user";
import { api } from ".";

export async function loginApi(credentials: LoginCredentials) {
  return api.post<LoginData>("/api/auth/login", credentials);
}
