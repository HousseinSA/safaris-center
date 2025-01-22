import { NextResponse } from "next/server";
import db from "@/lib/mongodb";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("id");

    try {
        if (clientId) {
            const client = await db.getClientById(clientId);
            if (!client) {
                return NextResponse.json(
                    { error: "Client not found" },
                    { status: 404 }
                );
            }
            return NextResponse.json(client);
        } else {
            const clients = await db.getAllClients();
            return NextResponse.json(clients);
        }
    } catch (error) {
        console.error("Error fetching client(s):", error);
        return NextResponse.json(
            { error: "Failed to fetch client(s)" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const clientData = await request.json();
        const result = await db.createClient(clientData);
        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error("Error creating client:", error);
        return NextResponse.json(
            { error: "Failed to create client" },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const { _id, ...clientData } = await request.json();

        if (!_id) {
            return NextResponse.json(
                { error: "Client ID is required" },
                { status: 400 }
            );
        }

        const result = await db.updateClient(_id, clientData);

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { error: "Client not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error updating client:", error);
        return NextResponse.json(
            { error: "Failed to update client" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json(
                { error: "Client ID is required" },
                { status: 400 }
            );
        }

        const result = await db.deleteClient(id);
        return NextResponse.json(result);
    } catch (error) {
        console.error("Error deleting client:", error);
        return NextResponse.json(
            { error: "Failed to delete client" },
            { status: 500 }
        );
    }
}