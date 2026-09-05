// All data here is DEMO DATA — not real market prices or verified entities.

export const CROP_CATEGORIES = {
  "Leafy Vegetables": ["Spinach", "Coriander", "Mint", "Curry Leaves", "Amaranth", "Fenugreek Leaves", "Drumstick Leaves", "Methi", "Lettuce", "Mustard Greens"],
  "Vegetables": ["Tomato", "Onion", "Potato", "Carrot", "Brinjal", "Cabbage", "Cauliflower", "Beetroot", "Radish", "Bottle Gourd"],
  "Fruits": ["Mango", "Apple", "Banana", "Orange", "Papaya", "Guava", "Pomegranate", "Watermelon", "Grapes", "Pineapple"],
  "Grains": ["Rice", "Wheat", "Maize", "Sorghum", "Bajra", "Ragi", "Barley", "Oats", "Foxtail Millet", "Little Millet"],
  "Spices": ["Chilli", "Turmeric", "Ginger", "Garlic", "Cumin", "Coriander Seeds", "Black Pepper", "Cardamom", "Cloves", "Cinnamon"],
};

export const STATES = ["Andhra Pradesh", "Telangana", "Karnataka", "Tamil Nadu", "Maharashtra", "Madhya Pradesh", "Uttar Pradesh", "Punjab", "Rajasthan", "Gujarat"];

export const LANGUAGES = ["English", "Telugu", "Hindi", "Kannada", "Tamil"];

export const DEMO_MARKET_PRICES = [
  { id: "m1", crop: "Tomato", variety: "Hybrid", market: "KR Market, Bengaluru", state: "Karnataka", district: "Bengaluru Urban", min_price: 820, max_price: 1240, modal_price: 980, unit: "₹/quintal", arrival_date: "03/09/2026", source: "Agmarknet", last_updated: "06:30", trend: "up", trend_pct: 8.2 },
  { id: "m2", crop: "Onion", variety: "Nasik Red", market: "Lasalgaon, Nashik", state: "Maharashtra", district: "Nashik", min_price: 620, max_price: 880, modal_price: 740, unit: "₹/quintal", arrival_date: "03/09/2026", source: "Agmarknet", last_updated: "07:15", trend: "down", trend_pct: 3.1 },
  { id: "m3", crop: "Potato", variety: "Kufri Jyoti", market: "Agra Market", state: "Uttar Pradesh", district: "Agra", min_price: 480, max_price: 620, modal_price: 550, unit: "₹/quintal", arrival_date: "03/09/2026", source: "Agmarknet", last_updated: "07:45", trend: "stable", trend_pct: 0.4 },
  { id: "m4", crop: "Chilli", variety: "Guntur S4", market: "Guntur Market Yard", state: "Andhra Pradesh", district: "Guntur", min_price: 4200, max_price: 6800, modal_price: 5600, unit: "₹/quintal", arrival_date: "02/09/2026", source: "Agmarknet", last_updated: "08:00", trend: "up", trend_pct: 12.4 },
  { id: "m5", crop: "Rice", variety: "BPT 5204", market: "Nalgonda Market", state: "Telangana", district: "Nalgonda", min_price: 1850, max_price: 2200, modal_price: 2050, unit: "₹/quintal", arrival_date: "03/09/2026", source: "Agmarknet", last_updated: "08:30", trend: "stable", trend_pct: -0.8 },
  { id: "m6", crop: "Wheat", variety: "HD 2967", market: "Karnal Market", state: "Haryana", district: "Karnal", min_price: 2050, max_price: 2280, modal_price: 2150, unit: "₹/quintal", arrival_date: "03/09/2026", source: "Agmarknet", last_updated: "09:00", trend: "up", trend_pct: 1.9 },
  { id: "m7", crop: "Mango", variety: "Alphonso", market: "Devgad APMC", state: "Maharashtra", district: "Sindhudurg", min_price: 3200, max_price: 5400, modal_price: 4200, unit: "₹/quintal", arrival_date: "03/09/2026", source: "Agmarknet", last_updated: "09:30", trend: "down", trend_pct: 5.6 },
  { id: "m8", crop: "Turmeric", variety: "Nizamabad Bulb", market: "Nizamabad Market", state: "Telangana", district: "Nizamabad", min_price: 6800, max_price: 9200, modal_price: 7800, unit: "₹/quintal", arrival_date: "02/09/2026", source: "Agmarknet", last_updated: "10:00", trend: "up", trend_pct: 6.3 },
];

export const DEMO_AI_PREDICTION = {
  crop: "Tomato",
  market: "KR Market, Bengaluru",
  current_price: 980,
  prediction_3d: 1080,
  prediction_7d: 1150,
  trend: "up",
  confidence_label: "Moderate",
  factors: ["Historical market trend (upward seasonality)", "Recent arrivals declining (-12%)", "Festival demand increasing", "Transport disruptions reported in key supply routes"],
  disclaimer: "Predictions are estimates based on historical patterns and available data. Actual prices may differ. This is not financial advice.",
  history: [
    { date: "27 Aug", actual: 820, predicted: null },
    { date: "28 Aug", actual: 860, predicted: null },
    { date: "29 Aug", actual: 910, predicted: null },
    { date: "30 Aug", actual: 940, predicted: null },
    { date: "31 Aug", actual: 960, predicted: null },
    { date: "01 Sep", actual: 970, predicted: null },
    { date: "02 Sep", actual: 975, predicted: null },
    { date: "03 Sep (Today)", actual: 980, predicted: 980 },
    { date: "04 Sep", actual: null, predicted: 1020 },
    { date: "05 Sep", actual: null, predicted: 1050 },
    { date: "06 Sep", actual: null, predicted: 1080 },
    { date: "07 Sep", actual: null, predicted: 1100 },
    { date: "08 Sep", actual: null, predicted: 1120 },
    { date: "09 Sep", actual: null, predicted: 1140 },
    { date: "10 Sep", actual: null, predicted: 1150 },
  ]
};

export const DEMO_BEST_MARKETS = [
  { id: "bm1", market: "KR Market, Bengaluru", distance_km: 24, price: 980, transport_cost: 120, gross: 980, net: 860, recommended: true, reason: "Highest estimated net realization after transport costs" },
  { id: "bm2", market: "Yeshwanthpur APMC", distance_km: 31, price: 940, transport_cost: 160, gross: 940, net: 780, recommended: false, reason: null },
  { id: "bm3", market: "Anekal Market", distance_km: 18, price: 890, transport_cost: 95, gross: 890, net: 795, recommended: false, reason: null },
  { id: "bm4", market: "Hosur Market", distance_km: 42, price: 960, transport_cost: 210, gross: 960, net: 750, recommended: false, reason: null },
];

export const DEMO_BUYERS = [
  { id: "b1", name: "Sri Venkateshwara Agro Exports", type: "Exporter", location: "Bengaluru, Karnataka", distance_km: 18, quantity_required: 500, offer_price: 950, match_score: 94, verification: "pending", crop: "Tomato", quality: "Grade A", match_factors: { crop: true, quantity: true, quality: true, location: true, offer: true } },
  { id: "b2", name: "FreshVeg Wholesale Pvt Ltd", type: "Wholesaler", location: "Bengaluru, Karnataka", distance_km: 22, quantity_required: 200, offer_price: 920, match_score: 88, verification: "pending", crop: "Tomato", quality: "Grade A/B", match_factors: { crop: true, quantity: true, quality: true, location: true, offer: false } },
  { id: "b3", name: "Namma Organics", type: "Retailer", location: "Mysuru, Karnataka", distance_km: 145, quantity_required: 80, offer_price: 1100, match_score: 76, verification: "pending", crop: "Tomato", quality: "Organic Grade A", match_factors: { crop: true, quantity: false, quality: true, location: false, offer: true } },
];

export const DEMO_CROPS = [
  { id: "c1", name: "Tomato", variety: "Hybrid F1", quantity: 800, unit: "kg", quality: "Grade A", harvest_date: "10/09/2026", current_price: 980, preferred_market: "KR Market", image_color: "#e74c3c" },
  { id: "c2", name: "Chilli", variety: "Guntur S4", quantity: 200, unit: "kg", quality: "Grade A", harvest_date: "15/09/2026", current_price: 5600, preferred_market: "Guntur Market Yard", image_color: "#c0392b" },
  { id: "c3", name: "Onion", variety: "Nasik Red", quantity: 1200, unit: "kg", quality: "Grade B", harvest_date: "05/09/2026", current_price: 740, preferred_market: "Lasalgaon", image_color: "#9b59b6" },
];

export const DEMO_ORDERS = [
  { id: "AG1024", crop: "Tomato", quantity: 500, unit: "kg", agreed_price: 950, total_value: 4750, buyer_name: "Sri Venkateshwara Agro Exports", farmer_name: "Ramesh Kumar", pickup: "Village Warehouse, Kolar", delivery: "Bengaluru Market Yard", status: "Ready for Pickup", timeline: ["Order Placed — 01/09/2026", "Accepted — 02/09/2026", "Processing — 02/09/2026", "Ready for Pickup — 03/09/2026"], transport: "Pending Arrangement", updated: "10 minutes ago" },
  { id: "AG1018", crop: "Onion", quantity: 300, unit: "kg", agreed_price: 720, total_value: 2160, buyer_name: "FreshVeg Wholesale Pvt Ltd", farmer_name: "Ramesh Kumar", pickup: "Village Warehouse, Kolar", delivery: "Yeshwanthpur APMC", status: "Delivered", timeline: ["Order Placed — 28/08/2026", "Accepted — 28/08/2026", "Processing — 29/08/2026", "Dispatched — 30/08/2026", "Delivered — 31/08/2026"], transport: "Self-arranged", updated: "4 days ago" },
];

export const DEMO_MESSAGES = [
  { id: "msg1", from: "Sri Venkateshwara Agro", avatar: "SV", unread: 2, last: "What is the exact harvest date for the tomatoes?", time: "10:42 AM", crop_context: "Tomato — 500 kg", messages: [
    { sender: "them", text: "Hello, we are interested in your tomato listing.", time: "10:30 AM" },
    { sender: "me", text: "Thank you. I have 800 kg Grade A hybrid tomatoes ready.", time: "10:35 AM" },
    { sender: "them", text: "What is the exact harvest date for the tomatoes?", time: "10:42 AM" },
  ]},
  { id: "msg2", from: "FreshVeg Wholesale", avatar: "FV", unread: 0, last: "Order AG1018 has been received in good condition.", time: "Yesterday", crop_context: "Onion — 300 kg", messages: [
    { sender: "them", text: "Order AG1018 has been received in good condition. Thank you.", time: "Yesterday" },
    { sender: "me", text: "Great! Glad to hear that.", time: "Yesterday" },
  ]},
];

export const DEMO_NOTIFICATIONS = [
  { id: "n1", type: "buyer_match", title: "New Buyer Match", body: "Sri Venkateshwara Agro Exports is interested in your Tomato listing.", time: "10 min ago", read: false },
  { id: "n2", type: "price_change", title: "Price Alert", body: "Chilli prices at Guntur Market have risen 12% today.", time: "1 hr ago", read: false },
  { id: "n3", type: "order", title: "Order Update", body: "Order #AG1024 is Ready for Pickup.", time: "2 hrs ago", read: true },
  { id: "n4", type: "ai", title: "AI Prediction Update", body: "New 7-day price prediction available for Tomato at KR Market.", time: "3 hrs ago", read: true },
  { id: "n5", type: "market", title: "Market Data Updated", body: "Latest available market prices synced as of 03/09/2026 10:00 AM.", time: "4 hrs ago", read: true },
];

export const DEMO_FARMER = {
  name: "Ramesh Kumar",
  location: "Kolar, Karnataka",
  state: "Karnataka",
  district: "Kolar",
  village: "Mulbagal",
  phone: "+91 98XXX XXXXX",
  email: "ramesh@example.com",
  language: "Telugu",
  verification: "Identity Verified",
  face_verification: "Enabled",
  crops: ["Tomato", "Chilli", "Onion"],
};

export const DEMO_BUYER = {
  name: "Priya Sharma",
  company: "Sri Venkateshwara Agro Exports",
  type: "Exporter",
  location: "Bengaluru, Karnataka",
  phone: "+91 80XXX XXXXX",
  email: "procurement@svagroexports.example.com",
  business_id: "SVAE/KA/2024/001",
  verification: "Verification Pending",
  active_requirements: 3,
  pending_orders: 2,
  completed_orders: 14,
  total_purchase: "₹4,82,000",
};

export const DEMO_PAYMENTS = [
  { id: "pay1", order_id: "AG1024", amount: 4750, date: "03/09/2026", status: "Pending", crop: "Tomato", counterparty: "Sri Venkateshwara Agro" },
  { id: "pay2", order_id: "AG1018", amount: 2160, date: "31/08/2026", status: "Completed", crop: "Onion", counterparty: "FreshVeg Wholesale" },
  { id: "pay3", order_id: "AG1012", amount: 3200, date: "20/08/2026", status: "Completed", crop: "Chilli", counterparty: "Spice Hub India" },
];

export const DEMO_FARMERS_FOR_BUYER = [
  { id: "f1", name: "Ramesh Kumar", verified: true, crop: "Tomato", quantity: 800, unit: "kg", quality: "Grade A", location: "Kolar, Karnataka", distance_km: 62, expected_price: 950, harvest_date: "10/09/2026", match_score: 94 },
  { id: "f2", name: "Suresh Reddy", verified: true, crop: "Tomato", quantity: 600, unit: "kg", quality: "Grade A", location: "Chikkaballapur, Karnataka", distance_km: 74, expected_price: 930, harvest_date: "08/09/2026", match_score: 87 },
  { id: "f3", name: "Anitha Devi", verified: false, crop: "Tomato", quantity: 400, unit: "kg", quality: "Grade B", location: "Tumkur, Karnataka", distance_km: 95, expected_price: 880, harvest_date: "12/09/2026", match_score: 71 },
];
