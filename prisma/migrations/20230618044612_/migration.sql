-- CreateTable
CREATE TABLE "CourseGrade" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "courseId" STRING,
    "instructors" STRING[],
    "gradeACounts" INT4[],
    "gradeBCounts" INT4[],
    "gradeCCounts" INT4[],
    "gradeDCounts" INT4[],
    "gradeFCounts" INT4[],
    "gradePCounts" INT4[],
    "gradeNPCounts" INT4[],
    "gradeWCounts" INT4[],
    "averageGPAs" FLOAT8[],

    CONSTRAINT "CourseGrade_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CourseGrade" ADD CONSTRAINT "CourseGrade_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;
