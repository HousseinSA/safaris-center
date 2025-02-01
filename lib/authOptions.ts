import { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
    providers: [],
    session: {
        strategy: "jwt",
        maxAge: 12 * 60 * 60,
    },
    callbacks: {
        async jwt({ token }) {
            token.id = "guest";
            return token;
        },
        async session({ session, token }) {
            // @ts-expect-error fix later   
            session.user.id = token.id;
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};