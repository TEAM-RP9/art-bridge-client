"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import { ApiError, googleLogin, register } from "@/api";
import type { AuthResponse, RegisterableRole } from "@/api";
import { useAuth } from "@/auth";
import { sanitizeNext } from "@/lib/next-param";
import RegisterForm from "@/components/auth/RegisterForm";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const auth = useAuth();
  const rawNext = useMemo(() => searchParams?.get("next") ?? null, [searchParams]);

  const [isLoading, setIsLoading] = useState(false);
  const [googlePending, setGooglePending] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RegisterableRole | null>(null);
  const [error, setError] = useState<string | undefined>(undefined);
  const [fieldErrors, setFieldErrors] = useState<
    { email?: string; password?: string; confirmPassword?: string; role?: string } | undefined
  >(undefined);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const handleSubmit = async (data: {
    email: string;
    password: string;
    confirmPassword?: string;
    role: RegisterableRole;
  }) => {
    setError(undefined);
    setFieldErrors(undefined);
    setSelectedRole(data.role);
    setIsLoading(true);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await register(data.email.trim(), data.password, data.role, {
        signal: controller.signal,
      });
      router.push(`/login?registered=true&email=${encodeURIComponent(response.email)}`);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }
      if (err instanceof ApiError) {
        if (err.status === 400) {
          const mapped: { email?: string; password?: string; confirmPassword?: string; role?: string } = {};
          const unmapped: string[] = [];

          err.fieldErrors?.forEach((fe) => {
            if (fe.field === "email") mapped.email = fe.message;
            else if (fe.field === "password") mapped.password = fe.message;
            else if (fe.field === "confirmPassword") mapped.confirmPassword = fe.message;
            else if (fe.field === "role") mapped.role = fe.message;
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

  const completeLogin = (response: AuthResponse) => {
    auth.signIn(response);
    const fallback = response.role === "ARTIST" ? "/dashboard" : "/discover";
    router.replace(sanitizeNext(rawNext, fallback));
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      setError("Google sign-in was cancelled or failed. Please try again.");
      return;
    }
    if (!selectedRole) {
      setError("Choose how you'd like to use Art Bridge before continuing with Google.");
      return;
    }
    setError(undefined);
    setFieldErrors(undefined);
    setGooglePending(true);

    try {
      const response = await googleLogin(credentialResponse.credential, selectedRole);
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
      setGooglePending(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google sign-in was cancelled or failed. Please try again.");
  };

  const isPending = isLoading || googlePending;

  const formSection = (
    <div className="w-full max-w-sm space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Create an account</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Enter your details below to create your account
        </p>
      </div>

      <RegisterForm
        isLoading={isLoading}
        error={error}
        fieldErrors={fieldErrors}
        role={selectedRole}
        onRoleChange={setSelectedRole}
        onSubmit={handleSubmit}
      />

      {GOOGLE_CLIENT_ID ? (
        <>
          <div className="relative my-6 flex items-center gap-3">
            <span className="flex-grow border-t border-border" />
            <span className="text-xs uppercase tracking-wide text-muted-foreground">or</span>
            <span className="flex-grow border-t border-border" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <div
              className={selectedRole ? "" : "pointer-events-none opacity-50"}
              aria-disabled={!selectedRole}
            >
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="filled_black"
                text="continue_with"
                shape="rectangular"
                size="large"
                width={320}
                useOneTap={false}
              />
            </div>
            {!selectedRole && (
              <p className="text-xs text-muted-foreground">
                Choose how you&apos;d like to use Art Bridge above to enable Google sign-up.
              </p>
            )}
          </div>
        </>
      ) : null}

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline font-medium">
          Sign in
        </Link>
      </p>
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
            aria-live="polite"
          />
        </div>
      )}
      {GOOGLE_CLIENT_ID ? (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID} locale="en">
          {formSection}
        </GoogleOAuthProvider>
      ) : (
        formSection
      )}
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterContent />
    </Suspense>
  );
}
