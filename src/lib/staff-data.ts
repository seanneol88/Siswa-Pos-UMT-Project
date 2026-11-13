import { ParcelStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export type StaffParcelRecord = {
  id: string;
  trackingNo: string;
  courier: string;
  status: ParcelStatus;
  receivedAt: string;
  updatedAt: string;
  conditionNote: string | null;
  staffNote: string | null;
  student: { name: string; matricNo: string; matricSuffix: string; college: string | null };
  registeredBy: string;
  latestClaim: { id: string; issuedAt: string; expiresAt: string } | null;
  collection: { collectedAt: string; collectedBy: string } | null;
};

export type DashboardActivity = {
  id: string;
  eventType: string;
  occurredAt: string;
  notes: string | null;
  trackingNo: string;
  student: string;
  actor: string | null;
};

function serializeParcel(parcel: {
  id: string;
  trackingNo: string;
  courier: string;
  status: ParcelStatus;
  receivedAt: Date;
  updatedAt: Date;
  conditionNote: string | null;
  staffNote: string | null;
  student: { displayName: string; matricNo: string; college: string | null };
  registeredBy: { displayName: string };
  claimTokens: { id: string; issuedAt: Date; expiresAt: Date }[];
  collection: { collectedAt: Date; collectedBy: { displayName: string } } | null;
}): StaffParcelRecord {
  return {
    id: parcel.id,
    trackingNo: parcel.trackingNo,
    courier: parcel.courier,
    status: parcel.status,
    receivedAt: parcel.receivedAt.toISOString(),
    updatedAt: parcel.updatedAt.toISOString(),
    conditionNote: parcel.conditionNote,
    staffNote: parcel.staffNote,
    student: {
      name: parcel.student.displayName,
      matricNo: parcel.student.matricNo,
      matricSuffix: parcel.student.matricNo.slice(-4),
      college: parcel.student.college,
    },
    registeredBy: parcel.registeredBy.displayName,
    latestClaim: parcel.claimTokens[0]
      ? {
          id: parcel.claimTokens[0].id,
          issuedAt: parcel.claimTokens[0].issuedAt.toISOString(),
          expiresAt: parcel.claimTokens[0].expiresAt.toISOString(),
        }
      : null,
    collection: parcel.collection
      ? {
          collectedAt: parcel.collection.collectedAt.toISOString(),
          collectedBy: parcel.collection.collectedBy.displayName,
        }
      : null,
  };
}

export async function getStaffParcels(): Promise<StaffParcelRecord[]> {
  const now = new Date();
  const parcels = await prisma.parcel.findMany({
    orderBy: { receivedAt: "desc" },
    take: 100,
    include: {
      student: { select: { displayName: true, matricNo: true, college: true } },
      registeredBy: { select: { displayName: true } },
      claimTokens: {
        where: { revokedAt: null, expiresAt: { gt: now } },
        orderBy: { issuedAt: "desc" },
        take: 1,
        select: { id: true, issuedAt: true, expiresAt: true },
      },
      collection: { select: { collectedAt: true, collectedBy: { select: { displayName: true } } } },
    },
  });

  return parcels.map(serializeParcel);
}

export async function getDashboardData() {
  const [parcels, grouped, recentEvents] = await Promise.all([
    getStaffParcels(),
    prisma.parcel.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.parcelEvent.findMany({
      orderBy: { occurredAt: "desc" },
      take: 6,
      include: {
        parcel: { include: { student: { select: { displayName: true } } } },
        actor: { select: { displayName: true } },
      },
    }),
  ]);

  const counts = Object.values(ParcelStatus).reduce<Record<ParcelStatus, number>>((result, status) => {
    result[status] = grouped.find((entry) => entry.status === status)?._count._all ?? 0;
    return result;
  }, {} as Record<ParcelStatus, number>);

  return {
    parcels,
    counts,
    recentEvents: recentEvents.map<DashboardActivity>((event) => ({
      id: event.id,
      eventType: event.eventType,
      occurredAt: event.occurredAt.toISOString(),
      notes: event.notes,
      trackingNo: event.parcel.trackingNo,
      student: event.parcel.student.displayName,
      actor: event.actor?.displayName ?? null,
    })),
  };
}

export async function getReportData() {
  const [grouped, courierGroups, collections, recentlyRegistered] = await Promise.all([
    prisma.parcel.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.parcel.groupBy({ by: ["courier"], _count: { _all: true }, orderBy: { _count: { courier: "desc" } }, take: 5 }),
    prisma.collection.count(),
    prisma.parcel.count({ where: { receivedAt: { gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) } } }),
  ]);

  const counts = Object.values(ParcelStatus).reduce<Record<ParcelStatus, number>>((result, status) => {
    result[status] = grouped.find((entry) => entry.status === status)?._count._all ?? 0;
    return result;
  }, {} as Record<ParcelStatus, number>);

  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
  const current = counts.PROCESSING + counts.READY + counts.EXCEPTION + counts.UNCLAIMED;

  return {
    counts,
    total,
    current,
    collections,
    recentlyRegistered,
    couriers: courierGroups.map((courier) => ({ courier: courier.courier, count: courier._count._all })),
  };
}
