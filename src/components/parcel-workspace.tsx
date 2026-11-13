"use client";

import { FormEvent, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import type { ParcelStatus } from "@/generated/prisma/client";
import type { StaffParcelRecord } from "@/lib/staff-data";

const blankParcel = { trackingNo: "", courier: "", matricNo: "", studentName: "", college: "", conditionNote: "" };
const statuses: ParcelStatus[] = ["PROCESSING", "READY", "EXCEPTION", "UNCLAIMED", "COLLECTED"];
const statusLabels: Record<ParcelStatus, string> = { PROCESSING: "Processing", READY: "Ready for collection", COLLECTED: "Collected", EXCEPTION: "Needs staff follow-up", UNCLAIMED: "Awaiting follow-up" };

type ClaimResult = { claimCode: string; expiresAt: string; trackingNo: string };

export function ParcelWorkspace({ initialParcels }: { initialParcels: StaffParcelRecord[] }) {
  const [parcels, setParcels] = useState(initialParcels);
  const [selectedId, setSelectedId] = useState(initialParcels[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"ALL" | ParcelStatus>("ALL");
  const [showRegister, setShowRegister] = useState(false);
  const [parcelForm, setParcelForm] = useState(blankParcel);
  const [editStatus, setEditStatus] = useState<ParcelStatus>(initialParcels[0]?.status ?? "PROCESSING");
  const [staffNote, setStaffNote] = useState(initialParcels[0]?.staffNote ?? "");
  const [conditionNote, setConditionNote] = useState(initialParcels[0]?.conditionNote ?? "");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const [claim, setClaim] = useState<ClaimResult | null>(null);

  const visibleParcels = useMemo(() => parcels.filter((parcel) => {
    const term = query.trim().toLowerCase();
    const matchesSearch = !term || [parcel.trackingNo, parcel.student.name, parcel.student.matricNo, parcel.courier].join(" ").toLowerCase().includes(term);
    return matchesSearch && (filter === "ALL" || parcel.status === filter);
  }), [filter, parcels, query]);
  const selected = parcels.find((parcel) => parcel.id === selectedId) ?? visibleParcels[0] ?? null;

  function selectParcel(parcel: StaffParcelRecord) {
    setSelectedId(parcel.id);
    setEditStatus(parcel.status);
    setStaffNote(parcel.staffNote ?? "");
    setConditionNote(parcel.conditionNote ?? "");
    setClaim(null);
    setNotice("");
  }

  async function refreshParcels(selectId = selectedId) {
    const response = await fetch("/api/staff/parcels");
    if (!response.ok) return;
    const next = (await response.json()).parcels as StaffParcelRecord[];
    setParcels(next);
    if (selectId && next.some((parcel) => parcel.id === selectId)) {
      const updated = next.find((parcel) => parcel.id === selectId)!;
      setSelectedId(updated.id);
      setEditStatus(updated.status);
      setStaffNote(updated.staffNote ?? "");
      setConditionNote(updated.conditionNote ?? "");
    } else if (next[0]) {
      selectParcel(next[0]);
    }
  }

  async function registerParcel(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");
    setSaving(true);
    try {
      const response = await fetch("/api/staff/parcels", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(parcelForm) });
      const body = await response.json();
      if (!response.ok) { setNotice(body.message || "Unable to register the parcel."); return; }
      setParcelForm(blankParcel);
      setShowRegister(false);
      setNotice(`${body.parcel.trackingNo} is now registered as Processing.`);
      await refreshParcels(body.parcel.id);
    } catch { setNotice("The parcel service is unavailable. Please try again."); } finally { setSaving(false); }
  }

  async function saveParcel() {
    if (!selected) return;
    setNotice("");
    setSaving(true);
    try {
      const response = await fetch(`/api/staff/parcels/${selected.id}`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ status: editStatus, staffNote, conditionNote }) });
      const body = await response.json();
      if (!response.ok) { setNotice(body.message || "Unable to save the parcel update."); return; }
      setNotice(`${body.parcel.trackingNo} has been updated.`);
      await refreshParcels(selected.id);
    } catch { setNotice("The parcel service is unavailable. Please try again."); } finally { setSaving(false); }
  }

  async function issueClaim() {
    if (!selected) return;
    setNotice("");
    setSaving(true);
    try {
      const response = await fetch(`/api/staff/parcels/${selected.id}/claim`, { method: "POST" });
      const body = await response.json();
      if (!response.ok) { setNotice(body.message || "Unable to issue the claim QR."); return; }
      setClaim(body);
      setNotice("A new 24-hour claim QR has been issued. Any earlier unused QR is no longer valid.");
      await refreshParcels(selected.id);
    } catch { setNotice("The claim service is unavailable. Please try again."); } finally { setSaving(false); }
  }

  return <>
    <header className="ops-page-heading ops-parcels-heading"><div><p className="eyebrow"><span /> Parcel management</p><h1>Keep every record<br /><em>moving clearly.</em></h1></div><button className="ops-primary-button" onClick={() => { setShowRegister((value) => !value); setNotice(""); }}>{showRegister ? "Close intake form" : <><span>＋</span> Register parcel</>}</button></header>

    {showRegister && <section className="ops-register-card"><div className="register-card-copy"><p className="eyebrow"><span /> New arrival</p><h2>Register a fictional parcel.</h2><p>Record the parcel, its recipient and any condition note in one deliberate intake step.</p><div><span>1</span> Parcel and courier <span>2</span> Recipient <span>3</span> Audit record</div></div><form onSubmit={registerParcel} className="ops-register-form">
      <label>Tracking number<input value={parcelForm.trackingNo} onChange={(event) => setParcelForm({ ...parcelForm, trackingNo: event.target.value })} placeholder="e.g. SPX-2026-0010" required /></label>
      <label>Courier<input value={parcelForm.courier} onChange={(event) => setParcelForm({ ...parcelForm, courier: event.target.value })} placeholder="e.g. Demo Express" required /></label>
      <label>Student matric number<input value={parcelForm.matricNo} onChange={(event) => setParcelForm({ ...parcelForm, matricNo: event.target.value })} placeholder="Fictional matric number" required /></label>
      <label>Student display name<input value={parcelForm.studentName} onChange={(event) => setParcelForm({ ...parcelForm, studentName: event.target.value })} placeholder="Fictional recipient name" required /></label>
      <label>College <small>optional</small><input value={parcelForm.college} onChange={(event) => setParcelForm({ ...parcelForm, college: event.target.value })} placeholder="Fictional college" /></label>
      <label>Condition note <small>optional</small><input value={parcelForm.conditionNote} onChange={(event) => setParcelForm({ ...parcelForm, conditionNote: event.target.value })} placeholder="e.g. Outer box marked fragile" /></label>
      <button className="ops-primary-button" disabled={saving} type="submit">{saving ? "Saving…" : "Save parcel record →"}</button>
    </form></section>}

    <section className="ops-parcel-tools"><label className="ops-search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tracking, recipient, matric or courier" /></label><div className="ops-filter-group">{(["ALL", "PROCESSING", "READY", "EXCEPTION", "COLLECTED"] as const).map((value) => <button key={value} className={filter === value ? "active" : ""} onClick={() => setFilter(value)}>{value === "ALL" ? "All" : statusLabels[value]}</button>)}</div></section>

    {notice && <p className={notice.includes("unable") || notice.includes("Only") || notice.includes("cannot") || notice.includes("unavailable") ? "ops-notice error" : "ops-notice"}>{notice}</p>}

    <section className="ops-parcel-layout">
      <article className="ops-parcel-list-card"><div className="ops-list-head"><div><h2>Parcel records</h2><p>{visibleParcels.length} shown · 100 latest max</p></div><button onClick={() => void refreshParcels()}>Refresh ↻</button></div><div className="ops-parcel-list">{visibleParcels.map((parcel) => <button className={`ops-parcel-row ${selected?.id === parcel.id ? "selected" : ""}`} key={parcel.id} onClick={() => selectParcel(parcel)}><span className="parcel-row-mark">□</span><span className="parcel-row-main"><strong>{parcel.trackingNo}</strong><small>{parcel.student.name} · •••{parcel.student.matricSuffix}</small></span><span><i className={`ops-status ${parcel.status.toLowerCase()}`}>{statusLabels[parcel.status]}</i><small>{new Intl.DateTimeFormat("en-MY", { dateStyle: "medium" }).format(new Date(parcel.receivedAt))}</small></span></button>)}{visibleParcels.length === 0 && <p className="ops-empty-inline">No parcel records match this view.</p>}</div></article>
      <aside className="ops-parcel-detail">{selected ? <><div className="detail-topline"><span>Record detail</span><i className={`ops-status ${selected.status.toLowerCase()}`}>{statusLabels[selected.status]}</i></div><h2>{selected.trackingNo}</h2><p className="detail-recipient">{selected.student.name} <span>· •••{selected.student.matricSuffix}</span></p><div className="detail-meta"><div><span>Courier</span><strong>{selected.courier}</strong></div><div><span>Received</span><strong>{new Intl.DateTimeFormat("en-MY", { dateStyle: "medium", timeStyle: "short" }).format(new Date(selected.receivedAt))}</strong></div><div><span>Registered by</span><strong>{selected.registeredBy}</strong></div><div><span>Collection</span><strong>{selected.collection ? `Verified by ${selected.collection.collectedBy}` : "Not collected"}</strong></div></div>
        <div className="detail-editor"><label>Status<select value={editStatus} disabled={selected.status === "COLLECTED"} onChange={(event) => setEditStatus(event.target.value as ParcelStatus)}>{statuses.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</select></label><label>Staff note<textarea value={staffNote} onChange={(event) => setStaffNote(event.target.value)} placeholder="Add a short internal handover note" maxLength={500} /></label><label>Condition / exception note<textarea value={conditionNote} onChange={(event) => setConditionNote(event.target.value)} placeholder="Record a fictional condition or exception" maxLength={500} /></label><button className="ops-secondary-button" disabled={saving || selected.status === "COLLECTED"} onClick={() => void saveParcel()}>{saving ? "Saving…" : "Save record update"}</button></div>
        {selected.status === "READY" && !selected.collection && <div className="claim-panel"><div><span>24-hour QR claim</span><strong>{selected.latestClaim ? "Active claim exists" : "No active claim"}</strong><p>{selected.latestClaim ? `Expires ${new Intl.DateTimeFormat("en-MY", { dateStyle: "medium", timeStyle: "short" }).format(new Date(selected.latestClaim.expiresAt))}` : "Issue a QR claim only after the parcel is ready."}</p></div><button className="ops-claim-button" disabled={saving} onClick={() => void issueClaim()}>{selected.latestClaim ? "Regenerate QR" : "Issue QR claim"} <span>→</span></button></div>}
        {claim && <div className="claim-result"><div className="claim-qr"><QRCodeSVG value={claim.claimCode} size={132} bgColor="#ffffff" fgColor="#123d2e" level="M" includeMargin /></div><div><p className="eyebrow"><span /> Claim issued</p><h3>{claim.trackingNo}</h3><p>Show this QR only in the demo collection step. It expires {new Intl.DateTimeFormat("en-MY", { dateStyle: "medium", timeStyle: "short" }).format(new Date(claim.expiresAt))}.</p><code>{claim.claimCode}</code><button onClick={() => void navigator.clipboard?.writeText(claim.claimCode)}>Copy claim payload</button></div></div>}
      </> : <div className="ops-detail-empty"><span>□</span><h2>Select a parcel</h2><p>Choose a record from the list to update its status, add notes or issue its collection QR.</p></div>}</aside>
    </section>
  </>;
}
