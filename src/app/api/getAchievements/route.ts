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

  const user = await prisma.user.findFirst({
    where: {
      name: username,
    },
  });

  if (!user)
    return NextResponse.json({ error: "No user found" }, { status: 501 });

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
      { status: 501 },
    );

  let numAchievements = 0;

  //for now I will just check the first element of unlocked elements and check if it exists
  //b/c there is no functionality currently to delete achievements, also if you delete the game
  //the achievements for that game also get deleted
  const checkAchievements = unlockedAchievements[0];

  if (!checkAchievements)
    return NextResponse.json(
      { error: `No achievements unlocked for ${game.gameName}` },
      { status: 501 },
    );

  const exists = await prisma.achievement.findFirst({
    where: {
      achievementName: checkAchievements.name,
      gameId: game.id,
    },
  });

  if (exists)
    return NextResponse.json(
      { error: "Achievements already added" },
      { status: 501 },
    );

  for (const a of unlockedAchievements) {
    // console.log(
    //   `Achievement added: ${game.gameName} | ${a.name} | ${a.description}`,
    // );
    await prisma.achievement.create({
      data: {
        gameNameAchievements: game.gameName,
        achievementName: a.name,
        achievementDesc: a.description,
        unlockTime: a.unlocktime,
        achievement: {
          connect: { id: game.id },
        },
        User: {
          connect: { id: user.id },
        },
      },
    });
    numAchievements++;
  }

  // console.log(numAchievements);

  return NextResponse.json(
    { numAchievements: numAchievements },
    { status: 201 },
  );
}
