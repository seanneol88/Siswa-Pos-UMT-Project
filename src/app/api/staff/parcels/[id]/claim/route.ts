import { NextResponse } from "next/server";
import { ParcelEventType, ParcelStatus } from "@/generated/prisma/client";
import { requireStaff } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createOpaqueToken, hashToken } from "@/lib/security";

type RouteContext = { params: Promise<{ id: string }> };
const CLAIM_DURATION_MS = 1000 * 60 * 60 * 24;

export async function POST(_request: Request, { params }: RouteContext) {
  const user = await requireStaff();
  if (!user) return NextResponse.json({ message: "Sign in is required." }, { status: 401 });

  const { id } = await params;
  const parcel = await prisma.parcel.findUnique({ where: { id }, select: { id: true, trackingNo: true, status: true, collection: { select: { id: true } } } });
  if (!parcel) return NextResponse.json({ message: "The parcel record could not be found." }, { status: 404 });
  if (parcel.status !== ParcelStatus.READY || parcel.collection) {
    return NextResponse.json({ message: "Only uncollected parcels marked Ready can receive a claim QR." }, { status: 409 });
  }

  const claimCode = createOpaqueToken();
  const expiresAt = new Date(Date.now() + CLAIM_DURATION_MS);
  const now = new Date();

  await prisma.$transaction(async (tx) => {
    const revoked = await tx.claimToken.updateMany({ where: { parcelId: id, revokedAt: null }, data: { revokedAt: now } });
    await tx.claimToken.create({ data: { parcelId: id, tokenHash: hashToken(claimCode), expiresAt } });
    await tx.parcelEvent.create({
      data: {
        parcelId: id,
        actorId: user.id,
        eventType: revoked.count > 0 ? ParcelEventType.CLAIM_REGENERATED : ParcelEventType.CLAIM_ISSUED,
        notes: `A 24-hour claim QR was ${revoked.count > 0 ? "regenerated" : "issued"} for ${parcel.trackingNo}.`,
      },
    });
  });

  return NextResponse.json({ claimCode, expiresAt: expiresAt.toISOString(), trackingNo: parcel.trackingNo }, { status: 201 });
}
