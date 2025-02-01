// middleware.ts (or your specific middleware file)
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// Middleware to allow guest access
export function middleware(request: NextRequest) {
    // Check if the request is for a protected route
    const protectedRoutes = ['/recettes', '/depenses', '/nouveau-client']; // Add your protected routes here

    if (protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
        // If the guest is trying to access a protected route, allow access
        // You can also add logic here for redirecting guests
        return NextResponse.next();
    }

    // Allow all other requests
    return NextResponse.next();
}

// Specify which paths the middleware should apply to
export const config = {
    matcher: ['/recettes/:path*', '/depenses/:path*', '/nouveau-client/:path*'],
};