// app/login/page.tsx
"use client"; // Mark as a client component

import LoginModal from "@/components/LoginModal";
// import { useSession } from "next-auth/react";
// import { useEffect } from "react";

export default function LoginPage() {
    // const { data: session } = useSession();

    // // Redirect to homepage if the user is already logged in
    // useEffect(() => {
    //     if (session) {
    //         window.location.href = "/";
    //     }
    // }, [session]);

    return (
        <div className="flex items-center justify-center min-h-screen ">
            <LoginModal />
        </div>
    );
}