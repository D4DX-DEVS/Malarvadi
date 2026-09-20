import ContactView from "@/components/pages/ContactView";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  // All copy comes from settings via the SiteProvider in app/layout.tsx.
  return <ContactView />;
}
