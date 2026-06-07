import { cache } from "react";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User, { IUser, UserRole } from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "carbazaar-secret-change-in-production";
const COOKIE_NAME = "carbazaar_token";

export function signToken(payload: { userId: string; email: string; role: UserRole }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { userId: string; email: string; role: UserRole } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: UserRole };
    return decoded;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(req: NextRequest): string | null {
  const cookie = req.cookies.get(COOKIE_NAME);
  if (cookie?.value) return cookie.value;
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

export async function getCurrentUser(req: NextRequest): Promise<IUser | null> {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  const decoded = verifyToken(token);
  if (!decoded) return null;
  const user = await User.findById(decoded.userId).lean();
  return user as IUser | null;
}

/** Cached per-request user id for server components (avoids duplicate DB hits). */
export const getServerUserId = cache(async (): Promise<string | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const decoded = verifyToken(token);
  if (!decoded) return null;
  await connectDB();
  const user = await User.findById(decoded.userId).select("_id").lean();
  return (user as unknown as { _id: { toString: () => string } })?._id?.toString() ?? null;
});

export function setAuthCookie(res: NextResponse, token: string) {
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });
  return res;
}

export function clearAuthCookie(res: NextResponse) {
  res.cookies.set(COOKIE_NAME, "", { maxAge: 0, path: "/" });
  return res;
}

export function requireAuth(handler: (req: NextRequest, context: { user: IUser }) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return handler(req, { user });
  };
}

export function requireRole(roles: UserRole[]) {
  return (handler: (req: NextRequest, context: { user: IUser }) => Promise<NextResponse>) => {
    return async (req: NextRequest) => {
      const user = await getCurrentUser(req);
      if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      if (!roles.includes(user.role as UserRole)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      return handler(req, { user });
    };
  };
}
