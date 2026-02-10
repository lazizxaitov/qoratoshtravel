import { NextResponse } from "next/server";
import ensureDatabase from "../../../lib/db";

export const runtime = "nodejs";

function normalizeDate(value: string | null) {
  if (!value) {
    return null;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed.toISOString().slice(0, 10);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const langParam = searchParams.get("lang")?.trim().toLowerCase() || "";
  const lang =
    langParam === "ru" || langParam === "uz" || langParam === "en"
      ? langParam
      : "";
  const id = searchParams.get("id")?.trim() || "";
  const destination = searchParams.get("destination")?.trim() || "";
  const startDate = normalizeDate(searchParams.get("startDate"));
  const endDate = normalizeDate(searchParams.get("endDate"));
  const adults = Number(searchParams.get("adults") || 0);
  const type = searchParams.get("type")?.trim() || "";

  const titleColumn = lang
    ? `COALESCE(NULLIF(title_${lang}, ''), title)`
    : "title";
  const descriptionColumn = lang
    ? `COALESCE(NULLIF(description_${lang}, ''), description)`
    : "description";
  const countryColumn = lang
    ? `COALESCE(NULLIF(country_${lang}, ''), country)`
    : "country";
  const cityColumn = lang
    ? `COALESCE(NULLIF(city_${lang}, ''), city)`
    : "city";

  const filters: string[] = [];
  const params: Record<string, string | number> = {};

  if (id) {
    filters.push("id = @id");
    params.id = id;
  }

  if (destination) {
    filters.push(
      `(${countryColumn} LIKE @destination OR ${cityColumn} LIKE @destination)`
    );
    params.destination = `%${destination}%`;
  }

  if (startDate && endDate) {
    filters.push("(start_date <= @endDate AND end_date >= @startDate)");
    params.startDate = startDate;
    params.endDate = endDate;
  } else if (startDate) {
    filters.push("(end_date >= @startDate)");
    params.startDate = startDate;
  }

  if (adults > 0) {
    filters.push("(adults_min <= @adults AND adults_max >= @adults)");
    params.adults = adults;
  }

  if (type && type !== "all") {
    if (type === "hot") {
      filters.push("(tour_type = 'hot' OR is_hot = 1)");
    } else {
      filters.push("tour_type = @type");
      params.type = type;
    }
  }

  const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
  const db = ensureDatabase();
  const stmt = db.prepare(
    `
      SELECT id,
             ${titleColumn} as title,
             ${descriptionColumn} as description,
             ${countryColumn} as country,
             ${cityColumn} as city,
             start_date, end_date, adults_min, adults_max,
             price_from, nights, image_url, is_hot, tour_type, gallery_urls
      FROM tours
      ${whereClause}
      ORDER BY is_hot DESC, start_date ASC
      LIMIT 50;
    `
  );
  const rows = stmt.all(params);

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
