import dns from "node:dns";
import mongoose from "mongoose";
import { env } from "./env.js";

// Public resolvers used only as a fallback: some machines are configured with a
// loopback DNS proxy (VPN client, ad blocker) that is not running, which makes
// every SRV lookup for a mongodb+srv:// URI fail with ECONNREFUSED even though
// the rest of the network is fine.
const FALLBACK_DNS = ["1.1.1.1", "8.8.8.8"];

async function ensureSrvResolvable(uri: string): Promise<void> {
  if (!uri.startsWith("mongodb+srv://")) return;
  const host = uri.split("@")[1]?.split(/[/?]/)[0];
  if (!host) return;
  const srvName = `_mongodb._tcp.${host}`;
  try {
    await dns.promises.resolveSrv(srvName);
  } catch {
    dns.setServers(FALLBACK_DNS);
    await dns.promises.resolveSrv(srvName);
    console.log(`[backend] system DNS could not resolve ${srvName}; using ${FALLBACK_DNS.join(", ")}`);
  }
}

export async function connectDb(): Promise<"connected" | "skipped"> {
  if (!env.mongoUri) {
    console.log("[backend] MONGODB_URI not set - running without database (demo mode)");
    return "skipped";
  }
  await ensureSrvResolvable(env.mongoUri);
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.mongoUri);
  console.log("[backend] connected to MongoDB");
  return "connected";
}

export function dbReady(): boolean {
  return mongoose.connection.readyState === 1;
}
