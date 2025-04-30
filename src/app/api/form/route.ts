import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

const prisma = new PrismaClient();
//call for manual game form input
export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const username = session?.user.name ?? " ";

    if (session) {
      const user = await prisma.user.findFirst({
        where: {
          name: username,
        },
      });

      const body = await req.json();
      console.log("📦 Received body:", body);

      const { gameName, platform, physOrDig, notes, gamePicture, status } =
        body;
      console.log("✍️ notes field received:", notes);

      if (user) {
        const newGame = await prisma.game.create({
          data: {
            gameName: gameName,
            platform: platform,
            gameType: physOrDig,
            Notes: notes,
            gamePicture,
            status: status,
            user: {
              connect: { id: user.id },
            },
          },
        });

        console.log("New Game Has been added to user profile");
        return NextResponse.json(
          { success: true, game: newGame },
          { status: 201 },
        );
      }
    }
  } catch (error) {
    console.error("Form Submit Error: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
