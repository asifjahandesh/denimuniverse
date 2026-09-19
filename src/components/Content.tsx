import { useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight, BookOpen, CalendarDays, Clock, Search, X, Expand, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { ARTICLES, GALLERY_CATS, type Article } from "../data/content";
import { useData } from "../context/DataContext";
import { Reveal, SectionHeading, Modal } from "./common";

/* ============ INSIGHTS ============ */
const ARTICLE_CATS = ["All", ...Array.from(new Set(ARTICLES.map((a) => a.category)))];

export function InsightsSection() {
  const [cat, setCat] = useState("All");
  const [open, setOpen] = useState<Article | null>(null);
  const list = useMemo(() => (cat === "All" ? ARTICLES : ARTICLES.filter((a) => a.category === cat)), [cat]);
  const featured = ARTICLES.filter((a) => a.featured);

  return (
    <section id="insights" className="relative bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Denim Insights · Blog"
            title="Stories from the Indigo World"
            desc="Deep, practical articles written for the floor and the studio — easy to read, built to expand every week."
          />
        </Reveal>

        {/* Featured strip */}
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {featured.map((a, i) => (
            <Reveal key={a.id} delay={i * 100}>
              <button onClick={() => setOpen(a)} className="group relative grid h-full overflow-hidden rounded-3xl bg-[#0a1633] text-left shadow-xl sm:grid-cols-2">
                <div className="relative h-56 sm:h-full sm:min-h-[280px]">
                  <img src={a.image} alt={a.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <span className="absolute left-4 top-4 rounded-full bg-amber-400 px-3 py-1 font-mono2 text-[10.5px] font-bold uppercase tracking-[0.15em] text-[#0a1633]">Featured</span>
                </div>
                <div className="flex flex-col justify-center p-6 sm:p-7">
                  <span className="font-mono2 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-300">{a.category}</span>
                  <h3 className="font-display mt-2 text-xl font-extrabold leading-snug text-white group-hover:text-amber-200">{a.title}</h3>
                  <p className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed text-indigo-100/75">{a.excerpt}</p>
                  <span className="mt-4 flex items-center gap-3 text-xs text-indigo-200/70">
                    <span className="flex items-center gap-1.5"><CalendarDays size={13} /> {a.date}</span>
                    <span className="flex items-center gap-1.5"><Clock size={13} /> {a.readTime}</span>
                  </span>
                </div>
              </button>
            </Reveal>
          ))}
        </div>

        {/* Filter */}
        <Reveal delay={80}>
          <div className="touch-scroll mt-8 flex gap-2 overflow-x-auto pb-2 pr-6 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {ARTICLE_CATS.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`shrink-0 snap-start rounded-full border px-4 py-2 text-[13px] font-bold transition active:scale-95 ${
                  cat === c ? "border-[#0a1633] bg-[#0a1633] text-white" : "border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-300"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((a, i) => (
            <Reveal key={a.id} delay={(i % 3) * 80}>
              <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1.5 hover:shadow-[0_20px_55px_rgba(10,22,51,0.13)]">
                <div className="relative h-52 overflow-hidden">
                  <img src={a.image} alt={a.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                  <span className="absolute left-4 top-4 rounded-full bg-[#0a1633]/90 px-3 py-1 font-mono2 text-[10.5px] font-bold uppercase tracking-[0.15em] text-amber-300 backdrop-blur">
                    {a.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-[16.5px] font-extrabold leading-snug text-[#0a1633] group-hover:text-indigo-700">{a.title}</h3>
                  <p className="mt-2 line-clamp-2 flex-1 text-[13.5px] leading-relaxed text-slate-500">{a.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="flex items-center gap-3 text-[11.5px] font-medium text-slate-400">
                      <span className="flex items-center gap-1"><CalendarDays size={13} /> {a.date}</span>
                      <span className="flex items-center gap-1"><Clock size={13} /> {a.readTime}</span>
                    </span>
                    <button onClick={() => setOpen(a)} className="inline-flex items-center gap-1 text-[13px] font-bold text-indigo-700 hover:text-indigo-900">
                      Read More <ArrowUpRight size={15} />
                    </button>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Article reader */}
      <Modal open={!!open} onClose={() => setOpen(null)} wide>
        {open && (
          <div>
            <div className="relative h-60 sm:h-80">
              <img src={open.image} alt={open.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-5 left-6 right-6 sm:left-9">
                <span className="rounded-full bg-amber-400 px-3 py-1 font-mono2 text-[10.5px] font-bold uppercase tracking-[0.15em] text-[#0a1633]">{open.category}</span>
                <h3 className="font-display mt-2 max-w-2xl text-2xl font-extrabold leading-tight text-white sm:text-[2rem]">{open.title}</h3>
              </div>
            </div>
            <div className="p-6 sm:p-9">
              <div className="flex flex-wrap items-center gap-4 border-b border-slate-100 pb-5 text-[13px] font-medium text-slate-500">
                <span className="flex items-center gap-1.5"><CalendarDays size={15} className="text-indigo-600" /> {open.date}</span>
                <span className="flex items-center gap-1.5"><Clock size={15} className="text-indigo-600" /> {open.readTime}</span>
                <span className="flex items-center gap-1.5"><BookOpen size={15} className="text-indigo-600" /> Denim Universe Editorial</span>
              </div>
              <div className="prose-denim mt-5">
                <p className="border-l-4 border-amber-400 bg-amber-50 p-4 text-[15px] font-medium italic text-slate-700">{open.excerpt}</p>
                {open.body.map((p, i) => (i === 1 ? (
                  <div key={i}>
                    <p>{p}</p>
                    <div className="my-5 flex gap-3 rounded-2xl bg-indigo-50 p-4">
                      <Quote size={20} className="shrink-0 text-indigo-400" />
                      <p className="text-sm font-semibold italic text-indigo-900">Mill tip: photograph every stage under D65 light and keep retain samples — your future self will thank you during claims.</p>
                    </div>
                  </div>
                ) : <p key={i}>{p}</p>))}
                <h4>Key takeaways</h4>
                <ul>
                  <li>Lock process parameters before chasing shade — consistency beats correction.</li>
                  <li>Test after 3 washes, not just greige — denim reveals truth in laundry.</li>
                  <li>Document with photos, numbers and retain cuts for every lot.</li>
                </ul>
              </div>
              <div className="mt-7 flex flex-col gap-3 rounded-2xl bg-[#0a1633] p-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-white">Enjoyed this? Get one denim lesson every week.</p>
                <a href="#contact" onClick={() => setOpen(null)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-bold text-[#0a1633]">Join free <ArrowRight size={15} /></a>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}

/* ============ DICTIONARY ============ */
export function DictionarySection() {
  const { dictionary } = useData();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [expanded, setExpanded] = useState<string | null>("GSM");
  const cats = ["All", ...Array.from(new Set(dictionary.map((d) => d.cat)))];
  const list = useMemo(
    () => dictionary.filter((d) => (cat === "All" || d.cat === cat) && (d.term + d.short + d.detail).toLowerCase().includes(q.toLowerCase())),
    [dictionary, q, cat]
  );
  return (
    <section id="dictionary" className="denim-texture-light py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Denim Dictionary"
            title="Speak Denim Fluently"
            desc="Search any technical term — GSM to crocking — and get a plain-English explanation in seconds."
          />
        </Reveal>
        <Reveal delay={100}>
          <div className="mx-auto mt-8 max-w-2xl">
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 pl-4 shadow-lg">
              <Search size={19} className="shrink-0 text-indigo-600" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search terms — try “skew”, “EPI”, “sanforizing”…"
                className="w-full bg-transparent py-2.5 text-[15px] font-medium text-[#0a1633] placeholder:text-slate-400"
                aria-label="Search dictionary"
              />
              {q ? (
                <button onClick={() => setQ("")} aria-label="Clear search" className="mr-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition active:scale-95 hover:bg-slate-200">
                  <X size={17} />
                </button>
              ) : (
                <span className="mr-1 hidden rounded-xl bg-[#0a1633] px-4 py-2.5 text-[13px] font-bold text-white sm:block">{dictionary.length} terms</span>
              )}
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {cats.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`rounded-full border px-3.5 py-1.5 text-[12.5px] font-bold transition active:scale-95 ${
                    cat === c ? "border-[#0a1633] bg-[#0a1633] text-white" : "border-slate-200 bg-white text-slate-500 hover:border-indigo-300"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mx-auto mt-8 grid max-w-5xl gap-3">
          {list.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="font-display text-lg font-bold text-[#0a1633]">No terms found for “{q}”</p>
              <p className="mt-1 text-sm text-slate-500">Try “dyeing”, “yarn” or “quality” — or ask us to add it.</p>
            </div>
          )}
          {list.map((d, i) => {
            const isOpen = expanded === d.term;
            return (
              <Reveal key={d.term} delay={Math.min(i, 6) * 40}>
                <div className={`overflow-hidden rounded-2xl border bg-white transition ${isOpen ? "border-indigo-400 shadow-[0_14px_40px_rgba(37,71,184,0.15)]" : "border-slate-200"}`}>
                  <button onClick={() => setExpanded(isOpen ? null : d.term)} className="flex w-full items-center gap-4 p-4 text-left sm:p-5" aria-expanded={isOpen}>
                    <span className={`font-display flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-[13px] font-black ${isOpen ? "bg-[#0a1633] text-amber-400" : "bg-indigo-50 text-indigo-800"}`}>
                      {d.term.slice(0, 2).toUpperCase()}
                    </span>
                    <span className="flex-1">
                      <span className="font-display block text-[15.5px] font-extrabold text-[#0a1633]">{d.term}</span>
                      <span className="block text-[13px] text-slate-500">{d.short}</span>
                    </span>
                    <span className={`hidden rounded-full px-2.5 py-1 font-mono2 text-[10px] font-bold uppercase tracking-widest sm:block ${isOpen ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"}`}>{d.cat}</span>
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${isOpen ? "rotate-45 bg-[#0a1633] text-white" : "bg-slate-100 text-slate-500"}`}>
                      <span className="text-lg font-bold leading-none">+</span>
                    </span>
                  </button>
                  {isOpen && (
                    <div className="border-t border-slate-100 bg-indigo-50/50 px-5 py-4 sm:pl-[5.5rem]">
                      <p className="text-[14px] leading-relaxed text-slate-600">{d.detail}</p>
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============ GALLERY ============ */
export function GallerySection() {
  const { gallery } = useData();
  const [cat, setCat] = useState("All");
  const [light, setLight] = useState<number | null>(null);
  const list = useMemo(() => (cat === "All" ? gallery : gallery.filter((g) => g.cat === cat)), [gallery, cat]);

  const step = (dir: 1 | -1) => {
    if (light === null) return;
    setLight((light + dir + list.length) % list.length);
  };

  return (
    <section id="gallery" className="relative bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Gallery"
            title="The Beauty of Blue"
            desc="Fabric, machines, dye vats and finished garments — a visual tour of the denim universe. Click any image to view."
          />
        </Reveal>
        <Reveal delay={80}>
          <div className="touch-scroll mt-8 flex justify-start sm:justify-center gap-2 overflow-x-auto pb-2 pr-6 snap-x snap-mandatory px-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {GALLERY_CATS.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`shrink-0 snap-start rounded-full border px-4 py-2 text-[13px] font-bold transition active:scale-95 ${
                  cat === c ? "border-[#0a1633] bg-[#0a1633] text-white" : "border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-300"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="masonry mt-8">
          {list.map((g, i) => (
            <Reveal key={g.src + i} delay={Math.min(i, 5) * 60}>
              <button onClick={() => setLight(i)} className="group relative block w-full overflow-hidden rounded-3xl text-left shadow-md transition active:scale-[0.98]">
                <img src={g.src} alt={g.title} loading="lazy" className={`w-full object-cover transition duration-700 group-hover:scale-105 ${g.tall ? "h-80 sm:h-96" : "h-56 sm:h-64"}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060d22]/85 via-[#060d22]/20 to-transparent opacity-80 sm:opacity-0 transition duration-300 sm:group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-3.5 sm:p-4 opacity-100 sm:opacity-0 sm:translate-y-3 transition duration-300 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
                  <span className="min-w-0 pr-2">
                    <span className="block font-mono2 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300">{g.cat}</span>
                    <span className="font-display block text-[14px] sm:text-[15px] font-bold text-white truncate">{g.title}</span>
                  </span>
                  <span className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-white/90 text-[#0a1633] shadow-md">
                    <Expand size={15} />
                  </span>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {light !== null && list[light] && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#060d22]/95 p-3 sm:p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-label="Image viewer" onClick={() => setLight(null)}>
          <button
            aria-label="Close image viewer"
            onClick={() => setLight(null)}
            className="absolute right-3.5 top-3.5 sm:right-5 sm:top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition active:scale-95 hover:bg-white/20 sm:bg-white/10"
          >
            <X size={20} />
          </button>
          <button
            aria-label="Previous photo"
            onClick={(e) => { e.stopPropagation(); step(-1); }}
            className="absolute left-2.5 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition active:scale-95 hover:bg-amber-400 hover:text-[#0a1633] sm:left-6 sm:bg-white/10"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            aria-label="Next photo"
            onClick={(e) => { e.stopPropagation(); step(1); }}
            className="absolute right-2.5 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition active:scale-95 hover:bg-amber-400 hover:text-[#0a1633] sm:right-6 sm:bg-white/10"
          >
            <ChevronRight size={20} />
          </button>
          <figure className="max-h-[86vh] max-w-4xl px-2 sm:px-0" onClick={(e) => e.stopPropagation()}>
            <img src={list[light].src} alt={list[light].title} className="max-h-[72vh] sm:max-h-[74vh] w-full rounded-2xl object-contain shadow-2xl" />
            <figcaption className="mt-3 sm:mt-4 flex items-center justify-between text-white px-2">
              <span className="min-w-0 pr-3">
                <span className="block font-mono2 text-[10.5px] sm:text-[11px] uppercase tracking-[0.2em] text-amber-300">{list[light].cat}</span>
                <span className="font-display text-base sm:text-lg font-bold truncate block">{list[light].title}</span>
              </span>
              <span className="font-mono2 text-xs sm:text-sm text-white/60 shrink-0">{light + 1} / {list.length}</span>
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
