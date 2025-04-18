import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

const prisma = new PrismaClient();

export async function PUT(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const username = session?.user.name ?? "";

    if (!session || !username) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bio } = await req.json();

    const user = await prisma.user.findFirst({
      where: {
        name: username,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update the user's bio
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        bio,
      },
    });

    return NextResponse.json(
      { success: true, user: updatedUser },
      { status: 200 },
    );
  } catch (error) {
    console.error("Bio update error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
