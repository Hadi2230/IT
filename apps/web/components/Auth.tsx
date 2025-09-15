"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { logout as apiLogout } from "@/lib/api";
import { useRouter } from "next/navigation";

type User = { id: string; email: string; fullName: string; role: string };

type AuthContextValue = {
  user: User | null;
  token: string | null;
  setUser: (u: User | null) => void;
  setToken: (t: string | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  useEffect(() => {
    const t = localStorage.getItem("accessToken");
    const uRaw = localStorage.getItem("currentUser");
    setTokenState(t);
    if (uRaw) {
      try { setUserState(JSON.parse(uRaw)); } catch { setUserState(null); }
    }
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    token,
    setUser: (u) => {
      setUserState(u);
      if (!u) localStorage.removeItem("currentUser");
      else localStorage.setItem("currentUser", JSON.stringify(u));
    },
    setToken: (t) => {
      setTokenState(t);
      if (!t) localStorage.removeItem("accessToken");
      else localStorage.setItem("accessToken", t);
    },
    logout: () => {
      apiLogout();
      setUserState(null);
      setTokenState(null);
    },
  }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function Protected({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!token) router.replace("/login");
  }, [token, router]);
  if (!token) return null;
  return <>{children}</>;
}

export function RoleGate({ roles, children }: { roles: string[]; children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return null;
  if (!roles.includes(user.role)) return null;
  return <>{children}</>;
}

