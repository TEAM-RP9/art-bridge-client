"use client";
import { useState } from "react";
import LoginForm from "../../components/auth/LoginForm";

export default function LoginTestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleSubmit = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    setError(undefined);
    // Simuleeri "serveri" vastust
    await new Promise(r => setTimeout(r, 1200));
    if (data.email === "fail@example.com") {
      setError("Server error: invalid credentials");
    } else {
      alert(`Login successful!\nEmail: ${data.email}`);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">LoginForm Test</h1>
        <LoginForm isLoading={isLoading} error={error} onSubmit={handleSubmit} />
        <div className="mt-4 text-xs text-gray-500">
          <p>Testimiseks kasuta suvalist emaili ja parooli.</p>
          <p><b>fail@example.com</b> annab server errori.</p>
        </div>
      </div>
    </div>
  );
}
