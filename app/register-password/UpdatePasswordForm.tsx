"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { signOut } from "next-auth/react";
import { BeatLoader } from "react-spinners"; // Import BeatLoader

function PasswordUpdateInput() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false); // Loading state

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate inputs
        if (!currentPassword || !newPassword) {
            toast.error("Tous les champs sont obligatoires."); // French: All fields are required
            return;
        }

        setIsLoading(true); // Start loading

        try {
            // Call your API route to update the password
            const response = await fetch("/api/update-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Mot de passe mis à jour avec succès."); // French: Password updated successfully
                // Clear form fields
                setCurrentPassword("");
                setNewPassword("");
                // Log the user out
                await signOut({ callbackUrl: "/login" }); // Logout and redirect to /login
            } else {
                toast.error(data.error || "Échec de la mise à jour du mot de passe."); // French: Failed to update password
            }
        } catch (err) {
            console.error("Erreur lors de la mise à jour du mot de passe:", err);
            toast.error("Échec de la mise à jour du mot de passe."); // French: Failed to update password
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    return (
        <div className="grid md:grid-cols-2 gap-4 border p-4 rounded-lg">
            {/* Current Password */}
            <div>
                <Label className="text-primary" htmlFor="currentPassword">
                    Mot de passe actuel
                </Label>
                <Input
                    id="currentPassword"
                    type="password"
                    placeholder="Entrez votre mot de passe actuel"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                />
            </div>

            {/* New Password */}
            <div>
                <Label className="text-primary" htmlFor="newPassword">
                    Nouveau mot de passe
                </Label>
                <Input
                    id="newPassword"
                    type="password"
                    placeholder="Entrez votre nouveau mot de passe"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2">
                <Button
                    type="submit"
                    onClick={handleSubmit}
                    className="w-full bg-primary text-white hover:bg-primary-dark"
                    disabled={isLoading} // Disable button when loading
                >
                    {isLoading ? (
                        <BeatLoader color="#ffffff" size={8} /> // Show spinner when loading
                    ) : (
                        "Mettre à jour le mot de passe"
                    )}
                </Button>
            </div>
        </div>
    );
}

export default PasswordUpdateInput;