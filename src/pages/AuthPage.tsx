import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Select } from "../components/ui";
import { CROP_CATEGORIES, STATES, LANGUAGES } from "../data/demoData";

type AuthMode =
  | "farmer-signup" | "farmer-signup-verify" | "farmer-signup-face"
  | "farmer-login" | "farmer-login-face"
  | "buyer-login" | "buyer-signup";

type UserRole = "farmer" | "buyer";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const FACE_SCRIPT = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/dist/face-api.js";
const FACE_MODEL_URL = "https://cdn.jsdelivr.net/gh/vladmandic/face-api/model/";

type FarmerForm = {
  name: string; mobile: string; email: string; password: string;
  village: string; district: string; state: string; language: string;
  crops: string[]; aadhaar: string;
};
type BuyerForm = { name: string; mobile: string; email: string; password: string; company: string; location: string; };

const emptyFarmer: FarmerForm = {
  name:"", mobile:"", email:"", password:"", village:"", district:"",
  state:"", language:"English", crops:[], aadhaar:""
};
const emptyBuyer: BuyerForm = { name:"", mobile:"", email:"", password:"", company:"", location:"" };

function getFaceApi(): any { return (window as any).faceapi; }

async function loadFaceModels() {
  if (getFaceApi()) return;
  await new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = FACE_SCRIPT;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Could not load face verification engine."));
    document.head.appendChild(s);
  });
  const faceapi = getFaceApi();
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(FACE_MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(FACE_MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(FACE_MODEL_URL),
  ]);
}

async function getFaceDescriptor(video: HTMLVideoElement) {
  const faceapi = getFaceApi();
  const result = await faceapi
    .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 }))
    .withFaceLandmarks()
    .withFaceDescriptor();
  if (!result) throw new Error("No clear face detected. Look straight at the camera.");
  return Array.from(result.descriptor as Float32Array);
}

function CameraFace({
  title, onCaptured, buttonText
}: { title: string; onCaptured: (descriptor:number[]) => void; buttonText:string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [ready,setReady] = useState(false);
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState("");

  useEffect(() => {
    let cancelled=false;
    (async()=>{
      try {
        setError("");
        await loadFaceModels();
        const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"user",width:{ideal:640},height:{ideal:480}},audio:false});
        if(cancelled){stream.getTracks().forEach(t=>t.stop());return;}
        streamRef.current=stream;
        if(videoRef.current){videoRef.current.srcObject=stream; await videoRef.current.play();}
        setReady(true);
      } catch(e:any) { setError(e?.message || "Camera permission/model loading failed."); }
    })();
    return ()=>{cancelled=true;streamRef.current?.getTracks().forEach(t=>t.stop());};
  },[]);

  const capture=async()=>{
    if(!videoRef.current) return;
    try { setBusy(true); setError(""); const d=await getFaceDescriptor(videoRef.current); onCaptured(d); }
    catch(e:any){setError(e?.message || "Face could not be verified. Try again.");}
    finally{setBusy(false);}
  };

  return <div className="space-y-4">
    <div className="bg-black rounded-2xl overflow-hidden relative aspect-video">
      <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover scale-x-[-1]" />
      <div className="absolute inset-[18%] border-2 border-green-400/80 rounded-[45%] pointer-events-none"/>
      {!ready && <div className="absolute inset-0 flex items-center justify-center text-white text-sm bg-black/50">Starting camera…</div>}
    </div>
    <p className="text-sm text-center text-[var(--muted-foreground)]">{title}</p>
    {error && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">{error}</div>}
    <Button fullWidth size="lg" disabled={!ready||busy} onClick={capture}>
      {busy ? "Checking face…" : buttonText}
    </Button>
  </div>;
}

function FarmerSignup({form,setForm,onNext}:{form:FarmerForm;setForm:React.Dispatch<React.SetStateAction<FarmerForm>>;onNext:()=>void}) {
  const toggle=(crop:string)=>setForm(f=>({...f,crops:f.crops.includes(crop)?f.crops.filter(x=>x!==crop):[...f.crops,crop]}));
  const valid=form.name&&form.mobile&&form.password&&form.village&&form.district&&form.state&&form.aadhaar.length===12;
  return <div className="space-y-5">
    <div className="text-center mb-6"><h2 className="font-serif text-3xl">Create Farmer Account</h2><p className="text-[var(--muted-foreground)] text-sm mt-2">Join AgriLink to access smarter market decisions</p></div>
    <div className="grid sm:grid-cols-2 gap-4">
      <Input label="Full Name" required value={form.name} onChange={v=>setForm(f=>({...f,name:v}))}/>
      <Input label="Mobile Number" required type="tel" placeholder="+91 XXXXX XXXXX" value={form.mobile} onChange={v=>setForm(f=>({...f,mobile:v}))}/>
      <Input label="Email (optional)" type="email" value={form.email} onChange={v=>setForm(f=>({...f,email:v}))}/>
      <Input label="Password" required type="password" value={form.password} onChange={v=>setForm(f=>({...f,password:v}))}/>
      <Input label="Village" required value={form.village} onChange={v=>setForm(f=>({...f,village:v}))}/>
      <Input label="District" required value={form.district} onChange={v=>setForm(f=>({...f,district:v}))}/>
      <Select label="State" required options={STATES.map(s=>({value:s,label:s}))} value={form.state} onChange={v=>setForm(f=>({...f,state:v}))}/>
      <Select label="Preferred Language" required options={LANGUAGES.map(l=>({value:l,label:l}))} value={form.language} onChange={v=>setForm(f=>({...f,language:v}))}/>
    </div>
    <div>
      <label className="text-sm font-medium block mb-2">Crops Grown</label>
      <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto">{["Tomato","Onion","Potato","Chilli","Rice","Wheat","Mango","Banana","Turmeric","Ginger","Spinach","Coriander"].map(c=><button type="button" key={c} onClick={()=>toggle(c)} className={`px-3 py-1.5 rounded-lg text-sm border ${form.crops.includes(c)?"bg-[var(--green-mid)] text-white border-[var(--green-mid)]":"bg-white border-[var(--border)]"}`}>{c}</button>)}</div>
    </div>
    <div>
      <label className="text-sm font-medium block mb-1">Aadhaar Number <span className="text-red-500">*</span></label>
      <input inputMode="numeric" autoComplete="off" maxLength={12} placeholder="Enter 12-digit Aadhaar" value={form.aadhaar.replace(/(\d{4})(?=\d)/g,"$1 ")} onChange={e=>setForm(f=>({...f,aadhaar:e.target.value.replace(/\D/g,"").slice(0,12)}))} className="w-full border rounded-xl px-4 py-3 font-mono tracking-widest bg-white border-[var(--border)]"/>
      <p className="text-xs text-[var(--muted-foreground)] mt-1">12 digits required. Only a masked/reference value should be retained after authorized verification.</p>
    </div>
    <Button fullWidth size="lg" disabled={!valid} onClick={onNext}>Continue to Identity Verification →</Button>
  </div>;
}

function IdentityVerification({form,onNext}:{form:FarmerForm;onNext:()=>void}) {
  const [consent,setConsent]=useState(false);
  const [busy,setBusy]=useState(false);
  const [msg,setMsg]=useState("");
  const verify=async()=>{
    if(form.aadhaar.length!==12||!consent)return;
    try{setBusy(true);setMsg("");const r=await fetch(`${API_BASE}/auth/verify-aadhaar`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({aadhaar:form.aadhaar})});const d=await r.json();if(!r.ok)throw new Error(d.message||"Identity verification failed");setMsg("Identity verified successfully.");onNext();}catch(e:any){setMsg(e.message)}finally{setBusy(false)}
  };
  return <div className="space-y-5">
    <div className="text-center mb-6"><h2 className="font-serif text-3xl">Identity Verification</h2><p className="text-[var(--muted-foreground)] text-sm mt-2">Consent-based Aadhaar verification</p></div>
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800"><b>12-digit Aadhaar:</b> {form.aadhaar.replace(/\d(?=\d{4})/g,"X")}</div>
    <div className="flex items-start gap-3 bg-[var(--muted)] rounded-xl p-4"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} className="mt-1"/><label className="text-sm leading-relaxed">I consent to authorized identity verification and understand that raw Aadhaar should not be retained by AgriLink.</label></div>
    {msg&&<div className={`rounded-xl p-3 text-sm ${msg.includes("successfully")?"bg-green-50 text-green-700":"bg-red-50 text-red-700"}`}>{msg}</div>}
    <Button fullWidth size="lg" disabled={!consent||busy} onClick={verify}>{busy?"Verifying…":"Verify Identity"}</Button>
  </div>;
}

function FaceRegistration({onComplete,form}:{onComplete:(descriptor:number[])=>void;form:FarmerForm}) {
  const [done,setDone]=useState(false);
  return <div className="space-y-5"><div className="text-center mb-6"><h2 className="font-serif text-3xl">Face Registration</h2><p className="text-[var(--muted-foreground)] text-sm mt-2">Your camera will capture a face template for authentication.</p></div>
    {!done?<><CameraFace title="Look straight at the camera in good lighting." buttonText="📷 Capture & Register Face" onCaptured={d=>{setDone(true);onComplete(d)}}/><p className="text-xs text-center text-[var(--muted-foreground)]">Face data is used for authentication. Raw photos are not required by this prototype.</p></>:<div className="text-center py-8"><div className="text-5xl mb-4">✓</div><h3 className="text-xl font-semibold mb-2">Face captured successfully</h3><p className="text-sm text-[var(--muted-foreground)]">Creating your AgriLink account…</p></div>}
  </div>;
}

function FarmerLogin({onNext,onGoSignup}:{onNext:(identifier:string,password:string)=>void;onGoSignup:()=>void}) {
  const [identifier,setIdentifier]=useState("");const [password,setPassword]=useState("");
  return <div className="space-y-5"><div className="text-center mb-6"><h2 className="font-serif text-3xl">Farmer Login</h2><p className="text-[var(--muted-foreground)] text-sm mt-2">Email or phone + password</p></div><Input label="Mobile Number or Email" required value={identifier} onChange={setIdentifier}/><Input label="Password" type="password" required value={password} onChange={setPassword}/><Button fullWidth size="lg" disabled={!identifier||!password} onClick={()=>onNext(identifier,password)}>Continue →</Button><div className="text-center text-sm">Don't have an account? <button className="text-[var(--green-mid)] font-medium" onClick={onGoSignup}>Create Account</button></div></div>;
}

function FaceLogin({challenge,onComplete}:{challenge:string;onComplete:()=>void}) {
  const [busy,setBusy]=useState(false);const [error,setError]=useState("");
  const verify=async(d:number[])=>{try{setBusy(true);setError("");const r=await fetch(`${API_BASE}/auth/verify-face`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({challenge,descriptor:d})});const data=await r.json();if(!r.ok)throw new Error(data.message||"Face verification failed");localStorage.setItem("agrilink_token",data.token);onComplete()}catch(e:any){setError(e.message)}finally{setBusy(false)}};
  return <div className="space-y-5"><div className="text-center mb-6"><h2 className="font-serif text-3xl">Face Verification</h2><p className="text-[var(--muted-foreground)] text-sm mt-2">Look at the camera to verify your registered face.</p></div><CameraFace title="Your live face is compared with your registered face template." buttonText={busy?"Verifying…":"Verify My Face"} onCaptured={verify}/>{error&&<div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">{error}</div>}</div>;
}

function BuyerAuth({signup,onComplete}:{signup:boolean;onComplete:()=>void}) {
  const [form,setForm]=useState<BuyerForm>(emptyBuyer);const [identifier,setIdentifier]=useState("");const [password,setPassword]=useState("");const [error,setError]=useState("");
  const submit=async()=>{
    try{setError("");const body=signup?{...form,role:"buyer"}:{identifier,password,role:"buyer"};const r=await fetch(`${API_BASE}/auth/${signup?"register":"login"}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});const d=await r.json();if(!r.ok)throw new Error(d.message||"Authentication failed");if(d.token)localStorage.setItem("agrilink_token",d.token);onComplete()}catch(e:any){setError(e.message)}
  };
  if(signup)return <div className="space-y-5"><div className="text-center mb-6"><h2 className="font-serif text-3xl">Create Buyer Account</h2></div><div className="grid sm:grid-cols-2 gap-4"><Input label="Full Name" required value={form.name} onChange={v=>setForm(f=>({...f,name:v}))}/><Input label="Company / Business" required value={form.company} onChange={v=>setForm(f=>({...f,company:v}))}/><Input label="Mobile Number" required value={form.mobile} onChange={v=>setForm(f=>({...f,mobile:v}))}/><Input label="Email" type="email" value={form.email} onChange={v=>setForm(f=>({...f,email:v}))}/><Input label="Password" required type="password" value={form.password} onChange={v=>setForm(f=>({...f,password:v}))}/><Input label="Business Location" value={form.location} onChange={v=>setForm(f=>({...f,location:v}))}/></div>{error&&<div className="bg-red-50 text-red-700 rounded-xl p-3 text-sm">{error}</div>}<Button fullWidth size="lg" onClick={submit}>Create Buyer Account →</Button></div>;
  return <div className="space-y-5"><div className="text-center mb-6"><h2 className="font-serif text-3xl">Buyer Login</h2><p className="text-[var(--muted-foreground)] text-sm mt-2">Email or phone + password</p></div><Input label="Mobile Number or Email" required value={identifier} onChange={setIdentifier}/><Input label="Password" type="password" required value={password} onChange={setPassword}/>{error&&<div className="bg-red-50 text-red-700 rounded-xl p-3 text-sm">{error}</div>}<Button fullWidth size="lg" disabled={!identifier||!password} onClick={submit}>Login →</Button><p className="text-xs text-center text-[var(--muted-foreground)]">Buyer accounts do not require face verification.</p></div>;
}

export default function AuthPage({mode,onNavigate}:{mode:AuthMode;onNavigate:(page:string)=>void}) {
  const [step,setStep]=useState<AuthMode>(mode);
  const [farmer,setFarmer]=useState<FarmerForm>(emptyFarmer);
  const [challenge,setChallenge]=useState("");
  const [error,setError]=useState("");

  const registerFarmer=async(descriptor:number[])=>{
    try{
      setError("");
      const r=await fetch(`${API_BASE}/auth/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...farmer,role:"farmer",faceDescriptor:descriptor})});
      const d=await r.json();if(!r.ok)throw new Error(d.message||"Registration failed");
      localStorage.setItem("agrilink_token",d.token);onNavigate("farmer-dashboard");
    }catch(e:any){setError(e.message)}
  };

  const startFarmerLogin=async(identifier:string,password:string)=>{
    try{setError("");const r=await fetch(`${API_BASE}/auth/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({identifier,password,role:"farmer"})});const d=await r.json();if(!r.ok)throw new Error(d.message||"Login failed");setChallenge(d.challenge);setStep("farmer-login-face")}catch(e:any){setError(e.message)}
  };

  return <div className="min-h-full bg-[var(--background)] flex items-center justify-center p-4"><div className="w-full max-w-2xl">
    <div className="flex items-center justify-between mb-8"><button onClick={()=>onNavigate("landing")} className="text-sm text-[var(--muted-foreground)]">← Back</button><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-lg bg-[var(--green-mid)] flex items-center justify-center text-white font-bold">A</div><span className="font-bold text-[var(--primary)] font-serif">AgriLink AI</span></div><button onClick={()=>setStep(step==="buyer-login"?"farmer-login":"buyer-login")} className="text-sm text-[var(--muted-foreground)]">{step==="buyer-login"?"Farmer? →":"Buyer? →"}</button></div>
    <div className="bg-white rounded-3xl border border-[var(--border)] shadow-sm p-8">
      {(step.startsWith("farmer-signup"))&&<div className="flex items-center gap-2 mb-8">{["Account Details","Identity Verification","Face Registration"].map((s,i)=>{const idx=["farmer-signup","farmer-signup-verify","farmer-signup-face"].indexOf(step);return <React.Fragment key={s}><div className={`text-xs font-medium ${i<=idx?"text-[var(--green-mid)]":"text-[var(--muted-foreground)]"}`}>{i<idx?"✓":i+1} <span className="hidden sm:inline">{s}</span></div>{i<2&&<div className="flex-1 h-0.5 bg-[var(--border)]"/>}</React.Fragment>})}</div>}
      {step==="farmer-signup"&&<FarmerSignup form={farmer} setForm={setFarmer} onNext={()=>setStep("farmer-signup-verify")}/>}
      {step==="farmer-signup-verify"&&<IdentityVerification form={farmer} onNext={()=>setStep("farmer-signup-face")}/>}
      {step==="farmer-signup-face"&&<FaceRegistration form={farmer} onComplete={registerFarmer}/>}
      {step==="farmer-login"&&<FarmerLogin onNext={startFarmerLogin} onGoSignup={()=>setStep("farmer-signup")}/>}
      {step==="farmer-login-face"&&<FaceLogin challenge={challenge} onComplete={()=>onNavigate("farmer-dashboard")}/>}
      {step==="buyer-login"&&<BuyerAuth signup={false} onComplete={()=>onNavigate("buyer-dashboard")}/>}
      {step==="buyer-signup"&&<BuyerAuth signup={true} onComplete={()=>onNavigate("buyer-dashboard")}/>}
      {error&&<div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">{error}</div>}
      {step==="buyer-login"&&<button className="mt-4 text-sm text-[var(--green-mid)] block mx-auto" onClick={()=>setStep("buyer-signup")}>Create Buyer Account</button>}
      {step==="buyer-signup"&&<button className="mt-4 text-sm text-[var(--green-mid)] block mx-auto" onClick={()=>setStep("buyer-login")}>Already have a buyer account? Login</button>}
    </div>
  </div></div>;
}
