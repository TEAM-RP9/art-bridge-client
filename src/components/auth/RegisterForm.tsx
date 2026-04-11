
import React, { useState } from "react";

function getPasswordStrength(pw: string): string {
  if (!pw) return "";
  if (pw.length < 8) return "Too short";
  if (!/[A-Z]/.test(pw)) return "Add uppercase letter";
  if (!/[a-z]/.test(pw)) return "Add lowercase letter";
  if (!/\d/.test(pw)) return "Add number";
  if (!/[^A-Za-z0-9]/.test(pw)) return "Add special character";
  return "Strong";
}

interface RegisterFormProps {
  isLoading?: boolean;
  error?: string;
  onSubmit: (data: { email: string; password: string; confirmPassword: string }) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ isLoading = false, error, onSubmit }) => {
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
    setPassword(e.target.value);
    setPasswordStrength(getPasswordStrength(e.target.value));
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationErrors(null);
    const errors: { email?: string; password?: string; confirmPassword?: string } = {};
    if (!email) {
      errors.email = "Email is required.";
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
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
    onSubmit({ email, password, confirmPassword });
  };

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
          {validationErrors?.email && (
            <div className="text-red-600 text-xs mt-1" aria-live="polite">{validationErrors.email}</div>
          )}
        </div>
        <div>
          <label htmlFor="password" className="block mb-1 font-medium">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            disabled={isLoading}
            className="w-full border rounded px-3 py-2"
            autoComplete="new-password"
            aria-describedby="password-strength"
          />
          {(() => {
            let strengthClass = "text-gray-500 text-xs mt-1";
            if (passwordStrength === "Strong") strengthClass = "text-green-600 text-xs mt-1";
            else if (passwordStrength) strengthClass = "text-yellow-600 text-xs mt-1";
            return (
              <div id="password-strength" className={strengthClass} aria-live="polite">
                {passwordStrength && passwordStrength !== "Strong" && `Strength: ${passwordStrength}`}
                {passwordStrength === "Strong" && "Strength: Strong"}
              </div>
            );
          })()}
          {validationErrors?.password && (
            <div className="text-red-600 text-xs mt-1" aria-live="polite">{validationErrors.password}</div>
          )}
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block mb-1 font-medium">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            disabled={isLoading}
            className="w-full border rounded px-3 py-2"
            autoComplete="new-password"
          />
          {validationErrors?.confirmPassword && (
            <div className="text-red-600 text-xs mt-1" aria-live="polite">{validationErrors.confirmPassword}</div>
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
          Register
        </button>
      </fieldset>
    </form>
  );
};

export default RegisterForm;
