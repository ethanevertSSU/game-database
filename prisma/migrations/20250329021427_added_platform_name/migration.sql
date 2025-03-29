/*
  Warnings:

  - You are about to drop the `linkedaccounts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "linkedaccounts" DROP CONSTRAINT "linkedaccounts_user_id_fkey";

-- DropTable
DROP TABLE "linkedaccounts";

-- CreateTable
CREATE TABLE "linked_accounts" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "external_platform_id" TEXT NOT NULL,
    "external_platform_user_name" TEXT NOT NULL,
    "platform_name" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "linked_accounts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "linked_accounts" ADD CONSTRAINT "linked_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
