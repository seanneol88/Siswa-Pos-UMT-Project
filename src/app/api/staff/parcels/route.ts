import { NextResponse } from "next/server";
import { ParcelEventType, ParcelStatus } from "@/generated/prisma/client";
import { requireStaff } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStaffParcels } from "@/lib/staff-data";
import { normalizeMatric, normalizeTracking } from "@/lib/security";
import { z } from "zod";

const parcelInput = z.object({
  trackingNo: z.string().trim().min(4).max(80),
  courier: z.string().trim().min(2).max(80),
  matricNo: z.string().trim().min(4).max(40),
  studentName: z.string().trim().min(2).max(120),
  college: z.string().trim().max(120).optional().or(z.literal("")),
  conditionNote: z.string().trim().max(500).optional().or(z.literal("")),
});

export async function GET() {
  const user = await requireStaff();
  if (!user) return NextResponse.json({ message: "Sign in is required." }, { status: 401 });

  return NextResponse.json({ parcels: await getStaffParcels() });
}

export async function POST(request: Request) {
  const user = await requireStaff();
  if (!user) return NextResponse.json({ message: "Sign in is required." }, { status: 401 });

  const parsed = parcelInput.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ message: "Check the parcel and recipient fields, then try again." }, { status: 400 });
  }

  const trackingNo = normalizeTracking(parsed.data.trackingNo);
  const existing = await prisma.parcel.findUnique({ where: { trackingNo } });
  if (existing) {
    return NextResponse.json({ message: "This tracking number has already been registered." }, { status: 409 });
  }

  const parcel = await prisma.$transaction(async (tx) => {
    const student = await tx.student.upsert({
      where: { matricNo: normalizeMatric(parsed.data.matricNo) },
      create: {
        matricNo: normalizeMatric(parsed.data.matricNo),
        displayName: parsed.data.studentName,
        college: parsed.data.college || null,
      },
      update: {
        displayName: parsed.data.studentName,
        college: parsed.data.college || null,
      },
    });

    const created = await tx.parcel.create({
      data: {
        trackingNo,
        courier: parsed.data.courier,
        status: ParcelStatus.PROCESSING,
        conditionNote: parsed.data.conditionNote || null,
        studentId: student.id,
        registeredById: user.id,
      },
    });

    await tx.parcelEvent.create({
      data: {
        parcelId: created.id,
        actorId: user.id,
        eventType: ParcelEventType.REGISTERED,
        notes: "Parcel registered through the staff demo workflow.",
      },
    });
    return created;
  });

  return NextResponse.json({ parcel: { id: parcel.id, trackingNo: parcel.trackingNo, status: parcel.status } }, { status: 201 });
}
