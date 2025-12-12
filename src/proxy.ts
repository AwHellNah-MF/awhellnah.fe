import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth0 } from "@/app/_lib/auth0";

const PUBLIC_ROUTES = ["/landing", "/auth"];

function isPublicRoute(pathname: string): boolean {
   return PUBLIC_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
   );
}

export async function proxy(request: NextRequest) {
   const { pathname } = request.nextUrl;

   // Allow public routes
   if (isPublicRoute(pathname)) {
      return await auth0.middleware(request);
   }

   // Check authentication for protected routes
   const session = await auth0.getSession(request);

   if (!session) {
      return NextResponse.redirect(new URL("/landing", request.url));
   }

   return await auth0.middleware(request);
}

export const config = {
   matcher: [
      /*
       * Match all request paths except for the ones starting with:
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico, sitemap.xml, robots.txt (metadata files)
       */
      "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
   ],
};