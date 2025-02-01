// components/LoginModal.tsx
"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BeatLoader } from "react-spinners";

export default function LoginModal() {
    const [loading, setLoading] = useState(false);

    const handleLoginAsGuest = async () => {
        setLoading(true);
        // Directly sign in as guest
        const result = await signIn("credentials", {
            redirect: false,
        });

        if (result?.error) {
            console.error(result.error);
        } else {
            window.location.href = "/";
        }

        setLoading(false);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            >
                <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-[300px] max-h-[300px] overflow-hidden">
                    <div className="flex justify-center mb-4">
                        <Image
                            width={80}
                            height={80}
                            alt="logo"
                            src="/safariscenter.png"
                            className="mx-auto"
                        />
                    </div>

                    <button
                        onClick={handleLoginAsGuest}
                        disabled={loading}
                        className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors w-full flex items-center justify-center"
                    >
                        {loading ? (
                            <BeatLoader color="#ffffff" size={8} />
                        ) : (
                            "Login as Guest"
                        )}
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}