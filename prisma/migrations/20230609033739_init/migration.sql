-- CreateTable
CREATE TABLE "Metadata" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

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
    "courseLevel" STRING NOT NULL,
    "departmentAlias" STRING NOT NULL,
    "unitsMin" INT4 NOT NULL,
    "unitsMax" INT4 NOT NULL,
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

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);
