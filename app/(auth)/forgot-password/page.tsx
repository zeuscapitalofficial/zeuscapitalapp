"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogoIcon } from "@/components/ui/logo";
import { authClient } from "@/lib/auth-client";

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    const { error: resetError } = await authClient.requestPasswordReset({
      email,
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (resetError) {
      setError(resetError.message || "Something went wrong. Please try again.");
    } else {
      setSuccess(true);
    }
  }

  return (
    <div className="w-full max-w-[420px] flex flex-col gap-lg p-lg font-sans">
      {/* Logo and Headings */}
      <div className="flex flex-col items-center text-center gap-xs">
        <Link href="/">
          <LogoIcon className="w-10 h-10 text-accent-foreground hover:opacity-85 transition-opacity" />
        </Link>
        <h1 className="text-[28px] md:text-[32px] font-semibold tracking-[-0.02em] mt-sm text-text-primary">
          Forgot password?
        </h1>
        <p className="text-[14px] text-text-secondary">
          No worries, we'll send you link instructions to reset it.
        </p>
      </div>

      {/* Card containing the form */}
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
              Reset link sent! Please check your email inbox.
            </div>
            <Link href="/sign-in" className="w-full">
              <Button className="w-full text-[14px] font-semibold h-10 mt-xs">
                Return to Sign In
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-md">
            <div className="flex flex-col gap-xs">
              <Label
                htmlFor="email"
                className="text-xs font-semibold text-text-secondary uppercase tracking-wider"
              >
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                className="rounded-input-custom border-[rgba(0,0,0,0.08)] bg-transparent text-sm h-10"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full text-[14px] font-semibold h-10 mt-xs"
            >
              {loading ? "Sending link..." : "Send Reset Link"}
            </Button>
          </form>
        )}
      </Card>

      {/* Links */}
      <p className="text-[14px] text-center text-text-secondary">
        Remember your password?{" "}
        <Link
          href="/sign-in"
          className="text-text-primary font-semibold hover:underline"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}
