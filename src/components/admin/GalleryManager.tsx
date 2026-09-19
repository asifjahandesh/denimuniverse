import React, { useState, useMemo } from "react";
import { Plus, Trash2, Edit3, Upload, Image as ImageIcon, X, Check, Loader2 } from "lucide-react";
import { useData } from "../../context/DataContext";
import { GalleryItem } from "../../types/content";
import { uploadImageToSupabase, isSupabaseConfigured } from "../../lib/supabase";

export default function GalleryManager() {
  const { gallery, addGalleryItem, updateGalleryItem, deleteGalleryItem } = useData();
  const [catFilter, setCatFilter] = useState("All");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [uploading, setUploading] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [cat, setCat] = useState("Fabric");
  const [tall, setTall] = useState(false);
  const [src, setSrc] = useState("");
  const [imageMode, setImageMode] = useState<"upload" | "url">("upload");

  const categories = [
    "All",
    "Fabric",
    "Manufacturing",
    "Dyeing",
    "Weaving",
    "Garments",
    "Fashion",
    "Sustainability",
  ];

  const filtered = useMemo(() => {
    return gallery.filter((g) => catFilter === "All" || g.cat === catFilter);
  }, [gallery, catFilter]);

  const openAddModal = () => {
    setEditingItem(null);
    setTitle("");
    setCat("Fabric");
    setTall(false);
    setSrc("");
    setModalOpen(true);
  };

  const openEditModal = (item: GalleryItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setCat(item.cat);
    setTall(!!item.tall);
    setSrc(item.src);
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
        setSrc(publicUrl);
      } catch (err: unknown) {
        console.warn("Supabase upload failed, falling back to base64 Data URL", err);
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            setSrc(reader.result);
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
          setSrc(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSrc =
      src.trim() ||
      "https://images.pexels.com/photos/4109758/pexels-photo-4109758.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

    if (editingItem) {
      updateGalleryItem(editingItem.id, {
        title,
        cat,
        tall,
        src: finalSrc,
      });
    } else {
      addGalleryItem({
        title,
        cat,
        tall,
        src: finalSrc,
      });
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete image "${title}"?`)) {
      deleteGalleryItem(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-black text-white">Media Gallery</h2>
          <p className="text-sm text-indigo-200/70">
            Upload and organize denim photography and machinery visuals ({gallery.length} photos)
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3 font-display text-sm font-bold text-[#0a1633] shadow-lg shadow-amber-500/20 transition hover:bg-amber-300 active:scale-95"
        >
          <Plus size={18} /> Upload Image
        </button>
      </div>

      {/* Category filter tabs */}
      <div className="flex flex-wrap gap-1.5">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCatFilter(c)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              catFilter === c
                ? "bg-amber-400 text-[#0a1633]"
                : "bg-white/5 text-indigo-200/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Gallery Media Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-md transition hover:border-amber-400/50"
          >
            <div className="relative aspect-square w-full">
              <img
                src={item.src}
                alt={item.title}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
            </div>

            {/* Badges & Info */}
            <div className="p-3">
              <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 font-mono2 text-[10px] font-bold uppercase text-indigo-300">
                {item.cat}
              </span>
              <p className="mt-1 truncate text-xs font-bold text-white">{item.title}</p>
              {item.tall && (
                <span className="text-[10px] font-semibold text-amber-400">Portrait Layout</span>
              )}
            </div>

            {/* Quick Action Overlay */}
            <div className="absolute right-2 top-2 flex gap-1.5 opacity-0 transition group-hover:opacity-100">
              <button
                onClick={() => openEditModal(item)}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/70 text-white hover:bg-amber-400 hover:text-[#0a1633]"
                title="Edit details"
              >
                <Edit3 size={13} />
              </button>
              <button
                onClick={() => handleDelete(item.id, item.title)}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/70 text-rose-300 hover:bg-rose-600 hover:text-white"
                title="Delete image"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/15 p-12 text-center text-indigo-200/60">
          No media items found in this category.
        </div>
      )}

      {/* Add / Edit Gallery Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#060d22]/80 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/20 bg-[#0a1633] p-6 text-white shadow-2xl sm:p-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-display text-xl font-bold">
                {editingItem ? "Edit Gallery Item" : "Upload Gallery Media"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-indigo-200/70">
                  Image Title / Caption
                </label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Rope Dyeing Airing Rack"
                  className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-indigo-200/70">
                    Category Tag
                  </label>
                  <select
                    value={cat}
                    onChange={(e) => setCat(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-[#0e1f48] px-4 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
                  >
                    {[
                      "Fabric",
                      "Manufacturing",
                      "Dyeing",
                      "Weaving",
                      "Garments",
                      "Fashion",
                      "Sustainability",
                    ].map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex cursor-pointer items-center gap-2.5 text-sm text-indigo-200">
                    <input
                      type="checkbox"
                      checked={tall}
                      onChange={(e) => setTall(e.target.checked)}
                      className="h-4 w-4 rounded border-white/20 bg-white/10 text-amber-500 focus:ring-amber-400"
                    />
                    <span>Tall portrait format</span>
                  </label>
                </div>
              </div>

              {/* Media Selection */}
              <div>
                <div className="flex items-center justify-between pb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-indigo-200/70">
                    Image Source
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
                          Uploading photo to cloud storage...
                        </span>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-400/20 text-amber-400">
                          <Upload size={22} />
                        </div>
                        <span className="mt-3 block text-sm font-semibold text-white">
                          Choose photo from device
                        </span>
                        <span className="mt-1 block text-xs text-indigo-200/60">
                          JPG, PNG, WEBP supported (cloud uploaded or local fallback)
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
                    value={src}
                    onChange={(e) => setSrc(e.target.value)}
                    placeholder="https://images.pexels.com/..."
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
                  />
                )}

                {/* Preview */}
                {src && (
                  <div className="mt-3 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-2.5">
                    <img
                      src={src}
                      alt="Preview"
                      className="h-14 w-14 rounded-lg object-cover ring-1 ring-white/20"
                    />
                    <div className="flex-1 text-xs">
                      <p className="font-semibold text-white">Selected Media</p>
                      <p className="text-indigo-200/60 truncate max-w-xs">{src.substring(0, 45)}...</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSrc("")}
                      className="rounded-lg p-1 text-rose-400 hover:bg-rose-500/20"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-2.5 font-display text-sm font-bold text-[#0a1633] shadow-lg shadow-amber-500/20 hover:bg-amber-300"
                >
                  <Check size={16} /> Save Image
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}