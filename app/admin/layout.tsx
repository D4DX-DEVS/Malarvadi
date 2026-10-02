import type { Metadata } from "next";
import { Inter, Noto_Sans_Malayalam } from "next/font/google";
import "./admin.css";
import Login from "@/components/admin/Login";
import AdminShell from "@/components/admin/AdminShell";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin • മലർവാടി",
  robots: { index: false, follow: false },
};

const ui = Inter({ subsets: ["latin"], variable: "--adm-font-ui", display: "swap" });
const ml = Noto_Sans_Malayalam({ subsets: ["malayalam"], variable: "--adm-font-ml", display: "swap" });

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const cls = `adm ${ui.variable} ${ml.variable}`;
  if (!isAdmin()) {
    return (
      <div className={cls}>
        <Login />
      </div>
    );
  }
  return (
    <div className={cls}>
      <AdminShell>{children}</AdminShell>
    </div>
  );
}
