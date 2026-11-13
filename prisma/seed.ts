import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { ParcelEventType, ParcelStatus, PrismaClient, Role } from "../src/generated/prisma/client";
import { hashPassword } from "../src/lib/security";

const connectionString = process.env.DATABASE_URL;
const adminPassword = process.env.DEMO_ADMIN_PASSWORD;
const staffPassword = process.env.DEMO_STAFF_PASSWORD;

if (!connectionString) throw new Error("DATABASE_URL is required.");
if (!adminPassword || !staffPassword) {
  throw new Error("Set DEMO_ADMIN_PASSWORD and DEMO_STAFF_PASSWORD locally before seeding demo accounts.");
}
if (adminPassword.length < 12 || staffPassword.length < 12) {
  throw new Error("Demo passwords must each be at least 12 characters long.");
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

async function main() {
  const [adminHash, staffHash] = await Promise.all([hashPassword(adminPassword!), hashPassword(staffPassword!)]);

  const admin = await prisma.user.upsert({
    where: { email: "admin@siswapos.test" },
    update: { displayName: "Demo administrator", passwordHash: adminHash, role: Role.ADMIN, active: true },
    create: { email: "admin@siswapos.test", displayName: "Demo administrator", passwordHash: adminHash, role: Role.ADMIN },
  });

  const staff = await prisma.user.upsert({
    where: { email: "staff@siswapos.test" },
    update: { displayName: "Demo staff", passwordHash: staffHash, role: Role.STAFF, active: true },
    create: { email: "staff@siswapos.test", displayName: "Demo staff", passwordHash: staffHash, role: Role.STAFF },
  });

  const studentOne = await prisma.student.upsert({
    where: { matricNo: "DEMO2468" },
    update: { displayName: "Demo student A", college: "Demo College" },
    create: { matricNo: "DEMO2468", displayName: "Demo student A", college: "Demo College" },
  });
  const studentTwo = await prisma.student.upsert({
    where: { matricNo: "DEMO1357" },
    update: { displayName: "Demo student B", college: "Demo College" },
    create: { matricNo: "DEMO1357", displayName: "Demo student B", college: "Demo College" },
  });

  await prisma.parcel.upsert({
    where: { trackingNo: "SPX-2026-0001" },
    update: { courier: "Demo Express", status: ParcelStatus.READY, studentId: studentOne.id, registeredById: admin.id },
    create: {
      trackingNo: "SPX-2026-0001",
      courier: "Demo Express",
      status: ParcelStatus.READY,
      studentId: studentOne.id,
      registeredById: admin.id,
      events: { create: { actorId: admin.id, eventType: ParcelEventType.REGISTERED, notes: "Fictional seeded parcel." } },
    },
  });

  await prisma.parcel.upsert({
    where: { trackingNo: "SPX-2026-0002" },
    update: { courier: "Demo Logistics", status: ParcelStatus.PROCESSING, studentId: studentTwo.id, registeredById: staff.id },
    create: {
      trackingNo: "SPX-2026-0002",
      courier: "Demo Logistics",
      status: ParcelStatus.PROCESSING,
      studentId: studentTwo.id,
      registeredById: staff.id,
      events: { create: { actorId: staff.id, eventType: ParcelEventType.REGISTERED, notes: "Fictional seeded parcel." } },
    },
  });

  console.log("Seeded fictional demo users, students, and parcels.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
