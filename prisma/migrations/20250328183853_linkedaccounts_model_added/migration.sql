-- CreateTable
CREATE TABLE "linkedaccounts" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "external_platform_id" TEXT NOT NULL,
    "platform_name" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "linkedaccounts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "linkedaccounts" ADD CONSTRAINT "linkedaccounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
