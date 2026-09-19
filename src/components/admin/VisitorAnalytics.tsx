import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Users,
  Eye,
  Smartphone,
  Monitor,
  Tablet,
  TrendingUp,
  Clock,
  ExternalLink,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Activity,
  Globe,
} from "lucide-react";
import { getVisitorStats, resetVisitorStats } from "../../lib/analyticsTracker";
import { VisitorStats } from "../../types/analytics";
import { useData } from "../../context/DataContext";

function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 45) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function VisitorAnalytics() {
  const { siteConfig } = useData();
  const [stats, setStats] = useState<VisitorStats>(getVisitorStats());
  const [lastRefreshed, setLastRefreshed] = useState<string>("Just now");

  const refreshData = () => {
    setStats(getVisitorStats());
    setLastRefreshed(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
  };

  useEffect(() => {
    // Listen to real-time custom event triggered on every pageview/section click
    const handleUpdate = (e: Event) => {
      const custom = e as CustomEvent<VisitorStats>;
      if (custom.detail) {
        setStats(custom.detail);
      } else {
        refreshData();
      }
    };

    window.addEventListener("du_analytics_updated", handleUpdate);
    return () => window.removeEventListener("du_analytics_updated", handleUpdate);
  }, []);

  const totalDevices = (stats.devices.mobile || 0) + (stats.devices.desktop || 0) + (stats.devices.tablet || 0) || 1;
  const mobilePct = Math.round(((stats.devices.mobile || 0) / totalDevices) * 100);
  const desktopPct = Math.round(((stats.devices.desktop || 0) / totalDevices) * 100);
  const tabletPct = 100 - mobilePct - desktopPct;

  // Sort top sections by view count
  const sortedSections = Object.entries(stats.topSections || {}).sort((a, b) => b[1] - a[1]);
  const maxSectionViews = sortedSections[0]?.[1] || 1;

  const activeGaId = siteConfig.gaId || "G-XEYN7P0ZQM";

  return (
    <div className="space-y-6">
      {/* Top Title & Quick Link Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-2xl font-black text-white">Visitor & Reader Analytics</h2>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Live Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-indigo-200/70">
            Real-time reader tracking, top visited content, device breakdown, and traffic metrics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={refreshData}
            className="flex min-h-[40px] items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-white transition active:scale-95 hover:bg-white/15"
            title="Refresh analytics numbers"
          >
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>

          <a
            href="https://analytics.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[40px] items-center gap-1.5 rounded-xl border border-amber-400/40 bg-amber-400/10 px-3.5 py-2 text-xs font-bold text-amber-300 transition active:scale-95 hover:bg-amber-400/20"
          >
            <Globe size={14} />
            <span>Google Analytics Console</span>
            <ExternalLink size={12} />
          </a>

          <a
            href="https://vercel.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[40px] items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-bold text-indigo-200 transition active:scale-95 hover:bg-white/15"
          >
            <span>Vercel Analytics</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* 4 Main KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Pageviews */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur transition hover:border-amber-400/40">
          <div className="flex items-center justify-between">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-700 text-white shadow-md">
              <Eye size={20} />
            </span>
            <span className="font-mono2 text-[10.5px] font-bold uppercase tracking-wider text-indigo-300/80">
              Impressions
            </span>
          </div>
          <div className="mt-4">
            <p className="font-display text-3xl font-black text-white">{stats.totalPageviews.toLocaleString()}</p>
            <h3 className="font-display mt-1 text-xs font-bold text-indigo-100">Total Pageviews</h3>
            <p className="mt-1 text-[11px] text-indigo-200/60">Across all site sections & articles</p>
          </div>
        </div>

        {/* Unique Visitors */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur transition hover:border-amber-400/40">
          <div className="flex items-center justify-between">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-700 text-white shadow-md">
              <Users size={20} />
            </span>
            <span className="font-mono2 text-[10.5px] font-bold uppercase tracking-wider text-purple-300/80">
              Unique Readers
            </span>
          </div>
          <div className="mt-4">
            <p className="font-display text-3xl font-black text-white">{stats.uniqueVisitors.toLocaleString()}</p>
            <h3 className="font-display mt-1 text-xs font-bold text-indigo-100">Unique Visitors</h3>
            <p className="mt-1 text-[11px] text-indigo-200/60">Distinct verified devices</p>
          </div>
        </div>

        {/* Today's Views */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur transition hover:border-amber-400/40">
          <div className="flex items-center justify-between">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-md">
              <TrendingUp size={20} />
            </span>
            <span className="font-mono2 text-[10.5px] font-bold uppercase tracking-wider text-emerald-300/80">
              Today
            </span>
          </div>
          <div className="mt-4">
            <p className="font-display text-3xl font-black text-emerald-300">+{stats.todayViews.toLocaleString()}</p>
            <h3 className="font-display mt-1 text-xs font-bold text-indigo-100">Views Today</h3>
            <p className="mt-1 text-[11px] text-indigo-200/60">Updated continuously in real-time</p>
          </div>
        </div>

        {/* Device Dominance */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur transition hover:border-amber-400/40">
          <div className="flex items-center justify-between">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-700 text-white shadow-md">
              <Smartphone size={20} />
            </span>
            <span className="font-mono2 text-[10.5px] font-bold uppercase tracking-wider text-amber-300/80">
              Platform
            </span>
          </div>
          <div className="mt-4">
            <p className="font-display text-3xl font-black text-amber-300">{mobilePct}%</p>
            <h3 className="font-display mt-1 text-xs font-bold text-indigo-100">Mobile Traffic</h3>
            <p className="mt-1 text-[11px] text-indigo-200/60">
              {desktopPct}% Desktop · {tabletPct > 0 ? `${tabletPct}% Tablet` : "Touch-first"}
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Top Visited Sections & Device Distribution */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Top Visited Sections (2 Columns) */}
        <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-6 backdrop-blur">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display text-base font-extrabold text-white flex items-center gap-2">
                <BarChart3 size={18} className="text-amber-400" />
                <span>Most Visited Topics & Content</span>
              </h3>
              <p className="text-xs text-indigo-200/60">Ranked by reader engagement and section views</p>
            </div>
          </div>

          <div className="space-y-4">
            {sortedSections.map(([section, count], idx) => {
              const pct = Math.round((count / maxSectionViews) * 100);
              return (
                <div key={section} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-indigo-100 flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-white/10 text-[10px] font-mono2 font-bold text-amber-300">
                        {idx + 1}
                      </span>
                      <span>{section}</span>
                    </span>
                    <span className="font-mono2 text-amber-300 font-bold">{count} views</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 to-indigo-500 transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Device & Browser Breakdown */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-6 backdrop-blur flex flex-col justify-between">
          <div>
            <h3 className="font-display text-base font-extrabold text-white flex items-center gap-2 mb-1">
              <Smartphone size={18} className="text-indigo-400" />
              <span>Devices & Platforms</span>
            </h3>
            <p className="text-xs text-indigo-200/60 mb-5">Hardware used by your readers</p>

            <div className="space-y-4">
              {/* Mobile */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
                <div className="flex items-center justify-between text-xs font-bold text-white mb-2">
                  <span className="flex items-center gap-2">
                    <Smartphone size={16} className="text-amber-400" />
                    <span>Mobile Phones</span>
                  </span>
                  <span className="font-mono2 text-amber-300">{stats.devices.mobile} ({mobilePct}%)</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${mobilePct}%` }} />
                </div>
              </div>

              {/* Desktop */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
                <div className="flex items-center justify-between text-xs font-bold text-white mb-2">
                  <span className="flex items-center gap-2">
                    <Monitor size={16} className="text-indigo-400" />
                    <span>Desktop / Laptops</span>
                  </span>
                  <span className="font-mono2 text-indigo-300">{stats.devices.desktop} ({desktopPct}%)</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${desktopPct}%` }} />
                </div>
              </div>

              {/* Tablets */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
                <div className="flex items-center justify-between text-xs font-bold text-white mb-2">
                  <span className="flex items-center gap-2">
                    <Tablet size={16} className="text-teal-400" />
                    <span>Tablets & iPads</span>
                  </span>
                  <span className="font-mono2 text-teal-300">{stats.devices.tablet || 0} ({tabletPct}%)</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-teal-400 rounded-full" style={{ width: `${Math.max(2, tabletPct)}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Active Tag Box */}
          <div className="mt-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-200">
            <div className="flex items-center gap-2 font-bold text-emerald-300">
              <CheckCircle2 size={15} />
              <span>GA4 Measurement ID Linked</span>
            </div>
            <p className="mt-1 font-mono2 text-[11px] text-emerald-100/80">{activeGaId}</p>
          </div>
        </div>
      </div>

      {/* Live Recent Activity Log */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-6 backdrop-blur">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display text-base font-extrabold text-white flex items-center gap-2">
              <Activity size={18} className="text-emerald-400" />
              <span>Live Reader Activity Stream</span>
            </h3>
            <p className="text-xs text-indigo-200/60">Timestamped reader interactions and navigation</p>
          </div>
          <span className="text-[11px] text-indigo-200/50">Auto-updated</span>
        </div>

        <div className="divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
          {stats.recentActivity && stats.recentActivity.length > 0 ? (
            stats.recentActivity.slice(0, 10).map((act) => (
              <div key={act.id} className="flex items-center justify-between p-3.5 sm:px-4 text-xs transition hover:bg-white/5">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/10 text-indigo-300">
                    {act.device === "Mobile" ? <Smartphone size={14} /> : <Monitor size={14} />}
                  </span>
                  <div className="min-w-0">
                    <p className="font-bold text-white truncate">{act.label}</p>
                    <p className="text-[11px] text-indigo-200/60 truncate font-mono2">{act.path}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-3 text-right">
                  <span className="hidden sm:inline-flex rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-200">
                    {act.browser} · {act.device}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                    <Clock size={11} /> {formatTimeAgo(act.timestamp)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="p-6 text-center text-xs text-indigo-200/50">No recent visitor activity recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
