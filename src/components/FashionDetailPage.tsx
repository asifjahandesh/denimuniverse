import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Scissors,
  Share2,
  Sparkles,
  Tag,
  User,
} from "lucide-react";
import { FashionCard } from "../types/content";
import { getFashionStory } from "../data/fashionStories";

interface FashionDetailPageProps {
  card: FashionCard;
  allCards: FashionCard[];
  onBack: () => void;
  onSelectFashion: (card: FashionCard) => void;
}

export default function FashionDetailPage({
  card,
  allCards,
  onBack,
  onSelectFashion,
}: FashionDetailPageProps) {
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Load rich story content (with fallback)
  const story = useMemo(() => getFashionStory(card), [card]);

  // Determine previous and next stories
  const currentIndex = useMemo(() => {
    const idx = allCards.findIndex((c) => (c.id && c.id === card.id) || c.title === card.title);
    return idx >= 0 ? idx : 0;
  }, [allCards, card]);

  const prevCard = currentIndex > 0 ? allCards[currentIndex - 1] : allCards[allCards.length - 1];
  const nextCard = currentIndex < allCards.length - 1 ? allCards[currentIndex + 1] : allCards[0];

  // Related cards (excluding current)
  const relatedCards = useMemo(() => {
    return allCards.filter((c) => c.id !== card.id && c.title !== card.title).slice(0, 3);
  }, [allCards, card]);

  // Scroll to top when article mounts or changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [card.id, card.title]);

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareData = {
      title: `${card.title} — Denim Universe`,
      text: card.desc,
      url: shareUrl,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // Fallback to clipboard if cancelled or failed
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-800 selection:bg-amber-300 selection:text-[#0a1633]">
      {/* Top Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-amber-400 via-indigo-500 to-amber-300 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      {/* Sticky Header */}
      <header className="sticky top-0 z-40 border-b border-indigo-950/20 bg-[#071026]/95 backdrop-blur-md text-white shadow-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <button
            onClick={onBack}
            className="group flex min-h-[44px] items-center gap-2 rounded-xl bg-white/10 px-3.5 py-2 text-xs sm:text-sm font-bold text-white transition active:scale-95 hover:bg-white/20"
            aria-label="Back to Denim Universe Fashion"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            <span>Back to Fashion</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 font-display text-sm font-extrabold tracking-wide text-white">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-400 text-xs font-black text-[#071026]">
              DU
            </span>
            <span>Denim Universe <span className="text-amber-300 font-normal">· Editorial</span></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex min-h-[44px] items-center gap-1.5 rounded-xl bg-white/10 px-3.5 py-2 text-xs sm:text-sm font-bold text-white transition active:scale-95 hover:bg-white/20"
              title="Share article link"
            >
              {copied ? (
                <>
                  <Check size={16} className="text-emerald-400" />
                  <span className="text-emerald-300">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 size={16} />
                  <span className="hidden xs:inline">Share</span>
                </>
              )}
            </button>

            {nextCard && (
              <button
                onClick={() => onSelectFashion(nextCard)}
                className="flex min-h-[44px] items-center gap-1 rounded-xl bg-amber-400 px-3.5 py-2 text-xs sm:text-sm font-extrabold text-[#071026] transition active:scale-95 hover:bg-amber-300"
                title={`Next: ${nextCard.title}`}
              >
                <span className="hidden sm:inline">Next Story</span>
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Article Container */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
          <button onClick={onBack} className="hover:text-indigo-600 transition">Home</button>
          <span>/</span>
          <button onClick={onBack} className="hover:text-indigo-600 transition">Denim Fashion</button>
          <span>/</span>
          <span className="rounded-md bg-indigo-50 px-2 py-0.5 font-mono2 text-[11px] font-bold uppercase tracking-wider text-indigo-700">
            {card.tag}
          </span>
          <span>/</span>
          <span className="text-slate-800 font-medium truncate max-w-[200px] sm:max-w-xs">{card.title}</span>
        </nav>

        {/* Article Header */}
        <article className="overflow-hidden">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0a1633] px-3.5 py-1.5 font-mono2 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-300">
                <Tag size={12} /> {card.tag}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/90 px-3.5 py-1.5 text-[11.5px] font-bold text-[#0a1633] shadow-sm">
                <Sparkles size={12} /> {card.stat}
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black leading-tight text-[#0a1633]">
              {card.title}
            </h1>

            <p className="text-base sm:text-xl font-medium leading-relaxed text-slate-600">
              {card.desc}
            </p>

            {/* Author Byline & Date Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-y border-slate-200 py-4 text-xs sm:text-sm text-slate-600">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#0a1633] to-indigo-800 font-display font-extrabold text-white text-xs shadow">
                  DU
                </div>
                <div>
                  <p className="font-bold text-[#0a1633] flex items-center gap-1.5">
                    <User size={14} className="text-indigo-600" />
                    {card.author || story.author}
                  </p>
                  <p className="text-xs text-slate-500">{story.authorRole}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs sm:text-sm font-medium text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Clock size={15} className="text-slate-400" />
                  {card.readTime || story.readTime}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={15} className="text-slate-400" />
                  {card.publishedAt || story.publishedAt}
                </span>
              </div>
            </div>
          </div>

          {/* Hero Image Showcase */}
          <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-[#071026] shadow-xl">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden">
              <img
                src={card.image}
                alt={card.title}
                className="h-full w-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060d22]/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-xs sm:text-sm text-indigo-100/90 font-medium drop-shadow">
                  {story.imageCaption}
                </p>
              </div>
            </div>
          </div>

          {/* Lead Quote / Executive Summary */}
          <div className="mt-8 rounded-2xl border-l-4 border-amber-400 bg-amber-50/60 p-5 sm:p-6 text-slate-800 shadow-sm">
            <p className="font-mono2 text-[11px] font-bold uppercase tracking-widest text-amber-700">
              Editorial Overview
            </p>
            <p className="mt-2 font-display text-base sm:text-lg font-bold leading-relaxed text-[#0a1633]">
              "{story.leadSummary}"
            </p>
          </div>

          {/* Body Content */}
          <div className="mt-10 space-y-8 text-base sm:text-lg leading-relaxed text-slate-700">
            {card.content ? (
              // If custom content was authored in Admin Panel
              <div className="space-y-5">
                {card.content.split("\n\n").map((para, i) => (
                  <p key={i} className="text-base sm:text-lg leading-relaxed text-slate-700 whitespace-pre-line">
                    {para}
                  </p>
                ))}
              </div>
            ) : (
              // Default rich sections from fashion stories
              story.sections.map((section, idx) => (
                <section key={idx} className="space-y-3">
                  <h2 className="font-display text-xl sm:text-2xl font-black text-[#0a1633] pt-2">
                    {section.heading}
                  </h2>
                  <p className="text-base sm:text-lg leading-relaxed text-slate-700">
                    {section.body}
                  </p>
                </section>
              ))
            )}
          </div>

          {/* Technical Specifications Box */}
          <div className="mt-12 overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 to-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2 text-indigo-900">
              <Scissors size={20} className="text-amber-500" />
              <h3 className="font-display text-lg sm:text-xl font-extrabold text-[#0a1633]">
                Fabric & Production Specifications
              </h3>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Recommended mill parameters, weave constructions, and finishing methods for this look.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-white bg-white/90 p-4 shadow-xs">
                <span className="font-mono2 text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                  Ideal Weight
                </span>
                <p className="font-display mt-1 text-sm sm:text-base font-extrabold text-[#0a1633]">
                  {story.specs.idealWeight}
                </p>
              </div>

              <div className="rounded-2xl border border-white bg-white/90 p-4 shadow-xs">
                <span className="font-mono2 text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                  Twill Construction
                </span>
                <p className="font-display mt-1 text-sm sm:text-base font-extrabold text-[#0a1633]">
                  {story.specs.twillType}
                </p>
              </div>

              <div className="rounded-2xl border border-white bg-white/90 p-4 shadow-xs">
                <span className="font-mono2 text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                  Wash & Finish
                </span>
                <p className="font-display mt-1 text-sm sm:text-base font-extrabold text-[#0a1633]">
                  {story.specs.washMethod}
                </p>
              </div>

              <div className="rounded-2xl border border-white bg-white/90 p-4 shadow-xs">
                <span className="font-mono2 text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                  Target Silhouette
                </span>
                <p className="font-display mt-1 text-sm sm:text-base font-extrabold text-[#0a1633]">
                  {story.specs.targetFit}
                </p>
              </div>
            </div>
          </div>

          {/* Key Takeaways Checklist */}
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <h3 className="font-display text-lg sm:text-xl font-extrabold text-[#0a1633]">
              Key Industry Takeaways
            </h3>
            <ul className="mt-4 space-y-3">
              {story.keyTakeaways.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-slate-700">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Share & Actions Banner */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl bg-[#071026] p-6 text-white shadow-lg">
            <div>
              <h4 className="font-display text-lg font-bold">Found this fashion insight valuable?</h4>
              <p className="text-xs sm:text-sm text-indigo-200/80">
                Share with colleagues, designers, students, or your production team.
              </p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleShare}
                className="flex-1 sm:flex-initial flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-bold text-[#071026] transition active:scale-95 hover:bg-amber-300"
              >
                {copied ? <Check size={16} /> : <Share2 size={16} />}
                <span>{copied ? "Link Copied!" : "Share Article"}</span>
              </button>
              <button
                onClick={onBack}
                className="flex-1 sm:flex-initial flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-white/10 px-5 py-2.5 text-sm font-bold text-white transition active:scale-95 hover:bg-white/20"
              >
                <ArrowLeft size={16} />
                <span>All Trends</span>
              </button>
            </div>
          </div>

          {/* Previous & Next Article Cards */}
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {prevCard && (
              <button
                onClick={() => onSelectFashion(prevCard)}
                className="group flex min-h-[90px] text-left items-center gap-4 rounded-3xl border border-slate-200 bg-white p-4 transition active:scale-95 hover:border-indigo-300 hover:shadow-md"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition group-hover:bg-[#0a1633] group-hover:text-white">
                  <ChevronLeft size={20} />
                </div>
                <div className="overflow-hidden">
                  <span className="font-mono2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Previous Story
                  </span>
                  <p className="font-display font-extrabold text-[#0a1633] truncate text-sm sm:text-base">
                    {prevCard.title}
                  </p>
                </div>
              </button>
            )}

            {nextCard && (
              <button
                onClick={() => onSelectFashion(nextCard)}
                className="group flex min-h-[90px] text-right items-center justify-end gap-4 rounded-3xl border border-slate-200 bg-white p-4 transition active:scale-95 hover:border-indigo-300 hover:shadow-md"
              >
                <div className="overflow-hidden">
                  <span className="font-mono2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Next Story
                  </span>
                  <p className="font-display font-extrabold text-[#0a1633] truncate text-sm sm:text-base">
                    {nextCard.title}
                  </p>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition group-hover:bg-[#0a1633] group-hover:text-white">
                  <ChevronRight size={20} />
                </div>
              </button>
            )}
          </div>

          {/* Explore More Fashion Stories Grid */}
          {relatedCards.length > 0 && (
            <div className="mt-16 border-t border-slate-200 pt-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="font-mono2 text-[11px] font-bold uppercase tracking-widest text-indigo-700">
                    Denim Universe Series
                  </span>
                  <h3 className="font-display text-2xl font-black text-[#0a1633]">
                    More Fashion Stories
                  </h3>
                </div>
                <button
                  onClick={onBack}
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
                >
                  <span>View all</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {relatedCards.map((rc) => (
                  <article
                    key={rc.id || rc.title}
                    onClick={() => onSelectFashion(rc)}
                    className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition duration-300 active:scale-95 hover:border-indigo-300 hover:shadow-lg flex flex-col"
                  >
                    <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                      <img
                        src={rc.image}
                        alt={rc.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <span className="absolute left-2.5 top-2.5 rounded-full bg-white/90 px-2.5 py-0.5 font-mono2 text-[9.5px] font-bold uppercase tracking-wider text-[#0a1633] backdrop-blur">
                        {rc.tag}
                      </span>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-display text-sm font-extrabold text-[#0a1633] group-hover:text-indigo-600 transition">
                          {rc.title}
                        </h4>
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
                          {rc.desc}
                        </p>
                      </div>
                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
                        <span>Read Story</span>
                        <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* Return CTA */}
          <div className="mt-14 text-center pb-8">
            <button
              onClick={onBack}
              className="inline-flex min-h-[50px] items-center gap-2 rounded-2xl bg-[#0a1633] px-8 py-3.5 text-sm font-bold text-white shadow-md transition active:scale-95 hover:bg-indigo-950"
            >
              <ArrowLeft size={16} />
              <span>Back to Denim Universe Main Page</span>
            </button>
          </div>
        </article>
      </main>
    </div>
  );
}
