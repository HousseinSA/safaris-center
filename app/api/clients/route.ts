import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

const uri = process.env.MONGODB_LINK!;
const client = new MongoClient(uri);

export async function GET() {
    try {
        await client.connect();
        const database = client.db("your-database-name");
        const collection = database.collection("clients");

        const clients = await collection.find().toArray();
        return NextResponse.json(clients);
    }
    // catch (error) {
    //     // @ts-expect-error fix
    //     return NextResponse.json(
    //         { error: "Failed to fetch clients" },
    //         { status: 500 }
    //     );
    // }
    finally {
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
    const { id, ...clientData } = await request.json();

    try {
        await client.connect();
        const database = client.db("your-database-name");
        const collection = database.collection("clients");

        // Convert id to ObjectId
        const objectId = new ObjectId(id);

        // Log the data being updated
        console.log("Updating client with ID:", id);
        console.log("New data:", clientData);

        const result = await collection.updateOne(
            { _id: objectId }, // Use _id instead of id
            { $set: clientData }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { error: "Client not found" },
                { status: 404 }
            );
        }

        // Log the result
        console.log("Update result:", result);

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