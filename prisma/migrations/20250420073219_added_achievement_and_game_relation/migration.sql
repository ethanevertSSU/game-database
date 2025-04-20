-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "unlock_time" INTEGER NOT NULL,
    "achievement_name" TEXT NOT NULL,
    "achievement_desc" TEXT NOT NULL,
    "achievement_picture" TEXT,
    "achievment_id" TEXT NOT NULL,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_achievment_id_fkey" FOREIGN KEY ("achievment_id") REFERENCES "game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
