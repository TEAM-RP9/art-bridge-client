"use client";
import React, { useState } from "react";
import LoginForm from "../../components/auth/LoginForm";
import RegisterForm from "../../components/auth/RegisterForm";
import type { RegisterableRole } from "@/api";

export default function AuthTestPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | undefined>(undefined);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | undefined>(undefined);
  const [registerRole, setRegisterRole] = useState<RegisterableRole | null>(null);

  const handleLogin = async (data: { email: string; password: string }) => {
    setLoginLoading(true);
    setLoginError(undefined);
    await new Promise(r => setTimeout(r, 1000));
    if (data.email === "fail@example.com") {
      setLoginError("Server error: invalid credentials");
    } else {
      alert(`Login successful!\nEmail: ${data.email}`);
    }
    setLoginLoading(false);
  };

  const handleRegister = async (data: {
    email: string;
    password: string;
    confirmPassword: string;
    role: RegisterableRole;
  }) => {
    setRegisterLoading(true);
    setRegisterError(undefined);
    await new Promise(r => setTimeout(r, 1000));
    if (data.email === "fail@example.com") {
      setRegisterError("Server error: email already in use");
    } else {
      alert(`Register successful!\nEmail: ${data.email}\nRole: ${data.role}`);
    }
    setRegisterLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded shadow">
        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 rounded-l font-semibold ${activeTab === "login" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => setActiveTab("login")}
            type="button"
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 rounded-r font-semibold ${activeTab === "register" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => setActiveTab("register")}
            type="button"
          >
            Register
          </button>
        </div>
        {activeTab === "login" ? (
          <LoginForm isLoading={loginLoading} error={loginError} onSubmit={handleLogin} />
        ) : (
          <RegisterForm
            isLoading={registerLoading}
            error={registerError}
            role={registerRole}
            onRoleChange={setRegisterRole}
            onSubmit={handleRegister}
          />
        )}
        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>Testimiseks kasuta suvalist emaili ja parooli.</p>
          <p><b>fail@example.com</b> annab server errori.</p>
        </div>
      </div>
    </div>
  );
}
