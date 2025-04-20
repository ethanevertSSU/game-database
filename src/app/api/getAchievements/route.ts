import { getAchievementSteamGame } from "@/app/api/steam/steam";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { appId, steamId } = await req.json();

  const achievements = await getAchievementSteamGame(steamId, appId);

  const unlockedAchievements = achievements.playerstats.achievements.filter(
    (achievement) => achievement.achieved === 1,
  );

  unlockedAchievements.map((e) => console.log(e));

  return NextResponse.json(
    { achievements: unlockedAchievements },
    { status: 200 },
  );
}
