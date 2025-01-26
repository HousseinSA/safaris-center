// app/api/update-password/route.ts
import { NextResponse } from "next/server";
import db from "@/lib/mongodb"; // Adjust the import path to your MongoDB utility file
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"; // Import authOptions from lib

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    // Ensure the user is authenticated
    if (!session) {
        return NextResponse.json(
            { error: "Non autorisé" }, // French: Unauthorized
            { status: 401 }
        );
    }

    // Parse the request body
    const { currentPassword, newPassword } = await request.json();

    // Validate input
    if (!currentPassword || !newPassword) {
        return NextResponse.json(
            { error: "Le mot de passe actuel et le nouveau mot de passe sont requis." }, // French: Current and new passwords are required
            { status: 400 }
        );
    }

    try {
        // Verify the current password
        const isPasswordValid = await db.verifyUserPassword(currentPassword);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Le mot de passe actuel est incorrect." }, // French: Current password is incorrect
                { status: 400 }
            );
        }

        // Update the password in the database
        await db.updateUserPassword(newPassword);

        return NextResponse.json(
            { message: "Mot de passe mis à jour avec succès. Veuillez vous reconnecter." }, // French: Password updated successfully
            { status: 200 }
        );
    } catch (error) {
        console.error("Erreur lors de la mise à jour du mot de passe:", error);
        return NextResponse.json(
            { error: "Échec de la mise à jour du mot de passe." }, // French: Failed to update password
            { status: 500 }
        );
    }
}