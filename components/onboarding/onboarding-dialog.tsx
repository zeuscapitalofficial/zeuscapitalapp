"use client";

import { useEffect, useState } from "react";
import {
  User,
  MapPin,
  Globe,
  Camera,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/lib/i18n/i18n-context";

const avatarPresets = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
];

export function OnboardingDialog() {
  const { data: session } = useSession();
  const user = session?.user;
  const { language, setLanguage } = useTranslation();

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [photoUrl, setPhotoUrl] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("United States");
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      if (user.image) setPhotoUrl(user.image);

      // Check if user has already completed onboarding
      const completed = localStorage.getItem(`onboarding-completed-${user.id}`);
      if (!completed && (!user.image || !name)) {
        setOpen(true);
      }
    }
  }, [user]);

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: photoUrl || undefined,
          name: name.trim(),
          phoneNumber,
          country,
          currency,
        }),
      });

      if (!res.ok) throw new Error("Failed to save onboarding details");

      localStorage.setItem(`onboarding-completed-${user.id}`, "true");
      toast.success("Welcome to Zeus Capital! Account setup complete.");
      setOpen(false);
    } catch (e: any) {
      toast.error(e.message || "Failed to complete onboarding.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-90 border-border bg-card">
        <DialogHeader>
          <div className="flex items-center gap-2 text-xs font-bold text-accent-foreground uppercase tracking-wider mb-1">
            <Sparkles className="size-4" /> Welcome Onboarding
          </div>
          <DialogTitle className="text-lg font-bold text-foreground">
            {step === 1
              ? "Profile Photo"
              : step === 2
              ? "Personal Information"
              : "Preferences & Localization"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Step {step} of 3 — Let's personalize your Zeus Capital account.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleComplete} className="space-y-5 py-2">
          {/* Step 1: Photo */}
          {step === 1 && (
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <Avatar className="size-24 border-2 border-accent-foreground/30 shadow-md">
                  <AvatarImage src={photoUrl || undefined} />
                  <AvatarFallback className="text-2xl font-bold bg-accent-foreground/10 text-accent-foreground">
                    {name.slice(0, 2).toUpperCase() || "ZC"}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="space-y-1.5 text-left">
                <Label className="text-xs font-semibold">Custom Photo URL</Label>
                <Input
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="text-xs h-9"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <Label className="text-xs font-semibold text-muted-foreground block">
                  Or select a preset avatar:
                </Label>
                <div className="flex justify-center gap-3">
                  {avatarPresets.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPhotoUrl(url)}
                      className={`size-10 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                        photoUrl === url
                          ? "border-accent-foreground ring-2 ring-accent-foreground/30 scale-105"
                          : "border-border hover:border-accent-foreground/50"
                      }`}
                    >
                      <img src={url} alt={`Preset ${idx}`} className="size-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <Button
                type="button"
                onClick={() => setStep(2)}
                className="w-full bg-accent-foreground text-background hover:bg-accent-foreground/90 text-xs h-9 gap-1.5 cursor-pointer mt-2"
              >
                Continue to Personal Details <ArrowRight className="size-3.5" />
              </Button>
            </div>
          )}

          {/* Step 2: Personal Details */}
          {step === 2 && (
            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="onboard-name" className="text-xs font-semibold">
                  Full Legal Name
                </Label>
                <Input
                  id="onboard-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-xs h-9"
                  placeholder="e.g. Alexander Wright"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="onboard-phone" className="text-xs font-semibold">
                  Phone Number
                </Label>
                <Input
                  id="onboard-phone"
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="text-xs h-9"
                  placeholder="+1 (555) 019-2834"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="onboard-country" className="text-xs font-semibold">
                  Country of Residence
                </Label>
                <Input
                  id="onboard-country"
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="text-xs h-9"
                  placeholder="United States"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 text-xs h-9 cursor-pointer"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 bg-accent-foreground text-background hover:bg-accent-foreground/90 text-xs h-9 gap-1.5 cursor-pointer"
                >
                  Next Step <ArrowRight className="size-3.5" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Preferences */}
          {step === 3 && (
            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Preferred Language</Label>
                <Select
                  value={language}
                  onValueChange={(val: any) => setLanguage(val)}
                >
                  <SelectTrigger className="text-xs h-9 w-full">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English (US)</SelectItem>
                    <SelectItem value="es">Spanish (Español)</SelectItem>
                    <SelectItem value="fr">French (Français)</SelectItem>
                    <SelectItem value="de">German (Deutsch)</SelectItem>
                    <SelectItem value="zh">Chinese (中文)</SelectItem>
                    <SelectItem value="ja">Japanese (日本語)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Primary Display Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="text-xs h-9 w-full">
                    <SelectValue placeholder="Select Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($) - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR (€) - Euro</SelectItem>
                    <SelectItem value="GBP">GBP (£) - British Pound</SelectItem>
                    <SelectItem value="JPY">JPY (¥) - Japanese Yen</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1 text-xs h-9 cursor-pointer"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-9 gap-1.5 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" /> Setting Up...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="size-3.5" /> Complete Setup
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
