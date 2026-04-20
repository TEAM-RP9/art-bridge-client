"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError, login } from "@/api";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string } | undefined>(undefined);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const handleSubmit = async (data: { email: string; password: string }) => {
    setError(undefined);
    setFieldErrors(undefined);
    setIsLoading(true);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      await login(data.email.trim(), data.password, { signal: controller.signal });
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }
      if (err instanceof ApiError) {
        if (err.status === 400) {
          const mapped: { email?: string; password?: string } = {};
          const unmapped: string[] = [];
          for (const fe of err.fieldErrors) {
            if (fe.field === "email" || fe.field === "password") {
              mapped[fe.field] = fe.message;
            } else {
              unmapped.push(fe.message);
            }
          }
          const hasMapped = Object.keys(mapped).length > 0;
          if (hasMapped) setFieldErrors(mapped);
          if (unmapped.length > 0) {
            setError(unmapped.join(" "));
          } else if (!hasMapped) {
            setError(err.detail || "Validation failed");
          }
        } else if (err.status === 401) {
          setError("Invalid email or password");
        } else if (err.status === 0) {
          setError("Network error. Please try again.");
        } else {
          setError(err.detail || err.title || "Login failed");
        }
      } else {
        setError("Login failed");
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <LoginForm
          isLoading={isLoading}
          error={error}
          fieldErrors={fieldErrors}
          onSubmit={handleSubmit}
        />
      </div>
    </main>
  );
}