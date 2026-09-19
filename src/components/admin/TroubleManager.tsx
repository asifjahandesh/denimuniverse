import React, { useState, useMemo } from "react";
import { Plus, Search, Edit3, Trash2, X, Check, AlertCircle } from "lucide-react";
import { useData } from "../../context/DataContext";
import { TroubleItem } from "../../types/content";

export default function TroubleManager() {
  const { troubles, addTrouble, updateTrouble, deleteTrouble } = useData();
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("All");

  // Modal form states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TroubleItem | null>(null);

  // Form inputs
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("Dyeing");
  const [customTag, setCustomTag] = useState("");
  const [problem, setProblem] = useState("");
  const [causesText, setCausesText] = useState("");
  const [solutionsText, setSolutionsText] = useState("");
  const [severity, setSeverity] = useState<"High" | "Medium" | "Low">("Medium");

  const tags = ["All", ...Array.from(new Set(troubles.map((t) => t.tag)))];

  const filtered = useMemo(() => {
    return troubles.filter((t) => {
      const matchTag = tagFilter === "All" || t.tag === tagFilter;
      const matchQuery =
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.problem.toLowerCase().includes(search.toLowerCase()) ||
        t.tag.toLowerCase().includes(search.toLowerCase());
      return matchTag && matchQuery;
    });
  }, [troubles, search, tagFilter]);

  const openAddModal = () => {
    setEditingItem(null);
    setTitle("");
    setTag("Dyeing");
    setCustomTag("");
    setProblem("");
    setCausesText("");
    setSolutionsText("");
    setSeverity("Medium");
    setModalOpen(true);
  };

  const openEditModal = (item: TroubleItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setTag(item.tag);
    setCustomTag("");
    setProblem(item.problem);
    setCausesText(item.causes.join("\n"));
    setSolutionsText(item.solutions.join("\n"));
    setSeverity(item.severity);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTag = customTag.trim() ? customTag.trim() : tag;
    const causes = causesText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const solutions = solutionsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingItem) {
      updateTrouble(editingItem.id, {
        title,
        tag: finalTag,
        problem,
        causes: causes.length > 0 ? causes : ["Unknown cause"],
        solutions: solutions.length > 0 ? solutions : ["Inspection required"],
        severity,
      });
    } else {
      addTrouble({
        title,
        tag: finalTag,
        problem,
        causes: causes.length > 0 ? causes : ["Unknown cause"],
        solutions: solutions.length > 0 ? solutions : ["Inspection required"],
        severity,
      });
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteTrouble(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-black text-white">Troubleshooting Library</h2>
          <p className="text-sm text-indigo-200/70">
            Manage production defects, causes, and mill solutions ({troubles.length} items)
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3 font-display text-sm font-bold text-[#0a1633] shadow-lg shadow-amber-500/20 transition hover:bg-amber-300 active:scale-95"
        >
          <Plus size={18} /> Add Defect Case
        </button>
      </div>

      {/* Filter and search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search defects, causes, tags..."
            className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setTagFilter(t)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                tagFilter === t
                  ? "bg-amber-400 text-[#0a1633]"
                  : "bg-white/5 text-indigo-200/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* List of trouble items */}
      <div className="grid gap-4">
        {filtered.map((item) => {
          const sevColor =
            item.severity === "High"
              ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
              : item.severity === "Medium"
              ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
              : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";

          return (
            <div
              key={item.id}
              className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur transition hover:border-white/20 lg:flex-row lg:items-center"
            >
              <div className="flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-indigo-500/20 px-2 py-0.5 font-mono2 text-[11px] font-bold uppercase tracking-wider text-indigo-300">
                    {item.tag}
                  </span>
                  <span className={`rounded-md border px-2 py-0.5 text-[11px] font-bold ${sevColor}`}>
                    {item.severity} Severity
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold text-white">{item.title}</h3>
                <p className="text-sm text-indigo-100/80">{item.problem}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-indigo-300/60 pt-1">
                  <span>{item.causes.length} causes listed</span>
                  <span>•</span>
                  <span>{item.solutions.length} solutions</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(item)}
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/15"
                >
                  <Edit3 size={14} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.title)}
                  className="flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/20 hover:text-rose-200"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/15 p-12 text-center text-indigo-200/60">
            No troubleshooting cases found matching your search.
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#060d22]/80 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/20 bg-[#0a1633] p-6 text-white shadow-2xl sm:p-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-display text-xl font-bold">
                {editingItem ? "Edit Troubleshooting Case" : "Add New Defect Case"}
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
                  Defect Title
                </label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Warp Streaks in Selvedge"
                  className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-indigo-200/70">
                    Category / Tag
                  </label>
                  <select
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-[#0e1f48] px-4 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
                  >
                    {["Dyeing", "Weaving", "Finishing", "Spinning", "Washing", "Quality", "Other"].map(
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
                    Severity Level
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as "High" | "Medium" | "Low")}
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-[#0e1f48] px-4 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="High">High (Production Halt / Rejection)</option>
                    <option value="Medium">Medium (Correction Required)</option>
                    <option value="Low">Low (Minor / Cosmetic)</option>
                  </select>
                </div>
              </div>

              {tag === "Other" && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-indigo-200/70">
                    Custom Tag Name
                  </label>
                  <input
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    placeholder="Enter custom category"
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-indigo-200/70">
                  Problem Description
                </label>
                <textarea
                  required
                  rows={2}
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder="Explain what the defect looks like on fabric or garment..."
                  className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-indigo-200/70">
                  Root Causes (one per line)
                </label>
                <textarea
                  rows={3}
                  value={causesText}
                  onChange={(e) => setCausesText(e.target.value)}
                  placeholder="Indigo pH drift&#10;Inconsistent nip pressure&#10;Mixing yarn lots"
                  className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 font-mono2 text-xs text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-indigo-200/70">
                  Solutions & Best Practices (one per line)
                </label>
                <textarea
                  rows={3}
                  value={solutionsText}
                  onChange={(e) => setSolutionsText(e.target.value)}
                  placeholder="Calibrate pH electrode every morning&#10;Maintain bath temperature between 28-30°C&#10;Lock beam numbering"
                  className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 font-mono2 text-xs text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
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
                  <Check size={16} /> Save Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}