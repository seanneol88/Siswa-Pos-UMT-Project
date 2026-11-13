"use client";

import { FormEvent, useState } from "react";

type VerificationResult = { trackingNo: string; student: string; matricSuffix: string; collectedAt: string };

export function CollectionWorkspace() {
  const [claimCode, setClaimCode] = useState("");
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [message, setMessage] = useState("");
  const [verifying, setVerifying] = useState(false);

  async function verifyCollection(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setResult(null);
    setVerifying(true);
    try {
      const response = await fetch("/api/staff/collections/verify", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ claimCode }) });
      const body = await response.json();
      if (!response.ok) { setMessage(body.message || "The collection claim could not be verified."); return; }
      setResult(body.parcel);
      setClaimCode("");
    } catch { setMessage("The collection service is unavailable. Please try again."); } finally { setVerifying(false); }
  }

  return <>
    <header className="ops-page-heading"><div><p className="eyebrow"><span /> Collection desk</p><h1>Verify the claim.<br /><em>Close the loop.</em></h1></div><div className="ops-heading-status"><span><i /> Staff-attributed verification</span><p>One claim, one collection record</p></div></header>
    <section className="ops-collection-layout">
      <article className="ops-scan-card"><div className="scan-illustration" aria-hidden="true"><div className="scan-corners"><i /><i /><i /><i /></div><div className="scan-qr"><span /><span /><span /><span /><span /><span /><span /><span /><span /></div><p>Ready to verify</p></div><p className="eyebrow"><span /> QR collection</p><h2>Scan or paste<br />a claim payload.</h2><p>Each generated claim is an opaque, time-limited QR payload. A successful verification records the responsible staff member and marks the parcel as collected.</p><div className="scan-rules"><span><i>1</i> Must be unexpired</span><span><i>2</i> Must be issued for a Ready parcel</span><span><i>3</i> Can only be used once</span></div></article>
      <article className="ops-verify-card"><div className="verify-card-heading"><span className="verify-icon">⌁</span><div><p className="eyebrow"><span /> Verify collection</p><h2>Collection check</h2></div></div><p className="verify-lede">Use a camera scanner that writes the payload here, or paste the generated demo QR payload manually.</p><form onSubmit={verifyCollection}><label>Claim QR payload<textarea value={claimCode} onChange={(event) => setClaimCode(event.target.value)} placeholder="Scan or paste the opaque claim payload" required minLength={16} /></label><button className="ops-primary-button" disabled={verifying} type="submit">{verifying ? "Verifying claim…" : "Verify and record collection →"}</button></form>{message && <p className="ops-notice error">{message}</p>}{result && <div className="verification-success"><span>✓</span><div><p>Collection recorded</p><h3>{result.trackingNo}</h3><strong>{result.student} · •••{result.matricSuffix}</strong><small>{new Intl.DateTimeFormat("en-MY", { dateStyle: "full", timeStyle: "short" }).format(new Date(result.collectedAt))}</small></div></div>}<div className="verify-note"><span>✦</span><p><strong>Audit event created</strong>Successful collection writes an immutable event against the fictional parcel record.</p></div></article>
    </section>
  </>;
}
