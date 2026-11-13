import { cookies } from "next/headers";
import { Role } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/security";

export const SESSION_COOKIE = "siswa_pos_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 12;

export type SessionUser = {
  id: string;
  email: string;
  displayName: string;
  role: Role;
};

export function sessionExpiry() {
  return new Date(Date.now() + SESSION_DURATION_MS);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });

  if (!session || session.expiresAt <= new Date() || !session.user.active) {
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email,
    displayName: session.user.displayName,
    role: session.user.role,
  };
}

export async function requireStaff() {
  const user = await getSessionUser();
  if (!user || (user.role !== Role.ADMIN && user.role !== Role.STAFF)) return null;
  return user;
}
