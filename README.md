# Siswa Pos

> **Academic prototype · fictional demo data only · not an official UMT or Pos Siswa production service.**

Siswa Pos is a full-stack student-parcel management prototype. It is designed to demonstrate faster parcel registration, limited student status checks, QR-based collection verification, accountable staff handovers and a production-minded DevOps delivery path.

## Stack

- **Application:** Next.js, TypeScript, React
- **Data:** PostgreSQL, Prisma
- **Local development:** Docker Compose
- **Delivery:** Docker, GitHub Actions
- **Runtime:** Kubernetes, Traefik, Cloudflare Tunnel
- **Monitoring:** health endpoint and Uptime Kuma

## What exists in this first foundation

- Public product landing page
- Database-backed student lookup at `/student` using a tracking number and final four fictional matric digits
- Demo staff/admin sign-in, session handling, protected parcel list, and parcel-registration API at `/staff`
- Seed script for strictly fictional users and records; local passwords are required at runtime and are never committed
- Health endpoint at `/api/health`
- PostgreSQL/Prisma data model for users, students, parcels, QR claims, collections and audit events
- Docker, CI and Kubernetes deployment foundations
- Architecture, privacy and deployment documentation

## Local development

```bash
cp .env.example .env
docker compose up -d db
npm ci
npm run db:generate
npm run dev
```

Open `http://localhost:3000`.

## Useful commands

```bash
npm run lint
npm run build
npm run db:generate
npm run db:migrate
npm run db:deploy
npm run db:seed
```

## Before a public deployment

Read:

- [`docs/architecture.md`](docs/architecture.md)
- [`docs/privacy-and-security.md`](docs/privacy-and-security.md)
- [`docs/deployment.md`](docs/deployment.md)

Never place a real database URL, cloud token, QR claim token, student data or official credentials in Git.
