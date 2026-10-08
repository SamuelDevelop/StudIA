"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, AuthResponse } from "@/types";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem("studia_token");
    const savedUser = localStorage.getItem("studia_user");

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        api
          .get<User>("/auth/me")
          .then((res) => {
            setUser(res.data);
            localStorage.setItem("studia_user", JSON.stringify(res.data));
          })
          .catch(() => {
            logout();
          })
          .finally(() => {
            setIsLoading(false);
          });
        return;
      } catch {
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post<AuthResponse>("/auth/login", {
      email,
      password,
    });
    const { token: receivedToken, user: receivedUser } = response.data;
    setToken(receivedToken);
    setUser(receivedUser);
    localStorage.setItem("studia_token", receivedToken);
    localStorage.setItem("studia_user", JSON.stringify(receivedUser));
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await api.post<AuthResponse>("/auth/register", {
      name,
      email,
      password,
    });
    const { token: receivedToken, user: receivedUser } = response.data;
    setToken(receivedToken);
    setUser(receivedUser);
    localStorage.setItem("studia_token", receivedToken);
    localStorage.setItem("studia_user", JSON.stringify(receivedUser));
  };

  const logout = () => {
    try {
      api.post("/auth/logout").catch(() => {});
    } catch {}
    setToken(null);
    setUser(null);
    localStorage.removeItem("studia_token");
    localStorage.removeItem("studia_user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser utilizado dentro de um AuthProvider");
  }
  return context;
}

