"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";

interface AuthUser {
  id: number;
  email: string;
  full_name?: string | null;
  role?: string;
}

interface LoginResult {
  ok: boolean;
  message?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
  getAuthHeaders: () => Record<string, string>;
  authRequest: <T = unknown>(config: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = "authToken";
const USER_KEY = "authUser";

function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = getStoredUser();
    const storedToken = getStoredToken();
    setUser(storedUser);
    setToken(storedToken);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<LoginResult> => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

    try {
      const response = await axios.post(`${baseUrl}/api/v1/users/login`, {
        email,
        password,
      });

      const data = response.data;

      if (!data?.token) {
        return { ok: false, message: "Login failed. Please try again." };
      }

      const nextUser: AuthUser | null = data?.user ?? null;
      window.localStorage.setItem(TOKEN_KEY, data.token);
      if (nextUser) {
        window.localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
      } else {
        window.localStorage.removeItem(USER_KEY);
      }

      setToken(data.token);
      setUser(nextUser);

      return { ok: true };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error || "Unable to sign in. Please try again.";
        return { ok: false, message };
      }
      return { ok: false, message: "Unable to sign in. Please try again." };
    }
  }, []);

  const getAuthHeaders = useCallback((): Record<string, string> => {
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
  }, [token]);

  const authRequest = useCallback(
    <T,>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
      const headers: Record<string, string> = {
        ...(config.headers as Record<string, string> | undefined),
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      return axios({ ...config, headers });
    },
    [token]
  );

  const logout = useCallback(async () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

    try {
      await authRequest({ url: `${baseUrl}/api/v1/users/logout`, method: "POST" });
    } catch {
      // Ignore logout errors and clear local state anyway
    } finally {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem(USER_KEY);
      setToken(null);
      setUser(null);
    }
  }, [authRequest]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      isLoading,
      login,
      logout,
      getAuthHeaders,
      authRequest,
    }),
    [user, token, isLoading, login, logout, getAuthHeaders, authRequest]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
