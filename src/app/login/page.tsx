"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import { ApiError, ensureCsrfToken, googleLogin, login } from "@/api";
import type { AuthResponse } from "@/api";
import { useAuth } from "@/auth";
import { sanitizeNext } from "@/lib/next-param";
import LoginForm from "@/components/auth/LoginForm";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const auth = useAuth();

  const next = useMemo(() => sanitizeNext(searchParams.get("next")), [searchParams]);

  const [pending, setPending] = useState<"idle" | "password" | "google">("idle");
  const [error, setError] = useState<string | undefined>(undefined);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string } | undefined>(undefined);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    ensureCsrfToken().catch(() => {});
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const completeLogin = (response: AuthResponse) => {
    auth.signIn(response);
    router.replace(next);
  };

  const handleEmailPassword = async (data: { email: string; password: string }) => {
    setError(undefined);
    setFieldErrors(undefined);
    setPending("password");

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await login(data.email.trim(), data.password, { signal: controller.signal });
      completeLogin(response);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
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
      if (!controller.signal.aborted) setPending("idle");
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      setError("Google sign-in was cancelled or failed. Please try again.");
      return;
    }
    setError(undefined);
    setFieldErrors(undefined);
    setPending("google");

    try {
      const response = await googleLogin(credentialResponse.credential);
      completeLogin(response);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 0) {
          setError("Network error. Please try again.");
        } else if (err.status === 401) {
          setError("Sign-in failed. Please try again.");
        } else {
          setError(err.detail || err.title || "Sign-in failed.");
        }
      } else {
        setError("Sign-in failed. Please try again.");
      }
    } finally {
      setPending("idle");
    }
  };

  const handleGoogleError = () => {
    setError("Google sign-in was cancelled or failed. Please try again.");
  };

  const isPending = pending !== "idle";

  const formSection = (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-semibold mb-6">Sign in</h1>
      <LoginForm
        isLoading={isPending}
        error={error}
        fieldErrors={fieldErrors}
        onSubmit={handleEmailPassword}
      />
      {GOOGLE_CLIENT_ID ? (
        <>
          <div className="relative my-6 flex items-center gap-3">
            <span className="flex-grow border-t border-border" />
            <span className="text-xs uppercase tracking-wide text-muted-foreground">or</span>
            <span className="flex-grow border-t border-border" />
          </div>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="outline"
            text="continue_with"
            shape="rectangular"
            size="large"
            width={320}
            useOneTap={false}
          />
        </>
      ) : null}
    </div>
  );

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      {isPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
          <div
            className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"
            aria-label="Loading"
            role="status"
          />
        </div>
      )}
      {GOOGLE_CLIENT_ID ? (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          {formSection}
        </GoogleOAuthProvider>
      ) : (
        formSection
      )}
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}