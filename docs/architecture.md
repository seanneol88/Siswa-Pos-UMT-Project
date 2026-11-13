# Siswa Pos architecture

## Purpose

Siswa Pos is an academic prototype for student-parcel operations. It is intentionally built with fictional data and is not an official UMT or Pos Siswa production service.

## Application boundary

```text
Public browser
  -> Cloudflare edge and HTTPS
  -> Cloudflare Tunnel
  -> Traefik in Kubernetes
  -> siswa-pos-web (Next.js)
  -> PostgreSQL
```

## First release

- Student-facing limited tracking status page
- Staff parcel registration workflow
- Role-based staff/admin access
- 24-hour, single-use QR claim tokens
- Collection recording with staff attribution
- Parcel-event audit log and operational totals
- Automated data-retention task for demo fixtures

## Engineering decisions

| Concern | Decision | Reason |
| --- | --- | --- |
| App framework | Next.js + TypeScript | One typed full-stack codebase for UI and server routes. |
| Data | PostgreSQL + Prisma | Relational integrity supports parcels, claims, collections and audit events. |
| Claims | Opaque, hashed, expiry-bound token | A QR image must not expose a reusable database ID. |
| Delivery | Docker image + GitHub Actions | Repeatable build, lint and production build validation. |
| Runtime | Kubernetes + Traefik | Demonstrates declarative deployment, probes and service routing. |
| Public edge | Cloudflare Tunnel | No inbound port exposure for the homelab origin. |
| Observability | Health endpoint + Uptime Kuma | Detects externally visible failures. |

## QR claim rule

The QR code is a short-lived claim credential, not the proof of identity on its own. In the completed app, staff must compare the verified recipient with the collection context before recording a release. Tokens expire after 24 hours, are stored as hashes, and become unusable after collection or replacement.
