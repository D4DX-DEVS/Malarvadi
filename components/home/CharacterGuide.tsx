"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, Compass, Sparkles } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Anchor = "left" | "center" | "right";
type Pose = "wave" | "point" | "peek" | "celebrate" | "read" | "spark";

type GuideStop = {
  selector: string;
  title: string;
  copy: string;
  action: string;
  pose: Pose;
  anchor: Anchor;
};

/* One stop per home segment. `anchor` is where the 3D guide walks to while
   that segment owns the screen, so the character keeps travelling down the
   page instead of standing in the same corner the whole way. */
const GUIDE_STOPS: GuideStop[] = [
  { selector: ".hero", title: "നമസ്കാരം!", copy: "നമുക്ക് ഒരു സന്തോഷ യാത്ര തുടങ്ങാം.", action: "തുടങ്ങാം", pose: "wave", anchor: "center" },
  { selector: ".program-scene", title: "നിന്റെ പരിപാടി തിരഞ്ഞെടുക്കൂ", copy: "ലോഗോയിൽ ക്ലിക്ക് ചെയ്ത് ഓരോ ലോകവും കാണാം.", action: "പരിപാടികളിലേക്ക്", pose: "point", anchor: "right" },
  { selector: ".about", title: "ഇവിടെയാണ് ഞങ്ങളുടെ കൂട്ടം", copy: "കളിച്ചും പഠിച്ചും വളരുന്ന ഒരു സ്നേഹക്കൂട്ടം.", action: "കൂടുതൽ അറിയാം", pose: "peek", anchor: "left" },
  { selector: ".stats", title: "നമ്മുടെ കൂട്ടുകാർ", copy: "ആയിരക്കണക്കിന് കുട്ടികളും മെന്റർമാരും ഒരുമിച്ച്.", action: "വാർത്തകളിലേക്ക്", pose: "celebrate", anchor: "center" },
  { selector: ".monthly-band", title: "ഈ മാസത്തെ പരിപാടി", copy: "ഏറ്റവും പുതിയ പരിപാടിയെ ഇവിടെ കണ്ടെത്താം.", action: "പരിപാടി കാണാം", pose: "point", anchor: "left" },
  { selector: ".news-band", title: "പുതിയ വിശേഷങ്ങൾ", copy: "ഇവിടെ മലർവാടിയിലെ പുതിയ കഥകൾ കാത്തിരിക്കുന്നു.", action: "വായിക്കാം", pose: "read", anchor: "right" },
  { selector: ".gallery-stack", title: "ഓർമ്മകളുടെ ഗാലറി", copy: "ഒരു ചിത്രം, ഒരു ചിരി, ഒരു മധുര ഓർമ്മ.", action: "ചിത്രങ്ങൾ കാണാം", pose: "spark", anchor: "left" },
  { selector: ".features-bg", title: "എന്തുകൊണ്ട് മലർവാടി?", copy: "ഓരോ കുട്ടിക്കും തിളങ്ങാൻ ഒരു വേദി.", action: "അടുത്തത്", pose: "celebrate", anchor: "center" },
  { selector: ".app-band", title: "കഥകൾ കൈയ്യിലൊതുങ്ങട്ടെ", copy: "സെയ്‌ടൂൺ ആപ്പിൽ കളിയും പാട്ടും പഠനവും.", action: "ആപ്പ് കാണാം", pose: "point", anchor: "right" },
  { selector: ".join-band", title: "നമ്മളോടൊപ്പം ചേരൂ", copy: "നിന്റെ കൂട്ടുകാരെ ഇവിടെ കാത്തിരിക്കുന്നു.", action: "ചേരാം", pose: "wave", anchor: "left" },
];

const KID_WIDE = 134;
const KID_NARROW = 106;

function getActiveIndex() {
  if (typeof window === "undefined") return 0;
  const viewport = window.innerHeight;
  const visible = GUIDE_STOPS.map((stop, index) => {
    const node = document.querySelector(stop.selector);
    if (!node) return null;
    const rect = node.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    const distance = Math.abs(center - viewport * .46);
    const intersects = rect.bottom > viewport * .17 && rect.top < viewport * .78;
    return { index, distance, intersects };
  }).filter(Boolean) as { index: number; distance: number; intersects: boolean }[];
  const inView = visible.filter((item) => item.intersects);
  return (inView.length ? inView : visible).sort((a, b) => a.distance - b.distance)[0]?.index ?? 0;
}

export default function CharacterGuide() {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const [nearFooter, setNearFooter] = useState(false);
  const [x, setX] = useState(20);
  const [walk, setWalk] = useState<"left" | "right" | null>(null);
  const [near, setNear] = useState(false);
  const groupRef = useRef<HTMLElement | null>(null);
  const xRef = useRef(20);
  const reduced = useReducedMotion() === true;
  const stop = GUIDE_STOPS[active];
  const nextSelector = GUIDE_STOPS[active + 1]?.selector;
  const progress = `${active + 1} / ${GUIDE_STOPS.length}`;

  useEffect(() => {
    const update = () => {
      setActive(getActiveIndex());
      setVisible(true);
      // Step out of the way once the footer is about to come into view, so
      // the floating guide never sits on top of it.
      const footer = document.querySelector(".footer");
      const rect = footer?.getBoundingClientRect();
      setNearFooter(!!rect && rect.top < window.innerHeight + 160);
    };
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Horizontal target for each anchor, clamped so the bubble never leaves the
  // viewport. "center" centres the character itself, not the character + card.
  const targetX = useCallback((anchor: Anchor) => {
    const vw = window.innerWidth;
    const width = groupRef.current?.offsetWidth ?? 336;
    const kid = vw < 700 ? KID_NARROW : KID_WIDE;
    const margin = vw < 700 ? 12 : 20;
    const max = Math.max(margin, vw - width - margin);
    const desired = anchor === "left" ? margin : anchor === "center" ? (vw - kid) / 2 - 6 : vw - width - margin;
    return Math.min(Math.max(desired, margin), max);
  }, []);

  // Walk to the new spot whenever the active segment changes.
  useEffect(() => {
    const place = () => {
      const next = targetX(stop.anchor);
      const prev = xRef.current;
      if (next === prev) return;
      xRef.current = next;
      if (!reduced) setWalk(next > prev ? "right" : "left");
      setX(next);
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [stop.anchor, targetX, reduced]);

  useEffect(() => {
    if (!walk) return;
    const timer = setTimeout(() => setWalk(null), 960);
    return () => clearTimeout(timer);
  }, [walk]);

  // Look up and greet when the pointer comes close to the character.
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const node = groupRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const dx = Math.max(rect.left - event.clientX, event.clientX - rect.right, 0);
      const dy = Math.max(rect.top - event.clientY, event.clientY - rect.bottom, 0);
      setNear(Math.hypot(dx, dy) < 130);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const goNext = () => {
    const target = nextSelector ? document.querySelector(nextSelector) : document.querySelector("#join");
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const spritePose = walk ? `run-${walk}` : near ? "wave" : stop.pose;

  return (
    <motion.aside
      ref={groupRef}
      className={`character-guide guide-${stop.pose}${near ? " guide-near" : ""}${nearFooter ? " guide-hidden" : ""}`}
      aria-label="മലർവാടി ഗൈഡ്"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: visible && !nearFooter ? 1 : 0, x }}
      transition={
        reduced
          ? { duration: .2 }
          : { opacity: { duration: .45 }, x: { type: "tween", duration: .95, ease: "easeInOut" } }
      }
      onAnimationComplete={() => setWalk(null)}
    >
      <div className="guide-kids" aria-hidden="true">
        <span className={`guide-glow${near ? " is-near" : ""}`} aria-hidden="true" />
        <motion.span
          className={`guide-boy guide-sprite guide-sprite-${spritePose}`}
          aria-hidden="true"
          initial={{ scale: .72, opacity: 0 }}
          animate={{
            scale: near ? 1.08 : 1,
            opacity: 1,
            y: near ? [0, -8, 0, -20, 0] : [0, -4, 0, -15, 0],
            rotate: [-2, 1, -2, 2, -2],
          }}
          transition={{
            scale: { duration: .3, ease: "backOut" },
            opacity: { duration: .32 },
            y: { duration: near ? 1.6 : 4.4, repeat: Infinity, repeatDelay: near ? .35 : 1.6, ease: "easeInOut", times: [0, .28, .48, .7, 1] },
            rotate: { duration: 4.4, repeat: Infinity, repeatDelay: 1.6, ease: "easeInOut", times: [0, .28, .48, .7, 1] },
          }}
        />
      </div>
      <div className={`guide-card${near ? " is-near" : ""}`}>
        <span className="guide-progress"><Compass size={13} /> {progress}</span>
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: .25 }}>
            <strong>{stop.title}</strong>
            <p>{stop.copy}</p>
          </motion.div>
        </AnimatePresence>
        <button type="button" onClick={goNext} className="guide-next">
          <Sparkles size={13} /> {stop.action} <ArrowRight size={13} />
        </button>
      </div>
      <span className="guide-tail" aria-hidden="true"><ArrowDown size={16} /></span>
    </motion.aside>
  );
}
