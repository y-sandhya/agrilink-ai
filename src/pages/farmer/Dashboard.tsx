import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Badge,
  DemoBanner,
  DataSourceTag,
} from "../../components/ui";
import { DEMO_FARMER, DEMO_BUYERS, DEMO_ORDERS } from "../../data/demoData";
import { fetchMarketPrices, MarketPrice } from "../../services/api";

const ACTION_CARDS = [
  {
    icon: "🌱",
    label: "Sell Produce",
    page: "farmer-crops",
    color: "bg-[var(--green-pale)]",
    border: "border-green-200",
    text: "text-[var(--green-mid)]",
  },
  {
    icon: "📊",
    label: "Check Today's Prices",
    page: "farmer-market",
    color: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
  },
  {
    icon: "🤝",
    label: "Find Buyers",
    page: "farmer-buyers",
    color: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
  },
  {
    icon: "🎯",
    label: "Find Best Market",
    page: "farmer-best-market",
    color: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-700",
  },
  {
    icon: "✦",
    label: "Ask AgriLink AI",
    page: "chatbot",
    color: "bg-[var(--ai-bg)]",
    border: "border-indigo-200",
    text: "text-[var(--ai-color)]",
  },
];

export default function FarmerDashboard({
  onNavigate,
}: {
  onNavigate: (p: string) => void;
}) {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? "Good morning"
      : hour < 17
      ? "Good afternoon"
      : "Good evening";

  async function loadPrices() {
    try {
      setLoading(true);
      setError("");

      const data = await fetchMarketPrices({ limit: 100 });

      const unique = new Map<string, MarketPrice>();

      data.forEach((item) => {
        const key = `${item.crop}-${item.market}`;

        const existing = unique.get(key);

        if (
          !existing ||
          Number(item.modal_price || 0) > Number(existing.modal_price || 0)
        ) {
          unique.set(key, item);
        }
      });

      setPrices(Array.from(unique.values()).slice(0, 4));
    } catch (err) {
      console.error(err);
      setError("Unable to load latest market data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPrices();
  }, []);

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-6xl mx-auto">

      <DemoBanner />

      {/* Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl text-[var(--foreground)]">
            {greeting}, {DEMO_FARMER.name.split(" ")[0]} 👋
          </h1>

          <div className="flex items-center gap-2 mt-1 text-sm text-[var(--muted-foreground)]">
            <span>📍</span>
            <span>
              {DEMO_FARMER.village}, {DEMO_FARMER.district}
            </span>

            <span className="w-1 h-1 rounded-full bg-[var(--muted-foreground)]" />

            <span className="text-green-600 font-medium">
              ✓ Identity Verified
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="demo">Demo Mode</Badge>
          <Badge variant="success">Face Verification On</Badge>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-base font-semibold text-[var(--foreground)] mb-3">
          Quick Actions
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {ACTION_CARDS.map((a) => (
            <button
              key={a.label}
              onClick={() => onNavigate(a.page)}
              className={`${a.color} ${a.border} border rounded-2xl p-4 text-center hover:shadow-md transition-all`}
            >
              <div className="text-3xl mb-2">{a.icon}</div>

              <div className={`text-xs font-semibold ${a.text}`}>
                {a.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">

          {/* MARKET SNAPSHOT */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-[var(--foreground)]">
                  Latest Market Prices
                </h2>

                <p className="text-xs text-[var(--muted-foreground)] mt-1">
                  Latest available mandi data
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate("farmer-market")}
                >
                  View All →
                </Button>

                <button
                  onClick={loadPrices}
                  className="px-3 py-1.5 text-xs bg-[var(--muted)] rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--secondary)]"
                >
                  ↻ Refresh
                </button>
              </div>
            </div>

            <DataSourceTag className="mb-4" />

            {loading && (
              <div className="py-8 text-center text-sm text-[var(--muted-foreground)]">
                Loading latest market prices...
              </div>
            )}

            {!loading && error && (
              <div className="py-6 text-center">
                <p className="text-sm text-red-500 mb-3">{error}</p>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={loadPrices}
                >
                  Try Again
                </Button>
              </div>
            )}

            {!loading && !error && prices.length === 0 && (
              <div className="py-8 text-center text-sm text-[var(--muted-foreground)]">
                No market data available right now.
              </div>
            )}

            {!loading && !error && prices.length > 0 && (
              <div className="space-y-3">
                {prices.map((crop) => (
                  <div
                    key={`${crop.id}-${crop.market}`}
                    className="flex items-center justify-between gap-3 py-3 border-b border-[var(--border)] last:border-0"
                  >
                    <div className="min-w-0">
                      <div className="font-medium text-[var(--foreground)] text-sm">
                        {crop.crop}
                      </div>

                      <div className="text-xs text-[var(--muted-foreground)] truncate">
                        {crop.market}
                        {crop.district ? ` · ${crop.district}` : ""}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-semibold text-[var(--foreground)] text-sm">
                        ₹
                        {Number(crop.modal_price || 0).toLocaleString("en-IN")}
                      </div>

                      <div className="text-xs text-[var(--muted-foreground)]">
                        per quintal
                      </div>
                    </div>

                    <div className="text-right min-w-[80px]">
                      <div className="text-xs font-medium text-green-600">
                        Latest
                      </div>

                      <div className="text-xs text-[var(--muted-foreground)]">
                        {crop.arrival_date || "Date unavailable"}
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onNavigate("farmer-market")}
                    >
                      Details
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* AI RECOMMENDATION */}
          <Card className="p-5 border-l-4 border-l-[var(--ai-color)] bg-[var(--ai-bg)]/30">
            <div className="flex items-start gap-3">
              <span className="text-2xl">✦</span>

              <div>
                <Badge variant="ai" size="xs">
                  AI Recommendation
                </Badge>

                <p className="text-sm font-medium text-[var(--foreground)] mt-2">
                  Check the latest prices and AI prediction before deciding
                  where to sell your crop.
                </p>

                <p className="text-xs text-[var(--muted-foreground)] mt-1">
                  AgriLink combines market prices, market distance and buyer
                  information to support your selling decision.
                </p>

                <Button
                  size="sm"
                  className="mt-3"
                  onClick={() => onNavigate("farmer-ai")}
                >
                  View AI Prediction →
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          {/* MY CROPS */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[var(--foreground)]">
                My Crops
              </h2>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate("farmer-crops")}
              >
                View →
              </Button>
            </div>

            <div className="space-y-3">
              {DEMO_FARMER.crops.map((crop) => (
                <div
                  key={crop}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[var(--muted)]"
                >
                  <span className="text-xl">🌱</span>

                  <div>
                    <div className="text-sm font-medium text-[var(--foreground)]">
                      {crop}
                    </div>

                    <div className="text-xs text-[var(--muted-foreground)]">
                      Listed crop
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* BUYER MATCHES */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[var(--foreground)]">
                Buyer Matches
              </h2>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate("farmer-buyers")}
              >
                View →
              </Button>
            </div>

            <div className="text-center py-3">
              <div className="text-3xl font-bold text-[var(--primary)]">
                {DEMO_BUYERS.length}
              </div>

              <div className="text-xs text-[var(--muted-foreground)]">
                potential buyers matched
              </div>
            </div>
          </Card>

          {/* ACTIVE ORDERS */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[var(--foreground)]">
                Active Orders
              </h2>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate("farmer-orders")}
              >
                View →
              </Button>
            </div>

            <div className="text-center py-3">
              <div className="text-3xl font-bold text-[var(--primary)]">
                {DEMO_ORDERS.filter(
                  (order) => order.status !== "Delivered"
                ).length}
              </div>

              <div className="text-xs text-[var(--muted-foreground)]">
                orders in progress
              </div>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}