/*
  Warnings:

  - You are about to drop the `CourseTerm` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "CourseTerm";

-- CreateTable
CREATE TABLE "Restriction" (
    "text" STRING NOT NULL,

    CONSTRAINT "Restriction_pkey" PRIMARY KEY ("text")
);

-- CreateTable
CREATE TABLE "Department" (
    "text" STRING NOT NULL,
    "title" STRING NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("text")
);

-- CreateTable
CREATE TABLE "School" (
    "text" STRING NOT NULL,

    CONSTRAINT "School_pkey" PRIMARY KEY ("text")
);

-- CreateTable
CREATE TABLE "CourseLevel" (
    "text" STRING NOT NULL,

    CONSTRAINT "CourseLevel_pkey" PRIMARY KEY ("text")
);

-- CreateTable
CREATE TABLE "Term" (
    "year" INT4 NOT NULL,
    "quarter" STRING NOT NULL,

    CONSTRAINT "Term_pkey" PRIMARY KEY ("year","quarter")
);
