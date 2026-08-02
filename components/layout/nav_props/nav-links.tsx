import type { LinkItemType } from "./sheard";
import {
  GlobeIcon,
  LayersIcon,
  ShieldIcon,
  BarChart3Icon,
  Cpu,
  UsersIcon,
  StarIcon,
  HandshakeIcon,
  FileTextIcon,
  RotateCcwIcon,
  LeafIcon,
  HelpCircleIcon,
  WalletIcon,
} from "lucide-react";

export const productLinks: LinkItemType[] = [
  {
    label: "Pricing",
    href: "/pricing",
    description: "Institutional spot execution for large digital asset blocks",
    icon: (
      <BarChart3Icon />
    ),
  },
  {
    label: "ASIC Mining Hosting",
    href: "/pricing",
    description: "Lease physical hashrate in our Iceland geothermal facilities",
    icon: (
      <Cpu />
    ),
  },
  {
    label: "Private Custody",
    href: "/about",
    description: "Multi-signature vaults with FIPS 140-2 hardware security",
    icon: (
      <ShieldIcon />
    ),
  },
  {
    label: "Portfolio Dashboard",
    href: "/dashboard",
    description: "Monitor yields, payouts, and asset allocations in real time",
    icon: (
      <LayersIcon />
    ),
  },
  {
    label: "Digital Wallets",
    href: "/dashboard/deposit-withdraw",
    description: "Deposit, withdraw, and manage your ledger balances",
    icon: (
      <WalletIcon />
    ),
  },
  {
    label: "Market Intelligence",
    href: "/dashboard/signals",
    description: "Algorithmic signals and qualitative trade rationale",
    icon: (
      <GlobeIcon />
    ),
  },
];

export const companyLinks: LinkItemType[] = [
  {
    label: "About Zeus Capital",
    href: "/about",
    description: "Our origin, mission, and structural investment philosophy",
    icon: (
      <UsersIcon />
    ),
  },
  {
    label: "Client Testimonials",
    href: "/#testimonials",
    description: "Hear from institutional clients and family offices",
    icon: (
      <StarIcon />
    ),
  },
  {
    label: "Institutional Partnerships",
    href: "/contact",
    icon: (
      <HandshakeIcon />
    ),
    description: "Collaborate with Zeus Capital for institutional deployments",
  },
];

export const companyLinks2: LinkItemType[] = [
  {
    label: "Terms of Service",
    href: "/contact",
    icon: (
      <FileTextIcon />
    ),
  },
  {
    label: "Privacy Policy",
    href: "/contact",
    icon: (
      <ShieldIcon />
    ),
  },
  {
    label: "Refund Policy",
    href: "/contact",
    icon: (
      <RotateCcwIcon />
    ),
  },
  {
    label: "Blog & Insights",
    href: "/#blog",
    icon: (
      <LeafIcon />
    ),
  },
  {
    label: "Help Center",
    href: "/faq",
    icon: (
      <HelpCircleIcon />
    ),
  },
];
