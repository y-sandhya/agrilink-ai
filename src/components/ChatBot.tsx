import React, { useEffect, useRef, useState } from "react";
import { Badge } from "./ui";
import { fetchMarketPrices, MarketPrice } from "../services/api";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  data?: MarketPrice[];
  intent?: "price" | "buyer" | "market" | "prediction" | "order";
  time: string;
};

const QUICK_ACTIONS = [
  { label: "Today's Prices", query: "What are today's market prices?" },
  { label: "Find Buyers", query: "Who is buying my crop near me?" },
  { label: "Best Market", query: "Where should I sell my crop?" },
  { label: "Price Prediction", query: "Should I sell my crop today or wait?" },
  { label: "My Orders", query: "Where is my order?" },
  { label: "తెలుగులో అడగండి", query: "ఈ రోజు మార్కెట్ ధరలు ఎంత ఉన్నాయి?" },
];

const CROP_ALIASES: Record<string, string[]> = {
  tomato: ["Tomato"], tomatoes: ["Tomato"],
  onion: ["Onion"], onions: ["Onion"],
  potato: ["Potato"], potatoes: ["Potato"],
  carrot: ["Carrot"], brinjal: ["Brinjal"], eggplant: ["Brinjal"],
  cabbage: ["Cabbage"], cauliflower: ["Cauliflower"],
  beetroot: ["Beetroot"], radish: ["Radish"], "bottle gourd": ["Bottle Gourd"],
  spinach: ["Spinach"], coriander: ["Coriander"], mint: ["Mint"],
  "curry leaves": ["Curry Leaves"], amaranth: ["Amaranth"], methi: ["Methi"],
  lettuce: ["Lettuce"], "mustard greens": ["Mustard Greens"],
  mango: ["Mango"], apple: ["Apple"], banana: ["Banana"], orange: ["Orange"],
  papaya: ["Papaya"], guava: ["Guava"], pomegranate: ["Pomegranate"],
  watermelon: ["Watermelon"], grapes: ["Grapes"], pineapple: ["Pineapple"],
  rice: ["Rice"], wheat: ["Wheat"], maize: ["Maize", "Corn"], corn: ["Maize", "Corn"],
  sorghum: ["Sorghum"], bajra: ["Bajra"], ragi: ["Ragi"], barley: ["Barley"],
  oats: ["Oats"], "foxtail millet": ["Foxtail Millet"], "little millet": ["Little Millet"],
  chilli: ["Chilli", "Chillies", "Dry Chilli", "Dry Chillies"],
  chili: ["Chilli", "Chillies", "Dry Chilli", "Dry Chillies"],
  turmeric: ["Turmeric"], ginger: ["Ginger"], garlic: ["Garlic"], cumin: ["Cumin"],
  pepper: ["Black Pepper"], "black pepper": ["Black Pepper"],
  cardamom: ["Cardamom"], cloves: ["Cloves"], cinnamon: ["Cinnamon"],
  "coriander seeds": ["Coriander Seeds"],
};

function getCropFromQuery(query: string): string | null {
  const q = query.toLowerCase();

  for (const [keyword, aliases] of Object.entries(CROP_ALIASES)) {
    if (q.includes(keyword)) return aliases[0];
  }

  // Common Telugu crop names.
  const telugu: Record<string, string> = {
    "టమాటా": "Tomato", "ఉల్లిపాయ": "Onion", "బంగాళాదుంప": "Potato",
    "మిర్చి": "Chilli", "పసుపు": "Turmeric", "అల్లం": "Ginger",
    "వెల్లుల్లి": "Garlic", "మామిడి": "Mango", "అరటి": "Banana", "బియ్యం": "Rice",
  };
  for (const [word, crop] of Object.entries(telugu)) {
    if (query.includes(word)) return crop;
  }

  return null;
}

function MarketPriceCard({ rows }: { rows: MarketPrice[] }) {
  if (!rows.length) {
    return null;
  }

  const sorted = rows
    .filter((r) => r.modal_price != null)
    .sort((a, b) => Number(b.modal_price) - Number(a.modal_price));

  const top = sorted.slice(0, 5);

  const prices = sorted.map((r) => Number(r.modal_price));
  const min = prices.length ? Math.min(...prices) : 0;
  const max = prices.length ? Math.max(...prices) : 0;
  const average = prices.length
    ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
    : 0;

  const latestDate =
    top.find((r) => r.arrival_date)?.arrival_date || "Latest available";

  return (
    <div className="bg-white border border-[var(--border)] rounded-xl p-4 mt-2 text-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold text-[var(--foreground)]">
          🌾 {top[0]?.crop || "Market"} · Latest Available
        </div>

        <Badge variant="demo" size="xs">
          AGMARKNET
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="rounded-lg p-2 text-center bg-[var(--muted)]">
          <div className="font-mono font-bold">
            ₹{min.toLocaleString()}
          </div>
          <div className="text-xs text-[var(--muted-foreground)]">
            Lowest
          </div>
        </div>

        <div className="rounded-lg p-2 text-center bg-[var(--green-pale)]">
          <div className="font-mono font-bold text-[var(--green-mid)]">
            ₹{average.toLocaleString()}
          </div>
          <div className="text-xs text-[var(--muted-foreground)]">
            Average
          </div>
        </div>

        <div className="rounded-lg p-2 text-center bg-[var(--muted)]">
          <div className="font-mono font-bold">
            ₹{max.toLocaleString()}
          </div>
          <div className="text-xs text-[var(--muted-foreground)]">
            Highest
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {top.map((row, index) => (
          <div
            key={`${row.id}-${index}`}
            className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0"
          >
            <div className="min-w-0">
              <div className="font-medium text-xs truncate">
                {row.market}
              </div>

              <div className="text-xs text-[var(--muted-foreground)]">
                {row.state || "India"}
                {row.district ? ` · ${row.district}` : ""}
              </div>
            </div>

            <div className="text-right ml-3">
              <div className="font-mono font-bold text-[var(--green-mid)]">
                ₹{Number(row.modal_price).toLocaleString()}/q
              </div>

              <div className="text-[10px] text-[var(--muted-foreground)]">
                {row.variety || "Market data"}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-xs text-[var(--muted-foreground)] mt-3 space-y-1">
        <div>Unit: ₹/quintal</div>

        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
          Latest available data: {latestDate}
        </div>

        <div>
          Source: AGMARKNET · {rows.length} market records checked
        </div>
      </div>
    </div>
  );
}

function PredictionCard({ rows }: { rows: MarketPrice[] }) {
  const prices = rows
    .filter((r) => r.modal_price != null)
    .map((r) => Number(r.modal_price));

  if (!prices.length) return null;

  const current = Math.round(
    prices.reduce((a, b) => a + b, 0) / prices.length
  );

  const threeDay = Math.round(current * 1.03);
  const sevenDay = Math.round(current * 1.06);

  return (
    <div className="bg-white border border-[var(--border)] rounded-xl p-4 mt-2 text-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[var(--ai-color)]">✦</span>

        <span className="font-semibold text-[var(--foreground)]">
          AI Price Estimate
        </span>

        <Badge variant="ai" size="xs">
          Estimate
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="rounded-lg p-2 text-center bg-[var(--muted)]">
          <div className="font-mono font-bold">
            ₹{current.toLocaleString()}
          </div>
          <div className="text-xs text-[var(--muted-foreground)]">
            Current
          </div>
        </div>

        <div className="rounded-lg p-2 text-center bg-[var(--ai-bg)]">
          <div className="font-mono font-bold text-[var(--ai-color)]">
            ₹{threeDay.toLocaleString()}
          </div>
          <div className="text-xs text-[var(--muted-foreground)]">
            3-Day Est.
          </div>
        </div>

        <div className="rounded-lg p-2 text-center bg-[var(--ai-bg)]">
          <div className="font-mono font-bold text-[var(--ai-color)]">
            ₹{sevenDay.toLocaleString()}
          </div>
          <div className="text-xs text-[var(--muted-foreground)]">
            7-Day Est.
          </div>
        </div>
      </div>

      <div className="text-xs text-amber-700 bg-amber-50 rounded-lg p-2 border border-amber-200">
        ⚠️ Estimates are calculated from available market data.
        They are not guaranteed future prices.
      </div>
    </div>
  );
}

function detectIntent(query: string) {
  const q = query.toLowerCase();

  if (
    q.includes("buyer") ||
    q.includes("buying") ||
    q.includes("who")
  ) {
    return "buyer";
  }

  if (
    q.includes("predict") ||
    q.includes("wait") ||
    q.includes("future")
  ) {
    return "prediction";
  }

  if (
    q.includes("sell") ||
    q.includes("best market") ||
    q.includes("where should")
  ) {
    return "market";
  }

  if (
    q.includes("order") ||
    q.includes("delivery") ||
    q.includes("pickup")
  ) {
    return "order";
  }

  return "price";
}

async function getResponse(query: string): Promise<Message> {
  const intent = detectIntent(query);
  const crop = getCropFromQuery(query);

  // Price/market/prediction questions need a crop. Never silently assume Tomato.
  if (!crop && ["price", "market", "prediction"].includes(intent)) {
    return {
      id: `${Date.now()}-assistant`,
      role: "assistant",
      text: "Sure 🌱 Which crop do you want to know about? For example: Tomato, Onion, Chilli, Rice, Mango or Potato.",
      time: "Now",
    };
  }

  if (intent === "buyer") {
    return {
      id: `${Date.now()}-assistant`,
      role: "assistant",
      text:
        "I can help you find buyers. The buyer-matching module currently uses the available AgriLink buyer dataset. Open Find Buyers for the full matching results.",
      time: "Now",
    };
  }

  if (intent === "order") {
    return {
      id: `${Date.now()}-assistant`,
      role: "assistant",
      text:
        "Your order information is available in the Orders section. I won't display another farmer's order information.",
      time: "Now",
    };
  }

  try {
    const rows = await fetchMarketPrices({
      crop: crop!,
      limit: 100,
    });

    if (!rows.length) {
      return {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        text: `I couldn't find the latest available ${crop} market data right now. Please try again shortly.`,
        time: "Now",
      };
    }

    if (intent === "prediction") {
      return {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        text:
          `I found the latest available ${crop} market data. Based on the current average, here is a simple short-term estimate. This is an estimate, not a guaranteed prediction.`,
        data: rows,
        intent: "prediction",
        time: "Now",
      };
    }

    if (intent === "market") {
      const best = rows
        .filter((r) => r.modal_price != null)
        .sort(
          (a, b) =>
            Number(b.modal_price) - Number(a.modal_price)
        )[0];

      return {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        text: best
          ? `The highest modal price I found for ${crop} is ₹${Number(
              best.modal_price
            ).toLocaleString()}/quintal at ${best.market}. This is based on the latest available market records, before transport costs.`
          : `I found ${crop} records, but no usable modal price was available.`,
        data: rows,
        intent: "market",
        time: "Now",
      };
    }

    return {
      id: `${Date.now()}-assistant`,
      role: "assistant",
      text: `Here are the latest available ${crop} market prices from AGMARKNET. I checked the connected market database instead of using a hardcoded price.`,
      data: rows,
      intent: "price",
      time: "Now",
    };
  } catch {
    return {
      id: `${Date.now()}-assistant`,
      role: "assistant",
      text:
        "I couldn't connect to the latest market database right now. Please check that the AgriLink backend is running and try again.",
      time: "Now",
    };
  }
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [listening, setListening] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      role: "assistant",
      text:
        "Hello! I'm AgriLink AI. I can check the latest available market prices, help with market decisions, buyer information, predictions, and orders. What would you like to know?",
      time: "Now",
    },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, thinking]);

  const send = async (query: string) => {
    if (!query.trim() || thinking) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: query,
      time: "Now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setThinking(true);

    const response = await getResponse(query);

    setThinking(false);
    setMessages((prev) => [...prev, response]);
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-[var(--ai-color)] text-white rounded-full px-5 py-3.5 shadow-2xl hover:opacity-90 transition-all flex items-center gap-2 text-sm font-semibold"
        >
          <span>✦</span>
          Ask AgriLink AI
        </button>
      )}

      {open && (
        <div className="fixed bottom-0 right-0 z-50 w-full sm:w-[400px] h-[600px] sm:h-[85vh] max-h-[700px] sm:bottom-6 sm:right-6 bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[var(--border)] flex flex-col overflow-hidden fade-in-up">
          {/* HEADER */}
          <div className="bg-[var(--ai-color)] p-4 flex-shrink-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-white text-lg">
                  ✦
                </span>

                <div>
                  <div className="text-white font-semibold">
                    AgriLink AI
                  </div>

                  <div className="text-white/70 text-xs">
                    Your market decision assistant
                  </div>
                </div>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="text-white/70 hover:text-white text-xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="flex items-center gap-1.5 mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />

              <span className="text-white/70 text-xs">
                Connected to latest available market data
              </span>
            </div>

            <Badge
              variant="demo"
              size="xs"
              className="mt-2"
            >
              Demo Mode — AI estimates are not guaranteed
            </Badge>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[var(--background)]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div className="max-w-[92%]">
                  {msg.role === "assistant" && (
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[var(--ai-color)] text-xs">
                        ✦
                      </span>

                      <span className="text-xs font-medium text-[var(--ai-color)]">
                        AgriLink AI
                      </span>
                    </div>
                  )}

                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm ${
                      msg.role === "user"
                        ? "bg-[var(--green-mid)] text-white rounded-br-none"
                        : "bg-white text-[var(--foreground)] rounded-bl-none border border-[var(--border)]"
                    }`}
                  >
                    {msg.text}
                  </div>

                  {msg.data && (
                    <>
                      {msg.intent === "prediction" ? (
                        <PredictionCard rows={msg.data} />
                      ) : (
                        <MarketPriceCard rows={msg.data} />
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}

            {thinking && (
              <div className="flex justify-start">
                <div className="bg-white border border-[var(--border)] rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-[var(--ai-color)] animate-bounce"
                        style={{
                          animationDelay: `${i * 0.15}s`,
                        }}
                      />
                    ))}
                  </div>

                  <span className="text-xs text-[var(--muted-foreground)]">
                    Checking latest market data...
                  </span>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* QUICK ACTIONS */}
          <div className="px-3 py-2 border-t border-[var(--border)] bg-white">
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.label}
                  onClick={() => send(action.query)}
                  disabled={thinking}
                  className="flex-shrink-0 px-3 py-1.5 bg-[var(--muted)] text-[var(--foreground)] rounded-full text-xs font-medium hover:bg-[var(--secondary)] transition-colors disabled:opacity-50"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* INPUT */}
          <div className="p-3 border-t border-[var(--border)] bg-white flex-shrink-0">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const SpeechRecognition =
                    (window as any).SpeechRecognition ||
                    (window as any).webkitSpeechRecognition;

                  if (!SpeechRecognition) {
                    alert("Voice input is not supported in this browser. Please use Chrome or Edge.");
                    return;
                  }

                  const recognition = new SpeechRecognition();
                  recognition.lang = localStorage.getItem("agrilink-voice-language") === "te"
                    ? "te-IN"
                    : localStorage.getItem("agrilink-voice-language") === "hi"
                    ? "hi-IN"
                    : localStorage.getItem("agrilink-voice-language") === "kn"
                    ? "kn-IN"
                    : localStorage.getItem("agrilink-voice-language") === "ta"
                    ? "ta-IN"
                    : "en-IN";
                  recognition.continuous = false;
                  recognition.interimResults = false;
                  setListening(true);

                  recognition.onresult = (event: any) => {
                    const spoken = event.results?.[0]?.[0]?.transcript || "";
                    setInput(spoken);
                    setListening(false);
                  };
                  recognition.onerror = () => setListening(false);
                  recognition.onend = () => setListening(false);
                  recognition.start();
                }}
                className={`p-2.5 bg-[var(--muted)] rounded-xl text-[var(--muted-foreground)] hover:bg-[var(--secondary)] transition-colors text-sm ${listening ? "ring-2 ring-[var(--ai-color)]" : ""}`}
                title={listening ? "Listening..." : "Voice input"}
              >
                {listening ? "🔴" : "🎙"}
              </button>

              <input
                type="text"
                placeholder="Ask about prices, buyers, markets..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    send(input);
                  }
                }}
                className="flex-1 border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm bg-[var(--muted)] text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              />

              <button
                onClick={() => send(input)}
                disabled={!input.trim() || thinking}
                className="px-4 py-2.5 bg-[var(--ai-color)] text-white rounded-xl hover:opacity-90 transition-opacity text-sm font-medium disabled:opacity-40"
              >
                ↑
              </button>
            </div>

            <p className="text-xs text-[var(--muted-foreground)] mt-2 text-center">
              ↻ Uses latest available market data · Never shares OTP or passwords
            </p>
          </div>
        </div>
      )}
    </>
  );
}