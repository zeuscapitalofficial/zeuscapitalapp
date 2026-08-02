"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavGroup } from "./nav-group";
import { footerNavLinks, navGroups } from "./app-shared";
import { NotificationCard } from "./notification-card";
import { PlusIcon, SearchIcon } from "lucide-react";
import { LogoIcon } from "@/components/ui/logo";
import { useTranslation } from "@/lib/i18n/i18n-context";
import { SearchDialog } from "@/components/dashboard/search-dialog";

export function AppSidebar() {
  const { t } = useTranslation();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader className="h-14 justify-center">
          <SidebarMenuButton
            render={
              <a href="/dashboard">
                <LogoIcon />
                <span className="font-semibold tracking-tight text-foreground">Zeus Capital</span>
              </a>
            }
          ></SidebarMenuButton>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenuItem className="flex items-center gap-2">
              <SidebarMenuButton
                render={
                  <a href="/dashboard/deposit-withdraw">
                    <PlusIcon />
                    <span>{t("quick_deposit", "Quick Deposit")}</span>
                  </a>
                }
                className="min-w-8 bg-accent-foreground text-accent duration-200 ease-linear hover:bg-accent-foreground/90 hover:text-accent active:bg-accent-foreground/90 active:text-accent"
                tooltip={t("quick_deposit", "Quick Deposit")}
              />
              <Button
                aria-label={t("search", "Search platform")}
                className="size-8 group-data-[collapsible=icon]:opacity-0 cursor-pointer"
                size="icon"
                variant="outline"
                onClick={() => setSearchOpen(true)}
              >
                <SearchIcon />
                <span className="sr-only">{t("search", "Search platform")}</span>
              </Button>
            </SidebarMenuItem>
          </SidebarGroup>
          {navGroups.map((group, index) => (
            <NavGroup key={`sidebar-group-${index}`} {...group} />
          ))}
        </SidebarContent>
        <SidebarFooter>
          <NotificationCard />
          <SidebarMenu className="mt-2">
            {footerNavLinks.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  className="text-muted-foreground"
                  isActive={item.isActive}
                  size="sm"
                  render={
                    <a href={item.path}>
                      {item.icon}
                      <span>{t(item.i18nKey || "help", item.title)}</span>
                    </a>
                  }
                ></SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
