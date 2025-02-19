-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "account_username" TEXT NOT NULL,
    "account_email" TEXT NOT NULL,
    "account_password" TEXT NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);
