"use client";

import { useState, useEffect } from "react";
import {
  Loader2,
  Shield,
  KeyRound,
  Laptop,
  Smartphone,
  Tablet,
  Lock,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

interface SessionData {
  id: string;
  ipAddress: string;
  userAgent: string;
  deviceType: string;
  browser: string;
  os: string;
  location: string;
  lastActive: string;
  current: boolean;
}

export function SecuritySettings() {
  const { data: session } = useSession();
  const user = session?.user;
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  useEffect(() => {
    fetchSessions();
  }, [user]);

  const fetchSessions = async () => {
    if (!user) return;
    setSessionsLoading(true);
    try {
      const res = await fetch("/api/user/settings/sessions");
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions || []);
      }
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    } finally {
      setSessionsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill out all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match. Please verify.");
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch("/api/user/settings/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to change password");

      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.message || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    setRevokingId(sessionId);
    try {
      const res = await fetch(`/api/user/settings/sessions/${sessionId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to revoke session");

      toast.success("Session revoked");
      fetchSessions();
    } catch (error: any) {
      toast.error(error.message || "Failed to revoke session");
    } finally {
      setRevokingId(null);
    }
  };

  const handleRevokeAllOtherSessions = async () => {
    const otherSessions = sessions.filter((s) => !s.current);
    if (otherSessions.length === 0) return;

    try {
      const res = await fetch("/api/user/settings/sessions/revoke-all", {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to revoke sessions");

      toast.success(`${otherSessions.length} session(s) revoked`);
      fetchSessions();
    } catch (error: any) {
      toast.error(error.message || "Failed to revoke sessions");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {/* Password Change Card */}
      <Card className="shadow-xs border-border bg-card flex flex-col">
        <CardHeader className="border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-accent-foreground/10 text-accent-foreground flex items-center justify-center">
              <KeyRound className="size-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-foreground">Password & Credentials</CardTitle>
              <CardDescription className="text-xs">
                Update your account password to maintain security.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <form onSubmit={handlePasswordSubmit} className="flex-1 flex flex-col">
          <CardContent className="pt-5 space-y-4 flex-1">
            <div className="space-y-1.5">
              <Label htmlFor="current-password" className="text-xs font-semibold text-foreground">
                Current Password
              </Label>
              <Input
                id="current-password"
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                className="text-xs h-9 bg-background"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="new-password" className="text-xs font-semibold text-foreground">
                New Password
              </Label>
              <Input
                id="new-password"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="text-xs h-9 bg-background"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirm-password" className="text-xs font-semibold text-foreground">
                Confirm New Password
              </Label>
              <Input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="text-xs h-9 bg-background"
              />
            </div>
          </CardContent>

          <CardFooter className="border-t border-border pt-4 justify-end mt-auto">
            <Button
              type="submit"
              disabled={passwordLoading}
              className="bg-accent-foreground text-background hover:bg-accent-foreground/90 text-xs h-9 gap-1.5 cursor-pointer"
            >
              {passwordLoading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Lock className="size-3.5" />
                  Update Password
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Active Login Sessions */}
      <Card className="shadow-xs border-border bg-card flex flex-col">
        <CardHeader className="border-b border-border pb-4 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Shield className="size-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-foreground">Active Sessions</CardTitle>
              <CardDescription className="text-xs">
                Devices currently logged into your account.
              </CardDescription>
            </div>
          </div>

          {sessions.filter((s) => !s.current).length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRevokeAllOtherSessions}
              className="text-[11px] h-8 text-rose-600 border-rose-500/30 hover:bg-rose-500/10 cursor-pointer"
            >
              Revoke All Others
            </Button>
          )}
        </CardHeader>

        <CardContent className="pt-4 flex-1">
          {sessionsLoading ? (
            <div className="flex items-center justify-center py-8 text-xs text-muted-foreground gap-2">
              <Loader2 className="size-4 animate-spin text-accent-foreground" />
              Checking active sessions...
            </div>
          ) : sessions.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">
              No active session data found.
            </p>
          ) : (
            <ScrollArea className="max-h-80 pr-2">
              <div className="space-y-3">
                {sessions.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-md bg-muted flex items-center justify-center text-foreground">
                        {s.deviceType === "Mobile" ? (
                          <Smartphone className="size-4" />
                        ) : s.deviceType === "Tablet" ? (
                          <Tablet className="size-4" />
                        ) : (
                          <Laptop className="size-4" />
                        )}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-foreground">
                            {s.browser} on {s.os}
                          </span>
                          {s.current && (
                            <Badge variant="outline" className="text-[10px] bg-emerald-500/15 text-emerald-600 border-emerald-500/30">
                              Current Device
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          Device: {s.os || "Desktop Workstation"} · Location: {s.location || "Verified Location"}
                        </p>
                      </div>
                    </div>

                    {!s.current && (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={revokingId === s.id}
                        onClick={() => handleRevokeSession(s.id)}
                        className="text-xs h-7 text-muted-foreground hover:text-rose-600 cursor-pointer"
                      >
                        {revokingId === s.id ? "Revoking..." : "Revoke"}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
