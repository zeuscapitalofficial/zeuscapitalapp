import {
  ActivityIcon,
  ArrowLeftRight,
  CreditCard,
  Gift,
  HelpCircleIcon,
  History,
  LayoutDashboard,
  Package,
  SettingsIcon,
  ShieldCheck,
  TrendingUp
} from "lucide-react";
import type { ReactNode } from "react";

export type SidebarNavItem = {
  title: string;
  i18nKey?: string;
  path?: string;
  icon?: ReactNode;
  isActive?: boolean;
  subItems?: SidebarNavItem[];
};

export type SidebarNavGroup = {
  label?: string;
  labelKey?: string;
  items: SidebarNavItem[];
};

export const navGroups: SidebarNavGroup[] = [
  {
    items: [
      {
        title: "Overview",
        i18nKey: "overview",
        path: "/dashboard",
        icon: <LayoutDashboard />,
        isActive: true,
      },
    ],
  },
  {
    label: "Deposit & Withdraw",
    labelKey: "deposit_withdraw_group",
    items: [
      {
        title: "Transactions",
        i18nKey: "transactions",
        icon: <ArrowLeftRight />,
        subItems: [
          {
            title: "Deposit & Withdraw",
            i18nKey: "deposit_withdraw",
            path: "/dashboard/deposit-withdraw",
            icon: <CreditCard />,
          },
          {
            title: "History",
            i18nKey: "history",
            path: "/dashboard/history",
            icon: <History />,
          },
        ],
      },
    ],
  },
  {
    label: "Apps",
    labelKey: "apps",
    items: [
      {
        title: "Stocks & Markets",
        i18nKey: "stocks_markets",
        path: "/dashboard/stocks",
        icon: <TrendingUp />,
      },
      {
        title: "My Portfolio",
        i18nKey: "my_portfolio",
        path: "/dashboard/portfolio",
        icon: <Package />,
      },
      {
        title: "Packages",
        i18nKey: "packages",
        path: "/dashboard/packages",
        icon: <Package />,
      },
      {
        title: "Signals",
        i18nKey: "signals",
        path: "/dashboard/signals",
        icon: <TrendingUp />,
      },
      {
        title: "Rewards Hub",
        i18nKey: "rewards_hub",
        path: "/dashboard/rewards",
        icon: <Gift />,
      },
      {
        title: "Trading Bots",
        i18nKey: "trading_bots",
        path: "/dashboard/trading-bots",
        icon: <ActivityIcon />,
      },
      {
        title: "AML/KYC",
        i18nKey: "kyc",
        path: "/dashboard/kyc",
        icon: <ShieldCheck />,
      },
    ],
  },
  {
    label: "Workspace",
    labelKey: "workspace",
    items: [
      {
        title: "Settings",
        i18nKey: "settings",
        icon: <SettingsIcon />,
        path: "/dashboard/settings",
      },
    ],
  },
];

export const footerNavLinks: SidebarNavItem[] = [
  {
    title: "Help Center",
    i18nKey: "help",
    path: "/dashboard/help",
    icon: <HelpCircleIcon />,
  },
];

export const navLinks: SidebarNavItem[] = [
  ...navGroups.flatMap((group) =>
    group.items.flatMap((item) =>
      item.subItems?.length ? [item, ...item.subItems] : [item],
    ),
  ),
  ...footerNavLinks,
];
