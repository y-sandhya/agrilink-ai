import React, { useState } from "react";
import { Button, Input, Select, Badge } from "../components/ui";
import { CROP_CATEGORIES, STATES, LANGUAGES } from "../data/demoData";

type AuthMode = "farmer-signup" | "farmer-signup-verify" | "farmer-signup-face" | "farmer-login" | "farmer-login-face" | "buyer-login";

const ALL_CROPS = Object.values(CROP_CATEGORIES).flat();

function FarmerSignup({ onNext }: { onNext: () => void }) {
  const [form, setForm] = useState({ name: "", mobile: "", email: "", password: "", village: "", district: "", state: "", language: "English", crops: [] as string[] });

  const toggleCrop = (crop: string) => {
    setForm(f => ({ ...f, crops: f.crops.includes(crop) ? f.crops.filter(c => c !== crop) : [...f.crops, crop] }));
  };

  return (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <h2 className="font-serif text-3xl text-[var(--foreground)]">Create Farmer Account</h2>
        <p className="text-[var(--muted-foreground)] text-sm mt-2">Join AgriLink to access smarter market decisions</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Full Name" placeholder="Your full name" required value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} />
        <Input label="Mobile Number" placeholder="+91 XXXXX XXXXX" required type="tel" value={form.mobile} onChange={v => setForm(f => ({ ...f, mobile: v }))} />
        <Input label="Email (optional)" placeholder="email@example.com" type="email" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} />
        <Input label="Password" placeholder="Create a strong password" type="password" required value={form.password} onChange={v => setForm(f => ({ ...f, password: v }))} />
        <Input label="Village" placeholder="Your village name" required value={form.village} onChange={v => setForm(f => ({ ...f, village: v }))} />
        <Input label="District" placeholder="Your district" required value={form.district} onChange={v => setForm(f => ({ ...f, district: v }))} />
        <Select label="State" required options={STATES.map(s => ({ value: s, label: s }))} placeholder="Select state" value={form.state} onChange={v => setForm(f => ({ ...f, state: v }))} />
        <Select label="Preferred Language" required options={LANGUAGES.map(l => ({ value: l, label: l }))} value={form.language} onChange={v => setForm(f => ({ ...f, language: v }))} />
      </div>
      <div>
        <label className="text-sm font-medium text-[var(--foreground)] block mb-2">Crops Grown <span className="text-[var(--muted-foreground)] font-normal">(select all that apply)</span></label>
        <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-1">
          {["Tomato", "Onion", "Potato", "Chilli", "Rice", "Wheat", "Mango", "Banana", "Turmeric", "Ginger", "Spinach", "Coriander"].map(crop => (
            <button
              key={crop}
              type="button"
              onClick={() => toggleCrop(crop)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${form.crops.includes(crop) ? "bg-[var(--green-mid)] text-white border-[var(--green-mid)]" : "bg-white text-[var(--foreground)] border-[var(--border)] hover:border-[var(--green-mid)]"}`}
            >
              {crop}
            </button>
          ))}
        </div>
      </div>
      <Button fullWidth size="lg" onClick={onNext}>Continue to Identity Verification →</Button>
      <p className="text-xs text-center text-[var(--muted-foreground)]">By continuing, you agree to AgriLink's Terms of Service and Privacy Policy.</p>
    </div>
  );
}

function IdentityVerification({ onNext }: { onNext: () => void }) {
  const [consent, setConsent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [aadhaar, setAadhaar] = useState("");

  return (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <h2 className="font-serif text-3xl text-[var(--foreground)]">Identity Verification</h2>
        <p className="text-[var(--muted-foreground)] text-sm mt-2">Secure your account with consent-based identity verification</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <strong>Why we verify:</strong> Identity verification helps protect farmers from fraud and enables secure transactions. Your Aadhaar data is used only for verification and is never stored in raw form.
      </div>

      {!verified ? (
        <>
          <div>
            <label className="text-sm font-medium text-[var(--foreground)] block mb-1">Aadhaar Number <span className="text-red-500">*</span></label>
            <input
              type="text"
              placeholder="XXXX XXXX XXXX"
              maxLength={14}
              value={aadhaar}
              onChange={e => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 12);
                const masked = val.length > 8 ? `XXXX XXXX ${val.slice(8)}` : val.length > 4 ? `XXXX ${val.slice(4, 8)}` : val;
                setAadhaar(masked);
              }}
              className="w-full border rounded-xl px-4 py-3 text-sm font-mono bg-white border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] tracking-widest"
            />
            <p className="text-xs text-[var(--muted-foreground)] mt-1">Your full Aadhaar number is never displayed or stored. Only masked reference is retained after verification.</p>
          </div>

          <div className="flex items-start gap-3 bg-[var(--muted)] rounded-xl p-4">
            <input
              type="checkbox"
              id="consent"
              checked={consent}
              onChange={e => setConsent(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-[var(--green-mid)] flex-shrink-0"
            />
            <label htmlFor="consent" className="text-sm text-[var(--foreground)] leading-relaxed cursor-pointer">
              I consent to AgriLink using my Aadhaar information for identity verification through an authorized e-KYC integration. I understand my data will be processed as per the Privacy Policy.
            </label>
          </div>

          <Button fullWidth size="lg" disabled={!consent} onClick={() => setVerified(true)}>
            Verify Identity
          </Button>
        </>
      ) : (
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-green-50 border-2 border-green-400 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
            ✓
          </div>
          <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">Identity Verified ✓</h3>
          <p className="text-[var(--muted-foreground)] text-sm mb-6">Your identity has been successfully verified. Your full Aadhaar number is not stored.</p>
          <Button size="lg" onClick={onNext}>Continue to Face Registration →</Button>
        </div>
      )}

      <div className="text-center">
        <button className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] underline">Having trouble with verification?</button>
      </div>
    </div>
  );
}

function FaceRegistration({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState<"guide" | "capture" | "success">("guide");

  return (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <h2 className="font-serif text-3xl text-[var(--foreground)]">Face Registration</h2>
        <p className="text-[var(--muted-foreground)] text-sm mt-2">Add face verification for enhanced account security</p>
      </div>

      {step === "guide" && (
        <>
          <div className="bg-[var(--background)] border border-[var(--border)] rounded-2xl p-8 text-center">
            <div className="w-36 h-36 bg-[var(--muted)] rounded-full mx-auto mb-4 flex items-center justify-center relative border-2 border-dashed border-[var(--border)]">
              <span className="text-5xl">👤</span>
              <div className="absolute inset-3 border-2 border-[var(--green-mid)] rounded-full opacity-40"></div>
            </div>
            <p className="text-sm text-[var(--muted-foreground)]">Position your face within the circle</p>
          </div>
          <div className="space-y-2 text-sm text-[var(--muted-foreground)]">
            {["Ensure good lighting — face a light source", "Look straight at the camera", "Remove glasses or hat if possible", "Stay still during capture"].map(tip => (
              <div key={tip} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--green-mid)] flex-shrink-0"></span>
                {tip}
              </div>
            ))}
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
            <strong>Consent:</strong> Your facial biometric template is stored in encrypted form and used only for account authentication. It is never shared with third parties.
          </div>
          <Button fullWidth size="lg" onClick={() => setStep("capture")}>📷 Start Face Registration</Button>
        </>
      )}

      {step === "capture" && (
        <div className="text-center space-y-4">
          <div className="bg-black rounded-2xl aspect-video flex items-center justify-center relative overflow-hidden">
            <div className="w-40 h-52 border-2 border-green-400 rounded-full opacity-80 absolute"></div>
            <div className="text-white/30 text-sm">Camera Preview</div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-white text-xs font-medium">Detecting face...</span>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <Button variant="secondary" onClick={() => setStep("guide")}>← Retry</Button>
            <Button onClick={() => setStep("success")}>Capture</Button>
          </div>
        </div>
      )}

      {step === "success" && (
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-green-50 border-2 border-green-400 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
            ✓
          </div>
          <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">Face registration successful ✓</h3>
          <p className="text-[var(--muted-foreground)] text-sm mb-6">Your face has been registered. You can now use face verification to log in securely.</p>
          <Button size="lg" fullWidth onClick={onComplete}>Go to Farmer Dashboard →</Button>
          <button className="mt-3 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] underline block mx-auto">Skip for now</button>
          <p className="text-xs text-[var(--muted-foreground)] mt-2">Note: Face verification is not the only account recovery mechanism. You can always use your mobile number.</p>
        </div>
      )}
    </div>
  );
}

function FarmerLogin({ onNext, onGoSignup }: { onNext: () => void; onGoSignup: () => void }) {
  return (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <h2 className="font-serif text-3xl text-[var(--foreground)]">Farmer Login</h2>
        <p className="text-[var(--muted-foreground)] text-sm mt-2">Login to your AgriLink farmer account</p>
      </div>
      <Input label="Mobile Number or Email" placeholder="+91 XXXXX XXXXX or email" required />
      <Input label="Password" placeholder="Your password" type="password" required />
      <Button fullWidth size="lg" onClick={onNext}>Continue →</Button>
      <div className="text-center text-sm text-[var(--muted-foreground)]">
        Don't have an account? <button className="text-[var(--green-mid)] font-medium hover:underline" onClick={onGoSignup}>Create Account</button>
      </div>
    </div>
  );
}

function FaceLogin({ onComplete }: { onComplete: () => void }) {
  const [status, setStatus] = useState<"waiting" | "scanning" | "match" | "failed">("waiting");

  return (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <h2 className="font-serif text-3xl text-[var(--foreground)]">Face Verification</h2>
        <p className="text-[var(--muted-foreground)] text-sm mt-2">Verify your identity to complete login</p>
      </div>
      <div className="bg-black rounded-2xl aspect-video flex items-center justify-center relative overflow-hidden">
        <div className={`w-40 h-52 border-2 rounded-full absolute transition-colors ${status === "match" ? "border-green-400" : status === "failed" ? "border-red-400" : status === "scanning" ? "border-yellow-400 animate-pulse" : "border-white/30"}`}></div>
        <div className="text-white/30 text-sm">Camera Preview</div>
        {status === "match" && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-green-500/90 text-white text-sm px-4 py-1.5 rounded-full font-medium">
            ✓ Face Matched
          </div>
        )}
        {status === "failed" && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-red-500/90 text-white text-sm px-4 py-1.5 rounded-full font-medium">
            ✗ Match Failed
          </div>
        )}
        {status === "scanning" && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
            <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
            <span className="text-white text-xs">Verifying...</span>
          </div>
        )}
      </div>
      <div className="flex gap-3 justify-center">
        {status === "waiting" && <Button fullWidth size="lg" onClick={() => { setStatus("scanning"); setTimeout(() => setStatus("match"), 1800); }}>Start Face Verification</Button>}
        {status === "scanning" && <Button fullWidth size="lg" disabled>Verifying...</Button>}
        {status === "match" && <Button fullWidth size="lg" onClick={onComplete}>✓ Enter Dashboard →</Button>}
        {status === "failed" && (
          <>
            <Button variant="secondary" onClick={() => setStatus("waiting")}>Retry</Button>
            <Button variant="ghost">Use Secure Fallback</Button>
          </>
        )}
      </div>
      <p className="text-xs text-center text-[var(--muted-foreground)]">Having trouble? <button className="text-[var(--green-mid)] hover:underline">Use alternate verification</button></p>
    </div>
  );
}

function BuyerLogin({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <h2 className="font-serif text-3xl text-[var(--foreground)]">Buyer Login</h2>
        <p className="text-[var(--muted-foreground)] text-sm mt-2">Access your AgriLink buyer portal</p>
      </div>
      <Input label="Mobile Number or Email" placeholder="+91 XXXXX XXXXX or email" required />
      <Input label="Password" placeholder="Your password" type="password" required />
      <Button fullWidth size="lg" onClick={onComplete}>Login →</Button>
      <p className="text-xs text-center text-[var(--muted-foreground)]">Buyer accounts do not require face verification.</p>
    </div>
  );
}

export default function AuthPage({
  mode,
  onNavigate,
}: {
  mode: AuthMode;
  onNavigate: (page: string) => void;
}) {
  const [step, setStep] = useState<AuthMode>(mode);

  return (
    <div className="min-h-full bg-[var(--background)] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Back + Logo */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => onNavigate("landing")}
            className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            ← Back
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[var(--green-mid)] flex items-center justify-center">
              <span className="text-white font-bold font-serif text-xs">A</span>
            </div>
            <span className="font-bold text-[var(--primary)] font-serif">AgriLink AI</span>
          </div>
          {step !== "buyer-login" && (
            <button
              onClick={() => onNavigate("auth-buyer-login")}
              className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            >
              Buyer? →
            </button>
          )}
          {step === "buyer-login" && (
            <button
              onClick={() => onNavigate("auth-farmer-login")}
              className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            >
              Farmer? →
            </button>
          )}
        </div>

        <div className="bg-white rounded-3xl border border-[var(--border)] shadow-sm p-8">
          {/* Progress for signup */}
          {(step === "farmer-signup" || step === "farmer-signup-verify" || step === "farmer-signup-face") && (
            <div className="flex items-center gap-2 mb-8">
              {["Account Details", "Identity Verification", "Face Registration"].map((s, i) => {
                const idx = ["farmer-signup", "farmer-signup-verify", "farmer-signup-face"].indexOf(step);
                return (
                  <React.Fragment key={s}>
                    <div className={`flex items-center gap-2 text-xs font-medium ${i <= idx ? "text-[var(--green-mid)]" : "text-[var(--muted-foreground)]"}`}>
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center border text-xs ${i < idx ? "bg-[var(--green-mid)] border-[var(--green-mid)] text-white" : i === idx ? "border-[var(--green-mid)] text-[var(--green-mid)]" : "border-[var(--border)]"}`}>
                        {i < idx ? "✓" : i + 1}
                      </span>
                      <span className="hidden sm:inline">{s}</span>
                    </div>
                    {i < 2 && <div className={`flex-1 h-0.5 ${i < idx ? "bg-[var(--green-mid)]" : "bg-[var(--border)]"}`} />}
                  </React.Fragment>
                );
              })}
            </div>
          )}

          {step === "farmer-signup" && <FarmerSignup onNext={() => setStep("farmer-signup-verify")} />}
          {step === "farmer-signup-verify" && <IdentityVerification onNext={() => setStep("farmer-signup-face")} />}
          {step === "farmer-signup-face" && <FaceRegistration onComplete={() => onNavigate("farmer-dashboard")} />}
          {step === "farmer-login" && <FarmerLogin onNext={() => setStep("farmer-login-face")} onGoSignup={() => setStep("farmer-signup")} />}
          {step === "farmer-login-face" && <FaceLogin onComplete={() => onNavigate("farmer-dashboard")} />}
          {step === "buyer-login" && <BuyerLogin onComplete={() => onNavigate("buyer-dashboard")} />}
        </div>
      </div>
    </div>
  );
}
