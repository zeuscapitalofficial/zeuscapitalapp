"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogoIcon } from "@/components/ui/logo";
import { signUp } from "@/lib/auth-client";

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refParam = searchParams.get("ref") || searchParams.get("referral") || "";

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [referralCode, setReferralCode] = useState("");

  useEffect(() => {
    if (refParam) {
      setReferralCode(refParam);
    }
  }, [refParam]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const code = formData.get("referralCode") as string;

    const res = await signUp.email({
      name,
      email,
      password,
    });

    if (res.error) {
      setLoading(false);
      setError(res.error.message || "Something went wrong.");
    } else {
      // Post signup referral processing
      const activeCode = code || referralCode;
      if (activeCode) {
        try {
          await fetch("/api/user/referrals/claim", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ referralCode: activeCode, email }),
          });
        } catch (e) {
          console.error("Failed to claim referral code:", e);
        }
      }
      setLoading(false);
      router.push("/dashboard");
    }
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-md">
        <div className="flex flex-col gap-xs">
          <Label
            htmlFor="name"
            className="text-xs font-semibold text-text-secondary uppercase tracking-wider"
          >
            Full Name
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="August Renner"
            required
            className="rounded-input-custom border-[rgba(0,0,0,0.08)] bg-transparent text-sm h-10"
          />
        </div>

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
          <Label
            htmlFor="password"
            className="text-xs font-semibold text-text-secondary uppercase tracking-wider"
          >
            Password
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
          <div className="flex items-center justify-between">
            <Label
              htmlFor="referralCode"
              className="text-xs font-semibold text-text-secondary uppercase tracking-wider"
            >
              Referral Code (Optional)
            </Label>
            {referralCode && (
              <span className="text-[11px] font-semibold text-green-600 bg-green-500/10 px-2 py-0.5 rounded-full">
                Applied
              </span>
            )}
          </div>
          <Input
            id="referralCode"
            name="referralCode"
            type="text"
            placeholder="e.g. ZC-89F2A"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            className="rounded-input-custom border-[rgba(0,0,0,0.08)] bg-transparent text-sm h-10 font-mono uppercase"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full text-[14px] font-semibold h-10 mt-xs"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>
    </Card>
  );
}

export default function SignUpPage() {
  return (
    <div className="w-full max-w-[420px] flex flex-col gap-lg p-lg font-sans">
      {/* Logo and Headings */}
      <div className="flex flex-col items-center text-center gap-xs">
        <Link href="/">
          <LogoIcon className="w-10 h-10 text-accent-foreground hover:opacity-85 transition-opacity" />
        </Link>
        <h1 className="text-[28px] md:text-[32px] font-semibold tracking-[-0.02em] mt-sm text-text-primary">
          Create your account
        </h1>
        <p className="text-[14px] text-text-secondary">
          Join Zeus Capital to secure and maximize your wealth.
        </p>
      </div>

      {/* Form with Suspense for searchParams */}
      <Suspense
        fallback={
          <Card
            variant="flat"
            className="p-lg bg-surface-base border border-[rgba(0,0,0,0.06)] rounded-card-custom text-center"
          >
            <p className="text-text-secondary animate-pulse">
              Loading sign-up form...
            </p>
          </Card>
        }
      >
        <SignUpForm />
      </Suspense>

      {/* Links */}
      <p className="text-[14px] text-center text-text-secondary">
        Already have an account?{" "}
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
