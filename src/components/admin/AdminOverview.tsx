import React, { useEffect, useState } from "react";
import {
  Wrench,
  Shirt,
  BookOpen,
  Image as ImageIcon,
  Database,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Server,
  Cloud,
  ExternalLink,
  BarChart3,
  Users,
  TrendingUp,
} from "lucide-react";
import { useData } from "../../context/DataContext";
import { testSupabaseConnection } from "../../lib/supabase";
import { getVisitorStats } from "../../lib/analyticsTracker";
import { VisitorStats } from "../../types/analytics";

interface AdminOverviewProps {
  onSelectTab: (tab: string) => void;
}

export default function AdminOverview({ onSelectTab }: AdminOverviewProps) {
  const { troubles, fashionCards, dictionary, gallery, siteConfig, isCloudConnected, cloudHost } = useData();
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [stats, setStats] = useState<VisitorStats>(getVisitorStats());

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const custom = e as CustomEvent<VisitorStats>;
      if (custom.detail) setStats(custom.detail);
      else setStats(getVisitorStats());
    };
    window.addEventListener("du_analytics_updated", handleUpdate);
    return () => window.removeEventListener("du_analytics_updated", handleUpdate);
  }, []);

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await testSupabaseConnection();
      setTestResult(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setTestResult({ success: false, message: `Unexpected error: ${msg}` });
    } finally {
      setTesting(false);
    }
  };

  const cards = [
    {
      id: "troubles",
      title: "Troubleshooting Library",
      count: troubles.length,
      desc: "Defect cases, root causes & solutions",
      icon: Wrench,
      color: "from-rose-500 to-red-700",
      pill: "Active Cases",
    },
    {
      id: "fashion",
      title: "Fashion & Trends",
      count: fashionCards.length,
      desc: "Runway trends, washes & fits",
      icon: Shirt,
      color: "from-fuchsia-500 to-purple-700",
      pill: "Published Posts",
    },
    {
      id: "dictionary",
      title: "Denim Glossary",
      count: dictionary.length,
      desc: "Textile terms, acronyms & definitions",
      icon: BookOpen,
      color: "from-blue-500 to-indigo-700",
      pill: "Defined Words",
    },
    {
      id: "gallery",
      title: "Photo & Media Gallery",
      count: gallery.length,
      desc: "Mill machinery, textures & details",
      icon: ImageIcon,
      color: "from-teal-500 to-emerald-700",
      pill: "Visual Assets",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-r from-[#0d1f4d] via-[#132d6b] to-[#0a1633] p-6 sm:p-8">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-300">
            <ShieldCheck size={14} /> Administrator Mode Active
          </div>
          <h2 className="font-display mt-3 text-2xl font-black text-white sm:text-3xl">
            Welcome to {siteConfig.brand} Command Center
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-indigo-100/80">
            Easily update defect troubleshooting solutions, publish trend articles, define glossary terms, upload gallery visuals, and refine site contacts.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs">
            {isCloudConnected ? (
              <span className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/20 px-3 py-1.5 font-semibold text-emerald-300">
                <Cloud size={13} /> Cloud: {cloudHost}
              </span>
            ) : (
              <span className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/20 px-3 py-1.5 font-semibold text-amber-300">
                <Database size={13} /> Storage: Local Fallback Mode
              </span>
            )}
            <span className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 font-semibold text-white/90">
              <Sparkles size={13} className="text-amber-400" /> Real-Time Reactive Sync
            </span>
          </div>
        </div>
      </div>

      {/* Live Visitor Traffic Snapshot */}
      <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-[#0a1633] to-indigo-950/30 p-5 sm:p-6 backdrop-blur">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400 text-[#0a1633] shadow-md shadow-amber-400/20">
              <BarChart3 size={18} />
            </span>
            <div>
              <h3 className="font-display text-base font-extrabold text-white flex items-center gap-2">
                <span>Live Reader & Visitor Pulse</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
                </span>
              </h3>
              <p className="text-xs text-indigo-200/60">Real-time visitor interactions tracked directly on your site</p>
            </div>
          </div>
          <button
            onClick={() => onSelectTab("analytics")}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition"
          >
            <span>Full Analytics Dashboard</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
            <span className="font-mono2 text-[10px] font-bold uppercase tracking-wider text-indigo-300/70">Total Pageviews</span>
            <p className="font-display text-2xl font-black text-white mt-1">{stats.totalPageviews.toLocaleString()}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
            <span className="font-mono2 text-[10px] font-bold uppercase tracking-wider text-indigo-300/70">Unique Visitors</span>
            <p className="font-display text-2xl font-black text-white mt-1">{stats.uniqueVisitors.toLocaleString()}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
            <span className="font-mono2 text-[10px] font-bold uppercase tracking-wider text-emerald-400/80">Today's Views</span>
            <p className="font-display text-2xl font-black text-emerald-300 mt-1">+{stats.todayViews.toLocaleString()}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
            <span className="font-mono2 text-[10px] font-bold uppercase tracking-wider text-amber-400/80">Mobile Share</span>
            <p className="font-display text-2xl font-black text-amber-300 mt-1">
              {Math.round(((stats.devices.mobile || 0) / (((stats.devices.mobile || 0) + (stats.devices.desktop || 0) + (stats.devices.tablet || 0)) || 1)) * 100)}%
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.id}
            onClick={() => onSelectTab(c.id)}
            className="group cursor-pointer rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur transition hover:-translate-y-1 hover:border-amber-400/40 hover:bg-white/[0.08]"
          >
            <div className="flex items-center justify-between">
              <span className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${c.color} text-white shadow-lg`}>
                <c.icon size={22} />
              </span>
              <span className="font-mono2 text-[10px] font-bold uppercase tracking-wider text-indigo-300/70">
                {c.pill}
              </span>
            </div>
            <div className="mt-4">
              <p className="font-display text-3xl font-black text-white">{c.count}</p>
              <h3 className="font-display mt-1 text-sm font-bold text-indigo-100">{c.title}</h3>
              <p className="mt-1 text-xs text-indigo-200/60 line-clamp-1">{c.desc}</p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-amber-400 opacity-100 sm:opacity-0 transition sm:group-hover:opacity-100">
              Manage items <ArrowRight size={13} />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Info & Cloud Status Grid */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Site Meta */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-6 backdrop-blur">
          <h3 className="font-display flex items-center justify-between text-base font-bold text-white">
            <span>Site Meta & Contact Snapshot</span>
            <button
              onClick={() => onSelectTab("contact")}
              className="text-xs font-semibold text-amber-400 hover:underline"
            >
              Edit in Settings →
            </button>
          </h3>
          <div className="mt-4 space-y-2 text-xs text-indigo-100/80">
            <p><span className="text-indigo-300/60">Brand:</span> <span className="font-semibold text-white">{siteConfig.brand}</span></p>
            <p><span className="text-indigo-300/60">Tagline:</span> {siteConfig.tagline}</p>
            <p><span className="text-indigo-300/60">Contact Email:</span> {siteConfig.email}</p>
            <p><span className="text-indigo-300/60">Facebook:</span> <span className="truncate block max-w-xs">{siteConfig.facebookUrl}</span></p>
            <p><span className="text-indigo-300/60">Location:</span> {siteConfig.location}</p>
          </div>
        </div>

        {/* Supabase Cloud Connection Box */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-6 backdrop-blur">
          <div className="flex items-center justify-between">
            <h3 className="font-display flex items-center gap-2 text-base font-bold text-white">
              <Server size={18} className="text-amber-400" />
              <span>Supabase Cloud Integration</span>
            </h3>
            {isCloudConnected ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Connected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-2.5 py-0.5 text-[11px] font-bold text-amber-300">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> Local Mode
              </span>
            )}
          </div>

          <p className="mt-3 text-xs leading-relaxed text-indigo-200/75">
            {isCloudConnected
              ? `Connected to Supabase project at ${cloudHost}. All changes are synced to PostgreSQL and images are saved to the denim-media bucket.`
              : "Running in offline-safe Local Storage mode. Add your Supabase project keys to .env (for local) or Vercel environment variables (for online) to sync data to the cloud."}
          </p>

          {/* Diagnostic Test Button */}
          <div className="mt-4 flex flex-wrap items-center gap-2.5 sm:gap-3">
            <button
              onClick={handleTestConnection}
              disabled={testing}
              className="inline-flex min-h-[38px] items-center gap-2 rounded-xl bg-amber-400 px-4 py-2 text-xs font-bold text-[#0a1633] transition active:scale-95 hover:bg-amber-300 disabled:opacity-50"
            >
              <RefreshCw size={13} className={testing ? "animate-spin" : ""} />
              {testing ? "Testing Connection..." : "Test Supabase Connection"}
            </button>
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold text-white transition active:scale-95 hover:bg-white/10"
            >
              <span>Supabase Dashboard</span>
              <ExternalLink size={12} />
            </a>
          </div>

          {/* Test feedback */}
          {testResult && (
            <div
              className={`mt-4 flex items-start gap-2.5 rounded-2xl p-3 text-xs ${
                testResult.success
                  ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                  : "border border-rose-500/30 bg-rose-500/10 text-rose-200"
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 size={16} className="shrink-0 text-emerald-400 mt-0.5" />
              ) : (
                <AlertCircle size={16} className="shrink-0 text-rose-400 mt-0.5" />
              )}
              <div>
                <p className="font-bold">{testResult.success ? "Connection Verified" : "Connection Notice"}</p>
                <p className="mt-0.5 leading-relaxed">{testResult.message}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}