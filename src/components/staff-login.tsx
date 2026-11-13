"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function StaffLogin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: data.get("email"), password: data.get("password") }),
      });
      const body = await response.json();
      if (!response.ok) {
        setError(body.message || "Unable to sign in to the demo workspace.");
        return;
      }
      router.replace("/staff");
      router.refresh();
    } catch {
      setError("The sign-in service is unavailable. Please try again shortly.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="ops-login-shell">
      <Link className="brand" href="/"><span className="mini-box">□</span><span>Siswa <strong>Pos</strong></span></Link>
      <section className="ops-login-layout">
        <div className="ops-login-copy">
          <p className="eyebrow"><span /> Staff &amp; admin workspace</p>
          <h1>Run a more<br /><em>traceable desk.</em></h1>
          <p>Use a seeded fictional account to explore parcel intake, status management and QR-verified collection.</p>
          <div className="ops-login-points"><span><i>01</i> Register every arrival</span><span><i>02</i> Issue time-limited claims</span><span><i>03</i> Keep the handover record</span></div>
        </div>
        <div className="ops-login-card">
          <div className="login-card-icon">→</div>
          <p className="eyebrow"><span /> Secure demo sign-in</p>
          <h2>Welcome back.</h2>
          <p className="login-card-lede">This is a private academic prototype. No institutional account or real personal data is used.</p>
          <form onSubmit={signIn}>
            <label>Email<input name="email" type="email" placeholder="staff@siswapos.test" autoComplete="email" required /></label>
            <label>Password<input name="password" type="password" autoComplete="current-password" required /></label>
            {error && <p className="form-error">{error}</p>}
            <button type="submit" disabled={submitting}>{submitting ? "Signing in…" : <>Enter workspace <span>→</span></>}</button>
          </form>
          <p className="login-note">Demo accounts: <code>admin@siswapos.test</code> or <code>staff@siswapos.test</code>. Passwords are local runtime secrets and are never committed.</p>
        </div>
      </section>
      <p className="ops-login-footer">Academic prototype · Demo data only · Not an official UMT or Pos Siswa service</p>
    </main>
  );
}
