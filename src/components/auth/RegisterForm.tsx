import { useState } from "react";
import { Button, FormField, Input } from "@/components/ui";
import type { RegisterableRole } from "@/api";
import { cn } from "@/lib/utils";

function getPasswordStrength(pw: string): string {
  if (!pw) return "";
  if (pw.length < 15) return "Too short";
  if (!/[A-Z]/.test(pw)) return "Add uppercase letter";
  if (!/[a-z]/.test(pw)) return "Add lowercase letter";
  if (!/\d/.test(pw)) return "Add number";
  if (!/[^A-Za-z0-9]/.test(pw)) return "Add special character";
  return "Strong";
}

interface RegisterFormProps {
  isLoading?: boolean;
  error?: string;
  fieldErrors?: { email?: string; password?: string; confirmPassword?: string; role?: string };
  role: RegisterableRole | null;
  onRoleChange: (role: RegisterableRole) => void;
  onSubmit: (data: {
    email: string;
    password: string;
    confirmPassword: string;
    role: RegisterableRole;
  }) => void;
}

const ROLE_OPTIONS: ReadonlyArray<{
  value: RegisterableRole;
  title: string;
}> = [
  {
    value: "USER",
    title: "I'm here to discover art",
  },
  {
    value: "ARTIST",
    title: "I'm an artist",
  },
];

export const RegisterForm = ({
  isLoading = false,
  error,
  fieldErrors,
  role,
  onRoleChange,
  onSubmit,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    role?: string;
  } | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<string>("");

  const handlePasswordChange = (e: { target: { value: string } }) => {
    const val = e.target.value;
    setPassword(val);
    setPasswordStrength(getPasswordStrength(val));
  };

  const handleSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault();
    setValidationErrors(null);
    const errors: {
      email?: string;
      password?: string;
      confirmPassword?: string;
      role?: string;
    } = {};

    if (!role) {
      errors.role = "Please choose how you'd like to use Art Bridge.";
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      errors.email = "Email is required.";
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmedEmail)) {
      errors.email = "Invalid email address.";
    }

    if (password) {
      const strength = getPasswordStrength(password);
      if (strength !== "Strong") {
        errors.password = `Password: ${strength}`;
      }
    } else {
      errors.password = "Password is required.";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (password && confirmPassword !== password) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    onSubmit({ email: trimmedEmail, password, confirmPassword, role: role! });
  };

  const emailError = validationErrors?.email ?? fieldErrors?.email;
  const passwordError = validationErrors?.password ?? fieldErrors?.password;
  const confirmPasswordError = validationErrors?.confirmPassword ?? fieldErrors?.confirmPassword;
  const roleError = validationErrors?.role ?? fieldErrors?.role;

  let strengthColor = "text-muted-foreground";
  if (passwordStrength === "Strong") strengthColor = "text-green-600";
  else if (passwordStrength) strengthColor = "text-yellow-600";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <fieldset disabled={isLoading} className="space-y-4">
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Account type</legend>
          <div
            role="radiogroup"
            aria-label="Account type"
            aria-required="true"
            aria-invalid={roleError ? true : undefined}
            className="grid gap-2 sm:grid-cols-2"
          >
            {ROLE_OPTIONS.map((option) => {
              const selected = role === option.value;
              return (
                <label
                  key={option.value}
                  className={cn(
                    "flex cursor-pointer flex-col rounded-md border p-3 text-left transition-colors",
                    selected
                      ? "border-primary bg-primary/5 ring-2 ring-primary"
                      : "border-border hover:bg-accent",
                  )}
                >
                  <input
                    type="radio"
                    name="role"
                    value={option.value}
                    checked={selected}
                    onChange={() => onRoleChange(option.value)}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium">{option.title}</span>
                </label>
              );
            })}
          </div>
          {roleError && (
            <p className="text-xs text-destructive" aria-live="polite">
              {roleError}
            </p>
          )}
        </fieldset>

        <FormField label="Email" htmlFor="email" error={emailError} required>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            state={emailError ? "error" : "default"}
          />
        </FormField>

        <FormField label="Password" htmlFor="password" error={passwordError} required>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            autoComplete="new-password"
            state={passwordError ? "error" : "default"}
          />
          {passwordStrength && (
            <p className={`text-xs mt-1 ${strengthColor}`} aria-live="polite">
              Strength: {passwordStrength}
            </p>
          )}
        </FormField>

        <FormField
          label="Confirm Password"
          htmlFor="confirmPassword"
          error={confirmPasswordError}
          required
        >
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            state={confirmPasswordError ? "error" : "default"}
          />
        </FormField>

        {error && (
          <div className="text-destructive text-sm" aria-live="polite">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" isLoading={isLoading} disabled={!role}>
          Register
        </Button>
      </fieldset>
    </form>
  );
};

export default RegisterForm;
