import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Share2,
  Clock,
  BookOpen,
  FileText,
  Lock,
  Unlock,
  Check,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  MessageCircle,
  LogIn,
  AlertCircle,
  ExternalLink,
  Crown,
  Eye,
} from "lucide-react";
import { ResourceItem } from "../types/content";
import { useData } from "../context/DataContext";
import { normalizeCategory } from "../data/resources";

interface ResourceDetailPageProps {
  resource: ResourceItem;
  allResources: ResourceItem[];
  onBack: () => void;
  onSelectResource: (resource: ResourceItem) => void;
}

export default function ResourceDetailPage({
  resource,
  allResources,
  onBack,
  onSelectResource,
}: ResourceDetailPageProps) {
  const {
    currentMember,
    hasResourceAccess,
    setIsMemberLoginModalOpen,
    openMemberModal,
    membershipSettings,
    siteConfig,
    openCheckout,
    openMemberProfile,
    openPdfReader,
  } = useData();
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const hasAccess = hasResourceAccess(resource.id);

  // Scroll progress indicator
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: resource.title,
          text: resource.desc,
          url,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenPdfReader = () => {
    if (!hasAccess) {
      if (currentMember) {
        openCheckout({
          type: "single_pdf",
          resource,
        });
      } else {
        openMemberModal("signin");
      }
      return;
    }
    openPdfReader(resource);
  };

  const currentIndex = allResources.findIndex((r) => r.id === resource.id);
  const prevResource = currentIndex > 0 ? allResources[currentIndex - 1] : null;
  const nextResource = currentIndex < allResources.length - 1 ? allResources[currentIndex + 1] : null;
  const relatedResources = allResources.filter((r) => r.id !== resource.id).slice(0, 2);

  return (
    <div className="min-h-screen bg-[#060e24] text-white">
      {/* Sticky Top Reading Bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#060e24]/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-1.5 text-xs font-bold text-indigo-100 transition active:scale-95 hover:bg-white/15 hover:text-white"
          >
            <ArrowLeft size={14} />
            <span>Back to Resources</span>
          </button>

          <span className="hidden sm:block font-mono2 text-xs text-amber-300 font-bold truncate max-w-xs">
            {resource.title}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openMemberModal("packages")}
              className="hidden sm:inline-flex items-center gap-1 rounded-xl border border-amber-400/40 bg-amber-400/10 px-2.5 py-1 text-[11px] font-bold text-amber-300 hover:bg-amber-400/20 transition"
            >
              <Crown size={12} className="text-amber-400" /> Packages
            </button>

            {currentMember ? (
              <button
                type="button"
                onClick={openMemberProfile}
                className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/20 px-2.5 py-1 text-[11px] font-bold text-emerald-300 border border-emerald-500/30 transition hover:bg-emerald-500/30 cursor-pointer"
                title="Open Profile & My Library"
              >
                {currentMember.plan === "premium" || currentMember.accessAll ? (
                  <>
                    <Crown size={12} className="text-amber-400" /> Member: {currentMember.name.split(" ")[0]} (VIP)
                  </>
                ) : currentMember.plan === "basic" ? (
                  <>
                    <ShieldCheck size={12} /> Member: {currentMember.name.split(" ")[0]} (Basic)
                  </>
                ) : (
                  <>
                    <ShieldCheck size={12} /> Member: {currentMember.name.split(" ")[0]}
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => openMemberModal("signin")}
                className="inline-flex items-center gap-1 rounded-lg bg-amber-400/20 px-2.5 py-1 text-[11px] font-bold text-amber-300 hover:bg-amber-400/30 transition"
              >
                <LogIn size={12} /> Login / Sign Up
              </button>
            )}

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-bold text-indigo-100 transition active:scale-95 hover:bg-white/15"
              title="Share this article"
            >
              {copied ? (
                <>
                  <Check size={13} className="text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Share2 size={13} />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Reading progress bar */}
        <div className="h-[2px] w-full bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-indigo-400 transition-all duration-150"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </header>

      {/* Main Article Container */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:py-12 sm:px-6">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6 flex items-center gap-2 font-mono2 text-xs text-indigo-300/60">
          <button onClick={onBack} className="hover:text-amber-300 transition">
            Home
          </button>
          <span>/</span>
          <button onClick={onBack} className="hover:text-amber-300 transition">
            Resources
          </button>
          <span>/</span>
          <span className="text-amber-300 truncate">{normalizeCategory(resource.category)}</span>
        </nav>

        {/* Article Meta Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="rounded-lg bg-amber-400/20 px-3 py-1 font-mono2 text-xs font-bold text-amber-300 border border-amber-400/30">
              {normalizeCategory(resource.category)}
            </span>
            {hasAccess ? (
              <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/20 px-2.5 py-1 font-mono2 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                <Unlock size={12} /> Member Access Unlocked
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500/20 px-2.5 py-1 font-mono2 text-xs font-bold text-amber-300 border border-amber-500/30">
                <Lock size={12} /> {resource.priceBadge || "Paid PDF Manual"}
              </span>
            )}
          </div>

          <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-white leading-tight">
            {resource.title}
          </h1>

          {/* Byline & Dates */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5 pt-1 text-xs text-indigo-200/70">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-amber-400 to-indigo-600 font-bold text-[#0a1633] text-xs">
                {resource.author ? resource.author.charAt(0) : "D"}
              </span>
              <div>
                <span className="block font-bold text-white">{resource.author}</span>
                <span className="text-[11px] text-indigo-300/60">{resource.publishedAt}</span>
              </div>
            </div>

            <span className="flex items-center gap-1.5 font-medium text-amber-300">
              <Clock size={13} />
              <span>{resource.readTime || "7 min read"}</span>
            </span>
          </div>
        </div>

        {/* Hero Image */}
        {resource.image && (
          <div className="mt-8 overflow-hidden rounded-3xl border border-white/15 shadow-2xl">
            <img
              src={resource.image}
              alt={resource.title}
              className="h-64 sm:h-96 w-full object-cover"
            />
          </div>
        )}

        {/* Executive Lead Summary */}
        <div className="mt-8 rounded-3xl border border-amber-400/30 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent p-6 sm:p-7 backdrop-blur">
          <p className="font-mono2 text-xs font-bold uppercase tracking-wider text-amber-300 mb-1.5">
            Technical Briefing & Executive Summary
          </p>
          <p className="text-sm sm:text-base leading-relaxed text-indigo-100/90 font-medium">
            {resource.desc}
          </p>
        </div>

        {/* Formatted Article Body */}
        <div className="mt-10 space-y-6 text-sm sm:text-base leading-relaxed text-indigo-100/85">
          {resource.content.split("\n\n").map((paragraph, index) => {
            if (paragraph.startsWith("### ")) {
              return (
                <h2
                  key={index}
                  className="font-display mt-8 pt-4 border-t border-white/10 text-xl sm:text-2xl font-bold text-white"
                >
                  {paragraph.replace("### ", "")}
                </h2>
              );
            }

            if (paragraph.startsWith("- ")) {
              const items = paragraph.split("\n- ");
              return (
                <ul key={index} className="space-y-2 pl-2">
                  {items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                      <span>{item.replace(/^- /, "")}</span>
                    </li>
                  ))}
                </ul>
              );
            }

            if (paragraph.startsWith("---")) {
              return <hr key={index} className="border-white/10 my-6" />;
            }

            return (
              <p key={index} className="leading-relaxed">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* ================================================================ */}
        {/* PROTECTED IN-WEBSITE PDF VIEWER                                  */}
        {/* ================================================================ */}
        <div className="mt-12 overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-[#0e1d47] via-[#0a1633] to-[#071026] p-6 sm:p-8 shadow-2xl relative">
          <div className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-amber-500/10 blur-2xl" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4 min-w-0 flex-1">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-400 text-[#0a1633] shadow-lg shadow-amber-400/20">
                <FileText size={28} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono2 text-xs font-bold uppercase tracking-wider text-amber-300">
                    Official Factory Manual (PDF)
                  </span>
                  {hasAccess ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10.5px] font-bold text-emerald-300 border border-emerald-500/30">
                      <CheckCircle2 size={11} /> Unlocked
                    </span>
                  ) : resource.accessTier === "premium" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-950/90 px-2.5 py-0.5 text-[10.5px] font-bold text-amber-300 border border-amber-400/50 shadow-sm">
                      <Crown size={11} className="text-amber-400" /> Premium VIP Manual ({membershipSettings?.premiumPlan?.price || "499 BDT"})
                    </span>
                  ) : resource.accessTier === "basic" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10.5px] font-bold text-amber-300 border border-amber-500/30">
                      <Lock size={11} /> Basic Plan Required ({membershipSettings?.basicPlan?.price || "199 BDT"})
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10.5px] font-bold text-amber-300 border border-amber-500/30">
                      <Lock size={11} /> Manual Access ({resource.singlePrice || "49 BDT"})
                    </span>
                  )}
                </div>

                <h3 className="font-display mt-1 text-lg sm:text-xl font-extrabold text-white break-words">
                  {resource.pdfTitle || `${resource.title}.pdf`}
                </h3>

                <p className="mt-1 text-xs text-indigo-200/70">
                  {resource.pdfPages ? `${resource.pdfPages} Pages · ` : ""}
                  Protected In-Website SOP · Denim Universe Watermarked
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 sm:shrink-0">
              {hasAccess ? (
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleOpenPdfReader}
                    className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-2.5 font-display text-xs sm:text-sm font-bold text-slate-950 shadow-lg shadow-amber-400/20 transition active:scale-95 hover:brightness-110 cursor-pointer shrink-0"
                  >
                    <Eye size={17} />
                    <span>View PDF SOP</span>
                  </button>
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-300 font-mono2 font-bold px-3 py-1.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <CheckCircle2 size={14} className="text-emerald-400" />
                    <span>View-Only Protected Access</span>
                  </span>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Single PDF Purchase */}
                  <button
                    type="button"
                    onClick={() =>
                      openCheckout({
                        type: "single_pdf",
                        resource,
                      })
                    }
                    className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-5 py-2.5 font-display text-xs font-bold text-slate-950 shadow-md shadow-amber-400/20 transition active:scale-95 hover:brightness-110 cursor-pointer shrink-0"
                  >
                    <Eye size={15} />
                    <span>
                      Unlock & View PDF ({resource.singlePrice || "49 BDT"})
                    </span>
                  </button>

                  {/* Packages / All Access */}
                  <button
                    type="button"
                    onClick={() => openMemberModal("packages")}
                    className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-2.5 font-display text-xs font-bold text-amber-300 transition active:scale-95 hover:bg-amber-400/20 cursor-pointer shrink-0"
                  >
                    <Crown size={14} className="text-amber-400" />
                    <span>View Packages ({membershipSettings?.basicPlan?.price || "199 BDT"}+)</span>
                  </button>

                  {!currentMember && (
                    <button
                      type="button"
                      onClick={() => openMemberModal("signin")}
                      className="inline-flex min-h-[46px] items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 font-display text-xs font-semibold text-slate-300 transition hover:bg-white/10 cursor-pointer shrink-0"
                    >
                      <LogIn size={14} />
                      <span>Sign In</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {!hasAccess && (
            <div className="mt-5 border-t border-white/10 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[11.5px] text-indigo-200/70">
              <span>
                {currentMember?.plan === "basic" && resource.accessTier === "premium" ? (
                  <>⭐ You have the <strong>Basic Plan</strong>. This manual requires the <strong>Premium VIP Plan</strong>.</>
                ) : (
                  <>🔒 PDF manuals contain calibrated recipes and SOPs with Denim Universe official watermarks. Accessible with <strong>Basic ({membershipSettings?.basicPlan?.price || "199 BDT"})</strong> or <strong>Premium VIP ({membershipSettings?.premiumPlan?.price || "499 BDT"})</strong> membership.</>
                )}
              </span>
              <button
                type="button"
                onClick={() => openMemberModal("packages")}
                className="text-amber-400 font-bold underline hover:text-amber-300 self-start sm:self-auto shrink-0"
              >
                See membership benefits & payment methods →
              </button>
            </div>
          )}
        </div>

        {/* Previous & Next Navigation */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 border-t border-white/10 pt-8">
          {prevResource ? (
            <button
              onClick={() => onSelectResource(prevResource)}
              className="flex flex-col items-start p-4 rounded-2xl border border-white/10 bg-white/[0.03] text-left hover:border-amber-400/40 transition group"
            >
              <span className="text-[11px] font-mono2 text-indigo-300/60 uppercase">← Previous Article</span>
              <span className="font-display font-bold text-white text-sm mt-1 group-hover:text-amber-300 transition line-clamp-1">
                {prevResource.title}
              </span>
            </button>
          ) : <div />}

          {nextResource ? (
            <button
              onClick={() => onSelectResource(nextResource)}
              className="flex flex-col items-end p-4 rounded-2xl border border-white/10 bg-white/[0.03] text-right hover:border-amber-400/40 transition group"
            >
              <span className="text-[11px] font-mono2 text-indigo-300/60 uppercase">Next Article →</span>
              <span className="font-display font-bold text-white text-sm mt-1 group-hover:text-amber-300 transition line-clamp-1">
                {nextResource.title}
              </span>
            </button>
          ) : <div />}
        </div>
      </main>
    </div>
  );
}
