import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

const prisma = new PrismaClient();
//call for getting game library
export async function GET() {
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
        const games = await prisma.game.findMany({
          where: {
            userId: user.id,
          },
        });

        const achievements = await prisma.achievement.findMany({
          where: {
            userId: user.id,
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

        const numGames = games.length;
        const numAchievements = achievements.length;
        const numFollowing = following.length;
        const numfollowers = followers.length;

        return NextResponse.json(
          {
            numGames: numGames,
            numAchievements: numAchievements,
            numFollowing: numFollowing,
            numfollowers: numfollowers,
            games: games,
            achievements: achievements,
            user: user,
          },
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
