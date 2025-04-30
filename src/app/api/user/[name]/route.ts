import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getLastedPlayedSteamGame } from "@/app/api/steam/steam";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

const prisma = new PrismaClient();
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ name: string }> },
) {
  console.log(req);
  const { name } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const username = session?.user.name ?? " ";

  const sessionUser = await prisma.user.findFirst({
    where: {
      name: username,
    },
  });

  //user id
  const user = await prisma.user.findFirst({
    where: {
      name: name,
    },
  });

  const allUsers = await prisma.user.findMany();

  if (!user) return NextResponse.json({ allUsers: allUsers }, { status: 404 });

  //for friends
  const followingList = await prisma.friends.findMany({
    where: {
      userId: sessionUser?.id,
    },
  });

  const following = await prisma.friends.findMany({
    where: {
      userId: user.id,
    },
  });

  const followers = await prisma.friends.findMany({
    where: {
      followingId: user.id,
    },
  });

  const numFollowing = following.length;
  const numfollowers = followers.length;

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
        id: user.id,
        name: user.name,
        image: user.image,
        memberSince: user.createdAt,
        bio: user.bio,
      },
      linkedAccounts: linkedAccounts,
      achievements: achievements,
      numGames: numGames,
      numAchievements: achievements.length,
      numFollowing: numFollowing,
      numfollowers: numfollowers,
      followingList: followingList,
      ...(lastSteamGamePlayed && { lastSteamGamePlayed }),
    },
    { status: 200 },
  );
}
