"use client"; // Mark as a client component

import { signIn } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BeatLoader } from "react-spinners";

export default function LoginModal() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setError("");
        setLoading(true);

        const result = await signIn("credentials", {
            password,
            redirect: false,
        });

        if (result?.error) {
            setError(result.error);
        } else {
            window.location.href = "/"; // Redirect to homepage after successful login
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
                <div className="bg-white p-8 rounded-lg shadow-md text-center w-[400px] max-w-full">
                    {/* Centered Image */}
                    <div className="flex justify-center mb-4">
                        <Image
                            width={80}
                            height={80}
                            alt="logo"
                            src="/safariscenter.png"
                            className="mx-auto"
                        />
                    </div>


                    {/* Password Input */}
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border border-primary outline-primary rounded mb-4"
                    />

                    {/* Error Message */}
                    {error && (
                        <p className="text-red-500 mb-4 text-sm">
                            {error}
                        </p>
                    )}

                    {/* Login Button */}
                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors w-full flex items-center justify-center"
                    >
                        {loading ? (
                            <BeatLoader color="#ffffff" size={8} />
                        ) : (
                            "Se connecter"
                        )}
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}