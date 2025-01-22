import { MongoClient, ObjectId, WithId } from "mongodb";
import { Client } from "@/lib/types"; // Adjust the import path as needed

const uri = process.env.MONGODB_LINK!;

if (!uri) {
    throw new Error("MONGODB_LINK environment variable is not defined");
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
    // Use a global variable to preserve the connection in development
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(global as any)._mongoClientPromise) {
        client = new MongoClient(uri);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (global as any)._mongoClientPromise = client.connect();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    clientPromise = (global as any)._mongoClientPromise;
} else {
    // In production, create a new connection
    client = new MongoClient(uri);
    clientPromise = client.connect();
}

const dbName = "your-database-name";

// Utility function to get the database instance
async function getDb() {
    const client = await clientPromise;
    return client.db(dbName);
}

// Utility function to get a collection
async function getCollection(collectionName: string) {
    const db = await getDb();
    return db.collection<Client>(collectionName); // Specify the type for the collection
}

// Utility functions for CRUD operations
const db = {
    // Fetch all clients
    async getAllClients(): Promise<WithId<Client>[]> {
        const collection = await getCollection("clients");
        return collection.find().toArray();
    },

    // Fetch a client by ID
    async getClientById(id: string): Promise<WithId<Client> | null> {
        const collection = await getCollection("clients");
        return collection.findOne({ _id: new ObjectId(id) }); // Convert id to ObjectId
    },

    // Create a new client
    async createClient(clientData: Omit<Client, "_id">): Promise<WithId<Client>> {
        const collection = await getCollection("clients");
        const result = await collection.insertOne(clientData as Client);
        if (!result.acknowledged) {
            throw new Error("Failed to create client");
        }
        return collection.findOne({ _id: result.insertedId }) as Promise<WithId<Client>>;
    },

    // Update a client by ID
    async updateClient(id: string, clientData: Partial<Client>) {
        const collection = await getCollection("clients");
        const result = await collection.updateOne(
            { _id: new ObjectId(id) }, // Convert id to ObjectId
            { $set: clientData }
        );
        return result;
    },

    // Delete a client by ID
    async deleteClient(id: string) {
        const collection = await getCollection("clients");
        const result = await collection.deleteOne({ _id: new ObjectId(id) }); // Convert id to ObjectId
        return result;
    },
};

export default db;