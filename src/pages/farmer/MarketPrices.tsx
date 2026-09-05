import { useEffect, useState } from "react";
import {
  RefreshCw,
  TrendingUp,
  MapPin,
  Calendar,
} from "lucide-react";
import { fetchMarketPrices } from "../../services/api";

type MarketPrice = {
  id: number;
  state: string | null;
  district: string | null;
  market: string;
  crop: string;
  variety: string | null;
  grade: string | null;
  arrival_date: string | null;
  min_price: string | number | null;
  max_price: string | number | null;
  modal_price: string | number | null;
  unit: string;
  source: string;
  last_fetched: string;
};

export default function MarketPrices() {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [crop, setCrop] = useState("Tomato");
  const [state, setState] = useState("Andhra Pradesh");

  async function loadPrices() {
    try {
      setLoading(true);
      setError("");

      const data = await fetchMarketPrices({
        crop,
        state,
        limit: 100,
      });

      setPrices(data || []);
    } catch (err) {
      console.error(err);
      setError(
        "Unable to load market prices. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPrices();
  }, []);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Market Prices
          </h1>

          <p className="mt-1 text-sm text-gray-600">
            Latest available mandi prices from AGMARKNET
          </p>
        </div>

        <button
          onClick={loadPrices}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-60"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              loading ? "animate-spin" : ""
            }`}
          />

          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 rounded-xl border bg-white p-4 md:grid-cols-2">

        {/* Crop */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Crop
          </label>

          <select
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
          >
            <option value="Tomato">Tomato</option>
            <option value="Onion">Onion</option>
            <option value="Potato">Potato</option>
            <option value="Rice">Rice</option>
            <option value="Wheat">Wheat</option>
            <option value="Maize">Maize</option>
            <option value="Chilli">Chilli</option>
            <option value="Turmeric">Turmeric</option>
            <option value="Banana">Banana</option>
            <option value="Mango">Mango</option>
          </select>
        </div>

        {/* State */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            State
          </label>

          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
          >
            <option value="Andhra Pradesh">
              Andhra Pradesh
            </option>

            <option value="Telangana">
              Telangana
            </option>

            <option value="Karnataka">
              Karnataka
            </option>

            <option value="Tamil Nadu">
              Tamil Nadu
            </option>

            <option value="Maharashtra">
              Maharashtra
            </option>
          </select>
        </div>
      </div>

      {/* Apply Filters */}
      <button
        onClick={loadPrices}
        className="rounded-lg bg-green-700 px-5 py-2 font-semibold text-white hover:bg-green-800"
      >
        Apply Filters
      </button>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="rounded-xl border bg-white p-10 text-center">
          <RefreshCw className="mx-auto h-7 w-7 animate-spin text-green-700" />

          <p className="mt-3 text-sm text-gray-600">
            Loading latest market prices...
          </p>
        </div>
      )}

      {/* Empty */}
      {!loading &&
        !error &&
        prices.length === 0 && (
          <div className="rounded-xl border bg-white p-10 text-center">
            <p className="font-medium text-gray-800">
              No market prices found.
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Try another crop or state.
            </p>
          </div>
        )}

      {/* Market Cards */}
      {!loading && prices.length > 0 && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

          {prices.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border bg-white p-5 shadow-sm"
            >

              {/* Market Header */}
              <div className="flex items-start justify-between gap-4">

                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {item.market}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {item.crop}

                    {item.variety
                      ? ` • ${item.variety}`
                      : ""}
                  </p>
                </div>

                <div className="rounded-full bg-green-100 p-2 text-green-700">
                  <TrendingUp className="h-5 w-5" />
                </div>

              </div>

              {/* Prices */}
              <div className="mt-5 grid grid-cols-3 gap-3">

                {/* Minimum */}
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">
                    Min
                  </p>

                  <p className="mt-1 font-bold text-gray-900">
                    ₹
                    {Number(
                      item.min_price || 0
                    ).toLocaleString("en-IN")}
                  </p>
                </div>

                {/* Modal */}
                <div className="rounded-lg bg-green-50 p-3">
                  <p className="text-xs text-gray-500">
                    Modal
                  </p>

                  <p className="mt-1 font-bold text-green-700">
                    ₹
                    {Number(
                      item.modal_price || 0
                    ).toLocaleString("en-IN")}
                  </p>
                </div>

                {/* Maximum */}
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">
                    Max
                  </p>

                  <p className="mt-1 font-bold text-gray-900">
                    ₹
                    {Number(
                      item.max_price || 0
                    ).toLocaleString("en-IN")}
                  </p>
                </div>

              </div>

              {/* Details */}
              <div className="mt-5 space-y-2 border-t pt-4 text-sm text-gray-600">

                {/* State */}
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />

                  <span>
                    {item.state || "Andhra Pradesh"}
                  </span>
                </div>

                {/* Date */}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />

                  <span>
                    Arrival date:{" "}
                    {item.arrival_date || "N/A"}
                  </span>
                </div>

                {/* Unit */}
                <p>
                  Unit:{" "}
                  <strong>{item.unit}</strong>
                </p>

                {/* Source */}
                <p className="text-xs text-gray-500">
                  Source: {item.source}
                </p>

              </div>
            </div>
          ))}

        </div>
      )}

    </div>
  );
}