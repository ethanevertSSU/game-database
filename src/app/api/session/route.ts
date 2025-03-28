import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth"; // your betterAuth instance

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return NextResponse.json(null, { status: 401 });
  }
  return NextResponse.json(session);
}
