/*
  Warnings:

  - You are about to drop the column `Notes` on the `game` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `game` table. All the data in the column will be lost.
  - You are about to drop the column `gameName` on the `game` table. All the data in the column will be lost.
  - You are about to drop the column `gamePicture` on the `game` table. All the data in the column will be lost.
  - You are about to drop the column `gameType` on the `game` table. All the data in the column will be lost.
  - You are about to drop the column `platform` on the `game` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `game` table. All the data in the column will be lost.
  - Added the required column `game_name` to the `game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `game_platform` to the `game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `game_type` to the `game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "game" DROP COLUMN "Notes",
DROP COLUMN "createdAt",
DROP COLUMN "gameName",
DROP COLUMN "gamePicture",
DROP COLUMN "gameType",
DROP COLUMN "platform",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "game_name" TEXT NOT NULL,
ADD COLUMN     "game_notes" TEXT,
ADD COLUMN     "game_picture" TEXT,
ADD COLUMN     "game_platform" TEXT NOT NULL,
ADD COLUMN     "game_type" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3);
