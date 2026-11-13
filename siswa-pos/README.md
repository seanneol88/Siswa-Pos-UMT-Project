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
- Student demo lookup at `/student` using the fictional tracking number `SPX-2026-0001`
- Staff-dashboard interface mock-up at `/staff`
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
```

## Before a public deployment

Read:

- [`docs/architecture.md`](docs/architecture.md)
- [`docs/privacy-and-security.md`](docs/privacy-and-security.md)
- [`docs/deployment.md`](docs/deployment.md)

Never place a real database URL, cloud token, QR claim token, student data or official credentials in Git.
