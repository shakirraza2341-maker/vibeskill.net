import { MongoClient, type Db } from "mongodb";

const databaseName = process.env.MONGODB_DB || "ai_mockinterview";

type MongoGlobal = typeof globalThis & {
  __mongoClientPromise?: Promise<MongoClient>;
};

const mongoGlobal = globalThis as MongoGlobal;

export async function getDatabase(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is required");
  const clientPromise = mongoGlobal.__mongoClientPromise || new MongoClient(uri, {
    appName: "ai-mockinterview",
    maxPoolSize: 10,
    minPoolSize: 0,
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
  }).connect();
  if (process.env.NODE_ENV !== "production") mongoGlobal.__mongoClientPromise = clientPromise;
  const client = await clientPromise;
  return client.db(databaseName);
}