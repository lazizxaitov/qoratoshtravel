import { NextResponse } from "next/server";
import ensureDatabase from "../../../../lib/db";
import { requireAdminAuth } from "../../../../lib/admin-auth";

export const runtime = "nodejs";

type TourPayload = {
  id: string;
  title: string;
  title_ru?: string;
  title_uz?: string;
  title_en?: string;
  country: string;
  country_ru?: string;
  country_uz?: string;
  country_en?: string;
  city: string;
  city_ru?: string;
  city_uz?: string;
  city_en?: string;
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
  const title =
    payload.title ??
    payload.title_ru ??
    payload.title_uz ??
    payload.title_en;
  const country =
    payload.country ??
    payload.country_ru ??
    payload.country_uz ??
    payload.country_en;
  const city =
    payload.city ??
    payload.city_ru ??
    payload.city_uz ??
    payload.city_en;

  const required = [
    "id",
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
  if (!title) {
    errors.push("Missing title");
  }
  if (!country) {
    errors.push("Missing country");
  }
  if (!city) {
    errors.push("Missing city");
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

  const fallbackTitle = title ?? "";
  const fallbackCountry = country ?? "";
  const fallbackCity = city ?? "";

  return {
    data: {
      ...payload,
      title: fallbackTitle,
      country: fallbackCountry,
      city: fallbackCity,
      title_ru: payload.title_ru ?? fallbackTitle,
      title_uz: payload.title_uz ?? fallbackTitle,
      title_en: payload.title_en ?? fallbackTitle,
      country_ru: payload.country_ru ?? fallbackCountry,
      country_uz: payload.country_uz ?? fallbackCountry,
      country_en: payload.country_en ?? fallbackCountry,
      city_ru: payload.city_ru ?? fallbackCity,
      city_uz: payload.city_uz ?? fallbackCity,
      city_en: payload.city_en ?? fallbackCity,
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
        SELECT id, title, title_ru, title_uz, title_en,
               country, country_ru, country_uz, country_en,
               city, city_ru, city_uz, city_en,
               start_date, end_date, adults_min, adults_max,
               price_from, nights, image_url, is_hot, tour_type, gallery_urls
        FROM tours
        ORDER BY start_date ASC;
      `
    )
    .all();

  const items = rows.map((row: any) => {
    let gallery_urls: string[] = [];
    if (row.gallery_urls) {
      try {
        const parsed = JSON.parse(row.gallery_urls);
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
        id, title, title_ru, title_uz, title_en,
        country, country_ru, country_uz, country_en,
        city, city_ru, city_uz, city_en,
        start_date, end_date,
        adults_min, adults_max, price_from, nights, image_url, is_hot,
        tour_type, gallery_urls
      ) VALUES (
        @id, @title, @title_ru, @title_uz, @title_en,
        @country, @country_ru, @country_uz, @country_en,
        @city, @city_ru, @city_uz, @city_en,
        @start_date, @end_date,
        @adults_min, @adults_max, @price_from, @nights, @image_url, @is_hot,
        @tour_type, @gallery_urls
      );
    `
  );
  insert.run({
    ...data,
    gallery_urls: JSON.stringify(data.gallery_urls ?? []),
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
        title_ru = @title_ru,
        title_uz = @title_uz,
        title_en = @title_en,
        country = @country,
        country_ru = @country_ru,
        country_uz = @country_uz,
        country_en = @country_en,
        city = @city,
        city_ru = @city_ru,
        city_uz = @city_uz,
        city_en = @city_en,
        start_date = @start_date,
        end_date = @end_date,
        adults_min = @adults_min,
        adults_max = @adults_max,
        price_from = @price_from,
        nights = @nights,
        image_url = @image_url,
        is_hot = @is_hot,
        tour_type = @tour_type,
        gallery_urls = @gallery_urls
      WHERE id = @id;
    `
  );
  update.run({
    ...data,
    gallery_urls: JSON.stringify(data.gallery_urls ?? []),
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
