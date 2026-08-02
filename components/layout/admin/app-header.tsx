"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AppBreadcrumbs } from "./app-breadcrumbs";
import { CustomSidebarTrigger } from "./custom-sidebar-trigger";
import { navLinks } from "./app-shared";
import { NavUser } from "./nav-user";
import { ThemeDropdownToggle } from "@/components/theme/theme-dropdown";
import { BellIcon } from "lucide-react";
import { toast } from "sonner";
import { useSocket } from "@/components/providers/socket-provider";
import { playNotificationSound } from "@/lib/audio-alerts";
import { useTranslation } from "@/lib/i18n/i18n-context";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Item,
  ItemGroup,
  ItemContent,
  ItemTitle,
  ItemDescription,
} from "@/components/ui/item";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string | Date;
}

const activeItem = navLinks.find((item) => item.isActive);

function formatTimeAgo(dateInput: string | Date): string {
  const date = new Date(dateInput);
  const diffInSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffInSeconds < 60) return "just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}

function getTypeBadgeStyle(type: string) {
  switch (type?.toUpperCase()) {
    case "SYSTEM":
      return "bg-cyan-500/15 text-cyan-600 border-cyan-500/30 font-bold";
    case "DEPOSIT":
      return "bg-emerald-500/15 text-emerald-600 border-emerald-500/30";
    case "WITHDRAWAL":
      return "bg-rose-500/15 text-rose-600 border-rose-500/30";
    case "SECURITY":
      return "bg-purple-500/15 text-purple-600 border-purple-500/30";
    case "WARNING":
      return "bg-amber-500/15 text-amber-600 border-amber-500/30";
    default:
      return "bg-sky-500/15 text-sky-600 border-sky-500/30";
  }
}

export function AppHeader() {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setNotifications(data);
        }
      }
    } catch {
      // Silently maintain state on error
    }
  }, []);

  const { socket } = useSocket();

  useEffect(() => {
    fetchNotifications();

    if (!socket) return;

    const handleNewNotification = (data: NotificationItem) => {
      playNotificationSound();

      toast(`[SYSTEM ALERT] ${data.title}`, {
        description: data.message,
        action: {
          label: "View",
          onClick: () => {},
        },
      });

      setNotifications((prev) => [data, ...prev.filter((n) => n.id !== data.id)]);
    };

    socket.on("notification:new", handleNewNotification);
    socket.on("admin:system-alert", handleNewNotification);

    return () => {
      socket.off("notification:new", handleNewNotification);
      socket.off("admin:system-alert", handleNewNotification);
    };
  }, [socket, fetchNotifications]);

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4 md:px-6 bg-background/95 backdrop-blur-xs",
      )}
    >
      <div className="flex items-center gap-3">
        <CustomSidebarTrigger />
        <Separator
          className="mr-2 h-4 data-[orientation=vertical]:self-center"
          orientation="vertical"
        />
        <AppBreadcrumbs page={activeItem} />
      </div>
      <div className="flex items-center gap-3">
        <ThemeDropdownToggle />
        <Popover>
          <PopoverTrigger
            render={
              <Button
                aria-label="Notifications"
                size="icon"
                variant="outline"
                className="relative cursor-pointer"
              >
                <BellIcon className="size-4" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-cyan-600 text-white px-1 text-[10px] font-bold leading-none border border-background">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Badge>
                )}
              </Button>
            }
          />
          <PopoverContent
            align="end"
            className="w-80 p-0 border-border bg-card"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-foreground">Admin Telemetry</span>
                {unreadCount > 0 && (
                  <Badge className="bg-cyan-500/15 text-cyan-600 border-none text-xs">
                    {unreadCount} unread
                  </Badge>
                )}
              </div>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Mark all read
                </Button>
              )}
            </div>
            <ScrollArea className="h-80">
              {notifications.length === 0 ? (
                <Empty className="py-8">
                  <EmptyMedia>
                    <BellIcon className="size-8 text-muted-foreground/50" />
                  </EmptyMedia>
                  <EmptyHeader>
                    <EmptyTitle className="text-sm font-medium">No admin alerts</EmptyTitle>
                    <EmptyDescription className="text-xs">
                      System registrations and audit telemetry will trigger alerts here.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <ItemGroup className="p-2 space-y-1">
                  {notifications.map((item) => (
                    <Item
                      key={item.id}
                      className={cn(
                        "rounded-lg p-2.5 transition-colors cursor-pointer border border-transparent hover:border-border",
                        !item.isRead ? "bg-accent-foreground/5 font-medium" : "opacity-80"
                      )}
                      onClick={() => !item.isRead && handleMarkAsRead(item.id)}
                    >
                      <ItemContent className="space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <ItemTitle className="text-xs font-semibold text-foreground truncate">
                            {item.title}
                          </ItemTitle>
                          <Badge variant="outline" className={`text-[9px] capitalize ${getTypeBadgeStyle(item.type)}`}>
                            {item.type}
                          </Badge>
                        </div>
                        <ItemDescription className="text-[11px] text-muted-foreground line-clamp-2">
                          {item.message}
                        </ItemDescription>
                        <span className="text-[10px] text-muted-foreground/70 block pt-0.5">
                          {formatTimeAgo(item.createdAt)}
                        </span>
                      </ItemContent>
                    </Item>
                  ))}
                </ItemGroup>
              )}
            </ScrollArea>
          </PopoverContent>
        </Popover>
        <NavUser />
      </div>
    </header>
  );
}
