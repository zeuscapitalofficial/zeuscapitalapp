"use client";

import { AppShell } from "@/components/layout/dashboard/app-shell";
import { GlobalChatbotWidget } from "@/components/layout/dashboard/global-chatbot";
import { OnboardingDialog } from "@/components/onboarding/onboarding-dialog";
import { LogoIcon } from "@/components/ui/logo";
import { useSession } from "@/lib/auth-client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/sign-in");
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans">
        <p className="text-[25px] shimmer shimmer-color-accent-foreground flex flex-col items-center gap-2">
          <LogoIcon size={75} className="animate-pulse"/>
          Loading&hellip;
        </p>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans">
        <p className="text-[15px] shimmer shimmer-color-accent-foreground flex flex-col items-center gap-2">
          <LogoIcon size={75} className="animate-pulse"/>
          Redirecting...
        </p>
      </div>
    );
  }

  return (
    <>
      <AppShell>{children}</AppShell>
      <GlobalChatbotWidget />
      <OnboardingDialog />
    </>
  );
}
