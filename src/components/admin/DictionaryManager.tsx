import React, { useState, useMemo } from "react";
import { Plus, Search, Edit3, Trash2, X, Check, BookOpen } from "lucide-react";
import { useData } from "../../context/DataContext";
import { DictTerm } from "../../types/content";

export default function DictionaryManager() {
  const { dictionary, addDictTerm, updateDictTerm, deleteDictTerm } = useData();
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DictTerm | null>(null);

  // Form
  const [term, setTerm] = useState("");
  const [short, setShort] = useState("");
  const [detail, setDetail] = useState("");
  const [cat, setCat] = useState("Fabric");

  const categories = ["All", ...Array.from(new Set(dictionary.map((d) => d.cat)))];

  const filtered = useMemo(() => {
    return dictionary.filter((d) => {
      const matchCat = catFilter === "All" || d.cat === catFilter;
      const matchQuery =
        d.term.toLowerCase().includes(search.toLowerCase()) ||
        d.short.toLowerCase().includes(search.toLowerCase()) ||
        d.detail.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [dictionary, search, catFilter]);

  const openAddModal = () => {
    setEditingItem(null);
    setTerm("");
    setShort("");
    setDetail("");
    setCat("Fabric");
    setModalOpen(true);
  };

  const openEditModal = (item: DictTerm) => {
    setEditingItem(item);
    setTerm(item.term);
    setShort(item.short);
    setDetail(item.detail);
    setCat(item.cat);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateDictTerm(editingItem.id, {
        term,
        short,
        detail,
        cat,
      });
    } else {
      addDictTerm({
        term,
        short,
        detail,
        cat,
      });
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string, term: string) => {
    if (window.confirm(`Are you sure you want to delete term "${term}"?`)) {
      deleteDictTerm(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-black text-white">Denim Dictionary & Glossary</h2>
          <p className="text-sm text-indigo-200/70">
            Define and clarify textile terminology and abbreviations ({dictionary.length} terms)
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3 font-display text-sm font-bold text-[#0a1633] shadow-lg shadow-amber-500/20 transition hover:bg-amber-300 active:scale-95"
        >
          <Plus size={18} /> Add Word / Term
        </button>
      </div>

      {/* Filter and search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search words, abbreviations, definitions..."
            className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
          />
        </div>
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
      </div>

      {/* Dictionary Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur transition hover:border-white/20"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-amber-400/15 px-2 py-0.5 font-mono2 text-[11px] font-bold uppercase tracking-wider text-amber-300">
                  {item.cat}
                </span>
                <span className="font-mono2 text-xs text-indigo-300/50">ID: {item.id.slice(0, 8)}</span>
              </div>
              <h3 className="font-display mt-3 text-lg font-bold text-white">{item.term}</h3>
              <p className="mt-1 text-xs font-medium text-amber-200/90">{item.short}</p>
              <p className="mt-2 text-xs leading-relaxed text-indigo-100/70 line-clamp-3">
                {item.detail}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2 border-t border-white/10 pt-3">
              <button
                onClick={() => openEditModal(item)}
                className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-white hover:bg-white/15"
              >
                <Edit3 size={13} /> Edit
              </button>
              <button
                onClick={() => handleDelete(item.id, item.term)}
                className="flex items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-300 hover:bg-rose-500/20"
              >
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/15 p-12 text-center text-indigo-200/60">
          No terms found matching your query.
        </div>
      )}

      {/* Add / Edit Term Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#060d22]/80 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative w-full max-w-lg overflow-y-auto rounded-3xl border border-white/20 bg-[#0a1633] p-6 text-white shadow-2xl sm:p-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-display text-xl font-bold">
                {editingItem ? "Edit Glossary Word" : "Add New Glossary Word"}
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
                  Term / Acronym
                </label>
                <input
                  required
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  placeholder="e.g., Sanforizing, GSM, Selvedge"
                  className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-indigo-200/70">
                  Classification Category
                </label>
                <select
                  value={cat}
                  onChange={(e) => setCat(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/15 bg-[#0e1f48] px-4 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
                >
                  {["Fabric", "Yarn", "Dyeing", "Weaving", "Finishing", "Washing", "Quality", "General"].map(
                    (opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-indigo-200/70">
                  Short One-Liner Summary
                </label>
                <input
                  required
                  value={short}
                  onChange={(e) => setShort(e.target.value)}
                  placeholder="e.g., Mechanical pre-shrinking process."
                  className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-indigo-200/70">
                  Comprehensive Definition & Mill Context
                </label>
                <textarea
                  required
                  rows={4}
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                  placeholder="Detailed engineering explanation, testing standards, or production notes..."
                  className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
                />
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
                  <Check size={16} /> Save Word
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}