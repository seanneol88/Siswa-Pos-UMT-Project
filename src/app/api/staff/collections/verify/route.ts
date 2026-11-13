import { NextResponse } from "next/server";
import { ParcelEventType, ParcelStatus } from "@/generated/prisma/client";
import { requireStaff } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/security";
import { z } from "zod";

const verificationInput = z.object({ claimCode: z.string().trim().min(16).max(128) });

export async function POST(request: Request) {
  const user = await requireStaff();
  if (!user) return NextResponse.json({ message: "Sign in is required." }, { status: 401 });

  const parsed = verificationInput.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Scan or paste a valid demo QR claim payload." }, { status: 400 });

  const tokenHash = hashToken(parsed.data.claimCode);
  const now = new Date();
  const token = await prisma.claimToken.findUnique({
    where: { tokenHash },
    include: { parcel: { include: { student: { select: { displayName: true, matricNo: true } }, collection: { select: { id: true } } } } },
  });

  if (!token || token.revokedAt || token.expiresAt <= now || token.parcel.status !== ParcelStatus.READY || token.parcel.collection) {
    return NextResponse.json({ message: "That QR claim is invalid, expired, already used, or not ready for collection." }, { status: 409 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.collection.create({
      data: {
        parcelId: token.parcelId,
        collectedById: user.id,
        verifiedStudentId: token.parcel.studentId,
        claimTokenId: token.id,
        note: "Collection verified with a time-limited QR claim in the demo workspace.",
      },
    });
    await tx.parcel.update({ where: { id: token.parcelId }, data: { status: ParcelStatus.COLLECTED } });
    await tx.parcelEvent.create({
      data: {
        parcelId: token.parcelId,
        actorId: user.id,
        eventType: ParcelEventType.COLLECTED,
        notes: "Collection verified with a valid claim QR.",
      },
    });
  });

  return NextResponse.json({
    parcel: {
      trackingNo: token.parcel.trackingNo,
      student: token.parcel.student.displayName,
      matricSuffix: token.parcel.student.matricNo.slice(-4),
      collectedAt: now.toISOString(),
    },
  });
}
