import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: Promise<{ accountNames: string[] }> },
) {
  const { accountNames } = await params;

  if (!accountNames || accountNames.length === 0) {
    return NextResponse.json(
      { error: "no accounts linked", length: "empty" },
      { status: 404 },
    );
  }

  // Get all games that match any account name
  const games = await prisma.game.findMany({
    where: {
      OR: accountNames.map((name) => ({
        platform: {
          contains: name,
        },
      })),
    },
  });

  const groupedGames: Record<string, typeof games> = {};

  accountNames.forEach((name) => {
    groupedGames[name] = games.filter((game) => game.platform.includes(name));
  });

  return NextResponse.json({ games: groupedGames }, { status: 200 });
}
