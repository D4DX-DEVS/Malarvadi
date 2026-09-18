import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Admin login" };

export default function AdminLoginPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
      <div className="w-full rounded-card bg-white p-8 shadow-playful">
        <p className="font-display text-2xl font-bold">Malarvadi Admin</p>
        <p className="mt-1 text-sm text-cocoa/70">Sign in to manage website content.</p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
