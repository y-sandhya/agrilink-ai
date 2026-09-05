const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export type MarketPrice = {
  id: number;
  state: string | null;
  district: string | null;
  market: string;
  crop: string;
  variety: string | null;
  grade: string | null;
  arrival_date: string | null;
  min_price: number | null;
  max_price: number | null;
  modal_price: number | null;
  unit: string;
  source: string;
  last_fetched: string;
};

export async function fetchMarketPrices(params: {
  crop?: string;
  state?: string;
  district?: string;
  market?: string;
  limit?: number;
} = {}): Promise<MarketPrice[]> {
  const url = new URL(`${API_BASE_URL}/market-prices`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  });

  const response = await fetch(url);
  if (!response.ok) throw new Error("Unable to load market prices");

  const data = await response.json();
  return data.records || [];
}
