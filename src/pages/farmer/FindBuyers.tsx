import React, { useState } from "react";
import { Card, Button, Badge, DemoBanner, MatchScore, Modal } from "../../components/ui";
import { DEMO_BUYERS } from "../../data/demoData";

export default function FindBuyers() {
  const [searched, setSearched] = useState(false);
  const [whyModal, setWhyModal] = useState<typeof DEMO_BUYERS[0] | null>(null);

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-4xl mx-auto">
      <DemoBanner />
      <div>
        <h1 className="font-serif text-3xl text-[var(--foreground)]">Find Buyers</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">Get matched with buyers looking for your produce</p>
      </div>

      {/* Search Form */}
      <Card className="p-5">
        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-[var(--foreground)] block mb-1">Crop *</label>
            <select className="w-full border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--ring)]">
              {["Tomato", "Onion", "Chilli", "Rice", "Wheat"].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-[var(--foreground)] block mb-1">Quantity (kg)</label>
            <input type="number" placeholder="500" defaultValue="800" className="w-full border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--ring)]" />
          </div>
          <div>
            <label className="text-sm font-medium text-[var(--foreground)] block mb-1">Quality Grade</label>
            <select className="w-full border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--ring)]">
              <option>Grade A</option>
              <option>Grade B</option>
              <option>Any</option>
            </select>
          </div>
        </div>
        <Button size="lg" fullWidth onClick={() => setSearched(true)}>🤝 Find Matching Buyers</Button>
      </Card>

      {searched && (
        <>
          <div className="bg-[var(--green-pale)] border border-green-200 rounded-xl px-4 py-3 text-sm text-[var(--green-mid)] font-medium">
            {DEMO_BUYERS.length} buyers match your requirement
          </div>

          <div className="space-y-4">
            {DEMO_BUYERS.map(buyer => (
              <Card key={buyer.id} className="p-5">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-shrink-0">
                    <MatchScore score={buyer.match_score} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-[var(--foreground)] text-base">{buyer.name}</h3>
                          {buyer.verification === "pending" ? (
                            <Badge variant="warning">Verification Pending</Badge>
                          ) : (
                            <Badge variant="success">Verified</Badge>
                          )}
                        </div>
                        <p className="text-sm text-[var(--muted-foreground)] mt-0.5">{buyer.type} · {buyer.location} · {buyer.distance_km} km away</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-mono font-bold text-[var(--green-mid)] text-lg">₹{buyer.offer_price}</div>
                        <div className="text-xs text-[var(--muted-foreground)]">per quintal (offer)</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <div className="text-xs bg-[var(--muted)] rounded-lg px-3 py-1.5">
                        Needs: {buyer.quantity_required} kg
                      </div>
                      <div className="text-xs bg-[var(--muted)] rounded-lg px-3 py-1.5">
                        Quality: {buyer.quality}
                      </div>
                      <div className="text-xs bg-[var(--muted)] rounded-lg px-3 py-1.5">
                        Crop: {buyer.crop}
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <Button variant="primary" size="sm">Send Interest</Button>
                      <Button variant="secondary" size="sm">View Buyer</Button>
                      <button
                        className="text-xs text-[var(--ai-color)] hover:underline font-medium px-2"
                        onClick={() => setWhyModal(buyer)}
                      >
                        Why this match?
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Badge variant="demo">Demo Buyers — Not real verified entities</Badge>
        </>
      )}

      {/* Why Match Modal */}
      <Modal open={!!whyModal} onClose={() => setWhyModal(null)} title={`Match Explanation — ${whyModal?.name}`}>
        {whyModal && (
          <div className="space-y-4">
            <div className="text-center">
              <MatchScore score={whyModal.match_score} />
              <p className="text-sm text-[var(--muted-foreground)] mt-2">Overall match score</p>
            </div>
            <div className="space-y-2">
              {Object.entries(whyModal.match_factors).map(([key, matched]) => (
                <div key={key} className={`flex items-center gap-3 p-3 rounded-xl border ${matched ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${matched ? "bg-green-400 text-white" : "bg-red-400 text-white"}`}>
                    {matched ? "✓" : "✗"}
                  </span>
                  <span className="text-sm font-medium text-[var(--foreground)] capitalize">{key}</span>
                  <span className={`ml-auto text-xs font-medium ${matched ? "text-green-700" : "text-red-700"}`}>
                    {matched ? "Matches" : "Mismatch"}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-[var(--muted-foreground)]">Match score is based on crop type, quantity compatibility, quality grade, location proximity, and offer price alignment. Buyer verification status is separate from match score.</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
