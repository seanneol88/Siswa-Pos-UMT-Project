import Link from "next/link";

const workflow = [
  {
    number: "01",
    title: "Register on arrival",
    description:
      "Staff record a tracking number, courier, recipient and parcel condition in one focused workflow.",
  },
  {
    number: "02",
    title: "Keep students informed",
    description:
      "Students check a limited processing or ready-for-collection status from a mobile-friendly page.",
  },
  {
    number: "03",
    title: "Verify collection",
    description:
      "A short-lived QR claim is verified at handover and the responsible staff member is recorded.",
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

export default function Home() {
  return (
    <main>
      <section className="hero-shell">
        <nav className="site-nav" aria-label="Main navigation">
          <Link className="brand" href="/" aria-label="Siswa Pos home">
            <span className="brand-icon"><ParcelMark /></span>
            <span>Siswa <strong>Pos</strong></span>
          </Link>
          <div className="nav-links">
            <a href="#how-it-works">How it works</a>
            <a href="#prototype">Prototype</a>
            <Link className="nav-cta" href="/student">Check a parcel</Link>
          </div>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow"><span /> A student parcel-management prototype</p>
            <h1>Parcel handovers,<br /><em>made accountable.</em></h1>
            <p className="hero-lede">
              Siswa Pos is a full-stack academic prototype designed around faster parcel intake,
              clear student status checks and paperless QR-verified collection.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/student">Check a demo parcel <span>→</span></Link>
              <a className="button button-quiet" href="#how-it-works">Explore the workflow</a>
            </div>
            <p className="academic-note"><span>✦</span> Academic prototype · fictional data only · not an official UMT service</p>
          </div>

          <div className="hero-card" aria-label="Example parcel collection status">
            <div className="card-topline"><span>Parcel claim</span><span className="live-dot">Ready</span></div>
            <div className="parcel-visual"><ParcelMark /></div>
            <p className="tracking-label">Tracking number</p>
            <p className="tracking-number">SPX-2026-0001</p>
            <div className="claim-grid">
              <div><span>Collection</span><strong>Today · 4:30 PM</strong></div>
              <div><span>Claim code</span><strong>Valid for 24 hrs</strong></div>
            </div>
            <div className="claim-footer"><span className="qr-placeholder" aria-hidden="true">▦</span><p>Show your claim QR to staff at collection.</p></div>
          </div>
        </div>
        <div className="hero-orbit orbit-one" />
        <div className="hero-orbit orbit-two" />
      </section>

      <section className="proof-strip" aria-label="Core prototype capabilities">
        <p>Built to demonstrate</p>
        <div><span>Full-stack workflows</span><span>•</span><span>Secure QR claims</span><span>•</span><span>Operational audit trail</span><span>•</span><span>DevOps delivery</span></div>
      </section>

      <section className="section workflow-section" id="how-it-works">
        <div className="section-heading">
          <p className="eyebrow"><span /> From arrival to collection</p>
          <h2>One clear flow.<br />Every handover traceable.</h2>
        </div>
        <div className="workflow-list">
          {workflow.map((item) => (
            <article className="workflow-card" key={item.number}>
              <span className="workflow-number">{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section prototype-section" id="prototype">
        <div className="architecture-card">
          <div>
            <p className="eyebrow light"><span /> Engineering focus</p>
            <h2>Full-stack application.<br />DevOps in the open.</h2>
            <p>
              The project will pair a Next.js and PostgreSQL application with containerised delivery,
              automated checks, Kubernetes deployment, Cloudflare Tunnel routing and health monitoring.
            </p>
          </div>
          <ul className="stack-list">
            <li><span>01</span> Next.js + TypeScript</li>
            <li><span>02</span> PostgreSQL + Prisma</li>
            <li><span>03</span> Docker + GitHub Actions</li>
            <li><span>04</span> Kubernetes + Cloudflare Tunnel</li>
            <li><span>05</span> Uptime Kuma + documented recovery</li>
          </ul>
        </div>
      </section>

      <section className="section visit-section">
        <p className="eyebrow"><span /> Start with a safe demo</p>
        <h2>See the student-facing<br />status experience.</h2>
        <Link className="button button-primary" href="/student">Open demo parcel check <span>→</span></Link>
      </section>

      <footer className="site-footer">
        <Link className="brand" href="/"><span className="brand-icon"><ParcelMark /></span><span>Siswa <strong>Pos</strong></span></Link>
        <p>Academic prototype · Demo data only · <a href="https://github.com/seanneol88" target="_blank" rel="noreferrer">Built by Seanneol Ebneazer</a></p>
      </footer>
    </main>
  );
}
