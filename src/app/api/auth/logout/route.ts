import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  clearAuthCookie(res);
  return res;
}

export async function GET(req: NextRequest) {
  const redirectTo = req.nextUrl.searchParams.get("redirect") || "/login";
  const res = NextResponse.redirect(new URL(redirectTo, req.url));
  clearAuthCookie(res);
  return res;
}
