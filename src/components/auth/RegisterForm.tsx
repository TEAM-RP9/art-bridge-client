
import React, { useState } from "react";
import { Button, FormField, Input } from "@/components/ui";

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
  fieldErrors?: { email?: string; password?: string; confirmPassword?: string };
  onSubmit: (data: { email: string; password: string; confirmPassword: string }) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  isLoading = false,
  error,
  fieldErrors,
  onSubmit,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  } | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<string>("");

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    setPasswordStrength(getPasswordStrength(val));
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationErrors(null);
    const errors: { email?: string; password?: string; confirmPassword?: string } = {};
    
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
    onSubmit({ email: trimmedEmail, password, confirmPassword });
  };

  const emailError = validationErrors?.email ?? fieldErrors?.email;
  const passwordError = validationErrors?.password ?? fieldErrors?.password;
  const confirmPasswordError = validationErrors?.confirmPassword ?? fieldErrors?.confirmPassword;

  const strengthColor =
    passwordStrength === "Strong"
      ? "text-green-600"
      : passwordStrength
      ? "text-yellow-600"
      : "text-muted-foreground";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <fieldset disabled={isLoading} className="space-y-4">
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

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Register
        </Button>
      </fieldset>
    </form>
  );
};

export default RegisterForm;
