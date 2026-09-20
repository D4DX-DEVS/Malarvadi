import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/malarvadi";

declare global {
  // eslint-disable-next-line no-var
  var __mvMongo: Promise<MongoClient> | undefined;
}

function clientPromise(): Promise<MongoClient> {
  if (!global.__mvMongo) {
    global.__mvMongo = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 }).connect();
  }
  return global.__mvMongo;
}

export async function getDb(): Promise<Db> {
  const client = await clientPromise();
  // DB name comes from the URI path; fall back to "malarvadi" when absent.
  return client.db(client.options.dbName || "malarvadi");
}
