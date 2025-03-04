import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
export async function POST(req: Request) {
  try {
    const { username } = await req.json();

    const userCheck = await prisma.user.findFirst({
      where: {
        name: username,
      },
    });

    if (userCheck) {
      return NextResponse.json(
        { error: "User Already Taken. Please Try Another Name" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: true, user: userCheck },
      { status: 200 },
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
