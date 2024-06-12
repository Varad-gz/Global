/*
  Warnings:

  - Added the required column `creatorID` to the `Topic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Topic` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Topic" ADD COLUMN     "creatorID" INTEGER NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "picture" TEXT;

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_creatorID_fkey" FOREIGN KEY ("creatorID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
