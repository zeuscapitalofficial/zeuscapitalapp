"use client";

import { useState, useEffect } from "react";
import { Loader2, User, Mail, ShieldCheck, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@/lib/auth-client";
import { ThemeSelectToggle } from "@/components/theme/theme-select";

export function ProfileSettings() {
  const { data: session } = useSession();
  const user = session?.user;
  const [profileName, setProfileName] = useState(user?.name || "");
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (user?.name) {
      setProfileName(user.name);
    }
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) {
      toast.error("Full name cannot be empty.");
      return;
    }

    setProfileLoading(true);
    try {
      const res = await fetch("/api/user/settings/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profileName.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");

      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <Card className="w-full shadow-xs border-border bg-card flex flex-col h-full">
      <CardHeader className="border-b border-border pb-4 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="size-11 border border-border">
              {user?.image && <AvatarImage src={user.image} alt={user.name} />}
              <AvatarFallback className="bg-accent-foreground/10 text-accent-foreground font-bold text-sm">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base font-bold text-foreground">Public Profile</CardTitle>
              <CardDescription className="text-xs">
                Manage your personal identity details and theme preferences.
              </CardDescription>
            </div>
          </div>

          <Badge variant="outline" className="text-xs gap-1 bg-accent-foreground/5 text-accent-foreground border-accent-foreground/20">
            <ShieldCheck className="size-3" />
            Active Account
          </Badge>
        </div>
      </CardHeader>

      <form onSubmit={handleProfileSubmit} className="flex flex-col flex-1">
        <CardContent className="pt-5 space-y-4 flex-1">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-semibold text-foreground">
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              required
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className="text-xs h-9 bg-background"
              placeholder="Your Full Name"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <Label htmlFor="email" className="text-xs font-semibold text-foreground">
                Email Address
              </Label>
              <span className="text-[11px] text-muted-foreground">Primary Login</span>
            </div>
            <Input
              id="email"
              type="email"
              value={user?.email || ""}
              disabled
              className="text-xs h-9 bg-muted/50 cursor-not-allowed"
            />
          </div>

          <div className="pt-2">
            <Label className="text-xs font-semibold text-foreground block mb-1.5">
              Interface Color Theme
            </Label>
            <ThemeSelectToggle />
          </div>
        </CardContent>

        <CardFooter className="border-t border-border pt-4 justify-end mt-auto shrink-0">
          <Button
            type="submit"
            disabled={profileLoading}
            className="bg-accent-foreground text-background hover:bg-accent-foreground/90 text-xs h-9 gap-1.5 cursor-pointer"
          >
            {profileLoading ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="size-3.5" />
                Save Profile Changes
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
