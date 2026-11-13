import Link from "next/link";

const workflow = [
  {
    number: "01",
    title: "Receive with context",
    description: "Record the tracking number, recipient, courier and parcel condition when it arrives.",
    icon: "scan",
  },
  {
    number: "02",
    title: "Give students clarity",
    description: "A limited tracking and matric-suffix check shows whether a parcel is ready.",
    icon: "bell",
  },
  {
    number: "03",
    title: "Close every handover",
    description: "A short-lived QR claim and staff record make each collection accountable.",
    icon: "check",
  },
];

function ParcelMark() {
  return (
    <svg aria-hidden="true" className="parcel-mark" viewBox="0 0 56 56" fill="none">
      <path d="M10 19.3 28 9l18 10.3v17.4L28 47 10 36.7V19.3Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d="m10.5 19.5 17.4 10 17.6-10M28 29.5V47" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d="m19 14.1 17.8 10.2" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function WorkflowIcon({ type }: { type: string }) {
  if (type === "scan") {
    return <svg viewBox="0 0 28 28" fill="none" aria-hidden="true"><path d="M5 10V6.8C5 5.8 5.8 5 6.8 5H10M18 5h3.2c1 0 1.8.8 1.8 1.8V10M23 18v3.2c0 1-.8 1.8-1.8 1.8H18M10 23H6.8C5.8 23 5 22.2 5 21.2V18M9 11v6M12 10v8M15 11v6M18 10v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
  }
  if (type === "bell") {
    return <svg viewBox="0 0 28 28" fill="none" aria-hidden="true"><path d="M7.5 18.5h13l-1.6-2.2v-4.5a4.9 4.9 0 0 0-9.8 0v4.5l-1.6 2.2ZM12 21a2.3 2.3 0 0 0 4 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  }
  return <svg viewBox="0 0 28 28" fill="none" aria-hidden="true"><circle cx="14" cy="14" r="9" stroke="currentColor" strokeWidth="1.8" /><path d="m10 14.1 2.6 2.6 5.5-5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function TinyArrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function Home() {
  return (
    <main className="landing-page">
      <section className="hero-shell">
        <nav className="site-nav" aria-label="Main navigation">
          <Link className="brand" href="/" aria-label="Siswa Pos home">
            <span className="brand-icon"><ParcelMark /></span>
            <span>Siswa <strong>Pos</strong></span>
          </Link>
          <div className="nav-links">
            <a href="#workflow">Workflow</a>
            <a href="#engineering">Engineering</a>
            <Link href="/staff">Staff workspace</Link>
            <Link className="nav-cta" href="/student">Check a parcel <span>→</span></Link>
          </div>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow"><span /> Parcel operations, thoughtfully rebuilt</p>
            <h1>Every parcel,<br /><em>accounted for.</em></h1>
            <p className="hero-lede">
              Siswa Pos turns a busy parcel desk into one visible flow — receive, update, verify and hand over with confidence.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/student">Check demo parcel <span>→</span></Link>
              <a className="button button-quiet" href="#workflow">See how it works <span>↓</span></a>
            </div>
            <div className="hero-assurances" aria-label="Prototype attributes">
              <span><i>✓</i> Student-first status check</span>
              <span><i>✓</i> QR-verified handover</span>
            </div>
            <p className="academic-note"><span>✦</span> Academic prototype · fictional data only · not an official UMT service</p>
          </div>

          <div className="operations-console" aria-label="Example Siswa Pos operations dashboard">
            <div className="console-topbar">
              <div><span className="console-kicker">Siswa Pos / operations</span><strong>Parcel desk overview</strong></div>
              <span className="console-avatar">SE</span>
            </div>
            <div className="console-body">
              <div className="console-main">
                <div className="console-heading">
                  <div><p>Wednesday, 13 Nov</p><h2>Your desk is <em>on track.</em></h2></div>
                  <span className="desk-status"><i /> Live demo</span>
                </div>
                <div className="metric-row">
                  <article><span>Received today</span><strong>24</strong><small>↑ 12% from yesterday</small></article>
                  <article><span>Ready to collect</span><strong>18</strong><small className="ready-copy">8 claimed today</small></article>
                </div>
                <article className="ready-parcel">
                  <div className="ready-parcel-icon"><ParcelMark /></div>
                  <div className="ready-parcel-copy"><p>Next collection</p><h3>SPX-2026-0001</h3><span>Ready for collection · Locker B-04</span></div>
                  <div className="claim-badge"><span>Claim</span><strong>QR</strong></div>
                </article>
                <div className="collection-list">
                  <div className="list-label"><span>Recent activity</span><button type="button">View all <TinyArrow /></button></div>
                  <div className="activity-row"><span className="activity-dot mint" /><p><strong>Parcel received</strong><small>J&amp;T Express · 2 mins ago</small></p><code>JT89201</code></div>
                  <div className="activity-row"><span className="activity-dot leaf" /><p><strong>Collection verified</strong><small>QR claim confirmed · 9 mins ago</small></p><code>SPX-0008</code></div>
                </div>
              </div>
              <aside className="console-side">
                <p className="side-label">Today&apos;s flow</p>
                <div className="flow-visual" aria-hidden="true">
                  <span className="flow-line" />
                  <div><i className="flow-icon receive">↓</i><p><strong>24</strong> received</p></div>
                  <div><i className="flow-icon ready">✓</i><p><strong>18</strong> ready</p></div>
                  <div><i className="flow-icon claim">↗</i><p><strong>08</strong> claimed</p></div>
                </div>
                <div className="side-divider" />
                <p className="side-label">Collection rate</p>
                <div className="collection-rate"><strong>68%</strong><span><i /><i /><i /><i className="muted" /></span><small>Up 8% this week</small></div>
                <div className="security-note"><span>✦</span><p><strong>Traceable by design</strong>Each handover is tied to a staff action.</p></div>
              </aside>
            </div>
            <div className="console-caption"><span><i /> Secure staff workflow</span><span>Demo workspace · Fictional records</span></div>
          </div>
        </div>

        <div className="hero-orbit orbit-one" />
        <div className="hero-orbit orbit-two" />
        <div className="hero-grid-lines" aria-hidden="true" />
      </section>

      <section className="proof-strip" aria-label="Core prototype capabilities">
        <p>Designed to show</p>
        <div><span>Full-stack workflows</span><b>✦</b><span>Secure QR claims</span><b>✦</b><span>Operational audit trail</span><b>✦</b><span>DevOps delivery</span></div>
      </section>

      <section className="section workflow-section" id="workflow">
        <div className="section-heading split-heading">
          <div><p className="eyebrow"><span /> From intake to handover</p><h2>One calm flow for<br />a busy parcel desk.</h2></div>
          <p>A small number of meaningful actions replaces a disconnected, paper-heavy collection process.</p>
        </div>
        <div className="workflow-list">
          {workflow.map((item) => (
            <article className="workflow-card" key={item.number}>
              <div className="workflow-card-top"><span className="workflow-number">{item.number}</span><span className="workflow-icon"><WorkflowIcon type={item.icon} /></span></div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span className="workflow-line" />
            </article>
          ))}
        </div>
      </section>

      <section className="section prototype-section" id="engineering">
        <div className="architecture-card">
          <div className="architecture-copy">
            <p className="eyebrow light"><span /> Built beyond the interface</p>
            <h2>A working product,<br />delivered like one.</h2>
            <p>
              This portfolio project joins a Next.js application with a real PostgreSQL data layer and a deliberately documented deployment path.
            </p>
            <a className="architecture-link" href="https://github.com/seanneol88/Siswa-Pos-UMT-Project" target="_blank" rel="noreferrer">Explore the project source <TinyArrow /></a>
          </div>
          <div className="architecture-map" aria-label="Technology delivery path">
            <div className="map-node app"><small>Application</small><strong>Next.js <span>+</span> TypeScript</strong></div>
            <div className="map-node data"><small>Data layer</small><strong>PostgreSQL <span>+</span> Prisma</strong></div>
            <div className="map-node delivery"><small>Delivery</small><strong>Docker <span>→</span> Kubernetes</strong></div>
            <div className="map-node edge"><small>Edge &amp; operations</small><strong>Cloudflare <span>+</span> Uptime Kuma</strong></div>
            <span className="map-connector one" aria-hidden="true" /><span className="map-connector two" aria-hidden="true" /><span className="map-connector three" aria-hidden="true" />
          </div>
        </div>
      </section>

      <section className="section visit-section">
        <p className="eyebrow"><span /> See the student view</p>
        <h2>A clearer answer<br />than “please wait.”</h2>
        <p>Try the limited, privacy-aware parcel status lookup using fictional demo data.</p>
        <Link className="button button-primary" href="/student">Open demo parcel check <span>→</span></Link>
      </section>

      <footer className="site-footer">
        <Link className="brand" href="/"><span className="brand-icon"><ParcelMark /></span><span>Siswa <strong>Pos</strong></span></Link>
        <p>Academic prototype · Demo data only · <a href="https://github.com/seanneol88" target="_blank" rel="noreferrer">Built by Seanneol Ebneazer</a></p>
      </footer>
    </main>
  );
}
