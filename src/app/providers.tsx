"use client";

import React from "react";
import { AuthProvider } from "@/auth";

export default function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  return <AuthProvider>{children}</AuthProvider>;
}
