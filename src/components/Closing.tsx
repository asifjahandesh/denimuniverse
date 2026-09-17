import { useState, type FormEvent } from "react";
import {
  ArrowRight, GraduationCap, Factory, Heart, Mail, MessageCircle, MapPin,
  Send, CheckCircle2, BookOpen, FlaskConical, Shirt, Leaf, Calculator,
  Download, Briefcase, Newspaper, MessagesSquare, Award,
} from "lucide-react";
import { SITE_CONFIG } from "../data/content";
import { Reveal, SectionHeading } from "./common";
import { FacebookIcon } from "./Navbar";
import logoImg from "../assets/logo.png";

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
                { icon: Download, t: "Technical Downloads", d: "PDF SOPs, shade bands & spec sheets." },
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
          <h2 className="font-display mt-6 text-3xl font-black text-white sm:text-5xl">Follow Denim Universe</h2>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-white/90">
            Follow us for regular denim knowledge, technical information, fashion updates, sustainability topics and industry insights — one useful post at a time.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <a
              href={SITE_CONFIG.facebookUrl}
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

/* ============ CONTACT ============ */
export function ContactSection() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", topic: "Technical question", message: "" });
  const submit = (e: FormEvent) => {
    e.preventDefault();
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
            title="Talk Denim With Us"
            desc="Questions, corrections, collaborations or guest articles — we reply within 24–48 hours."
          />
        </Reveal>
        <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            {[
              { icon: Mail, label: "Email", value: SITE_CONFIG.email, href: `mailto:${SITE_CONFIG.email}`, sub: "For articles & partnerships" },
              { icon: FacebookIcon as unknown as typeof Mail, label: "Facebook", value: "Denim Universe Page", href: SITE_CONFIG.facebookUrl, sub: "Fastest response · daily posts" },
              { icon: MessageCircle, label: "WhatsApp", value: "Chat with the team", href: SITE_CONFIG.whatsapp, sub: "Mon–Sat · 9am–8pm GMT+6" },
              { icon: MapPin, label: "Base", value: SITE_CONFIG.location, href: "#contact", sub: "Remote-first, mill-connected" },
            ].map((c, i) => (
              <Reveal key={c.label} delay={i * 70}>
                <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="group flex items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur transition hover:border-amber-400/50 hover:bg-white/[0.1]">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400 text-[#0a1633] transition group-hover:scale-110">
                    <c.icon size={20} />
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
                {["FB", "IG", "YT", "IN", "TT"].map((s) => (
                  <a key={s} href={SITE_CONFIG.facebookUrl} target="_blank" rel="noreferrer" aria-label={s} className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 font-display text-[11px] font-black text-white transition hover:bg-amber-400 hover:text-[#0a1633]">
                    {s}
                  </a>
                ))}
                <p className="ml-1 text-xs leading-snug text-indigo-200/60">@denimuniverse<br />everywhere</p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={120}>
            <form onSubmit={submit} className="rounded-[1.6rem] bg-white p-6 shadow-2xl sm:p-8">
              <h3 className="font-display text-xl font-extrabold text-[#0a1633]">Send a message</h3>
              <p className="mt-1 text-[13px] text-slate-500">Ask about fabric, defects, courses or features.</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-[12.5px] font-bold text-slate-600">Your name</span>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Arif Rahman" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-[#0a1633] placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100" />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[12.5px] font-bold text-slate-600">Email</span>
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@mill.com" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-[#0a1633] placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100" />
                </label>
              </div>
              <label className="mt-4 block">
                <span className="mb-1.5 block text-[12.5px] font-bold text-slate-600">Topic</span>
                <select value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-[#0a1633] focus:border-indigo-500 focus:bg-white">
                  {["Technical question", "Troubleshooting help", "Guest article", "Partnership", "Course / training", "Other"].map((t) => <option key={t}>{t}</option>)}
                </select>
              </label>
              <label className="mt-4 block">
                <span className="mb-1.5 block text-[12.5px] font-bold text-slate-600">Message</span>
                <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="My 12oz twill shows 5% skew after enzyme wash. How do I correct it on the stenter?" className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-[#0a1633] placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100" />
              </label>
              <button type="submit" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0a1633] py-4 font-display text-[15px] font-bold text-white transition hover:bg-indigo-700">
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
  return (
    <footer className="bg-[#060d22] pb-8 pt-14 text-indigo-100/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <img src={logoImg} alt="Denim Universe Official Logo" className="h-11 w-11 rounded-full object-cover shadow-lg ring-2 ring-white/20" />
              <span className="font-display text-lg font-extrabold text-white">DENIM <span className="text-amber-400">UNIVERSE</span></span>
            </div>
            <p className="mt-4 max-w-sm text-[13.5px] leading-relaxed">
              The denim knowledge hub — fabric processes, troubleshooting, fashion, sustainability and technology. Practical, free, and made for the people who make jeans.
            </p>
            <div className="stitch-line mt-5 max-w-[220px] opacity-70" />
            <p className="font-mono2 mt-3 text-[11px] uppercase tracking-[0.25em] text-indigo-300/60">Explore the world of denim</p>
          </div>
          <nav aria-label="Learn">
            <p className="font-display text-sm font-bold uppercase tracking-widest text-white">Learn</p>
            <ul className="mt-4 space-y-2.5 text-[13.5px]">
              {[["Fabric Process", "#process"], ["Troubleshooting", "#troubleshooting"], ["Denim Insights", "#insights"], ["Dictionary", "#dictionary"], ["Gallery", "#gallery"]].map(([l, h]) => (
                <li key={l}><a href={h} className="transition hover:text-amber-300">{l}</a></li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Explore">
            <p className="font-display text-sm font-bold uppercase tracking-widest text-white">Explore</p>
            <ul className="mt-4 space-y-2.5 text-[13.5px]">
              {[["Fashion", "#fashion"], ["Sustainability", "#sustainability"], ["Categories", "#categories"], ["About", "#about"], ["Contact", "#contact"]].map(([l, h]) => (
                <li key={l}><a href={h} className="transition hover:text-amber-300">{l}</a></li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-widest text-white">Stay in the loop</p>
            <p className="mt-4 text-[13px]">One denim lesson per week. Join 12,000+ subscribers.</p>
            <form onSubmit={(e) => e.preventDefault()} className="mt-4 flex overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-1.5">
              <input required type="email" placeholder="you@mill.com" aria-label="Email for newsletter" className="w-full bg-transparent px-3 text-sm text-white placeholder:text-indigo-200/40" />
              <button aria-label="Subscribe" className="flex h-10 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-[#0a1633] transition hover:bg-amber-300">
                <Send size={16} />
              </button>
            </form>
            <a href={SITE_CONFIG.facebookUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#1877F2] px-4 py-2.5 text-[13px] font-bold text-white transition hover:bg-[#0f66d6]">
              <FacebookIcon size={15} /> Follow 48K+
            </a>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-[12px] sm:flex-row">
          <p>© 2026 Denim Universe. All rights reserved. Made with indigo & care.</p>
          <p className="flex items-center gap-4">
            <a href="#home" className="hover:text-amber-300">Privacy</a>
            <a href="#home" className="hover:text-amber-300">Terms</a>
            <span className="font-mono2 text-[11px] text-indigo-300/50">COTTON → INDIGO → ICON</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
