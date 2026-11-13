"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

const DEMO_TRACKING = "SPX-2026-0001";

export default function StudentParcelPage() {
  const [tracking, setTracking] = useState("");
  const [searched, setSearched] = useState(false);
  const [found, setFound] = useState(false);

  function checkParcel(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearched(true);
    setFound(tracking.trim().toUpperCase() === DEMO_TRACKING);
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
        <p className="lookup-lede">Enter a tracking number to view its limited collection status.</p>

        <form className="lookup-form" onSubmit={checkParcel}>
          <label htmlFor="tracking">Tracking number</label>
          <div className="lookup-input-row">
            <input
              id="tracking"
              name="tracking"
              value={tracking}
              onChange={(event) => setTracking(event.target.value)}
              placeholder="e.g. SPX-2026-0001"
              autoComplete="off"
            />
            <button type="submit">Check status <span>→</span></button>
          </div>
          <p className="demo-hint">Try the fictional demo number: <button type="button" onClick={() => setTracking(DEMO_TRACKING)}>{DEMO_TRACKING}</button></p>
        </form>

        {searched && found && (
          <article className="result-card success-result" aria-live="polite">
            <div className="result-head"><span className="success-icon">✓</span><div><p>Ready for collection</p><h2>{DEMO_TRACKING}</h2></div><span className="status-pill">Ready</span></div>
            <div className="result-details">
              <div><span>Collection point</span><strong>Demo collection counter</strong></div>
              <div><span>Claim QR</span><strong>Generate at collection</strong></div>
              <div><span>Claim validity</span><strong>24 hours after issue</strong></div>
            </div>
            <p className="result-note">This is fictional prototype data. A production system would require approved institutional processes and authenticated student access.</p>
          </article>
        )}

        {searched && !found && (
          <article className="result-card missing-result" aria-live="polite">
            <span className="missing-icon">?</span>
            <div><h2>We could not find that demo parcel.</h2><p>For this prototype, use <strong>{DEMO_TRACKING}</strong>. The production version will validate authorised student access before showing a limited status.</p></div>
          </article>
        )}
      </section>
      <footer className="portal-footer">Academic prototype · No real student or parcel data is used</footer>
    </main>
  );
}
