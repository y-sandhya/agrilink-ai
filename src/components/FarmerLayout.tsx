import React, { useState } from "react";
import { DEMO_FARMER } from "../data/demoData";

type Page = string;

const NAV_ITEMS = [
  { id: "farmer-dashboard", label: "Dashboard", icon: "⊞" },
  { id: "farmer-crops", label: "My Crops", icon: "🌱" },
  { id: "farmer-market", label: "Market Prices", icon: "📊" },
  { id: "farmer-ai", label: "AI Predictions", icon: "✦" },
  { id: "farmer-buyers", label: "Find Buyers", icon: "🤝" },
  { id: "farmer-best-market", label: "Best Market", icon: "🎯" },
  { id: "farmer-orders", label: "My Orders", icon: "📦" },
  { id: "farmer-payments", label: "Payments", icon: "₹" },
  { id: "farmer-messages", label: "Messages", icon: "💬" },
  { id: "farmer-notifications", label: "Notifications", icon: "🔔" },
  { id: "farmer-profile", label: "Profile", icon: "👤" },
  { id: "farmer-help", label: "Help", icon: "?" },
];

export default function FarmerLayout({
  currentPage,
  onNavigate,
  children,
}: {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 pt-6 pb-4 border-b border-[var(--sidebar-border)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--green-light)] flex items-center justify-center">
            <span className="text-white text-base font-bold font-serif">A</span>
          </div>
          <div>
            <div className="text-white font-bold text-base leading-tight font-serif">AgriLink AI</div>
            <div className="text-[var(--sidebar-fg)] text-xs opacity-70">Smarter Markets</div>
          </div>
        </div>
      </div>

      {/* Farmer Profile */}
      <div className="px-5 py-4 border-b border-[var(--sidebar-border)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--green-mid)] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {DEMO_FARMER.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div className="min-w-0">
            <div className="text-white text-sm font-medium truncate">{DEMO_FARMER.name}</div>
            <div className="text-[var(--sidebar-fg)] text-xs opacity-70 truncate">{DEMO_FARMER.location}</div>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
              <span className="text-green-400 text-xs">Identity Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(item => (
          <div
            key={item.id}
            className={`sidebar-item ${currentPage === item.id ? "active" : ""}`}
            onClick={() => { onNavigate(item.id); setSidebarOpen(false); }}
          >
            <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
            <span>{item.label}</span>
            {item.id === "farmer-notifications" && <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">2</span>}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-3 border-t border-[var(--sidebar-border)]">
        <div className="sidebar-item text-red-400 hover:text-red-300" onClick={() => onNavigate("landing")}>
          <span className="text-base w-5 text-center">⬅</span>
          <span>Logout</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-full bg-[var(--background)]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 bg-[var(--sidebar-bg)] h-full overflow-hidden">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 bg-[var(--sidebar-bg)] h-full z-50 overflow-hidden">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-[var(--border)] px-4 lg:px-6 h-14 flex items-center justify-between flex-shrink-0 z-10">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-[var(--muted-foreground)] hover:text-[var(--foreground)] p-1"
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </button>
            <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
              <span>📍</span>
              <span className="hidden sm:inline">{DEMO_FARMER.location}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-xs bg-[var(--muted)] rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--secondary)] transition-colors">
              EN ▾
            </button>
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[var(--green-pale)] text-[var(--green-mid)] rounded-lg hover:bg-green-100 transition-colors font-medium"
              onClick={() => onNavigate("voice")}
            >
              <span>🎙</span>
              <span className="hidden sm:inline">Voice</span>
            </button>
            <button
              className="relative p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              onClick={() => onNavigate("farmer-notifications")}
            >
              🔔
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
