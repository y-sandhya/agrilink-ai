import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  Button,
  Badge,
  DemoBanner,
  Modal,
} from "../../components/ui";
import { DEMO_CROPS, CROP_CATEGORIES } from "../../data/demoData";

const CROP_EMOJI: Record<string, string> = {
  Tomato: "🍅",
  Chilli: "🌶️",
  Onion: "🧅",
  Potato: "🥔",
  Rice: "🌾",
  Wheat: "🌾",
  Mango: "🥭",
  Banana: "🍌",
  Spinach: "🥬",
  Coriander: "🌿",
  Mint: "🌿",
  "Curry Leaves": "🌿",
  Carrot: "🥕",
  Brinjal: "🍆",
  Cabbage: "🥬",
  Cauliflower: "🥦",
  Apple: "🍎",
  Orange: "🍊",
  Papaya: "🍈",
  Guava: "🍐",
  Watermelon: "🍉",
  Grapes: "🍇",
  Pineapple: "🍍",
};

type Crop = {
  id: string | number;
  name: string;
  variety?: string;
  quantity: number | string;
  unit?: string;
  quality?: string;
  harvest_date?: string;
  current_price?: number | string;
  preferred_market?: string;
};

type Listing = {
  id: string;
  crop: string;
  quantity: string;
  market: string;
  price: number;
  createdAt: string;
  status: "Active" | "Sold" | "Cancelled";
};

const STORAGE_KEY = "agrilink_sale_listings";
const CROPS_STORAGE_KEY = "agrilink_my_crops";

const allCropNames = Object.values(CROP_CATEGORIES).flat();

const inputClass =
  "w-full border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm bg-white text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]";

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export default function MyCrops({
  onNavigate,
}: {
  onNavigate: (p: string) => void;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [showSell, setShowSell] = useState(false);
  const [showListings, setShowListings] = useState(false);

  const [customCrops, setCustomCrops] = useState<Crop[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);

  const [sellDetails, setSellDetails] = useState({
    crop: "",
    market: "",
    price: "",
  });

  const [sellQuantity, setSellQuantity] = useState("");

  const [addForm, setAddForm] = useState({
    crop: "",
    variety: "",
    quantity: "",
    quality: "Grade A",
    harvestDate: "",
    location: "",
    price: "",
    market: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    setCustomCrops(readStorage<Crop[]>(CROPS_STORAGE_KEY, []));
    setListings(readStorage<Listing[]>(STORAGE_KEY, []));
  }, []);

  const crops = useMemo(
    () => [...(DEMO_CROPS as Crop[]), ...customCrops],
    [customCrops]
  );

  const saveListings = (next: Listing[]) => {
    setListings(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const openSell = (crop?: Crop) => {
    setSellDetails({
      crop: crop?.name || "",
      market: crop?.preferred_market || "",
      price: crop?.current_price ? String(crop.current_price) : "",
    });

    setSellQuantity(crop?.quantity ? String(crop.quantity) : "");
    setMessage("");
    setShowSell(true);
  };

  const handleConfirmSale = () => {
    const quantity = Number(sellQuantity);
    const price = Number(sellDetails.price);

    if (!sellDetails.crop) {
      setMessage("Please select a crop.");
      return;
    }

    if (!quantity || quantity <= 0) {
      setMessage("Please enter a valid quantity.");
      return;
    }

    if (!price || price <= 0) {
      setMessage("Please enter a valid asking price.");
      return;
    }

    const listing: Listing = {
      id: `LIST-${Date.now()}`,
      crop: sellDetails.crop,
      quantity: sellQuantity,
      market: sellDetails.market || "Any Market",
      price,
      createdAt: new Date().toISOString(),
      status: "Active",
    };

    const next = [...listings, listing];

    saveListings(next);

    setShowSell(false);
    setShowListings(true);
    setMessage(`${listing.crop} listing created successfully.`);
  };

  const handleAddCrop = () => {
    if (!addForm.crop) {
      setMessage("Please select a crop.");
      return;
    }

    const quantity = Number(addForm.quantity);

    if (!quantity || quantity <= 0) {
      setMessage("Please enter a valid quantity.");
      return;
    }

    const newCrop: Crop = {
      id: `CROP-${Date.now()}`,
      name: addForm.crop,
      variety: addForm.variety || "Standard",
      quantity,
      unit: "kg",
      quality: addForm.quality,
      harvest_date: addForm.harvestDate || "Not specified",
      current_price: Number(addForm.price) || 0,
      preferred_market:
        addForm.market || addForm.location || "Nearby Market",
    };

    const next = [...customCrops, newCrop];

    setCustomCrops(next);

    localStorage.setItem(
      CROPS_STORAGE_KEY,
      JSON.stringify(next)
    );

    setAddForm({
      crop: "",
      variety: "",
      quantity: "",
      quality: "Grade A",
      harvestDate: "",
      location: "",
      price: "",
      market: "",
    });

    setShowAdd(false);
    setMessage(`${newCrop.name} added to My Crops.`);
  };

  const cancelListing = (id: string) => {
    const next = listings.map((item) =>
      item.id === id
        ? { ...item, status: "Cancelled" as const }
        : item
    );

    saveListings(next);
  };

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-5xl mx-auto">
      <DemoBanner />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl text-[var(--foreground)]">
            My Crops
          </h1>

          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            Manage your crop listings
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => setShowListings(true)}
          >
            My Listings (
            {listings.filter((x) => x.status === "Active").length}
            )
          </Button>

          <Button onClick={() => setShowAdd(true)}>
            + Add Crop
          </Button>
        </div>
      </div>

      {message && (
        <div className="rounded-xl bg-[var(--green-pale)] border border-[var(--border)] px-4 py-3 text-sm text-[var(--foreground)]">
          {message}
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {crops.map((crop) => (
          <Card key={crop.id} className="p-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-[var(--muted)] flex items-center justify-center text-3xl flex-shrink-0">
                {CROP_EMOJI[crop.name] || "🌾"}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[var(--foreground)] text-base">
                  {crop.name}
                </h3>

                <p className="text-sm text-[var(--muted-foreground)]">
                  {crop.variety || "Standard"}
                </p>

                <Badge variant="success" size="xs">
                  Ready
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                {
                  label: "Quantity",
                  value: `${crop.quantity} ${crop.unit || "kg"}`,
                },
                {
                  label: "Quality",
                  value: crop.quality || "Grade A",
                },
                {
                  label: "Harvest Date",
                  value: crop.harvest_date || "Not specified",
                },
                {
                  label: "Market Price",
                  value: crop.current_price
                    ? `₹${crop.current_price}/q`
                    : "Check market",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-[var(--muted)] rounded-xl p-2.5"
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

            <div className="text-xs text-[var(--muted-foreground)] mb-3">
              Preferred:{" "}
              {crop.preferred_market || "Nearby Market"}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => openSell(crop)}
              >
                Sell
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => onNavigate("farmer-market")}
              >
                View Price
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate("farmer-buyers")}
              >
                Find Buyers
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setMessage(
                    `${crop.name} is ready to be managed.`
                  )
                }
              >
                Edit
              </Button>
            </div>
          </Card>
        ))}

        <button
          onClick={() => setShowAdd(true)}
          className="border-2 border-dashed border-[var(--border)] rounded-2xl p-8 text-center hover:border-[var(--green-mid)] hover:bg-[var(--green-pale)] transition-all group"
        >
          <div className="text-4xl mb-3 opacity-40 group-hover:opacity-70">
            +
          </div>

          <div className="text-sm font-medium text-[var(--muted-foreground)] group-hover:text-[var(--green-mid)]">
            Add New Crop
          </div>
        </button>
      </div>

      {/* ADD CROP MODAL */}
      <Modal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title="Add New Crop"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">
                Crop *
              </label>

              <select
                value={addForm.crop}
                onChange={(e) =>
                  setAddForm({
                    ...addForm,
                    crop: e.target.value,
                  })
                }
                className={inputClass}
              >
                <option value="">Select crop</option>

                {allCropNames.map((crop) => (
                  <option key={crop} value={crop}>
                    {crop}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">
                Variety
              </label>

              <input
                value={addForm.variety}
                onChange={(e) =>
                  setAddForm({
                    ...addForm,
                    variety: e.target.value,
                  })
                }
                placeholder="e.g. Hybrid F1"
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">
                Quantity (kg) *
              </label>

              <input
                type="number"
                min="1"
                value={addForm.quantity}
                onChange={(e) =>
                  setAddForm({
                    ...addForm,
                    quantity: e.target.value,
                  })
                }
                placeholder="500"
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">
                Quality Grade
              </label>

              <select
                value={addForm.quality}
                onChange={(e) =>
                  setAddForm({
                    ...addForm,
                    quality: e.target.value,
                  })
                }
                className={inputClass}
              >
                <option>Grade A</option>
                <option>Grade B</option>
                <option>Grade C</option>
                <option>Organic</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">
                Expected Harvest Date
              </label>

              <input
                type="date"
                value={addForm.harvestDate}
                onChange={(e) =>
                  setAddForm({
                    ...addForm,
                    harvestDate: e.target.value,
                  })
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">
                Location
              </label>

              <input
                value={addForm.location}
                onChange={(e) =>
                  setAddForm({
                    ...addForm,
                    location: e.target.value,
                  })
                }
                placeholder="Village, District"
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">
                Expected Price (₹/quintal)
              </label>

              <input
                type="number"
                min="0"
                value={addForm.price}
                onChange={(e) =>
                  setAddForm({
                    ...addForm,
                    price: e.target.value,
                  })
                }
                placeholder="2000"
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">
                Preferred Market
              </label>

              <input
                value={addForm.market}
                onChange={(e) =>
                  setAddForm({
                    ...addForm,
                    market: e.target.value,
                  })
                }
                placeholder="e.g. Madanapalle APMC"
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setShowAdd(false)}
            >
              Cancel
            </Button>

            <Button fullWidth onClick={handleAddCrop}>
              Add Crop
            </Button>
          </div>
        </div>
      </Modal>

      {/* SELL MODAL */}
      <Modal
        open={showSell}
        onClose={() => setShowSell(false)}
        title="Sell Your Produce"
      >
        <div className="space-y-4">
          <div className="bg-[var(--green-pale)] rounded-2xl p-4">
            <div className="text-xs text-[var(--muted-foreground)]">
              Selected Crop
            </div>

            <div className="text-lg font-semibold text-[var(--foreground)] mt-1">
              {CROP_EMOJI[sellDetails.crop] || "🌾"}{" "}
              {sellDetails.crop || "Select Crop"}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">
                Quantity (kg) *
              </label>

              <input
                type="number"
                min="1"
                value={sellQuantity}
                onChange={(e) =>
                  setSellQuantity(e.target.value)
                }
                placeholder="500"
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">
                Asking Price (₹/quintal) *
              </label>

              <input
                type="number"
                min="1"
                value={sellDetails.price}
                onChange={(e) =>
                  setSellDetails({
                    ...sellDetails,
                    price: e.target.value,
                  })
                }
                placeholder="2000"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">
              Selected Market
            </label>

            <input
              value={sellDetails.market}
              onChange={(e) =>
                setSellDetails({
                  ...sellDetails,
                  market: e.target.value,
                })
              }
              placeholder="Select market"
              className={inputClass}
            />
          </div>

          <div className="bg-[var(--muted)] rounded-xl p-3">
            <div className="text-xs text-[var(--muted-foreground)]">
              Listing price
            </div>

            <div className="font-mono font-semibold text-lg text-[var(--foreground)]">
              ₹{Number(sellDetails.price) || 0}/quintal
            </div>
          </div>

          {message && (
            <div className="text-sm text-red-600">
              {message}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setShowSell(false)}
            >
              Cancel
            </Button>

            <Button
              fullWidth
              onClick={handleConfirmSale}
            >
              Confirm Listing
            </Button>
          </div>
        </div>
      </Modal>

      {/* MY LISTINGS MODAL */}
      <Modal
        open={showListings}
        onClose={() => setShowListings(false)}
        title="My Sale Listings"
      >
        <div className="space-y-3">
          {listings.length === 0 ? (
            <div className="text-center py-8 text-sm text-[var(--muted-foreground)]">
              No sale listings yet. Tap Sell on a crop to
              create one.
            </div>
          ) : (
            listings
              .slice()
              .reverse()
              .map((listing) => (
                <div
                  key={listing.id}
                  className="border border-[var(--border)] rounded-xl p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold">
                        {CROP_EMOJI[listing.crop] || "🌾"}{" "}
                        {listing.crop}
                      </div>

                      <div className="text-sm text-[var(--muted-foreground)]">
                        {listing.quantity} kg •{" "}
                        {listing.market}
                      </div>
                    </div>

                    <Badge
                      variant={
                        listing.status === "Active"
                          ? "success"
                          : "neutral"
                      }
                      size="xs"
                    >
                      {listing.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <span className="font-mono font-semibold">
                      ₹{listing.price}/quintal
                    </span>

                    {listing.status === "Active" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          cancelListing(listing.id)
                        }
                      >
                        Cancel Listing
                      </Button>
                    )}
                  </div>
                </div>
              ))
          )}
        </div>
      </Modal>
    </div>
  );
}