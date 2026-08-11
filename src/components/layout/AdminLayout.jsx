import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, ShieldCheck } from "lucide-react";
import Sidebar from "./Sidebar";
import { MembersProvider } from "../../context/MembersContext";
import { EventsProvider } from "../../context/EventsContext";
import { MeetingsProvider } from "../../context/MeetingsContext";
import { MastersProvider } from "../../context/MastersContext";
import { ThankNotesProvider } from "../../context/ThankNotesContext";
import { RToRProvider } from "../../context/RToRContext";

import ProfileDropdown from "./ProfileDropdown";

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <MembersProvider>
      <EventsProvider>
        <MeetingsProvider>
          <MastersProvider>
            <ThankNotesProvider>
              <RToRProvider>
                <div className="flex min-h-screen bg-bg">
                  <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

                  <div className="flex min-w-0 flex-1 flex-col">
                    {/* Mobile top bar */}
                    <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 lg:hidden">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setMobileOpen(true)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary hover:bg-primary-light hover:text-secondary"
                          aria-label="Open menu"
                        >
                          <Menu size={20} />
                        </button>
                        <div className="flex items-center gap-2.5">
                          <img src="/logo.png" alt="RMBF Logo" className="h-8 w-auto object-contain" />
                          <span className="text-xs font-bold tracking-wider text-text-secondary uppercase">Admin</span>
                        </div>
                      </div>
                      <ProfileDropdown />
                    </header>

                    <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
                      <Outlet />
                    </main>
                  </div>
                </div>
              </RToRProvider>
            </ThankNotesProvider>
          </MastersProvider>
        </MeetingsProvider>
      </EventsProvider>
    </MembersProvider>
  );
}
