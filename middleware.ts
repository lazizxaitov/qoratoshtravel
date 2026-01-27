import { NextRequest, NextResponse } from "next/server";

const ADMIN_ORIGIN =
  process.env.ADMIN_ORIGIN ?? "https://admin.qoratoshtravel.uz";

function withCors(request: NextRequest, response: NextResponse) {
  const origin = request.headers.get("origin");
  if (origin && origin === ADMIN_ORIGIN) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Authorization, Content-Type"
    );
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set("Vary", "Origin");
  }
  return response;
}

export function middleware(request: NextRequest) {
  if (request.method === "OPTIONS") {
    return withCors(request, new NextResponse(null, { status: 204 }));
  }

  return withCors(request, NextResponse.next());
}

export const config = {
  matcher: ["/api/admin/:path*", "/api/content"],
};
