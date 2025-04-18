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

    const steamAccount = await prisma.linkedAccounts.findFirst({
      where: {
        id: accountId,
      },
    });

    const steamUsername = steamAccount?.externalPlatformUserName;
    console.log(steamUsername);

    await prisma.linkedAccounts.delete({
      where: {
        id: accountId,
      },
    });
    console.log("Account deleted successfully");

    console.log(steamUsername);

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
        await prisma.game.deleteMany({
          where: {
            userId: user.id,
            platform: `Steam (PC): ${steamUsername}`,
          },
        });
        console.log("Steam Games Deleted From Account", username);
      }
    }

    return NextResponse.json(
      { message: "Account unlinked successfully" },
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
