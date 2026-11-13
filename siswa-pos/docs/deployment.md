# Deployment runbook — first public demo

## Prerequisites

- `siswapos.app` Cloudflare zone is active.
- A Cloudflare Tunnel is created on the homelab host.
- The image is built from a pinned commit/tag, never a mutable `latest` tag.
- `DATABASE_URL` is added directly to the Kubernetes runtime secret, never committed.

## Safe release order

1. Run `npm ci`, `npm run db:generate`, `npm run lint` and `npm run build`.
2. Build and publish an immutable image tag.
3. Review Kubernetes manifests and replace the placeholder image reference.
4. Client-validate manifests before applying them.
5. Apply the namespace, runtime secret, service and deployment.
6. Confirm the ready pod is using the intended immutable image.
7. Verify `/api/health` locally through the service/IngressRoute.
8. Add the `siswapos.app` ingress rule to the existing Cloudflare Tunnel configuration.
9. Create a Cloudflare DNS route for the tunnel using the tunnel tooling; do not point the domain at a raw home IP.
10. Verify the public URL and then enrol the public health endpoint in Uptime Kuma.

## Validation gates

- The page footer visibly says it is an academic prototype using demo data only.
- `https://siswapos.app/api/health` returns `200` and `status: ok`.
- The active Kubernetes Pod image matches the intended immutable release tag.
- There is no externally exposed PostgreSQL service.
- A failed or invalid image tag has a documented rollback route.

## Deferred until the application has authentication

- Staff/admin operational endpoints
- Real student or parcel information
- QR claim issue and collection confirmation
- Database backup job for anything beyond fictional demonstration data
