import type { NextApiRequest, NextApiResponse } from "next";

const CLIENT_ID = "bz7ocndodrnlkdpe3venwbqmfuwttm";
const AUTH_TOKEN = "j7dlfr4o9fnbol7x593n1q66w1ecun";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  const { query } = req.body;

  try {
    const igdbRes = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        "Client-ID": CLIENT_ID,
        Authorization: `Bearer ${AUTH_TOKEN}`,
        "Content-Type": "text/plain",
      },
      body: `
        search "${query}";
        fields name, summary, cover.image_id, platforms.name;
        limit 10;
      `,
    });

    const data = await igdbRes.json();

    res.status(200).json(data);
  } catch (error) {
    console.error("IGDB fetch failed:", error);
    res.status(500).json({ error: "IGDB search failed" });
  }
}
