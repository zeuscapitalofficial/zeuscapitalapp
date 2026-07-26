"use client";

import { useState } from "react";
import { Loader2, Trash2, AlertTriangle, Shield, AlertCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

export function PrivacySettings() {
  const { data: session } = useSession();
  const user = session?.user;
  const [deleting, setDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteAccount = async () => {
    if (confirmText !== "DELETE") {
      toast.error("Please type DELETE to confirm");
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch("/api/user/settings/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: "DELETE" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete account");

      toast.success("Account deletion initiated. You will be logged out shortly.");
      setTimeout(() => {
        window.location.href = "/auth/sign-in";
      }, 3000);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete account");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-lg max-w-[620px]">
      {/* Data & Privacy Info */}
      <Card variant="flat" className="p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px]">
        <div className="flex items-center gap-xs">
          <Shield className="w-5 h-5 text-[#8B7CFF]" />
          <h3 className="text-[18px] font-semibold text-white">Privacy & Data</h3>
        </div>
        <p className="text-[13px] text-[rgba(255,255,255,0.48)] font-medium mt-sm">
          Control your personal data and account privacy settings.
        </p>

        <div className="space-y-md mt-lg">
          <div className="flex items-start gap-sm p-md bg-[#09090B] border border-[rgba(255,255,255,0.06)] rounded-[14px]">
            <div className="bg-blue-500/20 p-2 rounded-[10px] flex-shrink-0">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-[14px] font-medium text-white">Data Encryption</p>
              <p className="text-[12px] text-[rgba(255,255,255,0.6)] mt-0.5">
                All your personal data is encrypted at rest using AES-256 encryption.
                Data in transit is protected with TLS 1.3.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-sm p-md bg-[#09090B] border border-[rgba(255,255,255,0.06)] rounded-[14px]">
            <div className="bg-green-500/20 p-2 rounded-[10px] flex-shrink-0">
              <Shield className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-[14px] font-medium text-white">Data Retention</p>
              <p className="text-[12px] text-[rgba(255,255,255,0.6)] mt-0.5">
                We retain your data for as long as your account is active and for 7 years
                after closure for legal and regulatory compliance.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-sm p-md bg-[#09090B] border border-[rgba(255,255,255,0.06)] rounded-[14px]">
            <div className="bg-purple-500/20 p-2 rounded-[10px] flex-shrink-0">
              <Shield className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-[14px] font-medium text-white">Your Rights</p>
              <p className="text-[12px] text-[rgba(255,255,255,0.6)] mt-0.5">
                Under GDPR and other privacy laws, you have the right to access, rectify,
                restrict processing, and request deletion of your personal data.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Danger Zone - Account Deletion */}
      <Card variant="flat" className="p-lg bg-red-500/10 border border-red-500/20 rounded-[20px]">
        <div className="flex items-center gap-xs mb-md">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <h3 className="text-[18px] font-semibold text-white">Danger Zone</h3>
        </div>
        <p className="text-[13px] text-[rgba(255,255,255,0.6)] mb-lg">
          Once you delete your account, there is no going back. Please be certain.
        </p>

        <div className="space-y-md">
          <div className="p-md bg-[#09090B] border border-red-500/20 rounded-[14px]">
            <h4 className="text-[14px] font-semibold text-red-400 mb-sm">What happens when you delete your account:</h4>
            <ul className="space-y-xs text-[13px] text-[rgba(255,255,255,0.72)]">
              <li className="flex items-center gap-xs"><XCircle className="w-4 h-4 text-red-400" /> All mining plans and contracts will be cancelled</li>
              <li className="flex items-center gap-xs"><XCircle className="w-4 h-4 text-red-400" /> Wallet addresses and payment methods removed</li>
              <li className="flex items-center gap-xs"><XCircle className="w-4 h-4 text-red-400" /> Referral network and earnings forfeited</li>
              <li className="flex items-center gap-xs"><XCircle className="w-4 h-4 text-red-400" /> Transaction history archived (not accessible)</li>
              <li className="flex items-center gap-xs"><XCircle className="w-4 h-4 text-red-400" /> Account cannot be recovered after 30 days</li>
            </ul>
          </div>

          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 text-[13px] font-semibold h-10 rounded-[14px]"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete My Account
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#111114] border border-red-500/20 rounded-[20px] max-w-md">
              <DialogHeader>
                <DialogTitle className="text-white">Delete Account</DialogTitle>
                <DialogDescription className="text-[rgba(255,255,255,0.6)]">
                  This action is irreversible. Please type "DELETE" to confirm.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-sm">
                <Label htmlFor="confirmDelete" className="text-xs font-semibold text-[rgba(255,255,255,0.48)] uppercase tracking-wider">
                  Confirmation
                </Label>
                <Input
                  id="confirmDelete"
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Type DELETE to confirm"
                  className="rounded-[14px] border-red-500/30 bg-transparent text-sm h-10 text-white placeholder:text-zinc-400"
                />
              </div>
              <DialogFooter className="flex gap-sm justify-end">
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)} className="h-10 rounded-[14px]">
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={deleting || confirmText !== "DELETE"}
                  className="h-10 rounded-[14px] disabled:opacity-50"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Account"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Card>
    </div>
  );
}