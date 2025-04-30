import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return NextResponse.json(
      { error: "no session available" },
      { status: 401 },
    );
  }

  const username = session?.user.name ?? " ";

  return NextResponse.json({ username: username }, { status: 200 });
}
