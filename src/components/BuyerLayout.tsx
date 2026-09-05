import React, { useState } from "react";
import { DEMO_BUYER } from "../data/demoData";

const NAV_ITEMS = [
  { id: "buyer-dashboard", label: "Dashboard", icon: "⊞" },
  { id: "buyer-find-crops", label: "Find Crops", icon: "🌾" },
  { id: "buyer-post-req", label: "Post Requirement", icon: "+" },
  { id: "buyer-find-farmers", label: "Find Farmers", icon: "👨‍🌾" },
  { id: "buyer-orders", label: "My Orders", icon: "📦" },
  { id: "buyer-payments", label: "Payments", icon: "₹" },
  { id: "buyer-messages", label: "Messages", icon: "💬" },
  { id: "buyer-notifications", label: "Notifications", icon: "🔔" },
  { id: "buyer-profile", label: "Business Profile", icon: "🏢" },
  { id: "buyer-help", label: "Help", icon: "?" },
];

export default function BuyerLayout({
  currentPage,
  onNavigate,
  children,
}: {
  currentPage: string;
  onNavigate: (page: string) => void;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 pt-6 pb-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--green-mid)] flex items-center justify-center">
            <span className="text-white text-base font-bold font-serif">A</span>
          </div>
          <div>
            <div className="text-[var(--foreground)] font-bold text-base leading-tight font-serif">AgriLink AI</div>
            <div className="text-[var(--muted-foreground)] text-xs">Buyer Portal</div>
          </div>
        </div>
      </div>

      {/* Business Profile */}
      <div className="px-5 py-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--secondary)] flex items-center justify-center text-[var(--primary)] font-bold text-sm flex-shrink-0 border border-[var(--border)]">
            {DEMO_BUYER.company.split(" ").slice(0, 2).map(n => n[0]).join("")}
          </div>
          <div className="min-w-0">
            <div className="text-[var(--foreground)] text-sm font-medium truncate">{DEMO_BUYER.name}</div>
            <div className="text-[var(--muted-foreground)] text-xs truncate">{DEMO_BUYER.company}</div>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span className="text-amber-600 text-xs">Verification Pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(item => (
          <div
            key={item.id}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-sm font-medium transition-all ${
              currentPage === item.id
                ? "bg-[var(--secondary)] text-[var(--primary)] border border-[var(--border)]"
                : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
            onClick={() => { onNavigate(item.id); setSidebarOpen(false); }}
          >
            <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-3 border-t border-[var(--border)]">
        <div
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-sm text-red-600 hover:bg-red-50 transition-all font-medium"
          onClick={() => onNavigate("landing")}
        >
          <span className="w-5 text-center">⬅</span>
          <span>Logout</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-full bg-[var(--background)]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 bg-white border-r border-[var(--border)] h-full overflow-hidden">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 bg-white h-full z-50 overflow-hidden border-r border-[var(--border)]">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-[var(--border)] px-4 lg:px-6 h-14 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-[var(--muted-foreground)] p-1"
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </button>
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Search crops, farmers, orders..."
                className="pl-8 pr-4 py-2 text-sm border border-[var(--border)] rounded-xl bg-[var(--muted)] text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] w-72"
              />
              <span className="absolute left-2.5 top-2.5 text-[var(--muted-foreground)] text-sm">🔍</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-xs bg-[var(--muted)] rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--secondary)] transition-colors">EN ▾</button>
            <button className="relative p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors" onClick={() => onNavigate("buyer-notifications")}>
              🔔
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-[var(--secondary)] flex items-center justify-center text-[var(--primary)] font-bold text-xs border border-[var(--border)]">
              {DEMO_BUYER.name.split(" ").map(n => n[0]).join("")}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
