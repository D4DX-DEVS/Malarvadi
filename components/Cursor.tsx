"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Volume2, VolumeX } from "lucide-react";

/**
 * The playful pink pointer: a rounded arrow that becomes a pointing hand over
 * anything clickable, a ring that trails a step behind, and a soft blip while
 * the pointer travels.
 *
 * Everything moves through direct transform writes inside one rAF loop - React
 * state on every mousemove would re-render the tree dozens of times a second.
 *
 * The pointer itself is skipped on touch screens (nothing to replace), but the
 * sound is not: on a phone the notes still play while the page scrolls, so the
 * mute button is there too. Both are off when the visitor asks for reduced
 * motion, and in the admin, which stays a plain working tool.
 */

const SOUND_KEY = "malarvadi.cursor.sound";
const CLICKABLE = 'a,button,summary,label,select,input,textarea,[role="button"],[onclick],.card-link,.blob-card';
// Header navigation and buttons get a burst of confetti on top of the ding.
const SPARKLY = '.nav-links a,.nav-drop-menu a,button,.btn,[role="button"]';
const SPARK_COLORS = ["#ff5fa2", "#ffd979", "#16b3d6", "#93b83c", "#ef3f3f", "#79d3e7"];

export default function Cursor() {
  const path = usePathname();
  const [on, setOn] = useState(false);          // the drawn pointer
  const [audible, setAudible] = useState(false); // the notes, touch screens included
  const [sound, setSound] = useState(true);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  // Read inside the listeners without re-running the effect on every toggle.
  const soundRef = useRef(sound);
  useEffect(() => { soundRef.current = sound; }, [sound]);
  // Filled in by the audio effect; the pointer effect only borrows it.
  const audio = useRef<{ note: (freq: number, gain: number, ms: number, delay?: number) => void; next: () => number } | null>(null);

  // Decide once per mount whether this visitor gets the custom pointer.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const allowed = !calm && !path.startsWith("/admin");
    setOn(fine && allowed);
    setAudible(allowed);
    try {
      const saved = localStorage.getItem(SOUND_KEY);
      if (saved != null) setSound(saved === "1");
    } catch { /* private mode - keep the default */ }
  }, [path]);

  // --- sound -----------------------------------------------------------------
  // Runs on every device the visitor allows it on, pointer or not, so that the
  // scroll notes work on a phone as well.
  useEffect(() => {
    if (!audible) return;
    // The context is opened as soon as the page loads and resumed again on the
    // first sign of life. Browsers do not all allow audio before the visitor
    // has touched the page, so this asks early and keeps asking.
    let ctx: AudioContext | null = null;
    let greeted = false;
    const soundOn = () => soundRef.current;
    const ensureCtx = () => {
      if (!soundOn()) return null;
      if (!ctx) {
        const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
        ctx.addEventListener("statechange", () => { if (ctx?.state === "running") greet(); });
      }
      if (ctx.state === "suspended") void ctx.resume().catch(() => { /* needs a gesture yet */ });
      if (ctx.state === "running") greet();
      return ctx;
    };
    /**
     * One music-box note. Two detuned sines through a gentle low-pass give the
     * soft wooden "ting" of a kalimba rather than the bleep of a raw oscillator,
     * and every note comes from a pentatonic scale, so any two that overlap while
     * the pointer moves still sound sweet together.
     */
    const note = (freq: number, gain: number, ms: number, delay = 0) => {
      const c = ensureCtx();
      if (!c || c.state !== "running") return;
      const t0 = c.currentTime + delay;
      const end = t0 + ms / 1000;
      const vol = c.createGain();
      const tone = c.createBiquadFilter();
      tone.type = "lowpass";
      tone.frequency.setValueAtTime(freq * 3.2, t0);
      vol.gain.setValueAtTime(0.0001, t0);
      vol.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
      vol.gain.exponentialRampToValueAtTime(0.0001, end);
      for (const [mul, level, detune] of [[1, 1, 0], [2.02, 0.33, 6]] as const) {
        const osc = c.createOscillator();
        const mix = c.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq * mul, t0);
        osc.detune.setValueAtTime(detune, t0);
        mix.gain.setValueAtTime(level, t0);
        osc.connect(mix).connect(tone);
        osc.start(t0);
        osc.stop(end + 0.03);
      }
      tone.connect(vol).connect(c.destination);
    };
    // C5 D5 E5 G5 A5 C6 D6 - a major pentatonic, the "toy piano" scale.
    const SCALE = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66];
    let step = 0;
    /** Walk the scale rather than jumping about: consecutive notes make a tune. */
    const nextNote = () => {
      step = (step + (Math.random() < 0.5 ? 1 : 2)) % SCALE.length;
      return SCALE[step]!;
    };

    audio.current = { note, next: nextNote };

    /** Two soft notes the moment sound becomes available - the site saying hello. */
    function greet() {
      if (greeted) return;
      greeted = true;
      note(783.99, 0.022, 260);
      note(1046.5, 0.018, 300, 0.09);
    }

    /**
     * Try immediately, then on anything the visitor does. Moving the mouse is
     * enough in browsers that allow it, which is what makes the notes start on
     * their own; the tap/click/key events are the fallback for Chrome and
     * Safari, which hold audio back until a real gesture.
     */
    let lastTry = 0;
    const unlock = () => {
      if (ctx?.state === "running") { stopTrying(); return; }
      // Pointer moves fire constantly; one attempt every 400ms is plenty.
      const now = performance.now();
      if (now - lastTry < 400) return;
      lastTry = now;
      ensureCtx();
    };
    const UNLOCK_EVENTS = ["pointermove", "mousemove", "pointerdown", "touchstart", "keydown", "wheel", "scroll", "click"] as const;
    const stopTrying = () => { for (const ev of UNLOCK_EVENTS) window.removeEventListener(ev, unlock); };
    for (const ev of UNLOCK_EVENTS) window.addEventListener(ev, unlock, { passive: true });
    ensureCtx();

    // A note every ~260px of scrolling, at most ~4 a second: present while the
    // page moves, never a stream of beeps.
    let lastY = window.scrollY, scrolled = 0, lastScrollBlip = 0;
    const onScroll = () => {
      const y2 = window.scrollY;
      scrolled += Math.abs(y2 - lastY);
      lastY = y2;
      const now = performance.now();
      if (scrolled > 260 && now - lastScrollBlip > 240) {
        scrolled = 0; lastScrollBlip = now;
        note(nextNote(), 0.026, 260);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      stopTrying();
      window.removeEventListener("scroll", onScroll);
      audio.current = null;
      void ctx?.close();
    };
  }, [audible]);

  // --- pointer -----------------------------------------------------------------
  useEffect(() => {
    if (!on) return;
    const root = document.documentElement;
    root.classList.add("cursor-on");

    let x = window.innerWidth / 2, y = window.innerHeight / 2;   // where the mouse is
    let rx = x, ry = y;                                          // where the ring has got to
    let hot = false, down = false, raf = 0;
    let travelled = 0, lastBlip = 0;
    const note = (freq: number, gain: number, ms: number, delay?: number) => audio.current?.note(freq, gain, ms, delay);
    const nextNote = () => audio.current?.next() ?? 523.25;

    // --- confetti ------------------------------------------------------------
    // One fixed layer holds every particle; each is a <i> that removes itself
    // when its animation ends, so nothing accumulates in the DOM.
    const layer = document.createElement("div");
    layer.className = "cur-parts";
    layer.setAttribute("aria-hidden", "true");
    document.body.appendChild(layer);

    const burst = (px: number, py: number) => {
      for (let i = 0; i < 11; i++) {
        const bit = document.createElement("i");
        // Fan the pieces out in a full circle, at a spread of distances.
        const angle = (Math.PI * 2 * i) / 11 + Math.random() * 0.5;
        const dist = 26 + Math.random() * 34;
        bit.style.left = `${px}px`;
        bit.style.top = `${py}px`;
        bit.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
        bit.style.setProperty("--dy", `${Math.sin(angle) * dist - 10}px`);
        bit.style.setProperty("--s", `${4 + Math.random() * 4}px`);
        bit.style.setProperty("--d", `${520 + Math.random() * 260}ms`);
        bit.style.setProperty("--c", SPARK_COLORS[i % SPARK_COLORS.length]!);
        bit.addEventListener("animationend", () => bit.remove(), { once: true });
        layer.appendChild(bit);
      }
    };
    /** Three rising notes - the confetti's own little flourish. */
    const sparkleNotes = () => {
      const base = nextNote();
      note(base, 0.03, 180);
      note(base * 1.5, 0.024, 200, 0.06);
      note(base * 2, 0.018, 240, 0.12);
    };
    // The element the pointer is over, so moving across a label inside a button
    // does not fire a second burst.
    let sparked: Element | null = null;

    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - x, dy = e.clientY - y;
      x = e.clientX; y = e.clientY;
      travelled += Math.hypot(dx, dy);
      const now = performance.now();
      // A note every ~150px of travel, and never more than ~6 a second.
      if (travelled > 150 && now - lastBlip > 160) {
        travelled = 0; lastBlip = now;
        note(nextNote(), 0.03, 240);
      }
    };
    const onOver = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const next = !!target?.closest?.(CLICKABLE);
      const spark = target?.closest?.(SPARKLY) ?? null;
      const fresh = !!spark && spark !== sparked;
      sparked = spark;
      if (next !== hot) {
        hot = next;
        dot.current?.classList.toggle("hot", hot);
        ring.current?.classList.toggle("hot", hot);
        // Two quick notes a fifth apart: a little "ding-ding" of welcome -
        // unless the confetti below is about to play its own flourish.
        if (hot && !fresh) { note(1046.5, 0.032, 200); note(1567.98, 0.022, 220, 0.07); }
      }
      if (fresh) { burst(e.clientX, e.clientY); sparkleNotes(); }
    };
    const onDown = () => { down = true; dot.current?.classList.add("down"); note(659.25, 0.05, 150); note(1318.5, 0.028, 180, 0.04); };
    const onUp = () => { down = false; dot.current?.classList.remove("down"); };
    const onLeave = () => { dot.current?.classList.add("gone"); ring.current?.classList.add("gone"); };
    const onEnter = () => { dot.current?.classList.remove("gone"); ring.current?.classList.remove("gone"); };

    const tick = () => {
      // The ring eases toward the pointer, which is what gives it its tail.
      rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px,${y}px,0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px,${ry}px,0) scale(${down ? 0.7 : hot ? 1.5 : 1})`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      root.classList.remove("cursor-on");
      layer.remove();
    };
  }, [on]);

  if (!on && !audible) return null;
  return (
    <>
      {on && <>
      <div ref={ring} className="cur-ring" aria-hidden="true" />
      <div ref={dot} className="cur-dot" aria-hidden="true">
        <svg className="cur-arrow" viewBox="0 0 26 30" fill="none">
          <path d="M3.2 2.4 21.6 16.1c1.1.8.6 2.6-.8 2.7l-6.7.5c-.6 0-1.1.4-1.3 1l-2.3 6.3c-.5 1.3-2.4 1.2-2.7-.2L3.2 4.1a1 1 0 0 1 0-1.7Z"
            fill="url(#curFill)" stroke="#c9246c" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M6.4 6.2 16 13.4" stroke="#ff9dc6" strokeWidth="2.4" strokeLinecap="round" />
          <defs>
            <linearGradient id="curFill" x1="3" y1="2" x2="20" y2="26" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ff5fa2" /><stop offset="1" stopColor="#ef2f83" />
            </linearGradient>
          </defs>
        </svg>
        <svg className="cur-hand" viewBox="0 0 34 38" fill="none">
          <g stroke="#c9246c" strokeWidth="1.8" strokeLinejoin="round">
            <rect x="11.2" y="2.6" width="6" height="19" rx="3" fill="#ff5fa2" />
            <rect x="16.6" y="11" width="5.8" height="11" rx="2.9" fill="#f9489a" />
            <rect x="21.4" y="12.6" width="5.6" height="9.4" rx="2.8" fill="#f9489a" />
            <rect x="25.8" y="14.4" width="5.4" height="8" rx="2.7" fill="#f9489a" />
            <path d="M10.6 16.5v6.2l-3.9 2.2c-1.6.9-2 3-.8 4.4l3.4 4.1a8 8 0 0 0 6.1 2.9h8.3a7 7 0 0 0 7-7v-6.2H10.6Z" fill="#ff5fa2" />
          </g>
          <path d="M13.4 5.4v13.2" stroke="#ff9dc6" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </div>
      </>}
      <button
        type="button"
        className="cur-sound"
        aria-pressed={sound}
        aria-label={sound ? "കഴ്‌സർ ശബ്ദം ഓഫാക്കുക" : "കഴ്‌സർ ശബ്ദം ഓണാക്കുക"}
        title={sound ? "Cursor sound on" : "Cursor sound off"}
        onClick={() => {
          setSound((v) => {
            const next = !v;
            try { localStorage.setItem(SOUND_KEY, next ? "1" : "0"); } catch { /* ignore */ }
            return next;
          });
        }}
      >
        {sound ? <Volume2 size={17} /> : <VolumeX size={17} />}
      </button>
    </>
  );
}
