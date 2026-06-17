import type { LucideIcon } from "lucide-react";
import {
  Bot,
  BrainCircuit,
  FileText,
  Home,
  Settings,
  ShieldAlert,
  Siren,
  Users,
} from "lucide-react";

export type NavItemConfig = {
  icon: LucideIcon;
  labelKey:
    | "nav.dashboard"
    | "nav.threats"
    | "nav.incidents"
    | "nav.aiGovernance"
    | "nav.aiAssistant"
    | "nav.users"
    | "nav.reports"
    | "nav.settings";
  href: string;
};

export const NAV_ITEMS: NavItemConfig[] = [
  { icon: Home, labelKey: "nav.dashboard", href: "/" },
  { icon: ShieldAlert, labelKey: "nav.threats", href: "/threats" },
  { icon: Siren, labelKey: "nav.incidents", href: "/incidents" },
  { icon: BrainCircuit, labelKey: "nav.aiGovernance", href: "/ai-governance" },
  { icon: Bot, labelKey: "nav.aiAssistant", href: "/ai-assistant" },
  { icon: Users, labelKey: "nav.users", href: "/users" },
  { icon: FileText, labelKey: "nav.reports", href: "/reports" },
  { icon: Settings, labelKey: "nav.settings", href: "/settings" },
];

export function normalizeNavPath(path: string): string {
  if (!path || path === "/") return "/";
  return path.replace(/\/+$/, "");
}

export function isNavActive(pathname: string, href: string): boolean {
  return normalizeNavPath(pathname) === normalizeNavPath(href);
}
