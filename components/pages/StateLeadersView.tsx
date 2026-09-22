"use client";
import { motion } from "framer-motion";
import { Header, Footer, CTABand } from "@/components/site";
import type { Mentor, SiteSettings } from "@/lib/types";

/** Renders "…{highlight}…" with the highlighted phrase inside a <span>. */
function LeadersTitle({ title, highlight }: { title: string; highlight: string }) {
  const [before, after = ""] = title.split("{highlight}");
  return <h1 className="mentors-title">{before}<span>{highlight}</span>{after}</h1>;
}

/**
 * The state committee, four to a row.
 *
 * Same card as the band that used to sit at the foot of the About page - the
 * scalloped clip, the bob animation and the hover lift are shared CSS - but the
 * rail and its arrows are gone: every leader is on the page at once.
 */
export default function StateLeadersView({ settings, leaders }: { settings: SiteSettings; leaders: Mentor[] }) {
  const p = settings.pages.leaders;
  return (
    <div className="page page-inner">
      <Header />
      <section className="mentors-band leaders-band">
        <svg className="mentor-defs" aria-hidden focusable="false">
          <defs>
            <clipPath id="mScallop" clipPathUnits="objectBoundingBox">
              <path d="M 0.95 0.5 A 0.14 0.14 0 0 1 0.8897 0.725 A 0.14 0.14 0 0 1 0.725 0.8897 A 0.14 0.14 0 0 1 0.5 0.95 A 0.14 0.14 0 0 1 0.275 0.8897 A 0.14 0.14 0 0 1 0.1103 0.725 A 0.14 0.14 0 0 1 0.05 0.5 A 0.14 0.14 0 0 1 0.1103 0.275 A 0.14 0.14 0 0 1 0.275 0.1103 A 0.14 0.14 0 0 1 0.5 0.05 A 0.14 0.14 0 0 1 0.725 0.1103 A 0.14 0.14 0 0 1 0.8897 0.275 A 0.14 0.14 0 0 1 0.95 0.5 Z" />
            </clipPath>
          </defs>
        </svg>
        <div className="wrap">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }}>
            {p.kicker && <p className="mentors-eyebrow">{p.kicker}</p>}
            <LeadersTitle title={p.title} highlight={p.highlight} />
            {p.sub && <p className="mentors-sub">{p.sub}</p>}
          </motion.div>

          {leaders.length > 0 ? (
            <div className="mentors-grid">
              {leaders.map((m, i) => (
                <motion.div
                  key={m._id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  // Stagger by column so each row flows in from the left.
                  transition={{ delay: (i % 4) * 0.09, duration: .55 }}
                  whileHover={{ y: -8 }}
                  className="mentor-card"
                >
                  <span className={`mentor-shape scallop ${m.tone}`} style={{ animationDelay: `${-i * 1.2}s` }}>
                    <img src={m.photo} alt={m.name} loading="lazy" />
                  </span>
                  <b>{m.name}</b>
                  {m.role ? <small>{m.role}</small> : null}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="sub-card empty-card"><h4>സംസ്ഥാന സമിതി ഉടൻ ചേർക്കും</h4><p>ഭാരവാഹികളുടെ വിവരങ്ങൾ വൈകാതെ ഇവിടെ കാണാം.</p></div>
          )}
        </div>
      </section>
      <CTABand /><Footer />
    </div>
  );
}
