-- CreateTable
CREATE TABLE "Friends" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "following_id" TEXT NOT NULL,

    CONSTRAINT "Friends_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
