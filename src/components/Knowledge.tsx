import { useMemo, useState } from "react";
import {
  ArrowRight, ArrowUpRight, AlertTriangle, CheckCircle2, Search, FlaskConical,
  Layers, Droplet, Grid3x3, Sparkles, Waves, BadgeCheck, Wrench, Shirt, Leaf,
  Cpu, TrendingUp, BookOpen, FileText,
} from "lucide-react";
import { PROCESS_STEPS, SUST_STATS, SUST_TOPICS, CATEGORIES } from "../data/content";
import { TroubleItem, FashionCard, ResourceItem } from "../types/content";
import { useData } from "../context/DataContext";
import { Reveal, SectionHeading, Modal, Counter } from "./common";
import { getRelatedResourceForTrouble } from "../data/resources";

const iconMap: Record<string, typeof Layers> = {
  layers: Layers, spool: Layers, droplet: Droplet, grid: Grid3x3, sparkles: Sparkles,
  waves: Waves, badge: BadgeCheck, wrench: Wrench, shirt: Shirt, leaf: Leaf,
  cpu: Cpu, trend: TrendingUp, recycle: Leaf, flask: FlaskConical, cloud: Waves,
  zap: Sparkles, shield: BadgeCheck, battery: Cpu, refresh: Wrench,
};

/* ============ FABRIC PROCESS ============ */
export function ProcessSection() {
  const [active, setActive] = useState(3); // indigo dyeing default
  const step = PROCESS_STEPS[active];
  return (
    <section id="process" className="denim-texture-light relative py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Denim Fabric Process"
            title="Cotton to Classic: the 9-Step Denim Journey"
            desc="Tap any stage to see what really happens on the mill floor — machines, parameters and quality checkpoints used by professionals."
          />
        </Reveal>

        {/* Step pills */}
        <Reveal delay={100}>
          <div className="touch-scroll mt-10 flex gap-2 overflow-x-auto pb-3 pr-6 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {PROCESS_STEPS.map((s, i) => (
              <button
                key={s.no}
                onClick={() => setActive(i)}
                className={`flex shrink-0 snap-start items-center gap-2.5 rounded-full border px-4 py-2.5 text-[13px] font-bold transition active:scale-95 ${
                  i === active
                    ? "border-[#0a1633] bg-[#0a1633] text-white shadow-lg"
                    : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-800"
                }`}
              >
                <span className={`font-mono2 text-[11px] ${i === active ? "text-amber-400" : "text-slate-400"}`}>{s.no}</span>
                {s.title}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Detail card */}
        <Reveal delay={150}>
          <div className="mt-4 grid overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(10,22,51,0.10)] lg:grid-cols-2">
            <div className="relative min-h-[260px] sm:min-h-[320px] lg:min-h-[420px]">
              <img key={step.image} src={step.image} alt={step.title} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060d22]/85 via-[#060d22]/10 to-transparent" />
              <span className="font-display absolute left-5 top-5 rounded-xl bg-amber-400 px-3.5 py-1.5 text-sm font-black text-[#0a1633] shadow-lg">
                STEP {step.no}
              </span>
              <div className="absolute bottom-5 left-5 right-5">
                <p className="font-mono2 text-[11px] uppercase tracking-[0.25em] text-amber-300">{step.aka}</p>
                <h3 className="font-display text-2xl font-extrabold text-white sm:text-3xl">{step.title}</h3>
              </div>
            </div>
            <div className="flex flex-col justify-center p-5 sm:p-10">
              <p className="text-[14.5px] leading-relaxed text-slate-600 sm:text-[15px]">{step.desc}</p>
              <ul className="mt-5 space-y-2.5">
                {step.points.map((p) => (
                  <li key={p} className="flex items-center gap-2.5 rounded-xl bg-indigo-50/70 px-3.5 py-2.5 text-[13px] font-semibold text-indigo-950 sm:px-4 sm:text-[13.5px]">
                    <CheckCircle2 size={16} className="shrink-0 text-emerald-600" /> {p}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-1.5 py-1">
                  {PROCESS_STEPS.map((_, i) => (
                    <button
                      key={i}
                      aria-label={`Go to step ${i + 1}`}
                      onClick={() => setActive(i)}
                      className={`h-2.5 rounded-full transition-all ${i === active ? "w-8 bg-amber-500" : "w-2.5 bg-slate-200 hover:bg-indigo-300"}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setActive((active + 1) % PROCESS_STEPS.length)}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#0a1633] px-5 py-2.5 text-[13px] font-bold text-white transition active:scale-95 hover:bg-indigo-700"
                >
                  Next stage <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Mini flow strip */}
        <div className="mt-6 hidden items-center justify-between rounded-2xl border border-dashed border-indigo-200 bg-white/70 px-6 py-4 lg:flex">
          {PROCESS_STEPS.map((s, i) => (
            <div key={s.no} className="flex items-center gap-2">
              <button onClick={() => setActive(i)} className={`font-display text-[12px] font-bold ${i === active ? "text-amber-600" : "text-slate-400 hover:text-indigo-700"}`}>
                {s.title}
              </button>
              {i < PROCESS_STEPS.length - 1 && <ArrowRight size={12} className="text-slate-300" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ TROUBLESHOOTING ============ */
function TroubleCard({
  t,
  onOpen,
  relatedResource,
  onSelectResource,
}: {
  t: TroubleItem;
  onOpen: () => void;
  relatedResource?: ResourceItem;
  onSelectResource?: (resource: ResourceItem) => void;
}) {
  const sevColor = t.severity === "High" ? "bg-rose-100 text-rose-700" : t.severity === "Medium" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700";
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-[0_18px_50px_rgba(10,22,51,0.12)] cursor-pointer"
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-indigo-50 px-3 py-1 font-mono2 text-[10.5px] font-bold uppercase tracking-[0.15em] text-indigo-700">{t.tag}</span>
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${sevColor}`}>{t.severity}</span>
        </div>
        <h3 className="font-display mt-4 text-[17px] font-extrabold text-[#0a1633] group-hover:text-indigo-700">{t.title}</h3>
        <p className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed text-slate-500">{t.problem}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-indigo-700">
          Problem → Cause → Solution <ArrowUpRight size={15} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>

      {relatedResource && (
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 text-slate-500 font-medium truncate">
            <BookOpen size={13} className="text-amber-500 shrink-0" />
            <span className="truncate">{relatedResource.category} SOP</span>
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onSelectResource) {
                onSelectResource(relatedResource);
              } else {
                window.location.hash = `#resources/${encodeURIComponent(relatedResource.id || "")}`;
              }
            }}
            className="inline-flex items-center gap-1 font-bold text-[#0a1633] hover:text-indigo-700 bg-amber-100/80 hover:bg-amber-200/90 px-2.5 py-1 rounded-lg transition shrink-0 shadow-sm"
          >
            <span>Learn more</span>
            <ArrowRight size={12} />
          </button>
        </div>
      )}
    </div>
  );
}

export function TroubleshootingSection({
  onOpenAll,
  onSelectResource,
}: {
  onOpenAll: () => void;
  onSelectResource?: (resource: ResourceItem) => void;
}) {
  const { troubles, resources } = useData();
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<TroubleItem | null>(null);
  const filtered = useMemo(() => troubles.filter((t) => (t.title + t.tag + t.problem).toLowerCase().includes(q.toLowerCase())).slice(0, 6), [troubles, q]);
  return (
    <section id="troubleshooting" className="denim-texture relative py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            dark
            eyebrow="Denim Troubleshooting"
            title="Fix It Like a Mill Doctor"
            desc="Every defect decoded: what you see, why it happened, and the exact fix — from shade variation to washing disasters."
          />
        </Reveal>

        <Reveal delay={100}>
          <div className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-2xl border border-white/15 bg-white/10 p-2 pl-4 backdrop-blur">
            <Search size={18} className="shrink-0 text-indigo-200" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search a defect — e.g. skew, slub, GSM…"
              className="w-full bg-transparent py-2.5 text-sm text-white placeholder:text-indigo-200/50"
              aria-label="Search defects"
            />
            {q && (
              <button onClick={() => setQ("")} className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold text-white">Clear</button>
            )}
          </div>
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t, i) => {
            const rel = getRelatedResourceForTrouble(t, resources);
            return (
              <Reveal key={t.title} delay={i * 70}>
                <TroubleCard
                  t={t}
                  onOpen={() => setSel(t)}
                  relatedResource={rel}
                  onSelectResource={onSelectResource}
                />
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={150}>
          <div className="mt-8 flex flex-col items-center gap-4">
            <button
              onClick={onOpenAll}
              className="group inline-flex min-h-[50px] w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-amber-400 px-8 py-3.5 font-display text-[15px] font-bold text-[#0a1633] shadow-[0_12px_40px_rgba(232,182,76,0.3)] transition active:scale-95 hover:-translate-y-0.5 hover:bg-amber-300"
            >
              <Wrench size={17} /> View All Troubleshooting
              <ArrowRight size={17} className="transition group-hover:translate-x-1" />
            </button>
            <p className="flex items-center gap-2 text-center text-[12.5px] sm:text-[13px] text-indigo-200/70">
              <AlertTriangle size={14} className="text-amber-400 shrink-0" /> {troubles.length} documented cases · Dyeing to washing · Free forever
            </p>
          </div>
        </Reveal>
      </div>

      <Modal open={!!sel} onClose={() => setSel(null)}>
        {sel && (() => {
          const relatedResource = getRelatedResourceForTrouble(sel, resources);
          return (
            <div className="p-6 sm:p-9">
              <span className="rounded-full bg-indigo-50 px-3 py-1 font-mono2 text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-700">{sel.tag} · {sel.severity} priority</span>
              <h3 className="font-display mt-3 text-2xl font-extrabold text-[#0a1633] sm:text-3xl">{sel.title}</h3>
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border-l-4 border-rose-500 bg-rose-50 p-4">
                  <p className="font-display text-[13px] font-bold uppercase tracking-widest text-rose-700">Problem</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-700">{sel.problem}</p>
                </div>
                <div className="rounded-2xl border-l-4 border-amber-500 bg-amber-50 p-4">
                  <p className="font-display text-[13px] font-bold uppercase tracking-widest text-amber-700">Possible causes</p>
                  <ul className="mt-2 space-y-1.5">
                    {sel.causes.map((c) => <li key={c} className="flex gap-2 text-sm text-slate-700"><span className="text-amber-500">▸</span>{c}</li>)}
                  </ul>
                </div>
                <div className="rounded-2xl border-l-4 border-emerald-500 bg-emerald-50 p-4">
                  <p className="font-display text-[13px] font-bold uppercase tracking-widest text-emerald-700">Solutions</p>
                  <ul className="mt-2 space-y-1.5">
                    {sel.solutions.map((c) => <li key={c} className="flex gap-2 text-sm text-slate-700"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-600" />{c}</li>)}
                  </ul>
                </div>

                {/* Related Technical Resource & In-Depth SOP Callout */}
                {relatedResource && (
                  <div className="mt-6 overflow-hidden rounded-2xl border-2 border-amber-400/70 bg-gradient-to-br from-[#0a1633] to-[#122353] p-5 text-white shadow-xl shadow-indigo-950/20">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-3 py-1 font-mono2 text-[10.5px] font-bold uppercase tracking-wider text-amber-300 ring-1 ring-amber-400/40">
                        <BookOpen size={13} className="text-amber-400" />
                        Related Technical Resource · {relatedResource.category}
                      </span>
                      <span className="text-[12px] font-medium text-slate-300">{relatedResource.readTime || "In-Depth SOP"}</span>
                    </div>
                    <h4 className="font-display mt-3 text-lg font-bold text-white sm:text-xl">
                      {relatedResource.title}
                    </h4>
                    <p className="mt-1.5 line-clamp-2 text-xs sm:text-sm text-indigo-100/80 leading-relaxed">
                      {relatedResource.desc}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3.5 border-t border-white/10">
                      <p className="text-[12px] text-indigo-200/80">
                        Want to learn the complete chemical parameters, machinery recipes & SOP?
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSel(null);
                          if (onSelectResource) {
                            onSelectResource(relatedResource);
                          } else {
                            window.location.hash = `#resources/${encodeURIComponent(relatedResource.id || "")}`;
                          }
                        }}
                        className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-amber-400 px-4 py-2 text-xs sm:text-sm font-bold text-[#0a1633] transition active:scale-95 hover:bg-amber-300 shadow-md shadow-amber-400/20 cursor-pointer"
                      >
                        <FileText size={15} />
                        <span>Learn More in Technical Resource</span>
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </Modal>
    </section>
  );
}

/* ============ FASHION ============ */
export function FashionSection({ onSelectFashion }: { onSelectFashion?: (card: FashionCard) => void }) {
  const { fashionCards } = useData();

  const handleCardClick = (c: FashionCard) => {
    if (onSelectFashion) {
      onSelectFashion(c);
    } else {
      window.location.hash = `#fashion/${c.id || encodeURIComponent(c.title)}`;
    }
  };

  return (
    <section id="fashion" className="denim-texture-light relative py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Denim Fashion"
            title="From Mill Floor to Street Style"
            desc="Trends, garments, washes and finishing effects — click any article to read the full story, technical specifications, and styling guides."
          />
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {fashionCards.map((c, i) => (
            <Reveal key={c.id || c.title} delay={(i % 4) * 80}>
              <article
                role="button"
                tabIndex={0}
                onClick={() => handleCardClick(c)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCardClick(c);
                  }
                }}
                className="group relative h-[390px] cursor-pointer overflow-hidden rounded-3xl shadow-lg ring-1 ring-slate-900/10 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label={`Read article: ${c.title}`}
              >
                <img
                  src={c.image}
                  alt={c.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060d22] via-[#060d22]/35 to-transparent" />
                
                {/* Tag Badge */}
                <div className="absolute left-4 top-4 flex items-center gap-2">
                  <span className="rounded-full bg-white/95 px-3 py-1 font-mono2 text-[10.5px] font-bold uppercase tracking-[0.15em] text-[#0a1633] backdrop-blur shadow-xs">
                    {c.tag}
                  </span>
                </div>

                {/* Hover / Touch "Read Story" Pill */}
                <div className="absolute right-4 top-4 transition-all duration-300 sm:translate-y-1 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 opacity-100">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#0a1633]/90 px-3 py-1 text-[11px] font-bold text-amber-300 backdrop-blur-md shadow-sm border border-white/10">
                    <span>Read</span>
                    <ArrowUpRight size={13} />
                  </span>
                </div>

                {/* Bottom Content */}
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/95 px-3 py-1 text-[11px] font-bold text-[#0a1633]">
                    <Sparkles size={12} /> {c.stat}
                  </p>
                  <h3 className="font-display mt-2.5 text-xl font-extrabold leading-tight text-white group-hover:text-amber-300 transition-colors">
                    {c.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-indigo-100/80">
                    {c.desc}
                  </p>
                  
                  {/* Visual Callout */}
                  <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-amber-400/90 transition sm:opacity-0 sm:group-hover:opacity-100 opacity-100">
                    <span>Explore full story</span>
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ SUSTAINABILITY ============ */
export function SustainabilitySection() {
  return (
    <section id="sustainability" className="relative overflow-hidden bg-[#071026] py-20 sm:py-24">
      <div className="absolute inset-0 opacity-40">
        <img src="https://images.pexels.com/photos/5640079/pexels-photo-5640079.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" alt="" aria-hidden className="h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#071026] via-[#071026]/85 to-[#071026]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            dark
            eyebrow="Sustainable Denim"
            title="Good Jeans Shouldn't Cost the Earth"
            desc="Organic cotton to ozone washing — the technologies and materials rewriting denim's footprint."
          />
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SUST_STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 80}>
              <div className={`rounded-3xl border p-6 backdrop-blur ${s.invert ? "border-rose-400/30 bg-rose-500/10" : "border-emerald-400/25 bg-emerald-400/[0.07]"}`}>
                <p className={`font-display text-4xl font-black ${s.invert ? "text-rose-300" : "text-emerald-300"}`}>
                  <Counter value={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-[13.5px] font-bold leading-snug text-white">{s.label}</p>
                <p className="mt-1 text-xs text-indigo-200/60">{s.note}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {SUST_TOPICS.map((t, i) => {
            const Icon = iconMap[t.icon] ?? Leaf;
            return (
              <Reveal key={t.title} delay={(i % 5) * 60}>
                <div className="group h-full rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur transition hover:-translate-y-1 hover:border-emerald-300/40 hover:bg-white/[0.09]">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-lg">
                    <Icon size={19} />
                  </span>
                  <h3 className="font-display mt-3.5 text-[15px] font-bold text-white">{t.title}</h3>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-indigo-100/70">{t.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={120}>
          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 p-6 sm:flex-row sm:p-7">
            <div>
              <p className="font-display text-xl font-extrabold text-white">Water footprint: 7,500L → under 25L per jean</p>
              <p className="mt-1 text-[13.5px] text-white/85">Laser + ozone + foam dyeing. Full breakdown in our sustainability guides.</p>
            </div>
            <a href="#resources" className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-[#0a1633] px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-black">
              Read the tech guide <ArrowRight size={16} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============ CATEGORIES ============ */
export function CategoriesSection({ onOpen }: { onOpen: (name: string) => void }) {
  return (
    <section id="categories" className="denim-texture-light py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Knowledge Categories"
            title="12 Universes Inside the Universe"
            desc="Pick your path — each category is a curated library of guides, charts, videos and troubleshooting cases."
          />
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {CATEGORIES.map((c, i) => {
            const Icon = iconMap[c.icon] ?? Layers;
            return (
              <Reveal key={c.name} delay={(i % 4) * 70}>
                <button
                  onClick={() => onOpen(c.name)}
                  className="group flex h-full w-full flex-col rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1.5 hover:shadow-[0_20px_55px_rgba(10,22,51,0.14)]"
                >
                  <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${c.color} text-white shadow-lg transition group-hover:scale-110`}>
                    <Icon size={21} />
                  </span>
                  <span className="mt-4 flex items-center justify-between">
                    <h3 className="font-display text-[17px] font-extrabold text-[#0a1633]">{c.name}</h3>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-500">{c.count}</span>
                  </span>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">{c.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-indigo-700">
                    Open library <ArrowRight size={14} className="transition group-hover:translate-x-1" />
                  </span>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
