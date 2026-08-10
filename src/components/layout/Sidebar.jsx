import { NavLink } from "react-router-dom";
import { X, ShieldCheck } from "lucide-react";
import { navItems } from "./navItems";

function SidebarContent({ onNavigate }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-border">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-white">
          <ShieldCheck size={18} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold tracking-wide text-text">
            RMBF ERODE UNITED
          </p>
          <p className="text-xs text-text-secondary">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4 space-y-1">
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            onClick={onNavigate}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "text-text-secondary hover:bg-primary-light hover:text-secondary",
              ].join(" ")
            }
          >
            <Icon size={18} strokeWidth={2} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border px-5 py-4">
        <p className="text-xs text-text-secondary">
          &copy; {new Date().getFullYear()} RMBF Erode United
        </p>
      </div>
    </div>
  );
}

export default function Sidebar({ mobileOpen, onClose }) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:shrink-0 lg:flex-col lg:border-r lg:border-border lg:bg-card">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <div
        className={[
          "fixed inset-0 z-40 lg:hidden transition-opacity duration-300",
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
        aria-hidden={!mobileOpen}
      >
        <div
          className="absolute inset-0 bg-secondary/40 backdrop-blur-[1px]"
          onClick={onClose}
        />
        <div
          className={[
            "absolute inset-y-0 left-0 w-72 max-w-[80%] bg-card shadow-xl transition-transform duration-300",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
        >
          <button
            onClick={onClose}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:bg-primary-light"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
          <SidebarContent onNavigate={onClose} />
        </div>
      </div>
    </>
  );
}
