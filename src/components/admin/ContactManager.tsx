import React, { useState } from "react";
import { Save, Check, RefreshCw, Mail, MessageCircle, MapPin, Facebook, Globe, BarChart3 } from "lucide-react";
import { useData } from "../../context/DataContext";

export default function ContactManager() {
  const { siteConfig, updateSiteConfig, resetToDefaults } = useData();

  const [brand, setBrand] = useState(siteConfig.brand);
  const [tagline, setTagline] = useState(siteConfig.tagline);
  const [email, setEmail] = useState(siteConfig.email);
  const [whatsapp, setWhatsapp] = useState(siteConfig.whatsapp);
  const [location, setLocation] = useState(siteConfig.location);
  const [facebookUrl, setFacebookUrl] = useState(siteConfig.facebookUrl);
  const [gaId, setGaId] = useState(siteConfig.gaId || "");

  const [saved, setSaved] = useState(false);

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
      // update local inputs
      setBrand("Denim Universe");
      setTagline("Explore the World of Denim");
      setEmail("hello@denimuniverse.com");
      setWhatsapp("https://wa.me/8801000000000");
      setLocation("Dhaka · Bangladesh — serving the global denim community");
      setFacebookUrl("https://www.facebook.com/share/1EGKnnQXrP/?mibextid=wwXIfr");
      setGaId("");
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="font-display text-2xl font-black text-white">Contact & Site Settings</h2>
        <p className="text-sm text-indigo-200/70">
          Update your public contact methods, social presence, and brand messaging across the website.
        </p>
      </div>

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
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-200/70">
                Google Analytics 4 Measurement ID (Optional)
              </label>
              <input
                value={gaId}
                onChange={(e) => setGaId(e.target.value)}
                placeholder="G-XXXXXXXXXX"
                className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
              />
              <p className="mt-1.5 text-[11px] text-indigo-200/50">
                Paste your GA4 Measurement ID (starting with "G-") to collect detailed Google Analytics data.
              </p>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-7 py-3 font-display text-sm font-bold text-[#0a1633] shadow-lg shadow-amber-500/20 transition hover:bg-amber-300 active:scale-95"
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
            <span className="text-xs font-semibold text-emerald-400 animate-pulse">
              Website updated immediately.
            </span>
          )}
        </div>
      </form>

      {/* Danger zone */}
      <div className="rounded-3xl border border-rose-500/20 bg-rose-950/10 p-6 backdrop-blur sm:p-7">
        <h3 className="font-display text-lg font-bold text-rose-300">Danger Zone · Reset Data</h3>
        <p className="mt-1 text-xs text-rose-200/70">
          Reset all troubleshooting items, fashion articles, dictionary terms, gallery photos, and contact info back to the original hardcoded template state.
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/20 px-5 py-2.5 text-xs font-bold text-rose-200 hover:bg-rose-500/30"
        >
          <RefreshCw size={14} /> Reset All Content to Factory Defaults
        </button>
      </div>
    </div>
  );
}