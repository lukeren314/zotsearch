import {
  CourseLevel,
  Department,
  School,
  Restriction,
  CourseGe,
  Prisma,
  Term,
} from "@prisma/client";

export interface CourseRaw {
  id: string;
  department: string;
  number: string;
  school: string;
  title: string;
  course_level: string;
  department_alias: string[];
  units: number[];
  description: string;
  department_name: string;
  professor_history: string[];
  prerequisite_tree: string;
  prerequisite_list: string[];
  prerequisite_text: string;
  prerequisite_for: string[];
  repeatability: string;
  grading_option: string;
  concurrent: string;
  same_as: string;
  restriction: string;
  overlap: string;
  corequisite: string;
  ge_list: string[];
  ge_text: string;
  terms: string[];
}

export interface GradeRaw {
  year: string;
  quarter: string;
  department: string;
  number: string;
  code: number;
  section: string;
  instructor: string;
  type: string;
  gradeACount: number;
  gradeBCount: number;
  gradeCCount: number;
  gradeDCount: number;
  gradeFCount: number;
  gradePCount: number;
  gradeNPCount: number;
  gradeWCount: number;
  averageGPA: number;
}

export type Quarter =
  | "Fall"
  | "Winter"
  | "Spring"
  | "Summer10wk"
  | "Summer1"
  | "Summer2";

export interface GradesData {
  instructors: string[];
  gradeACounts: number[];
  gradeBCounts: number[];
  gradeCCounts: number[];
  gradeDCounts: number[];
  gradeFCounts: number[];
  gradePCounts: number[];
  gradeNPCounts: number[];
  gradeWCounts: number[];
  averageGPAs: number[];
}

export interface GradesDataMap {
  [courseId: string]: GradesData;
}

export interface SearchParams {
  searchQuery?: string;
  departmentsAny?: string[];
  number?: string;
  schoolsAny?: string[];
  title?: string;
  courseLevel?: string;
  unitsMin?: number;
  unitsMax?: number;
  prerequisitesNot?: string;
  restrictionsNot?: string[];
  ignore?: string[];
  geAll?: string[];
  geAny?: string[];
  term?: string;
  orderBy?: string;
  orderByDirection?: string;
  page?: number;
  pageSize?: number;
}

export interface QueryParams {
  where?: Prisma.CourseWhereInput;
  orderBy?: any;
  skip?: number;
  take?: number;
}

export interface FilterOptions {
  restrictions?: Restriction[];
  departments?: Department[];
  schools?: School[];
  courseLevels?: CourseLevel[];
  terms?: Term[];
  ges?: CourseGe[];
}
