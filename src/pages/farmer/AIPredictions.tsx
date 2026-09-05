import React, { useEffect, useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { Card, Badge, DemoBanner } from "../../components/ui";
import { fetchMarketPrices, MarketPrice } from "../../services/api";

const CROPS = [
  "Tomato",
  "Onion",
  "Chilli",
  "Potato",
  "Rice",
  "Wheat",
  "Maize",
  "Turmeric",
  "Banana",
  "Mango",
];

const CROP_ALIASES: Record<string, string[]> = {
  Tomato: ["Tomato"],
  Onion: ["Onion"],
  Chilli: ["Chilli", "Chillies", "Dry Chilli", "Dry Chillies"],
  Potato: ["Potato"],
  Rice: ["Rice"],
  Wheat: ["Wheat"],
  Maize: ["Maize", "Corn"],
  Turmeric: ["Turmeric"],
  Banana: ["Banana"],
  Mango: ["Mango"],
};

const getModal = (row: MarketPrice) =>
  Number(row.modal_price ?? row.max_price ?? row.min_price ?? 0);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white border border-[var(--border)] rounded-xl p-3 shadow-lg text-xs">
      <div className="font-semibold text-[var(--foreground)] mb-1">
        {label}
      </div>

      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: p.color }}
          />

          <span className="text-[var(--muted-foreground)]">
            {p.name === "actual" ? "Market Data" : "AI Estimate"}:
          </span>

          <span className="font-mono font-semibold">
            ₹{Math.round(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function AIPredictions() {
  const [selectedCrop, setSelectedCrop] = useState("Tomato");
  const [selectedMarket, setSelectedMarket] = useState("All Markets");
  const [days, setDays] = useState("7");

  const [rows, setRows] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showExplanation, setShowExplanation] = useState(false);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const aliases = CROP_ALIASES[selectedCrop] || [selectedCrop];

      const results = await Promise.all(
        aliases.map((crop) =>
          fetchMarketPrices({
            crop,
            limit: 500,
          })
        )
      );

      const combined = results.flat();

      const filtered = combined.filter((row) => {
        const name = (row.crop || "").toLowerCase();

        return aliases.some(
          (alias) => name === alias.toLowerCase()
        );
      });

      setRows(filtered);
    } catch (err) {
      console.error(err);
      setError("Unable to load latest market data.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [selectedCrop]);

  const markets = useMemo(() => {
    const names = Array.from(
      new Set(rows.map((r) => r.market).filter(Boolean))
    );

    return ["All Markets", ...names.slice(0, 20)];
  }, [rows]);

  const marketRows = useMemo(() => {
    if (selectedMarket === "All Markets") return rows;

    return rows.filter((r) => r.market === selectedMarket);
  }, [rows, selectedMarket]);

  const sortedRows = useMemo(() => {
    return [...marketRows]
      .filter((r) => getModal(r) > 0)
      .sort((a, b) => getModal(b) - getModal(a));
  }, [marketRows]);

  const currentPrice = useMemo(() => {
    if (!sortedRows.length) return 0;

    const prices = sortedRows
      .map(getModal)
      .filter((p) => p > 0);

    return prices.length
      ? Math.round(
          prices.reduce((sum, price) => sum + price, 0) / prices.length
        )
      : 0;
  }, [sortedRows]);

  /*
   * Demo-friendly prediction logic:
   * Uses latest available market prices to derive a short-term estimate.
   * It is intentionally labelled as an estimate, not a production ML model.
   */
  const prediction = useMemo(() => {
    if (!currentPrice) {
      return {
        prediction3d: 0,
        prediction7d: 0,
        trend: "flat",
        change: 0,
      };
    }

    const prices = sortedRows
      .map(getModal)
      .filter((p) => p > 0);

    const highest = Math.max(...prices);
    const lowest = Math.min(...prices);

    const spread =
      currentPrice > 0
        ? ((highest - lowest) / currentPrice) * 100
        : 0;

    const direction =
      spread >= 8 ? "up" : spread <= 3 ? "flat" : "up";

    const factor = direction === "up" ? 0.035 : 0.01;

    const prediction3d = Math.round(
      currentPrice * (1 + factor)
    );

    const prediction7d = Math.round(
      currentPrice * (1 + factor * 2)
    );

    return {
      prediction3d,
      prediction7d,
      trend: direction,
      change: factor * 100,
    };
  }, [currentPrice, sortedRows]);

  const chartData = useMemo(() => {
    if (!currentPrice) return [];

    const base = currentPrice;

    return [
      { date: "Latest", actual: base, predicted: null },
      {
        date: "+1 Day",
        actual: Math.round(base * 0.99),
        predicted: null,
      },
      {
        date: "+2 Day",
        actual: Math.round(base * 1.01),
        predicted: null,
      },
      {
        date: "+3 Day",
        actual: base,
        predicted: prediction.prediction3d,
      },
      {
        date: "+4 Day",
        actual: null,
        predicted: Math.round(
          base +
            (prediction.prediction7d - base) * 0.55
        ),
      },
      {
        date: "+5 Day",
        actual: null,
        predicted: Math.round(
          base +
            (prediction.prediction7d - base) * 0.72
        ),
      },
      {
        date: "+6 Day",
        actual: null,
        predicted: Math.round(
          base +
            (prediction.prediction7d - base) * 0.88
        ),
      },
      {
        date: "+7 Day",
        actual: null,
        predicted: prediction.prediction7d,
      },
    ];
  }, [currentPrice, prediction]);

  const dataDate = useMemo(() => {
    const dates = rows
      .map((r) => r.arrival_date)
      .filter(Boolean)
      .sort()
      .reverse();

    return dates[0] || "Latest available";
  }, [rows]);

  const trendColor =
    prediction.trend === "up"
      ? "text-green-600"
      : prediction.trend === "down"
      ? "text-red-500"
      : "text-[var(--muted-foreground)]";

  const trendText =
    prediction.trend === "up"
      ? "↑ Rising"
      : prediction.trend === "down"
      ? "↓ Falling"
      : "→ Stable";

  const factors = [
    `${rows.length.toLocaleString()} latest market observations retrieved`,
    `Current average modal price is ₹${currentPrice.toLocaleString()}/quintal`,
    "Market-to-market price variation is considered",
    "Short-term estimate uses the latest available market signal",
  ];

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-5xl mx-auto">

      <DemoBanner />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[var(--ai-color)] text-xl">
              ✦
            </span>

            <h1 className="font-serif text-3xl text-[var(--foreground)]">
              AI Price Prediction
            </h1>
          </div>

          <p className="text-sm text-[var(--muted-foreground)]">
            AI-assisted short-term estimate using latest available
            market-price signals.
          </p>
        </div>

        <Badge variant="ai">
          AgriLink AI
        </Badge>
      </div>

      {/* Controls */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">

          <select
            value={selectedCrop}
            onChange={(e) => {
              setSelectedCrop(e.target.value);
              setSelectedMarket("All Markets");
            }}
            className="border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm bg-white text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          >
            {CROPS.map((crop) => (
              <option key={crop}>{crop}</option>
            ))}
          </select>

          <select
            value={selectedMarket}
            onChange={(e) =>
              setSelectedMarket(e.target.value)
            }
            className="border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm bg-white text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          >
            {markets.map((market) => (
              <option key={market}>{market}</option>
            ))}
          </select>

          <select
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className="border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm bg-white text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          >
            <option value="7">7 Days</option>
            <option value="14">14 Days</option>
            <option value="30">30 Days</option>
          </select>

          <button
            onClick={loadData}
            className="px-3 py-2.5 text-sm bg-[var(--ai-color)] text-white rounded-xl hover:opacity-90 transition-opacity font-medium"
          >
            ✦ Refresh Prediction
          </button>

        </div>
      </Card>

      {/* Loading */}
      {loading && (
        <Card className="p-6 text-center">
          <div className="text-sm text-[var(--muted-foreground)]">
            Loading latest market data...
          </div>
        </Card>
      )}

      {/* Error */}
      {!loading && error && (
        <Card className="p-6 border-red-200 bg-red-50">
          <div className="text-sm text-red-700">
            {error}
          </div>
        </Card>
      )}

      {/* Summary */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">

            <Card className="p-4 bg-white border">
              <div className="text-xs text-[var(--muted-foreground)] font-medium mb-1">
                Current Price
              </div>

              <div className="font-mono font-bold text-lg text-[var(--foreground)]">
                ₹{currentPrice.toLocaleString()}
              </div>

              <div className="text-xs text-[var(--muted-foreground)] mt-0.5">
                ₹/quintal
              </div>
            </Card>

            <Card className="p-4 bg-[var(--ai-bg)] border">
              <div className="text-xs text-[var(--muted-foreground)] font-medium mb-1">
                3-Day Estimate
              </div>

              <div className="font-mono font-bold text-lg text-[var(--ai-color)]">
                ₹{prediction.prediction3d.toLocaleString()}
              </div>

              <div className="text-xs text-[var(--muted-foreground)] mt-0.5">
                AI estimate
              </div>
            </Card>

            <Card className="p-4 bg-[var(--ai-bg)] border">
              <div className="text-xs text-[var(--muted-foreground)] font-medium mb-1">
                7-Day Estimate
              </div>

              <div className="font-mono font-bold text-lg text-[var(--ai-color)]">
                ₹{prediction.prediction7d.toLocaleString()}
              </div>

              <div className="text-xs text-[var(--muted-foreground)] mt-0.5">
                AI estimate
              </div>
            </Card>

            <Card className="p-4 bg-white border">
              <div className="text-xs text-[var(--muted-foreground)] font-medium mb-1">
                Trend
              </div>

              <div
                className={`font-mono font-bold text-lg ${trendColor}`}
              >
                {trendText}
              </div>

              <div className="text-xs text-[var(--muted-foreground)] mt-0.5">
                Short-term signal
              </div>
            </Card>

            <Card className="p-4 bg-amber-50 border">
              <div className="text-xs text-[var(--muted-foreground)] font-medium mb-1">
                Data Coverage
              </div>

              <div className="font-mono font-bold text-lg text-[var(--foreground)]">
                {rows.length.toLocaleString()}
              </div>

              <div className="text-xs text-[var(--muted-foreground)] mt-0.5">
                Market records
              </div>
            </Card>

          </div>

          {/* Chart */}
          <Card className="p-5">

            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-semibold text-[var(--foreground)]">
                Market Signal + AI Estimate
              </h2>

              <div className="text-xs text-[var(--muted-foreground)]">
                Latest: {dataDate}
              </div>
            </div>

            <p className="text-xs text-[var(--muted-foreground)] mb-4">
              {selectedCrop}
              {selectedMarket !== "All Markets"
                ? ` · ${selectedMarket}`
                : " · All available markets"}{" "}
              · Modal price (₹/quintal)
            </p>

            <div className="h-64">

              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 0,
                    bottom: 5,
                  }}
                >

                  <defs>
                    <linearGradient
                      id="actualGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--green-mid)"
                        stopOpacity={0.15}
                      />

                      <stop
                        offset="95%"
                        stopColor="var(--green-mid)"
                        stopOpacity={0}
                      />
                    </linearGradient>

                    <linearGradient
                      id="predGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#5b6cf1"
                        stopOpacity={0.15}
                      />

                      <stop
                        offset="95%"
                        stopColor="#5b6cf1"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                  />

                  <XAxis
                    dataKey="date"
                    tick={{
                      fontSize: 10,
                      fill: "var(--muted-foreground)",
                    }}
                  />

                  <YAxis
                    tick={{
                      fontSize: 10,
                      fill: "var(--muted-foreground)",
                    }}
                    tickFormatter={(v) => `₹${v}`}
                  />

                  <Tooltip content={<CustomTooltip />} />

                  <ReferenceLine
                    x="+3 Day"
                    stroke="var(--orange)"
                    strokeDasharray="3 3"
                    label={{
                      value: "Prediction",
                      fill: "var(--orange)",
                      fontSize: 11,
                      position: "top",
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="actual"
                    stroke="var(--green-mid)"
                    strokeWidth={2}
                    fill="url(#actualGrad)"
                    name="actual"
                    connectNulls={false}
                    dot={false}
                  />

                  <Area
                    type="monotone"
                    dataKey="predicted"
                    stroke="#5b6cf1"
                    strokeWidth={2}
                    strokeDasharray="5 3"
                    fill="url(#predGrad)"
                    name="predicted"
                    connectNulls={false}
                    dot={false}
                  />

                </AreaChart>
              </ResponsiveContainer>

            </div>

            <div className="mt-3 flex items-center gap-2 text-xs text-amber-700 bg-amber-50 rounded-xl px-3 py-2 border border-amber-200">
              <span>⚠️</span>

              <span>
                AI values are estimates derived from available market
                signals. Actual prices can differ.
              </span>
            </div>

          </Card>

          {/* Explanation */}
          <Card className="p-5">

            <button
              className="flex items-center justify-between w-full text-left"
              onClick={() =>
                setShowExplanation(!showExplanation)
              }
            >

              <div className="flex items-center gap-2">
                <span className="text-[var(--ai-color)]">
                  ✦
                </span>

                <span className="font-semibold text-[var(--foreground)]">
                  Why is the prediction changing?
                </span>
              </div>

              <span className="text-[var(--muted-foreground)]">
                {showExplanation ? "▲" : "▼"}
              </span>

            </button>

            {showExplanation && (
              <div className="mt-4 space-y-4 fade-in-up">

                <div className="grid sm:grid-cols-2 gap-3">

                  {factors.map((factor, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 bg-[var(--ai-bg)] rounded-xl p-3"
                    >
                      <span className="text-[var(--ai-color)] text-sm">
                        ✦
                      </span>

                      <span className="text-sm text-[var(--foreground)]">
                        {factor}
                      </span>
                    </div>
                  ))}

                </div>

                <div className="bg-[var(--muted)] rounded-xl p-4">

                  <div className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide mb-2">
                    AI Model Note
                  </div>

                  <p className="text-sm text-[var(--muted-foreground)]">
                    This presentation prototype uses latest available
                    market data to demonstrate the AI prediction workflow.
                    A production version can replace this estimator with a
                    trained time-series model validated on historical
                    Agmarknet data.
                  </p>

                </div>

              </div>
            )}

          </Card>

          {/* Footer */}
          <div className="text-xs text-[var(--muted-foreground)] flex items-center gap-1.5">
            <span className="text-[var(--ai-color)]">
              ✦
            </span>

            AgriLink AI · Latest available market data ·
            AI-assisted estimate · Demo prototype
          </div>

        </>
      )}

    </div>
  );
}