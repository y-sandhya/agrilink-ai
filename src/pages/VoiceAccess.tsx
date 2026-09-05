import React, { useEffect, useRef, useState } from "react";
import { Card, Button, Badge } from "../components/ui";
import { fetchMarketPrices } from "../services/api";

type VoiceState = "idle" | "listening" | "processing" | "responding";

type Language = {
  code: string;
  label: string;
  name: string;
  speechCode: string;
};

const LANGUAGES: Language[] = [
  {
    code: "te",
    label: "తెలుగు",
    name: "Telugu",
    speechCode: "te-IN",
  },
  {
    code: "hi",
    label: "हिन्दी",
    name: "Hindi",
    speechCode: "hi-IN",
  },
  {
    code: "kn",
    label: "ಕನ್ನಡ",
    name: "Kannada",
    speechCode: "kn-IN",
  },
  {
    code: "ta",
    label: "தமிழ்",
    name: "Tamil",
    speechCode: "ta-IN",
  },
  {
    code: "en",
    label: "English",
    name: "English",
    speechCode: "en-IN",
  },
];

const CROP_NAMES: Record<string, string> = {
  tomato: "Tomato",
  tomatoes: "Tomato",
  onion: "Onion",
  potato: "Potato",
  carrot: "Carrot",
  brinjal: "Brinjal",
  cabbage: "Cabbage",
  cauliflower: "Cauliflower",
  beetroot: "Beetroot",
  radish: "Radish",
  "bottle gourd": "Bottle Gourd",

  mango: "Mango",
  apple: "Apple",
  banana: "Banana",
  orange: "Orange",
  papaya: "Papaya",
  guava: "Guava",
  pomegranate: "Pomegranate",
  watermelon: "Watermelon",
  grapes: "Grapes",
  pineapple: "Pineapple",

  rice: "Rice",
  wheat: "Wheat",
  maize: "Maize",
  corn: "Maize",
  sorghum: "Sorghum",
  bajra: "Bajra",
  ragi: "Ragi",
  barley: "Barley",
  oats: "Oats",

  chilli: "Chilli",
  chili: "Chilli",
  turmeric: "Turmeric",
  ginger: "Ginger",
  garlic: "Garlic",
  cumin: "Cumin",
  pepper: "Black Pepper",
};

function detectCrop(text: string): string {
  const q = text.toLowerCase();

  for (const [word, crop] of Object.entries(CROP_NAMES)) {
    if (q.includes(word)) {
      return crop;
    }
  }

  return "Tomato";
}

function isPriceQuestion(text: string): boolean {
  const q = text.toLowerCase();

  const words = [
    "price",
    "rate",
    "cost",
    "market price",
    "how much",
    "entha",
    "ధర",
    "రేటు",
    "भाव",
    "कीमत",
    "ಬೆಲೆ",
    "விலை",
  ];

  return words.some(word => q.includes(word));
}

function getLanguageResponse(
  language: string,
  crop: string,
  market: string,
  state: string,
  price: number,
  min: number | null,
  max: number | null,
  date: string | null
): string {
  const priceText = `₹${price.toLocaleString("en-IN")}`;

  const minText =
    min !== null
      ? ` ₹${min.toLocaleString("en-IN")}`
      : "";

  const maxText =
    max !== null
      ? ` ₹${max.toLocaleString("en-IN")}`
      : "";

  if (language === "te") {
    return (
      `${crop} తాజా అందుబాటులో ఉన్న మార్కెట్ ధర ` +
      `${market}${state ? `, ${state}` : ""} లో ` +
      `${priceText} ప్రతి క్వింటాల్. ` +
      `కనిష్ట ధర:${minText || " అందుబాటులో లేదు"}. ` +
      `గరిష్ట ధర:${maxText || " అందుబాటులో లేదు"}. ` +
      `డేటా తేదీ: ${date || "తాజా డేటా"}. ` +
      `మూలం: Agmarknet.`
    );
  }

  if (language === "hi") {
    return (
      `${crop} का नवीनतम उपलब्ध बाजार भाव ` +
      `${market}${state ? `, ${state}` : ""} में ` +
      `${priceText} प्रति क्विंटल है। ` +
      `न्यूनतम भाव:${minText || " उपलब्ध नहीं"}. ` +
      `अधिकतम भाव:${maxText || " उपलब्ध नहीं"}. ` +
      `डेटा तारीख: ${date || "नवीनतम उपलब्ध डेटा"}. ` +
      `स्रोत: Agmarknet.`
    );
  }

  if (language === "kn") {
    return (
      `${crop} ಇತ್ತೀಚಿನ ಲಭ್ಯವಿರುವ ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ` +
      `${market}${state ? `, ${state}` : ""} ನಲ್ಲಿ ` +
      `${priceText} ಪ್ರತಿ ಕ್ವಿಂಟಲ್. ` +
      `ಕನಿಷ್ಠ ಬೆಲೆ:${minText || " ಲಭ್ಯವಿಲ್ಲ"}. ` +
      `ಗರಿಷ್ಠ ಬೆಲೆ:${maxText || " ಲಭ್ಯವಿಲ್ಲ"}. ` +
      `ಡೇಟಾ ದಿನಾಂಕ: ${date || "ಇತ್ತೀಚಿನ ಡೇಟಾ"}. ` +
      `ಮೂಲ: Agmarknet.`
    );
  }

  if (language === "ta") {
    return (
      `${crop} இன் சமீபத்திய கிடைக்கக்கூடிய சந்தை விலை ` +
      `${market}${state ? `, ${state}` : ""} இல் ` +
      `${priceText} ஒரு குவிண்டாலுக்கு. ` +
      `குறைந்தபட்ச விலை:${minText || " கிடைக்கவில்லை"}. ` +
      `அதிகபட்ச விலை:${maxText || " கிடைக்கவில்லை"}. ` +
      `தரவு தேதி: ${date || "சமீபத்திய தரவு"}. ` +
      `மூலம்: Agmarknet.`
    );
  }

  return (
    `Latest available ${crop.toLowerCase()} market price at ` +
    `${market}${state ? `, ${state}` : ""} is ` +
    `${priceText} per quintal. ` +
    `Minimum:${minText || " unavailable"}. ` +
    `Maximum:${maxText || " unavailable"}. ` +
    `Data date: ${date || "latest available data"}. ` +
    `Source: Agmarknet.`
  );
}

export default function VoiceAccess({
  onNavigate,
}: {
  onNavigate: (p: string) => void;
}) {
  const [selectedLang, setSelectedLang] = useState(() => {
    return localStorage.getItem("agrilink-voice-language") || "te";
  });

  const [state, setState] = useState<VoiceState>("idle");
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  const recognitionRef = useRef<any>(null);

  const selectedLanguage =
    LANGUAGES.find(lang => lang.code === selectedLang) ||
    LANGUAGES[0];

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // Ignore stop errors.
        }
      }

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const changeLanguage = (code: string) => {
    setSelectedLang(code);
    localStorage.setItem("agrilink-voice-language", code);

    setTranscript("");
    setResponse("");
    setError("");
    setState("idle");

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore stop errors.
      }
    }

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  const speakResponse = (text: string) => {
    if (!("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLanguage.speechCode;
    utterance.rate = 0.9;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  };

  const answerQuestion = async (question: string) => {
    setState("processing");
    setError("");

    const crop = detectCrop(question);

    try {
      if (!isPriceQuestion(question)) {
        let text = "";

        if (selectedLang === "te") {
          text =
            `నేను మీ ప్రశ్నను విన్నాను: "${question}". ` +
            `${crop} ధర, మార్కెట్ లేదా కొనుగోలుదారుల గురించి అడగండి.`;
        } else if (selectedLang === "hi") {
          text =
            `मैंने आपका प्रश्न सुना: "${question}". ` +
            `${crop} का भाव, बाजार या खरीदारों के बारे में पूछें।`;
        } else if (selectedLang === "kn") {
          text =
            `ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿದ್ದೇನೆ: "${question}". ` +
            `${crop} ಬೆಲೆ, ಮಾರುಕಟ್ಟೆ ಅಥವಾ ಖರೀದಿದಾರರ ಬಗ್ಗೆ ಕೇಳಿ.`;
        } else if (selectedLang === "ta") {
          text =
            `உங்கள் கேள்வியை கேட்டேன்: "${question}". ` +
            `${crop} விலை, சந்தை அல்லது வாங்குபவர்களைப் பற்றி கேளுங்கள்.`;
        } else {
          text =
            `I heard: "${question}". ` +
            `You can ask me about ${crop} prices, markets or buyers.`;
        }

        setResponse(text);
        setState("responding");
        speakResponse(text);
        return;
      }

      const records = await fetchMarketPrices({
        crop,
        limit: 100,
      });

      const validRecords = records.filter(
        item =>
          item.modal_price !== null &&
          Number.isFinite(Number(item.modal_price))
      );

      if (validRecords.length === 0) {
        const unavailable =
          selectedLang === "te"
            ? `${crop} కు తాజా మార్కెట్ డేటా ప్రస్తుతం అందుబాటులో లేదు.`
            : selectedLang === "hi"
              ? `${crop} का नवीनतम बाजार डेटा अभी उपलब्ध नहीं है।`
              : selectedLang === "kn"
                ? `${crop} ಗೆ ಇತ್ತೀಚಿನ ಮಾರುಕಟ್ಟೆ ಡೇಟಾ ಈಗ ಲಭ್ಯವಿಲ್ಲ.`
                : selectedLang === "ta"
                  ? `${crop} க்கான சமீபத்திய சந்தை தரவு தற்போது கிடைக்கவில்லை.`
                  : `Latest available market data for ${crop} is not available right now.`;

        setResponse(unavailable);
        setState("responding");
        speakResponse(unavailable);
        return;
      }

      const best = [...validRecords].sort(
        (a, b) =>
          Number(b.modal_price) -
          Number(a.modal_price)
      )[0];

      const price = Number(best.modal_price);

      const text = getLanguageResponse(
        selectedLang,
        crop,
        best.market,
        best.state || "",
        price,
        best.min_price !== null
          ? Number(best.min_price)
          : null,
        best.max_price !== null
          ? Number(best.max_price)
          : null,
        best.arrival_date
      );

      setResponse(text);
      setState("responding");

      speakResponse(text);
    } catch {
      const failure =
        selectedLang === "te"
          ? "మార్కెట్ డేటాను పొందడంలో సమస్య వచ్చింది. దయచేసి మళ్లీ ప్రయత్నించండి."
          : selectedLang === "hi"
            ? "बाजार डेटा प्राप्त करने में समस्या हुई। कृपया फिर से प्रयास करें।"
            : selectedLang === "kn"
              ? "ಮಾರುಕಟ್ಟೆ ಡೇಟಾ ಪಡೆಯುವಲ್ಲಿ ಸಮಸ್ಯೆ ಉಂಟಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ."
              : selectedLang === "ta"
                ? "சந்தை தரவைப் பெறுவதில் சிக்கல் ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்."
                : "There was a problem loading market data. Please try again.";

      setError(failure);
      setResponse(failure);
      setState("responding");
    }
  };

  const startListening = () => {
    setTranscript("");
    setResponse("");
    setError("");

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError(
        "Voice recognition is not supported in this browser. Please use Chrome or Edge, or type your question below."
      );
      setState("idle");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = selectedLanguage.speechCode;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setState("listening");
    };

    recognition.onresult = (event: any) => {
      const text =
        event?.results?.[0]?.[0]?.transcript || "";

      setTranscript(text);

      if (text.trim()) {
        answerQuestion(text);
      } else {
        setState("idle");
      }
    };

    recognition.onerror = (event: any) => {
      setState("idle");

      if (event?.error === "not-allowed") {
        setError(
          "Microphone permission was blocked. Allow microphone access and try again."
        );
      } else if (event?.error === "no-speech") {
        setError(
          "I didn't hear anything. Please tap Start Speaking and try again."
        );
      } else {
        setError(
          "Voice recognition could not start. Please try again."
        );
      }
    };

    recognition.onend = () => {
      if (state === "listening") {
        setState("idle");
      }
    };

    try {
      recognition.start();
    } catch {
      setState("idle");
      setError(
        "Voice recognition could not start. Please try again."
      );
    }
  };

  const reset = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore stop errors.
      }
    }

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setState("idle");
    setTranscript("");
    setResponse("");
    setError("");
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-[var(--foreground)]">
            Voice Access
          </h1>

          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            Speak your questions in your preferred language
          </p>
        </div>

        <Badge variant="ai">
          AgriLink Voice AI
        </Badge>
      </div>

      {/* Language Selection */}
      <Card className="p-5">
        <h2 className="text-base font-semibold text-[var(--foreground)] mb-3">
          Select Language
        </h2>

        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              type="button"
              onClick={() => changeLanguage(lang.code)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                selectedLang === lang.code
                  ? "bg-[var(--green-mid)] text-white border-[var(--green-mid)]"
                  : "bg-white text-[var(--foreground)] border-[var(--border)] hover:border-[var(--green-mid)]"
              }`}
            >
              <span className="text-lg mr-2">
                {lang.label}
              </span>

              {lang.name}
            </button>
          ))}
        </div>

        <div className="mt-3 text-xs text-[var(--muted-foreground)]">
          Active language:{" "}
          <strong>
            {selectedLanguage.name}
          </strong>
        </div>
      </Card>

      {/* Voice UI */}
      <Card className="p-8 text-center">
        <div
          className={`w-28 h-28 rounded-full mx-auto mb-6 flex items-center justify-center transition-all relative ${
            state === "idle"
              ? "bg-[var(--green-pale)] border-2 border-[var(--green-mid)]"
              : state === "listening"
                ? "bg-red-50 border-2 border-red-400 animate-pulse"
                : state === "processing"
                  ? "bg-blue-50 border-2 border-blue-400"
                  : "bg-[var(--ai-bg)] border-2 border-[var(--ai-color)]"
          }`}
        >
          <span className="text-5xl">
            {state === "idle"
              ? "🎙"
              : state === "listening"
                ? "🔴"
                : state === "processing"
                  ? "⏳"
                  : "🔊"}
          </span>

          {state === "listening" && (
            <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping opacity-20" />
          )}
        </div>

        {state === "listening" && (
          <div className="flex items-center justify-center gap-1 mb-4 h-12">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="wave-bar w-1.5 bg-red-400 rounded-full"
                style={{
                  height: `${20 + ((i * 13) % 25)}px`,
                  animationDelay: `${i * 0.08}s`,
                }}
              />
            ))}
          </div>
        )}

        <div className="text-lg font-semibold text-[var(--foreground)] mb-1">
          {state === "idle" && "Tap to speak"}
          {state === "listening" && "Listening..."}
          {state === "processing" &&
            "Checking latest market data..."}
          {state === "responding" &&
            "AgriLink is responding"}
        </div>

        <div className="text-sm text-[var(--muted-foreground)] mb-6">
          Language: {selectedLanguage.name}
        </div>

        {state === "idle" && (
          <Button size="lg" onClick={startListening}>
            🎙 Start Speaking
          </Button>
        )}

        {(state === "listening" ||
          state === "processing") && (
          <Button
            variant="danger"
            onClick={reset}
          >
            Stop
          </Button>
        )}

        {state === "responding" && (
          <Button
            variant="secondary"
            onClick={reset}
          >
            Ask Again
          </Button>
        )}
      </Card>

      {/* Error */}
      {error && (
        <Card className="p-4 border border-red-200 bg-red-50">
          <div className="text-sm text-red-700">
            ⚠️ {error}
          </div>
        </Card>
      )}

      {/* Transcript */}
      {transcript && (
        <Card className="p-5">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--green-pale)] flex items-center justify-center flex-shrink-0 border border-green-200">
                <span className="text-sm">👤</span>
              </div>

              <div className="bg-[var(--muted)] rounded-2xl rounded-tl-none px-4 py-2.5 flex-1">
                <p className="text-sm text-[var(--foreground)]">
                  {transcript}
                </p>

                <Badge
                  variant="neutral"
                  size="xs"
                  className="mt-1"
                >
                  {selectedLanguage.name}
                </Badge>
              </div>
            </div>

            {response && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--ai-bg)] flex items-center justify-center flex-shrink-0 border border-indigo-200">
                  <span className="text-sm text-[var(--ai-color)]">
                    ✦
                  </span>
                </div>

                <div className="bg-[var(--ai-bg)] border border-indigo-200 rounded-2xl rounded-tl-none px-4 py-2.5 flex-1">
                  <p className="text-sm text-[var(--foreground)]">
                    {response}
                  </p>

                  <Badge
                    variant="ai"
                    size="xs"
                    className="mt-1"
                  >
                    Live Voice Response
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Text fallback */}
      <Card className="p-5">
        <h3 className="font-semibold text-[var(--foreground)] mb-2">
          💬 Can't speak?
        </h3>

        <p className="text-sm text-[var(--muted-foreground)] mb-3">
          You can type a question and AgriLink will use the same
          market-data assistant.
        </p>

        <div className="flex gap-2">
          <input
            id="voice-question"
            type="text"
            placeholder={
              selectedLang === "te"
                ? "ఉదా: Tomato rate entha?"
                : selectedLang === "hi"
                  ? "उदा: टमाटर का भाव क्या है?"
                  : selectedLang === "kn"
                    ? "ಉದಾ: Tomato ಬೆಲೆ ಎಷ್ಟು?"
                    : selectedLang === "ta"
                      ? "உதா: Tomato விலை என்ன?"
                      : "Example: What is onion price?"
            }
            className="flex-1 border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm bg-[var(--muted)] text-[var(--foreground)] focus:outline-none"
            onKeyDown={e => {
              if (e.key === "Enter") {
                const input =
                  e.currentTarget.value.trim();

                if (input) {
                  setTranscript(input);
                  answerQuestion(input);
                  e.currentTarget.value = "";
                }
              }
            }}
          />

          <Button
            size="sm"
            onClick={() => {
              const input =
                (
                  document.getElementById(
                    "voice-question"
                  ) as HTMLInputElement | null
                )?.value.trim() || "";

              if (input) {
                setTranscript(input);
                answerQuestion(input);

                const element =
                  document.getElementById(
                    "voice-question"
                  ) as HTMLInputElement | null;

                if (element) {
                  element.value = "";
                }
              }
            }}
          >
            Ask
          </Button>
        </div>
      </Card>

      {/* IVR Info */}
      <Card className="p-5 bg-[var(--muted)]">
        <h3 className="font-semibold text-[var(--foreground)] mb-2">
          📞 Voice / IVR Phone Access
        </h3>

        <p className="text-sm text-[var(--muted-foreground)] mb-3">
          No smartphone? Simply call the AgriLink number from
          your registered phone.
        </p>

        <div className="space-y-2 text-sm">
          {[
            "System identifies your registered number",
            "Selects your preferred language automatically",
            "Answers prices, buyers and market questions",
            "No SMS commands or USSD typing required",
          ].map(step => (
            <div
              key={step}
              className="flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--green-mid)] flex-shrink-0" />
              <span>{step}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 bg-white rounded-xl p-3 border border-[var(--border)] text-center">
          <div className="text-xs text-[var(--muted-foreground)] mb-1">
            AgriLink Voice Helpline
          </div>

          <div className="font-mono font-bold text-[var(--foreground)] text-lg">
            1800-XXX-XXXX
          </div>

          <Badge
            variant="demo"
            size="xs"
            className="mt-1"
          >
            Demo Number
          </Badge>
        </div>
      </Card>
    </div>
  );
}