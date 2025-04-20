import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getLastedPlayedSteamGame } from "@/app/api/steam/steam";

const prisma = new PrismaClient();
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  console.log(req);

  //user id
  const user = await prisma.user.findFirst({
    where: {
      name: name,
    },
  });

  if (!user)
    return NextResponse.json({ error: "no user found" }, { status: 404 });

  //for number of games in library
  const games = await prisma.game.findMany({
    where: {
      userId: user.id,
    },
  });

  const numGames = games.length;

  //achievements
  const achievements = await prisma.achievement.findMany({
    where: {
      userId: user.id,
    },
  });

  //linkAccountId
  const linkedAccounts = await prisma.linkedAccounts.findMany({
    where: {
      userId: user.id,
    },
  });

  // Get platformId safely
  const platformId = linkedAccounts?.[0]?.externalPlatformId;
  let lastSteamGamePlayed = null;

  if (platformId) {
    try {
      const steamData = await getLastedPlayedSteamGame(platformId);
      const gameList = steamData?.response?.games;

      if (Array.isArray(gameList) && gameList.length > 0) {
        const lastGame = gameList[0];

        const gameName = lastGame?.name ?? "Unknown Game";
        const appId = lastGame?.appid ?? "";
        const fullPlaytime = lastGame?.playtime_forever ?? 0;

        const hours = Math.floor(fullPlaytime / 60);
        const minutes = fullPlaytime % 60;

        lastSteamGamePlayed = {
          gameName,
          appId,
          hours,
          minutes,
        };
      }
    } catch (err) {
      console.error("Steam fetch failed:", err);
      // Fallback: just skip lastSteamGamePlayed
    }
  }
  return NextResponse.json(
    {
      user: {
        name: user.name,
        image: user.image,
        memberSince: user.createdAt,
        bio: user.bio,
      },
      linkedAccounts: linkedAccounts,
      achievements: achievements,
      numGames: numGames,
      ...(lastSteamGamePlayed && { lastSteamGamePlayed }),
    },
    { status: 200 },
  );
}
