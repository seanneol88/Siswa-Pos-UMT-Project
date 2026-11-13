import { NextResponse } from "next/server";
import { ParcelEventType, ParcelStatus } from "@/generated/prisma/client";
import { requireStaff } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateInput = z.object({
  status: z.nativeEnum(ParcelStatus).optional(),
  staffNote: z.string().trim().max(500).optional(),
  conditionNote: z.string().trim().max(500).optional(),
}).refine((data) => data.status !== undefined || data.staffNote !== undefined || data.conditionNote !== undefined, {
  message: "Select a status or add a note before saving.",
});

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: RouteContext) {
  const user = await requireStaff();
  if (!user) return NextResponse.json({ message: "Sign in is required." }, { status: 401 });

  const parsed = updateInput.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Check the update details." }, { status: 400 });

  const { id } = await params;
  const current = await prisma.parcel.findUnique({ where: { id } });
  if (!current) return NextResponse.json({ message: "The parcel record could not be found." }, { status: 404 });
  if (current.status === ParcelStatus.COLLECTED && parsed.data.status && parsed.data.status !== ParcelStatus.COLLECTED) {
    return NextResponse.json({ message: "Collected parcels cannot be moved back into the active workflow." }, { status: 409 });
  }

  const nextStatus = parsed.data.status ?? current.status;
  const notes = [
    nextStatus !== current.status ? `Status changed from ${current.status} to ${nextStatus}.` : null,
    parsed.data.staffNote ? `Staff note: ${parsed.data.staffNote}` : null,
    parsed.data.conditionNote ? `Condition note: ${parsed.data.conditionNote}` : null,
  ].filter(Boolean).join(" ");

  const parcel = await prisma.$transaction(async (tx) => {
    const updated = await tx.parcel.update({
      where: { id },
      data: {
        status: nextStatus,
        ...(parsed.data.staffNote !== undefined ? { staffNote: parsed.data.staffNote || null } : {}),
        ...(parsed.data.conditionNote !== undefined ? { conditionNote: parsed.data.conditionNote || null } : {}),
      },
    });

    await tx.parcelEvent.create({
      data: {
        parcelId: id,
        actorId: user.id,
        eventType: nextStatus !== current.status ? ParcelEventType.STATUS_CHANGED : ParcelEventType.NOTE_ADDED,
        notes: notes || "Parcel details updated through the staff workspace.",
      },
    });
    return updated;
  });

  return NextResponse.json({ parcel: { id: parcel.id, trackingNo: parcel.trackingNo, status: parcel.status } });
}
