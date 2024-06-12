/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[url]` on the table `Topic` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `url` to the `Topic` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "url" TEXT;

-- AlterTable
ALTER TABLE "Topic" ADD COLUMN     "url" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Category_url_key" ON "Category"("url");

-- CreateIndex
CREATE INDEX "categoryUrlIndex" ON "Category"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Topic_url_key" ON "Topic"("url");

-- CreateIndex
CREATE INDEX "topicUrlIndex" ON "Topic"("url");
