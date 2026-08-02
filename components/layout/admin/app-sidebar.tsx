import { Button } from "@/components/ui/button";
import { LogoIcon } from "@/components/ui/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { PlusIcon, SearchIcon } from "lucide-react";
import { navGroups } from "./app-shared";
import { NavGroup } from "./nav-group";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="h-14 justify-center">
        <SidebarMenuButton
          render={
            <a href="#link">
              <LogoIcon />
              <span className="font-medium">Efferd</span>
            </a>
          }
        ></SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenuItem className="flex items-center gap-2">
            <Button
              aria-label="Search conversations"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              size="icon"
              variant="outline"
            >
              <SearchIcon />
              <span className="sr-only">Search conversations</span>
            </Button>
          </SidebarMenuItem>
        </SidebarGroup>
        {navGroups.map((group, index) => (
          <NavGroup key={`sidebar-group-${index}`} {...group} />
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
