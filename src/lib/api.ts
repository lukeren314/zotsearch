import fetch from "node-fetch";
import { CourseRaw, ScheduleOfClassesRaw, GradeRaw } from "./databaseTypes";
import { Term } from "@prisma/client";

export async function fetchCoursesRaw(): Promise<CourseRaw[]> {
  const response = await fetch(
    "https://api.peterportal.org/rest/v0/courses/all"
  );
  const data = (await response.json()) as Promise<CourseRaw[]>;
  return data;
}

export async function fetchGradeRaws(): Promise<GradeRaw[]> {
  const response = await fetch(
    "https://api.peterportal.org/rest/v0/grades/raw"
  );
  const data = (await response.json()) as Promise<GradeRaw[]>;
  return data;
}

export async function fetchScheduleOfClassesRaw(
  term: Term
): Promise<ScheduleOfClassesRaw> {
  // see if there is the schedule of classes for the next ICS 31 session
  const response = await fetch(
    `https://api.peterportal.org/rest/v0/schedule/soc?term=${term.year}%20${term.quarter}&department=I%26C%20SCI&courseNumber=31`
  );
  const data = (await response.json()) as Promise<ScheduleOfClassesRaw>;
  return data;
}
