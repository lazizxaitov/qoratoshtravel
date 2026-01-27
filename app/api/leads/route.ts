import { NextResponse } from "next/server";

export const runtime = "nodejs";

type LeadPayload = {
  source?: string;
  lang?: string;
  name?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  comment?: string;
  tourId?: string;
  tourTitle?: string;
  tourLink?: string;
};

function normalizeBaseUrl(value?: string) {
  if (!value) {
    return "";
  }
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export async function POST(request: Request) {
  const baseUrl = normalizeBaseUrl(process.env.ADMIN_API_BASE);
  if (!baseUrl) {
    return NextResponse.json(
      { error: "Admin API base is not configured" },
      { status: 500 }
    );
  }

  const payload = (await request.json()) as LeadPayload;
  const name = [payload.name, payload.lastName].filter(Boolean).join(" ").trim();

  const response = await fetch(`${baseUrl}/api/site/telegram`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: name || payload.name || "",
      phone: payload.phone ?? "",
      email: payload.email ?? "",
      message: payload.comment ?? "",
      source: payload.source ?? "",
      tourTitle: payload.tourTitle ?? "",
      tourId: payload.tourId ?? "",
      tourLink: payload.tourLink ?? "",
    }),
  });

  const text = await response.text();
  const contentType = response.headers.get("content-type") || "text/plain";
  return new NextResponse(text, {
    status: response.status,
    headers: { "content-type": contentType },
  });
}
