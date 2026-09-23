import { useState, type FormEvent } from "react";
import {
  ArrowRight, GraduationCap, Factory, Heart, Mail, MessageCircle, MapPin,
  Send, CheckCircle2, BookOpen, FlaskConical, Shirt, Leaf, Calculator,
  FileText, Briefcase, Newspaper, MessagesSquare, Award, Loader2, Check,
} from "lucide-react";
import { Reveal, SectionHeading } from "./common";
import { FacebookIcon } from "./Navbar";
import { useData } from "../context/DataContext";
import logoImg from "../assets/logo.png";
import { isSupabaseConfigured, addRemoteSubscriber, addRemoteMessage } from "../lib/supabase";
import { trackVisit } from "../lib/analyticsTracker";

/* ============ ABOUT ============ */
export function AboutSection() {
  const pillars = [
    { icon: BookOpen, title: "Easy to understand", desc: "Complex mill science translated into plain language with visuals." },
    { icon: FlaskConical, title: "Practical & proven", desc: "Real parameters, real fixes — tested on actual production floors." },
    { icon: Heart, title: "Community first", desc: "Free knowledge for students, workers and manufacturers alike." },
  ];
  return (
    <section id="about" className="denim-texture-light py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <img src="https://images.pexels.com/photos/32641556/pexels-photo-32641556.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" alt="Hands sewing denim" loading="lazy" className="h-64 w-full rounded-3xl object-cover shadow-xl sm:h-80" />
                <img src="https://images.pexels.com/photos/19203176/pexels-photo-19203176.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200" alt="Denim texture" loading="lazy" className="mt-8 h-64 w-full rounded-3xl object-cover shadow-xl sm:h-80" />
              </div>
              <div className="absolute -bottom-6 left-1/2 flex w-[92%] -translate-x-1/2 items-center gap-4 rounded-2xl bg-[#0a1633] p-4 shadow-2xl">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400 text-[#0a1633]">
                  <GraduationCap size={22} />
                </span>
                <p className="text-[13px] leading-snug text-white">
                  <span className="font-display font-bold">Built for learners & makers</span>
                  <br /><span className="text-indigo-200/75">Students · QC officers · Merchandisers · Designers</span>
                </p>
              </div>
            </div>
          </Reveal>
          <div>
            <Reveal>
              <SectionHeading
                align="left"
                eyebrow="About Denim Universe"
                title="Making Denim Knowledge Easy for Everyone"
                desc="Denim Universe was created to make denim knowledge easier to understand — sharing practical information about the denim industry with students, professionals, manufacturers, fashion enthusiasts and anyone who loves denim."
              />
            </Reveal>
            <div className="mt-7 space-y-3">
              {pillars.map((p, i) => (
                <Reveal key={p.title} delay={i * 80}>
                  <div className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                      <p.icon size={19} />
                    </span>
                    <span>
                      <span className="font-display block text-[15px] font-bold text-[#0a1633]">{p.title}</span>
                      <span className="block text-[13.5px] text-slate-500">{p.desc}</span>
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={200}>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#0a1633] px-4 py-2 text-[12.5px] font-bold text-white"><Factory size={14} className="text-amber-400" /> Mill-tested content</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[12.5px] font-bold text-[#0a1633] ring-1 ring-slate-200"><Shirt size={14} className="text-indigo-600" /> Fashion + technical</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-[12.5px] font-bold text-white"><Leaf size={14} /> Sustainability-led</span>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Future roadmap */}
        <Reveal delay={100}>
          <div className="mt-20 rounded-[1.6rem] border border-indigo-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <p className="font-mono2 text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-600">Coming soon · Roadmap</p>
                <h3 className="font-display mt-1 text-xl font-extrabold text-[#0a1633] sm:text-2xl">The universe keeps expanding</h3>
              </div>
              <span className="rounded-full bg-amber-100 px-4 py-1.5 text-[12px] font-bold text-amber-700">6 new tools in build</span>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Calculator, t: "Denim Calculators", d: "GSM, consumption, skew & shrinkage math instantly." },
                { icon: FileText, t: "Technical SOP Manuals", d: "Protected PDF SOPs, shade bands & spec sheets." },
                { icon: Briefcase, t: "Denim Jobs", d: "Mill, QC and design roles worldwide." },
                { icon: Newspaper, t: "Industry News", d: "Cotton prices, trade & mill investments." },
                { icon: MessagesSquare, t: "Q&A Community", d: "Ask mill doctors, get answers fast." },
                { icon: Award, t: "Training Resources", d: "Courses & certificates for denim pros." },
              ].map((f) => (
                <div key={f.t} className="flex gap-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0a1633] text-amber-400"><f.icon size={17} /></span>
                  <span>
                    <span className="font-display block text-[14px] font-bold text-[#0a1633]">{f.t}</span>
                    <span className="block text-[12.5px] text-slate-500">{f.d}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============ FACEBOOK CTA ============ */
export function FacebookSection() {
  const { siteConfig } = useData();
  return (
    <section className="relative overflow-hidden bg-[#1877F2] py-16 sm:py-20">
      <div className="absolute inset-0 opacity-[0.12]">
        <img src="https://images.pexels.com/photos/4109755/pexels-photo-4109755.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" alt="" aria-hidden className="h-full w-full object-cover" loading="lazy" />
      </div>
      <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-[#0a1633]/25 blur-3xl" />
      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 text-center sm:px-6">
        <Reveal>
          <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-[#1877F2] shadow-2xl">
            <FacebookIcon size={30} />
          </span>
          <h2 className="font-display mt-6 text-3xl font-black text-white sm:text-5xl">Follow {siteConfig.brand}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-white/90">
            Follow us for regular denim knowledge, technical information, fashion updates, sustainability topics and industry insights — one useful post at a time.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <a
              href={siteConfig.facebookUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 rounded-2xl bg-white px-8 py-4 font-display text-[15px] font-extrabold text-[#1877F2] shadow-2xl transition hover:-translate-y-0.5 hover:bg-[#0a1633] hover:text-white"
            >
              <FacebookIcon size={19} /> Follow on Facebook <ArrowRight size={17} />
            </a>
            <span className="rounded-full bg-black/20 px-5 py-2.5 text-[13px] font-bold text-white">48,000+ denim minds already follow</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============ OFFICIAL LOGOS ============ */
export function GmailOfficialLogo({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-label="Official Gmail logo">
      <path d="M45 16.2v21.6c0 2.3-1.9 4.2-4.2 4.2H36V22.8L45 16.2z" fill="#4285F4" />
      <path d="M3 16.2v21.6C3 40.1 4.9 42 7.2 42H12V22.8L3 16.2z" fill="#34A853" />
      <path d="M36 10.2L24 19.2 12 10.2V6c0-2.5 2.7-4 4.8-2.6L24 8.2l7.2-4.8c2.1-1.4 4.8.1 4.8 2.6v4.2z" fill="#EA4335" />
      <path d="M36 10.2v12.6l9-6.6V12c0-3.3-3.6-5.3-6.4-3.5L36 10.2z" fill="#FBBC05" />
      <path d="M12 10.2v12.6L3 16.2V12c0-3.3 3.6-5.3 6.4-3.5L12 10.2z" fill="#C5221F" />
    </svg>
  );
}

export function FacebookOfficialLogo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-label="Official Facebook logo">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export function WhatsAppOfficialLogo({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-label="Official WhatsApp logo">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.63C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.44 19.65L5.27 16.61L5.07 16.3C4.24 14.98 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.68 12.04 3.68C14.24 3.68 16.31 4.54 17.87 6.1C19.42 7.66 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15ZM16.56 14.41C16.31 14.29 15.1 13.69 14.88 13.61C14.65 13.53 14.49 13.49 14.32 13.73C14.16 13.98 13.69 14.53 13.55 14.7C13.4 14.86 13.26 14.88 13.01 14.76C12.77 14.64 11.97 14.37 11.03 13.53C10.29 12.87 9.8 12.06 9.65 11.82C9.51 11.57 9.64 11.44 9.76 11.32C9.87 11.21 10.01 11.03 10.13 10.89C10.25 10.74 10.3 10.64 10.38 10.48C10.46 10.31 10.42 10.17 10.36 10.05C10.3 9.93 9.8 8.72 9.6 8.22C9.4 7.74 9.19 7.8 9.03 7.8C8.89 7.79 8.72 7.79 8.55 7.79C8.38 7.79 8.11 7.85 7.89 8.1C7.66 8.34 7.03 8.93 7.03 10.14C7.03 11.35 7.91 12.51 8.04 12.68C8.16 12.84 9.77 15.34 12.24 16.41C12.83 16.66 13.28 16.81 13.64 16.93C14.23 17.12 14.77 17.09 15.2 17.03C15.68 16.96 16.67 16.43 16.88 15.85C17.09 15.27 17.09 14.78 17.03 14.68C16.97 14.57 16.81 14.53 16.56 14.41Z"
      />
    </svg>
  );
}

export function GoogleMapsOfficialLogo({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-label="Official Google Maps logo">
      <path
        d="M24 4C15.16 4 8 11.16 8 20c0 11.88 14.16 23.27 14.76 23.75.36.29.87.45 1.24.45s.88-.16 1.24-.45C25.84 43.27 40 31.88 40 20c0-8.84-7.16-16-16-16z"
        fill="#EA4335"
      />
      <path
        d="M24 4C15.16 4 8 11.16 8 20c0 4.88 2.2 9.53 6.01 12.78L24 20V4z"
        fill="#4285F4"
      />
      <path
        d="M24 20l-9.99 12.78C16.85 35.32 20.31 38.64 24 42.1V20z"
        fill="#FBBC05"
      />
      <path
        d="M24 20v22.1c3.69-3.46 7.15-6.78 9.99-9.32L24 20z"
        fill="#34A853"
      />
      <circle cx="24" cy="20" r="7" fill="#FFFFFF" />
    </svg>
  );
}

export function InstagramOfficialLogo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

export function YouTubeOfficialLogo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export function LinkedInOfficialLogo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

export function TikTokOfficialLogo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.47 6.28 6.28 0 0 0 1.93-4.47V8.58a8.27 8.27 0 0 0 4.84 1.56V6.69z" />
    </svg>
  );
}

/* ============ CONTACT ============ */
export function ContactSection() {
  const { siteConfig } = useData();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", topic: "Technical question", message: "" });
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const raw = localStorage.getItem("du_messages_v1");
      const list = raw ? JSON.parse(raw) : [];
      list.unshift({ ...form, id: `msg-${Date.now()}`, createdAt: new Date().toISOString() });
      localStorage.setItem("du_messages_v1", JSON.stringify(list.slice(0, 50)));

      if (isSupabaseConfigured()) {
        await addRemoteMessage(form);
      }
      trackVisit("#contact", `Contact Message: ${form.name} (${form.topic})`);
    } catch (err) {
      console.warn("Could not save message", err);
    }

    setSent(true);
    setTimeout(() => { setSent(false); setForm({ name: "", email: "", topic: "Technical question", message: "" }); }, 4000);
  };
  return (
    <section id="contact" className="denim-texture relative py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            dark
            eyebrow="Contact"
            title="Talk About Denim With Us"
            desc="Questions, corrections, collaborations or guest articles — we reply within 24–48 hours."
          />
        </Reveal>
        <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            {[
              {
                label: "Email",
                value: siteConfig.email,
                href: `mailto:${siteConfig.email}`,
                sub: "For articles & partnerships",
                logo: <GmailOfficialLogo size={25} />,
                badgeCls: "bg-white shadow-md shadow-black/25 ring-1 ring-black/5",
              },
              {
                label: "Facebook",
                value: "Denim Universe Page",
                href: siteConfig.facebookUrl,
                sub: "Fastest response · daily posts",
                logo: <FacebookOfficialLogo size={24} />,
                badgeCls: "bg-[#1877F2] text-white shadow-md shadow-[#1877F2]/30",
              },
              {
                label: "WhatsApp",
                value: "Chat with the team",
                href: siteConfig.whatsapp,
                sub: "Mon–Sat · 9am–8pm GMT+6",
                logo: <WhatsAppOfficialLogo size={25} />,
                badgeCls: "bg-[#25D366] text-white shadow-md shadow-[#25D366]/30",
              },
              {
                label: "Base",
                value: siteConfig.location,
                href: "#contact",
                sub: "Remote-first, mill-connected",
                logo: <GoogleMapsOfficialLogo size={25} />,
                badgeCls: "bg-white shadow-md shadow-black/25 ring-1 ring-black/5",
              },
            ].map((c, i) => (
              <Reveal key={c.label} delay={i * 70}>
                <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="group flex items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur transition hover:border-amber-400/50 hover:bg-white/[0.1]">
                  <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition group-hover:scale-110 ${c.badgeCls}`}>
                    {c.logo}
                  </span>
                  <span className="flex-1">
                    <span className="block font-mono2 text-[10.5px] font-bold uppercase tracking-[0.2em] text-amber-300">{c.label}</span>
                    <span className="font-display block text-[16px] font-bold text-white">{c.value}</span>
                    <span className="block text-xs text-indigo-200/60">{c.sub}</span>
                  </span>
                  <ArrowRight size={17} className="text-white/30 transition group-hover:translate-x-1 group-hover:text-amber-400" />
                </a>
              </Reveal>
            ))}
            <Reveal delay={200}>
              <div className="flex items-center gap-3 rounded-3xl bg-white/[0.04] p-5">
                {[
                  { name: "Facebook", icon: <FacebookOfficialLogo size={18} />, hoverCls: "hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]" },
                  { name: "Instagram", icon: <InstagramOfficialLogo size={18} />, hoverCls: "hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:text-white hover:border-transparent" },
                  { name: "YouTube", icon: <YouTubeOfficialLogo size={18} />, hoverCls: "hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000]" },
                  { name: "LinkedIn", icon: <LinkedInOfficialLogo size={18} />, hoverCls: "hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]" },
                  { name: "TikTok", icon: <TikTokOfficialLogo size={18} />, hoverCls: "hover:bg-black hover:text-white hover:border-black" },
                ].map((s) => (
                  <a key={s.name} href={siteConfig.facebookUrl} target="_blank" rel="noreferrer" aria-label={s.name} className={`flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white transition ${s.hoverCls}`}>
                    {s.icon}
                  </a>
                ))}
                <p className="ml-1 text-xs leading-snug text-indigo-200/60">@denimuniverse<br />everywhere</p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={120}>
            <form onSubmit={submit} className="rounded-[1.6rem] bg-white p-5 sm:p-8 shadow-2xl">
              <h3 className="font-display text-xl font-extrabold text-[#0a1633]">Send a message</h3>
              <p className="mt-1 text-[13px] text-slate-500">Ask about fabric, defects, courses or features.</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-[12.5px] font-bold text-slate-600">Your name</span>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Arif Rahman" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base sm:text-sm font-medium text-[#0a1633] placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100" />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[12.5px] font-bold text-slate-600">Email</span>
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@mill.com" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base sm:text-sm font-medium text-[#0a1633] placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100" />
                </label>
              </div>
              <label className="mt-4 block">
                <span className="mb-1.5 block text-[12.5px] font-bold text-slate-600">Topic</span>
                <select value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base sm:text-sm font-medium text-[#0a1633] focus:border-indigo-500 focus:bg-white">
                  {["Technical question", "Troubleshooting help", "Guest article", "Partnership", "Course / training", "Other"].map((t) => <option key={t}>{t}</option>)}
                </select>
              </label>
              <label className="mt-4 block">
                <span className="mb-1.5 block text-[12.5px] font-bold text-slate-600">Message</span>
                <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="My 12oz twill shows 5% skew after enzyme wash. How do I correct it on the stenter?" className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base sm:text-sm font-medium text-[#0a1633] placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100" />
              </label>
              <button type="submit" className="mt-5 inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-2xl bg-[#0a1633] py-3.5 font-display text-[15px] font-bold text-white transition active:scale-95 hover:bg-indigo-700">
                {sent ? (<><CheckCircle2 size={18} className="text-emerald-400" /> Message sent — we'll reply soon!</>) : (<><Send size={17} /> Send message</>)}
              </button>
              <p className="mt-3 text-center text-[11.5px] text-slate-400">By sending, you agree to be contacted about denim topics. No spam, ever.</p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ============ FOOTER ============ */
export function Footer() {
  const { siteConfig, setIsLoginModalOpen, setIsAdminOpen, isAuthenticated } = useData();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = newsletterEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) return;

    setSubmitting(true);
    try {
      // 1. Save to local storage
      const raw = localStorage.getItem("du_subscribers_v1");
      const list: string[] = raw ? JSON.parse(raw) : [];
      if (!list.includes(cleanEmail)) {
        list.push(cleanEmail);
        localStorage.setItem("du_subscribers_v1", JSON.stringify(list));
      }

      // 2. Save to Supabase if configured
      if (isSupabaseConfigured()) {
        await addRemoteSubscriber(cleanEmail);
      }

      // 3. Track event in visitor analytics
      trackVisit("#newsletter", `Subscribed: ${cleanEmail}`);

      // 4. Trigger automated welcome email via Vercel Serverless Function & Resend
      try {
        await fetch("/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: cleanEmail }),
        });
      } catch (apiErr) {
        console.warn("Welcome email API trigger notice:", apiErr);
      }

      setSubscribed(true);
      setNewsletterEmail("");
    } catch (err) {
      console.warn("Subscription error", err);
      setSubscribed(true);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <footer className="bg-[#060d22] pb-8 pt-14 text-indigo-100/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <img src={logoImg} alt="Denim Universe Official Logo" className="h-11 w-11 rounded-full object-cover shadow-lg ring-2 ring-white/20" />
              <span className="font-display text-lg font-extrabold text-white">{siteConfig.brand.toUpperCase()}</span>
            </div>
            <p className="mt-4 max-w-sm text-[13.5px] leading-relaxed">
              Denim knowledge hub — fabric processes, troubleshooting, fashion, sustainability and technology. Practical, free, and made for the people who make jeans.
            </p>
            <div className="stitch-line mt-5 max-w-[220px] opacity-70" />
            <p className="font-mono2 mt-3 text-[11px] uppercase tracking-[0.25em] text-indigo-300/60">{siteConfig.tagline}</p>
          </div>
          <nav aria-label="Learn">
            <p className="font-display text-sm font-bold uppercase tracking-widest text-white">Learn</p>
            <ul className="mt-4 space-y-2 text-[13.5px]">
              {[["Resources", "#resources"], ["Troubleshooting", "#troubleshooting"]].map(([l, h]) => (
                <li key={l}><a href={h} className="inline-block py-1 transition hover:text-amber-300 active:text-amber-400">{l}</a></li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Explore">
            <p className="font-display text-sm font-bold uppercase tracking-widest text-white">Explore</p>
            <ul className="mt-4 space-y-2 text-[13.5px]">
              {[["Fashion", "#fashion"], ["Sustainability", "#sustainability"], ["Contact", "#contact"]].map(([l, h]) => (
                <li key={l}><a href={h} className="inline-block py-1 transition hover:text-amber-300 active:text-amber-400">{l}</a></li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-widest text-white">Stay in the loop</p>
            <p className="mt-4 text-[13px]">One denim lesson per week. Join 12,000+ subscribers.</p>
            {subscribed ? (
              <div className="mt-4 flex items-center gap-2.5 rounded-2xl border border-emerald-400/40 bg-emerald-500/20 p-3.5 text-xs text-emerald-300">
                <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />
                <span className="font-medium leading-relaxed">You're subscribed! Welcome to Denim Universe.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="mt-4 flex overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-1.5 focus-within:border-amber-400 transition">
                <input
                  required
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="you@mill.com"
                  aria-label="Email for newsletter"
                  disabled={submitting}
                  className="w-full bg-transparent px-3 text-sm text-white placeholder:text-indigo-200/40 focus:outline-none disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  aria-label="Subscribe"
                  className="flex h-10 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-[#0a1633] transition active:scale-95 hover:bg-amber-300 disabled:opacity-60"
                >
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
              </form>
            )}
            <a href={siteConfig.facebookUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#1877F2] px-4 py-2.5 text-[13px] font-bold text-white transition active:scale-95 hover:bg-[#0f66d6]">
              <FacebookIcon size={15} /> Follow 48K+
            </a>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 pb-safe text-[12px] sm:flex-row">
          <p className="text-center sm:text-left">© 2026 {siteConfig.brand}. All rights reserved. Made with indigo & care.</p>
          <p className="flex flex-wrap items-center justify-center gap-4">
            <a href="#home" className="hover:text-amber-300 py-1">Privacy</a>
            <a href="#home" className="hover:text-amber-300 py-1">Terms</a>
            <button
              onClick={() => {
                setIsAdminOpen(false);
                setIsLoginModalOpen(true);
              }}
              className="text-indigo-300/60 hover:text-amber-300 transition underline underline-offset-2 py-1"
            >
              Admin Portal
            </button>
            <span className="font-mono2 text-[11px] text-indigo-300/50">COTTON → INDIGO → ICON</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
