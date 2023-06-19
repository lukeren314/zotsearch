/*
  Warnings:

  - You are about to drop the column `id` on the `CourseGrade` table. All the data in the column will be lost.
  - Added the required column `term` to the `CourseGrade` table without a default value. This is not possible if the table is not empty.
  - Made the column `courseId` on table `CourseGrade` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
CREATE TABLE "_prisma_new_CourseGrade" (
    "courseId" STRING NOT NULL,
    "term" STRING NOT NULL,
    "instructor" STRING NOT NULL,
    "gradeACount" INT4 NOT NULL,
    "gradeBCount" INT4 NOT NULL,
    "gradeCCount" INT4 NOT NULL,
    "gradeDCount" INT4 NOT NULL,
    "gradeFCount" INT4 NOT NULL,
    "gradePCount" INT4 NOT NULL,
    "gradeNPCount" INT4 NOT NULL,
    "gradeWCount" INT4 NOT NULL,
    "averageGPA" FLOAT8 NOT NULL,

    CONSTRAINT "CourseGrade_pkey" PRIMARY KEY ("courseId","term")
);
INSERT INTO "_prisma_new_CourseGrade" ("averageGPA","courseId","gradeACount","gradeBCount","gradeCCount","gradeDCount","gradeFCount","gradeNPCount","gradePCount","gradeWCount","instructor") SELECT "averageGPA","courseId","gradeACount","gradeBCount","gradeCCount","gradeDCount","gradeFCount","gradeNPCount","gradePCount","gradeWCount","instructor" FROM "CourseGrade";
DROP TABLE "CourseGrade" CASCADE;
ALTER TABLE "_prisma_new_CourseGrade" RENAME TO "CourseGrade";
ALTER TABLE "CourseGrade" ADD CONSTRAINT "CourseGrade_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
