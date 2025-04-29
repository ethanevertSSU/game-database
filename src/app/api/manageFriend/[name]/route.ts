import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

const prisma = new PrismaClient();
//call for manual game form input
export async function POST(
  req: Request,
  { params }: { params: Promise<{ accountId: string }> },
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const { accountId: usernameToFollow } = await params;

  const sessionUsername = session?.user.name ?? " ";

  const sessionUser = await prisma.user.findFirst({
    where: {
      name: sessionUsername,
    },
  });

  if (!sessionUser)
    return NextResponse.json(
      { error: "No such session found" },
      { status: 401 },
    );

  const followingUser = await prisma.user.findFirst({
    where: {
      name: usernameToFollow,
    },
  });

  if (!followingUser)
    return NextResponse.json(
      { error: "No such following user" },
      { status: 201 },
    );

  const isUserFollowed = await prisma.friends.findFirst({
    where: {
      userId: sessionUser.id,
      followingId: followingUser.id,
    },
  });

  const sessionFriendList = await prisma.friends.findMany({
    where: {
      userId: sessionUser.id,
    },
  });

  if (isUserFollowed)
    return NextResponse.json(
      { error: "User already followed", friendList: sessionFriendList },
      { status: 201 },
    );

  const followUser = await prisma.friends.create({
    data: {
      userId: sessionUser.id,
      followingId: followingUser.id,
    },
  });

  if (!followUser)
    return NextResponse.json(
      { error: "No such following user", friendList: sessionFriendList },
      { status: 201 },
    );

  return NextResponse.json({ friendList: sessionFriendList }, { status: 201 });
}
