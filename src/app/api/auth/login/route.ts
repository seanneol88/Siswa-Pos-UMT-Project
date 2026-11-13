import { NextResponse } from "next/server";
import { z } from "zod";
import { SESSION_COOKIE, sessionExpiry } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createOpaqueToken, hashToken, verifyPassword } from "@/lib/security";

const loginInput = z.object({
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  password: z.string().min(12).max(256),
});

export async function POST(request: Request) {
  const parsed = loginInput.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ message: "Enter a valid email and password." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user || !user.active || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    return NextResponse.json({ message: "The demo sign-in details are not recognised." }, { status: 401 });
  }

  const token = createOpaqueToken();
  const expiresAt = sessionExpiry();
  await prisma.session.create({
    data: { userId: user.id, tokenHash: hashToken(token), expiresAt },
  });

  const response = NextResponse.json({
    user: { displayName: user.displayName, email: user.email, role: user.role },
  });
  response.cookies.set({
    name: SESSION_COOKIE,
    value: token,
    expires: expiresAt,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  return response;
}
