import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check for the session cookie (set by Auth.js)
  const sessionCookie =
    request.cookies.get("authjs.session-token") ??
    request.cookies.get("__Secure-authjs.session-token");

  if (!sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/track/:path*"],
};
