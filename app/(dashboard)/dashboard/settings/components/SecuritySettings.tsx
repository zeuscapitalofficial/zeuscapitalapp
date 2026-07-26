"use client";

import { useState, useEffect } from "react";
import { Loader2, Shield, LogOut, Activity, MapPin, Monitor, Cpu, Smartphone, Tablet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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
    if (!currentPassword || !newPassword) return;
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
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
    const otherSessions = sessions.filter(s => !s.current);
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

  const parseUserAgent = (ua: string) => {
    let browser = "Unknown";
    let os = "Unknown";
    let deviceType = "Desktop";

    if (ua.includes("Mobile") || ua.includes("Android") || ua.includes("iPhone")) {
      deviceType = ua.includes("iPad") ? "Tablet" : "Mobile";
    } else if (ua.includes("Tablet") || ua.includes("iPad")) {
      deviceType = "Tablet";
    }

    if (ua.includes("Chrome") && !ua.includes("Edg")) browser = "Chrome";
    else if (ua.includes("Firefox")) browser = "Firefox";
    else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
    else if (ua.includes("Edg")) browser = "Edge";

    if (ua.includes("Windows")) os = "Windows";
    else if (ua.includes("Mac OS")) os = "macOS";
    else if (ua.includes("Linux")) os = "Linux";
    else if (ua.includes("Android")) os = "Android";
    else if (ua.includes("iOS") || ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";

    return { browser, os, deviceType };
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case "Mobile": return <Smartphone className="w-4 h-4" />;
      case "Tablet": return <Tablet className="w-4 h-4" />;
      default: return <Cpu className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-lg max-w-[620px]">
      {/* Password Section */}
      <Card
        variant="flat"
        className="p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col gap-md"
      >
        <div className="flex items-center gap-xs">
          <Shield className="w-5 h-5 text-[#8B7CFF]" />
          <h3 className="text-[18px] font-semibold text-white">Change Password</h3>
        </div>
        <p className="text-[13px] text-[rgba(255,255,255,0.48)] font-medium">
          Update your account password. Use a strong, unique password.
        </p>

        <form className="flex flex-col gap-md" onSubmit={handlePasswordSubmit}>
          <div className="flex flex-col gap-xs">
            <Label
              htmlFor="currentPass"
              className="text-xs font-semibold text-[rgba(255,255,255,0.48)] uppercase tracking-wider"
            >
              Current Password
            </Label>
            <Input
              id="currentPass"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="rounded-[14px] border-[rgba(255,255,255,0.08)] bg-transparent text-sm h-10 text-white placeholder:text-zinc-400"
            />
          </div>

          <div className="flex flex-col gap-xs">
            <Label
              htmlFor="newPass"
              className="text-xs font-semibold text-[rgba(255,255,255,0.48)] uppercase tracking-wider"
            >
              New Password
            </Label>
            <Input
              id="newPass"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="rounded-[14px] border-[rgba(255,255,255,0.08)] bg-transparent text-sm h-10 text-white placeholder:text-zinc-400"
            />
          </div>

          <Button
            type="submit"
            disabled={passwordLoading}
            className="w-[140px] bg-[#8B7CFF] hover:bg-[#7A6BEA] text-white text-[13px] font-semibold h-10 rounded-[14px] mt-xs disabled:opacity-50"
          >
            {passwordLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </Button>
        </form>
      </Card>

      {/* Active Sessions Section */}
      <Card
        variant="flat"
        className="p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col gap-md"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-xs">
            <Activity className="w-5 h-5 text-[#8B7CFF]" />
            <h3 className="text-[18px] font-semibold text-white">Active Sessions</h3>
          </div>
          {sessions.filter(s => !s.current).length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRevokeAllOtherSessions}
              className="h-8 rounded-[10px] border-[rgba(255,255,255,0.06)] bg-[#111114] text-[12px] font-semibold hover:bg-[#1D1D22] text-red-400 border-red-500/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Revoke All Others
            </Button>
          )}
        </div>

        {sessionsLoading ? (
          <div className="flex items-center justify-center py-xl">
            <Loader2 className="w-6 h-6 animate-spin text-[#8B7CFF]" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-lg text-[rgba(255,255,255,0.48)]">
            No active sessions found
          </div>
        ) : (
          <div className="space-y-sm">
            {sessions.map((sessionItem) => {
              const { browser, os, deviceType } = parseUserAgent(sessionItem.userAgent);
              const isCurrent = sessionItem.current;

              return (
                <div
                  key={sessionItem.id}
                  className={`flex items-center justify-between p-md bg-[#09090B] border border-[rgba(255,255,255,0.06)] rounded-[14px] ${isCurrent ? "border-[#8B7CFF]/30" : ""}`}
                >
                  <div className="flex items-center gap-md">
                    <div className="bg-[#8B7CFF]/20 p-2 rounded-[10px]">
                      {getDeviceIcon(deviceType)}
                    </div>
                    <div>
                      <div className="flex items-center gap-xs">
                        <span className="text-[14px] font-medium text-white">
                          {browser} on {os}
                        </span>
                        {isCurrent && (
                          <span className="inline-flex items-center gap-xs px-2 py-0.5 rounded-[99px] text-[10px] font-semibold bg-[#8B7CFF]/20 text-[#8B7CFF] uppercase tracking-wider">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-sm text-[12px] text-[rgba(255,255,255,0.48)] mt-0.5">
                        <span className="flex items-center gap-xs">
                          <MapPin className="w-3 h-3" />
                          {sessionItem.location || "Unknown location"}
                        </span>
                        <span className="flex items-center gap-xs">
                          <Activity className="w-3 h-3" />
                          Last active: {new Date(sessionItem.lastActive).toLocaleString()}
                        </span>
                        <span className="flex items-center gap-xs">
                          <Monitor className="w-3 h-3" />
                          {sessionItem.ipAddress}
                        </span>
                      </div>
                    </div>
                  </div>
                  {!isCurrent && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRevokeSession(sessionItem.id)}
                      disabled={revokingId === sessionItem.id}
                      className="text-red-400 hover:bg-red-500/10 h-8 rounded-[10px]"
                    >
                      {revokingId === sessionItem.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <LogOut className="w-4 h-4" />
                      )}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}