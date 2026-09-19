import React, { useState } from "react";
import {
  LayoutDashboard,
  Wrench,
  Shirt,
  BookOpen,
  Image as ImageIcon,
  Settings,
  LogOut,
  ExternalLink,
  ChevronRight,
  Menu,
  X,
  Shield,
} from "lucide-react";
import { useData } from "../../context/DataContext";
import logoImg from "../../assets/logo.png";
import AdminOverview from "./AdminOverview";
import TroubleManager from "./TroubleManager";
import FashionManager from "./FashionManager";
import DictionaryManager from "./DictionaryManager";
import GalleryManager from "./GalleryManager";
import ContactManager from "./ContactManager";

type TabId = "overview" | "troubles" | "fashion" | "dictionary" | "gallery" | "contact";

export default function AdminPanel() {
  const { isAdminOpen, setIsAdminOpen, logout, closeAdmin, siteConfig, troubles, fashionCards, dictionary, gallery } = useData();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  if (!isAdminOpen) return null;

  const tabs: { id: TabId; label: string; icon: React.ComponentType<{ size?: number; className?: string }>; count?: number }[] = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "troubles", label: "Troubleshooting", icon: Wrench, count: troubles.length },
    { id: "fashion", label: "Fashion & Trends", icon: Shirt, count: fashionCards.length },
    { id: "dictionary", label: "Dictionary", icon: BookOpen, count: dictionary.length },
    { id: "gallery", label: "Media Gallery", icon: ImageIcon, count: gallery.length },
    { id: "contact", label: "Contact & Settings", icon: Settings },
  ];

  return (
    <div className="fixed inset-0 z-[90] flex flex-col bg-[#060d22] text-white">
      {/* Top Admin Navigation Bar */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-[#0a1633] px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white md:hidden"
            aria-label="Toggle admin menu"
          >
            {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex items-center gap-3">
            <img
              src={logoImg}
              alt="Denim Universe"
              className="h-10 w-10 rounded-full object-cover ring-2 ring-amber-400/40"
            />
            <div className="leading-tight">
              <span className="font-display flex items-center gap-1.5 text-base font-black tracking-tight text-white">
                {siteConfig.brand}
                <span className="rounded bg-amber-400/20 px-1.5 py-0.2 font-mono2 text-[10px] font-bold text-amber-300">
                  ADMIN
                </span>
              </span>
              <span className="text-[11px] text-indigo-200/60 hidden sm:block">
                Content Management System
              </span>
            </div>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={closeAdmin}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-bold text-indigo-100 transition hover:bg-white/15 hover:text-white"
          >
            <ExternalLink size={14} />
            <span className="hidden sm:inline">View Website</span>
          </button>

          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs font-bold text-rose-300 transition hover:bg-rose-500/20"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for Desktop */}
        <aside className="hidden w-64 shrink-0 flex-col justify-between border-r border-white/10 bg-[#071026] p-4 md:flex">
          <div className="space-y-1">
            <p className="px-3 pb-2 font-mono2 text-[10px] font-bold uppercase tracking-wider text-indigo-300/50">
              Navigation Menu
            </p>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-xs font-bold transition ${
                    active
                      ? "bg-gradient-to-r from-amber-400 to-amber-500 text-[#0a1633] shadow-lg shadow-amber-500/20"
                      : "text-indigo-200/80 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={17} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.count !== undefined && (
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[10px] font-mono2 font-bold ${
                        active ? "bg-[#0a1633] text-amber-300" : "bg-white/10 text-white/70"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 text-center">
            <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-emerald-400">
              <Shield size={13} /> Session Authenticated
            </div>
            <p className="mt-1 text-[10px] text-indigo-300/50">Protected Admin Session</p>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileNavOpen && (
          <div className="fixed inset-x-0 bottom-0 top-16 z-50 flex bg-[#071026] p-4 md:hidden">
            <div className="w-full space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileNavOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-sm font-bold transition ${
                      active
                        ? "bg-amber-400 text-[#0a1633]"
                        : "text-indigo-100 hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} />
                      <span>{tab.label}</span>
                    </div>
                    {tab.count !== undefined && (
                      <span className="rounded bg-white/10 px-2 py-0.5 text-xs font-mono2">
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab Content Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#060d22]">
          <div className="mx-auto max-w-6xl">
            {activeTab === "overview" && <AdminOverview onSelectTab={(t) => setActiveTab(t as TabId)} />}
            {activeTab === "troubles" && <TroubleManager />}
            {activeTab === "fashion" && <FashionManager />}
            {activeTab === "dictionary" && <DictionaryManager />}
            {activeTab === "gallery" && <GalleryManager />}
            {activeTab === "contact" && <ContactManager />}
          </div>
        </main>
      </div>
    </div>
  );
}