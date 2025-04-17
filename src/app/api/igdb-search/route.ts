import { NextResponse } from "next/server";

const CLIENT_ID = process.env.IGDB_CLIENT_ID as string;
const AUTH_TOKEN = `Bearer ${process.env.IGDB_AUTH_TOKEN}`;

export async function POST(req: Request) {
  const body = (await req.json()) as { query: string };
  const { query } = body;

  try {
    const igdbRes = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        "Client-ID": CLIENT_ID,
        Authorization: AUTH_TOKEN,
        "Content-Type": "text/plain",
      },
      body: `
        search "${query}";
        fields name, cover.image_id, platforms.name;
        limit 10;
      `,
    });

    const data = await igdbRes.json();

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("IGDB fetch failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
