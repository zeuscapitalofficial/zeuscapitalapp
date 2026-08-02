"use client";

import { useState } from "react";
import {
  ShieldAlert,
  Download,
  Trash2,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

export function PrivacySettings() {
  const [downloading, setDownloading] = useState(false);

  const handleExportData = async () => {
    setDownloading(true);
    try {
      const res = await fetch("/api/user/settings/privacy/export");
      if (!res.ok) throw new Error("Failed to export data");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "zeus-capital-user-data.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success("Account data archive exported successfully.");
    } catch (e: any) {
      toast.error(e.message || "Data export failed.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full items-stretch">
      {/* Data Export Card */}
      <Card className="shadow-xs border-border bg-card flex flex-col h-full">
        <CardHeader className="border-b border-border pb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Download className="size-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-foreground">Data Export & Portability</CardTitle>
              <CardDescription className="text-xs">
                Download a complete JSON copy of your personal data & activity history.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-5 space-y-3 text-xs text-muted-foreground flex-1">
          <p>
            Your archive includes account records, transaction history, KYC verification logs, and wallet configurations.
          </p>
          <div className="p-3 rounded-lg border border-border bg-background space-y-1">
            <span className="font-semibold text-foreground block flex items-center gap-1.5">
              <FileCheck className="size-3.5 text-emerald-500" /> GDPR & Privacy Compliant
            </span>
            <p className="text-[11px]">Formatted as machine-readable JSON archive.</p>
          </div>
        </CardContent>

        <CardFooter className="border-t border-border pt-4 justify-end mt-auto shrink-0">
          <Button
            onClick={handleExportData}
            disabled={downloading}
            variant="outline"
            className="text-xs h-9 gap-1.5 cursor-pointer"
          >
            <Download className="size-3.5" />
            {downloading ? "Preparing Export..." : "Download Data Archive"}
          </Button>
        </CardFooter>
      </Card>

      {/* Account Deletion Danger Card */}
      <Card className="shadow-xs border-border bg-card flex flex-col h-full">
        <CardHeader className="border-b border-border pb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <Trash2 className="size-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-rose-600">Delete Account</CardTitle>
              <CardDescription className="text-xs">
                Permanently remove your account credentials and personal records.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-5 space-y-3 flex-1">
          <Alert variant="destructive" className="bg-rose-500/10 border-rose-500/30 text-rose-600 text-xs">
            <ShieldAlert className="size-4 text-rose-500" />
            <AlertTitle className="text-xs font-bold text-rose-600">Irreversible Action</AlertTitle>
            <AlertDescription className="text-[11px] text-rose-600/90 mt-0.5">
              Once requested, all active mining contracts will terminate and remaining balances must be settled.
            </AlertDescription>
          </Alert>
        </CardContent>

        <CardFooter className="border-t border-border pt-4 justify-end mt-auto shrink-0">
          <Button
            variant="destructive"
            onClick={() => toast.info("To request account termination, please contact compliance support.")}
            className="text-xs h-9 gap-1.5 cursor-pointer"
          >
            <Trash2 className="size-3.5" />
            Request Account Deletion
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
