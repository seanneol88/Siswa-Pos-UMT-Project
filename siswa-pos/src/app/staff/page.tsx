import Link from "next/link";

const parcels = [
  { tracking: "SPX-2026-0001", recipient: "Demo student A", courier: "Demo Express", status: "Ready", received: "Today, 10:14" },
  { tracking: "SPX-2026-0002", recipient: "Demo student B", courier: "Demo Logistics", status: "Processing", received: "Today, 09:52" },
  { tracking: "SPX-2026-0003", recipient: "Demo student C", courier: "Demo Parcel", status: "Exception", received: "Yesterday, 16:08" },
];

export default function StaffDemoPage() {
  return (
    <main className="staff-shell">
      <aside className="staff-side">
        <Link className="brand" href="/"><span className="mini-box">□</span><span>Siswa <strong>Pos</strong></span></Link>
        <div className="staff-user"><span>SE</span><div><strong>Staff demo</strong><small>Training environment</small></div></div>
        <nav aria-label="Staff demo navigation"><a className="active" href="#overview">Overview</a><a href="#parcels">Parcels</a><a href="#collections">Collections</a><a href="#reports">Reports</a></nav>
        <p className="side-note">Demo UI only. Authentication, authorisation and database workflows are delivered in the next milestone.</p>
      </aside>
      <section className="staff-content" id="overview">
        <header className="staff-header"><div><p className="eyebrow"><span /> Staff operations</p><h1>Good morning, staff demo.</h1></div><button className="register-button">+ Register parcel</button></header>
        <div className="metric-grid">
          <article><span>Received today</span><strong>18</strong><small>+4 from yesterday</small></article>
          <article><span>Ready to collect</span><strong>11</strong><small>5 claims generated</small></article>
          <article><span>Collected today</span><strong>7</strong><small>QR-verified releases</small></article>
          <article><span>Need follow-up</span><strong>2</strong><small>Exception records</small></article>
        </div>
        <section className="parcel-table-section" id="parcels">
          <div className="table-title"><div><h2>Recent parcels</h2><p>Fictional records for interface development.</p></div><button className="plain-button">View all</button></div>
          <div className="parcel-table" role="table" aria-label="Demo parcels">
            <div className="table-row table-head" role="row"><span>Tracking number</span><span>Recipient</span><span>Courier</span><span>Status</span><span>Received</span></div>
            {parcels.map((parcel) => <div className="table-row" role="row" key={parcel.tracking}><strong>{parcel.tracking}</strong><span>{parcel.recipient}</span><span>{parcel.courier}</span><span className={`status-tag ${parcel.status.toLowerCase()}`}>{parcel.status}</span><span>{parcel.received}</span></div>)}
          </div>
        </section>
      </section>
    </main>
  );
}
