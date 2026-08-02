"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AppBreadcrumbs } from "./app-breadcrumbs";
import { CustomSidebarTrigger } from "./custom-sidebar-trigger";
import { navLinks } from "./app-shared";
import { NavUser } from "./nav-user";
import { ThemeDropdownToggle } from "@/components/theme/theme-dropdown";
import { SearchDialog } from "@/components/dashboard/search-dialog";
import {
  BellIcon,
  CheckCheckIcon,
  ShieldAlert,
  ShieldCheck,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Info,
  Globe,
  SearchIcon,
} from "lucide-react";
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
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from "@/components/ui/item";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string | Date;
  avatar?: string;
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
    case "DEPOSIT":
      return "bg-emerald-500/15 text-emerald-600 border-emerald-500/30";
    case "WITHDRAWAL":
      return "bg-rose-500/15 text-rose-600 border-rose-500/30";
    case "SECURITY":
      return "bg-purple-500/15 text-purple-600 border-purple-500/30";
    case "WARNING":
      return "bg-amber-500/15 text-amber-600 border-amber-500/30";
    case "SYSTEM":
      return "bg-cyan-500/15 text-cyan-600 border-cyan-500/30";
    default:
      return "bg-sky-500/15 text-sky-600 border-sky-500/30";
  }
}

export function AppHeader() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch("/api/user/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.role === "ADMIN") {
          setIsAdmin(true);
        }
      })
      .catch(() => {});
  }, []);

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

      // Color-Coded Real-Time Sonner Toast
      toast(data.title, {
        description: data.message,
        action: {
          label: "Dismiss",
          onClick: () => {},
        },
      });

      setNotifications((prev) => [data, ...prev.filter((n) => n.id !== data.id)]);
    };

    socket.on("notification:new", handleNewNotification);

    return () => {
      socket.off("notification:new", handleNewNotification);
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
      <div className="flex items-center gap-2 sm:gap-3">
        {isAdmin && (
          <Button
            variant="default"
            size="sm"
            className="h-8 gap-1.5 bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs cursor-pointer shadow-xs"
            render={
            <a href="/admin">
              <ShieldAlert className="size-3.5" />
              <span className="hidden sm:inline">Admin Console</span>
              <span className="sm:hidden">Admin</span>
            </a>}
          >
          </Button>
        )}
        <Button
          aria-label={t("search", "Search platform")}
          size="icon"
          variant="outline"
          onClick={() => setSearchOpen(true)}
          className="relative cursor-pointer"
        >
          <SearchIcon className="size-4 text-muted-foreground" />
        </Button>
        <ThemeDropdownToggle />
        <Popover>
          <PopoverTrigger
            render={
              <Button aria-label="Notifications" size="icon" variant="outline" className="relative cursor-pointer">
                <BellIcon className="size-4" />
                {unreadCount > 0 && (
                  <Badge
                    className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-foreground text-background px-1 text-[10px] font-bold leading-none border border-background"
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Badge>
                )}
              </Button>
            }
          />
          <PopoverContent align="end" className="w-80 p-0 border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-foreground">{t("notifications", "Notifications")}</span>
                {unreadCount > 0 && (
                  <Badge className="bg-accent-foreground/10 text-accent-foreground border-none text-xs">
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
                  {t("mark_all_read", "Mark all read")}
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
                    <EmptyTitle className="text-sm font-medium">{t("no_notifications", "No notifications yet")}</EmptyTitle>
                    <EmptyDescription className="text-xs">
                      Account alerts and transaction updates will appear here.
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
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
