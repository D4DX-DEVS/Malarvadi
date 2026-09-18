import type { Metadata } from "next";
import { Dashboard } from "./Dashboard";

export const metadata: Metadata = { title: "Admin dashboard" };

export default function AdminHome() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-sm text-cocoa/70">Content overview and quick links.</p>
      <div className="mt-5">
        <Dashboard />
      </div>
    </div>
  );
}
