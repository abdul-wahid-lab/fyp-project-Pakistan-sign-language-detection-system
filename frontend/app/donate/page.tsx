"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { LsPublicNav, LsFooter } from "../components/ls/Components";
import * as I from "../components/ls/Icons";

const PRESETS = [500, 1000, 2000, 5000];

export default function DonatePage() {
  const { data: session } = useSession();
  const [selected, setSelected] = useState<number | null>(1000);
  const [custom, setCustom] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const amount = custom ? parseInt(custom) : selected;

  async function handleDonate() {
    if (!amount || amount < 100) {
      setError("Minimum donation is PKR 100");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, email: session?.user?.email }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setError(data.error ?? "Something went wrong");
    } catch {
      setError("Could not connect to payment service");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ls-scope" style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <LsPublicNav active="/donate" />

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "72px 24px 48px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 20,
            background: "linear-gradient(135deg, var(--green), var(--green-deep))",
            display: "grid", placeItems: "center", margin: "0 auto 20px",
            boxShadow: "0 8px 24px oklch(0.74 0.16 158 / 0.35)",
          }}>
            <I.Heart size={30} style={{ color: 'white' }} />
          </div>
          <h1 style={{ fontSize: 38, marginBottom: 12, fontFamily: "var(--font-display)" }}>Support LinguaSign</h1>
          <p style={{ color: "var(--ink-soft)", fontSize: 16.5, lineHeight: 1.7, maxWidth: 420, margin: "0 auto" }}>
            Your donation helps us expand PSL recognition, improve accuracy, and keep the platform free for everyone in Pakistan.
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "var(--surface)", border: "1px solid var(--line)",
          borderRadius: "calc(var(--radius) * 2)", padding: "36px 32px",
          boxShadow: "var(--shadow-md)",
        }}>
          <p style={{ fontWeight: 700, fontSize: 14, color: "var(--ink-faint)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>
            Choose amount (PKR)
          </p>

          {/* Preset amounts */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
            {PRESETS.map(p => (
              <button key={p} onClick={() => { setSelected(p); setCustom(""); }}
                style={{
                  padding: "14px 8px", borderRadius: "var(--radius)", fontFamily: "var(--font-display)",
                  fontWeight: 700, fontSize: 16, cursor: "pointer", transition: "all 0.18s",
                  border: selected === p && !custom ? "2px solid var(--primary)" : "1.5px solid var(--line)",
                  background: selected === p && !custom ? "var(--green-soft)" : "var(--surface-2)",
                  color: selected === p && !custom ? "var(--primary)" : "var(--ink)",
                  boxShadow: selected === p && !custom ? "0 4px 12px oklch(0.74 0.16 158 / 0.2)" : "none",
                }}>
                {p.toLocaleString()}
              </button>
            ))}
          </div>

          {/* Custom amount */}
          <div style={{ position: "relative", marginBottom: 28 }}>
            <span style={{
              position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
              fontWeight: 700, color: "var(--ink-soft)", fontSize: 15,
            }}>PKR</span>
            <input
              type="number" min={100} placeholder="Custom amount"
              value={custom}
              onChange={e => { setCustom(e.target.value); setSelected(null); }}
              style={{
                width: "100%", padding: "14px 16px 14px 60px", borderRadius: "var(--radius)",
                border: custom ? "2px solid var(--primary)" : "1.5px solid var(--line)",
                background: "var(--surface-2)", color: "var(--ink)", fontSize: 15.5, outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={e => { e.target.style.borderColor = "var(--primary)"; }}
              onBlur={e => { if (!custom) e.target.style.borderColor = "var(--line)"; }}
            />
          </div>

          {error && (
            <p style={{ color: "var(--coral)", fontSize: 14, marginBottom: 16, fontWeight: 600 }}>{error}</p>
          )}

          <button
            onClick={handleDonate}
            disabled={loading || !amount}
            className="btn btn-primary btn-lg"
            style={{ width: "100%", opacity: loading ? 0.7 : 1, transition: "opacity 0.2s" }}
          >
            {loading ? "Redirecting to Stripe…" : `Donate ${amount ? `PKR ${amount.toLocaleString()}` : ""}`}
            {!loading && <I.ArrowRight size={19} />}
          </button>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 18, color: "var(--ink-faint)", fontSize: 13.5 }}>
            <I.Bolt size={15} />
            Secured by Stripe · No card data touches our servers
          </div>
        </div>

        {/* Impact section */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginTop: 32 }}>
          {[
            { amount: "PKR 500", label: "Covers server costs for a day" },
            { amount: "PKR 1,000", label: "Funds new PSL sign training data" },
            { amount: "PKR 5,000", label: "Supports a month of development" },
          ].map(({ amount, label }) => (
            <div key={amount} style={{
              padding: "18px 14px", borderRadius: "var(--radius)",
              background: "var(--surface)", border: "1px solid var(--line)",
              textAlign: "center",
            }}>
              <p style={{ fontWeight: 700, color: "var(--primary)", marginBottom: 6, fontFamily: "var(--font-display)" }}>{amount}</p>
              <p style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.5 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      <LsFooter />
    </div>
  );
}
