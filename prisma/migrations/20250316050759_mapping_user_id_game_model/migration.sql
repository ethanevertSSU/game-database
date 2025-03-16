/*
  Warnings:

  - You are about to drop the column `userId` on the `game` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `game` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "game" DROP CONSTRAINT "game_userId_fkey";

-- AlterTable
ALTER TABLE "game" DROP COLUMN "userId",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "game" ADD CONSTRAINT "game_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
