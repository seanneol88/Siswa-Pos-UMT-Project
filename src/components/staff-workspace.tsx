"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import type { SessionUser } from "@/lib/auth";
import type { StaffParcelSummary } from "@/lib/staff-parcels";

const emptyParcel = { trackingNo: "", courier: "", matricNo: "", studentName: "", college: "", conditionNote: "" };

type StaffWorkspaceProps = {
  initialUser: SessionUser | null;
  initialParcels: StaffParcelSummary[];
};

export function StaffWorkspace({ initialUser, initialParcels }: StaffWorkspaceProps) {
  const [user, setUser] = useState(initialUser);
  const [parcels, setParcels] = useState(initialParcels);
  const [loginError, setLoginError] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [parcelForm, setParcelForm] = useState(emptyParcel);

  async function loadParcels() {
    const response = await fetch("/api/staff/parcels");
    if (response.ok) setParcels((await response.json()).parcels);
  }

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginError("");
    const data = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: data.get("email"), password: data.get("password") }) });
    const body = await response.json();
    if (!response.ok) { setLoginError(body.message || "Unable to sign in."); return; }
    setUser(body.user);
    await loadParcels();
  }

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setParcels([]);
    setShowRegister(false);
  }

  async function registerParcel(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormMessage("");
    const response = await fetch("/api/staff/parcels", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(parcelForm) });
    const body = await response.json();
    if (!response.ok) { setFormMessage(body.message || "Unable to register the parcel."); return; }
    setParcelForm(emptyParcel);
    setFormMessage(`Registered ${body.parcel.trackingNo} as Processing.`);
    await loadParcels();
  }

  if (!user) {
    return <main className="staff-login-shell"><Link className="brand" href="/"><span className="mini-box">□</span><span>Siswa <strong>Pos</strong></span></Link><section className="staff-login-card"><p className="eyebrow"><span /> Staff workspace</p><h1>Sign in to the demo.</h1><p>Fictional staff accounts are created locally during the seed step. No institutional account is used.</p><form onSubmit={signIn}><label>Email<input name="email" type="email" placeholder="staff@siswapos.test" required /></label><label>Password<input name="password" type="password" autoComplete="current-password" required /></label>{loginError && <p className="form-error">{loginError}</p>}<button type="submit">Sign in <span>→</span></button></form><p className="login-note">Demo account emails: <code>admin@siswapos.test</code> or <code>staff@siswapos.test</code>. Passwords are set locally and never committed.</p></section></main>;
  }

  return (
    <main className="staff-shell">
      <aside className="staff-side"><Link className="brand" href="/"><span className="mini-box">□</span><span>Siswa <strong>Pos</strong></span></Link><div className="staff-user"><span>{user.displayName.slice(0, 2).toUpperCase()}</span><div><strong>{user.displayName}</strong><small>{user.role.toLowerCase()} · demo environment</small></div></div><nav aria-label="Staff navigation"><a className="active" href="#overview">Overview</a><a href="#parcels">Parcels</a><a href="#collections">Collections</a><a href="#reports">Reports</a></nav><button className="sign-out" onClick={signOut}>Sign out</button><p className="side-note">Fictional data only. Do not use this prototype for real parcel operations.</p></aside>
      <section className="staff-content" id="overview"><header className="staff-header"><div><p className="eyebrow"><span /> Staff operations</p><h1>Parcel intake workspace.</h1></div><button className="register-button" onClick={() => setShowRegister((value) => !value)}>{showRegister ? "Close form" : "+ Register parcel"}</button></header>
        <div className="metric-grid"><article><span>Registered records</span><strong>{parcels.length}</strong><small>Fictional demo records</small></article><article><span>Ready to collect</span><strong>{parcels.filter((parcel) => parcel.status === "READY").length}</strong><small>QR claim is next milestone</small></article><article><span>Processing</span><strong>{parcels.filter((parcel) => parcel.status === "PROCESSING").length}</strong><small>Initial intake workflow</small></article><article><span>Access role</span><strong>{user.role}</strong><small>Session expires after 12 hours</small></article></div>
        {showRegister && <section className="register-panel"><div><h2>Register a fictional parcel</h2><p>Creates a parcel, a recipient record and an audit event in the demo database.</p></div><form className="register-form" onSubmit={registerParcel}>{Object.entries({ trackingNo: "Tracking number", courier: "Courier", matricNo: "Student matric number", studentName: "Student display name", college: "College (optional)", conditionNote: "Condition / exception note (optional)" }).map(([key, label]) => <label key={key}>{label}<input value={parcelForm[key as keyof typeof parcelForm]} onChange={(event) => setParcelForm({ ...parcelForm, [key]: event.target.value })} required={!key.includes("optional")} /></label>)}<button type="submit">Register parcel</button></form>{formMessage && <p className={formMessage.startsWith("Registered") ? "form-success" : "form-error"}>{formMessage}</p>}</section>}
        <section className="parcel-table-section" id="parcels"><div className="table-title"><div><h2>Recent parcels</h2><p>Visible only after a valid demo staff session is established.</p></div><button className="plain-button" onClick={() => void loadParcels()}>Refresh</button></div><div className="parcel-table" role="table" aria-label="Recent fictional parcels"><div className="table-row table-head" role="row"><span>Tracking number</span><span>Recipient</span><span>Courier</span><span>Status</span><span>Received</span></div>{parcels.map((parcel) => <div className="table-row" role="row" key={parcel.id}><strong>{parcel.trackingNo}</strong><span>{parcel.student} · •••{parcel.matricSuffix}</span><span>{parcel.courier}</span><span className={`status-tag ${parcel.status.toLowerCase()}`}>{parcel.status}</span><span>{new Intl.DateTimeFormat("en-MY", { dateStyle: "medium", timeStyle: "short" }).format(new Date(parcel.receivedAt))}</span></div>)}{parcels.length === 0 && <p className="empty-table">No demo parcels yet. Seed the database or register a fictional parcel.</p>}</div></section>
      </section>
    </main>
  );
}
