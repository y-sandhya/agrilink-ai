import React, { useMemo, useState } from "react";
import {
  Card,
  Button,
  Badge,
  DemoBanner,
  Modal,
} from "../../components/ui";
import {
  CROP_CATEGORIES,
  DEMO_FARMERS_FOR_BUYER,
} from "../../data/demoData";

type Farmer = typeof DEMO_FARMERS_FOR_BUYER[number];

const ALL_CROPS = Object.values(CROP_CATEGORIES).flat();

export default function FindCrops() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [quality, setQuality] = useState("All");
  const [maxPrice, setMaxPrice] = useState("");
  const [selected, setSelected] = useState<Farmer | null>(null);
  const [message, setMessage] = useState("");

  const filteredFarmers = useMemo(() => {
    return DEMO_FARMERS_FOR_BUYER.filter(farmer => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        farmer.crop.toLowerCase().includes(searchText) ||
        farmer.name.toLowerCase().includes(searchText) ||
        farmer.location.toLowerCase().includes(searchText);

      const matchesCategory =
        category === "All" ||
        Object.entries(CROP_CATEGORIES).some(
          ([categoryName, crops]) =>
            categoryName === category && crops.includes(farmer.crop)
        );

      const matchesQuality =
        quality === "All" || farmer.quality === quality;

      const matchesPrice =
        !maxPrice || farmer.expected_price <= Number(maxPrice);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesQuality &&
        matchesPrice
      );
    }).sort((a, b) => b.match_score - a.match_score);
  }, [search, category, quality, maxPrice]);

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setQuality("All");
    setMaxPrice("");
  };

  const handleAction = (text: string) => {
    setMessage(text);

    window.setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-6xl mx-auto">
      <DemoBanner />

      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl text-[var(--foreground)]">
          Find Crops
        </h1>

        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Find produce from verified and matched farmers.
        </p>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--foreground)] mb-1.5">
              Search crops or farmers
            </label>

            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search Tomato, Onion, farmer name..."
              className="w-full border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            {/* Category */}
            <div>
              <label className="block text-xs font-medium text-[var(--foreground)] mb-1.5">
                Category
              </label>

              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              >
                <option value="All">All Categories</option>

                {Object.keys(CROP_CATEGORIES).map(item => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Quality */}
            <div>
              <label className="block text-xs font-medium text-[var(--foreground)] mb-1.5">
                Quality
              </label>

              <select
                value={quality}
                onChange={e => setQuality(e.target.value)}
                className="w-full border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              >
                <option value="All">All Qualities</option>
                <option value="Grade A">Grade A</option>
                <option value="Grade B">Grade B</option>
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-medium text-[var(--foreground)] mb-1.5">
                Maximum Expected Price / Quintal
              </label>

              <input
                type="number"
                min="0"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
                placeholder="e.g. 1000"
                className="w-full border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="text-xs text-[var(--muted-foreground)]">
              Showing{" "}
              <span className="font-semibold text-[var(--foreground)]">
                {filteredFarmers.length}
              </span>{" "}
              matching crop listings
            </div>

            <button
              onClick={clearFilters}
              className="text-sm text-[var(--green-mid)] font-medium hover:underline"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </Card>

      {/* Success / action message */}
      {message && (
        <div className="bg-[var(--green-pale)] border border-green-200 rounded-xl px-4 py-3 text-sm text-[var(--foreground)]">
          ✓ {message}
        </div>
      )}

      {/* Results */}
      {filteredFarmers.length === 0 ? (
        <Card className="p-10 text-center">
          <div className="text-4xl mb-3">🌾</div>

          <h2 className="font-semibold text-[var(--foreground)]">
            No matching crops found
          </h2>

          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            Try changing your search or filters.
          </p>

          <Button
            variant="secondary"
            size="sm"
            className="mt-4"
            onClick={clearFilters}
          >
            Clear Filters
          </Button>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {filteredFarmers.map(farmer => (
            <Card
              key={farmer.id}
              className="p-5 hover:shadow-md transition-shadow"
            >
              {/* Top */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-[var(--secondary)] flex items-center justify-center text-[var(--primary)] font-bold flex-shrink-0 border border-[var(--border)]">
                    {farmer.name
                      .split(" ")
                      .map(word => word[0])
                      .join("")
                      .slice(0, 2)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold text-[var(--foreground)]">
                        {farmer.name}
                      </h2>

                      {farmer.verified ? (
                        <Badge variant="success" size="xs">
                          ✓ Verified
                        </Badge>
                      ) : (
                        <Badge variant="neutral" size="xs">
                          Verification Pending
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs text-[var(--muted-foreground)] mt-1">
                      📍 {farmer.location}
                    </p>
                  </div>
                </div>

                {/* Match score */}
                <div className="text-right flex-shrink-0">
                  <div className="font-mono font-bold text-lg text-[var(--green-mid)]">
                    {farmer.match_score}%
                  </div>

                  <div className="text-[10px] text-[var(--muted-foreground)]">
                    Match
                  </div>
                </div>
              </div>

              {/* Crop */}
              <div className="mt-4 bg-[var(--muted)] rounded-xl p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs text-[var(--muted-foreground)]">
                      Available Crop
                    </div>

                    <div className="text-lg font-semibold text-[var(--foreground)] mt-0.5">
                      {farmer.crop}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-[var(--muted-foreground)]">
                      Expected Price
                    </div>

                    <div className="font-mono font-bold text-lg text-[var(--green-mid)]">
                      ₹{farmer.expected_price.toLocaleString("en-IN")}
                      <span className="text-xs font-normal">
                        /quintal
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div>
                    <div className="text-[10px] text-[var(--muted-foreground)]">
                      Quantity
                    </div>

                    <div className="text-sm font-medium text-[var(--foreground)]">
                      {farmer.quantity} {farmer.unit}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-[var(--muted-foreground)]">
                      Quality
                    </div>

                    <div className="text-sm font-medium text-[var(--foreground)]">
                      {farmer.quality}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-[var(--muted-foreground)]">
                      Distance
                    </div>

                    <div className="text-sm font-medium text-[var(--foreground)]">
                      {farmer.distance_km} km
                    </div>
                  </div>
                </div>
              </div>

              {/* Harvest */}
              <div className="flex items-center justify-between mt-3 text-xs">
                <span className="text-[var(--muted-foreground)]">
                  🌱 Expected harvest
                </span>

                <span className="font-medium text-[var(--foreground)]">
                  {farmer.harvest_date}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={() => setSelected(farmer)}
                >
                  View Farmer
                </Button>

                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() =>
                    handleAction(
                      `Offer request started for ${farmer.crop} from ${farmer.name}.`
                    )
                  }
                >
                  Send Offer
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Demo note */}
      <div className="text-center text-xs text-[var(--muted-foreground)]">
        Showing demo farmer listings for prototype demonstration.
      </div>

      {/* Farmer Details Modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? selected.name : "Farmer Details"}
      >
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-lg font-semibold text-[var(--foreground)]">
                  {selected.crop}
                </div>

                <div className="text-sm text-[var(--muted-foreground)]">
                  {selected.location}
                </div>
              </div>

              {selected.verified ? (
                <Badge variant="success">
                  ✓ Verified Farmer
                </Badge>
              ) : (
                <Badge variant="neutral">
                  Verification Pending
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: "Available Quantity",
                  value: `${selected.quantity} ${selected.unit}`,
                },
                {
                  label: "Quality",
                  value: selected.quality,
                },
                {
                  label: "Expected Price",
                  value: `₹${selected.expected_price.toLocaleString(
                    "en-IN"
                  )}/quintal`,
                },
                {
                  label: "Distance",
                  value: `${selected.distance_km} km`,
                },
                {
                  label: "Harvest Date",
                  value: selected.harvest_date,
                },
                {
                  label: "Match Score",
                  value: `${selected.match_score}%`,
                },
              ].map(item => (
                <div
                  key={item.label}
                  className="bg-[var(--muted)] rounded-xl p-3"
                >
                  <div className="text-xs text-[var(--muted-foreground)]">
                    {item.label}
                  </div>

                  <div className="text-sm font-medium text-[var(--foreground)] mt-0.5">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[var(--border)] pt-4">
              <Button
                fullWidth
                onClick={() => {
                  handleAction(
                    `Offer request started for ${selected.crop} from ${selected.name}.`
                  );
                  setSelected(null);
                }}
              >
                Send Purchase Offer
              </Button>

              <p className="text-xs text-[var(--muted-foreground)] text-center mt-2">
                Demo action — no real offer has been sent.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}