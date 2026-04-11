"use client";
import Link from "next/link";
import React, { useState } from "react";
import LoginForm from "../../components/auth/LoginForm";
import RegisterForm from "../../components/auth/RegisterForm";

export default function AuthTestPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  // TODO: This is for UI testing only! Remove or replace with real API call before production.
  const handleLogin = async (data: any) => {
    setIsLoading(true);
    setError(undefined);
    setTimeout(() => {
      setIsLoading(false);
      setError("[Test] Simuleeritud serveri viga: vale parool või kasutaja ei leitud.");
    }, 1000);
  };

  // TODO: This is for UI testing only! Remove or replace with real API call before production.
  const handleRegister = async (data: any) => {
    setIsLoading(true);
    setError(undefined);
    setTimeout(() => {
      setIsLoading(false);
      setError("[Test] Simuleeritud serveri viga: kasutaja registreerimine ebaõnnestus.");
    }, 1000);
  };

  return (
    <>
      <div className="mx-auto max-w-md px-6 pt-8">
        <Link href="/test" className="inline-block mb-6 text-blue-400 hover:underline">← Back to Test Pages</Link>
      </div>
      <main className="mx-auto max-w-md py-8 px-6">
        <div className="flex gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded ${activeTab === "login" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === "register" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}
            onClick={() => setActiveTab("register")}
          >
            Register
          </button>
        </div>
        {activeTab === "login" ? (
          <LoginForm isLoading={isLoading} error={error} onSubmit={handleLogin} />
        ) : (
          <RegisterForm isLoading={isLoading} error={error} onSubmit={handleRegister} />
        )}
      </main>
    </>
  );
}
