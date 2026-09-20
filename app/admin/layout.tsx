import type { Metadata } from "next";
import "./admin.css";
import Login from "@/components/admin/Login";
import Sidebar from "@/components/admin/Sidebar";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin • മലർവാടി",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isAdmin()) {
    return (
      <div className="adm">
        <Login />
      </div>
    );
  }
  return (
    <div className="adm">
      <Sidebar />
      <main className="adm-main">
        <div className="adm-wrap">{children}</div>
      </main>
    </div>
  );
}
