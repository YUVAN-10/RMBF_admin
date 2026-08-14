import {
  LayoutDashboard,
  Users,
  Newspaper,
  HeartHandshake,
  CalendarDays,
  UsersRound,
  Repeat,
  Share2,
  Award,
  Settings,
} from "lucide-react";

export const navItems = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "Members", to: "/members", icon: Users },
  { label: "News & Events", to: "/news-events", icon: Newspaper },
  { label: "Thank Notes", to: "/thank-notes", icon: HeartHandshake },
  { label: "Referrals", to: "/referrals", icon: Share2 } ,
  { label: " Regular Meetings", to: "/meetings", icon: CalendarDays },
  { label: "Power Team Meetings", to: "/power-team-meetings", icon: UsersRound },
  { label: "R to R", to: "/r-to-r", icon: Repeat },
  { label: "Points", to: "/points", icon: Award },
  { label: "Settings", to: "/settings", icon: Settings },
];
