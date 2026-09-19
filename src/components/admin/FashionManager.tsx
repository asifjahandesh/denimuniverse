import React, { useState } from "react";
import { Plus, Edit3, Trash2, X, Check, Upload, Image as ImageIcon, Sparkles, Loader2 } from "lucide-react";
import { useData } from "../../context/DataContext";
import { FashionCard } from "../../types/content";
import { uploadImageToSupabase, isSupabaseConfigured } from "../../lib/supabase";

export default function FashionManager() {
  const { fashionCards, addFashion, updateFashion, deleteFashion } = useData();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FashionCard | null>(null);
  const [uploading, setUploading] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("Trends");
  const [desc, setDesc] = useState("");
  const [stat, setStat] = useState("");
  const [image, setImage] = useState("");
  const [imageMode, setImageMode] = useState<"upload" | "url">("upload");

  const openAddModal = () => {
    setEditingItem(null);
    setTitle("");
    setTag("Trends");
    setDesc("");
    setStat("");
    setImage("");
    setModalOpen(true);
  };

  const openEditModal = (item: FashionCard) => {
    setEditingItem(item);
    setTitle(item.title);
    setTag(item.tag);
    setDesc(item.desc);
    setStat(item.stat);
    setImage(item.image);
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert("Please upload an image smaller than 8MB.");
      return;
    }

    if (isSupabaseConfigured()) {
      setUploading(true);
      try {
        const publicUrl = await uploadImageToSupabase(file);
        setImage(publicUrl);
      } catch (err: unknown) {
        console.warn("Supabase upload failed, falling back to base64 Data URL", err);
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            setImage(reader.result);
          }
        };
        reader.readAsDataURL(file);
      } finally {
        setUploading(false);
      }
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalImage =
      image.trim() ||
      "https://images.pexels.com/photos/19224972/pexels-photo-19224972.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

    if (editingItem) {
      updateFashion(editingItem.id, {
        title,
        tag,
        desc,
        stat: stat || "Denim Universe Editorial",
        image: finalImage,
      });
    } else {
      addFashion({
        title,
        tag,
        desc,
        stat: stat || "Denim Universe Editorial",
        image: finalImage,
      });
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete fashion post "${title}"?`)) {
      deleteFashion(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-black text-white">Fashion Stories & Trends</h2>
          <p className="text-sm text-indigo-200/70">
            Publish and manage denim fashion trends, fits, and wash articles ({fashionCards.length} items)
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3 font-display text-sm font-bold text-[#0a1633] shadow-lg shadow-amber-500/20 transition hover:bg-amber-300 active:scale-95"
        >
          <Plus size={18} /> New Fashion Post
        </button>
      </div>

      {/* Grid of fashion cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {fashionCards.map((card) => (
          <div
            key={card.id}
            className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] transition hover:border-amber-400/40 hover:shadow-2xl"
          >
            {/* Image Preview */}
            <div className="relative h-48 w-full overflow-hidden bg-black/40">
              <img
                src={card.image}
                alt={card.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <span className="absolute left-3 top-3 rounded-full bg-[#0a1633]/85 px-3 py-1 font-mono2 text-[10px] font-bold uppercase tracking-wider text-amber-300 backdrop-blur">
                {card.tag}
              </span>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col justify-between p-5">
              <div>
                <h3 className="font-display text-lg font-bold text-white">{card.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-indigo-100/75 line-clamp-3">
                  {card.desc}
                </p>
                {card.stat && (
                  <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                    <Sparkles size={13} /> {card.stat}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="mt-5 flex items-center justify-end gap-2 border-t border-white/10 pt-3">
                <button
                  onClick={() => openEditModal(card)}
                  className="flex min-h-[36px] flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-white transition active:scale-95 hover:bg-white/15"
                >
                  <Edit3 size={13} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(card.id, card.title)}
                  className="flex min-h-[36px] flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs font-semibold text-rose-300 transition active:scale-95 hover:bg-rose-500/20 hover:text-rose-200"
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Fashion Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="absolute inset-0 bg-[#060d22]/80 backdrop-blur-sm transition-opacity"
            onClick={() => setModalOpen(false)}
          />
          <div className="touch-scroll relative max-h-[90dvh] sm:max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-t-[2rem] sm:rounded-3xl border border-white/20 bg-[#0a1633] p-5 pb-safe sm:p-8 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-display text-lg sm:text-xl font-bold">
                {editingItem ? "Edit Fashion Post" : "Create New Fashion Post"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                aria-label="Close"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70 transition active:scale-95 hover:bg-white/20 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-indigo-200/70">
                  Article Title
                </label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., The Rise of Raw Selvedge Minimalists"
                  className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-indigo-200/70">
                    Fashion Tag
                  </label>
                  <input
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    placeholder="Trends, Garments, Washes..."
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-indigo-200/70">
                    Highlighted Stat / Metric
                  </label>
                  <input
                    value={stat}
                    onChange={(e) => setStat(e.target.value)}
                    placeholder="e.g., +45% global runway presence"
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-indigo-200/70">
                  Fashion Writing & Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Write editorial analysis, styling tips, silhouettes, or wash techniques..."
                  className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
                />
              </div>

              {/* Image Input Selection */}
              <div>
                <div className="flex items-center justify-between pb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-indigo-200/70">
                    Cover Image
                  </label>
                  <div className="flex gap-1.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setImageMode("upload")}
                      className={`rounded-lg px-2.5 py-1 transition ${
                        imageMode === "upload"
                          ? "bg-amber-400 font-bold text-[#0a1633]"
                          : "bg-white/10 text-white/70"
                      }`}
                    >
                      File Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode("url")}
                      className={`rounded-lg px-2.5 py-1 transition ${
                        imageMode === "url"
                          ? "bg-amber-400 font-bold text-[#0a1633]"
                          : "bg-white/10 text-white/70"
                      }`}
                    >
                      Image URL
                    </button>
                  </div>
                </div>

                {imageMode === "upload" ? (
                  <div className="mt-1 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/20 bg-white/[0.03] p-6 text-center transition hover:border-amber-400/50">
                    {uploading ? (
                      <div className="flex flex-col items-center py-2">
                        <Loader2 size={26} className="animate-spin text-amber-400" />
                        <span className="mt-2 text-xs font-semibold text-amber-300">
                          Uploading image to cloud storage...
                        </span>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-400/20 text-amber-400">
                          <Upload size={22} />
                        </div>
                        <span className="mt-3 block text-sm font-semibold text-white">
                          Click to select an image from your device
                        </span>
                        <span className="mt-1 block text-xs text-indigo-200/60">
                          PNG, JPG, WEBP supported (cloud uploaded or local fallback)
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                ) : (
                  <input
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://images.pexels.com/..."
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
                  />
                )}

                {/* Preview Thumbnail */}
                {image && (
                  <div className="mt-3 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-2.5">
                    <img
                      src={image}
                      alt="Preview"
                      className="h-14 w-14 rounded-lg object-cover ring-1 ring-white/20"
                    />
                    <div className="flex-1 text-xs">
                      <p className="font-semibold text-white">Image Preview Selected</p>
                      <p className="text-indigo-200/60 truncate max-w-xs">{image.substring(0, 45)}...</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setImage("")}
                      className="rounded-lg p-1 text-rose-400 hover:bg-rose-500/20"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="min-h-[44px] rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition active:scale-95 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-2.5 font-display text-sm font-bold text-[#0a1633] shadow-lg shadow-amber-500/20 transition active:scale-95 hover:bg-amber-300"
                >
                  <Check size={16} /> Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}