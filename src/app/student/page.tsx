"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type LookupResult = {
  trackingNo: string;
  status: "PROCESSING" | "READY" | "COLLECTED" | "EXCEPTION" | "UNCLAIMED";
  receivedAt: string;
  claimAvailable: boolean;
};

const statusCopy: Record<LookupResult["status"], string> = {
  PROCESSING: "Processing",
  READY: "Ready for collection",
  COLLECTED: "Collected",
  EXCEPTION: "Needs staff follow-up",
  UNCLAIMED: "Awaiting follow-up",
};

export default function StudentParcelPage() {
  const [tracking, setTracking] = useState("");
  const [matricSuffix, setMatricSuffix] = useState("");
  const [result, setResult] = useState<LookupResult | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function checkParcel(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setResult(null);
    setMessage("");

    try {
      const response = await fetch("/api/student/status", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ trackingNo: tracking, matricSuffix }),
      });
      const body = await response.json();
      if (!response.ok || !body.found) {
        setMessage(body.message || "We could not match those details to a demo parcel.");
        return;
      }
      setResult(body.parcel);
    } catch {
      setMessage("The status service is unavailable. Please try again shortly.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="portal-shell">
      <header className="portal-nav">
        <Link className="brand" href="/"><span className="mini-box">□</span><span>Siswa <strong>Pos</strong></span></Link>
        <span className="demo-chip">Demo environment</span>
      </header>

      <section className="lookup-stage">
        <p className="eyebrow"><span /> Student parcel check</p>
        <h1>Is your parcel ready<br />for collection?</h1>
        <p className="lookup-lede">Use a tracking number and the final four digits of a matric number to see a limited parcel status.</p>

        <form className="lookup-form" onSubmit={checkParcel}>
          <div className="field-grid">
            <label htmlFor="tracking">Tracking number
              <input id="tracking" name="tracking" value={tracking} onChange={(event) => setTracking(event.target.value)} placeholder="e.g. SPX-2026-0001" autoComplete="off" required />
            </label>
            <label htmlFor="matricSuffix">Last 4 matric digits
              <input id="matricSuffix" name="matricSuffix" value={matricSuffix} onChange={(event) => setMatricSuffix(event.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="e.g. 2468" inputMode="numeric" autoComplete="off" required />
            </label>
          </div>
          <button className="lookup-submit" type="submit" disabled={loading}>{loading ? "Checking…" : <>Check status <span>→</span></>}</button>
          <p className="demo-hint">Fictional demo: <button type="button" onClick={() => { setTracking("SPX-2026-0001"); setMatricSuffix("2468"); }}>SPX-2026-0001 + 2468</button></p>
        </form>

        {result && (
          <article className="result-card success-result" aria-live="polite">
            <div className="result-head"><span className="success-icon">✓</span><div><p>Parcel status</p><h2>{result.trackingNo}</h2></div><span className={`status-pill ${result.status.toLowerCase()}`}>{statusCopy[result.status]}</span></div>
            <div className="result-details">
              <div><span>Status</span><strong>{statusCopy[result.status]}</strong></div>
              <div><span>Recorded</span><strong>{new Intl.DateTimeFormat("en-MY", { dateStyle: "medium", timeStyle: "short" }).format(new Date(result.receivedAt))}</strong></div>
              <div><span>Claim QR</span><strong>{result.claimAvailable ? "Available after sign-in step" : "Available once ready"}</strong></div>
            </div>
            <p className="result-note">Only limited status is shown. This academic prototype uses fictional data and is not an official parcel service.</p>
          </article>
        )}

        {message && (
          <article className="result-card missing-result" aria-live="polite"><span className="missing-icon">?</span><div><h2>We could not verify that parcel.</h2><p>{message}</p></div></article>
        )}
      </section>
      <footer className="portal-footer">Academic prototype · No real student or parcel data is used</footer>
    </main>
  );
}
