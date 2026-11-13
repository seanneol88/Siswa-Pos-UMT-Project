"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { SessionUser } from "@/lib/auth";

const navItems = [
  { href: "/staff", label: "Overview", icon: "grid" },
  { href: "/staff/parcels", label: "Parcels", icon: "parcel" },
  { href: "/staff/collections", label: "Collections", icon: "scan" },
  { href: "/staff/reports", label: "Reports", icon: "chart" },
];

function NavIcon({ type }: { type: string }) {
  if (type === "parcel") return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m4 8 8-4 8 4v8l-8 4-8-4V8Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /><path d="m4 8 8 4 8-4M12 12v8" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></svg>;
  if (type === "scan") return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 4H5.5A1.5 1.5 0 0 0 4 5.5V7m13-3h1.5A1.5 1.5 0 0 1 20 5.5V7M7 20H5.5A1.5 1.5 0 0 1 4 18.5V17m13 3h1.5a1.5 1.5 0 0 0 1.5-1.5V17M8 10v4m3-5v6m3-5v4m3-5v6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>;
  if (type === "chart") return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 19.5h16M6.5 17v-5m5 5V7m5 10v-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>;
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="4" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.7" /><rect x="14" y="4" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.7" /><rect x="4" y="14" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.7" /><rect x="14" y="14" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.7" /></svg>;
}

export function StaffAppShell({ user, children }: { user: SessionUser; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const initials = user.displayName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/staff");
    router.refresh();
  }

  return (
    <main className="ops-shell">
      <aside className="ops-sidebar">
        <Link className="brand ops-brand" href="/"><span className="mini-box">□</span><span>Siswa <strong>Pos</strong></span></Link>
        <div className="ops-workspace-label"><span /> Operations workspace</div>
        <nav className="ops-nav" aria-label="Staff workspace navigation">
          {navItems.map((item) => {
            const active = item.href === "/staff" ? pathname === item.href : pathname.startsWith(item.href);
            return <Link key={item.href} href={item.href} className={active ? "active" : ""}><NavIcon type={item.icon} /><span>{item.label}</span></Link>;
          })}
        </nav>
        <div className="ops-side-bottom">
          <div className="ops-side-note"><span>✦</span><p><strong>Demo environment</strong>Fictional records only. Do not use for real operations.</p></div>
          <button className="ops-sign-out" onClick={signOut}>Sign out <span>→</span></button>
        </div>
      </aside>
      <div className="ops-page">
        <header className="ops-topbar">
          <div className="ops-mobile-brand"><Link className="brand" href="/"><span className="mini-box">□</span><span>Siswa <strong>Pos</strong></span></Link></div>
          <div className="ops-topbar-right"><Link className="ops-student-link" href="/student">Student check <span>↗</span></Link><div className="ops-user"><span>{initials}</span><p><strong>{user.displayName}</strong><small>{user.role.toLowerCase()} access</small></p></div></div>
        </header>
        <section className="ops-content">{children}</section>
      </div>
    </main>
  );
}
