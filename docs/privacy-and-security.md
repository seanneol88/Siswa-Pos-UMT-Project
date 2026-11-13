# Privacy and security boundary

## Demo deployment rules

The public deployment uses fictional records only. It must never include real student names, matric numbers, parcel tracking numbers, screenshots of operational records, credentials, or institution-owned data without written approval and a reviewed operating process.

The public footer and README must say: **Academic prototype — demo data only — not an official UMT or Pos Siswa production service.**

## Implementation requirements

- Require authenticated, role-authorised staff/admin access before operational workflows exist.
- Show students only the minimum status and collection information needed for their own parcel.
- Rate-limit public lookup and claim-generation endpoints.
- Never place raw QR claim tokens in logs, analytics, screenshots or database events.
- Store only token hashes; invalidate old tokens when a new claim is issued.
- Use environment secrets for database URLs, authentication secrets and deployment credentials.
- Keep Kubernetes secrets out of Git. Commit only templates with placeholders.
- Test backup and restore before any approved data is stored.
- Treat a public deployment as a demo unless written institutional approval changes the scope.

## Retention

The report describes a three-month parcel-data deletion requirement. The exact retention scope, unclaimed-parcel procedure and any exception process require stakeholder confirmation before implementation with real data. A scheduled cleanup job must be reversible in a staging environment and auditable in production.
