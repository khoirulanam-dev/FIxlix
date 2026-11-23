import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Known SSRF probe patterns (metadata endpoints, internal loopbacks, dangerous URI schemes)
const SSRF_BLOCKED_PATTERNS = [
  /169\.254\.\d{1,3}\.\d{1,3}/i,       // AWS/Azure/GCP link-local metadata
  /metadata\.google\.internal/i,         // GCP internal metadata DNS
  /100\.100\.100\.200/i,                 // Alibaba Cloud metadata
  /fd00:ec2::254/i,                      // AWS IPv6 metadata
  /(^|\/\/)(127\.\d{1,3}\.\d{1,3}\.\d{1,3}|0\.0\.0\.0|\[?::1\]?|localhost)/i, // Loopback
  /(file|gopher|dict|ldap|ftp|tftp|javascript):/i, // Dangerous URI schemes
];

// Helper to determine whether an origin is trusted
function isOriginTrusted(origin: string, requestHost: string | null): boolean {
  try {
    const originUrl = new URL(origin);
    const host = originUrl.host.toLowerCase();

    // Allow same-host requests
    if (requestHost && (host === requestHost.toLowerCase() || host === requestHost.toLowerCase().split(":")[0])) {
      return true;
    }

    // Allow production Fixlix Vercel app
    if (host === "f-ixlix.vercel.app" || host.endsWith(".vercel.app")) {
      return true;
    }

    // Allow custom configured app URL
    if (process.env.NEXT_PUBLIC_APP_URL) {
      try {
        const appHost = new URL(process.env.NEXT_PUBLIC_APP_URL).host.toLowerCase();
        if (host === appHost) return true;
      } catch {}
    }

    if (process.env.BETTER_AUTH_URL) {
      try {
        const authHost = new URL(process.env.BETTER_AUTH_URL).host.toLowerCase();
        if (host === authHost) return true;
      } catch {}
    }

    // Allow local development hosts only in non-production
    if (process.env.NODE_ENV !== "production") {
      if (host === "localhost" || host.startsWith("localhost:") || host === "127.0.0.1" || host.startsWith("127.0.0.1:")) {
        return true;
      }
    }

    return false;
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const rawQuery = url.search;
  const pathname = url.pathname;

  // 1. SSRF & Metadata Probe Inspection in query params & pathname
  const targetToCheck = `${pathname}${rawQuery}`;
  for (const pattern of SSRF_BLOCKED_PATTERNS) {
    if (pattern.test(targetToCheck)) {
      return new NextResponse(
        JSON.stringify({ error: "Access denied by SSRF protection filter" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  // 2. Proxy Header Injection / Smuggling Inspection
  const forwardedHost = request.headers.get("x-forwarded-host");
  if (forwardedHost) {
    for (const pattern of SSRF_BLOCKED_PATTERNS) {
      if (pattern.test(forwardedHost)) {
        return new NextResponse(
          JSON.stringify({ error: "Invalid proxy header detected" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }
  }

  // 3. API Mutating Request Origin Validation (CSRF & External Proxy Protection)
  if (pathname.startsWith("/api/")) {
    const method = request.method.toUpperCase();
    if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
      const origin = request.headers.get("origin");
      const host = request.headers.get("host");

      if (origin) {
        if (!isOriginTrusted(origin, host)) {
          return new NextResponse(
            JSON.stringify({ error: "Cross-origin request blocked by security policy" }),
            { status: 403, headers: { "Content-Type": "application/json" } }
          );
        }
      }
    }
  }

  // Set standard security headers on response
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     * - public uploads and static images
     */
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|icon.png|apple-icon.png|uploads).*)",
  ],
};
