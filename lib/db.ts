import { MongoClient, Db } from "mongodb";

function connectionUri(): string {
  const env = process.env.MONGODB_URI;
  if (env) return env;
  // A production container has no local mongod: fail loudly instead of making
  // every page time out against 127.0.0.1.
  if (process.env.NODE_ENV === "production") throw new Error("MONGODB_URI env var is required in production");
  return "mongodb://127.0.0.1:27017/malarvadi";
}

declare global {
  // eslint-disable-next-line no-var
  var __mvMongo: Promise<MongoClient> | undefined;
}

function clientPromise(): Promise<MongoClient> {
  if (!global.__mvMongo) {
    global.__mvMongo = new MongoClient(connectionUri(), { serverSelectionTimeoutMS: 5000 }).connect();
  }
  return global.__mvMongo;
}

export async function getDb(): Promise<Db> {
  const client = await clientPromise();
  // DB name comes from the URI path; fall back to "malarvadi" when absent.
  return client.db(client.options.dbName || "malarvadi");
}
