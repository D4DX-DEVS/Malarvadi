import { notFound } from "next/navigation";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMeta } from "@/lib/seo";
import { Container } from "@/components/ui";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { Float, FlowerFriend, Heart, KidWaving, Star } from "@/components/Decor";
import { ContactForm } from "./ContactForm";
import { GardenAmbience } from "@/components/GardenAmbience";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale === "ml" ? "ml" : "en";
  const dict = getDictionary(l);
  return pageMeta(l, "/contact", dict.contact.title, dict.contact.sub);
}

/** Simple inline glyphs for the three info cards. */
function PinIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
    </svg>
  );
}
function MailIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M3 5.5h18c.6 0 1 .4 1 1V18a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 2 18V6.5c0-.6.4-1 1-1Zm9 7.2 8-4.7H4l8 4.7Z" />
    </svg>
  );
}
function PhoneIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M6.6 3h2.2c.5 0 .9.3 1 .8l.9 3.2c.1.4 0 .8-.4 1l-1.7 1.2a13 13 0 0 0 6.2 6.2l1.2-1.7c.2-.4.6-.5 1-.4l3.2.9c.5.1.8.5.8 1v2.2a2 2 0 0 1-2.2 2A17.5 17.5 0 0 1 4.6 5.2 2 2 0 0 1 6.6 3Z" />
    </svg>
  );
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = getDictionary(locale);

  /* Only cards with a real value are rendered - see contact.* in the
     dictionaries. Nothing here is invented. */
  const cards = [
    { key: "address", Icon: PinIcon, label: dict.contact.addressLabel, value: dict.contact.addressValue, tint: "bg-berry/10 text-berry", href: "" },
    { key: "email", Icon: MailIcon, label: dict.contact.emailLabel, value: dict.contact.emailValue, tint: "bg-leaf/15 text-[#1e7a4e]", href: dict.contact.emailValue ? `mailto:${dict.contact.emailValue}` : "" },
    { key: "phone", Icon: PhoneIcon, label: dict.contact.callLabel, value: dict.contact.phoneValue, tint: "bg-sky/20 text-ink-blue", href: dict.contact.phoneValue ? `tel:${dict.contact.phoneValue.replace(/\s+/g, "")}` : "" },
  ].filter((c) => c.value);

  return (
    <main className="relative">
      <GardenAmbience />
      <Container className="relative py-10 sm:py-14">
        <PageHero
          badge={dict.nav.contact}
          badgeTone="teal"
          title={dict.contact.formTitle}
          sub={dict.contact.formSub}
          tint="from-teal/25 to-cream"
          mascot={<KidWaving className="h-28 w-20" />}
        />

        {cards.length ? (
          <div className="card-grid section-gap sm:grid-cols-3">
            {cards.map((c, i) => {
              const inner = (
                <>
                  <span className={`flex h-12 w-12 items-center justify-center rounded-full ${c.tint}`} aria-hidden="true">
                    <c.Icon className="h-6 w-6" />
                  </span>
                  <span className="t-h4 mt-3 block">{c.label}</span>
                  <span className="t-meta mt-1 block">{c.value}</span>
                </>
              );
              return (
                <Reveal key={c.key} delay={`${i * 120}ms`} variant="up" className="h-full">
                  {c.href ? (
                    <a href={c.href} className="pop block h-full rounded-cardXl bg-white p-5 text-center shadow-playful hover:shadow-soft">
                      {inner}
                    </a>
                  ) : (
                    <div className="pop h-full rounded-cardXl bg-white p-5 text-center shadow-playful hover:shadow-soft">{inner}</div>
                  )}
                </Reveal>
              );
            })}
          </div>
        ) : null}

        <div className={`grid gap-6 lg:grid-cols-[1.1fr_0.9fr] ${cards.length ? "block-gap" : "section-gap"}`}>
          <Reveal variant="left">
            <div className="relative overflow-hidden rounded-cardXl bg-white p-6 shadow-playful sm:p-8">
              <Float className="pointer-events-none absolute -right-2 -top-2 opacity-20" animation="animate-twinkle">
                <Star className="h-14 w-14 text-marigold" />
              </Float>
              {/* No heading here on purpose: the banner above already introduces
                  the section, and in Malayalam this string is the same word as
                  the banner's pill, so it read (and announced) twice. */}
              <ContactForm
                locale={locale}
                labels={{
                  name: dict.contact.name,
                  email: dict.contact.email,
                  phone: dict.contact.phone,
                  subject: dict.contact.subject,
                  message: dict.contact.message,
                  send: dict.contact.send,
                }}
                success={dict.contact.success}
                fail={dict.contact.fail}
              />
            </div>
          </Reveal>

          {/* Kindness panel - the reference's flower mascot corner */}
          <Reveal variant="right">
            <div className="relative flex h-full min-h-[18rem] flex-col items-center justify-center overflow-hidden rounded-cardXl bg-gradient-to-b from-mint to-leaf/20 p-8 text-center shadow-playful">
              <Float animation="animate-float-slow">
                <FlowerFriend className="h-28 w-24" />
              </Float>
              <p className="t-h3 mt-5 text-leaf">{dict.contact.spread}</p>
              <p className="t-meta mt-2 max-w-xs">{dict.about.heroLine}</p>
              <Heart className="mt-4 h-6 w-6 text-berry/70" />
              <svg viewBox="0 0 400 80" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-x-0 bottom-0 h-10 w-full">
                <path d="M0 50 Q 60 18 140 44 T 300 40 T 400 48 L400 80 L0 80 Z" fill="#2FA36B" opacity="0.35" />
                <path d="M0 64 Q 90 38 200 58 T 400 56 L400 80 L0 80 Z" fill="#2FA36B" opacity="0.5" />
              </svg>
            </div>
          </Reveal>
        </div>
      </Container>
    </main>
  );
}
