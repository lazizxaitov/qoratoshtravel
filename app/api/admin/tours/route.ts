import { NextResponse } from "next/server";
import ensureDatabase from "../../../../lib/db";
import { requireAdminAuth } from "../../../../lib/admin-auth";

export const runtime = "nodejs";

type TourPayload = {
  id: string;
  title: string;
  country: string;
  city: string;
  start_date: string;
  end_date: string;
  adults_min: number;
  adults_max: number;
  price_from: number;
  nights: number;
  image_url: string;
  is_hot: number;
  tour_type: string;
  gallery_urls: string[];
};

function normalizeTour(payload: Partial<TourPayload>) {
  const errors: string[] = [];
  const required = [
    "id",
    "title",
    "country",
    "city",
    "start_date",
    "end_date",
    "adults_min",
    "adults_max",
    "price_from",
    "nights",
    "image_url",
  ];

  for (const key of required) {
    if (payload[key as keyof TourPayload] === undefined) {
      errors.push(`Missing ${key}`);
    }
  }

  const isHot = payload.is_hot ?? 0;
  const tourType =
    typeof payload.tour_type === "string" && payload.tour_type.length > 0
      ? payload.tour_type
      : isHot === 1
        ? "hot"
        : "regular";
  const galleryUrls = Array.isArray(payload.gallery_urls)
    ? payload.gallery_urls.filter((url) => typeof url === "string")
    : [];

  return {
    data: {
      ...payload,
      is_hot: isHot,
      tour_type: tourType,
      gallery_urls: galleryUrls,
    } as TourPayload,
    errors,
  };
}

export async function GET(request: Request) {
  const authError = requireAdminAuth(request);
  if (authError) {
    return authError;
  }

  const db = ensureDatabase();
  const rows = db
    .prepare(
      `
        SELECT id, title, country, city, start_date, end_date, adults_min, adults_max,
               price_from, nights, image_url, is_hot, tour_type, gallery_json
        FROM tours
        ORDER BY start_date ASC;
      `
    )
    .all();

  const items = rows.map((row: any) => {
    let gallery_urls: string[] = [];
    if (row.gallery_json) {
      try {
        const parsed = JSON.parse(row.gallery_json);
        if (Array.isArray(parsed)) {
          gallery_urls = parsed;
        }
      } catch {
        gallery_urls = [];
      }
    }
    return { ...row, gallery_urls };
  });

  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const authError = requireAdminAuth(request);
  if (authError) {
    return authError;
  }

  const body = await request.json();
  const { data, errors } = normalizeTour(body);
  if (errors.length) {
    return NextResponse.json({ error: errors.join(", ") }, { status: 400 });
  }

  const db = ensureDatabase();
  const insert = db.prepare(
    `
      INSERT INTO tours (
        id, title, country, city, start_date, end_date,
        adults_min, adults_max, price_from, nights, image_url, is_hot,
        tour_type, gallery_json
      ) VALUES (
        @id, @title, @country, @city, @start_date, @end_date,
        @adults_min, @adults_max, @price_from, @nights, @image_url, @is_hot,
        @tour_type, @gallery_json
      );
    `
  );
  insert.run({
    ...data,
    gallery_json: JSON.stringify(data.gallery_urls ?? []),
  });
  return NextResponse.json({ ok: true });
}

export async function PUT(request: Request) {
  const authError = requireAdminAuth(request);
  if (authError) {
    return authError;
  }

  const body = await request.json();
  const { data, errors } = normalizeTour(body);
  if (errors.length) {
    return NextResponse.json({ error: errors.join(", ") }, { status: 400 });
  }

  const db = ensureDatabase();
  const update = db.prepare(
    `
      UPDATE tours SET
        title = @title,
        country = @country,
        city = @city,
        start_date = @start_date,
        end_date = @end_date,
        adults_min = @adults_min,
        adults_max = @adults_max,
        price_from = @price_from,
        nights = @nights,
        image_url = @image_url,
        is_hot = @is_hot,
        tour_type = @tour_type,
        gallery_json = @gallery_json
      WHERE id = @id;
    `
  );
  update.run({
    ...data,
    gallery_json: JSON.stringify(data.gallery_urls ?? []),
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const authError = requireAdminAuth(request);
  if (authError) {
    return authError;
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const db = ensureDatabase();
  db.prepare("DELETE FROM tours WHERE id = ?").run(id);
  return NextResponse.json({ ok: true });
}
