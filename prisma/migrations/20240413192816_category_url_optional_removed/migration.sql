/*
  Warnings:

  - Made the column `url` on table `Category` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "url" SET NOT NULL;
