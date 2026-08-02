"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogoIcon } from "@/components/ui/logo";
import { signIn } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await signIn.email({
      email,
      password,
    });

    setLoading(false);

    if (res.error) {
      setError(res.error.message || "Something went wrong.");
    } else {
      router.push("/dashboard");
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
          Welcome back
        </h1>
        <p className="text-[14px] text-text-secondary">
          Sign in to access your Zeus Capital brokerage account.
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

          <div className="flex flex-col gap-xs">
            <div className="flex justify-between items-center">
              <Label
                htmlFor="password"
                className="text-xs font-semibold text-text-secondary uppercase tracking-wider"
              >
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-xs text-text-secondary hover:text-text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
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
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </form>
      </Card>

      {/* Links */}
      <p className="text-[14px] text-center text-text-secondary">
        Don't have an account?{" "}
        <Link
          href="/sign-up"
          className="text-text-primary font-semibold hover:underline"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}
