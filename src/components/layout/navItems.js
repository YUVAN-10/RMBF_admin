import {
  LayoutDashboard,
  Users,
  Newspaper,
  HeartHandshake,
  CalendarDays,
  Repeat,
  Settings,
} from "lucide-react";

export const navItems = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "Members", to: "/members", icon: Users },
  { label: "News & Events", to: "/news-events", icon: Newspaper },
  { label: "Thank Notes", to: "/thank-notes", icon: HeartHandshake },
  { label: "Meetings", to: "/meetings", icon: CalendarDays },
  { label: "R to R", to: "/r-to-r", icon: Repeat },
  { label: "Settings", to: "/settings", icon: Settings },
];
