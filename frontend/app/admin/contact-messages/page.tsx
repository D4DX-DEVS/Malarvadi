import type { Metadata } from "next";
import { Messages } from "./Messages";

export const metadata: Metadata = { title: "Admin messages" };

export default function AdminMessagesPage() {
  return <Messages />;
}
