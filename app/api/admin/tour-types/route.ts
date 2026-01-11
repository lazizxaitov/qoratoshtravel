import { NextResponse } from "next/server";
import ensureDatabase from "../../../../lib/db";
import { requireAdminAuth } from "../../../../lib/admin-auth";

export const runtime = "nodejs";

type TourTypePayload = {
  code: string;
  label_ru: string;
  label_uz: string;
  label_en: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\\s-]/g, "")
    .replace(/\\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function GET(request: Request) {
  const authError = requireAdminAuth(request);
  if (authError) {
    return authError;
  }

  const db = ensureDatabase();
  const items = db
    .prepare(
      "SELECT code, label_ru, label_uz, label_en FROM tour_types ORDER BY code ASC"
    )
    .all();
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const authError = requireAdminAuth(request);
  if (authError) {
    return authError;
  }

  const body = (await request.json()) as Partial<TourTypePayload>;
  const codeRaw = String(body.code ?? "");
  const code = slugify(codeRaw);
  const labelRu = String(body.label_ru ?? "").trim();
  const labelUz = String(body.label_uz ?? "").trim();
  const labelEn = String(body.label_en ?? "").trim();
  if (!code || !labelRu || !labelUz || !labelEn) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const db = ensureDatabase();
  const exists = db
    .prepare("SELECT COUNT(1) as count FROM tour_types WHERE code = ?")
    .get(code) as { count: number };
  if (exists.count > 0) {
    return NextResponse.json({ error: "Type already exists" }, { status: 409 });
  }

  db.prepare(
    "INSERT INTO tour_types (code, label_ru, label_uz, label_en) VALUES (?, ?, ?, ?)"
  ).run(code, labelRu, labelUz, labelEn);

  return NextResponse.json({ ok: true });
}

export async function PUT(request: Request) {
  const authError = requireAdminAuth(request);
  if (authError) {
    return authError;
  }

  const body = (await request.json()) as Partial<TourTypePayload>;
  const code = String(body.code ?? "").trim();
  const labelRu = String(body.label_ru ?? "").trim();
  const labelUz = String(body.label_uz ?? "").trim();
  const labelEn = String(body.label_en ?? "").trim();
  if (!code || !labelRu || !labelUz || !labelEn) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const db = ensureDatabase();
  db.prepare(
    "UPDATE tour_types SET label_ru = ?, label_uz = ?, label_en = ? WHERE code = ?"
  ).run(labelRu, labelUz, labelEn, code);

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const authError = requireAdminAuth(request);
  if (authError) {
    return authError;
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  const db = ensureDatabase();
  const used = db
    .prepare("SELECT COUNT(1) as count FROM tours WHERE tour_type = ?")
    .get(code) as { count: number };
  if (used.count > 0) {
    return NextResponse.json(
      { error: "Type is used by tours" },
      { status: 400 }
    );
  }

  db.prepare("DELETE FROM tour_types WHERE code = ?").run(code);
  return NextResponse.json({ ok: true });
}
