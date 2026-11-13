import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { normalizeTracking } from "@/lib/security";

const lookupInput = z.object({
  trackingNo: z.string().trim().min(4).max(80),
  matricSuffix: z.string().trim().regex(/^\d{4}$/),
});

export async function POST(request: Request) {
  const parsed = lookupInput.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ message: "Enter a tracking number and the last four matric digits." }, { status: 400 });
  }

  const parcel = await prisma.parcel.findUnique({
    where: { trackingNo: normalizeTracking(parsed.data.trackingNo) },
    include: { student: { select: { matricNo: true } } },
  });

  if (!parcel || !parcel.student.matricNo.endsWith(parsed.data.matricSuffix)) {
    return NextResponse.json({ found: false }, { status: 404 });
  }

  return NextResponse.json({
    found: true,
    parcel: {
      trackingNo: parcel.trackingNo,
      status: parcel.status,
      receivedAt: parcel.receivedAt.toISOString(),
      claimAvailable: parcel.status === "READY",
    },
  });
}
