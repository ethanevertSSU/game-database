-- CreateTable
CREATE TABLE "game" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),
    "gameName" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "gameType" TEXT NOT NULL,
    "Notes" TEXT NOT NULL,
    "gamePicture" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "game_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "game" ADD CONSTRAINT "game_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
