import { MongoClient, ObjectId, WithId, Db, Collection, InsertOneResult } from "mongodb";
import { Client, Expense } from "@/lib/types"; // Import both Client and Expense types

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
async function getDb(): Promise<Db> {
    const client = await clientPromise;
    return client.db(dbName);
}

// Utility function to get a collection
// @ts-expect-error fix
async function getCollection<T>(collectionName: string): Promise<Collection<T>> {
    const db = await getDb();
    // @ts-expect-error fix
    return db.collection<T>(collectionName);
}

// Utility functions for CRUD operations
const db = {
    // ================== User Authentication ==================
    // Verify user password
    async verifyUserPassword(password: string): Promise<boolean> {
        const collection = await getCollection<{ _id: ObjectId; password: string }>("users");

        // Fetch the user (assuming there's only one user for simplicity)
        const user = await collection.findOne({ _id: new ObjectId("67969735f70844404c19b654") });

        if (!user) {
            throw new Error("User not found");
        }

        // Compare plain text passwords
        return password === user.password;
    },

    // Update user password (plain text)
    async updateUserPassword(newPassword: string): Promise<void> {
        const collection = await getCollection<{ _id: ObjectId; password: string }>("users");

        // Update the password for the user
        await collection.updateOne(
            { _id: new ObjectId("67969735f70844404c19b654") }, // Use the same ObjectId
            { $set: { password: newPassword } } // Store plain text password
        );
    },


    // ================== Client Operations ==================
    // Fetch all clients
    async getAllClients(): Promise<WithId<Client>[]> {
        const collection = await getCollection<Client>("clients");
        return collection.find().toArray();
    },

    // Fetch a client by ID
    async getClientById(id: string): Promise<WithId<Client> | null> {
        const collection = await getCollection<Client>("clients");
        return collection.findOne({ _id: new ObjectId(id) });
    },

    // Create a new client
    async createClient(clientData: Omit<Client, "_id">): Promise<WithId<Client>> {
        const collection = await getCollection<Client>("clients");
        const result: InsertOneResult<Client> = await collection.insertOne(clientData as Client);
        if (!result.acknowledged) {
            throw new Error("Failed to create client");
        }
        return collection.findOne({ _id: result.insertedId }) as Promise<WithId<Client>>;
    },

    // Update a client by ID
    async updateClient(id: string, clientData: Partial<Client>) {
        const collection = await getCollection<Client>("clients");
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: clientData }
        );
        return result;
    },

    // Delete a client by ID
    async deleteClient(id: string) {
        const collection = await getCollection<Client>("clients");
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        return result;
    },

    // ================== Expense Operations ==================
    // Fetch all expenses
    async getAllExpenses(): Promise<WithId<Expense>[]> {
        const collection = await getCollection<Expense>("expenses");
        return collection.find().toArray();
    },

    // Fetch an expense by ID
    async getExpenseById(id: string): Promise<WithId<Expense> | null> {
        const collection = await getCollection<Expense>("expenses");
        return collection.findOne({ _id: new ObjectId(id) });
    },

    // Create a new expense
    async createExpense(expenseData: Omit<Expense, "_id">): Promise<WithId<Expense>> {
        const collection = await getCollection<Expense>("expenses");
        const result: InsertOneResult<Expense> = await collection.insertOne(expenseData);
        if (!result.acknowledged) {
            throw new Error("Failed to create expense");
        }
        return { _id: result.insertedId, ...expenseData };
    },

    // Update an expense by ID
    async updateExpense(id: string, expenseData: Partial<Expense>) {
        const collection = await getCollection<Expense>("expenses");
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: expenseData }
        );
        return result;
    },

    // Delete an expense by ID
    async deleteExpense(id: string) {
        const collection = await getCollection<Expense>("expenses");
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        return result;
    },
};

export default db;