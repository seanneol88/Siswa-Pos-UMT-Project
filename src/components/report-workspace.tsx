import Link from "next/link";
import type { ParcelStatus } from "@/generated/prisma/client";

type ReportWorkspaceProps = {
  counts: Record<ParcelStatus, number>;
  total: number;
  current: number;
  collections: number;
  recentlyRegistered: number;
  couriers: { courier: string; count: number }[];
};

const statusItems: { key: ParcelStatus; label: string; color: string }[] = [
  { key: "PROCESSING", label: "Processing", color: "pine" },
  { key: "READY", label: "Ready for collection", color: "leaf" },
  { key: "COLLECTED", label: "Collected", color: "mint" },
  { key: "EXCEPTION", label: "Needs follow-up", color: "coral" },
  { key: "UNCLAIMED", label: "Awaiting follow-up", color: "sand" },
];

export function ReportWorkspace({ counts, total, current, collections, recentlyRegistered, couriers }: ReportWorkspaceProps) {
  const maxCount = Math.max(...couriers.map((courier) => courier.count), 1);
  const collectionRate = total ? Math.round((collections / total) * 100) : 0;

  return <>
    <header className="ops-page-heading"><div><p className="eyebrow"><span /> Operations reporting</p><h1>See the flow.<br /><em>Find the friction.</em></h1></div><Link className="ops-primary-button report-action" href="/staff/parcels">Manage records <span>→</span></Link></header>
    <section className="ops-report-kpis"><article><span>All parcel records</span><strong>{total}</strong><p>Fictional records retained in this demo</p></article><article><span>Active workflow</span><strong>{current}</strong><p>Processing, ready or requiring follow-up</p></article><article><span>Verified collections</span><strong>{collections}</strong><p>{collectionRate}% of all registered records</p></article><article><span>Registered this week</span><strong>{recentlyRegistered}</strong><p>Rolling seven-day count</p></article></section>
    <section className="ops-report-grid"><article className="ops-report-card status-distribution"><div className="card-title-row"><div><p className="eyebrow"><span /> Status distribution</p><h2>Parcel workflow health</h2></div><span className="report-total">{total} total</span></div><div className="status-bars">{statusItems.map((item) => <div className="status-bar-row" key={item.key}><div><span>{item.label}</span><strong>{counts[item.key]}</strong></div><i><b className={item.color} style={{ width: `${total ? (counts[item.key] / total) * 100 : 0}%` }} /></i></div>)}</div></article><article className="ops-report-card courier-breakdown"><div className="card-title-row"><div><p className="eyebrow"><span /> Intake view</p><h2>Courier mix</h2></div></div><div className="courier-list">{couriers.map((courier) => <div key={courier.courier}><span>{courier.courier}</span><i><b style={{ width: `${(courier.count / maxCount) * 100}%` }} /></i><strong>{courier.count}</strong></div>)}{couriers.length === 0 && <p className="ops-empty-inline">Courier reporting appears as fictional parcels are registered.</p>}</div></article></section>
    <section className="ops-report-callout"><div><span>✦</span><p className="eyebrow"><span /> Responsible data practice</p><h2>Built for operational learning, not institutional data.</h2><p>This prototype reports only fictional records. Retention and deletion rules still require stakeholder validation before any production use.</p></div><Link href="/staff/parcels">Review parcel records <span>→</span></Link></section>
  </>;
}
