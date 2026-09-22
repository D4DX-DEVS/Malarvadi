"use client";
import { motion } from "framer-motion";
import { ArrowRight, Sprout, Sun, Quote, GraduationCap, UsersRound, Heart, Leaf, Target, Sparkles } from "lucide-react";
import { Header, Footer, CTABand } from "@/components/site";
import { Icon } from "@/components/icons";
import type { AboutBlock, SiteSettings, Stat, TimelineItem } from "@/lib/types";

type Kind = "intro" | "objectives" | "global" | "history" | "generic";
type Section = { heading: string; kind: Kind; blocks: AboutBlock[] };

/**
 * Classify a section by its heading so the long-form copy drives the designed
 * layout. Anything unrecognised falls back to a plain panel, so editing or
 * adding headings in the admin never breaks the page.
 */
function classify(heading: string): Kind {
  if (!heading) return "intro";
  const h = heading.toLowerCase();
  if (/objective|ലക്ഷ്യ/.test(h)) return "objectives";
  if (/global|presence|ആഗോള|രാജ്യ/.test(h)) return "global";
  if (/history|ചരിത്ര/.test(h)) return "history";
  return "generic";
}

/** Split the flat block list into one section per h2. */
function sectionsOf(blocks: AboutBlock[]): Section[] {
  const out: Section[] = [];
  for (const b of blocks) {
    if (b.type === "h2" || !out.length) {
      const heading = b.type === "h2" ? b.text ?? "" : "";
      out.push({ heading, kind: classify(heading), blocks: [] });
      if (b.type === "h2") continue;
    }
    out[out.length - 1]!.blocks.push(b);
  }
  return out;
}

/** Group a section's blocks under their h3 headings. */
function subsectionsOf(blocks: AboutBlock[]) {
  const lead: AboutBlock[] = [];
  const subs: { heading: string; blocks: AboutBlock[] }[] = [];
  for (const b of blocks) {
    if (b.type === "h3") subs.push({ heading: b.text ?? "", blocks: [] });
    else if (subs.length) subs[subs.length - 1]!.blocks.push(b);
    else lead.push(b);
  }
  return { lead, subs };
}

const paras = (blocks: AboutBlock[]) => blocks.filter((b) => b.type === "p" && b.text);
const listItems = (blocks: AboutBlock[]) => blocks.flatMap((b) => (b.type === "ul" ? b.items ?? [] : []));

/**
 * Renders blocks in source order. Pulling all the paragraphs out first and the
 * lists after would silently reorder the copy - the sentence that follows a
 * list ("എന്നിവ വളർത്തുന്നതിനുള്ള…") would jump above it.
 */
function BlockFlow({ blocks, pClass = "ab-p" }: { blocks: AboutBlock[]; pClass?: string }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.type === "ul") return <ul key={i} className="ab-list">{(b.items ?? []).map((it, j) => <li key={j}>{it}</li>)}</ul>;
        if (b.type === "quote") return <blockquote key={i} className="ab-inline-quote">{b.text}</blockquote>;
        if (b.type === "h3") return <h3 key={i} className="ab-h3">{b.text}</h3>;
        if (!b.text) return null;
        return <p key={i} className={pClass}>{b.text}</p>;
      })}
    </>
  );
}

const CARD_ICONS = [GraduationCap, UsersRound, Heart, Sparkles, Leaf, Target];
const CARD_TONES = ["o-blue", "o-cream", "o-pink", "o-mint", "o-lav", "o-peach"];

/* --------------------------------------------------------------- sections */

function AboutHero({ p }: { p: SiteSettings["pages"]["about"] }) {
  const lead = p.heroSub;
  return (
    <section className="ab-hero">
      <div className="ab-hero-deco" aria-hidden="true">
        <i className="ab-blob k1" /><i className="ab-blob k2" /><i className="ab-blob k3" />
        <span className="ab-sun"><Sun size={30} strokeWidth={2} /></span>
        <span className="ab-clover"><Sprout size={24} strokeWidth={2} /></span>
      </div>
      <div className="wrap ab-hero-grid">
        <motion.div className="ab-hero-copy" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55 }}>
          {p.kicker && <span className="ab-eyebrow">{p.kicker}<i /></span>}
          <h1 className="ab-title">{p.title}</h1>
          {lead && <p className="ab-lead">{lead}</p>}
          {p.heroCta && <a className="btn btn-green ab-cta" href={p.heroCtaHref || "/contact"}>{p.heroCta} <ArrowRight size={15} /></a>}
        </motion.div>
        <motion.div className="ab-hero-art" initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55, delay: .1 }}>
          {p.image && <img src={p.image} alt="" aria-hidden />}
        </motion.div>
      </div>
    </section>
  );
}

function IntroCard({ p, section }: { p: SiteSettings["pages"]["about"]; section: Section }) {
  const body = paras(section.blocks);
  if (!body.length) return null;
  return (
    <div className="wrap">
      <section className="ab-intro reveal">
        <div className="ab-intro-head">
          <img className="ab-intro-logo" src="/logo-new.png" alt="മലർവാടി — ബാലസംഘം" width={557} height={154} />
        </div>
        <div className="ab-intro-body">{body.map((b, i) => <p key={i}>{b.text}</p>)}</div>
      </section>
    </div>
  );
}

function Objectives({ section, p }: { section: Section; p: SiteSettings["pages"]["about"] }) {
  const items = listItems(section.blocks);
  const titles = section.blocks.flatMap((b) => (b.type === "ul" ? b.titles ?? [] : []));
  const intro = paras(section.blocks);
  // The first paragraph sits in the header; every later one still has to be
  // shown, or the line that introduces the list ("ഇതിനായി…") disappears.
  const rest = intro.slice(1);
  return (
    <div className="wrap">
      <section className="ab-panel reveal">
        <div className="ab-panel-head ab-panel-head-wide">
          <div>
            <h2 className="ab-h2">{section.heading}</h2>
            {p.objectivesSub && <p className="ab-sub">{p.objectivesSub}</p>}
            {intro[0]?.text && <p className="ab-sub">{intro[0].text}</p>}
          </div>
        </div>
        {rest.length > 0 && <div className="ab-obj-lead">{rest.map((b, i) => <p key={i} className="ab-p">{b.text}</p>)}</div>}
        {items.length > 0 && (
          <ul className="ab-obj-grid">
            {items.map((text, i) => {
              const I = CARD_ICONS[i % CARD_ICONS.length]!;
              return (
                <motion.li key={i} className={`ab-obj ${CARD_TONES[i % CARD_TONES.length]}`}
                  initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: (i % 5) * 0.06 }} whileHover={{ y: -5 }}>
                  <span className="ab-obj-icon"><I size={23} strokeWidth={1.9} /></span>
                  {titles[i] ? <b className="ab-obj-title">{titles[i]}</b> : null}
                  <span className="ab-obj-text">{text}</span>
                </motion.li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

/**
 * Dotted world map. The coordinates are an equirectangular rasterisation of
 * rough continent shapes (viewBox 200x100 = 360deg x 180deg), so it reads as a
 * world map without shipping a heavy GeoJSON path.
 */
const WORLD_DOTS = "73.4,6.7 76.0,6.7 78.6,6.7 81.1,6.7 70.9,9.2 73.4,9.2 76.0,9.2 78.6,9.2 81.1,9.2 83.7,9.2 17.2,11.8 70.9,11.8 73.4,11.8 76.0,11.8 78.6,11.8 81.1,11.8 137.3,11.8 139.9,11.8 142.4,11.8 145.0,11.8 147.6,11.8 150.1,11.8 152.7,11.8 155.2,11.8 157.8,11.8 160.3,11.8 12.1,14.3 14.7,14.3 17.2,14.3 19.8,14.3 22.3,14.3 40.2,14.3 42.8,14.3 45.3,14.3 47.9,14.3 129.7,14.3 132.2,14.3 134.8,14.3 137.3,14.3 139.9,14.3 142.4,14.3 145.0,14.3 147.6,14.3 150.1,14.3 152.7,14.3 155.2,14.3 157.8,14.3 160.3,14.3 162.9,14.3 165.4,14.3 168.0,14.3 12.1,16.9 14.7,16.9 17.2,16.9 19.8,16.9 22.3,16.9 32.6,16.9 35.1,16.9 37.7,16.9 40.2,16.9 42.8,16.9 45.3,16.9 47.9,16.9 50.4,16.9 53.0,16.9 55.6,16.9 99.0,16.9 101.6,16.9 104.1,16.9 106.7,16.9 109.2,16.9 111.8,16.9 114.3,16.9 127.1,16.9 129.7,16.9 132.2,16.9 134.8,16.9 137.3,16.9 139.9,16.9 142.4,16.9 145.0,16.9 147.6,16.9 150.1,16.9 152.7,16.9 155.2,16.9 157.8,16.9 160.3,16.9 162.9,16.9 165.4,16.9 168.0,16.9 170.6,16.9 30.0,19.4 32.6,19.4 35.1,19.4 37.7,19.4 40.2,19.4 42.8,19.4 45.3,19.4 47.9,19.4 50.4,19.4 53.0,19.4 55.6,19.4 58.1,19.4 96.4,19.4 99.0,19.4 101.6,19.4 104.1,19.4 106.7,19.4 109.2,19.4 111.8,19.4 114.3,19.4 116.9,19.4 127.1,19.4 129.7,19.4 132.2,19.4 134.8,19.4 137.3,19.4 139.9,19.4 142.4,19.4 145.0,19.4 147.6,19.4 150.1,19.4 152.7,19.4 155.2,19.4 157.8,19.4 160.3,19.4 162.9,19.4 165.4,19.4 168.0,19.4 170.6,19.4 30.0,22.0 32.6,22.0 35.1,22.0 37.7,22.0 40.2,22.0 42.8,22.0 45.3,22.0 47.9,22.0 50.4,22.0 53.0,22.0 55.6,22.0 58.1,22.0 60.7,22.0 96.4,22.0 99.0,22.0 101.6,22.0 104.1,22.0 106.7,22.0 109.2,22.0 111.8,22.0 114.3,22.0 116.9,22.0 124.6,22.0 127.1,22.0 129.7,22.0 132.2,22.0 134.8,22.0 137.3,22.0 139.9,22.0 142.4,22.0 145.0,22.0 147.6,22.0 150.1,22.0 152.7,22.0 155.2,22.0 157.8,22.0 160.3,22.0 162.9,22.0 165.4,22.0 168.0,22.0 170.6,22.0 173.1,22.0 30.0,24.6 32.6,24.6 35.1,24.6 37.7,24.6 40.2,24.6 42.8,24.6 45.3,24.6 47.9,24.6 50.4,24.6 53.0,24.6 55.6,24.6 58.1,24.6 60.7,24.6 99.0,24.6 101.6,24.6 104.1,24.6 106.7,24.6 109.2,24.6 111.8,24.6 114.3,24.6 127.1,24.6 129.7,24.6 132.2,24.6 134.8,24.6 137.3,24.6 139.9,24.6 142.4,24.6 145.0,24.6 147.6,24.6 150.1,24.6 152.7,24.6 155.2,24.6 157.8,24.6 160.3,24.6 162.9,24.6 165.4,24.6 168.0,24.6 170.6,24.6 173.1,24.6 175.7,24.6 178.2,24.6 180.8,24.6 30.0,27.1 32.6,27.1 35.1,27.1 37.7,27.1 40.2,27.1 42.8,27.1 45.3,27.1 47.9,27.1 50.4,27.1 53.0,27.1 55.6,27.1 58.1,27.1 60.7,27.1 63.2,27.1 106.7,27.1 129.7,27.1 132.2,27.1 134.8,27.1 137.3,27.1 139.9,27.1 142.4,27.1 145.0,27.1 147.6,27.1 150.1,27.1 152.7,27.1 155.2,27.1 157.8,27.1 160.3,27.1 162.9,27.1 165.4,27.1 168.0,27.1 170.6,27.1 173.1,27.1 175.7,27.1 178.2,27.1 180.8,27.1 32.6,29.7 35.1,29.7 37.7,29.7 40.2,29.7 42.8,29.7 45.3,29.7 47.9,29.7 50.4,29.7 53.0,29.7 55.6,29.7 58.1,29.7 60.7,29.7 127.1,29.7 129.7,29.7 132.2,29.7 134.8,29.7 137.3,29.7 139.9,29.7 142.4,29.7 145.0,29.7 147.6,29.7 150.1,29.7 152.7,29.7 155.2,29.7 157.8,29.7 160.3,29.7 162.9,29.7 168.0,29.7 170.6,29.7 173.1,29.7 175.7,29.7 178.2,29.7 180.8,29.7 40.2,32.2 42.8,32.2 45.3,32.2 47.9,32.2 50.4,32.2 53.0,32.2 55.6,32.2 58.1,32.2 122.0,32.2 124.6,32.2 127.1,32.2 129.7,32.2 132.2,32.2 134.8,32.2 170.6,32.2 173.1,32.2 175.7,32.2 178.2,32.2 42.8,34.8 45.3,34.8 47.9,34.8 50.4,34.8 53.0,34.8 55.6,34.8 122.0,34.8 124.6,34.8 127.1,34.8 129.7,34.8 132.2,34.8 134.8,34.8 152.7,34.8 155.2,34.8 157.8,34.8 160.3,34.8 162.9,34.8 165.4,34.8 45.3,37.3 47.9,37.3 50.4,37.3 53.0,37.3 106.7,37.3 109.2,37.3 111.8,37.3 114.3,37.3 122.0,37.3 124.6,37.3 127.1,37.3 129.7,37.3 132.2,37.3 134.8,37.3 150.1,37.3 152.7,37.3 155.2,37.3 157.8,37.3 160.3,37.3 162.9,37.3 165.4,37.3 168.0,37.3 104.1,39.9 106.7,39.9 109.2,39.9 111.8,39.9 114.3,39.9 116.9,39.9 129.7,39.9 147.6,39.9 150.1,39.9 152.7,39.9 155.2,39.9 157.8,39.9 160.3,39.9 162.9,39.9 165.4,39.9 168.0,39.9 101.6,42.4 104.1,42.4 106.7,42.4 109.2,42.4 111.8,42.4 114.3,42.4 116.9,42.4 119.4,42.4 150.1,42.4 152.7,42.4 155.2,42.4 157.8,42.4 160.3,42.4 162.9,42.4 165.4,42.4 168.0,42.4 58.1,45.0 60.7,45.0 101.6,45.0 104.1,45.0 106.7,45.0 109.2,45.0 111.8,45.0 114.3,45.0 116.9,45.0 119.4,45.0 152.7,45.0 155.2,45.0 157.8,45.0 160.3,45.0 162.9,45.0 165.4,45.0 55.6,47.6 58.1,47.6 60.7,47.6 63.2,47.6 65.8,47.6 68.3,47.6 101.6,47.6 104.1,47.6 106.7,47.6 109.2,47.6 111.8,47.6 114.3,47.6 116.9,47.6 119.4,47.6 55.6,50.1 58.1,50.1 60.7,50.1 63.2,50.1 65.8,50.1 68.3,50.1 70.9,50.1 101.6,50.1 104.1,50.1 106.7,50.1 109.2,50.1 111.8,50.1 114.3,50.1 116.9,50.1 119.4,50.1 58.1,52.7 60.7,52.7 63.2,52.7 65.8,52.7 68.3,52.7 70.9,52.7 101.6,52.7 104.1,52.7 106.7,52.7 109.2,52.7 111.8,52.7 114.3,52.7 116.9,52.7 60.7,55.2 63.2,55.2 65.8,55.2 68.3,55.2 70.9,55.2 73.4,55.2 104.1,55.2 106.7,55.2 109.2,55.2 111.8,55.2 114.3,55.2 60.7,57.8 63.2,57.8 65.8,57.8 68.3,57.8 70.9,57.8 73.4,57.8 109.2,57.8 111.8,57.8 114.3,57.8 116.9,57.8 119.4,57.8 60.7,60.3 63.2,60.3 65.8,60.3 68.3,60.3 70.9,60.3 73.4,60.3 109.2,60.3 111.8,60.3 114.3,60.3 116.9,60.3 119.4,60.3 168.0,60.3 170.6,60.3 173.1,60.3 175.7,60.3 178.2,60.3 180.8,60.3 60.7,62.9 63.2,62.9 65.8,62.9 68.3,62.9 70.9,62.9 109.2,62.9 111.8,62.9 114.3,62.9 116.9,62.9 119.4,62.9 168.0,62.9 170.6,62.9 173.1,62.9 175.7,62.9 178.2,62.9 180.8,62.9 63.2,65.4 65.8,65.4 68.3,65.4 70.9,65.4 109.2,65.4 111.8,65.4 114.3,65.4 116.9,65.4 168.0,65.4 170.6,65.4 173.1,65.4 175.7,65.4 178.2,65.4 180.8,65.4 63.2,68.0 65.8,68.0 68.3,68.0 170.6,68.0 173.1,68.0 175.7,68.0 178.2,68.0 196.1,70.6 193.6,73.1 196.1,73.1"
  .split(" ")
  .map((pair) => pair.split(",").map(Number) as [number, number]);

/** Units reach out from Kerala to the Gulf, Europe and the US. Coordinates are
 *  lon/lat mapped into the same 200x104 space as the land dots:
 *  x = (lon + 180) / 360 * 200,  y = (90 - lat) / 180 * 100. */
const ROUTES = [
  "M142 44 C139 37, 135 32, 131 37",
  "M142 44 C131 24, 114 14, 100 22",
  "M142 44 C112 4, 70 6, 47 29",
];

function WorldMap({ markers }: { markers: string }) {
  const pins = markers
    .split(",")
    .map((m) => m.trim().split(/\s+/).map(Number))
    .filter((m) => m.length === 2 && m.every((n) => Number.isFinite(n))) as [number, number][];
  return (
    <svg className="ab-worldmap" viewBox="0 0 200 104" fill="none" aria-hidden focusable="false">
      <g className="ab-world-land">
        {WORLD_DOTS.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="0.9" />)}
      </g>
      <g className="ab-world-routes">
        {ROUTES.map((d, i) => <path key={i} d={d} strokeDasharray="2 2.6" />)}
      </g>
      <g className="ab-world-pins">
        {pins.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.1" />)}
      </g>
    </svg>
  );
}

function GlobalPresence({ section, stats, markers, link, linkHref }: { section: Section; stats: Stat[]; markers: string; link: string; linkHref: string }) {
  return (
    <div className="wrap">
      <section className="ab-panel ab-global reveal">
        <div className="ab-global-copy">
          <h2 className="ab-h2">{section.heading}</h2>
          <BlockFlow blocks={section.blocks} />
          {link && <a className="ab-pill-link" href={linkHref || "#"}>{link} <ArrowRight size={14} /></a>}
        </div>
        <div className="ab-global-map" aria-hidden="true"><WorldMap markers={markers} /></div>
        <ul className="ab-stats">
          {stats.map((s) => (
            <li key={s.label}>
              <span className={`ab-stat-icon ${s.tone}`}><Icon name={s.icon} size={18} /></span>
              <div>
                <b>{s.value.toLocaleString("en-IN")}{s.suffix}</b>
                <small>{s.label}</small>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

/** The hero heading, with its closing phrase carried in the accent colour. */
function HistoryHeading({ text }: { text: string }) {
  const words = text.trim().split(/\s+/);
  const last = words.length > 1 ? words.pop()! : "";
  return <h3 className="ab-hist-h">{words.join(" ")}{last && <> <span>{last}</span></>}</h3>;
}

function History({ section, notes, p }: { section: Section; notes: { note: string }[]; p: SiteSettings["pages"]["about"] }) {
  const { lead, subs } = subsectionsOf(section.blocks);
  // The copy often jumps straight from the h2 to the first h3, leaving nothing
  // in the hero card - promote that first subsection into the lead.
  const hasLead = paras(lead).length > 0;
  const leadSub = hasLead ? null : subs[0] ?? null;
  const gridSubs = leadSub ? subs.slice(1) : subs;
  // The photographs are gone; the callouts that sat on them are now the
  // handwritten note beside the hero copy.
  const shown = notes.filter((n) => (n.note ?? "").trim() !== "");
  return (
    <div className="wrap">
      <section className="ab-hist-hero reveal">
        <div className="ab-hist-hero-copy">
          <h2 className="ab-hist-kicker">{section.heading}</h2>
          {leadSub?.heading && <HistoryHeading text={leadSub.heading} />}
          <BlockFlow blocks={leadSub ? leadSub.blocks : lead} pClass="ab-hist-lead-p" />
          {p.historyCta && (
            <a className="btn btn-deep ab-hist-cta" href={p.historyCtaHref || "/gallery"}>
              {p.historyCta} <ArrowRight size={15} />
            </a>
          )}
        </div>

        <div className="ab-hist-hero-art">
          <span className="ab-hist-deco" aria-hidden="true">
            <span className="ab-hist-sun"><Sun size={40} strokeWidth={2.2} /></span>
            <i className="ab-hist-leaf f1" /><i className="ab-hist-leaf f2" /><i className="ab-hist-leaf f3" />
          </span>
          {p.historyImage && (
            <span className="ab-hist-photo"><img src={p.historyImage} alt="" aria-hidden loading="lazy" /></span>
          )}
          {shown.length > 0 && (
            <span className="ab-hist-script">
              {shown.map((n, i) => <span key={i}>{n.note}</span>)}
            </span>
          )}
        </div>
      </section>

      {gridSubs.length > 0 && (
        <div className="ab-hist-grid">
          {gridSubs.map((sub, i) => {
            const I = CARD_ICONS[i % CARD_ICONS.length]!;
            return (
              <motion.article key={i} className="ab-hist-card"
                initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: (i % 3) * 0.06 }}>
                <span className="ab-hist-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <span className={`ab-hist-icon ${CARD_TONES[i % CARD_TONES.length]}`}><I size={24} strokeWidth={2} /></span>
                <h3>{sub.heading}</h3>
                <BlockFlow blocks={sub.blocks} pClass="" />
              </motion.article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function GenericSection({ section }: { section: Section }) {
  return (
    <div className="wrap">
      <section className="ab-panel reveal">
        {section.heading && <h2 className="ab-h2">{section.heading}</h2>}
        <BlockFlow blocks={section.blocks} />
      </section>
    </div>
  );
}

function QuoteBand({ quotes }: { quotes: AboutBlock[] }) {
  if (!quotes.length) return null;
  return (
    <section className="ab-quote-band reveal">
      <span className="ab-quote-leaf" aria-hidden><Leaf size={70} strokeWidth={1.2} /></span>
      <div className="wrap">
        <span className="ab-quote-mark" aria-hidden><Quote size={30} fill="currentColor" strokeWidth={0} /></span>
        <blockquote>{quotes[0]!.text}</blockquote>
        {quotes[1]?.text && <p className="ab-quote-sub">{quotes[1].text}</p>}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- page */

export default function AboutView({ settings, timeline }: { settings: SiteSettings; timeline: TimelineItem[] }) {
  const p = settings.pages.about;
  const sections = sectionsOf(p.blocks ?? []);
  // Only the closing quote is lifted into the band. Earlier quotes are
  // introduced by the sentence above them ("…മാറ്റമില്ലാതെ തുടരുന്നു:"), so
  // moving them to the end of the page would strip them of their lead-in.
  const allQuotes = (p.blocks ?? []).filter((b) => b.type === "quote");
  const bandQuote = allQuotes[allQuotes.length - 1];
  return (
    <div className="page page-inner about-page">
      <Header />
      <AboutHero p={p} />

      {sections.map((sec, i) => {
        const clean: Section = { ...sec, blocks: sec.blocks.filter((b) => b !== bandQuote) };
        if (clean.kind === "intro") return <IntroCard key={i} p={p} section={clean} />;
        if (clean.kind === "objectives") return <Objectives key={i} section={clean} p={p} />;
        if (clean.kind === "global") return <GlobalPresence key={i} section={clean} stats={p.globalStats?.length ? p.globalStats : settings.stats} markers={p.globalMarkers} link={p.globalLink} linkHref={p.globalLinkHref} />;
        if (clean.kind === "history") return <History key={i} section={clean} notes={p.historyCards ?? []} p={p} />;
        return <GenericSection key={i} section={clean} />;
      })}

      <QuoteBand quotes={bandQuote ? [bandQuote] : []} />

      <CTABand /><Footer />
    </div>
  );
}
