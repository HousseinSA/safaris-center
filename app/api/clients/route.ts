import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

const uri = process.env.MONGODB_LINK!;
const client = new MongoClient(uri);

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("id");
    try {
        await client.connect();
        const database = client.db('your-database-name');
        const collection = database.collection("clients");

        if (clientId) {
            // Fetch a specific client by _id
            const objectId = new ObjectId(clientId);
            const clientData = await collection.findOne({ _id: objectId });

            if (!clientData) {
                return NextResponse.json(
                    { error: "Client not found" },
                    { status: 404 }
                );
            }

            return NextResponse.json(clientData);
        } else {
            const clients = await collection.find().toArray();
            return NextResponse.json(clients);
        }
    } catch (error) {
        console.error("Error fetching client(s):", error);
        return NextResponse.json(
            { error: "Failed to fetch client(s)" },
            { status: 500 }
        );
    } finally {
        await client.close();
    }
}


export async function POST(request: Request) {
    const clientData = await request.json();

    try {
        await client.connect();
        const database = client.db("your-database-name");
        const collection = database.collection("clients");

        const result = await collection.insertOne(clientData);
        return NextResponse.json(result, { status: 201 });
    }
    // catch (error) {
    //     return NextResponse.json(
    //         { error: "Failed to create client" },
    //         { status: 500 }
    //     );
    // } 
    finally {
        await client.close();
    }
}


export async function PUT(request: Request) {
    const { _id, ...clientData } = await request.json();

    try {

        await client.connect();
        const database = client.db("your-database-name");
        const collection = database.collection("clients");

        // Convert _id to ObjectId
        const objectId = new ObjectId(_id);

        // Log the data being updated

        const result = await collection.updateOne(
            { _id: objectId },
            { $set: clientData }
        );

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
    } finally {
        await client.close();
    }
}
export async function DELETE(request: Request) {
    const { id } = await request.json();

    try {
        await client.connect();
        const database = client.db("your-database-name");
        const collection = database.collection("clients");

        const result = await collection.deleteOne({ id: id });
        return NextResponse.json(result);
    }
    // catch (error) {
    //     return NextResponse.json(
    //         { error: "Failed to delete client" },
    //         { status: 500 }
    //     );
    // }
    finally {
        await client.close();
    }
}