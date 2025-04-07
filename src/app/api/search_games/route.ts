// app/api/search-games/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { query, offset = 0 } = await req.json();

  const clientId = "bz7ocndodrnlkdpe3venwbqmfuwttm";
  const clientSecret = "8cvxyc8yotit8z5bg0zj0u4afmp5zr";

  // Get OAuth token
  const tokenRes = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
    }),
  });

  const { access_token } = await tokenRes.json();

  // Search IGDB for games
  const igdbRes = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      "Client-ID": clientId,
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "text/plain",
    },
    body: `search "${query}"; 
    fields name,platforms.name,first_release_date; 
    limit 10;
    offset ${offset};`,
  });

  const games = await igdbRes.json();
  return NextResponse.json(games);
}
