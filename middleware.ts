// middleware.js
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
// @ts-expect-error fix
export async function middleware(request) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    // Define protected routes
    const protectedRoutes = ["/client", "/nouveau-client", "/depenses", "/recettes"];

    // Check if the requested route is protected
    if (protectedRoutes.includes(request.nextUrl.pathname)) {
        // If the user is not authenticated, redirect to the home page
        if (!token) {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    // Allow the request to proceed
    return NextResponse.next();
}