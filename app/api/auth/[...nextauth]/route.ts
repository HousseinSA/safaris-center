import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import db from "@/lib/mongodb";

// Define authOptions and export it
export const authOptions = {
    // @ts-expect-error fix later
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.password) {
                    throw new Error("Password is required");
                }

                try {
                    // Use your existing db utility to verify the password
                    const isValidPassword = await db.verifyUserPassword(credentials.password);

                    if (!isValidPassword) {
                        throw new Error("Mot de passe incorrect.");
                    }

                    // Return a user object (required by NextAuth.js)
                    return { id: "single-user" }; // Use the same ID as in your users collection
                } catch (err) {
                    // @ts-expect-error fix
                    throw new Error(err.message);
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 12 * 60 * 60, // 12 hours
    },
    callbacks: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async jwt({ token, user }: { token: JWT; user?: any }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            // @ts-expect-error fix later
            session.user.id = token.id;

            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

// Create the NextAuth handler
// @ts-expect-error fix later 
const handler = NextAuth(authOptions);

// Export the handler as GET and POST
export { handler as GET, handler as POST };