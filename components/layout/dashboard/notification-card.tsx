"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";

const notification = {
  badge: "MARKET INTEL",
  title: "Crypto Market Intelligence",
  description: "Real-time signals and portfolio insights.",
  readMore: { href: "/dashboard/signals", label: "View Signals" },
} as const;

export function NotificationCard() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={cn(
        "group/latest-change cn-rounded size-full min-h-27 justify-center border bg-background",
        "relative flex size-full flex-col gap-1 overflow-hidden px-4 pt-3 pb-1 *:text-nowrap",
        "transition-opacity group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:opacity-0",
      )}
    >
      <span className="font-light font-mono text-[10px] text-muted-foreground">
        {notification.badge}
      </span>
      <p className="font-medium text-xs">{notification.title}</p>
      <span className="text-[10px] text-muted-foreground">
        {notification.description}
      </span>
      <Button
        render={
          <a href={notification.readMore.href}>{notification.readMore.label}</a>
        }
        nativeButton={false}
        className="w-max px-0 font-light text-xs"
        size="sm"
        variant="link"
      />
      <Button
        className="absolute top-2 right-2 z-10 size-6 rounded-full opacity-0 transition-opacity group-hover/latest-change:opacity-100 cursor-pointer"
        onClick={() => setIsOpen(false)}
        size="icon-sm"
        variant="ghost"
      >
        <XIcon className="size-3.5 text-muted-foreground" />
      </Button>
    </div>
  );
}
