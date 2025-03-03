"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function checkUser(username: string) {
  return prisma.user.findFirst({
    where: { name: username },
  });
}
