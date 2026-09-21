"use client";
import { motion } from "framer-motion";
import { Search, Facebook, Instagram, Youtube, MapPin, Phone, Mail, Clock, ArrowRight, Home, Images, CalendarHeart, UsersRound, Sparkles, Baby, UserRound, Leaf, MessageCircle, Heart, Rainbow, GraduationCap, PartyPopper, Sprout } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSite, useJoinModal, telHref } from "@/components/site-context";

const MENU = [
  { href: "/", label: "Home", icon: Home },
  { href: "/about", label: "About Us", icon: UsersRound },
  { href: "/programs", label: "Programs", icon: CalendarHeart },
  { href: "/gallery", label: "Gallery", icon: Images },
  { href: "/contact", label: "Contact Us", icon: Phone },
];

export function MobileFooterMenu() {
  const path = usePathname();
  return (
    <nav className="mobile-dock" aria-label="Footer menu">
      {MENU.map(({ href, label, icon: Icon }) => (
        <a key={href} href={href} className={path === href ? "active" : ""} aria-current={path === href ? "page" : undefined}>
          <Icon size={19} strokeWidth={2.2} />
          <span>{label}</span>
        </a>
      ))}
    </nav>
  );
}

/** `overlay` lifts the nav out of the flow so a full-bleed hero can sit under it. */
export function Header({ overlay = false }: { overlay?: boolean }) {
  const path = usePathname();
  const link = (href: string, label: string, cls = "") => (
    <a key={href} href={href} className={`${path === href ? "active" : cls}`}>{label}</a>
  );
  return (
    <header className={overlay ? "header header-overlay" : "header"}>
      <div className="wrap">
        <motion.div initial={{ y: -22, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 180, damping: 20 }} className="nav-shell">
          <a href="/" className="logo" aria-label="Malarvadi home">
            <img className="logo-img" src="/logo-new.png" alt="മലർവാടി — ബാലസംഘം" width={557} height={154} />
          </a>
          <nav className="nav-links">
            {link("/", "Home")}
            {link("/about", "About Us", "alt2 hide-m")}
            {link("/programs", "Programs", "alt1 hide-m")}
            {link("/gallery", "Gallery", "alt1")}
            {link("/contact", "Contact Us", "alt3")}
          </nav>
          <div className="socials">
            <a href="/search" className="icon-btn" aria-label="Search"><Search size={14} /></a>
          </div>
        </motion.div>
      </div>
    </header>
  );
}

export function CTABand() {
  const { cta } = useSite();
  const { openJoin } = useJoinModal();
  return (
    <div className="cta-band">
      <div className="cta-confetti" aria-hidden><span/><span/><span/><span/><span/><span/></div>
      <div className="wrap cta-inner">
        <motion.span animate={{ y: [0,-10,0], rotate: [-4,4,-4] }} transition={{ repeat: Infinity, duration: 3.2 }} className="kid"><Baby size={72} strokeWidth={1.8} /></motion.span>
        <div style={{ textAlign: "center", position:"relative", zIndex:2 }}>
          <div className="cta-kicker"><Sparkles size={13}/> {cta.kicker} <Sparkles size={13}/></div>
          <b className="cta-title">{cta.title}</b><br />
          <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: .96 }} type="button" onClick={openJoin} className="btn btn-pink" style={{ marginTop: 10 }}>{cta.button} <ArrowRight size={15} /></motion.button>
        </div>
        <motion.span animate={{ y: [0,-10,0], rotate: [4,-4,4] }} transition={{ repeat: Infinity, duration: 3.6, delay: .4 }} className="kid"><UserRound size={72} strokeWidth={1.8} /></motion.span>
      </div>
    </div>
  );
}

export function Footer() {
  const { footer, social, contact } = useSite();
  return (
    <footer id="contact" className="footer">
      <div className="foot-scallop" aria-hidden />
      <Leaf className="leaf" size={30} style={{ left: 18, bottom: 26 }} />
      <Leaf className="leaf" size={30} style={{ right: 20, bottom: 30 }} />
      <div className="wrap foot-grid">
        <div>
          <a href="/" className="logo foot-logo" aria-label="Malarvadi home">
            <img className="logo-img" src="/logo-new.png" alt="മലർവാടി — ബാലസംഘം" width={557} height={154} />
          </a>
          <p>{footer.blurb.split("\n").map((l, i) => <span key={i}>{i > 0 && <br />}{l}</span>)}</p>
          <div className="foot-social">
            <a className="icon-btn fs-fb" href={social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" title="Facebook"><Facebook size={15} /></a>
            <a className="icon-btn fs-ig" href={social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" title="Instagram"><Instagram size={15} /></a>
            <a className="icon-btn fs-yt" href={social.youtube} target="_blank" rel="noreferrer" aria-label="YouTube" title="YouTube"><Youtube size={15} /></a>
            <a className="icon-btn fs-wa" href={social.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp" title="WhatsApp"><MessageCircle size={15} /></a>
          </div>
        </div>
        <div><h4>പ്രധാന ലിങ്കുകൾ</h4><p><a href="/">ഹോം</a><br /><a href="/about">ഞങ്ങളെക്കുറിച്ച്</a><br /><a href="/programs">പരിപാടികൾ</a><br /><a href="/news">വാർത്തകൾ</a><br /><a href="/blog">ബ്ലോഗ്</a><br /><a href="/gallery">ഗാലറി</a><br /><a href="/contact">ബന്ധപ്പെടാം</a></p></div>
        <div><h4>ബന്ധപ്പെടാം</h4><p><MapPin size={12} /> {contact.orgName}, {contact.address}<br /><Phone size={12} /> <a href={telHref(contact.phone)}>{contact.phone}</a><br /><Mail size={12} /> <a href={`mailto:${contact.email}`}>{contact.email}</a><br /><Clock size={12} /> {contact.hours}</p></div>
      </div>
      <div className="wrap foot-bottom">
        <span>{footer.copyright}</span><span>Made with <Heart size={12} fill="currentColor" /> for kids</span>
      </div>
      <MobileFooterMenu />
    </footer>
  );
}

export function PageHero({ kicker, title, sub, icon }: { kicker: string; title: string; sub: string; icon: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 22, scale: .985 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .6 }} className="page-hero">
      <div className="ph-deco" aria-hidden><i className="d1"/><i className="d2"/><i className="d3"/></div>
      <motion.span animate={{ y: [0, -10, 0], rotate: [-6, 6, -6] }} transition={{ repeat: Infinity, duration: 4 }} className="ph-emoji">{icon}</motion.span>
      <div><div className="kicker">{kicker}</div><h4>{title}</h4><p>{sub}</p></div>
    </motion.div>
  );
}

export function Ticker() {
  const { ticker } = useSite();
  const icons = [Rainbow, GraduationCap, PartyPopper, Sprout];
  const items = ticker.map((t, i) => { const I = icons[i % icons.length]; return <><I size={14} /> {t}</>; });
  if (!items.length) return null;
  return (
    <div className="ticker" aria-hidden>
      <div className="ticker-track">{[...items, ...items].map((t,i)=>(<span key={i}>{t} &nbsp;•&nbsp; </span>))}</div>
    </div>
  );
}
