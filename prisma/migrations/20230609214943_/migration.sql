/*
  Warnings:

  - You are about to drop the column `fullText` on the `Course` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "fullText";
ALTER TABLE "Course" ADD COLUMN     "tokens" STRING[];

-- CreateTable
CREATE TABLE "CourseRestriction" (
    "text" STRING NOT NULL,

    CONSTRAINT "CourseRestriction_pkey" PRIMARY KEY ("text")
);
