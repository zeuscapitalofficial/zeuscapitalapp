"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  X,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@/lib/auth-client";

interface KycData {
  status: "PENDING" | "APPROVED" | "REJECTED";
  submittedAt: string;
  rejectionReason?: string;
}

export function KYCStatusBanner({ onDismiss }: { onDismiss: () => void }) {
  const { data: session } = useSession();
  const user = session?.user;
  const [kyc, setKyc] = useState<KycData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const fetchKYC = async () => {
      if (!user) return;
      try {
        const res = await fetch("/api/user/settings/kyc-status");
        if (res.ok) {
          const data = await res.json();
          if (data.kyc) {
            setKyc({
              status: data.kyc.status,
              submittedAt: data.kyc.submittedAt,
              rejectionReason: data.kyc.rejectionReason,
            });
          } else {
            setKyc(null);
          }
        }
      } catch (error) {
        console.error("Failed to fetch KYC status:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchKYC();
  }, [user]);

  useEffect(() => {
    if (kyc?.status === "APPROVED") {
      const dismissedKey = `kyc-dismissed-${user?.id}`;
      const stored = localStorage.getItem(dismissedKey);
      if (stored === "true") {
        setDismissed(true);
      }
    }
  }, [kyc, user]);

  if (loading || !kyc || dismissed) {
    return null;
  }

  const handleDismiss = () => {
    if (kyc.status === "APPROVED") {
      const dismissedKey = `kyc-dismissed-${user?.id}`;
      localStorage.setItem(dismissedKey, "true");
      setDismissed(true);
      onDismiss();
    }
  };

  return (
    <Card
      className={`shadow-xs border ${
        kyc.status === "APPROVED"
          ? "border-emerald-500/30 bg-emerald-500/10"
          : kyc.status === "PENDING"
          ? "border-amber-500/30 bg-amber-500/10"
          : "border-rose-500/30 bg-rose-500/10"
      } max-w-full`}
    >
      <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`size-9 rounded-lg flex items-center justify-center shrink-0 ${
              kyc.status === "APPROVED"
                ? "bg-emerald-500/20 text-emerald-600"
                : kyc.status === "PENDING"
                ? "bg-amber-500/20 text-amber-600"
                : "bg-rose-500/20 text-rose-600"
            }`}
          >
            {kyc.status === "APPROVED" ? (
              <CheckCircle2 className="size-5" />
            ) : kyc.status === "PENDING" ? (
              <Clock className="size-5" />
            ) : (
              <AlertTriangle className="size-5" />
            )}
          </div>

          <div className="min-w-0 space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground">
                Identity Verification: {kyc.status}
              </span>
              <Badge
                variant="outline"
                className={`text-[10px] capitalize ${
                  kyc.status === "APPROVED"
                    ? "border-emerald-500/40 text-emerald-600 bg-emerald-500/20"
                    : kyc.status === "PENDING"
                    ? "border-amber-500/40 text-amber-600 bg-amber-500/20"
                    : "border-rose-500/40 text-rose-600 bg-rose-500/20"
                }`}
              >
                {kyc.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {kyc.status === "APPROVED"
                ? "Your identity is fully verified. Standard withdrawal limits unlocked."
                : kyc.status === "PENDING"
                ? "Your submitted documents are currently under review by compliance team."
                : kyc.rejectionReason || "Verification failed. Please review documents and resubmit."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          {kyc.status === "REJECTED" && (
            <Button
              nativeButton={false}
              render={
                <Link href="/dashboard/kyc">
                  Resubmit Documents <ChevronRight className="size-3.5" />
                </Link>
              }
              size="sm"
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs h-8 gap-1 cursor-pointer"
            />
          )}

          {kyc.status === "APPROVED" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              className="size-8 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
