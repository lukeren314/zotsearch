-- CreateTable
CREATE TABLE "Metadata" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "lastChecked" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastYear" STRING,
    "lastQuarter" STRING,
    "isUpdating" BOOL NOT NULL DEFAULT false,

    CONSTRAINT "Metadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" STRING NOT NULL,
    "department" STRING NOT NULL,
    "number" STRING NOT NULL,
    "departmentNumber" STRING NOT NULL,
    "school" STRING NOT NULL,
    "title" STRING NOT NULL,
    "description" STRING NOT NULL,
    "courseLevel" STRING NOT NULL,
    "departmentAlias" STRING NOT NULL,
    "unitsMin" FLOAT8 NOT NULL,
    "unitsMax" FLOAT8 NOT NULL,
    "departmentName" STRING NOT NULL,
    "prerequisiteText" STRING NOT NULL,
    "repeatability" STRING NOT NULL,
    "gradingOption" STRING NOT NULL,
    "concurrent" STRING NOT NULL,
    "sameAs" STRING NOT NULL,
    "restrictionText" STRING NOT NULL,
    "restrictions" STRING[],
    "overlap" STRING NOT NULL,
    "corequisite" STRING NOT NULL,
    "geText" STRING NOT NULL,
    "prerequisites" STRING[],
    "prerequisiteFor" STRING[],
    "geList" STRING[],
    "terms" STRING[],
    "tokens" STRING[],
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
    "averageGPA" FLOAT8,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Restriction" (
    "text" STRING NOT NULL,

    CONSTRAINT "Restriction_pkey" PRIMARY KEY ("text")
);

-- CreateTable
CREATE TABLE "Department" (
    "text" STRING NOT NULL,
    "name" STRING NOT NULL,

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
CREATE TABLE "CourseGe" (
    "text" STRING NOT NULL,

    CONSTRAINT "CourseGe_pkey" PRIMARY KEY ("text")
);

-- CreateTable
CREATE TABLE "Term" (
    "year" INT4 NOT NULL,
    "quarter" STRING NOT NULL,

    CONSTRAINT "Term_pkey" PRIMARY KEY ("year","quarter")
);
