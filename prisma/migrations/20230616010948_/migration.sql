/*
  Warnings:

  - You are about to drop the column `title` on the `Department` table. All the data in the column will be lost.
  - Added the required column `description` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Department` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "description" STRING NOT NULL;

-- AlterTable
ALTER TABLE "Department" DROP COLUMN "title";
ALTER TABLE "Department" ADD COLUMN     "name" STRING NOT NULL;

-- CreateTable
CREATE TABLE "CourseGe" (
    "text" STRING NOT NULL,

    CONSTRAINT "CourseGe_pkey" PRIMARY KEY ("text")
);
