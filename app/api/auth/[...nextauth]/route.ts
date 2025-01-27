// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions"; // Import authOptions from lib

// Create the NextAuth handler
const handler = NextAuth(authOptions);

// Export the handler as GET and POST
export { handler as GET, handler as POST };