import { NextRequest, NextResponse } from "next/server";
import database from "@/lib/database";
import { Restriction } from "@prisma/client";
import { DEFAULT_RESTRICTION_TEXT } from "@/lib/const";

export async function GET(request: NextRequest) {
  const DEFAULT_RESTRICTION: Restriction = { text: DEFAULT_RESTRICTION_TEXT };
  const restrictions = [DEFAULT_RESTRICTION].concat(
    await database.getRestrictions()
  );
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
    ges,
  });
}
