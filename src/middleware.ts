import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const session = getSessionCookie(request);

  if (!session) {
    const response = NextResponse.redirect(new URL("/Login", request.url));
    response.headers.set(
      "Set-Cookie",
      "showToast=true; Path=/; Max-Age=5; SameSite=Lax",
    );
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/form", "/profile", "/library"],
};
