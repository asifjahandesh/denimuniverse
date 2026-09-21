import { useState, useMemo } from "react";
import {
  FileText,
  Lock,
  Unlock,
  ArrowRight,
  BookOpen,
  Sparkles,
  CheckCircle2,
  LogIn,
  LogOut,
  ShieldCheck,
  Search,
  Crown,
  User,
} from "lucide-react";
import { Reveal, SectionHeading } from "./common";
import { useData } from "../context/DataContext";
import { ResourceItem } from "../types/content";
import { RESOURCE_CATEGORIES, normalizeCategory } from "../data/resources";

interface ResourcesSectionProps {
  onSelectResource: (resource: ResourceItem) => void;
}

export function ResourcesSection({ onSelectResource }: ResourcesSectionProps) {
  const {
    resources,
    selectedResourceCategory,
    setSelectedResourceCategory,
    currentMember,
    memberLogout,
    setIsMemberLoginModalOpen,
    openMemberModal,
    hasResourceAccess,
    openMemberProfile,
    openCheckout,
  } = useData();

  const activeCategory = selectedResourceCategory || "All";
  const setActiveCategory = setSelectedResourceCategory;
  const [searchQuery, setSearchQuery] = useState("");

  // Strictly the 15 disciplines + All - no legacy categories allowed
  const categories = useMemo(() => ["All", ...RESOURCE_CATEGORIES], []);

  const filteredResources = useMemo(() => {
    return resources.filter((r) => {
      const normCat = normalizeCategory(r.category);
      const matchCat =
        activeCategory === "All" ||
        normCat.toLowerCase() === activeCategory.toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.desc.toLowerCase().includes(q) ||
        normCat.toLowerCase().includes(q) ||
        (r.author && r.author.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [resources, activeCategory, searchQuery]);

  return (
    <section id="resources" className="relative bg-[#060e24] py-20 sm:py-24 text-white overflow-hidden">
      {/* Background subtle glow */}
      <div className="pointer-events-none absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-1/4 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
        <Reveal>
          <SectionHeading
            dark
            eyebrow="Technical Library & SOP Manuals"
            title="Denim Engineering & Manufacturing Resources"
            desc="In-depth mill guides, chemical formulations, and operating standards written by industry specialists. Read full educational articles online or log in with your member credentials to view protected PDF manuals in our website reader."
          />
        </Reveal>

        {/* Member Session Status Bar */}
        <Reveal delay={100}>
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
            {currentMember ? (
              <button
                type="button"
                onClick={openMemberProfile}
                className="flex items-center gap-3 text-left transition hover:opacity-85"
                title="Click to view Member Profile & Unlocked Library"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {currentMember.plan === "premium" || currentMember.accessAll ? (
                    <Crown size={18} className="text-amber-400" />
                  ) : (
                    <ShieldCheck size={18} />
                  )}
                </span>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                    <span>{currentMember.name || currentMember.email}</span>
                    {currentMember.plan === "premium" || currentMember.accessAll ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400/20 to-indigo-500/20 px-2.5 py-0.5 font-mono2 text-[10px] font-bold text-amber-300 border border-amber-400/40">
                        <Crown size={10} /> PREMIUM VIP
                      </span>
                    ) : currentMember.plan === "basic" ? (
                      <span className="rounded-full bg-amber-400/20 px-2 py-0.5 font-mono2 text-[10px] font-bold text-amber-300 border border-amber-400/30">
                        BASIC MEMBER
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-400/20 px-2 py-0.5 font-mono2 text-[10px] font-bold text-slate-300 border border-slate-400/30">
                        FREE ACCOUNT
                      </span>
                    )}
                  </p>
                  <p className="text-[11px] text-indigo-200/60">
                    {currentMember.plan === "premium" || currentMember.accessAll
                      ? "Full VIP Access: All technical PDF manuals are unlocked."
                      : currentMember.plan === "basic"
                      ? "Basic Plan: Standard technical PDF manuals unlocked. Upgrade to VIP for all manuals."
                      : "Free Reader: Upgrade to Basic or Premium to unlock protected PDF manuals."}
                  </p>
                </div>
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  <Lock size={16} />
                </span>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-white">
                    Looking for factory PDF formulas & SOP manuals?
                  </p>
                  <p className="text-[11px] text-indigo-200/60">
                    Articles are open for all. Attached PDF manuals are unlocked for protected online reading with Basic (199 BDT) or Premium VIP (499 BDT) plans.
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
              {currentMember && (
                <button
                  type="button"
                  onClick={openMemberProfile}
                  className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-3.5 py-1.5 font-display text-xs font-bold text-emerald-300 transition active:scale-95 hover:bg-emerald-500/20 hover:text-white"
                >
                  <User size={13} />
                  <span>My Library & Profile</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => openMemberModal("packages")}
                className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-amber-400/40 bg-amber-400/10 px-3.5 py-1.5 font-display text-xs font-bold text-amber-300 transition active:scale-95 hover:bg-amber-400/20 hover:text-white shadow-sm shadow-amber-400/10"
              >
                <Crown size={13} className="text-amber-400" />
                <span>View Packages</span>
              </button>

              {currentMember ? (
                <button
                  type="button"
                  onClick={memberLogout}
                  className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-bold text-indigo-200 transition active:scale-95 hover:bg-white/15 hover:text-white"
                >
                  <LogOut size={13} />
                  <span>Log Out</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => openMemberModal("signin")}
                  className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2 font-display text-xs font-bold text-[#0a1633] transition active:scale-95 hover:bg-amber-300 shadow-md shadow-amber-400/20"
                >
                  <LogIn size={14} />
                  <span>Sign In / Sign Up</span>
                </button>
              )}
            </div>
          </div>
        </Reveal>

        {/* Category Pills & Search Controls */}
        <Reveal delay={150}>
          <div className="mt-8 space-y-4">
            {/* Top Row: Search Input & Category Count Indicator */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-mono2 text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  Disciplines ({categories.length - 1}):
                </span>
                <span className="text-xs text-indigo-200/70 hidden sm:inline">
                  Click any manufacturing process to filter manuals
                </span>
              </div>

              <div className="relative w-full sm:w-80">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-300/50" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search technical topics, manuals, formulas…"
                  aria-label="Search resources"
                  className="w-full rounded-xl border border-white/15 bg-white/5 pl-9 pr-8 py-2.5 text-xs text-white placeholder:text-indigo-200/40 focus:border-amber-400 focus:outline-none transition"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-sm font-bold cursor-pointer"
                    title="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Category Chips Container: Wrap naturally so ALL 15 options are visible at once */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 sm:p-4 backdrop-blur">
              {categories.map((cat) => {
                const isSelected = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all duration-150 cursor-pointer active:scale-95 ${
                      isSelected
                        ? "bg-amber-400 text-[#0a1633] shadow-md shadow-amber-400/20 ring-2 ring-amber-400/40"
                        : "border border-white/10 bg-white/5 text-indigo-100/90 hover:border-amber-400/40 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* Resources Grid */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {filteredResources.map((res, i) => {
            const hasAccess = hasResourceAccess(res.id);

            return (
              <Reveal key={res.id} delay={i * 80}>
                <article
                  onClick={() => onSelectResource(res)}
                  className="group flex flex-col justify-between cursor-pointer rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-6 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-amber-400/40 hover:shadow-2xl hover:shadow-indigo-950/50"
                >
                  <div>
                    {/* Image / Header */}
                    <div className="relative h-48 sm:h-56 w-full overflow-hidden rounded-2xl">
                      <img
                        src={res.image}
                        alt={res.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#060e24] via-transparent to-transparent opacity-80" />

                      {/* Badges */}
                      <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                        <span className="rounded-lg bg-[#0a1633]/90 px-2.5 py-1 font-mono2 text-[10.5px] font-bold text-amber-300 border border-amber-400/30 backdrop-blur">
                          {normalizeCategory(res.category)}
                        </span>
                      </div>

                      <div className="absolute right-3 top-3 flex flex-wrap items-center gap-1.5">
                        {res.accessTier === "premium" ? (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-950/90 border border-amber-400/50 px-2.5 py-1 font-mono2 text-[10.5px] font-bold text-amber-300 shadow-md backdrop-blur">
                            <Crown size={11} className="text-amber-400" /> VIP MANUAL
                          </span>
                        ) : res.accessTier === "basic" ? (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-[#0a1633]/90 border border-amber-400/40 px-2.5 py-1 font-mono2 text-[10.5px] font-bold text-amber-300 backdrop-blur">
                            BASIC PDF
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500/20 border border-amber-400/30 px-2.5 py-1 font-mono2 text-[10.5px] font-bold text-amber-300 backdrop-blur">
                            TECHNICAL MANUAL
                          </span>
                        )}

                        {hasAccess ? (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/90 px-2.5 py-1 font-mono2 text-[10.5px] font-bold text-white shadow-md backdrop-blur">
                            <Unlock size={11} /> Unlocked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-black/70 px-2.5 py-1 font-mono2 text-[10.5px] font-bold text-slate-300 border border-white/20 backdrop-blur">
                            <Lock size={11} /> Locked
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 text-xs text-indigo-200/80 flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-medium">
                          <BookOpen size={13} className="text-amber-400" />
                          <span>{res.readTime || "7 min read"}</span>
                        </span>
                        <span className="font-mono2 text-[11px] text-indigo-300/70">
                          {res.publishedAt}
                        </span>
                      </div>
                    </div>

                    {/* Text Body */}
                    <div className="mt-5">
                      <h3 className="font-display text-lg sm:text-xl font-bold leading-snug text-white group-hover:text-amber-300 transition">
                        {res.title}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm leading-relaxed text-indigo-100/75 line-clamp-3">
                        {res.desc}
                      </p>
                    </div>
                  </div>

                  {/* PDF Attachment Box */}
                  <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/20">
                        <FileText size={17} />
                      </span>
                      <div className="min-w-0">
                        <span className="font-mono2 block text-xs font-semibold text-white truncate">
                          {res.pdfTitle || "Technical Manual.pdf"}
                        </span>
                        <span className="text-[11px] text-indigo-300/60 block">
                          {res.pdfPages ? `${res.pdfPages} Pages · ` : ""}{res.pdfSize || "PDF"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-auto text-xs font-bold text-amber-400 group-hover:text-amber-300 transition">
                      <span>Read Article</span>
                      <ArrowRight size={14} className="transition group-hover:translate-x-1" />
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        {filteredResources.length === 0 && (
          <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center text-indigo-200/60">
            <BookOpen size={36} className="mx-auto mb-3 text-indigo-300/40" />
            <p className="font-display text-base font-bold text-white">No technical articles found</p>
            <p className="text-xs mt-1">Try selecting another category or clear your search term.</p>
          </div>
        )}
      </div>
    </section>
  );
}
