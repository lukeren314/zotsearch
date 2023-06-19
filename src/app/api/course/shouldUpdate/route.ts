import { NextRequest, NextResponse } from "next/server";
import database from "@/lib/database";

export async function GET(request: NextRequest) {
  const shouldUpdate = await database.getShouldUpdate();
  return NextResponse.json({ shouldUpdate });
}
