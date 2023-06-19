import { NextRequest, NextResponse } from "next/server";
import database from "@/lib/database";

export async function PUT(request: NextRequest) {
  await database.updateCourses();
  return NextResponse.json({ success: true });
}
