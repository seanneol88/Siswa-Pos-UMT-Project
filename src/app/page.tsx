import Link from "next/link";

function ParcelMark() {
  return (
    <svg aria-hidden="true" className="parcel-mark" viewBox="0 0 56 56" fill="none">
      <path d="M10 19.3 28 9l18 10.3v17.4L28 47 10 36.7V19.3Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d="m10.5 19.5 17.4 10 17.6-10M28 29.5V47" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d="m19 14.1 17.8 10.2" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
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
              <Link className="button button-quiet" href="/staff">Open staff workspace <span>↗</span></Link>
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

      <footer className="site-footer">
        <Link className="brand" href="/"><span className="brand-icon"><ParcelMark /></span><span>Siswa <strong>Pos</strong></span></Link>
        <p>Academic prototype · Demo data only · <a href="https://github.com/seanneol88" target="_blank" rel="noreferrer">Built by Seanneol Ebneazer</a></p>
      </footer>
    </main>
  );
}
