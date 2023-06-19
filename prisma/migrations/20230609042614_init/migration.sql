/*
  Warnings:

  - Changed the type of `unitsMin` on the `Course` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `unitsMax` on the `Course` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "unitsMin";
ALTER TABLE "Course" ADD COLUMN     "unitsMin" FLOAT8 NOT NULL;
ALTER TABLE "Course" DROP COLUMN "unitsMax";
ALTER TABLE "Course" ADD COLUMN     "unitsMax" FLOAT8 NOT NULL;
