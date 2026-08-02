"use client";

import { usePathname } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import type { SidebarNavGroup } from "./app-shared";
import { ChevronRightIcon } from "lucide-react";

export function NavGroup({ label, items }: SidebarNavGroup) {
  const pathname = usePathname();

  const isItemActive = (path?: string) => {
    if (!path) return false;
    const cleanPath = path.split("?")[0].split("#")[0];
    if (cleanPath === "/dashboard" || cleanPath === "/admin") {
      return pathname === cleanPath;
    }
    return pathname === cleanPath || pathname.startsWith(cleanPath + "/");
  };

  return (
    <SidebarGroup>
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item) => {
          const itemActive = isItemActive(item.path);
          const hasSubActive = item.subItems?.some((sub) => isItemActive(sub.path));

          return (
            <Collapsible
              className="group/collapsible"
              defaultOpen={itemActive || hasSubActive}
              key={item.title}
              render={
                <SidebarMenuItem>
                  {item.subItems?.length ? (
                    <>
                      <CollapsibleTrigger
                        render={
                          <SidebarMenuButton isActive={itemActive || hasSubActive}>
                            {item.icon}
                            <span>{item.title}</span>
                            <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        }
                      ></CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.subItems?.map((subItem) => {
                            const subActive = isItemActive(subItem.path);
                            return (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  isActive={subActive}
                                  render={
                                    <a href={subItem.path}>
                                      {subItem.icon}
                                      <span>{subItem.title}</span>
                                    </a>
                                  }
                                ></SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </>
                  ) : (
                    <SidebarMenuButton
                      isActive={itemActive}
                      render={
                        <a href={item.path}>
                          {item.icon}
                          <span>{item.title}</span>
                        </a>
                      }
                    ></SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              }
            ></Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
