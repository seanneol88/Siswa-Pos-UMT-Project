import { prisma } from "@/lib/prisma";

export type StaffParcelSummary = {
  id: string;
  trackingNo: string;
  courier: string;
  status: string;
  receivedAt: string;
  student: string;
  matricSuffix: string;
};

export async function getRecentStaffParcels(): Promise<StaffParcelSummary[]> {
  const parcels = await prisma.parcel.findMany({
    orderBy: { receivedAt: "desc" },
    take: 20,
    include: { student: { select: { displayName: true, matricNo: true } } },
  });

  return parcels.map((parcel) => ({
    id: parcel.id,
    trackingNo: parcel.trackingNo,
    courier: parcel.courier,
    status: parcel.status,
    receivedAt: parcel.receivedAt.toISOString(),
    student: parcel.student.displayName,
    matricSuffix: parcel.student.matricNo.slice(-4),
  }));
}
