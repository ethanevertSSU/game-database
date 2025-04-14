import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { PrismaClient } from "@prisma/client";
import { getLastedPlayedSteamGame } from "@/app/api/steam/steam";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
export async function GET() {
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
      const steamAccount = await prisma.linkedAccounts.findFirst({
        where: {
          userId: user.id,
        },
      });

      if (steamAccount) {
        const steamId = steamAccount?.externalPlatformId;

        const lastGamePlayed = getLastedPlayedSteamGame(steamId);
        console.log(lastGamePlayed);
        return NextResponse.json({ lastGame: lastGamePlayed }, { status: 201 });
      }
    }
  }

  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}
