import { NextRequest, NextResponse } from "next/server";
import database from "@/lib/database";

export async function GET(request: NextRequest) {
  const restrictions = await database.getRestrictions();
  const departments = await database.getDepartments();
  const schools = await database.getSchools();
  const courseLevels = await database.getCourseLevels();
  const terms = await database.getTerms();
  const ges = await database.getGes();
  return NextResponse.json({
    restrictions,
    departments,
    schools,
    courseLevels,
    terms,
    ges
  });
}
