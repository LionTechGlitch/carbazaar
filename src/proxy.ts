import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SELLER_DASHBOARD = "/seller-dashboard";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith(SELLER_DASHBOARD)) return NextResponse.next();

  const token = req.cookies.get("carbazaar_token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/seller-dashboard/:path*"],
};
