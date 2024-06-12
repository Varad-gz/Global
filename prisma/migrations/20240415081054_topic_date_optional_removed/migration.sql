/*
  Warnings:

  - Made the column `createdAt` on table `Topic` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Topic" ALTER COLUMN "createdAt" SET NOT NULL;
