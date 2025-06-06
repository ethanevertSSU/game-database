import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

const prisma = new PrismaClient();

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const username = session?.user.name ?? "";

    if (!session || !username) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findFirst({
      where: {
        name: username,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { id: gameId } = await params;
    const body = await req.json();
    const { Notes, status } = body;

    const updatedGame = await prisma.game.updateMany({
      where: {
        id: gameId,
        userId: user.id,
      },
      data: {
        Notes,
        status,
      },
    });

    if (updatedGame.count === 0) {
      return NextResponse.json(
        { error: "Game not found or not yours" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update Error: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  console.log(req);
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const username = session?.user.name ?? "";

    if (!session || !username) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findFirst({
      where: {
        name: username,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { id: gameId } = await params;
    const deleted = await prisma.game.deleteMany({
      where: {
        id: gameId,
        userId: user.id,
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { error: "Game not found or not yours" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
