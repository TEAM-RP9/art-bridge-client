"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import type { AuthResponse, UserRole } from "@/api";
import { getCurrentUser } from "@/api";

export interface AuthUser {
  userId: number;
  email: string;
  role: UserRole;
}

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean | null;
  isInitializing: boolean;
  signIn: (response: AuthResponse) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const signIn = useCallback((response: AuthResponse) => {
    setUser({ userId: response.userId, email: response.email, role: response.role });
    setIsAuthenticated(true);
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  useEffect(() => {
    getCurrentUser()
      .then(signIn)
      .catch(() => signOut())
      .finally(() => setIsInitializing(false));
  }, [signIn, signOut]);

  const value = useMemo(
    () => ({ user, isAuthenticated, isInitializing, signIn, signOut }),
    [user, isAuthenticated, isInitializing, signIn, signOut]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
