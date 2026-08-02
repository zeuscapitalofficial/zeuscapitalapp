"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { LogoIcon } from "@/components/ui/logo";
import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import { DesktopNav } from "./nav_props/desktop-nav";
import { MobileNav } from "./nav_props/mobile-nav";
import { ThemeDropdownToggle } from "../theme/theme-dropdown";

export function Navbar() {
	const scrolled = useScroll(10);

	return (
		<header
			className={cn("sticky top-0 z-50 w-full border-transparent border-b", {
				"border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50":
					scrolled,
			})}
		>
			<nav className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between">
				<div className="flex items-center gap-5">
					<a
						className="rounded-lg pr-3 py-2.5"
						href="/"
					>
						<LogoIcon className="h-6" />
					</a>
					<DesktopNav />
				</div>
				<div className="hidden items-center gap-2 md:flex">
					<ThemeDropdownToggle />
					<Link href="/sign-in">
						<Button variant="outline">Sign In</Button>
					</Link>
					<Link href="/sign-up">
						<Button className="bg-accent dark:bg-accent-foreground hover:bg-accent-foreground dark:hover:bg-accent text-background-foreground">Get Started</Button>
					</Link>
				</div>
				<MobileNav />
			</nav>
		</header>
	);
}
