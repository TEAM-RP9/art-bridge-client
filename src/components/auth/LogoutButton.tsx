"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { logout, redirectToLogin } from "@/api";

export default function LogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleClick = async () => {
    setError(undefined);
    if (!window.confirm("Are you sure you want to log out?")) return;
    setIsLoggingOut(true);
    try {
      await logout();
      redirectToLogin();
    } catch {
      setError("Logout failed. Please try again.");
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        variant="outline"
        size="sm"
        isLoading={isLoggingOut}
        onClick={handleClick}
      >
        Logout
      </Button>
      {error ? (
        <p role="alert" aria-live="polite" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}