// Admin navigation: one list drives the sidebar, the ⌘K palette and the "+ New" menu.
import {
  CalendarDays, CalendarRange, CircleHelp, Heart, History, House, Images, Inbox, LayoutDashboard, Newspaper,
  PenLine, Presentation, Settings, Sparkles, Users, Video, type LucideIcon,
} from "lucide-react";
import { COLLECTIONS } from "@/lib/content-registry";

export type Tone = "blue" | "teal" | "purple" | "orange" | "pink" | "red";

export const COLLECTION_META: Record<string, { icon: LucideIcon; tone: Tone }> = {
  news: { icon: Newspaper, tone: "blue" },
  blog: { icon: PenLine, tone: "teal" },
  programs: { icon: Sparkles, tone: "purple" },
  gallery: { icon: Images, tone: "teal" },
  videos: { icon: Video, tone: "orange" },
  posters: { icon: Presentation, tone: "purple" },
  mentors: { icon: Users, tone: "pink" },
  timeline: { icon: History, tone: "orange" },
  faqs: { icon: CircleHelp, tone: "blue" },
  features: { icon: Heart, tone: "pink" },
  events: { icon: CalendarDays, tone: "teal" },
  monthlyPrograms: { icon: CalendarRange, tone: "red" },
};

export const metaFor = (key: string) => COLLECTION_META[key] ?? { icon: Newspaper, tone: "teal" as Tone };

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  group: string;
}

export const NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, group: "Overview" },
  { href: "/admin/home", label: "Home sections", icon: House, group: "Website" },
  { href: "/admin/settings", label: "Site settings", icon: Settings, group: "Website" },
  ...Object.values(COLLECTIONS).map((def) => ({
    href: `/admin/content/${def.key}`,
    label: def.label,
    icon: metaFor(def.key).icon,
    group: "Content",
  })),
  { href: "/admin/submissions", label: "Submissions", icon: Inbox, group: "Inbox" },
];

export const isActiveHref = (pathname: string, href: string) =>
  href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`);
