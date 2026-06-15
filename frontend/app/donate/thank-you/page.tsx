"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Logo } from "../../components/ls/Components";
import * as I from "../../components/ls/Icons";

function ThankyouContent() {
  const params = useSearchParams();
  const amount = params.get("amount");

  return (
    <div style={{ textAlign: "center", maxWidth: 480, margin: "0 auto", padding: "80px 24px" }}>
      <div style={{
        width: 80, height: 80, borderRadius: 999, margin: "0 auto 28px",
        background: "linear-gradient(135deg, var(--green), var(--green-deep))",
        display: "grid", placeItems: "center",
        boxShadow: "0 12px 32px oklch(0.74 0.16 158 / 0.4)",
      }}>
        <I.Check size={38} style={{ color: 'white' }} />
      </div>

      <h1 style={{ fontSize: 40, marginBottom: 12, fontFamily: "var(--font-display)" }}>Thank you!</h1>
      {amount && (
        <p style={{ fontSize: 20, color: "var(--primary)", fontWeight: 700, marginBottom: 16, fontFamily: "var(--font-display)" }}>
          PKR {parseInt(amount).toLocaleString()} received
        </p>
      )}
      <p style={{ color: "var(--ink-soft)", fontSize: 16, lineHeight: 1.7, marginBottom: 40 }}>
        Your donation helps us grow LinguaSign and make Pakistan Sign Language accessible to everyone. We genuinely appreciate your support.
      </p>

      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <Link href="/sign" className="btn btn-primary btn-lg" style={{ textDecoration: "none" }}>
          Try the Detector <I.ArrowRight size={18} />
        </Link>
        <Link href="/" className="btn btn-ghost btn-lg" style={{ textDecoration: "none" }}>
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <div className="ls-scope" style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <div style={{ padding: "20px 32px" }}><Logo size={30} /></div>
      <Suspense fallback={null}>
        <ThankyouContent />
      </Suspense>
    </div>
  );
}
