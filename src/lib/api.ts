import fetch from "node-fetch";
import { CourseRaw, GradeRaw } from "./databaseTypes";
import { Course, Term } from "@prisma/client";

export async function fetchCoursesRaw(): Promise<CourseRaw[]> {
  const response = await fetch(
    "https://api.peterportal.org/rest/v0/courses/all"
  );
  const data = (await response.json()) as CourseRaw[];
  return data;
}

export async function fetchGradeRaws(): Promise<GradeRaw[]> {
  const response = await fetch(
    "https://api.peterportal.org/rest/v0/grades/raw"
  );
  const data = (await response.json()) as GradeRaw[];
  return data;
}

export async function fetchCourseTerms(): Promise<string[]> {
  const response = await fetch(
    "https://api.peterportal.org/rest/v0/courses/MATH2B"
  );
  const data = (await response.json()) as Course;
  const terms = data.terms;
  return terms;
}
