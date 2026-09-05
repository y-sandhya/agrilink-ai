import React, { useState, useRef, useEffect } from "react";

// ── Primitives ────────────────────────────────────────────────────────────────

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "ai" | "orange";

export function Button({
  children, variant = "primary", size = "md", className = "", disabled = false, onClick, type = "button", fullWidth = false,
}: {
  children: React.ReactNode; variant?: ButtonVariant; size?: "sm" | "md" | "lg";
  className?: string; disabled?: boolean; onClick?: () => void; type?: "button" | "submit"; fullWidth?: boolean;
}) {
  const base = "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  const sizes = { sm: "px-3 py-1.5 text-sm", md: "px-5 py-2.5 text-sm", lg: "px-6 py-3.5 text-base" };
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-[var(--green-mid)] text-white hover:bg-[var(--primary)] focus:ring-[var(--ring)] shadow-sm",
    secondary: "bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[#dbe8e2] focus:ring-[var(--ring)] border border-[var(--border)]",
    ghost: "bg-transparent text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] focus:ring-[var(--ring)]",
    danger: "bg-red-50 text-red-700 hover:bg-red-100 focus:ring-red-400 border border-red-200",
    ai: "bg-[var(--ai-color)] text-white hover:opacity-90 focus:ring-indigo-400 shadow-sm",
    orange: "bg-[var(--orange)] text-white hover:opacity-90 focus:ring-orange-400 shadow-sm",
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${sizes[size]} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {children}
    </button>
  );
}

export function Badge({ children, variant = "default", size = "sm", className = "" }: { children: React.ReactNode; variant?: "default" | "success" | "warning" | "error" | "ai" | "demo" | "neutral"; size?: "sm" | "xs"; className?: string }) {
  const base = "inline-flex items-center gap-1 font-medium rounded-full";
  const sizes = { xs: "px-2 py-0.5 text-xs", sm: "px-2.5 py-1 text-xs" };
  const variants = {
    default: "bg-[var(--secondary)] text-[var(--secondary-foreground)]",
    success: "bg-green-50 text-green-700 border border-green-200",
    warning: "bg-orange-50 text-orange-700 border border-orange-200",
    error: "bg-red-50 text-red-700 border border-red-200",
    ai: "bg-[var(--ai-bg)] text-[var(--ai-color)] border border-indigo-200",
    demo: "bg-amber-50 text-amber-700 border border-amber-200 demo-pulse",
    neutral: "bg-[var(--muted)] text-[var(--muted-foreground)]",
  };
  return <span className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>{children}</span>;
}

export function Card({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`bg-card rounded-2xl border border-[var(--border)] shadow-sm ${onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export function Input({
  label, placeholder, type = "text", value, onChange, required = false, hint, error, prefix, suffix, className = "",
}: {
  label?: string; placeholder?: string; type?: string; value?: string; onChange?: (v: string) => void;
  required?: boolean; hint?: string; error?: string; prefix?: React.ReactNode; suffix?: React.ReactNode; className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="text-sm font-medium text-[var(--foreground)]">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>}
      <div className="relative flex items-center">
        {prefix && <span className="absolute left-3 text-[var(--muted-foreground)]">{prefix}</span>}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange?.(e.target.value)}
          className={`w-full border rounded-xl px-4 py-2.5 text-sm bg-white text-[var(--foreground)] placeholder-[var(--muted-foreground)] border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-[var(--ring)] transition-all ${prefix ? "pl-9" : ""} ${suffix ? "pr-9" : ""} ${error ? "border-red-400 focus:ring-red-300" : ""}`}
        />
        {suffix && <span className="absolute right-3 text-[var(--muted-foreground)]">{suffix}</span>}
      </div>
      {hint && !error && <p className="text-xs text-[var(--muted-foreground)]">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function Select({
  label, value, onChange, options, placeholder, required = false, className = "",
}: {
  label?: string; value?: string; onChange?: (v: string) => void;
  options: { value: string; label: string }[]; placeholder?: string; required?: boolean; className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="text-sm font-medium text-[var(--foreground)]">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>}
      <select
        value={value}
        onChange={e => onChange?.(e.target.value)}
        className="w-full border rounded-xl px-4 py-2.5 text-sm bg-white text-[var(--foreground)] border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-[var(--ring)] transition-all appearance-none"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

export function Textarea({
  label, placeholder, value, onChange, rows = 3, className = "",
}: {
  label?: string; placeholder?: string; value?: string; onChange?: (v: string) => void; rows?: number; className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="text-sm font-medium text-[var(--foreground)]">{label}</label>}
      <textarea
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        className="w-full border rounded-xl px-4 py-2.5 text-sm bg-white text-[var(--foreground)] placeholder-[var(--muted-foreground)] border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all resize-none"
      />
    </div>
  );
}

export function DemoBanner() {
  return (
    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-sm text-amber-800">
      <span className="text-base">⚠️</span>
      <span><strong>Demo Data</strong> — All prices, buyers, and orders shown here are for demonstration only. Not real market data.</span>
    </div>
  );
}

export function DataSourceTag({ source = "Agmarknet", date = "03/09/2026", time = "10:00", className = "" }: { source?: string; date?: string; time?: string; className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span>
      <span>Source: {source}</span>
      <span>·</span>
      <span>Latest available data: {date}</span>
      <span>·</span>
      <span>Last fetched: {time}</span>
    </div>
  );
}

export function TrendIndicator({ trend, pct }: { trend: "up" | "down" | "stable"; pct?: number }) {
  if (trend === "up") return <span className="text-green-600 text-xs font-mono font-semibold">↑ {pct?.toFixed(1)}%</span>;
  if (trend === "down") return <span className="text-red-500 text-xs font-mono font-semibold">↓ {pct?.toFixed(1)}%</span>;
  return <span className="text-[var(--muted-foreground)] text-xs font-mono">→ Stable</span>;
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "Pending": "bg-amber-50 text-amber-700 border border-amber-200",
    "Accepted": "bg-blue-50 text-blue-700 border border-blue-200",
    "Processing": "bg-indigo-50 text-indigo-700 border border-indigo-200",
    "Ready for Pickup": "bg-cyan-50 text-cyan-700 border border-cyan-200",
    "In Transit": "bg-purple-50 text-purple-700 border border-purple-200",
    "Delivered": "bg-green-50 text-green-700 border border-green-200",
    "Completed": "bg-green-100 text-green-800 border border-green-300",
    "Cancelled": "bg-red-50 text-red-700 border border-red-200",
    "Verification Pending": "bg-amber-50 text-amber-700 border border-amber-200",
    "Identity Verified": "bg-green-50 text-green-700 border border-green-200",
    "Failed": "bg-red-50 text-red-700 border border-red-200",
  };
  const cls = map[status] || "bg-gray-100 text-gray-700 border border-gray-200";
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>{status}</span>;
}

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto fade-in-up">
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">{title}</h3>
          <button onClick={onClose} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors text-xl leading-none">×</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export function Tabs({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) {
  return (
    <div className="flex gap-1 bg-[var(--muted)] p-1 rounded-xl">
      {tabs.map(t => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${active === t ? "bg-white text-[var(--foreground)] shadow-sm" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"}`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

export function EmptyState({ icon, title, description, action }: { icon: string; title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
      <div className="text-5xl">{icon}</div>
      <h3 className="text-lg font-semibold text-[var(--foreground)]">{title}</h3>
      {description && <p className="text-sm text-[var(--muted-foreground)] max-w-xs">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function LoadingState({ text = "Fetching latest market data..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-8 h-8 border-2 border-[var(--green-mid)] border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-[var(--muted-foreground)]">{text}</p>
    </div>
  );
}

export function SyncBar({ status }: { status: "synced" | "syncing" | "offline" }) {
  if (status === "synced") return null;
  if (status === "syncing") return (
    <div className="bg-blue-50 border-b border-blue-200 px-4 py-2 text-sm text-blue-700 flex items-center gap-2">
      <div className="w-3 h-3 border border-blue-500 border-t-transparent rounded-full animate-spin" />
      Syncing latest data...
    </div>
  );
  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-sm text-amber-700 flex items-center gap-2">
      <span>📵</span>
      Offline — showing last synced data from 03/09/2026 10:00 AM
    </div>
  );
}

export function MatchScore({ score }: { score: number }) {
  const color = score >= 90 ? "text-green-700 bg-green-50 border-green-300" : score >= 75 ? "text-blue-700 bg-blue-50 border-blue-300" : "text-orange-700 bg-orange-50 border-orange-300";
  return <span className={`inline-flex items-center justify-center w-14 h-14 rounded-full border-2 font-bold text-lg ${color}`}>{score}%</span>;
}
