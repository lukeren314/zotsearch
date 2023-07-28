import { NextRequest, NextResponse } from "next/server";
import database from "@/lib/database";
import { SearchParams } from "@/lib/databaseTypes";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const params: SearchParams = {};
  params.searchQuery = searchParams.get("searchQuery") || undefined;
  params.departmentsAny =
    searchParams
      .get("department")
      ?.split(",")
      .filter((s) => s) || undefined;
  params.number = searchParams.get("number")?.toUpperCase() || undefined;
  params.schoolsAny =
    searchParams
      .get("school")
      ?.split(",")
      .filter((s) => s) || undefined;
  params.courseLevel = searchParams.get("courseLevel") || undefined;
  const unitsMin = searchParams.get("unitsMin");
  if (unitsMin) {
    params.unitsMin = parseInt(unitsMin);
  }
  const unitsMax = searchParams.get("unitsMax");
  if (unitsMax) {
    params.unitsMax = parseInt(unitsMax);
  }
  params.prerequisitesNot = searchParams.get("prerequisitesNot")?.toUpperCase() || undefined;
  params.restrictionsNot =
    searchParams
      .get("restrictionsNot")
      ?.split(",")
      .filter((s) => s) || undefined;
  // params.ignore =
  //   searchParams
  //     .get("ignore")
  //     ?.split(",")
  //     .filter((s) => s) || undefined;
  params.geAll =
    searchParams
      .get("geAnd")
      ?.split(",")
      .filter((s) => s) || undefined;
  params.geAny =
    searchParams
      .get("geOr")
      ?.split(",")
      .filter((s) => s) || undefined;
  params.orderBy = searchParams.get("orderBy") || undefined;
  params.orderByDirection = searchParams.get("orderByDirection") || undefined;
  const page = searchParams.get("page");
  if (page) {
    params.page = parseInt(page);
  }
  const pageSize = searchParams.get("pageSize");
  if (pageSize) {
    params.pageSize = parseInt(pageSize);
  }
  console.log(params);
  const courses = await database.searchCourses(params);
  return NextResponse.json({ courses });
}
