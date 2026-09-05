import React, { useMemo, useState } from "react";
import {
  Card,
  Button,
  Badge,
  DemoBanner,
  MatchScore,
} from "../../components/ui";
import { DEMO_FARMERS_FOR_BUYER } from "../../data/demoData";

export default function FindFarmers() {
  const [crop, setCrop] = useState("Tomato");
  const [quality, setQuality] = useState("Grade A");
  const [distance, setDistance] = useState("All Distances");
  const [sortBy, setSortBy] = useState("Best Match");

  const [message, setMessage] = useState("");

  const farmers = useMemo(() => {
    let result = [...DEMO_FARMERS_FOR_BUYER];

    if (crop !== "All Crops") {
      result = result.filter(
        (farmer) =>
          farmer.crop.toLowerCase() === crop.toLowerCase()
      );
    }

    if (quality !== "Any Quality") {
      result = result.filter(
        (farmer) =>
          farmer.quality.toLowerCase() === quality.toLowerCase()
      );
    }

    if (distance === "Within 50 km") {
      result = result.filter(
        (farmer) => farmer.distance_km <= 50
      );
    }

    if (distance === "Within 100 km") {
      result = result.filter(
        (farmer) => farmer.distance_km <= 100
      );
    }

    if (sortBy === "Nearest First") {
      result.sort(
        (a, b) => a.distance_km - b.distance_km
      );
    }

    if (sortBy === "Lowest Price") {
      result.sort(
        (a, b) => a.expected_price - b.expected_price
      );
    }

    if (sortBy === "Best Match") {
      result.sort(
        (a, b) => b.match_score - a.match_score
      );
    }

    return result;
  }, [crop, quality, distance, sortBy]);

  const action = (
    type: "offer" | "view" | "contact" | "order",
    farmerName: string
  ) => {
    if (type === "offer") {
      setMessage(
        `Offer started for ${farmerName}. You can negotiate price and quantity.`
      );
    }

    if (type === "view") {
      setMessage(
        `Viewing farmer profile: ${farmerName}`
      );
    }

    if (type === "contact") {
      setMessage(
        `Contact request sent to ${farmerName}.`
      );
    }

    if (type === "order") {
      setMessage(
        `Order request started for ${farmerName}.`
      );
    }

    setTimeout(() => setMessage(""), 3500);
  };

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-4xl mx-auto">

      <DemoBanner />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl text-[var(--foreground)]">
            Find Farmers
          </h1>

          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            Farmers matching your requirements
          </p>
        </div>

        <div className="bg-[var(--green-pale)] border border-green-200 rounded-xl px-4 py-2 text-sm font-medium text-[var(--green-mid)]">
          {farmers.length} matches found
        </div>
      </div>

      {/* Success / action message */}
      {message && (
        <div className="bg-[var(--green-pale)] border border-green-200 rounded-xl px-4 py-3 text-sm text-[var(--green-mid)] font-medium fade-in-up">
          ✓ {message}
        </div>
      )}

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

          <select
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            className="border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          >
            <option>Tomato</option>
            <option>All Crops</option>
            <option>Onion</option>
            <option>Chilli</option>
            <option>Potato</option>
            <option>Rice</option>
          </select>

          <select
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
            className="border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          >
            <option>Grade A</option>
            <option>Any Quality</option>
            <option>Grade B</option>
          </select>

          <select
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            className="border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          >
            <option>All Distances</option>
            <option>Within 50 km</option>
            <option>Within 100 km</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          >
            <option>Best Match</option>
            <option>Nearest First</option>
            <option>Lowest Price</option>
          </select>

        </div>
      </Card>

      {/* Results */}
      <div className="space-y-4">

        {farmers.length === 0 && (
          <Card className="p-8 text-center">
            <div className="text-3xl mb-2">🌾</div>

            <h3 className="font-semibold text-[var(--foreground)]">
              No matching farmers
            </h3>

            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              Try changing the crop, quality, or distance filter.
            </p>
          </Card>
        )}

        {farmers.map((farmer) => (
          <Card key={farmer.id} className="p-5">

            <div className="flex flex-col sm:flex-row gap-4">

              {/* Match score */}
              <div className="flex-shrink-0">
                <MatchScore score={farmer.match_score} />
              </div>

              <div className="flex-1">

                {/* Farmer heading */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">

                      <h3 className="font-semibold text-[var(--foreground)] text-base">
                        {farmer.name}
                      </h3>

                      {farmer.verified ? (
                        <Badge variant="success">
                          Identity Verified
                        </Badge>
                      ) : (
                        <Badge variant="warning">
                          Unverified
                        </Badge>
                      )}

                    </div>

                    <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
                      📍 {farmer.location} · {farmer.distance_km} km
                    </p>
                  </div>

                  <div className="text-right">

                    <div className="font-mono font-bold text-[var(--foreground)] text-lg">
                      ₹{farmer.expected_price}
                    </div>

                    <div className="text-xs text-[var(--muted-foreground)]">
                      Expected price/quintal
                    </div>

                  </div>

                </div>

                {/* Farmer details */}
                <div className="flex flex-wrap gap-2 mb-4">

                  {[
                    {
                      label: "Crop",
                      value: farmer.crop,
                    },
                    {
                      label: "Quantity",
                      value: `${farmer.quantity} ${farmer.unit}`,
                    },
                    {
                      label: "Quality",
                      value: farmer.quality,
                    },
                    {
                      label: "Harvest",
                      value: farmer.harvest_date,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="bg-[var(--muted)] rounded-lg px-3 py-1.5 text-xs"
                    >
                      <span className="text-[var(--muted-foreground)]">
                        {item.label}:{" "}
                      </span>

                      <span className="font-medium text-[var(--foreground)]">
                        {item.value}
                      </span>
                    </div>
                  ))}

                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-wrap">

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() =>
                      action("offer", farmer.name)
                    }
                  >
                    Send Offer
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      action("view", farmer.name)
                    }
                  >
                    View Farmer
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      action("contact", farmer.name)
                    }
                  >
                    Contact
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      action("order", farmer.name)
                    }
                  >
                    Place Order
                  </Button>

                </div>

              </div>
            </div>

          </Card>
        ))}

      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">

        <Badge variant="demo">
          Demo Farmers — Not real verified farmers
        </Badge>

        <span className="text-xs text-[var(--muted-foreground)]">
          Matching considers crop, quality, distance and price.
        </span>

      </div>

    </div>
  );
}