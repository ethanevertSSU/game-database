import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
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
      const getLinkedAccounts = await prisma.linkedAccounts.findMany({
        where: {
          userId: user.id,
        },
      });

      return NextResponse.json(
        { linkedAccounts: getLinkedAccounts },
        { status: 201 },
      );
    }
  }
}

export async function DELETE(req: Request) {
  try {
    const { accountId } = await req.json();

    const account = await prisma.linkedAccounts.findFirst({
      where: { id: accountId },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const platform = account.platformName;
    const platformUser = account.externalPlatformUserName;

    await prisma.linkedAccounts.delete({
      where: { id: accountId },
    });
    console.log(`${platform} Account deleted successfully`);

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const username = session?.user.name ?? " ";

    if (session) {
      const user = await prisma.user.findFirst({
        where: { name: username },
      });

      if (user) {
        let platformPrefix = "";
        if (platform === "Steam") {
          platformPrefix = `Steam (PC): ${platformUser}`;
        } else if (platform === "Xbox") {
          platformPrefix = `Xbox: ${platformUser}`;
        }

        await prisma.game.deleteMany({
          where: {
            userId: user.id,
            platform: platformPrefix,
          },
        });

        console.log(`${platform} games deleted for user`, username);
      }
    }

    return NextResponse.json(
      { message: `${platform} account unlinked successfully` },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error unlinking account:", error);
    return NextResponse.json(
      { error: "Failed to unlink account" },
      { status: 500 },
    );
  }
}
