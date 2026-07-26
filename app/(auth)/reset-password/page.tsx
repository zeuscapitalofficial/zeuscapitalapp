"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogoIcon } from "@/components/ui/logo";
import { authClient } from "@/lib/auth-client";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (!token) {
      setError("Reset token is missing from the URL.");
      setLoading(false);
      return;
    }

    const { error: resetError } = await authClient.resetPassword({
      newPassword: password,
      token,
    });

    setLoading(false);

    if (resetError) {
      setError(
        resetError.message ||
          "Failed to reset password. Link may have expired.",
      );
    } else {
      setSuccess(true);
    }
  }

  if (!token) {
    return (
      <Card
        variant="flat"
        className="p-lg bg-surface-base border border-[rgba(0,0,0,0.06)] rounded-card-custom text-center"
      >
        <div className="bg-destructive/10 text-destructive text-sm rounded-input-custom p-md mb-md font-medium">
          Invalid or missing reset token. Please request a new password reset
          link.
        </div>
        <Link href="/forgot-password" className="w-full">
          <Button className="w-full text-[14px] font-semibold h-10 mt-xs">
            Go to Forgot Password
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card
      variant="flat"
      className="p-lg bg-surface-base border border-[rgba(0,0,0,0.06)] rounded-card-custom"
    >
      {error && (
        <div className="bg-destructive/10 text-destructive text-sm rounded-input-custom p-md mb-md font-medium">
          {error}
        </div>
      )}

      {success ? (
        <div className="flex flex-col gap-md text-center py-md">
          <div className="bg-green-500/10 text-green-600 text-sm rounded-input-custom p-md font-medium">
            Password reset successful! You can now sign in with your new
            password.
          </div>
          <Link href="/sign-in" className="w-full">
            <Button className="w-full text-[14px] font-semibold h-10 mt-xs">
              Go to Sign In
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-md">
          <div className="flex flex-col gap-xs">
            <Label
              htmlFor="password"
              className="text-xs font-semibold text-text-secondary uppercase tracking-wider"
            >
              New Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              minLength={8}
              className="rounded-input-custom border-[rgba(0,0,0,0.08)] bg-transparent text-sm h-10"
            />
          </div>

          <div className="flex flex-col gap-xs">
            <Label
              htmlFor="confirmPassword"
              className="text-xs font-semibold text-text-secondary uppercase tracking-wider"
            >
              Confirm New Password
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              required
              className="rounded-input-custom border-[rgba(0,0,0,0.08)] bg-transparent text-sm h-10"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full text-[14px] font-semibold h-10 mt-xs"
          >
            {loading ? "Resetting password..." : "Reset Password"}
          </Button>
        </form>
      )}
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-[420px] flex flex-col gap-lg p-lg font-sans">
      {/* Logo and Headings */}
      <div className="flex flex-col items-center text-center gap-xs">
        <Link href="/">
          <LogoIcon className="w-10 h-10 text-primary hover:opacity-85 transition-opacity" />
        </Link>
        <h1 className="text-[28px] md:text-[32px] font-semibold tracking-[-0.02em] mt-sm text-text-primary">
          Reset password
        </h1>
        <p className="text-[14px] text-text-secondary">
          Set your new credentials to secure your account.
        </p>
      </div>

      {/* Suspense Boundary for useSearchParams */}
      <Suspense
        fallback={
          <Card
            variant="flat"
            className="p-lg bg-surface-base border border-[rgba(0,0,0,0.06)] rounded-card-custom text-center"
          >
            <p className="text-text-secondary animate-pulse">
              Loading reset request...
            </p>
          </Card>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
