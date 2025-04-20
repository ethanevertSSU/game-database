/*
  Warnings:

  - Added the required column `game_name_achievements` to the `Achievement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Achievement" ADD COLUMN     "game_name_achievements" TEXT NOT NULL;
