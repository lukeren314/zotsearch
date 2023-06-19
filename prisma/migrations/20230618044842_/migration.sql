/*
  Warnings:

  - You are about to drop the column `averageGPAs` on the `CourseGrade` table. All the data in the column will be lost.
  - You are about to drop the column `gradeACounts` on the `CourseGrade` table. All the data in the column will be lost.
  - You are about to drop the column `gradeBCounts` on the `CourseGrade` table. All the data in the column will be lost.
  - You are about to drop the column `gradeCCounts` on the `CourseGrade` table. All the data in the column will be lost.
  - You are about to drop the column `gradeDCounts` on the `CourseGrade` table. All the data in the column will be lost.
  - You are about to drop the column `gradeFCounts` on the `CourseGrade` table. All the data in the column will be lost.
  - You are about to drop the column `gradeNPCounts` on the `CourseGrade` table. All the data in the column will be lost.
  - You are about to drop the column `gradePCounts` on the `CourseGrade` table. All the data in the column will be lost.
  - You are about to drop the column `gradeWCounts` on the `CourseGrade` table. All the data in the column will be lost.
  - You are about to drop the column `instructors` on the `CourseGrade` table. All the data in the column will be lost.
  - Added the required column `averageGPA` to the `CourseGrade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gradeACount` to the `CourseGrade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gradeBCount` to the `CourseGrade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gradeCCount` to the `CourseGrade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gradeDCount` to the `CourseGrade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gradeFCount` to the `CourseGrade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gradeNPCount` to the `CourseGrade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gradePCount` to the `CourseGrade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gradeWCount` to the `CourseGrade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instructor` to the `CourseGrade` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CourseGrade" DROP COLUMN "averageGPAs";
ALTER TABLE "CourseGrade" DROP COLUMN "gradeACounts";
ALTER TABLE "CourseGrade" DROP COLUMN "gradeBCounts";
ALTER TABLE "CourseGrade" DROP COLUMN "gradeCCounts";
ALTER TABLE "CourseGrade" DROP COLUMN "gradeDCounts";
ALTER TABLE "CourseGrade" DROP COLUMN "gradeFCounts";
ALTER TABLE "CourseGrade" DROP COLUMN "gradeNPCounts";
ALTER TABLE "CourseGrade" DROP COLUMN "gradePCounts";
ALTER TABLE "CourseGrade" DROP COLUMN "gradeWCounts";
ALTER TABLE "CourseGrade" DROP COLUMN "instructors";
ALTER TABLE "CourseGrade" ADD COLUMN     "averageGPA" FLOAT8 NOT NULL;
ALTER TABLE "CourseGrade" ADD COLUMN     "gradeACount" INT4 NOT NULL;
ALTER TABLE "CourseGrade" ADD COLUMN     "gradeBCount" INT4 NOT NULL;
ALTER TABLE "CourseGrade" ADD COLUMN     "gradeCCount" INT4 NOT NULL;
ALTER TABLE "CourseGrade" ADD COLUMN     "gradeDCount" INT4 NOT NULL;
ALTER TABLE "CourseGrade" ADD COLUMN     "gradeFCount" INT4 NOT NULL;
ALTER TABLE "CourseGrade" ADD COLUMN     "gradeNPCount" INT4 NOT NULL;
ALTER TABLE "CourseGrade" ADD COLUMN     "gradePCount" INT4 NOT NULL;
ALTER TABLE "CourseGrade" ADD COLUMN     "gradeWCount" INT4 NOT NULL;
ALTER TABLE "CourseGrade" ADD COLUMN     "instructor" STRING NOT NULL;
