import { NextRequest, NextResponse } from "next/server";
import {
  getSteamGames,
  getSteamPlayerInfo,
  steamGames,
} from "@/app/api/steam/steam";

export async function GET(req: NextRequest) {
  // Parse the query parameters from Steam OpenID response
  const { searchParams } = new URL(req.url);
  const claimedId = searchParams.get("openid.claimed_id");

  if (!claimedId) {
    return NextResponse.json({ error: "No Steam ID found" }, { status: 400 });
  }

  // Extract Steam ID from claimed_id URL
  const steamIdMatch = claimedId.match(/\/id\/(\d+)$/);
  const steamId = steamIdMatch ? steamIdMatch[1] : null;

  if (!steamId) {
    return NextResponse.json({ error: "Invalid Steam ID" }, { status: 400 });
  }

  //player info (name)
  const { response: playerInfo } = await getSteamPlayerInfo(steamId);
  const steamUsername: string = playerInfo.players[0].personaname;
  console.log("steam username: ", steamUsername);

  //game info
  const { response: gameInfo } = await getSteamGames(steamId);
  const games = gameInfo.games;
  console.log("game info: ", games);

  // Optional: Store in a session/database here if needed

  // Redirect to profile page with Steam ID
  return NextResponse.redirect(
    `http://localhost:3000/profile?steamId=${steamId}`,
  );
}
