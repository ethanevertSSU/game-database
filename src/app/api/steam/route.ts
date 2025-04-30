import { NextRequest, NextResponse } from "next/server";
import { getSteamGames, getSteamPlayerInfo } from "@/app/api/steam/steam";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

const returnURL = process.env.BETTER_AUTH_URL;
const prisma = new PrismaClient();

async function fetchGenresFromIGDB(
  appIds: string[],
): Promise<Record<string, string[]>> {
  const IGDB_AUTH_URL = "https://id.twitch.tv/oauth2/token";
  const IGDB_GAMES_URL = "https://api.igdb.com/v4/external_games";
  const clientId = process.env.IGDB_CLIENT_ID!;

  const access_token = process.env.IGDB_AUTH_TOKEN;

  const genreMap: Record<string, string[]> = {};

  // Break into chunks of 400 appIds at a time (IGDB API limit)
  for (let i = 0; i < appIds.length; i += 400) {
    const chunk = appIds.slice(i, i + 400);
    const uidList = chunk.map((id) => `"${id}"`).join(", ");
    const query = `fields uid, game.genres.name; where uid = (${uidList}) & category = 1; limit 400;`;

    const igdbResponse = await fetch(IGDB_GAMES_URL, {
      method: "POST",
      headers: {
        "Client-ID": clientId,
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "text/plain",
      },
      body: query,
    });

    if (!igdbResponse.ok) {
      throw new Error("Failed to fetch games from IGDB");
    }

    const igdbResults = await igdbResponse.json();

    console.log("igdbResults: ", igdbResults);

    for (const result of igdbResults) {
      if (result.uid && result.game?.genres?.length) {
        genreMap[result.uid] = result.game.genres.map(
          (g: { name: string }) => g.name,
        );
      }
    }
  }

  return genreMap;
}

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

  // Optional: Store in a session/database here if needed
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
      const userAlreadyExists = await prisma.linkedAccounts.findFirst({
        where: {
          externalPlatformId: steamId,
        },
      });
      if (!userAlreadyExists) {
        console.log("user does not exist");
        const addSteamAccount = await prisma.linkedAccounts.create({
          data: {
            externalPlatformId: steamId,
            externalPlatformUserName: steamUsername,
            platformName: "Steam",
            user: {
              connect: { id: user.id },
            },
          },
        });

        const appIds = gameInfo.games.map((g) => g.appid.toString());
        const genreMap = await fetchGenresFromIGDB(appIds);

        await Promise.all(
          gameInfo.games.map(async (game) => {
            const gameName = game.name;
            const gamePlatform = `Steam (PC): ${steamUsername}`;
            const physOrDig = "digital";
            const gamePicture = `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${game.appid}/header.jpg?`;
            const appId = game.appid.toString();
            const genreTags = genreMap[appId]
              ? genreMap[appId]
                  .map((g) => `#${g.replace(/\s+/g, "")}`)
                  .join(" ")
              : "";

            await prisma.game.create({
              data: {
                gameName: gameName,
                platform: gamePlatform,
                gameType: physOrDig,
                gamePicture: gamePicture,
                externalAppId: appId,
                Notes: genreTags,
                user: {
                  connect: { id: user.id },
                },
              },
            });
          }),
        );

        console.log("steam account linked", addSteamAccount);
      } else {
        console.log("steam account already exist", steamUsername);
      }
    }
  }
  return NextResponse.redirect(`${returnURL}/profile?steamId=${steamId}`);
}
