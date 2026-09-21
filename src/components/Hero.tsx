import { ArrowDown, ArrowRight, BookOpen, Play, Award, Users, Factory, Leaf } from "lucide-react";
import { HERO_IMG, SITE_CONFIG } from "../data/content";
import { useData } from "../context/DataContext";
import { Reveal } from "./common";
import { FacebookIcon } from "./Navbar";
import logoImg from "../assets/logo.png";

const STATS = [
  { icon: BookOpen, value: "180+", label: "Technical guides" },
  { icon: Factory, value: "9-Step", label: "Mill process maps" },
  { icon: Users, value: "48K+", label: "Community readers" },
  { icon: Leaf, value: "92%", label: "Water saved tech" },
];

const TICKER = [
  "ROPE DYEING", "SLASHER DYEING", "SANFORIZING", "RING SPINNING", "3/1 TWILL", "EPI × PPI",
  "INDIGO CHEMISTRY", "LASER FINISHING", "OZONE WASH", "CIRCULAR DENIM", "4-POINT QC", "ZERO DISCHARGE",
];

export default function Hero() {
  const { siteConfig } = useData();
  return (
    <section id="home" className="denim-texture relative overflow-hidden">
      {/* BG image layer */}
      <div className="absolute inset-0">
        <img src={HERO_IMG} alt="Stacked indigo denim fabrics" className="h-full w-full object-cover opacity-35" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060d22]/70 via-[#0a1633]/75 to-[#060d22]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1633]/80 via-transparent to-[#0a1633]/40" />
      </div>

      {/* Giant watermark */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-16 select-none overflow-hidden">
        <p className="font-display whitespace-nowrap text-center text-[18vw] font-black leading-none text-white/[0.04]">DENIM</p>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-14 sm:px-6 sm:pt-20 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Left copy */}
          <div>
            <Reveal>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-300">
                  <Award size={13} /> Denim Knowledge Hub · Magazine · Academy
                </span>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h1 className="font-display mt-6 text-[2.5rem] font-black leading-[0.96] tracking-tight text-white sm:text-6xl lg:text-[4.6rem]">
                DENIM
                <br />
                <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                  UNIVERSE
                </span>
              </h1>
              <p className="font-display mt-4 text-base font-semibold uppercase tracking-[0.2em] text-indigo-200 sm:text-xl sm:tracking-[0.3em]">
                Explore the World of Denim
              </p>
            </Reveal>

            <Reveal delay={200}>
              <p className="mt-5 max-w-xl text-[14.5px] leading-relaxed text-indigo-100/85 sm:text-base">
                Discover denim fabric processes, solve production problems, explore fashion and learn about
                the future of sustainable denim — practical knowledge for students, professionals & manufacturers.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#process"
                  className="group inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-2xl bg-amber-400 px-7 py-3.5 font-display text-[15px] font-bold text-[#0a1633] shadow-[0_12px_40px_rgba(232,182,76,0.35)] transition active:scale-95 hover:-translate-y-0.5 hover:bg-amber-300 sm:w-auto"
                >
                  <BookOpen size={18} />
                  Explore Knowledge
                  <ArrowRight size={17} className="transition group-hover:translate-x-1" />
                </a>
                <a
                  href={siteConfig.facebookUrl || SITE_CONFIG.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-7 py-3.5 font-display text-[15px] font-bold text-white backdrop-blur transition active:scale-95 hover:-translate-y-0.5 hover:bg-[#1877F2] hover:border-[#1877F2] sm:w-auto"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1877F2] transition group-hover:bg-white">
                    <FacebookIcon size={14} />
                  </span>
                  Follow on Facebook
                </a>
              </div>
            </Reveal>

            <Reveal delay={400}>
              <div className="mt-8 flex flex-wrap items-center gap-3.5 sm:flex-nowrap sm:gap-4">
                <div className="flex -space-x-3 shrink-0">
                  {[
                    "https://images.pexels.com/photos/32641556/pexels-photo-32641556.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
                    "https://images.pexels.com/photos/31212936/pexels-photo-31212936.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
                    "https://images.pexels.com/photos/24287028/pexels-photo-24287028.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
                    "https://images.pexels.com/photos/19224972/pexels-photo-19224972.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
                  ].map((s, i) => (
                    <img key={i} src={s} alt="Denim community member" className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border-2 border-[#0a1633] object-cover" loading="lazy" />
                  ))}
                  <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border-2 border-[#0a1633] bg-amber-400 font-display text-[10.5px] sm:text-[11px] font-black text-[#0a1633]">
                    48K
                  </span>
                </div>
                <p className="text-[12.5px] leading-snug text-indigo-100/75 sm:text-[13px]">
                  <span className="font-bold text-white">Loved by denim students & mill professionals</span>
                  <br />across 40+ countries
                </p>
              </div>
            </Reveal>
          </div>

          {/* Right visual card */}
          <Reveal delay={250} className="hidden lg:block">
            <div className="relative">
              <div className="absolute -top-7 -right-7 z-20 transition-transform duration-300 hover:scale-105 hover:rotate-3">
                <div className="relative flex items-center justify-center">
                  <div className="animate-spin-slow absolute -inset-2 rounded-full border border-dashed border-amber-400/50" />
                  <img
                    src={logoImg}
                    alt="Denim Universe Official Emblem"
                    className="h-24 w-24 rounded-full object-cover shadow-2xl ring-4 ring-[#0a1633] backdrop-blur"
                  />
                </div>
              </div>
              <div className="stitch-border overflow-hidden rounded-[1.8rem] border border-white/15 bg-white/5 shadow-2xl backdrop-blur">
                <div className="relative h-[420px]">
                  <img
                    src="https://images.pexels.com/photos/4109759/pexels-photo-4109759.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                    alt="Folded premium denim jeans"
                    className="h-full w-full object-cover"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060d22] via-transparent to-transparent" />
                  {/* floating chips */}
                  <div className="animate-floaty absolute left-4 top-4 rounded-2xl border border-white/20 bg-[#060d22]/80 px-4 py-3 backdrop-blur">
                    <p className="font-mono2 text-[10px] uppercase tracking-[0.2em] text-amber-300">Indigo depth</p>
                    <p className="font-display text-lg font-extrabold text-white">12 dips · pH 11.5</p>
                  </div>
                  <div className="animate-floaty absolute right-4 top-1/3 rounded-2xl border border-white/20 bg-white/95 px-4 py-3 shadow-xl" style={{ animationDelay: "1.2s" }}>
                    <p className="font-mono2 text-[10px] uppercase tracking-[0.2em] text-indigo-700">Shade pass</p>
                    <p className="font-display text-lg font-extrabold text-[#0a1633]">ΔE &lt; 0.8 ✓</p>
                  </div>
                  <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/15 bg-[#060d22]/85 p-4 backdrop-blur">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-display text-[15px] font-bold text-white">This week: Rope vs Slasher Dyeing</p>
                        <p className="text-xs text-indigo-200/70">7 min · with cost math & videos</p>
                      </div>
                      <a href="#process" className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-400 text-[#0a1633] transition hover:scale-105">
                        <Play size={18} fill="currentColor" />
                      </a>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/15">
                      <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-amber-400 to-orange-400" />
                    </div>
                  </div>
                </div>
              </div>
              {/* spec tags */}
              <div className="absolute -left-6 bottom-10 hidden rotate-[-4deg] rounded-xl bg-amber-400 px-4 py-2 font-mono2 text-[11px] font-bold uppercase tracking-widest text-[#0a1633] shadow-xl xl:block">
                3/1 RHT · 12.5 OZ
              </div>
            </div>
          </Reveal>
        </div>

        {/* Stats */}
        <Reveal delay={150}>
          <div className="mt-12 grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="flex items-center gap-2.5 sm:gap-3 rounded-2xl border border-white/12 bg-white/[0.06] p-3.5 sm:px-5 sm:py-4 backdrop-blur transition hover:bg-white/[0.1]">
                <span className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400/15 text-amber-300">
                  <s.icon size={19} />
                </span>
                <span className="min-w-0">
                  <span className="font-display block text-lg sm:text-xl font-extrabold text-white truncate">{s.value}</span>
                  <span className="text-[11px] sm:text-xs font-medium text-indigo-200/70 truncate block">{s.label}</span>
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Ticker */}
      <div className="relative border-t border-white/10 bg-[#060d22]/80 py-3.5 backdrop-blur">
        <div className="flex overflow-hidden">
          <div className="animate-marquee flex shrink-0 items-center gap-8 pr-8">
            {[...TICKER, ...TICKER].map((t, i) => (
              <span key={i} className="flex items-center gap-8 whitespace-nowrap font-mono2 text-[11px] font-bold uppercase tracking-[0.25em] text-indigo-200/60">
                {t} <span className="text-amber-400">◆</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <a href="#process" aria-label="Scroll to process" className="absolute bottom-16 left-1/2 hidden -translate-x-1/2 lg:flex h-12 w-7 items-start justify-center rounded-full border border-white/25 p-1.5">
        <span className="h-2.5 w-1 animate-bounce rounded-full bg-amber-400" />
        <ArrowDown size={0} />
      </a>
    </section>
  );
}
