import {
  ArrowDownCircle,
  ArrowLeftRight,
  ArrowUpCircle,
  ArrowUpDown,
  Cpu,
  LayoutDashboard,
  MessageSquare,
  ShieldCheck,
  Sliders,
  Users
} from "lucide-react";
import type { ReactNode } from "react";

export type SidebarNavItem = {
  title: string;
  path?: string;
  icon?: ReactNode;
  isActive?: boolean;
  subItems?: SidebarNavItem[];
};

export type SidebarNavGroup = {
  label?: string;
  items: SidebarNavItem[];
};

export const navGroups: SidebarNavGroup[] = [
  {
    items: [
      {
        title: "Overview",
        path: "/admin",
        icon: <LayoutDashboard />,
      },
    ],
  },
  {
    label: "Management",
    items: [
      {
        title: "Users",
        path: "/admin/users",
        icon: <Users />,
      },
      {
        title: "KYC Verification",
        path: "/admin/kyc",
        icon: <ShieldCheck />,
      },
      {
        title: "Support Chat",
        path: "/admin/chat",
        icon: <MessageSquare />,
      },
    ],
  },
  {
    label: "Financials",
    items: [
      {
        title: "Deposits and Withdrawals",
        path: "/admin/deposits",
        icon: <ArrowUpDown />,
      },
      {
        title: "Transactions",
        path: "/admin/transactions",
        icon: <ArrowLeftRight />,
      },
    ],
  },
  {
    label: "System & Control",
    items: [
      {
        title: "Mining Power",
        path: "/admin/mining",
        icon: <Cpu />,
      },
      {
        title: "Price Overrides",
        path: "/admin/prices",
        icon: <Sliders />,
      },
    ],
  },
];

export const navLinks: SidebarNavItem[] = [
  ...navGroups.flatMap((group) =>
    group.items.flatMap((item) =>
      item.subItems?.length ? [item, ...item.subItems] : [item],
    ),
  ),
];
