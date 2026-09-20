import { useEffect, useState } from "react";
import { Menu, X, ChevronRight, Shield, Lock, User } from "lucide-react";
import { NAV_LINKS, SITE_CONFIG } from "../data/content";
import { useData } from "../context/DataContext";
import logoImg from "../assets/logo.png";

export function FacebookIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.6-1.5h1.3V4.9c-.3 0-1.1-.1-2-.1-2 0-3.4 1.2-3.4 3.5V11H8.5v3H11v7h2.5z" />
    </svg>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("Home");
  const {
    siteConfig,
    isAuthenticated,
    setIsAdminOpen,
    setIsLoginModalOpen,
    currentMember,
    setIsMemberLoginModalOpen,
    openMemberProfile,
    openMemberModal,
  } = useData();

  const handleAdminClick = () => {
    setIsAdminOpen(false);
    setIsLoginModalOpen(true);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Top utility bar */}
      <div className="denim-texture hidden border-b border-white/10 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-[12px] text-indigo-100/80">
          <p className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400" />
            The Denim Knowledge Hub — Fabric · Dyeing · Quality · Sustainability
          </p>
          <div className="flex items-center gap-5">
            <span className="font-mono2 tracking-widest text-[11px] uppercase">EST. For denim minds</span>
            <a href={siteConfig.facebookUrl || SITE_CONFIG.facebookUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 font-semibold text-white transition hover:text-amber-300">
              <FacebookIcon size={13} /> Follow 48K+
            </a>
            <button
              type="button"
              onClick={() => {
                if (currentMember) {
                  openMemberProfile();
                } else {
                  openMemberModal("signin");
                }
              }}
              className="flex items-center gap-1.5 rounded-full border border-indigo-400/40 bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-200 transition hover:bg-indigo-500/20"
              title={currentMember ? "View Member Profile & Library" : "Paid Member Portal"}
            >
              {currentMember ? (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span>Member: {currentMember.name.split(" ")[0]}</span>
                </>
              ) : (
                <>
                  <Lock size={11} className="text-indigo-400" />
                  <span>Member Login</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleAdminClick}
              className="flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-300 transition hover:bg-amber-400/20"
              title="Open Admin Panel"
            >
              <Shield size={12} className="text-amber-400" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-[70] transition-all duration-300 ${
          scrolled ? "bg-[#0a1633]/95 shadow-[0_8px_30px_rgba(6,13,34,0.35)] backdrop-blur-xl" : "denim-texture"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3.5 py-2.5 sm:px-6 sm:py-3">
          {/* Logo */}
          <a href="#home" className="group flex items-center gap-2.5 sm:gap-3 min-w-0">
            <span className="relative flex shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <img
                src={logoImg}
                alt="Denim Universe Official Logo"
                className="h-10 w-10 sm:h-11 sm:w-11 rounded-full object-cover shadow-lg ring-2 ring-white/20 transition-all duration-300 group-hover:ring-amber-400/60"
              />
            </span>
            <span className="leading-none truncate">
              <span className="font-display block text-[15px] sm:text-[17px] font-extrabold tracking-tight text-white">
                DENIM <span className="text-amber-400">UNIVERSE</span>
              </span>
              <span className="mt-0.5 sm:mt-1 block text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.2em] sm:tracking-[0.28em] text-indigo-200/70 truncate">
                Explore the world of denim
              </span>
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 xl:flex" aria-label="Primary">
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setActive(l.label)}
                className={`rounded-full px-3 py-2 text-[13px] font-semibold transition ${
                  active === l.label ? "bg-white/12 text-amber-300" : "text-indigo-100/85 hover:bg-white/10 hover:text-white"
                }`}
              >
                {l.label}
              </a>
            ))}
            <a
              href={siteConfig.facebookUrl || SITE_CONFIG.facebookUrl}
              target="_blank"
              rel="noreferrer"
              className="ml-2 inline-flex items-center gap-2 rounded-full bg-[#1877F2] px-4 py-2 text-[13px] font-bold text-white shadow-lg shadow-blue-900/40 transition hover:-translate-y-0.5 hover:bg-[#0f66d6]"
            >
              <FacebookIcon size={15} /> Follow
            </a>
            <button
              type="button"
              onClick={() => {
                if (currentMember) {
                  openMemberProfile();
                } else {
                  openMemberModal("signin");
                }
              }}
              className="ml-1 inline-flex items-center gap-1.5 rounded-full border border-indigo-400/40 bg-indigo-500/10 px-3 py-2 text-[13px] font-bold text-indigo-200 transition hover:bg-indigo-500 hover:text-white cursor-pointer"
              title={currentMember ? "View Member Profile & Library" : "Paid Member Portal"}
            >
              {currentMember ? (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <User size={13} className="text-emerald-400" />
                  <span>{currentMember.name.split(" ")[0]}</span>
                </>
              ) : (
                <>
                  <Lock size={13} />
                  <span>Member</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleAdminClick}
              className="ml-1.5 inline-flex items-center gap-1.5 rounded-full border border-amber-400/50 bg-amber-400/10 px-3.5 py-2 text-[13px] font-bold text-amber-300 transition hover:bg-amber-400 hover:text-[#0a1633]"
              title="Admin Panel"
            >
              <Shield size={14} />
              <span>Admin</span>
            </button>
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white transition active:scale-95 hover:bg-white/20 xl:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <div className="stitch-line opacity-60" />
      </header>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-[80] xl:hidden ${open ? "" : "pointer-events-none"}`}>
        <div
          className={`absolute inset-0 bg-[#060d22]/75 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />
        <aside
          className={`touch-scroll denim-texture absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col shadow-2xl transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-white/10 p-4 sm:p-5">
            <div className="flex items-center gap-2.5">
              <img src={logoImg} alt="Denim Universe Logo" className="h-9 w-9 rounded-full object-cover shadow-md ring-1 ring-white/20" />
              <span className="font-display text-lg font-extrabold text-white">
                DENIM <span className="text-amber-400">UNIVERSE</span>
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition active:scale-95 hover:bg-white/20"
            >
              <X size={19} />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto p-3.5 sm:p-4" aria-label="Mobile">
            {NAV_LINKS.map((l, i) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="group flex min-h-[46px] items-center justify-between rounded-xl px-4 py-3 text-[15px] font-semibold text-indigo-100 transition hover:bg-white/10 active:bg-white/20 hover:text-white"
              >
                <span className="flex items-center gap-3">
                  <span className="font-mono2 text-[11px] text-amber-400/80">{String(i + 1).padStart(2, "0")}</span>
                  {l.label}
                </span>
                <ChevronRight size={16} className="text-white/30 transition group-hover:translate-x-1 group-hover:text-amber-400" />
              </a>
            ))}
          </nav>
          <div className="border-t border-white/10 p-4 pb-safe sm:p-5">
            <a
              href={siteConfig.facebookUrl || SITE_CONFIG.facebookUrl}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-[#1877F2] py-3 font-bold text-white shadow-lg transition active:scale-95 hover:bg-[#0f66d6]"
            >
              <FacebookIcon size={18} /> Follow on Facebook
            </a>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                if (currentMember) {
                  openMemberProfile();
                } else {
                  openMemberModal("signin");
                }
              }}
              className="mt-3 flex min-h-[46px] w-full items-center justify-center gap-2 rounded-2xl border border-indigo-400/30 bg-indigo-500/10 py-3 text-sm font-bold text-indigo-200 transition active:scale-95 hover:bg-indigo-500/20"
            >
              {currentMember ? (
                <>
                  <User size={16} className="text-emerald-400" />
                  <span>Member: {currentMember.name.split(" ")[0]} (Profile)</span>
                </>
              ) : (
                <>
                  <Lock size={16} className="text-indigo-400" />
                  <span>Paid Member Login</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                handleAdminClick();
              }}
              className="mt-2.5 flex min-h-[46px] w-full items-center justify-center gap-2 rounded-2xl border border-amber-400/30 bg-amber-400/10 py-3 text-sm font-bold text-amber-300 transition active:scale-95 hover:bg-amber-400/20"
            >
              <Shield size={16} />
              <span>Admin Portal</span>
            </button>
            <p className="mt-3 text-center text-xs text-indigo-200/60">Daily denim knowledge · fashion · sustainability</p>
          </div>
        </aside>
      </div>
    </>
  );
}
