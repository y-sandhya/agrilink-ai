import React, { useMemo, useState } from "react";
import {
  Card,
  Button,
  Badge,
  DemoBanner,
} from "../../components/ui";
import {
  CROP_CATEGORIES,
  DEMO_FARMERS_FOR_BUYER,
} from "../../data/demoData";

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

export default function PostRequirement({
  onNavigate,
}: {
  onNavigate: (p: string) => void;
}) {
  const allCrops = useMemo(
    () => Object.values(CROP_CATEGORIES).flat(),
    []
  );

  const [crop, setCrop] = useState("");
  const [quantity, setQuantity] = useState("");
  const [quality, setQuality] = useState("Any Quality");
  const [budget, setBudget] = useState("");
  const [location, setLocation] = useState("");
  const [requiredBy, setRequiredBy] = useState("");
  const [additionalRequirements, setAdditionalRequirements] = useState("");

  const [posted, setPosted] = useState(false);
  const [error, setError] = useState("");
  const [requirement, setRequirement] =
    useState<Requirement | null>(null);

  const inputClass =
    "w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--green-mid)]";

  const labelClass =
    "block text-sm font-medium text-[var(--foreground)] mb-1.5";

  const saveRequirement = (item: Requirement) => {
    try {
      const existing = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([item, ...existing])
      );
    } catch {
      // Continue even if localStorage is unavailable.
    }
  };

  const handlePostRequirement = () => {
    setError("");

    if (!crop) {
      setError("Please select a crop.");
      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      setError("Please enter a valid quantity.");
      return;
    }

    if (!budget || Number(budget) <= 0) {
      setError("Please enter a valid maximum budget.");
      return;
    }

    const newRequirement: Requirement = {
      id: `REQ-${Date.now()}`,
      crop,
      quantity: Number(quantity),
      quality,
      budget: Number(budget),
      location: location.trim() || "Any Location",
      requiredBy: requiredBy || "Flexible",
      additionalRequirements:
        additionalRequirements.trim() ||
        "No additional requirements",
      createdAt: new Date().toISOString(),
    };

    saveRequirement(newRequirement);
    setRequirement(newRequirement);
    setPosted(true);
  };

  const resetForm = () => {
    setCrop("");
    setQuantity("");
    setQuality("Any Quality");
    setBudget("");
    setLocation("");
    setRequiredBy("");
    setAdditionalRequirements("");
    setRequirement(null);
    setError("");
    setPosted(false);
  };

  // =========================
  // SUCCESS SCREEN
  // =========================

  if (posted && requirement) {
    return (
      <div className="p-4 lg:p-6 max-w-2xl mx-auto">
        <Card className="p-8 text-center">

          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--green-pale)] flex items-center justify-center text-3xl text-[var(--green-mid)]">
            ✓
          </div>

          <Badge className="mb-3">
            Requirement Active
          </Badge>

          <h2 className="font-serif text-2xl text-[var(--foreground)] mb-2">
            Requirement Posted!
          </h2>

          <p className="text-[var(--muted-foreground)] text-sm mb-6">
            Your requirement has been saved successfully.
          </p>

          <div className="bg-[var(--green-pale)] rounded-xl p-4 mb-4 text-left space-y-3">

            <div className="flex justify-between gap-4">
              <span className="text-sm text-[var(--muted-foreground)]">
                Crop
              </span>
              <strong className="text-sm text-[var(--foreground)]">
                {requirement.crop}
              </strong>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-sm text-[var(--muted-foreground)]">
                Quantity
              </span>
              <strong className="text-sm text-[var(--foreground)]">
                {requirement.quantity.toLocaleString()} kg
              </strong>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-sm text-[var(--muted-foreground)]">
                Quality
              </span>
              <strong className="text-sm text-[var(--foreground)]">
                {requirement.quality}
              </strong>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-sm text-[var(--muted-foreground)]">
                Maximum Offer
              </span>
              <strong className="text-sm text-[var(--green-mid)]">
                ₹{requirement.budget.toLocaleString()}/quintal
              </strong>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-sm text-[var(--muted-foreground)]">
                Location
              </span>
              <strong className="text-sm text-[var(--foreground)]">
                {requirement.location}
              </strong>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-sm text-[var(--muted-foreground)]">
                Required By
              </span>
              <strong className="text-sm text-[var(--foreground)]">
                {requirement.requiredBy}
              </strong>
            </div>

          </div>

          <div className="bg-[var(--green-pale)] rounded-xl p-4 mb-6 text-left">

            <div className="text-sm font-semibold text-[var(--green-mid)] mb-1">
              {DEMO_FARMERS_FOR_BUYER.length} potential farmer matches
            </div>

            <div className="text-xs text-[var(--muted-foreground)]">
              Matching is based on crop, quantity, quality, location
              and pricing criteria.
            </div>

          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">

            <Button
              onClick={() =>
                onNavigate("buyer-find-farmers")
              }
            >
              View Matching Farmers →
            </Button>

            <Button
              variant="secondary"
              onClick={resetForm}
            >
              Post Another
            </Button>

          </div>

        </Card>
      </div>
    );
  }

  // =========================
  // FORM
  // =========================

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-2xl mx-auto">

      <DemoBanner />

      <div>
        <h1 className="font-serif text-3xl text-[var(--foreground)]">
          Post Requirement
        </h1>

        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Tell farmers what you're looking to buy
        </p>
      </div>

      <Card className="p-6 space-y-5">

        {/* CROP */}

        <div>
          <label className={labelClass}>
            Crop <span className="text-red-500">*</span>
          </label>

          <select
            className={inputClass}
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
          >
            <option value="">
              Select crop
            </option>

            {allCrops.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* QUANTITY + QUALITY */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div>
            <label className={labelClass}>
              Quantity (kg){" "}
              <span className="text-red-500">*</span>
            </label>

            <input
              className={inputClass}
              type="number"
              min="1"
              placeholder="500"
              value={quantity}
              onChange={(e) =>
                setQuantity(e.target.value)
              }
            />
          </div>

          <div>
            <label className={labelClass}>
              Quality Grade
            </label>

            <select
              className={inputClass}
              value={quality}
              onChange={(e) =>
                setQuality(e.target.value)
              }
            >
              <option value="Grade A">
                Grade A
              </option>

              <option value="Grade B">
                Grade B
              </option>

              <option value="Any Quality">
                Any Quality
              </option>
            </select>
          </div>

        </div>

        {/* BUDGET */}

        <div>
          <label className={labelClass}>
            Maximum Budget / Offer Price (₹/quintal){" "}
            <span className="text-red-500">*</span>
          </label>

          <input
            className={inputClass}
            type="number"
            min="1"
            placeholder="e.g. 950"
            value={budget}
            onChange={(e) =>
              setBudget(e.target.value)
            }
          />
        </div>

        {/* LOCATION */}

        <div>
          <label className={labelClass}>
            Preferred Location
          </label>

          <input
            className={inputClass}
            type="text"
            placeholder="City, State"
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
            }
          />
        </div>

        {/* DATE */}

        <div>
          <label className={labelClass}>
            Required By Date
          </label>

          <input
            className={inputClass}
            type="date"
            value={requiredBy}
            onChange={(e) =>
              setRequiredBy(e.target.value)
            }
          />
        </div>

        {/* ADDITIONAL REQUIREMENTS */}

        <div>
          <label className={labelClass}>
            Additional Requirements
          </label>

          <textarea
            className={`${inputClass} resize-none`}
            placeholder="Any specific requirements, packaging, delivery terms..."
            rows={3}
            value={additionalRequirements}
            onChange={(e) =>
              setAdditionalRequirements(
                e.target.value
              )
            }
          />
        </div>

        {/* NOTE */}

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
          <strong>Note:</strong> Your requirement will
          be visible to registered farmers matching your
          criteria. Contact information is not displayed
          publicly without permission.
        </div>

        {/* ERROR */}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* SUBMIT */}

        <Button
          fullWidth
          size="lg"
          onClick={handlePostRequirement}
        >
          Post Requirement
        </Button>

      </Card>
    </div>
  );
}