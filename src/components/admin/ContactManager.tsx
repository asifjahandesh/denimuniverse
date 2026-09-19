import React, { useState, useEffect } from "react";
import {
  Save,
  Check,
  RefreshCw,
  Mail,
  MessageCircle,
  MapPin,
  Facebook,
  Globe,
  BarChart3,
  ExternalLink,
  Users,
  Inbox,
  Copy,
  Trash2,
  Plus,
  Download,
  Search,
  CheckCircle2,
  Clock,
  Send,
  MessageSquare,
} from "lucide-react";
import { useData } from "../../context/DataContext";
import { isSupabaseConfigured, fetchRemoteSubscribers, fetchRemoteMessages } from "../../lib/supabase";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  createdAt?: string;
  created_at?: string;
}

export default function ContactManager() {
  const { siteConfig, updateSiteConfig, resetToDefaults } = useData();

  // Settings form state
  const [brand, setBrand] = useState(siteConfig.brand);
  const [tagline, setTagline] = useState(siteConfig.tagline);
  const [email, setEmail] = useState(siteConfig.email);
  const [whatsapp, setWhatsapp] = useState(siteConfig.whatsapp);
  const [location, setLocation] = useState(siteConfig.location);
  const [facebookUrl, setFacebookUrl] = useState(siteConfig.facebookUrl);
  const [gaId, setGaId] = useState(siteConfig.gaId || "G-XEYN7P0ZQM");
  const [saved, setSaved] = useState(false);

  // Tab state: "settings" | "subscribers" | "messages"
  const [subTab, setSubTab] = useState<"settings" | "subscribers" | "messages">("settings");

  // Subscribers state
  const [subscribers, setSubscribers] = useState<string[]>([]);
  const [subscriberSearch, setSubscriberSearch] = useState("");
  const [newSubscriberEmail, setNewSubscriberEmail] = useState("");
  const [copiedMode, setCopiedMode] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [syncingSubscribers, setSyncingSubscribers] = useState(false);

  // Contact messages state
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [messageSearch, setMessageSearch] = useState("");
  const [syncingMessages, setSyncingMessages] = useState(false);

  // Load subscribers & messages from localStorage on mount
  useEffect(() => {
    loadLocalSubscribers();
    loadLocalMessages();
  }, []);

  const loadLocalSubscribers = () => {
    try {
      const raw = localStorage.getItem("du_subscribers_v1");
      const list: string[] = raw ? JSON.parse(raw) : [];
      setSubscribers(list);
    } catch (e) {
      console.warn("Could not parse local subscribers", e);
    }
  };

  const loadLocalMessages = () => {
    try {
      const raw = localStorage.getItem("du_messages_v1");
      const list: ContactMessage[] = raw ? JSON.parse(raw) : [];
      setMessages(list);
    } catch (e) {
      console.warn("Could not parse local messages", e);
    }
  };

  // Sync subscribers with Supabase
  const handleSyncSubscribers = async () => {
    setSyncingSubscribers(true);
    try {
      if (isSupabaseConfigured()) {
        const remote = await fetchRemoteSubscribers();
        if (remote && remote.length > 0) {
          const merged = Array.from(new Set([...subscribers, ...remote]));
          localStorage.setItem("du_subscribers_v1", JSON.stringify(merged));
          setSubscribers(merged);
        }
      }
    } finally {
      setSyncingSubscribers(false);
    }
  };

  // Sync messages with Supabase
  const handleSyncMessages = async () => {
    setSyncingMessages(true);
    try {
      if (isSupabaseConfigured()) {
        const remote = await fetchRemoteMessages();
        if (remote && remote.length > 0) {
          const map = new Map<string, ContactMessage>();
          messages.forEach((m) => map.set(m.id || m.email + m.message, m));
          remote.forEach((m) => map.set(m.id || m.email + m.message, m));
          const merged = Array.from(map.values());
          localStorage.setItem("du_messages_v1", JSON.stringify(merged));
          setMessages(merged);
        }
      }
    } finally {
      setSyncingMessages(false);
    }
  };

  // Add manual subscriber
  const handleAddSubscriber = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newSubscriberEmail.trim().toLowerCase();
    if (!clean || !clean.includes("@")) return;

    if (!subscribers.includes(clean)) {
      const updated = [clean, ...subscribers];
      localStorage.setItem("du_subscribers_v1", JSON.stringify(updated));
      setSubscribers(updated);
    }
    setNewSubscriberEmail("");
  };

  // Delete subscriber
  const handleDeleteSubscriber = (emailToDelete: string) => {
    if (window.confirm(`Remove ${emailToDelete} from subscribers list?`)) {
      const updated = subscribers.filter((e) => e !== emailToDelete);
      localStorage.setItem("du_subscribers_v1", JSON.stringify(updated));
      setSubscribers(updated);
    }
  };

  // Copy subscribers list
  const copySubscribers = (format: "comma" | "newline") => {
    const text = format === "comma" ? subscribers.join(", ") : subscribers.join("\n");
    navigator.clipboard.writeText(text);
    setCopiedMode(format);
    setTimeout(() => setCopiedMode(null), 2500);
  };

  // Copy single email
  const copySingleEmail = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEmail(text);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  // Export subscribers CSV
  const exportSubscribersCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," + ["Email", ...subscribers].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `denim-universe-subscribers-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Delete single message
  const handleDeleteMessage = (id: string) => {
    if (window.confirm("Delete this message?")) {
      const updated = messages.filter((m) => m.id !== id);
      localStorage.setItem("du_messages_v1", JSON.stringify(updated));
      setMessages(updated);
    }
  };

  // Clear all messages
  const handleClearAllMessages = () => {
    if (window.confirm("Clear all received contact messages? This cannot be undone.")) {
      localStorage.setItem("du_messages_v1", JSON.stringify([]));
      setMessages([]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteConfig({
      brand,
      tagline,
      email,
      whatsapp,
      location,
      facebookUrl,
      gaId,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    if (
      window.confirm(
        "⚠️ WARNING: This will reset all troubleshooting, fashion posts, dictionary terms, gallery images, and contact information back to their original factory defaults. Do you want to proceed?"
      )
    ) {
      resetToDefaults();
      alert("All content has been restored to defaults.");
      setBrand("Denim Universe");
      setTagline("Explore the World of Denim");
      setEmail("hello@denimuniverse.com");
      setWhatsapp("https://wa.me/8801000000000");
      setLocation("Dhaka · Bangladesh — serving the global denim community");
      setFacebookUrl("https://www.facebook.com/share/1EGKnnQXrP/?mibextid=wwXIfr");
      setGaId("");
    }
  };

  const filteredSubscribers = subscribers.filter((s) =>
    s.toLowerCase().includes(subscriberSearch.toLowerCase())
  );

  const filteredMessages = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(messageSearch.toLowerCase()) ||
      m.email.toLowerCase().includes(messageSearch.toLowerCase()) ||
      m.message.toLowerCase().includes(messageSearch.toLowerCase()) ||
      m.topic.toLowerCase().includes(messageSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-black text-white">Contact & Communications Hub</h2>
        <p className="text-sm text-indigo-200/70">
          Manage your public contact identity, newsletter subscribers, and received reader inquiries.
        </p>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
        <button
          type="button"
          onClick={() => setSubTab("settings")}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition active:scale-95 ${
            subTab === "settings"
              ? "bg-amber-400 text-[#0a1633] shadow-md shadow-amber-400/20"
              : "border border-white/10 bg-white/5 text-indigo-200/80 hover:bg-white/10 hover:text-white"
          }`}
        >
          <Globe size={15} /> Site & Brand Settings
        </button>

        <button
          type="button"
          onClick={() => setSubTab("subscribers")}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition active:scale-95 ${
            subTab === "subscribers"
              ? "bg-amber-400 text-[#0a1633] shadow-md shadow-amber-400/20"
              : "border border-white/10 bg-white/5 text-indigo-200/80 hover:bg-white/10 hover:text-white"
          }`}
        >
          <Users size={15} /> Newsletter Subscribers
          <span
            className={`rounded-full px-2 py-0.5 text-[10.5px] font-extrabold ${
              subTab === "subscribers" ? "bg-[#0a1633] text-amber-300" : "bg-white/15 text-white"
            }`}
          >
            {subscribers.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab("messages")}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition active:scale-95 ${
            subTab === "messages"
              ? "bg-amber-400 text-[#0a1633] shadow-md shadow-amber-400/20"
              : "border border-white/10 bg-white/5 text-indigo-200/80 hover:bg-white/10 hover:text-white"
          }`}
        >
          <Inbox size={15} /> Contact Inquiries
          <span
            className={`rounded-full px-2 py-0.5 text-[10.5px] font-extrabold ${
              subTab === "messages" ? "bg-[#0a1633] text-amber-300" : "bg-white/15 text-white"
            }`}
          >
            {messages.length}
          </span>
        </button>
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: NEWSLETTER SUBSCRIBERS */}
      {/* ==================================================================== */}
      {subTab === "subscribers" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur sm:p-7">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-display flex items-center gap-2 text-lg font-bold text-white">
                  <Users size={18} className="text-amber-400" />
                  Newsletter Subscribers
                </h3>
                <p className="mt-1 text-xs text-indigo-200/70">
                  Readers who subscribed via "Stay in the loop" to receive denim weekly lessons.
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => copySubscribers("comma")}
                  disabled={subscribers.length === 0}
                  className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-white transition active:scale-95 hover:bg-white/20 disabled:opacity-40"
                >
                  {copiedMode === "comma" ? (
                    <>
                      <Check size={13} className="text-emerald-400" /> Copied (Comma)!
                    </>
                  ) : (
                    <>
                      <Copy size={13} /> Copy All (BCC)
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={exportSubscribersCsv}
                  disabled={subscribers.length === 0}
                  className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-white transition active:scale-95 hover:bg-white/20 disabled:opacity-40"
                >
                  <Download size={13} /> Export CSV
                </button>

                {isSupabaseConfigured() && (
                  <button
                    type="button"
                    onClick={handleSyncSubscribers}
                    disabled={syncingSubscribers}
                    className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-xs font-bold text-amber-300 transition active:scale-95 hover:bg-amber-400/20 disabled:opacity-40"
                  >
                    <RefreshCw size={13} className={syncingSubscribers ? "animate-spin" : ""} /> Sync Cloud
                  </button>
                )}
              </div>
            </div>

            {/* Quick add manual subscriber */}
            <form onSubmit={handleAddSubscriber} className="mt-6 flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                value={newSubscriberEmail}
                onChange={(e) => setNewSubscriberEmail(e.target.value)}
                placeholder="Enter email to add (e.g. subscriber@mill.com)..."
                className="flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl bg-amber-400 px-5 py-2.5 font-display text-xs font-bold text-[#0a1633] transition active:scale-95 hover:bg-amber-300"
              >
                <Plus size={15} /> Add Subscriber
              </button>
            </form>

            {/* Search filter */}
            <div className="mt-4 relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-300/50" />
              <input
                type="text"
                value={subscriberSearch}
                onChange={(e) => setSubscriberSearch(e.target.value)}
                placeholder="Search subscribers..."
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2 text-xs text-white placeholder:text-indigo-200/40 focus:border-amber-400 focus:outline-none"
              />
            </div>

            {/* Subscribers list */}
            <div className="mt-5 space-y-2 max-h-[450px] overflow-y-auto pr-1">
              {filteredSubscribers.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-indigo-200/60">
                  <Mail size={32} className="mx-auto mb-2 text-indigo-300/40" />
                  <p className="font-semibold text-sm text-white">No subscribers found</p>
                  <p className="text-xs mt-1">
                    When visitors enter their email into the footer newsletter form, they will be saved here automatically.
                  </p>
                </div>
              ) : (
                filteredSubscribers.map((sub, idx) => (
                  <div
                    key={sub + idx}
                    className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 transition hover:bg-white/[0.08]"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-400/20 text-amber-300 font-mono2 text-xs font-bold">
                        {idx + 1}
                      </span>
                      <span className="font-mono2 text-xs sm:text-sm text-white truncate">{sub}</span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => copySingleEmail(sub)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-indigo-200 transition hover:bg-white/15 hover:text-white"
                        title="Copy email"
                      >
                        {copiedEmail === sub ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSubscriber(sub)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-300 transition hover:bg-rose-500/20 hover:text-rose-200"
                        title="Remove subscriber"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: CONTACT INQUIRIES & MESSAGES */}
      {/* ==================================================================== */}
      {subTab === "messages" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur sm:p-7">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-display flex items-center gap-2 text-lg font-bold text-white">
                  <Inbox size={18} className="text-amber-400" />
                  Contact Form Inquiries
                </h3>
                <p className="mt-1 text-xs text-indigo-200/70">
                  Questions, defect reports, and partnership inquiries submitted from the website.
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAllMessages}
                    className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-300 transition active:scale-95 hover:bg-rose-500/20"
                  >
                    <Trash2 size={13} /> Clear All
                  </button>
                )}

                {isSupabaseConfigured() && (
                  <button
                    type="button"
                    onClick={handleSyncMessages}
                    disabled={syncingMessages}
                    className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-xs font-bold text-amber-300 transition active:scale-95 hover:bg-amber-400/20 disabled:opacity-40"
                  >
                    <RefreshCw size={13} className={syncingMessages ? "animate-spin" : ""} /> Sync Cloud
                  </button>
                )}
              </div>
            </div>

            {/* Search filter */}
            <div className="mt-5 relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-300/50" />
              <input
                type="text"
                value={messageSearch}
                onChange={(e) => setMessageSearch(e.target.value)}
                placeholder="Search messages by name, email, topic, or keyword..."
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2 text-xs text-white placeholder:text-indigo-200/40 focus:border-amber-400 focus:outline-none"
              />
            </div>

            {/* Messages list */}
            <div className="mt-5 space-y-4 max-h-[550px] overflow-y-auto pr-1">
              {filteredMessages.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-indigo-200/60">
                  <MessageSquare size={32} className="mx-auto mb-2 text-indigo-300/40" />
                  <p className="font-semibold text-sm text-white">No inquiries found</p>
                  <p className="text-xs mt-1">
                    When visitors submit inquiries via the "Talk Denim With Us" form, they will appear here.
                  </p>
                </div>
              ) : (
                filteredMessages.map((msg) => {
                  const dateStr = msg.createdAt || msg.created_at;
                  const formattedDate = dateStr
                    ? new Date(dateStr).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Recent";

                  return (
                    <div
                      key={msg.id}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-amber-400/30 hover:bg-white/[0.05]"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-white/10 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-display font-bold text-white text-sm sm:text-base">
                              {msg.name}
                            </span>
                            <span className="rounded-full bg-amber-400/20 px-2 py-0.5 font-mono2 text-[10px] font-bold text-amber-300 border border-amber-400/30">
                              {msg.topic}
                            </span>
                          </div>
                          <a
                            href={`mailto:${msg.email}?subject=Re: Denim Universe Inquiry (${msg.topic})`}
                            className="font-mono2 text-xs text-indigo-300 hover:text-amber-300 hover:underline inline-block mt-0.5"
                          >
                            {msg.email}
                          </a>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 font-mono2 text-[11px] text-indigo-200/50">
                            <Clock size={12} /> {formattedDate}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-300 transition hover:bg-rose-500/20 hover:text-rose-200"
                            title="Delete message"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      <p className="mt-3.5 text-xs sm:text-sm leading-relaxed text-indigo-100/90 whitespace-pre-wrap bg-black/20 p-3.5 rounded-xl border border-white/5">
                        {msg.message}
                      </p>

                      <div className="mt-3.5 flex items-center justify-end gap-2">
                        <a
                          href={`mailto:${msg.email}?subject=Re: Denim Universe Inquiry (${msg.topic})`}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-amber-400 px-3 py-1.5 font-display text-xs font-bold text-[#0a1633] transition active:scale-95 hover:bg-amber-300"
                        >
                          <Send size={12} /> Reply via Email
                        </a>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: SITE & BRAND SETTINGS (ORIGINAL) */}
      {/* ==================================================================== */}
      {subTab === "settings" && (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Brand identity */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur sm:p-7">
            <h3 className="font-display flex items-center gap-2 text-lg font-bold text-white">
              <Globe size={18} className="text-amber-400" /> Brand Identity
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-indigo-200/70">
                  Site Brand Name
                </label>
                <input
                  required
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-indigo-200/70">
                  Brand Tagline
                </label>
                <input
                  required
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Contact details */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur sm:p-7">
            <h3 className="font-display flex items-center gap-2 text-lg font-bold text-white">
              <Mail size={18} className="text-amber-400" /> Public Communications
            </h3>
            <div className="mt-4 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-indigo-200/70">
                    Primary Contact Email
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-indigo-200/70">
                    WhatsApp / Phone Link
                  </label>
                  <input
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="https://wa.me/880..."
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-indigo-200/70">
                  Official Facebook Page URL
                </label>
                <input
                  required
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                  placeholder="https://www.facebook.com/..."
                  className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-indigo-200/70">
                  Physical / Operations Base Location
                </label>
                <input
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Analytics & Tracking */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur sm:p-7">
            <div className="flex items-center gap-2 pb-2">
              <BarChart3 size={18} className="text-amber-400" />
              <h3 className="font-display text-lg font-bold text-white">Analytics & Visitor Tracking</h3>
            </div>
            <p className="text-xs text-indigo-200/70">
              Track visitors, pageviews, and reader engagement across Denim Universe.
            </p>

            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-xs font-bold text-emerald-300">Vercel Web Analytics Active</p>
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-emerald-200/80">
                  Visitor counts, devices, geographical regions, and top pages are automatically recorded on your Vercel Project Dashboard with zero cookie banners.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between pb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-indigo-200/70">
                    Google Analytics 4 Measurement ID
                  </label>
                  {gaId.startsWith("G-") && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-500/20 px-2.5 py-0.5 text-[10.5px] font-bold text-emerald-300">
                      <Check size={12} /> Connected & Active
                    </span>
                  )}
                </div>
                <input
                  value={gaId}
                  onChange={(e) => setGaId(e.target.value)}
                  placeholder="G-XEYN7P0ZQM"
                  className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none font-mono2"
                />
                <div className="mt-1.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-[11px] text-indigo-200/60">
                  <span>Embedded directly into website head; tracking pageviews and user devices live.</span>
                  <a
                    href="https://analytics.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-amber-400 hover:underline inline-flex items-center gap-1 shrink-0"
                  >
                    <span>Open GA4 Console</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Save button */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <button
              type="submit"
              className="inline-flex min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-amber-400 px-7 py-3 font-display text-sm font-bold text-[#0a1633] shadow-lg shadow-amber-500/20 transition active:scale-95 hover:bg-amber-300"
            >
              {saved ? (
                <>
                  <Check size={18} className="text-emerald-950" /> Settings Saved Live!
                </>
              ) : (
                <>
                  <Save size={18} /> Save All Settings
                </>
              )}
            </button>
            {saved && (
              <span className="text-xs font-semibold text-emerald-400 animate-pulse text-center sm:text-left">
                Website updated immediately.
              </span>
            )}
          </div>

          {/* Danger zone */}
          <div className="rounded-3xl border border-rose-500/20 bg-rose-950/10 p-6 backdrop-blur sm:p-7">
            <h3 className="font-display text-lg font-bold text-rose-300">Danger Zone · Reset Data</h3>
            <p className="mt-1 text-xs text-rose-200/70">
              Reset all troubleshooting items, fashion articles, dictionary terms, gallery photos, and contact info back to the original hardcoded template state.
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="mt-4 inline-flex min-h-[44px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/20 px-5 py-2.5 text-xs font-bold text-rose-200 transition active:scale-95 hover:bg-rose-500/30"
            >
              <RefreshCw size={14} /> Reset All Content to Factory Defaults
            </button>
          </div>
        </form>
      )}
    </div>
  );
}