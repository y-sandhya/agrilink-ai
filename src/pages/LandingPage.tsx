import React, { useState } from "react";
import { Button, Badge } from "../components/ui";

const FEATURES = [
  { icon: "📊", title: "Transparent Market Prices", desc: "Latest available mandi prices sourced from Agmarknet — clearly dated, never fabricated." },
  { icon: "✦", title: "AI Price Insights", desc: "ML-based price trend predictions with full explainability. Estimates, not guarantees." },
  { icon: "🎯", title: "Best Market Finder", desc: "Compare nearby markets using price, distance, and transport cost to find your best net realization." },
  { icon: "🤝", title: "Verified Buyer Connections", desc: "Connect directly with buyers. No middlemen. Transparent offer prices and match scores." },
  { icon: "🎙", title: "Voice / IVR Access", desc: "No smartphone? Just call the AgriLink number and interact in your preferred language." },
  { icon: "📶", title: "Low Data Mode", desc: "Works on slow connections. Cached data available offline with clear sync timestamps." },
  { icon: "🌐", title: "Multilingual Support", desc: "Telugu, Hindi, Kannada, Tamil, and English — interface, AI responses, and voice." },
  { icon: "🔒", title: "Secure Authentication", desc: "Farmer identity verification and face authentication for enhanced security." },
];

const HOW_STEPS = [
  { num: "01", title: "Know", desc: "Get latest available mandi prices for your crops across markets." },
  { num: "02", title: "Understand", desc: "AI-powered trend analysis explains what's driving price movements." },
  { num: "03", title: "Decide", desc: "Best Market Finder calculates your estimated net realization per market." },
  { num: "04", title: "Connect", desc: "Get matched with verified buyers looking for exactly what you grow." },
  { num: "05", title: "Sell", desc: "Place orders directly. Track status. Receive payment securely." },
  { num: "06", title: "Access", desc: "Via smartphone, low-data mode, or voice call — wherever you are." },
];

const SUPPORTED_LANGUAGES = ["English", "తెలుగు", "हिन्दी", "ಕನ್ನಡ", "தமிழ்"];

export default function LandingPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-full bg-white text-[var(--foreground)] font-sans overflow-x-hidden">

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--green-mid)] flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold font-serif">A</span>
            </div>
            <span className="font-bold text-[var(--primary)] text-lg font-serif">AgriLink AI</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-[var(--muted-foreground)]">
            {["How It Works", "For Farmers", "For Buyers", "Market Insights", "About"].map(n => (
              <a key={n} href="#" className="hover:text-[var(--primary)] transition-colors font-medium">{n}</a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button className="hidden sm:block text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] px-3 py-1.5 rounded-lg hover:bg-[var(--muted)] transition-colors font-medium">
              EN ▾
            </button>
            <button
              className="text-sm font-medium text-[var(--foreground)] px-4 py-2 rounded-xl hover:bg-[var(--muted)] transition-colors hidden sm:block"
              onClick={() => onNavigate("auth-farmer-login")}
            >
              Login
            </button>
            <Button onClick={() => onNavigate("auth-farmer-signup")} size="sm">Get Started</Button>
            <button className="md:hidden p-2 text-[var(--muted-foreground)]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>☰</button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[var(--border)] px-4 py-3 space-y-2 bg-white">
            {["How It Works", "For Farmers", "For Buyers", "Market Insights", "About"].map(n => (
              <a key={n} href="#" className="block py-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] font-medium">{n}</a>
            ))}
            <div className="flex gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => onNavigate("auth-farmer-login")}>Login</Button>
              <Button size="sm" onClick={() => onNavigate("auth-farmer-signup")}>Get Started</Button>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[var(--green-pale)] text-[var(--green-mid)] px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-green-200">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--green-mid)]"></span>
              Smarter Markets for Farmers
            </div>
            <h1 className="font-serif text-5xl lg:text-6xl leading-[1.1] text-[var(--foreground)] mb-6">
              Sell Smarter.<br />
              <span className="text-[var(--green-mid)]">Find Better</span><br />
              Markets.
            </h1>
            <p className="text-lg text-[var(--muted-foreground)] mb-8 leading-relaxed max-w-lg">
              AgriLink connects farmers with verified buyers, transparent market prices, and intelligent selling decisions — on any device, in any language.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Button size="lg" onClick={() => onNavigate("auth-farmer-signup")}>
                🌱 Start Selling
              </Button>
              <Button variant="secondary" size="lg" onClick={() => onNavigate("auth-buyer-login")}>
                🛒 Find Produce
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {SUPPORTED_LANGUAGES.map(lang => (
                <span key={lang} className="text-xs px-2.5 py-1 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] font-medium">{lang}</span>
              ))}
            </div>
          </div>

          {/* Visual Flow */}
          <div className="relative">
            <div className="bg-[var(--background)] rounded-3xl p-8 border border-[var(--border)]">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-[var(--green-mid)] text-white px-4 py-2 rounded-full text-sm font-semibold">
                  ✦ AgriLink AI
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { icon: "👨‍🌾", label: "Farmer", sub: "Smartphone / Voice" },
                  { icon: "📱", label: "Keypad Phone", sub: "IVR Access" },
                  { icon: "🏢", label: "Buyer", sub: "Web Platform" },
                ].map(item => (
                  <div key={item.label} className="bg-white rounded-2xl p-4 text-center border border-[var(--border)] shadow-sm">
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <div className="text-sm font-semibold text-[var(--foreground)]">{item.label}</div>
                    <div className="text-xs text-[var(--muted-foreground)] mt-0.5">{item.sub}</div>
                  </div>
                ))}
              </div>
              <div className="text-center text-[var(--muted-foreground)] text-xs mb-4">↓ connected through AgriLink Backend</div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: "📊", label: "Market Data", color: "bg-green-50 border-green-200" },
                  { icon: "✦", label: "AI Model", color: "bg-indigo-50 border-indigo-200" },
                  { icon: "🤝", label: "Matching", color: "bg-orange-50 border-orange-200" },
                ].map(item => (
                  <div key={item.label} className={`${item.color} border rounded-xl p-3 text-center`}>
                    <div className="text-xl mb-1">{item.icon}</div>
                    <div className="text-xs font-medium text-[var(--foreground)]">{item.label}</div>
                  </div>
                ))}
              </div>
              <div className="text-center text-[var(--muted-foreground)] text-xs mt-4">↓ Best Decision → Order → Payment</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-[var(--background)] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge variant="default" size="sm">Platform Features</Badge>
            <h2 className="font-serif text-4xl mt-4 mb-3">More Than a Marketplace</h2>
            <p className="text-[var(--muted-foreground)] max-w-xl mx-auto">AgriLink is a farmer decision and market access platform — combining real data, AI insights, and direct buyer connections.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-[var(--border)] hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-[var(--foreground)] mb-2">{f.title}</h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How AgriLink Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <Badge variant="default" size="sm">How It Works</Badge>
            <h2 className="font-serif text-4xl mt-4 mb-3">From Field to Best Decision</h2>
            <p className="text-[var(--muted-foreground)] max-w-xl mx-auto">AgriLink helps farmers know, understand, decide, connect, and sell — through any access channel.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {HOW_STEPS.map((step, i) => (
              <div key={step.num} className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-[var(--green-pale)] flex items-center justify-center font-mono text-sm font-bold text-[var(--green-mid)] border border-green-200">
                  {step.num}
                </div>
                <div>
                  <h3 className="font-bold text-[var(--foreground)] text-lg mb-1">{step.title}</h3>
                  <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Prop Split */}
      <section className="bg-[var(--primary)] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-white/20">
                For Farmers
              </div>
              <h2 className="font-serif text-4xl text-white mb-6">Technology should adapt to the farmer.</h2>
              <p className="text-green-200 text-lg mb-8 leading-relaxed">Not force the farmer to adapt to technology. AgriLink works on smartphones, low-data connections, and plain phone calls through voice/IVR.</p>
              <div className="space-y-3">
                {["No smartphone required — voice/IVR access", "Works offline with cached market data", "Large buttons, clear labels, simple navigation", "Multilingual: Telugu, Hindi, Kannada, Tamil", "Enhanced identity verification for security"].map(pt => (
                  <div key={pt} className="flex items-center gap-3 text-green-100">
                    <span className="w-5 h-5 rounded-full bg-green-400/20 border border-green-400/40 flex items-center justify-center text-green-400 text-xs flex-shrink-0">✓</span>
                    <span className="text-sm">{pt}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Button variant="secondary" onClick={() => onNavigate("auth-farmer-signup")} size="lg">Create Farmer Account</Button>
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-white/20">
                For Buyers
              </div>
              <h2 className="font-serif text-4xl text-white mb-6">Direct access to India's farming network.</h2>
              <p className="text-green-200 text-lg mb-8 leading-relaxed">Post requirements, find matching farmers, compare quality and prices, and manage orders through a professional buyer dashboard.</p>
              <div className="space-y-3">
                {["Post crop requirements and get farmer matches", "Advanced analytics and market intelligence", "Track orders from field to delivery", "Manage payments and transaction history", "Professional buyer verification process"].map(pt => (
                  <div key={pt} className="flex items-center gap-3 text-green-100">
                    <span className="w-5 h-5 rounded-full bg-green-400/20 border border-green-400/40 flex items-center justify-center text-green-400 text-xs flex-shrink-0">✓</span>
                    <span className="text-sm">{pt}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Button variant="secondary" onClick={() => onNavigate("auth-buyer-login")} size="lg">Buyer Login</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-20 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge variant="default" size="sm">Trust & Safety</Badge>
            <h2 className="font-serif text-4xl mt-4 mb-3">Built on Transparency</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: "✓", title: "Transparent Prices", desc: "All market data is clearly sourced and dated. We say 'latest available' — not 'live' unless confirmed." },
              { icon: "🛡", title: "Secure Authentication", desc: "Farmer accounts use multi-factor verification including consent-based identity and face verification." },
              { icon: "⚠️", title: "No False Claims", desc: "We never fabricate prices, verifications, or AI accuracy. Demo data is always clearly labeled." },
              { icon: "🔍", title: "AI Explainability", desc: "Every AI recommendation explains its factors. Predictions are estimates, not guarantees." },
            ].map(t => (
              <div key={t.title} className="bg-white rounded-2xl p-6 border border-[var(--border)]">
                <div className="text-2xl mb-3">{t.icon}</div>
                <h3 className="font-semibold text-[var(--foreground)] mb-2">{t.title}</h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-serif text-5xl text-[var(--foreground)] mb-4">Ready to sell smarter?</h2>
          <p className="text-[var(--muted-foreground)] text-lg mb-8">Join AgriLink — the farmer-first market intelligence and direct selling platform.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" onClick={() => onNavigate("auth-farmer-signup")}>🌱 Start as Farmer</Button>
            <Button variant="secondary" size="lg" onClick={() => onNavigate("auth-buyer-login")}>🏢 Buyer Portal</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--foreground)] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--green-mid)] flex items-center justify-center">
                <span className="text-white font-bold font-serif text-sm">A</span>
              </div>
              <div>
                <div className="font-bold font-serif">AgriLink AI</div>
                <div className="text-white/50 text-xs">Smarter Markets for Farmers</div>
              </div>
            </div>
            <div className="text-white/40 text-sm text-center">
              AgriLink is an independent platform. Not affiliated with any government body. Market data sourced from Agmarknet (public domain).
            </div>
            <div className="text-white/40 text-xs">
              © 2026 AgriLink AI · Demo Prototype
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
