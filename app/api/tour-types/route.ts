import { NextResponse } from "next/server";
import ensureDatabase from "../../../lib/db";

export const runtime = "nodejs";

export async function GET() {
  const db = ensureDatabase();
  const items = db
    .prepare("SELECT code, label_ru, label_uz, label_en FROM tour_types ORDER BY code ASC")
    .all();
  return NextResponse.json({ items });
}
