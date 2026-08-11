import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, ChevronDown, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const adminName =
    profile?.name ||
    profile?.fullName ||
    profile?.displayName ||
    user?.displayName ||
    (user?.email ? user.email.split("@")[0] : "Administrator");

  const adminEmail = user?.email || "admin@rmbf.com";

  const initials = adminName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "AD";

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setIsOpen(false);
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-1.5 shadow-xs hover:border-primary/50 transition-all cursor-pointer outline-none focus:ring-2 focus:ring-primary/20"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shadow-xs">
          {initials}
        </div>
        <div className="leading-tight text-left hidden sm:block">
          <p className="text-sm font-semibold text-text">{adminName}</p>
          <p className="text-[11px] text-text-secondary font-medium">Administrator</p>
        </div>
        <ChevronDown
          size={16}
          className={`text-text-secondary transition-transform duration-200 ${
            isOpen ? "rotate-180 text-primary" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card p-2 shadow-lg ring-1 ring-black/5 animate-fade-in z-50">
          <div className="px-3 py-2.5 border-b border-border/60">
            <p className="text-sm font-semibold text-text truncate">{adminName}</p>
            <p className="text-xs text-text-secondary truncate mt-0.5">{adminEmail}</p>
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase">
              <ShieldCheck size={12} />
              Administrator
            </span>
          </div>

          <div className="pt-1">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold text-danger hover:bg-danger/10 transition-colors cursor-pointer"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
