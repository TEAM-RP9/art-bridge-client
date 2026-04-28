"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ApiError, register } from "@/api";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [fieldErrors, setFieldErrors] = useState<
    { email?: string; password?: string; confirmPassword?: string } | undefined
  >(undefined);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const handleSubmit = async (data: { email: string; password: string; confirmPassword?: string }) => {
    setError(undefined);
    setFieldErrors(undefined);
    setIsLoading(true);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await register(data.email.trim(), data.password, { signal: controller.signal });
      router.push(`/login?registered=true&email=${encodeURIComponent(response.email)}`);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }
      if (err instanceof ApiError) {
        if (err.status === 400) {
          const mapped: { email?: string; password?: string; confirmPassword?: string } = {};
          const unmapped: string[] = [];
          
          err.fieldErrors?.forEach((fe) => {
            if (fe.field === "email") mapped.email = fe.message;
            else if (fe.field === "password") mapped.password = fe.message;
            else if (fe.field === "confirmPassword") mapped.confirmPassword = fe.message;
            else unmapped.push(`${fe.field}: ${fe.message}`);
          });

          const hasMapped = Object.keys(mapped).length > 0;
          if (hasMapped) setFieldErrors(mapped);

          if (unmapped.length > 0) {
            setError(unmapped.join(". "));
          } else if (!hasMapped) {
            setError(err.detail || err.title || "Validation failed");
          }
        } else if (err.status === 409) {
          setFieldErrors({ email: "Email already exists" });
        } else {
          setError(err.detail || err.title || "Registration failed");
        }
      } else {
        setError("Registration failed");
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Create an account</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Enter your details below to create your account
          </p>
        </div>

        <RegisterForm isLoading={isLoading} error={error} fieldErrors={fieldErrors} onSubmit={handleSubmit} />

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
