import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  Button,
  Badge,
  DemoBanner,
  StatusBadge,
} from "../../components/ui";
import {
  DEMO_BUYER,
  DEMO_FARMERS_FOR_BUYER,
  DEMO_ORDERS,
} from "../../data/demoData";

const ACTIONS = [
  {
    icon: "🌾",
    label: "Find Crops",
    page: "buyer-find-crops",
    color: "bg-[var(--green-pale)]",
    border: "border-green-200",
    text: "text-[var(--green-mid)]",
  },
  {
    icon: "+",
    label: "Post Requirement",
    page: "buyer-post-req",
    color: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
  },
  {
    icon: "👨‍🌾",
    label: "Find Farmers",
    page: "buyer-find-farmers",
    color: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
  },
  {
    icon: "📊",
    label: "Market Intel",
    page: "buyer-market",
    color: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-700",
  },
  {
    icon: "📦",
    label: "Track Orders",
    page: "buyer-orders",
    color: "bg-[var(--muted)]",
    border: "border-[var(--border)]",
    text: "text-[var(--muted-foreground)]",
  },
];

type Requirement = {
  id: string;
  crop: string;
  quantity: number;
  quality: string;
  budget: number;
  location: string;
  requiredBy: string;
  additionalRequirements: string;
  createdAt: string;
};

const STORAGE_KEY = "agrilink_buyer_requirements";

const DEMO_REQUIREMENTS = [
  {
    crop: "Tomato",
    qty: "500 kg",
    grade: "Grade A",
    budget: "₹950/q",
    posted: "2 days ago",
  },
  {
    crop: "Onion",
    qty: "1000 kg",
    grade: "Any",
    budget: "₹700/q",
    posted: "5 days ago",
  },
  {
    crop: "Chilli",
    qty: "100 kg",
    grade: "Grade A",
    budget: "₹5500/q",
    posted: "1 week ago",
  },
];

export default function BuyerDashboard({
  onNavigate,
}: {
  onNavigate: (p: string) => void;
}) {
  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good morning"
      : hour < 17
        ? "Good afternoon"
        : "Good evening";

  const [requirements, setRequirements] = useState<Requirement[]>([]);

  // Load requirements posted from Post Requirement page
  const loadRequirements = () => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );

      if (Array.isArray(saved)) {
        setRequirements(saved);
      }
    } catch {
      setRequirements([]);
    }
  };

  useEffect(() => {
    loadRequirements();

    const handleStorage = () => {
      loadRequirements();
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const activeRequirementCount =
    requirements.length > 0
      ? requirements.length
      : Number(DEMO_BUYER.active_requirements) || 0;

  // Show best matching farmers first
  const recommendedFarmers = useMemo(() => {
    return [...DEMO_FARMERS_FOR_BUYER]
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, 3);
  }, []);

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-6xl mx-auto">
      <DemoBanner />

      {/* ================= GREETING ================= */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl text-[var(--foreground)]">
            {greeting}, {DEMO_BUYER.name.split(" ")[0]} 👋
          </h1>

          <div className="flex items-center gap-2 mt-1 text-sm text-[var(--muted-foreground)]">
            <span>🏢</span>

            <span>{DEMO_BUYER.company}</span>

            <span className="w-1 h-1 rounded-full bg-[var(--muted-foreground)]" />

            <span className="text-amber-600">
              Verification Pending
            </span>
          </div>
        </div>

        <Badge variant="demo">
          Demo Mode
        </Badge>
      </div>

      {/* ================= STATS ================= */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Active Requirements",
            value: activeRequirementCount,
            icon: "📋",
            color: "text-blue-600",
          },
          {
            label: "Pending Orders",
            value: DEMO_BUYER.pending_orders,
            icon: "⏳",
            color: "text-amber-600",
          },
          {
            label: "Completed Orders",
            value: DEMO_BUYER.completed_orders,
            icon: "✓",
            color: "text-green-600",
          },
          {
            label: "Total Purchase Value",
            value: DEMO_BUYER.total_purchase,
            icon: "₹",
            color: "text-[var(--green-mid)]",
          },
        ].map((stat) => (
          <Card
            key={stat.label}
            className="p-5"
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-xl">
                {stat.icon}
              </span>

              <Badge
                variant="demo"
                size="xs"
              >
                Demo
              </Badge>
            </div>

            <div
              className={`font-bold text-2xl font-mono ${stat.color}`}
            >
              {stat.value}
            </div>

            <div className="text-xs text-[var(--muted-foreground)] mt-1">
              {stat.label}
            </div>
          </Card>
        ))}
      </div>

      {/* ================= QUICK ACTIONS ================= */}

      <div>
        <h2 className="text-base font-semibold text-[var(--foreground)] mb-3">
          Quick Actions
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {ACTIONS.map((action) => (
            <button
              key={action.label}
              onClick={() => onNavigate(action.page)}
              className={`${action.color} ${action.border} border rounded-2xl p-4 text-center hover:shadow-md hover:-translate-y-0.5 transition-all`}
            >
              <div className="text-2xl mb-2">
                {action.icon}
              </div>

              <div
                className={`text-xs font-semibold ${action.text} leading-tight`}
              >
                {action.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ================= MAIN GRID ================= */}

      <div className="grid lg:grid-cols-3 gap-6">

        {/* LEFT */}

        <div className="lg:col-span-2 space-y-5">

          {/* RECOMMENDED FARMERS */}

          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-[var(--foreground)]">
                  Recommended Farmers
                </h2>

                <p className="text-xs text-[var(--muted-foreground)] mt-1">
                  Best matches for your buying requirements
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  onNavigate("buyer-find-farmers")
                }
              >
                View All →
              </Button>
            </div>

            <div className="space-y-3">
              {recommendedFarmers.map((farmer) => (
                <div
                  key={farmer.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3 border-b border-[var(--border)] last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-xl">
                      🌱
                    </div>

                    <div>
                      <div className="font-medium text-[var(--foreground)] text-sm">
                        {farmer.crop} — {farmer.quality}
                      </div>

                      <div className="text-xs text-[var(--muted-foreground)]">
                        {farmer.quantity} {farmer.unit} ·{" "}
                        {farmer.location}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-5">
                    <div className="text-right">
                      <div className="font-mono text-sm font-semibold text-[var(--foreground)]">
                        ₹{farmer.expected_price}/q
                      </div>

                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          farmer.match_score >= 90
                            ? "bg-green-50 text-green-700"
                            : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {farmer.match_score}% match
                      </span>
                    </div>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        onNavigate("buyer-find-farmers")
                      }
                    >
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Badge
              variant="demo"
              size="xs"
              className="mt-3"
            >
              Demo farmer profiles
            </Badge>
          </Card>

          {/* ACTIVE ORDERS */}

          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-[var(--foreground)]">
                Active Orders
              </h2>

              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  onNavigate("buyer-orders")
                }
              >
                View All →
              </Button>
            </div>

            <div className="space-y-3">
              {DEMO_ORDERS.slice(0, 3).map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3 border-b border-[var(--border)] last:border-0"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-[var(--muted-foreground)]">
                        #{order.id}
                      </span>

                      <StatusBadge status={order.status} />
                    </div>

                    <div className="text-sm font-medium text-[var(--foreground)] mt-1">
                      {order.crop} — {order.quantity}{" "}
                      {order.unit}
                    </div>

                    <div className="text-xs text-[var(--muted-foreground)]">
                      Farmer: {order.farmer_name}
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="font-mono text-sm font-semibold text-[var(--green-mid)]">
                      ₹{order.total_value.toLocaleString()}
                    </div>

                    <div className="text-xs text-[var(--muted-foreground)]">
                      {order.updated}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* RIGHT */}

        <div className="space-y-4">

          {/* ACTIVE REQUIREMENTS */}

          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-[var(--foreground)]">
                  Active Requirements
                </h3>

                {requirements.length > 0 && (
                  <div className="text-xs text-green-600 mt-0.5">
                    Your posted requirements
                  </div>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  onNavigate("buyer-post-req")
                }
              >
                + New
              </Button>
            </div>

            {/* USER POSTED REQUIREMENTS */}

            {requirements.length > 0 ? (
              <div>
                {requirements.slice(0, 5).map((req) => (
                  <div
                    key={req.id}
                    className="py-3 border-b border-[var(--border)] last:border-0"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-[var(--foreground)]">
                        {req.crop}
                      </span>

                      <Badge
                        variant="success"
                        size="xs"
                      >
                        Active
                      </Badge>
                    </div>

                    <div className="text-xs text-[var(--muted-foreground)]">
                      {req.quantity.toLocaleString()} kg ·{" "}
                      {req.quality} · Max ₹
                      {req.budget.toLocaleString()}/q
                    </div>

                    <div className="text-xs text-[var(--muted-foreground)] mt-0.5">
                      📍 {req.location}
                    </div>

                    <div className="text-xs text-[var(--muted-foreground)] mt-0.5">
                      Required by: {req.requiredBy}
                    </div>
                  </div>
                ))}

                <Button
                  variant="secondary"
                  size="sm"
                  fullWidth
                  className="mt-3"
                  onClick={() =>
                    onNavigate("buyer-post-req")
                  }
                >
                  + Post New Requirement
                </Button>
              </div>
            ) : (
              /* FALLBACK DEMO REQUIREMENTS */

              <div>
                {DEMO_REQUIREMENTS.map((req) => (
                  <div
                    key={req.crop}
                    className="py-3 border-b border-[var(--border)] last:border-0"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-[var(--foreground)]">
                        {req.crop}
                      </span>

                      <Badge
                        variant="success"
                        size="xs"
                      >
                        Active
                      </Badge>
                    </div>

                    <div className="text-xs text-[var(--muted-foreground)]">
                      {req.qty} · {req.grade} · Max{" "}
                      {req.budget}
                    </div>

                    <div className="text-xs text-[var(--muted-foreground)] mt-0.5">
                      Posted {req.posted}
                    </div>
                  </div>
                ))}

                <Button
                  variant="secondary"
                  size="sm"
                  fullWidth
                  className="mt-3"
                  onClick={() =>
                    onNavigate("buyer-post-req")
                  }
                >
                  + Post New Requirement
                </Button>
              </div>
            )}
          </Card>

          {/* BUSINESS PROFILE */}

          <Card className="p-5">
            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">
              Business Profile
            </h3>

            <div className="space-y-2 text-sm">

              <div className="flex justify-between gap-3">
                <span className="text-[var(--muted-foreground)]">
                  Company
                </span>

                <span className="font-medium text-[var(--foreground)] text-right text-xs">
                  {DEMO_BUYER.company}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-[var(--muted-foreground)]">
                  Type
                </span>

                <span className="font-medium text-[var(--foreground)]">
                  {DEMO_BUYER.type}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-[var(--muted-foreground)]">
                  Location
                </span>

                <span className="font-medium text-[var(--foreground)] text-right">
                  {DEMO_BUYER.location}
                </span>
              </div>

              <div className="flex justify-between items-center gap-3">
                <span className="text-[var(--muted-foreground)]">
                  Verification
                </span>

                <StatusBadge status="Verification Pending" />
              </div>

            </div>

            <Button
              variant="secondary"
              size="sm"
              fullWidth
              className="mt-3"
              onClick={() =>
                onNavigate("buyer-profile")
              }
            >
              Edit Profile
            </Button>
          </Card>

        </div>
      </div>
    </div>
  );
}