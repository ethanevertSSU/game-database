import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PUT(req: NextRequest) {
    const { userId, bio, avatarUrl, level } = await req.json();

    if (!userId) return NextResponse.json({ error: "User ID is required" }, { status: 400 });

    try {
        const updatedProfile = await prisma.profile.update({
            where: { userId },
            data: { bio, avatarUrl, level },
        });

        return NextResponse.json(updatedProfile);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}