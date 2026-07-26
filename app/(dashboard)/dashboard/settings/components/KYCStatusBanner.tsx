"use client";

import { useState, useEffect } from "react";
import { Shield, X, CheckCircle, AlertCircle, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

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

  const getStatusConfig = () => {
    switch (kyc.status) {
      case "APPROVED":
        return {
          icon: CheckCircle,
          bgColor: "bg-green-500/10",
          borderColor: "border-green-500/20",
          textColor: "text-green-400",
          label: "Verified",
          description: "Your identity has been verified. All account features are unlocked.",
        };
      case "PENDING":
        return {
          icon: Clock,
          bgColor: "bg-yellow-500/10",
          borderColor: "border-yellow-500/20",
          textColor: "text-yellow-400",
          label: "Under Review",
          description: "Your KYC documents are being reviewed. This usually takes 24-48 hours.",
        };
      case "REJECTED":
        return {
          icon: AlertCircle,
          bgColor: "bg-red-500/10",
          borderColor: "border-red-500/20",
          textColor: "text-red-400",
          label: "Rejected",
          description: kyc.rejectionReason || "Your KYC submission was rejected. Please review and resubmit.",
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

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
      variant="flat"
      className={`p-md bg-[#111114] border ${config.borderColor} rounded-[16px] max-w-[620px] ${config.bgColor} flex items-center justify-between gap-md`}
    >
      <div className="flex items-center gap-md flex-1 min-w-0">
        <div className={`p-2 rounded-[10px] ${config.bgColor} flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${config.textColor}`} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-xs">
            <Shield className={`w-4 h-4 ${config.textColor}`} />
            <span className={`text-[13px] font-semibold ${config.textColor}`}>KYC Status: {config.label}</span>
          </div>
          <p className="text-[12px] text-[rgba(255,255,255,0.6)] mt-0.5 truncate">{config.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-sm flex-shrink-0">
        {kyc.status === "REJECTED" && (
          <Button
            variant="outline"
            size="sm"
            className="h-8 rounded-[10px] border-[rgba(255,255,255,0.06)] bg-[#111114] text-[12px] font-semibold hover:bg-[#1D1D22]"
            onClick={() => window.location.href = "/dashboard/kyc"}
          >
            Resubmit Documents
          </Button>
        )}
        {kyc.status === "APPROVED" && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 rounded-[10px] text-[rgba(255,255,255,0.48)] hover:text-white"
            onClick={handleDismiss}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </Card>
  );
}