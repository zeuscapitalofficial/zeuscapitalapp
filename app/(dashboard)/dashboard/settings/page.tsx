"use client";

import { useState } from "react";
import { User, Shield, Wallet, Users, Bell, Shield as ShieldIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "@/lib/auth-client";
import { KYCStatusBanner } from "./components/KYCStatusBanner";
import { ProfileSettings } from "./components/ProfileSettings";
import { AddressSettings } from "./components/AddressSettings";
import { PreferencesSettings } from "./components/PreferencesSettings";
import { SecuritySettings } from "./components/SecuritySettings";
import { WalletSettings } from "./components/WalletSettings";
import { ReferralSettings } from "./components/ReferralSettings";
import { NotificationsSettings } from "./components/NotificationsSettings";
import { PrivacySettings } from "./components/PrivacySettings";

export default function SettingsPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const [activeTab, setActiveTab] = useState<
    "account" | "security" | "wallet" | "referral" | "notifications" | "privacy"
  >("account");
  const [kycDismissed, setKycDismissed] = useState(false);

  const tabs = [
    { id: "account", label: "Account Info", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "wallet", label: "Wallet & Payments", icon: Wallet },
    { id: "referral", label: "Referral Program", icon: Users },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy & Data", icon: ShieldIcon },
  ];

  return (
    <div className="flex flex-col gap-lg select-none font-sans text-white bg-[#09090B] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md border-b border-[rgba(255,255,255,0.06)] pb-lg">
        <div className="flex flex-col gap-2">
          <span className="text-[12px] font-semibold text-[rgba(255,255,255,0.48)] uppercase tracking-wider">
            System Preferences
          </span>
          <h1 className="text-[32px] md:text-[36px] font-semibold tracking-[-0.03em] leading-tight text-white">
            Settings
          </h1>
          <p className="text-[15px] text-[rgba(255,255,255,0.72)] font-medium">
            Manage your account, security, wallet, and preferences
          </p>
        </div>
      </div>

      {/* KYC Status Banner */}
      {!kycDismissed && (
        <KYCStatusBanner onDismiss={() => setKycDismissed(true)} />
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col max-w-305">
        <TabsList className="flex gap-1 bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[14px] p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex md-flex-row items-center justify-center gap-xs px-3 py-2 text-[12px] font-semibold rounded-[10px] transition-all data-[state=active]:bg-[#8B7CFF]! data-[state=active]:text-white! data-[state=inactive]:text-[rgba(255,255,255,0.48)] hover:data-[state=inactive]:text-white!"
              >
                <Icon className="text-white hover:text- w-4 h-4" />
                <span className="text-white hidden md:inline">{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="account" className="grid grid-cols-1 md:grid-cols-2 gap-sm grid-flow-row mt-md space-y-sm">
          <ProfileSettings />
          <AddressSettings />
          <PreferencesSettings />
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="mt-md space-y-lg">
          <SecuritySettings />
        </TabsContent>

        {/* Wallet & Payments Tab */}
        <TabsContent value="wallet" className="mt-md">
          <WalletSettings />
        </TabsContent>

        {/* Referral Program Tab */}
        <TabsContent value="referral" className="mt-md">
          <ReferralSettings />
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-md">
          <NotificationsSettings />
        </TabsContent>

        {/* Privacy & Data Tab */}
        <TabsContent value="privacy" className="mt-md">
          <PrivacySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}