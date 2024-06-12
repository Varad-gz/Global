/*
  Warnings:

  - You are about to drop the column `parentReplyId` on the `Reply` table. All the data in the column will be lost.
  - Made the column `commentId` on table `Reply` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Reply" DROP CONSTRAINT "Reply_commentId_fkey";

-- DropForeignKey
ALTER TABLE "Reply" DROP CONSTRAINT "Reply_parentReplyId_fkey";

-- AlterTable
ALTER TABLE "Reply" DROP COLUMN "parentReplyId",
ADD COLUMN     "repliedToWhom" TEXT,
ALTER COLUMN "commentId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
