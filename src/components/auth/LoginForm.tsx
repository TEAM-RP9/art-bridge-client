import React, { useState } from "react";

interface LoginFormProps {
  isLoading?: boolean;
  error?: string;
  fieldErrors?: { email?: string; password?: string };
  onSubmit: (data: { email: string; password: string }) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ isLoading = false, error, fieldErrors, onSubmit }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string } | null>(null);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
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
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
      <fieldset disabled={isLoading} className="space-y-4" style={{ opacity: isLoading ? 0.7 : 1 }}>
      <div>
        <label htmlFor="email" className="block mb-1 font-medium">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={isLoading}
          className="w-full border rounded px-3 py-2"
          autoComplete="username"
        />
        {emailError && (
          <div className="text-red-600 text-xs mt-1" aria-live="polite">{emailError}</div>
        )}
      </div>
      <div>
        <label htmlFor="password" className="block mb-1 font-medium">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={isLoading}
          className="w-full border rounded px-3 py-2"
          autoComplete="current-password"
        />
        {passwordError && (
          <div className="text-red-600 text-xs mt-1" aria-live="polite">{passwordError}</div>
        )}
      </div>
      {error && (
        <div className="text-red-600 text-sm" aria-live="polite">{error}</div>
      )}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50 flex items-center justify-center"
        disabled={isLoading}
      >
        {isLoading ? (
          <output
            aria-live="polite"
            className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
            aria-label="Loading"
          />
        ) : null}
        Log in
      </button>
      </fieldset>
    </form>
  );
};

export default LoginForm;
