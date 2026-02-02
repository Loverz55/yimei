'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, LoginCredentials } from '@/lib/api';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    const result = await login(credentials);

    if (result.success && result.data) {
      localStorage.setItem('token', result.data.token);
      localStorage.setItem('user', JSON.stringify(result.data.user));
      router.push('/');
    } else {
      setError(result.error || '登录失败');
    }

    setIsLoading(false);
  };

  return {
    login: handleLogin,
    isLoading,
    error,
  };
}
