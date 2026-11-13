import Link from "next/link";
import type { DashboardActivity } from "@/lib/staff-data";
import type { ParcelStatus } from "@/generated/prisma/client";

type DashboardOverviewProps = {
  counts: Record<ParcelStatus, number>;
  parcels: { id: string; trackingNo: string; status: ParcelStatus; student: { name: string; matricSuffix: string }; courier: string; receivedAt: string }[];
  recentEvents: DashboardActivity[];
  userName: string;
};

const statusLabel: Record<ParcelStatus, string> = {
  PROCESSING: "Processing",
  READY: "Ready",
  COLLECTED: "Collected",
  EXCEPTION: "Needs follow-up",
  UNCLAIMED: "Unclaimed",
};

function eventLabel(event: string) {
  return event.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function DashboardOverview({ counts, parcels, recentEvents, userName }: DashboardOverviewProps) {
  const activeTotal = counts.PROCESSING + counts.READY + counts.EXCEPTION + counts.UNCLAIMED;
  const nextParcel = parcels.find((parcel) => parcel.status === "READY") ?? parcels[0];

  return <>
    <header className="ops-page-heading">
      <div><p className="eyebrow"><span /> Operations overview</p><h1>Good to see you,<br /><em>{userName.split(" ")[0]}.</em></h1></div>
      <div className="ops-heading-status"><span><i /> Workspace secure</span><p>Academic demo · fictional records</p></div>
    </header>

    <section className="ops-kpi-grid" aria-label="Parcel operation summary">
      <article className="ops-kpi primary"><span>Active parcels</span><strong>{activeTotal}</strong><small>Across the current workflow</small><i className="kpi-corner">↗</i></article>
      <article className="ops-kpi"><span>Ready to collect</span><strong>{counts.READY}</strong><small><i className="green-dot" /> Eligible for claim QR</small></article>
      <article className="ops-kpi"><span>In processing</span><strong>{counts.PROCESSING}</strong><small>Awaiting a status update</small></article>
      <article className="ops-kpi"><span>Needs follow-up</span><strong>{counts.EXCEPTION + counts.UNCLAIMED}</strong><small className={counts.EXCEPTION + counts.UNCLAIMED > 0 ? "attention" : ""}>{counts.EXCEPTION + counts.UNCLAIMED > 0 ? "Review exceptions" : "No exceptions recorded"}</small></article>
    </section>

    <section className="ops-overview-grid">
      <article className="ops-collection-focus">
        <div className="focus-header"><div><p className="eyebrow"><span /> Next at the desk</p><h2>Ready for a<br />verified handover.</h2></div><span className="focus-spark">✦</span></div>
        {nextParcel ? <div className="focus-parcel"><div className="focus-parcel-icon">□</div><div><span>Parcel record</span><strong>{nextParcel.trackingNo}</strong><p>{nextParcel.student.name} · •••{nextParcel.student.matricSuffix}</p></div><Link href="/staff/collections">Verify claim <span>→</span></Link></div> : <div className="focus-empty"><strong>The demo desk is clear.</strong><p>Register a fictional parcel to begin the intake workflow.</p><Link href="/staff/parcels">Register a parcel <span>→</span></Link></div>}
        <div className="focus-steps"><span><i>1</i> Issue time-limited QR claim</span><span><i>2</i> Scan or paste at collection</span><span><i>3</i> Save the staff-attributed handover</span></div>
      </article>
      <article className="ops-activity-card">
        <div className="card-title-row"><div><p className="eyebrow"><span /> Audit feed</p><h2>Recent activity</h2></div><Link href="/staff/reports">Reports <span>↗</span></Link></div>
        <div className="ops-activity-list">
          {recentEvents.map((event) => <div className="ops-activity" key={event.id}><span className="activity-symbol">{event.eventType === "COLLECTED" ? "✓" : event.eventType.includes("CLAIM") ? "◫" : "↓"}</span><div><strong>{eventLabel(event.eventType)} <code>{event.trackingNo}</code></strong><p>{event.notes || `${event.student} · ${event.actor ?? "System"}`}</p></div><time>{new Intl.DateTimeFormat("en-MY", { hour: "numeric", minute: "2-digit" }).format(new Date(event.occurredAt))}</time></div>)}
          {recentEvents.length === 0 && <p className="ops-empty-inline">No events recorded yet.</p>}
        </div>
      </article>
    </section>

    <section className="ops-table-card">
      <div className="card-title-row"><div><p className="eyebrow"><span /> At a glance</p><h2>Latest parcel records</h2></div><Link className="ops-text-link" href="/staff/parcels">Manage all parcels <span>→</span></Link></div>
      <div className="ops-data-table"><div className="ops-data-row ops-data-head"><span>Tracking</span><span>Recipient</span><span>Courier</span><span>Status</span><span>Received</span></div>{parcels.slice(0, 5).map((parcel) => <div className="ops-data-row" key={parcel.id}><code>{parcel.trackingNo}</code><span>{parcel.student.name} <small>•••{parcel.student.matricSuffix}</small></span><span>{parcel.courier}</span><span><i className={`ops-status ${parcel.status.toLowerCase()}`}>{statusLabel[parcel.status]}</i></span><time>{new Intl.DateTimeFormat("en-MY", { dateStyle: "medium" }).format(new Date(parcel.receivedAt))}</time></div>)}{parcels.length === 0 && <p className="ops-empty-inline">No fictional parcels have been registered yet.</p>}</div>
    </section>
  </>;
}
