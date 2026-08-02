import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { companyLinks, companyLinks2, productLinks } from "./nav-links";
import { LinkItem } from "./sheard";

export function DesktopNav() {
	return (
		<NavigationMenu className="hidden md:flex">
			<NavigationMenuList>
				<NavigationMenuItem className="bg-transparent">
					<NavigationMenuTrigger className="bg-transparent">
						Product
					</NavigationMenuTrigger>
					<NavigationMenuContent className="rounded-lg bg-muted/50 p-1 pr-1.5 dark:bg-background">
						<div className="rounded-lg grid max-w-4xl grid-cols-2 gap-2 border bg-popover p-2 shadow">
							{productLinks.map((item, i) => (
								<NavigationMenuLink key={`item-${item.label}-${i}`}>
									<LinkItem {...item} />
								</NavigationMenuLink>
							))}
						</div>
						<div className="p-2">
							<p className="text-muted-foreground text-sm">
								Interested?{" "}
								<a
									className="font-medium text-foreground hover:underline"
									href="#"
								>
									Schedule a demo
								</a>
							</p>
						</div>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuTrigger className="bg-transparent">
						Company
					</NavigationMenuTrigger>
					<NavigationMenuContent className="rounded-lg bg-muted/50 p-1 pr-1.5 pb-1.5 dark:bg-background">
						<div className="grid max-w-4xl grid-cols-2 gap-2">
							<div className="rounded-lg space-y-2 border bg-popover p-2 shadow">
								{companyLinks.map((item, i) => (
									<NavigationMenuLink key={`item-${item.label}-${i}`}>
										<LinkItem {...item} />
									</NavigationMenuLink>
								))}
							</div>
							<div className="space-y-2 p-3">
								{companyLinks2.map((item, i) => (
									<NavigationMenuLink
										href={item.href}
										key={`item-${item.label}-${i}`}
									>
										{item.icon}
										{item.label}
									</NavigationMenuLink>
								))}
							</div>
						</div>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuLink className="px-4">
					<a className="rounded-md p-2" href="#">
						Pricing
					</a>
				</NavigationMenuLink>
			</NavigationMenuList>
		</NavigationMenu>
	);
}
