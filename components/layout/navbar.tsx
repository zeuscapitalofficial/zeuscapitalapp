"use client";

import { ArrowRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { LogoIcon } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  const links = [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="absolute top-0 z-50 w-full bg-[#F5F5F5]/80 backdrop-blur-md border-b border-[rgba(0,0,0,0.04)]">
      <div className="max-w-[88rem] mx-auto px-lg h-2xl flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-sm active:scale-[0.98] transition-transform"
        >
          <LogoIcon className="text-[#000000]" size={28} />
          <span className="font-sans font-semibold text-[18px] tracking-tight text-[#000000]">
            Zeus Capital
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-xl">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "font-sans text-[14px] font-medium tracking-tight text-[rgba(0,0,0,0.55)] hover:text-[#000000] transition-colors duration-150",
                  isActive && "text-[#000000]",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-md">
          <Link href="/login">
            <Button variant="ghost" className="px-5 text-[14px]">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button
              variant="primary"
              className="px-6 py-2.5 text-[14px]"
              icon={<ArrowRight size={14} />}
            >
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={toggleMenu}
          className="md:hidden p-xs text-[#000000] hover:bg-[rgba(0,0,0,0.04)] rounded-full transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-2xl bg-[#F5F5F5] z-40 flex flex-col px-lg py-xl gap-xl animate-in fade-in slide-in-from-top duration-200">
          <nav className="flex flex-col gap-lg">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="font-sans text-[18px] font-semibold tracking-tight text-[rgba(0,0,0,0.7)] hover:text-[#000000] py-xs"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="h-[1px] bg-[rgba(0,0,0,0.08)] my-xs" />

          <div className="flex flex-col gap-sm w-full">
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="w-full"
            >
              <Button variant="secondary" className="w-full justify-center">
                Sign In
              </Button>
            </Link>
            <Link
              href="/register"
              onClick={() => setIsOpen(false)}
              className="w-full"
            >
              <Button variant="primary" className="w-full justify-center">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
