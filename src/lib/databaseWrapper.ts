import {
  Metadata,
  Course,
  Term,
  Restriction,
  Department,
  School,
  CourseLevel,
  CourseGe,
  Prisma,
  PrismaClient,
} from "@prisma/client";
import {
  CourseRaw,
  SearchParams,
  QueryParams,
  Quarter,
  GradeRaw,
  GradesData,
  GradesDataMap,
} from "./databaseTypes";
import { fetchCourseTerms, fetchCoursesRaw, fetchGradeRaws } from "@/lib/api";
import prisma from "./prisma";
import { removeStopwords } from "stopword";
const UPDATE_INTERVAL = 1000 * 60 * 60 * 24;

class DatabaseWrapper {
  db: PrismaClient;
  public constructor() {
    this.db = prisma;
  }
  public async getShouldUpdate(): Promise<boolean> {
    // check if courses need to be updated
    const metadata = await this._getMetadata();
    if (!metadata.lastYear || !metadata.lastQuarter) {
      const term = await this._getNewestTerm();
      this._updateMetadataLastTerm(metadata, term);
      return true;
    }
    if (
      new Date().getTime() - metadata.lastChecked.getTime() <
      UPDATE_INTERVAL
    ) {
      return false;
    }
    if (metadata.isUpdating) {
      return false;
    }
    this._updateMetadataLastChecked(metadata);
    const termString = await this._getNewestTermString();
    if (termString == this._getTermString(metadata.lastYear, metadata.lastQuarter)) {
      return false;
    }
    this._updateMetadataLastTerm(metadata, this._getTerm(termString));
    return true;
  }
  private _getTermString(year: string, quarter: string): string {
    return `${year} ${quarter}`;
  }
  public async updateCourses() {
    const metadata = await this._getMetadata();
    await this._setMetadataIsUpdating(metadata, true);
    const courses = await this.getCourses();
    await this._updateCourseDB(courses);
    await this._setMetadataIsUpdating(metadata, false);
  }
  private async _setMetadataIsUpdating(
    metadata: Metadata,
    isUpdating: boolean
  ) {
    await this.db.metadata.update({
      where: { id: metadata.id },
      data: { isUpdating },
    });
  }
  public async searchCourses(params: SearchParams): Promise<Course[]> {
    if (await this._isUpdating()) {
      return [];
    }
    const queryParams = this._convertParams(params);
    return await this.db.course.findMany(queryParams);
  }
  private async _isUpdating(): Promise<boolean> {
    const metadata = await this._getMetadata();
    return metadata.isUpdating;
  }
  public async getRestrictions(): Promise<Restriction[]> {
    return await this.db.restriction.findMany();
  }
  public async getDepartments(): Promise<Department[]> {
    return await this.db.department.findMany();
  }
  public async getSchools(): Promise<School[]> {
    return await this.db.school.findMany();
  }
  public async getCourseLevels(): Promise<CourseLevel[]> {
    return await this.db.courseLevel.findMany();
  }
  public async getGes(): Promise<CourseGe[]> {
    return await this.db.courseGe.findMany();
  }
  public async getTerms(): Promise<Term[]> {
    return await this.db.term.findMany();
  }
  public async getCourses(): Promise<Course[]> {
    const coursesRaw = await fetchCoursesRaw();
    const gradeRaws = await fetchGradeRaws();
    const gradesDataMap: GradesDataMap = this._getGradesDataMap(gradeRaws);
    return Promise.all(
      coursesRaw.map(async (courseRaw) =>
        this._convertCourseRaw(courseRaw, gradesDataMap[courseRaw.id])
      )
    );
  }
  private async _getMetadata(): Promise<Metadata> {
    const metadata = await this.db.metadata.findFirst();
    if (metadata) {
      return metadata;
    }
    return await this.db.metadata.create({ data: {} });
  }
  private async _updateMetadataLastChecked(metadata: Metadata) {
    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    await this.db.metadata.update({
      where: { id: metadata.id },
      data: { lastChecked: today },
    });
  }
  private async _getNewestTerm(): Promise<Term> {
    return this._getTerm(await this._getNewestTermString());
  }
  private async _getNewestTermString(): Promise<string> {
    const availableTerms = await fetchCourseTerms();
    return availableTerms[availableTerms.length - 1];
  }
  private async _updateCourseDB(courses: Course[]) {
    await this.db.course.deleteMany();
    await this.db.restriction.deleteMany();
    await this.db.department.deleteMany();
    await this.db.school.deleteMany();
    await this.db.courseLevel.deleteMany();
    await this.db.term.deleteMany();
    await this.db.courseGe.deleteMany();

    await this.db.course.createMany({
      data: courses,
    });
    await this.db.term.createMany({
      data: this._getCourseTerms(courses),
    });
    await this.db.restriction.createMany({
      data: this._getCourseRestrictions(courses),
    });
    await this.db.department.createMany({
      data: this._getCourseDepartments(courses),
    });
    await this.db.school.createMany({
      data: this._getCourseSchools(courses),
    });
    await this.db.courseLevel.createMany({
      data: this._getCourseLevels(courses),
    });
    await this.db.courseGe.createMany({
      data: this._getCourseGes(courses),
    });
  }
  private async _updateMetadataLastTerm(metadata: Metadata, term: Term) {
    await this.db.metadata.update({
      where: { id: metadata.id },
      data: {
        lastYear: term.year.toString(),
        lastQuarter: term.quarter,
      },
    });
  }
  private _getTerm(termString: string): Term {
    const termSplit = termString.split(" ");
    return { year: parseInt(termSplit[0]), quarter: termSplit[1] };
  }
  private _getGradesDataMap(gradeRaws: GradeRaw[]): GradesDataMap {
    const gradesDataMap: GradesDataMap = {};
    for (let gradeRaw of gradeRaws) {
      const id = this._getCourseId(gradeRaw.department, gradeRaw.number);
      if (id in gradesDataMap) {
        gradesDataMap[id] = this._updateGradesData(gradesDataMap[id], gradeRaw);
      } else {
        gradesDataMap[id] = {
          instructors: [gradeRaw.instructor],
          gradeACounts: [gradeRaw.gradeACount],
          gradeBCounts: [gradeRaw.gradeBCount],
          gradeCCounts: [gradeRaw.gradeCCount],
          gradeDCounts: [gradeRaw.gradeDCount],
          gradeFCounts: [gradeRaw.gradeFCount],
          gradePCounts: [gradeRaw.gradePCount],
          gradeNPCounts: [gradeRaw.gradeNPCount],
          gradeWCounts: [
            gradeRaw.gradeACount +
              gradeRaw.gradeBCount +
              gradeRaw.gradeCCount +
              gradeRaw.gradeDCount +
              gradeRaw.gradeFCount +
              gradeRaw.gradePCount +
              gradeRaw.gradeNPCount,
          ],
          averageGPAs: [gradeRaw.averageGPA || 0],
        };
      }
    }
    return gradesDataMap;
  }
  private _updateGradesData(
    gradesData: GradesData,
    gradeRaw: GradeRaw
  ): GradesData {
    if (gradesData.instructors.indexOf(gradeRaw.instructor) > -1) {
      const i = gradesData.instructors.indexOf(gradeRaw.instructor);
      gradesData.gradeACounts[i] += gradeRaw.gradeACount;
      gradesData.gradeBCounts[i] += gradeRaw.gradeBCount;
      gradesData.gradeCCounts[i] += gradeRaw.gradeCCount;
      gradesData.gradeDCounts[i] += gradeRaw.gradeDCount;
      gradesData.gradeFCounts[i] += gradeRaw.gradeFCount;
      gradesData.gradePCounts[i] += gradeRaw.gradePCount;
      gradesData.gradeNPCounts[i] += gradeRaw.gradeNPCount;
      gradesData.gradeWCounts[i] +=
        gradeRaw.gradeACount +
        gradeRaw.gradeBCount +
        gradeRaw.gradeCCount +
        gradeRaw.gradeDCount +
        gradeRaw.gradeFCount +
        gradeRaw.gradePCount +
        gradeRaw.gradeNPCount;
      gradesData.averageGPAs[i] =
        (gradesData.averageGPAs[i] + gradeRaw.averageGPA) / 2;
      return gradesData;
    }
    gradesData.instructors.push(gradeRaw.instructor);
    gradesData.gradeACounts.push(gradeRaw.gradeACount);
    gradesData.gradeBCounts.push(gradeRaw.gradeBCount);
    gradesData.gradeCCounts.push(gradeRaw.gradeCCount);
    gradesData.gradeDCounts.push(gradeRaw.gradeDCount);
    gradesData.gradeFCounts.push(gradeRaw.gradeFCount);
    gradesData.gradePCounts.push(gradeRaw.gradePCount);
    gradesData.gradeNPCounts.push(gradeRaw.gradeNPCount);
    gradesData.gradeWCounts.push(
      gradeRaw.gradeACount +
        gradeRaw.gradeBCount +
        gradeRaw.gradeCCount +
        gradeRaw.gradeDCount +
        gradeRaw.gradeFCount +
        gradeRaw.gradePCount +
        gradeRaw.gradeNPCount
    );
    gradesData.averageGPAs.push(gradeRaw.averageGPA || 0);
    return gradesData;
  }
  private _getCourseId(department: string, number: string): string {
    return (department + number).replace(/\s/g, "");
  }
  private _convertCourseRaw(
    courseRaw: CourseRaw,
    gradesData: GradesData
  ): Course {
    return {
      id: courseRaw.id,
      department: courseRaw.department,
      number: courseRaw.number,
      departmentNumber: `${courseRaw.department} ${courseRaw.number}`,
      school: courseRaw.school,
      title: courseRaw.title,
      description: courseRaw.description,
      courseLevel: courseRaw.course_level,
      departmentAlias: this._getDepartmentAlias(courseRaw.department_alias),
      unitsMin: courseRaw.units[0],
      unitsMax:
        courseRaw.units.length > 1 ? courseRaw.units[1] : courseRaw.units[0],
      departmentName: courseRaw.department_name,
      prerequisiteText: courseRaw.prerequisite_text.trim(),
      repeatability: courseRaw.repeatability,
      gradingOption: courseRaw.grading_option,
      concurrent: courseRaw.concurrent,
      sameAs: courseRaw.same_as,
      restrictionText: courseRaw.restriction,
      restrictions: this._getRestrictions(courseRaw.restriction),
      overlap: courseRaw.overlap,
      corequisite: courseRaw.corequisite,
      geList: courseRaw.ge_list,
      geText: courseRaw.ge_text,
      terms: courseRaw.terms,
      prerequisites: courseRaw.prerequisite_list,
      prerequisiteFor: courseRaw.prerequisite_for,
      tokens: this._getTokens(courseRaw),
      ...gradesData,
      averageGPA: gradesData ? this._getAverageGPA(gradesData) : null,
    };
  }
  private _getAverageGPA(gradesData: GradesData): number {
    const nonZeroGPAs = gradesData.averageGPAs.filter(
      (averageGPA) => averageGPA
    );
    if (nonZeroGPAs.length == 0) {
      return 0;
    }
    return (
      nonZeroGPAs.reduce((sum, averageGPA) => sum + averageGPA) /
      nonZeroGPAs.length
    );
  }
  private _getDepartmentAlias(department_alias?: string[]): string {
    return department_alias && department_alias.length
      ? department_alias[0]
      : "";
  }
  private _getRestrictions(restrictions: string): string[] {
    return restrictions
      .split(".")
      .map((restriction) => restriction.trim())
      .filter((restriction) => restriction && restriction.includes("only"));
  }
  private _getTokens(courseRaw: CourseRaw): string[] {
    const rawTokens = [
      courseRaw.id,
      courseRaw.department,
      courseRaw.number,
      courseRaw.school,
      courseRaw.title,
      courseRaw.course_level,
      this._getDepartmentAlias(courseRaw.department_alias),
      courseRaw.units[0].toString(),
      courseRaw.units.length > 1 ? courseRaw.units[1].toString() : "",
      courseRaw.department_name,
      courseRaw.prerequisite_text,
      courseRaw.repeatability,
      courseRaw.grading_option,
      courseRaw.concurrent,
      courseRaw.same_as,
      courseRaw.restriction,
      courseRaw.overlap,
      courseRaw.corequisite,
      courseRaw.ge_list,
      courseRaw.ge_text,
      courseRaw.terms,
      courseRaw.prerequisite_for.join(" "),
      courseRaw.prerequisite_text,
    ];
    const raw = rawTokens.join(" ");
    return this._tokenize(raw);
  }
  private _tokenize(str: string): string[] {
    return removeStopwords(
      str
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ")
        .toLowerCase()
        .split(" ")
        .filter((s) => s)
    );
  }
  private _getCourseTerms(courses: Course[]): Term[] {
    const filterSet = new Set<string>();
    for (let course of courses) {
      for (let term of course.terms) {
        filterSet.add(term);
      }
    }
    return Array.from(filterSet).map((term) => this._getTerm(term));
  }
  private _getCourseRestrictions(courses: Course[]): Restriction[] {
    const filterSet = new Set<string>();
    for (let course of courses) {
      for (let restriction of course.restrictions) {
        filterSet.add(restriction);
      }
    }
    return Array.from(filterSet).map((restriction) => ({ text: restriction }));
  }
  private _getCourseDepartments(courses: Course[]): Department[] {
    const filterSet = new Set<string>();
    const departments: Department[] = [];
    for (let course of courses) {
      if (!filterSet.has(course.department)) {
        filterSet.add(course.department);
        departments.push({
          text: course.department,
          name: course.departmentName,
        });
      }
    }
    return departments;
  }
  private _getCourseSchools(courses: Course[]): School[] {
    const filterSet = new Set<string>();
    for (let course of courses) {
      filterSet.add(course.school);
    }
    return Array.from(filterSet).map((school) => ({ text: school }));
  }
  private _getCourseLevels(courses: Course[]): CourseLevel[] {
    const filterSet = new Set<string>();
    for (let course of courses) {
      filterSet.add(course.courseLevel);
    }
    return Array.from(filterSet).map((courseLevel) => ({ text: courseLevel }));
  }
  private _getCourseGes(courses: Course[]): CourseGe[] {
    const filterSet = new Set<string>();
    for (let course of courses) {
      for (let ge of course.geList) {
        filterSet.add(ge);
      }
    }
    return Array.from(filterSet).map((ge) => ({ text: ge }));
  }
  private _convertParams(params: SearchParams): QueryParams {
    const queryParams: QueryParams = {};
    queryParams.where = this._getWhereInput(params);
    if (params.orderBy) {
      queryParams.orderBy = this._getOrderByInput(params);
    }
    if (params.page != undefined && params.pageSize != undefined) {
      queryParams.skip = params.page * params.pageSize;
      queryParams.take = params.pageSize;
    }
    return queryParams;
  }
  private _getOrderByInput(params: SearchParams): any {
    if (params.orderBy == "department") {
      return [
        { department: params.orderByDirection },
        { number: params.orderByDirection },
      ];
    }
    if (params.orderBy == "averageGPA") {
      return [
        { averageGPA: params.orderByDirection },
      ];
    }
    return;
  }
  private _getWhereInput(params: SearchParams): Prisma.CourseWhereInput {
    const whereInput = this._convertSearchQuery(params.searchQuery);
    const filtersInput = this._convertFilters(params);
    whereInput.AND = (whereInput.AND as Prisma.CourseWhereInput[]).concat(
      filtersInput.AND as Prisma.CourseWhereInput[]
    );
    whereInput.NOT = (whereInput.NOT as Prisma.CourseWhereInput[]).concat(
      filtersInput.NOT as Prisma.CourseWhereInput[]
    );
    return whereInput;
  }
  private _convertSearchQuery(searchQuery?: string): Prisma.CourseWhereInput {
    if (!searchQuery) {
      return { AND: [], NOT: [] };
    }
    const tokens = this._tokenize(searchQuery);
    return { AND: [{ tokens: { hasEvery: tokens } }], NOT: [] };
  }
  private _convertFilters(filters?: SearchParams): Prisma.CourseWhereInput {
    if (!filters) {
      return { AND: [], NOT: [] };
    }
    const andInput: Prisma.Enumerable<Prisma.CourseWhereInput> = [];
    const notInput: Prisma.Enumerable<Prisma.CourseWhereInput> = [];

    if (filters.departmentsAny && filters.departmentsAny.length) {
      andInput.push({ department: { in: filters.departmentsAny } });
    }
    if (filters.number) {
      andInput.push({ number: { equals: filters.number } });
    }
    if (filters.schoolsAny && filters.schoolsAny.length) {
      andInput.push({ school: { in: filters.schoolsAny } });
    }
    if (filters.courseLevel) {
      andInput.push({ courseLevel: { equals: filters.courseLevel } });
    }
    if (filters.unitsMin) {
      andInput.push({ unitsMax: { gte: filters.unitsMin } });
    }
    if (filters.unitsMax) {
      andInput.push({ unitsMin: { lte: filters.unitsMax } });
    }
    if (filters.prerequisitesNot && filters.prerequisitesNot.length) {
      const prerequisitesNotList = this._getCourseList(
        filters.prerequisitesNot
      );
      notInput.push({ prerequisites: { hasSome: prerequisitesNotList } });
    }
    if (filters.restrictionsNot && filters.restrictionsNot.length) {
      notInput.push({ restrictions: { hasSome: filters.restrictionsNot } });
    }
    // if (filters.ignore && filters.ignore.length) {
    //   notInput.push({ departmentNumber: { in: filters.ignore } });
    // }
    if (filters.geAll && filters.geAll.length) {
      andInput.push({ geList: { hasEvery: filters.geAll } });
    }
    if (filters.geAny && filters.geAny.length) {
      andInput.push({ geList: { hasSome: filters.geAny } });
    }
    if (filters.term) {
      andInput.push({ terms: { has: filters.term } });
    }
    if (filters.orderBy == "averageGPA") {
      andInput.push({ averageGPA: { not: null } });
    }
    return { AND: andInput, NOT: notInput };
  }
  private _getCourseList(coursesString: string | undefined): string[] {
    if (!coursesString) {
      return [];
    }
    return (
      coursesString
        .split(",")
        .map((prerequisite) => prerequisite.trim().toUpperCase())
        .map(this._substituteDepartmentAlias)
        .filter((s) => s) || []
    );
  }
  private _substituteDepartmentAlias(courseDepartmentNumber: string): string {
    const stringSplit = courseDepartmentNumber.split(" ").filter((s) => s);
    if (stringSplit.length != 2) {
      return courseDepartmentNumber;
    }
    if (stringSplit[0] == "CS") {
      return "COMPSCI " + stringSplit[1];
    }
    if (stringSplit[0] == "ICS") {
      return "I&C SCI " + stringSplit[1];
    }
    if (stringSplit[0] == "INF") {
      return "IN4MATX " + stringSplit[1];
    }
    return courseDepartmentNumber;
  }
}

export default DatabaseWrapper;
