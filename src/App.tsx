import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Search, Wrench, X } from "lucide-react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import { ProcessSection, TroubleshootingSection, FashionSection, SustainabilitySection, CategoriesSection } from "./components/Knowledge";
import { InsightsSection, DictionarySection, GallerySection } from "./components/Content";
import { AboutSection, FacebookSection, ContactSection, Footer } from "./components/Closing";
import { Modal, Reveal } from "./components/common";
import { CATEGORIES } from "./data/content";
import { DataProvider, useData } from "./context/DataContext";
import AdminLoginModal from "./components/admin/AdminLoginModal";
import AdminPanel from "./components/admin/AdminPanel";
import Analytics from "./components/Analytics";
import FashionDetailPage from "./components/FashionDetailPage";
import { FashionCard } from "./types/content";

function MainApp() {
  const [showAllTroubles, setShowAllTroubles] = useState(false);
  const [catOpen, setCatOpen] = useState<string | null>(null);
  const [tSearch, setTSearch] = useState("");
  const [selectedFashion, setSelectedFashion] = useState<FashionCard | null>(null);
  const { troubles, fashionCards } = useData();

  // Hash-based deep linking for fashion detail stories (#fashion/fash-1 or #fashion/article-slug)
  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith("#fashion/")) {
        const idOrSlug = decodeURIComponent(hash.replace("#fashion/", "")).trim().toLowerCase();
        const found = fashionCards.find((c) => {
          const cId = (c.id || "").toLowerCase();
          const cSlug = c.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          return cId === idOrSlug || cSlug === idOrSlug || c.title.toLowerCase() === idOrSlug;
        });
        if (found) {
          setSelectedFashion(found);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } else if (selectedFashion && !hash.startsWith("#fashion/")) {
        setSelectedFashion(null);
      }
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    window.addEventListener("popstate", syncFromHash);
    return () => {
      window.removeEventListener("hashchange", syncFromHash);
      window.removeEventListener("popstate", syncFromHash);
    };
  }, [fashionCards, selectedFashion]);

  const handleSelectFashion = (card: FashionCard) => {
    setSelectedFashion(card);
    const slug = card.id || card.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    window.location.hash = `#fashion/${encodeURIComponent(slug)}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackFromFashion = () => {
    setSelectedFashion(null);
    window.location.hash = "#fashion";
    setTimeout(() => {
      const el = document.getElementById("fashion");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 60);
  };

  const catData = useMemo(() => CATEGORIES.find((c) => c.name === catOpen), [catOpen]);
  const troublesFiltered = useMemo(
    () => troubles.filter((t) => (t.title + t.tag + t.problem).toLowerCase().includes(tSearch.toLowerCase())),
    [troubles, tSearch]
  );

  // If a fashion story is currently selected, render the dedicated Fashion Article Detail Page
  if (selectedFashion) {
    return (
      <div className="min-h-screen bg-[#f5f7fb]">
        <Analytics />
        <FashionDetailPage
          card={selectedFashion}
          allCards={fashionCards}
          onBack={handleBackFromFashion}
          onSelectFashion={handleSelectFashion}
        />
        <Footer />
        <AdminLoginModal />
        <AdminPanel />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <Analytics />
      <Navbar />
      <main>
        <Hero />
        <ProcessSection />
        <TroubleshootingSection onOpenAll={() => setShowAllTroubles(true)} />
        <FashionSection onSelectFashion={handleSelectFashion} />
        <SustainabilitySection />
        <CategoriesSection onOpen={setCatOpen} />
        <InsightsSection />
        <DictionarySection />
        <GallerySection />
        <AboutSection />
        <FacebookSection />
        <ContactSection />
      </main>
      <Footer />

      {/* Admin Modals */}
      <AdminLoginModal />
      <AdminPanel />

      {/* All troubleshooting modal */}
      <Modal open={showAllTroubles} onClose={() => setShowAllTroubles(false)} wide>
        <div className="p-5 sm:p-9">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#0a1633] px-3.5 py-1.5 font-mono2 text-[10.5px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-amber-300">
            <Wrench size={13} /> Complete library · {troubles.length} cases
          </span>
          <h3 className="font-display mt-3 text-xl sm:text-3xl font-extrabold text-[#0a1633]">All Troubleshooting Cases</h3>
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate-500">Problem → Possible Cause → Solution for every common denim defect.</p>
          <div className="mt-4 sm:mt-5 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 pl-3.5 sm:pl-4">
            <Search size={17} className="text-slate-400 shrink-0" />
            <input
              value={tSearch}
              onChange={(e) => setTSearch(e.target.value)}
              placeholder="Filter — skew, GSM, crocking…"
              className="w-full bg-transparent py-2 text-sm font-medium text-[#0a1633] placeholder:text-slate-400 focus:outline-none"
              aria-label="Filter troubleshooting"
            />
            {tSearch && (
              <button onClick={() => setTSearch("")} className="rounded-lg bg-white px-3 py-1.5 min-h-[36px] text-xs font-bold text-slate-500 ring-1 ring-slate-200 transition active:scale-95">Clear</button>
            )}
          </div>
          <div className="mt-5 space-y-3">
            {troublesFiltered.map((t) => (
              <details key={t.id || t.title} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white open:border-indigo-300 open:shadow-lg">
                <summary className="flex cursor-pointer list-none items-center gap-2.5 sm:gap-3 p-3.5 sm:p-4 [&::-webkit-details-marker]:hidden transition active:bg-slate-50">
                  <span className="rounded-full bg-indigo-50 px-2.5 py-1 font-mono2 text-[10px] font-bold uppercase tracking-widest text-indigo-700 shrink-0">{t.tag}</span>
                  <span className="font-display flex-1 text-[14px] sm:text-[15px] font-bold text-[#0a1633]">{t.title}</span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-lg font-bold text-slate-500 transition group-open:rotate-45 group-open:bg-[#0a1633] group-open:text-white">+</span>
                </summary>
                <div className="space-y-3 border-t border-slate-100 bg-slate-50/60 p-4">
                  <p className="text-[13.5px] leading-relaxed text-slate-600"><span className="font-bold text-rose-600">Problem: </span>{t.problem}</p>
                  <div>
                    <p className="text-[12px] font-bold uppercase tracking-widest text-amber-600">Causes</p>
                    <ul className="mt-1 space-y-1">{t.causes.map((c, i) => <li key={i} className="text-[13.5px] text-slate-600">▸ {c}</li>)}</ul>
                  </div>
                  <div>
                    <p className="text-[12px] font-bold uppercase tracking-widest text-emerald-600">Solutions</p>
                    <ul className="mt-1 space-y-1">{t.solutions.map((c, i) => <li key={i} className="flex gap-1.5 text-[13.5px] text-slate-600"><CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-600" />{c}</li>)}</ul>
                  </div>
                </div>
              </details>
            ))}
            {troublesFiltered.length === 0 && (
              <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">No cases match “{tSearch}”.</p>
            )}
          </div>
        </div>
      </Modal>

      {/* Category library modal */}
      <Modal open={!!catOpen} onClose={() => setCatOpen(null)}>
        {catData && (
          <div className="p-5 sm:p-9">
            <div className={`rounded-3xl bg-gradient-to-br ${catData.color} p-5 sm:p-6 text-white`}>
              <div>
                <p className="font-mono2 text-[10.5px] sm:text-[11px] font-bold uppercase tracking-[0.22em] text-white/70">{catData.count} · Denim Universe Library</p>
                <h3 className="font-display mt-1 text-2xl sm:text-3xl font-extrabold">{catData.name}</h3>
                <p className="mt-2 max-w-md text-[13.5px] sm:text-[14px] leading-relaxed text-white/85">{catData.desc}</p>
              </div>
            </div>
            <p className="font-display mt-6 text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.18em] text-slate-400">Inside this library</p>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {catData.topics.map((t) => (
                <a key={t} href="#insights" onClick={() => setCatOpen(null)} className="group flex min-h-[46px] items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13.5px] sm:text-[14px] font-bold text-[#0a1633] transition active:scale-95 hover:border-indigo-300 hover:bg-indigo-50">
                  {t}
                  <ArrowRight size={15} className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-600" />
                </a>
              ))}
            </div>
            <Reveal className="mt-6">
              <div className="rounded-2xl bg-[#0a1633] p-5 text-center">
                <p className="text-sm font-semibold text-white">Full {catData.name} guides drop weekly in Denim Insights.</p>
                <a href="#insights" onClick={() => setCatOpen(null)} className="mt-3 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-bold text-[#0a1633] transition active:scale-95 hover:bg-amber-300">Browse articles <ArrowRight size={15} /></a>
              </div>
            </Reveal>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default function App() {
  return (
    <DataProvider>
      <MainApp />
    </DataProvider>
  );
}
