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
        const lastGamePlayed = await getLastedPlayedSteamGame(steamId);

        if (lastGamePlayed.response.games) {
          const lastGame = lastGamePlayed.response.games[0];

          console.log("game: ", lastGame);

          const gameName = lastGame?.name ?? " ";
          const appId = lastGame?.appid ?? " ";
          const fullPlaytime = lastGame?.playtime_forever ?? " ";

          const hours = Math.floor(fullPlaytime / 60);
          const minutes = fullPlaytime % 60;

          return NextResponse.json(
            {
              gameName: gameName,
              appId: appId,
              hours: hours,
              minutes: minutes,
            },
            { status: 201 },
          );
        } else {
          console.log("no games played in the last 2 weeks");
          return NextResponse.json(
            { error: "No such game found", status: 401 },
            { status: 401 },
          );
        }
      }
    }
  }

  return NextResponse.json(
    { error: "Internal Server Error", status: 500 },
    { status: 500 },
  );
}
