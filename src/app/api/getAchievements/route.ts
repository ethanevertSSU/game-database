import { getAchievementSteamGame } from "@/app/api/steam/steam";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

const prisma = new PrismaClient();
export async function POST(req: Request) {
  const { appId, steamId } = await req.json();
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const username = session?.user.name ?? " ";
  const achievements = await getAchievementSteamGame(steamId, appId);

  const unlockedAchievements = achievements.playerstats.achievements.filter(
    (achievement) => achievement.achieved === 1,
  );

  const game = await prisma.game.findFirst({
    where: {
      externalAppId: appId,
      user: {
        name: username,
      },
    },
  });

  if (!game)
    return NextResponse.json(
      { error: "No game found with matching id" },
      { status: 500 },
    );

  let numAchievements = 0;

  //for now I will just check the first element of unlocked elements and check if it exists
  //b/c there is no functionality currently to delete achievements, also if you delete the game
  //the achievements for that game also get deleted
  const checkAchievements = unlockedAchievements[0];

  const exists = await prisma.achievement.findFirst({
    where: {
      achievementName: checkAchievements.name,
      gameId: game.id,
    },
  });

  unlockedAchievements.map(async (a) => {
    if (!exists) {
      await prisma.achievement.create({
        data: {
          achievementName: a.name,
          achievementDesc: a.description,
          unlockTime: a.unlocktime,
          achievement: {
            connect: { id: game.id },
          },
        },
      });
      numAchievements++;
    }
  });
  console.log(numAchievements);
}
