import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
	return (
		<div className="overflow-hidden w-full max-w-full">
			<SidebarProvider className="relative h-svh w-full max-w-full">
				<AppSidebar />
				<SidebarInset className="min-w-0 flex-1 overflow-x-hidden md:peer-data-[variant=inset]:ml-0">
					<AppHeader />
					<div className="flex flex-1 select-none flex-col gap-4 overflow-y-auto p-3 sm:p-4 md:p-6 min-w-0">
						{children}
					</div>
				</SidebarInset>
			</SidebarProvider>
		</div>
	);
}
