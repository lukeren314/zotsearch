/*
  Warnings:

  - You are about to drop the column `lastUpdated` on the `Metadata` table. All the data in the column will be lost.
  - You are about to drop the `CourseRestriction` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Metadata" DROP COLUMN "lastUpdated";
ALTER TABLE "Metadata" ADD COLUMN     "lastChecked" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Metadata" ADD COLUMN     "lastQuarter" STRING;
ALTER TABLE "Metadata" ADD COLUMN     "lastYear" STRING;

-- DropTable
DROP TABLE "CourseRestriction";

-- CreateTable
CREATE TABLE "CourseTerm" (
    "text" STRING NOT NULL,

    CONSTRAINT "CourseTerm_pkey" PRIMARY KEY ("text")
);
