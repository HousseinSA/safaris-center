"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { signOut } from "next-auth/react";
import { BeatLoader } from "react-spinners";
import { Eye, EyeOff } from 'lucide-react'; // Import Eye and EyeOff icons from react-lucide

function PasswordUpdateInput() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false); // State for current password visibility
    const [showNewPassword, setShowNewPassword] = useState(false); // State for new password visibility

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate inputs
        if (!currentPassword) {
            toast.error("Le mot de passe actuel est requis.");
            return;
        }

        if (!newPassword || newPassword.length < 5) {
            toast.error("Le nouveau mot de passe doit contenir au moins 5 caractères.");
            return;
        }

        if (currentPassword === newPassword) {
            toast.error("Le nouveau mot de passe doit être différent du mot de passe actuel.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/update-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Mot de passe mis à jour avec succès.");
                setCurrentPassword("");
                setNewPassword("");
                await signOut({ callbackUrl: "/login" });
            } else {
                toast.error(data.error || "Échec de la mise à jour du mot de passe.");
            }
        } catch (err) {
            console.error("Erreur lors de la mise à jour du mot de passe:", err);
            toast.error("Échec de la mise à jour du mot de passe.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid md:grid-cols-2 gap-4 border p-4 rounded-lg">
            {/* Current Password */}
            <div className="relative">
                <Label className="text-primary" htmlFor="currentPassword">
                    Mot de passe actuel
                </Label>
                <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"} // Toggle type
                    placeholder="Entrez votre mot de passe actuel"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                />
                <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-8" // Adjust position as needed
                >
                    {showCurrentPassword ? <EyeOff color="grey" /> : <Eye color="grey" />} 
                </button>
            </div>

            {/* New Password */}
            <div className="relative">
                <Label className="text-primary" htmlFor="newPassword">
                    Nouveau mot de passe
                </Label>
                <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"} // Toggle type
                    placeholder="Entrez votre nouveau mot de passe"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-8" // Adjust position as needed
                >
                    {showNewPassword ? <EyeOff  color="grey" /> : <Eye  color="grey"/>} {/* Toggle icon */}
                </button>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2">
                <Button
                    type="submit"
                    onClick={handleSubmit}
                    className="w-full bg-primary text-white hover:bg-primary-dark"
                    disabled={isLoading}
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