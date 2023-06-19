/*
  Warnings:

  - Added the required column `fullText` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "fullText" STRING NOT NULL;
