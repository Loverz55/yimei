"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSetAtom } from "jotai";
import { LoginCredentials } from "@/type/user";
import { loginApi } from "@/api/user";
import { tokenAtom, userInfoAtom } from "@/store/auth";
import { toast } from "sonner";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const setToken = useSetAtom(tokenAtom);
  const setUserInfo = useSetAtom(userInfoAtom);

  const handleLogin = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    const res = await loginApi(credentials);

    if (res.code == 0 && res.data) {
      // 使用 tokenAtom 来管理 token，会自动同步到 localStorage
      setToken(res.data.token);
      setUserInfo(res.data.user);
      toast.success("登录成功");
      router.push("/");
    } else {
      toast.error(res.msg);
      setError(res.msg || "登录失败");
    }

    setIsLoading(false);
  };

  return {
    login: handleLogin,
    isLoading,
    error,
  };
}
