import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { name: usernameToFollow } = await params;

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

  return NextResponse.json({ friendList: sessionFriendList }, { status: 201 });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { name: usernameToFollow } = await params;
  const sessionUsername = session?.user.name ?? "";

  if (!sessionUsername) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sessionUser = await prisma.user.findFirst({
    where: { name: sessionUsername },
  });

  if (!sessionUser) {
    return NextResponse.json(
      { error: "Session user not found" },
      { status: 401 },
    );
  }

  const followingUser = await prisma.user.findFirst({
    where: { name: usernameToFollow },
  });

  if (!followingUser) {
    return NextResponse.json(
      { error: "User to follow not found" },
      { status: 404 },
    );
  }

  const isUserFollowed = await prisma.friends.findFirst({
    where: {
      userId: sessionUser.id,
      followingId: followingUser.id,
    },
  });

  if (isUserFollowed) {
    const friendList = await prisma.friends.findMany({
      where: { userId: sessionUser.id },
    });

    return NextResponse.json(
      { error: "User already followed", friendList },
      { status: 400 },
    );
  }

  const followUser = await prisma.friends.create({
    data: {
      userId: sessionUser.id,
      followingId: followingUser.id,
    },
  });

  const updatedFriendList = await prisma.friends.findMany({
    where: { userId: sessionUser.id },
  });

  return NextResponse.json(
    { message: "Successfully followed user", friendList: updatedFriendList },
    { status: 201 },
  );
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { name: usernameToFollow } = await params;
  const sessionUsername = session?.user.name ?? "";

  if (!sessionUsername) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sessionUser = await prisma.user.findFirst({
    where: { name: sessionUsername },
  });

  if (!sessionUser) {
    return NextResponse.json(
      { error: "Session user not found" },
      { status: 401 },
    );
  }

  const followingUser = await prisma.user.findFirst({
    where: { name: usernameToFollow },
  });

  if (!followingUser) {
    return NextResponse.json(
      { error: "User to unfollow not found" },
      { status: 404 },
    );
  }

  const isUserFollowed = await prisma.friends.findFirst({
    where: {
      userId: sessionUser.id,
      followingId: followingUser.id,
    },
  });

  if (!isUserFollowed) {
    return NextResponse.json(
      { error: "Not following this user" },
      { status: 400 },
    );
  }

  await prisma.friends.deleteMany({
    where: {
      userId: sessionUser.id,
      followingId: followingUser.id,
    },
  });

  const updatedFriendList = await prisma.friends.findMany({
    where: {
      userId: sessionUser.id,
    },
  });

  return NextResponse.json(
    { message: "Successfully unfollowed user", updatedFriendList },
    { status: 200 },
  );
}
