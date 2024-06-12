/*
  Warnings:

  - Added the required column `url` to the `Thread` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Thread" ADD COLUMN     "url" TEXT NOT NULL;
