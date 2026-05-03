import { useState } from "react";
import { Button, FormField, Input } from "@/components/ui";

interface LoginFormProps {
  isLoading?: boolean;
  error?: string;
  fieldErrors?: { email?: string; password?: string };
  initialEmail?: string;
  onSubmit: (data: { email: string; password: string }) => void;
}

export const LoginForm = ({
  isLoading = false,
  error,
  fieldErrors,
  initialEmail = "",
  onSubmit,
}: LoginFormProps) => {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string } | null>(null);

  const handleSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault();
    setValidationErrors(null);
    const errors: { email?: string; password?: string } = {};
    if (!email) {
      errors.email = "Email is required.";
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      errors.email = "Invalid email address.";
    }
    if (!password) {
      errors.password = "Password is required.";
    }
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    onSubmit({ email, password });
  };

  const emailError = validationErrors?.email ?? fieldErrors?.email;
  const passwordError = validationErrors?.password ?? fieldErrors?.password;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <fieldset disabled={isLoading} className="space-y-4">
        <FormField label="Email" htmlFor="email" error={emailError} required>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="username"
            state={emailError ? "error" : "default"}
          />
        </FormField>
        <FormField label="Password" htmlFor="password" error={passwordError} required>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            state={passwordError ? "error" : "default"}
          />
        </FormField>
        {error && (
          <div className="text-destructive text-sm" aria-live="polite">{error}</div>
        )}
        <Button type="submit" className="w-full" isLoading={isLoading}>
          Log in
        </Button>
      </fieldset>
    </form>
  );
};

export default LoginForm;