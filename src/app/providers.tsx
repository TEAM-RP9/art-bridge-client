"use client";

import { type ReactNode } from "react";
import { AuthProvider } from "@/auth";

export default function Providers({ children }: Readonly<{ children: ReactNode }>) {
  return <AuthProvider>{children}</AuthProvider>;
}
