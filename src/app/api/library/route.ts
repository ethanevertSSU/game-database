import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

const prisma = new PrismaClient();
//call for getting game library
export async function GET(req: Request) {
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

      if (user) {
        const listOfGames = await prisma.game.findMany({
          where: {
            userId: user.id,
          },
        });

        console.log("games found: ", listOfGames);
        return NextResponse.json(
          { success: true, game: listOfGames },
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
