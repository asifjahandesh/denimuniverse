import React, { useState, useMemo } from "react";
import {
  FileText,
  Users,
  Plus,
  Trash2,
  Edit3,
  Upload,
  X,
  Check,
  Loader2,
  Search,
  ExternalLink,
  ShieldCheck,
  Lock,
  Unlock,
  Eye,
  Sparkles,
  Download,
  AlertCircle,
  CheckCircle2,
  Key,
  Mail,
  User,
  CreditCard,
  BookOpen,
  Crown,
  Save,
  Package,
  Settings,
  Clock,
  XCircle,
  Copy,
} from "lucide-react";
import { useData } from "../../context/DataContext";
import { ResourceItem, MemberAccount } from "../../types/content";
import { uploadImageToSupabase, isSupabaseConfigured } from "../../lib/supabase";

const CATEGORY_PRESETS = [
  "Finishing & Recipes",
  "Dyeing & Chemistry",
  "Weaving & Yarn",
  "Garment Processing",
  "Quality & Lab Standards",
  "Sustainable Tech",
];

export default function ResourceManager() {
  const {
    resources,
    addResource,
    updateResource,
    deleteResource,
    members,
    addMember,
    updateMember,
    deleteMember,
    membershipSettings,
    updateMembershipSettings,
    payments,
    approvePayment,
    rejectPayment,
    deletePayment,
  } = useData();

  // Primary Tab: "resources" | "members" | "plans" | "payments"
  const [activeSubTab, setActiveSubTab] = useState<"resources" | "members" | "plans" | "payments">("resources");

  // --------------------------------------------------------------------------
  // RESOURCE MANAGEMENT STATE
  // --------------------------------------------------------------------------
  const [resSearch, setResSearch] = useState("");
  const [resCatFilter, setResCatFilter] = useState("All");
  const [resourceModalOpen, setResourceModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<ResourceItem | null>(null);

  // Resource Form State
  const [rTitle, setRTitle] = useState("");
  const [rCategory, setRCategory] = useState("Finishing & Recipes");
  const [rDesc, setRDesc] = useState("");
  const [rContent, setRContent] = useState("");
  const [rAuthor, setRAuthor] = useState("Engr. Asif Jahan · Senior Wet Process Specialist");
  const [rReadTime, setRReadTime] = useState("8 min read");
  const [rImage, setRImage] = useState("");
  const [rImageMode, setRImageMode] = useState<"upload" | "url">("upload");
  const [rAccessTier, setRAccessTier] = useState<"free" | "basic" | "premium">("basic");
  const [rIsPremium, setRIsPremium] = useState(true);
  const [rPriceBadge, setRPriceBadge] = useState("199 BDT · Basic Plan");
  const [rSinglePrice, setRSinglePrice] = useState("49 BDT");
  const [rPdfTitle, setRPdfTitle] = useState("");
  const [rPdfUrl, setRPdfUrl] = useState("");
  const [rPdfMode, setRPdfMode] = useState<"upload" | "url">("upload");
  const [rPdfSize, setRPdfSize] = useState("4.5 MB");
  const [rPdfPages, setRPdfPages] = useState<number>(30);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [contentTab, setContentTab] = useState<"write" | "preview">("write");

  // --------------------------------------------------------------------------
  // MEMBER MANAGEMENT STATE
  // --------------------------------------------------------------------------
  const [memSearch, setMemSearch] = useState("");
  const [memStatusFilter, setMemStatusFilter] = useState<"all" | "active" | "suspended">("all");
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<MemberAccount | null>(null);

  // Member Form States
  const [mName, setMName] = useState("");
  const [mEmail, setMEmail] = useState("");
  const [mPassword, setMPassword] = useState("");
  const [mStatus, setMStatus] = useState<"active" | "suspended">("active");
  const [mPlan, setMPlan] = useState<"free" | "basic" | "premium">("premium");
  const [mAccessAll, setMAccessAll] = useState(true);
  const [mAllowedIds, setMAllowedIds] = useState<string[]>([]);
  const [mNotes, setMNotes] = useState("");

  // --------------------------------------------------------------------------
  // PLAN & PRICING SETTINGS STATE
  // --------------------------------------------------------------------------
  const [planSettings, setPlanSettings] = useState(membershipSettings);
  const [basicFeaturesText, setBasicFeaturesText] = useState(
    (membershipSettings?.basicPlan?.features || []).join("\n")
  );
  const [premiumFeaturesText, setPremiumFeaturesText] = useState(
    (membershipSettings?.premiumPlan?.features || []).join("\n")
  );

  // --------------------------------------------------------------------------
  // PAYMENT MANAGEMENT STATE
  // --------------------------------------------------------------------------
  const [paySearch, setPaySearch] = useState("");
  const [payStatusFilter, setPayStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [payTypeFilter, setPayTypeFilter] = useState<"all" | "plan" | "single_pdf">("all");
  const [previewScreenshot, setPreviewScreenshot] = useState<string | null>(null);
  const [copiedTrx, setCopiedTrx] = useState<string | null>(null);

  const pendingPaymentsCount = useMemo(
    () => payments.filter((p) => p.status === "pending").length,
    [payments]
  );

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const matchStatus = payStatusFilter === "all" || p.status === payStatusFilter;
      const matchType = payTypeFilter === "all" || p.paymentType === payTypeFilter;
      const q = paySearch.toLowerCase();
      const matchQuery =
        !q ||
        p.memberName.toLowerCase().includes(q) ||
        p.memberEmail.toLowerCase().includes(q) ||
        p.trxId.toLowerCase().includes(q) ||
        (p.planName && p.planName.toLowerCase().includes(q)) ||
        (p.resourceTitle && p.resourceTitle.toLowerCase().includes(q));
      return matchStatus && matchType && matchQuery;
    });
  }, [payments, payStatusFilter, payTypeFilter, paySearch]);

  const handleCopyTrx = (trx: string) => {
    navigator.clipboard.writeText(trx);
    setCopiedTrx(trx);
    setTimeout(() => setCopiedTrx(null), 2000);
  };

  const handleApprovePayment = (id: string, memberName: string) => {
    approvePayment(id);
    showFeedback(`Payment for ${memberName} approved & activated!`);
  };

  const handleRejectPayment = (id: string) => {
    const reason = window.prompt("Enter rejection reason (optional):", "Transaction ID not found or unverified");
    if (reason !== null) {
      rejectPayment(id, reason);
      showFeedback("Payment submission rejected.");
    }
  };

  const handleDeletePayment = (id: string) => {
    if (window.confirm("Delete this payment record permanently?")) {
      deletePayment(id);
      showFeedback("Payment record deleted.");
    }
  };

  // Feedback Toast
  const [feedback, setFeedback] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const showFeedback = (message: string, type: "success" | "error" = "success") => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 3500);
  };

  // --------------------------------------------------------------------------
  // RESOURCE FILTERING & MODAL ACTIONS
  // --------------------------------------------------------------------------
  const filteredResources = useMemo(() => {
    return resources.filter((r) => {
      const matchCat = resCatFilter === "All" || r.category === resCatFilter;
      const q = resSearch.toLowerCase();
      const matchQuery =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.desc.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.pdfTitle.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [resources, resCatFilter, resSearch]);

  const openAddResource = () => {
    setEditingResource(null);
    setRTitle("");
    setRCategory("Finishing & Recipes");
    setRDesc("");
    setRContent(
      `### 1. Overview & Industrial Objective\nWrite your technical introduction, background, and operational scope here.\n\n---\n\n### 2. Standard Operating Calibration\nDetail parameter tables, liquor ratios, chemical concentrations, and laser/wash settings:\n\n- Parameter 1: 40°C temperature, 1:6 liquor ratio\n- Parameter 2: Standard enzyme bath duration 20 min\n\n---\n\n### 3. Attached PDF Technical Documentation\nThe attached PDF manual contains high-resolution laboratory curves, recipe tables, and complete production SOPs for mill operators.`
    );
    setRAuthor("Engr. Asif Jahan · Senior Wet Process Specialist");
    setRReadTime("8 min read");
    setRImage("https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200");
    setRImageMode("upload");
    setRAccessTier("basic");
    setRIsPremium(true);
    setRPriceBadge("199 BDT · Basic Plan");
    setRSinglePrice("49 BDT");
    setRPdfTitle("Denim_Technical_Standard_Manual.pdf");
    setRPdfUrl("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf");
    setRPdfMode("upload");
    setRPdfSize("4.5 MB");
    setRPdfPages(28);
    setContentTab("write");
    setResourceModalOpen(true);
  };

  const openEditResource = (item: ResourceItem) => {
    setEditingResource(item);
    setRTitle(item.title);
    setRCategory(item.category);
    setRDesc(item.desc);
    setRContent(item.content);
    setRAuthor(item.author || "Engr. Asif Jahan · Senior Wet Process Specialist");
    setRReadTime(item.readTime || "8 min read");
    setRImage(item.image);
    setRImageMode("url");
    const tier = item.accessTier || (item.isPremium ? "premium" : "free");
    setRAccessTier(tier);
    setRIsPremium(tier !== "free");
    setRPriceBadge(item.priceBadge || (tier === "premium" ? "499 BDT · Premium VIP" : tier === "basic" ? "199 BDT · Basic Plan" : "Free Access"));
    setRSinglePrice(item.singlePrice || "49 BDT");
    setRPdfTitle(item.pdfTitle);
    setRPdfUrl(item.pdfUrl);
    setRPdfMode("url");
    setRPdfSize(item.pdfSize || "4.5 MB");
    setRPdfPages(item.pdfPages || 25);
    setContentTab("write");
    setResourceModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert("Please upload an image smaller than 8MB.");
      return;
    }

    if (isSupabaseConfigured()) {
      setUploadingImage(true);
      try {
        const publicUrl = await uploadImageToSupabase(file);
        setRImage(publicUrl);
        showFeedback("Cover image uploaded to Supabase CDN!");
      } catch (err) {
        console.warn("Supabase upload failed, falling back to Data URL", err);
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (typeof ev.target?.result === "string") setRImage(ev.target.result);
        };
        reader.readAsDataURL(file);
      } finally {
        setUploadingImage(false);
      }
    } else {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (typeof ev.target?.result === "string") setRImage(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Auto-calculate size
    const mbSize = (file.size / (1024 * 1024)).toFixed(1) + " MB";
    setRPdfSize(mbSize);
    if (!rPdfTitle || rPdfTitle === "Denim_Technical_Standard_Manual.pdf") {
      setRPdfTitle(file.name);
    }

    if (file.size > 30 * 1024 * 1024) {
      alert("Please select a PDF file smaller than 30MB.");
      return;
    }

    if (isSupabaseConfigured()) {
      setUploadingPdf(true);
      try {
        const publicUrl = await uploadImageToSupabase(file);
        setRPdfUrl(publicUrl);
        showFeedback(`PDF file "${file.name}" uploaded successfully!`);
      } catch (err) {
        console.warn("Supabase PDF upload failed", err);
        alert("Upload failed. You can also paste a direct PDF URL below.");
      } finally {
        setUploadingPdf(false);
      }
    } else {
      alert("Supabase storage is in offline/demo mode. Please provide a direct public PDF URL or connect Supabase.");
    }
  };

  const handleSaveResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rTitle.trim()) {
      alert("Please provide an article title.");
      return;
    }

    const payload = {
      title: rTitle.trim(),
      slug: rTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      category: rCategory.trim(),
      desc: rDesc.trim(),
      content: rContent.trim(),
      author: rAuthor.trim(),
      readTime: rReadTime.trim(),
      publishedAt: editingResource ? editingResource.publishedAt : "September 2026",
      image: rImage.trim(),
      accessTier: rAccessTier,
      isPremium: rAccessTier !== "free",
      priceBadge: rPriceBadge.trim() || (rAccessTier === "premium" ? "499 BDT · Premium VIP" : rAccessTier === "basic" ? "199 BDT · Basic Plan" : "Free"),
      singlePrice: rSinglePrice.trim() || "49 BDT",
      pdfTitle: rPdfTitle.trim() || "Technical_Documentation.pdf",
      pdfUrl: rPdfUrl.trim(),
      pdfSize: rPdfSize.trim() || "3.5 MB",
      pdfPages: Number(rPdfPages) || 20,
    };

    if (editingResource) {
      updateResource(editingResource.id, payload);
      showFeedback(`Resource "${payload.title}" updated successfully.`);
    } else {
      addResource(payload);
      showFeedback(`New resource "${payload.title}" published!`);
    }

    setResourceModalOpen(false);
  };

  const handleDeleteResource = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      deleteResource(id);
      showFeedback(`Resource "${title}" deleted.`);
    }
  };

  // --------------------------------------------------------------------------
  // MEMBER FILTERING & MODAL ACTIONS
  // --------------------------------------------------------------------------
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchStatus = memStatusFilter === "all" || m.status === memStatusFilter;
      const q = memSearch.toLowerCase();
      const matchQuery =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        (m.notes && m.notes.toLowerCase().includes(q));
      return matchStatus && matchQuery;
    });
  }, [members, memStatusFilter, memSearch]);

  const openAddMember = () => {
    setEditingMember(null);
    setMName("");
    setMEmail("");
    setMPassword("denim" + Math.floor(1000 + Math.random() * 9000));
    setMStatus("active");
    setMPlan("premium");
    setMAccessAll(true);
    setMAllowedIds([]);
    setMNotes("");
    setMemberModalOpen(true);
  };

  const openEditMember = (member: MemberAccount) => {
    setEditingMember(member);
    setMName(member.name);
    setMEmail(member.email);
    setMPassword(member.password);
    setMStatus(member.status);
    const plan = member.plan || (member.accessAll ? "premium" : "basic");
    setMPlan(plan);
    setMAccessAll(plan === "premium" || member.accessAll);
    setMAllowedIds(member.allowedResourceIds || []);
    setMNotes(member.notes || "");
    setMemberModalOpen(true);
  };

  const handleToggleMemberResource = (id: string) => {
    if (mAllowedIds.includes(id)) {
      setMAllowedIds(mAllowedIds.filter((item) => item !== id));
    } else {
      setMAllowedIds([...mAllowedIds, id]);
    }
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mEmail.trim()) {
      alert("Please enter a valid member email address.");
      return;
    }
    if (!mPassword.trim()) {
      alert("Please provide a password for this member account.");
      return;
    }

    const isFullAccess = mPlan === "premium" || mAccessAll;
    const payload = {
      name: mName.trim() || mEmail.split("@")[0],
      email: mMEmailClean(mEmail),
      password: mPassword.trim(),
      status: mStatus,
      plan: mPlan,
      accessAll: isFullAccess,
      allowedResourceIds: isFullAccess ? [] : mAllowedIds,
      notes: mNotes.trim(),
    };

    if (editingMember) {
      updateMember(editingMember.id, payload);
      showFeedback(`Member "${payload.name}" updated successfully.`);
    } else {
      // Check duplicate email
      const exists = members.some((m) => m.email.toLowerCase() === payload.email.toLowerCase());
      if (exists) {
        alert("A member with this email address already exists.");
        return;
      }
      addMember(payload);
      showFeedback(`Paid member account registered for ${payload.email}!`);
    }

    setMemberModalOpen(false);
  };

  const handleSavePlanSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSettings = {
      ...planSettings,
      basicPlan: {
        ...planSettings.basicPlan,
        features: basicFeaturesText
          .split("\n")
          .map((f) => f.trim())
          .filter(Boolean),
      },
      premiumPlan: {
        ...planSettings.premiumPlan,
        features: premiumFeaturesText
          .split("\n")
          .map((f) => f.trim())
          .filter(Boolean),
      },
    };
    updateMembershipSettings(updatedSettings);
    setPlanSettings(updatedSettings);
    showFeedback("Membership plans, pricing, and payment instructions saved successfully!");
  };

  const mMEmailClean = (str: string) => str.trim().toLowerCase();

  const handleToggleMemberStatus = (member: MemberAccount) => {
    const nextStatus = member.status === "active" ? "suspended" : "active";
    updateMember(member.id, { status: nextStatus });
    showFeedback(`Member ${member.email} set to ${nextStatus}.`);
  };

  const handleDeleteMember = (id: string, email: string) => {
    if (window.confirm(`Remove member account for ${email}? They will no longer be able to log in.`)) {
      deleteMember(id);
      showFeedback(`Member account for ${email} deleted.`);
    }
  };

  // --------------------------------------------------------------------------
  // RENDER
  // --------------------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`fixed bottom-6 right-6 z-[100] flex items-center gap-2.5 rounded-2xl px-5 py-3.5 text-sm font-bold shadow-2xl backdrop-blur-md animate-fade-in ${
            feedback.type === "success"
              ? "border border-emerald-500/30 bg-emerald-950/90 text-emerald-200"
              : "border border-rose-500/30 bg-rose-950/90 text-rose-200"
          }`}
        >
          {feedback.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Top Header & Sub-Tab Switcher */}
      <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-[#0a1633]/60 p-5 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/20">
              <FileText size={18} />
            </span>
            <div>
              <h2 className="font-display text-lg font-bold text-white sm:text-xl">
                Technical Resources & Member Access
              </h2>
              <p className="text-xs text-indigo-200/70">
                Manage educational articles, attached PDF manuals, and paid member email/password accounts.
              </p>
            </div>
          </div>
        </div>

        {/* Sub-Tab Toggle Pills */}
        <div className="flex rounded-2xl border border-white/10 bg-white/5 p-1">
          <button
            type="button"
            onClick={() => setActiveSubTab("resources")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeSubTab === "resources"
                ? "bg-amber-400 text-[#0a1633] shadow-md"
                : "text-indigo-200 hover:text-white"
            }`}
          >
            <FileText size={14} />
            <span>Resource Articles ({resources.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab("members")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeSubTab === "members"
                ? "bg-amber-400 text-[#0a1633] shadow-md"
                : "text-indigo-200 hover:text-white"
            }`}
          >
            <Users size={14} />
            <span>Paid Members ({members.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab("plans")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeSubTab === "plans"
                ? "bg-amber-400 text-[#0a1633] shadow-md"
                : "text-indigo-200 hover:text-white"
            }`}
          >
            <Crown size={14} />
            <span>Plans & Pricing</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab("payments")}
            className={`relative flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeSubTab === "payments"
                ? "bg-amber-400 text-[#0a1633] shadow-md"
                : "text-indigo-200 hover:text-white"
            }`}
          >
            <CreditCard size={14} />
            <span>Payment Submissions ({payments.length})</span>
            {pendingPaymentsCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-black text-white shadow-sm">
                {pendingPaymentsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SUB-TAB 1: RESOURCE ARTICLES & ATTACHED PDFS                        */}
      {/* ==================================================================== */}
      {activeSubTab === "resources" && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-2.5">
              <div className="relative flex-1 min-w-[220px]">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-300/60" />
                <input
                  value={resSearch}
                  onChange={(e) => setResSearch(e.target.value)}
                  placeholder="Search articles by title, formula, category..."
                  className="w-full rounded-xl border border-white/15 bg-white/5 pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <select
                value={resCatFilter}
                onChange={(e) => setResCatFilter(e.target.value)}
                className="rounded-xl border border-white/15 bg-[#0a1633] px-3 py-2 text-xs font-medium text-white focus:border-amber-400 focus:outline-none"
              >
                <option value="All">All Categories ({resources.length})</option>
                {CATEGORY_PRESETS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={openAddResource}
              className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2 font-display text-xs font-bold text-[#0a1633] transition active:scale-95 hover:bg-amber-300 shadow-md shadow-amber-400/20 shrink-0"
            >
              <Plus size={15} />
              <span>Create Resource Article</span>
            </button>
          </div>

          {/* Resources Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredResources.map((res) => (
              <div
                key={res.id}
                className="group flex flex-col rounded-3xl border border-white/10 bg-white/[0.03] overflow-hidden backdrop-blur-sm transition hover:border-amber-400/30 hover:bg-white/[0.05]"
              >
                {/* Header Cover */}
                <div className="relative h-40 w-full overflow-hidden bg-slate-900">
                  <img
                    src={res.image}
                    alt={res.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060d22] via-transparent to-black/30" />

                  {/* Top Badges */}
                  <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-[#0a1633]/85 px-2.5 py-1 text-[10px] font-bold text-amber-300 backdrop-blur-md border border-white/10">
                      {res.category}
                    </span>
                    {res.accessTier === "premium" ? (
                      <span className="flex items-center gap-1 rounded-full bg-indigo-950/90 px-2.5 py-1 text-[10px] font-bold text-amber-300 border border-amber-400/40 shadow-sm">
                        <Crown size={10} className="text-amber-400" />
                        <span>Premium VIP</span>
                      </span>
                    ) : res.accessTier === "basic" ? (
                      <span className="flex items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-1 text-[10px] font-bold text-amber-300 border border-amber-400/40">
                        <Lock size={10} />
                        <span>Basic Plan</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 rounded-full bg-slate-800/90 px-2.5 py-1 text-[10px] font-bold text-slate-300 border border-white/20">
                        <Unlock size={10} />
                        <span>Open Manual</span>
                      </span>
                    )}
                  </div>

                  {/* Price Tag */}
                  <div className="absolute bottom-3 left-3">
                    <span className="rounded-lg bg-amber-400 px-2 py-1 text-[11px] font-mono2 font-bold text-[#0a1633] shadow-md">
                      {res.priceBadge || (res.accessTier === "premium" ? "499 BDT · VIP" : res.accessTier === "basic" ? "199 BDT · Basic" : "Free")}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="font-display line-clamp-2 text-sm font-bold text-white group-hover:text-amber-300">
                    {res.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-xs text-indigo-200/70">
                    {res.desc}
                  </p>

                  {/* Attached PDF Box */}
                  <div className="mt-3.5 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400">
                        <FileText size={14} />
                      </span>
                      <div className="truncate">
                        <p className="truncate font-semibold text-white text-[11px]">
                          {res.pdfTitle || "Technical_Document.pdf"}
                        </p>
                        <p className="text-[10px] text-indigo-300/60">
                          {res.pdfSize || "Official PDF"} · {res.pdfPages || 20} pages
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => downloadDenimUniversePdf(res)}
                        className="p-1.5 text-indigo-300 hover:text-amber-300 transition cursor-pointer"
                        title="Download Watermarked Denim Universe PDF"
                      >
                        <Download size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => previewAndPrintDenimUniversePdf(res)}
                        className="p-1.5 text-indigo-300 hover:text-amber-300 transition cursor-pointer"
                        title="Print / Save Watermarked PDF"
                      >
                        <Eye size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Footer Meta & Actions */}
                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/10">
                    <span className="text-[10.5px] text-indigo-300/60 font-mono2">
                      {res.readTime}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditResource(res)}
                        className="rounded-xl border border-white/10 bg-white/5 p-2 text-indigo-200 transition hover:bg-white/10 hover:text-white"
                        title="Edit Article & PDF"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteResource(res.id, res.title)}
                        className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-2 text-rose-400 transition hover:bg-rose-500/20"
                        title="Delete Resource"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredResources.length === 0 && (
              <div className="col-span-full rounded-3xl border border-dashed border-white/15 p-12 text-center">
                <FileText size={32} className="mx-auto text-indigo-300/40" />
                <p className="mt-3 text-sm font-semibold text-white">No technical resources found</p>
                <p className="mt-1 text-xs text-indigo-200/60">
                  Try adjusting your search filter or create a new resource article above.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 2: PAID MEMBER ACCOUNTS                                      */}
      {/* ==================================================================== */}
      {activeSubTab === "members" && (
        <div className="space-y-4">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-200/60">Total Members</p>
              <p className="font-display mt-1 text-xl font-extrabold text-white">{members.length}</p>
            </div>
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-3.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-400/80">Active Access</p>
              <p className="font-display mt-1 text-xl font-extrabold text-emerald-400">
                {members.filter((m) => m.status === "active").length}
              </p>
            </div>
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-3.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-400/80">Full Library Access</p>
              <p className="font-display mt-1 text-xl font-extrabold text-amber-400">
                {members.filter((m) => m.accessAll).length}
              </p>
            </div>
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-3.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-rose-400/80">Suspended</p>
              <p className="font-display mt-1 text-xl font-extrabold text-rose-400">
                {members.filter((m) => m.status === "suspended").length}
              </p>
            </div>
          </div>

          {/* Member Controls Bar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-2.5">
              <div className="relative flex-1 min-w-[220px]">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-300/60" />
                <input
                  value={memSearch}
                  onChange={(e) => setMemSearch(e.target.value)}
                  placeholder="Search members by email, name, or payment notes..."
                  className="w-full rounded-2xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-xs font-medium text-white placeholder:text-indigo-200/40 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <select
                value={memStatusFilter}
                onChange={(e) => setMemStatusFilter(e.target.value as any)}
                className="rounded-2xl border border-white/10 bg-[#0a1633] px-3.5 py-2.5 text-xs font-semibold text-indigo-100 focus:border-amber-400 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="suspended">Suspended Only</option>
              </select>
            </div>

            <button
              type="button"
              onClick={openAddMember}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-400 px-5 py-2.5 text-xs font-bold text-[#0a1633] shadow-lg shadow-amber-400/20 transition hover:bg-amber-300 active:scale-95"
            >
              <Plus size={16} />
              <span>Register Paid Member</span>
            </button>
          </div>

          {/* Members Table */}
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 font-mono2 text-[11px] uppercase tracking-wider text-indigo-200/60">
                    <th className="px-4 py-3.5">Member / Email</th>
                    <th className="px-4 py-3.5">Password</th>
                    <th className="px-4 py-3.5">Access Scope</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">Payment Reference</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredMembers.map((m) => (
                    <tr key={m.id} className="transition hover:bg-white/[0.04]">
                      {/* Name & Email */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300 font-bold font-mono2 border border-indigo-500/20">
                            {m.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm">{m.name}</p>
                            <p className="font-mono2 text-indigo-300/70 text-[11px]">{m.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Password */}
                      <td className="px-4 py-3.5">
                        <span className="font-mono2 rounded bg-white/5 px-2 py-1 text-amber-300 border border-white/10">
                          {m.password}
                        </span>
                      </td>

                      {/* Access Scope / Plan Tier */}
                      <td className="px-4 py-3.5">
                        {m.plan === "premium" || m.accessAll ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-indigo-950/80 px-2.5 py-1 text-[10.5px] font-bold text-amber-300 shadow-sm">
                            <Crown size={11} className="text-amber-400" />
                            <span>Premium VIP (All PDFs)</span>
                          </span>
                        ) : m.plan === "basic" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[10.5px] font-bold text-amber-300">
                            <BookOpen size={11} />
                            <span>Basic Plan (Standard PDFs)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-500/30 bg-slate-500/10 px-2.5 py-1 text-[10.5px] font-bold text-slate-300">
                            <User size={11} />
                            <span>Free Reader (No PDFs)</span>
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <button
                          type="button"
                          onClick={() => handleToggleMemberStatus(m)}
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-bold transition ${
                            m.status === "active"
                              ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                              : "border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20"
                          }`}
                          title="Click to toggle status"
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              m.status === "active" ? "bg-emerald-400" : "bg-rose-400"
                            }`}
                          />
                          <span className="capitalize">{m.status}</span>
                        </button>
                      </td>

                      {/* Payment Notes */}
                      <td className="px-4 py-3.5">
                        <span className="line-clamp-2 max-w-[200px] text-[11px] text-indigo-200/70">
                          {m.notes || "—"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openEditMember(m)}
                            className="rounded-xl border border-white/10 bg-white/5 p-2 text-indigo-200 transition hover:bg-white/10 hover:text-white"
                            title="Edit Member"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteMember(m.id, m.email)}
                            className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-2 text-rose-400 transition hover:bg-rose-500/20"
                            title="Delete Account"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredMembers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-indigo-200/60">
                        No members found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 3: MEMBERSHIP PLANS & PRICING                                */}
      {/* ==================================================================== */}
      {activeSubTab === "plans" && (
        <form onSubmit={handleSavePlanSettings} className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-amber-400/30 bg-amber-400/5 p-4">
            <div>
              <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                <Crown size={18} className="text-amber-400" />
                <span>Tiered Membership & Pricing Engine</span>
              </h3>
              <p className="text-xs text-indigo-200/70">
                Configure package prices, access perks, feature lists, and local payment accounts for the public packages modal.
              </p>
            </div>
            <button
              type="submit"
              className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-2 font-display text-xs font-bold text-[#0a1633] transition active:scale-95 hover:bg-amber-300 shadow-md shadow-amber-400/20"
            >
              <Save size={15} />
              <span>Save Plans & Pricing</span>
            </button>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Basic Plan Card */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300 border border-amber-400/30">
                    <BookOpen size={17} />
                  </span>
                  <div>
                    <h4 className="font-display text-sm font-bold text-white">Basic Plan Configuration</h4>
                    <p className="text-[11px] text-indigo-200/60">Standard technical formulas & loom SOPs</p>
                  </div>
                </div>
                <span className="rounded-full bg-amber-400/10 px-2.5 py-0.5 font-mono2 text-[10.5px] font-bold text-amber-300 border border-amber-400/30">
                  Basic Tier
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-indigo-200/70">
                    Plan Display Name
                  </label>
                  <input
                    value={planSettings.basicPlan?.name || ""}
                    onChange={(e) =>
                      setPlanSettings({
                        ...planSettings,
                        basicPlan: { ...planSettings.basicPlan, name: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-indigo-200/70">
                    Price in BDT (e.g., 199 BDT)
                  </label>
                  <input
                    value={planSettings.basicPlan?.price || ""}
                    onChange={(e) =>
                      setPlanSettings({
                        ...planSettings,
                        basicPlan: { ...planSettings.basicPlan, price: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-bold text-amber-300 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-indigo-200/70">
                    Access Period
                  </label>
                  <input
                    value={planSettings.basicPlan?.period || ""}
                    onChange={(e) =>
                      setPlanSettings({
                        ...planSettings,
                        basicPlan: { ...planSettings.basicPlan, period: e.target.value },
                      })
                    }
                    placeholder="e.g. Lifetime Access"
                    className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-indigo-200/70">
                    Badge Callout
                  </label>
                  <input
                    value={planSettings.basicPlan?.badge || ""}
                    onChange={(e) =>
                      setPlanSettings({
                        ...planSettings,
                        basicPlan: { ...planSettings.basicPlan, badge: e.target.value },
                      })
                    }
                    placeholder="e.g. Recommended for Technicians"
                    className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-indigo-200/70">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={planSettings.basicPlan?.description || ""}
                  onChange={(e) =>
                    setPlanSettings({
                      ...planSettings,
                      basicPlan: { ...planSettings.basicPlan, description: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-indigo-200/70">
                  Included Features (One bullet per line)
                </label>
                <textarea
                  rows={5}
                  value={basicFeaturesText}
                  onChange={(e) => setBasicFeaturesText(e.target.value)}
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                  className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none font-mono2"
                />
              </div>
            </div>

            {/* Premium VIP Plan Card */}
            <div className="rounded-3xl border border-amber-400/30 bg-gradient-to-b from-indigo-950/40 to-white/[0.02] p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40">
                    <Crown size={17} />
                  </span>
                  <div>
                    <h4 className="font-display text-sm font-bold text-white">Premium VIP Plan Configuration</h4>
                    <p className="text-[11px] text-indigo-200/60">Full access to ALL present & future PDF manuals</p>
                  </div>
                </div>
                <span className="rounded-full bg-gradient-to-r from-amber-400/20 to-indigo-500/20 px-2.5 py-0.5 font-mono2 text-[10.5px] font-bold text-amber-300 border border-amber-400/50">
                  VIP Master
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-indigo-200/70">
                    Plan Display Name
                  </label>
                  <input
                    value={planSettings.premiumPlan?.name || ""}
                    onChange={(e) =>
                      setPlanSettings({
                        ...planSettings,
                        premiumPlan: { ...planSettings.premiumPlan, name: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-indigo-200/70">
                    Price in BDT (e.g., 499 BDT)
                  </label>
                  <input
                    value={planSettings.premiumPlan?.price || ""}
                    onChange={(e) =>
                      setPlanSettings({
                        ...planSettings,
                        premiumPlan: { ...planSettings.premiumPlan, price: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-bold text-amber-300 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-indigo-200/70">
                    Access Period
                  </label>
                  <input
                    value={planSettings.premiumPlan?.period || ""}
                    onChange={(e) =>
                      setPlanSettings({
                        ...planSettings,
                        premiumPlan: { ...planSettings.premiumPlan, period: e.target.value },
                      })
                    }
                    placeholder="e.g. Lifetime VIP Access"
                    className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-indigo-200/70">
                    Badge Callout
                  </label>
                  <input
                    value={planSettings.premiumPlan?.badge || ""}
                    onChange={(e) =>
                      setPlanSettings({
                        ...planSettings,
                        premiumPlan: { ...planSettings.premiumPlan, badge: e.target.value },
                      })
                    }
                    placeholder="e.g. Full Access — Everything Unlocked"
                    className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-indigo-200/70">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={planSettings.premiumPlan?.description || ""}
                  onChange={(e) =>
                    setPlanSettings({
                      ...planSettings,
                      premiumPlan: { ...planSettings.premiumPlan, description: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-indigo-200/70">
                  Included Features (One bullet per line)
                </label>
                <textarea
                  rows={5}
                  value={premiumFeaturesText}
                  onChange={(e) => setPremiumFeaturesText(e.target.value)}
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                  className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none font-mono2"
                />
              </div>
            </div>
          </div>

          {/* Payment Details & WhatsApp Section */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
            <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <CreditCard size={18} />
              </span>
              <div>
                <h4 className="font-display text-sm font-bold text-white">Payment Accounts & Activation Instructions</h4>
                <p className="text-[11px] text-indigo-200/60">Displayed to visitors when paying via bKash, Nagad, Bank, or WhatsApp</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-indigo-200/70">
                  bKash Account Number
                </label>
                <input
                  value={planSettings.paymentMethods?.bkash || ""}
                  onChange={(e) =>
                    setPlanSettings({
                      ...planSettings,
                      paymentMethods: { ...planSettings.paymentMethods, bkash: e.target.value },
                    })
                  }
                  placeholder="e.g. 017XXXXXXXX (Personal)"
                  className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-mono2 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-indigo-200/70">
                  Nagad Account Number
                </label>
                <input
                  value={planSettings.paymentMethods?.nagad || ""}
                  onChange={(e) =>
                    setPlanSettings({
                      ...planSettings,
                      paymentMethods: { ...planSettings.paymentMethods, nagad: e.target.value },
                    })
                  }
                  placeholder="e.g. 017XXXXXXXX (Personal)"
                  className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-mono2 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-indigo-200/70">
                  WhatsApp Support / Activation
                </label>
                <input
                  value={planSettings.paymentMethods?.whatsapp || ""}
                  onChange={(e) =>
                    setPlanSettings({
                      ...planSettings,
                      paymentMethods: { ...planSettings.paymentMethods, whatsapp: e.target.value },
                    })
                  }
                  placeholder="e.g. +8801700000000"
                  className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-mono2 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-indigo-200/70">
                  Bank Transfer Account
                </label>
                <input
                  value={planSettings.paymentMethods?.bank || ""}
                  onChange={(e) =>
                    setPlanSettings({
                      ...planSettings,
                      paymentMethods: { ...planSettings.paymentMethods, bank: e.target.value },
                    })
                  }
                  placeholder="e.g. Bank name & Account No."
                  className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-indigo-200/70">
                Payment Verification Notice
              </label>
              <textarea
                rows={2}
                value={planSettings.paymentMethods?.notice || ""}
                onChange={(e) =>
                  setPlanSettings({
                    ...planSettings,
                    paymentMethods: { ...planSettings.paymentMethods, notice: e.target.value },
                  })
                }
                placeholder="Instructions for sending TrxID after payment..."
                className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none resize-none"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-amber-400 px-6 py-2.5 font-display text-xs font-bold text-[#0a1633] transition active:scale-95 hover:bg-amber-300 shadow-lg shadow-amber-400/20"
              >
                <Save size={15} />
                <span>Save All Changes</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 4: PAYMENT SUBMISSIONS & PLAN ACTIVATION QUEUE               */}
      {/* ==================================================================== */}
      {activeSubTab === "payments" && (
        <div className="space-y-4">
          {/* Controls & Filter Bar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-2.5">
              <div className="relative min-w-[220px] flex-1">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-300/60" />
                <input
                  value={paySearch}
                  onChange={(e) => setPaySearch(e.target.value)}
                  placeholder="Search by name, email, TrxID, or plan..."
                  className="w-full rounded-xl border border-white/15 bg-white/5 pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
                />
              </div>

              {/* Status Filter */}
              <select
                value={payStatusFilter}
                onChange={(e) => setPayStatusFilter(e.target.value as any)}
                className="rounded-xl border border-white/15 bg-[#0a1633] px-3 py-2 text-xs font-medium text-white focus:border-amber-400 focus:outline-none"
              >
                <option value="all">All Statuses ({payments.length})</option>
                <option value="pending">Pending Review ({pendingPaymentsCount})</option>
                <option value="approved">Approved & Active</option>
                <option value="rejected">Rejected</option>
              </select>

              {/* Type Filter */}
              <select
                value={payTypeFilter}
                onChange={(e) => setPayTypeFilter(e.target.value as any)}
                className="rounded-xl border border-white/15 bg-[#0a1633] px-3 py-2 text-xs font-medium text-white focus:border-amber-400 focus:outline-none"
              >
                <option value="all">All Types</option>
                <option value="plan">Plan Subscriptions</option>
                <option value="single_pdf">Single PDF Purchases</option>
              </select>
            </div>
          </div>

          {/* Pending Alert Banner if any pending */}
          {pendingPaymentsCount > 0 && (
            <div className="flex items-center gap-3 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-amber-200">
              <Clock size={20} className="shrink-0 text-amber-400" />
              <div className="text-xs">
                <p className="font-bold">
                  {pendingPaymentsCount} Plan Payment {pendingPaymentsCount === 1 ? "Submission Requires" : "Submissions Require"} Verification
                </p>
                <p className="text-amber-200/80">
                  Verify the Transaction ID with your bKash/Nagad/Bank statement and click "Approve & Activate" to grant instant access.
                </p>
              </div>
            </div>
          )}

          {/* Payments List / Table */}
          {filteredPayments.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-12 text-center">
              <CreditCard className="mx-auto mb-3 text-indigo-300/40" size={40} />
              <h4 className="text-base font-bold text-white">No Payment Submissions Found</h4>
              <p className="mt-1 text-xs text-indigo-200/60">
                {paySearch || payStatusFilter !== "all"
                  ? "Try resetting your search filters."
                  : "When users submit payment for a plan or single PDF, their TrxID and screenshot proof will appear here."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPayments.map((pay) => (
                <div
                  key={pay.id}
                  className={`flex flex-col justify-between gap-4 rounded-2xl border p-5 transition sm:flex-row sm:items-center ${
                    pay.status === "pending"
                      ? "border-amber-400/40 bg-amber-400/[0.04] shadow-lg shadow-amber-400/5"
                      : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    {/* Top Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-300">
                        {pay.paymentType === "single_pdf" ? "Single PDF Purchase" : "Plan Subscription"}
                      </span>

                      {pay.status === "approved" && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/20 px-2 py-0.5 text-[11px] font-bold text-emerald-300">
                          <CheckCircle2 size={12} />
                          Active / Approved
                        </span>
                      )}
                      {pay.status === "pending" && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/20 px-2 py-0.5 text-[11px] font-bold text-amber-300">
                          <Clock size={12} />
                          Pending Review
                        </span>
                      )}
                      {pay.status === "rejected" && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/20 px-2 py-0.5 text-[11px] font-bold text-rose-300">
                          <XCircle size={12} />
                          Rejected
                        </span>
                      )}

                      <span className="rounded-md bg-indigo-500/20 px-2 py-0.5 text-[11px] font-mono2 font-bold text-indigo-300 uppercase">
                        {pay.method}
                      </span>
                    </div>

                    {/* Member & Item */}
                    <div className="mt-2">
                      <h4 className="text-base font-bold text-white flex flex-wrap items-center gap-2">
                        <span>{pay.memberName}</span>
                        <span className="text-xs font-normal text-indigo-200/60 font-mono2">
                          ({pay.memberEmail})
                        </span>
                      </h4>
                      <p className="text-xs text-amber-300 font-semibold mt-0.5">
                        {pay.paymentType === "single_pdf"
                          ? `Document: ${pay.resourceTitle || "Technical Resource"}`
                          : `Plan: ${pay.planName || (pay.planId === "premium" ? "Premium VIP Lifetime" : "Basic Plan")}`}
                        <span className="text-white ml-2">Amount: {pay.amount}</span>
                      </p>
                    </div>

                    {/* Details: Sender Number, Date, Admin Notes */}
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      {pay.senderNumber && (
                        <span>Sender Number: <strong className="text-white">{pay.senderNumber}</strong></span>
                      )}
                      <span>Submitted: {new Date(pay.createdAt).toLocaleString()}</span>
                      {pay.adminNotes && (
                        <span className="text-amber-200/80 italic">• Note: {pay.adminNotes}</span>
                      )}
                    </div>
                  </div>

                  {/* Right side: TrxID, Screenshot Thumbnail, and Action Buttons */}
                  <div className="flex flex-col items-start gap-3 shrink-0 sm:items-end">
                    {/* TrxID box */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-xs font-mono font-bold text-amber-300">
                        <span>TrxID: {pay.trxId}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyTrx(pay.trxId)}
                          className="text-slate-400 hover:text-white transition ml-1"
                          title="Copy TrxID"
                        >
                          {copiedTrx === pay.trxId ? (
                            <Check size={13} className="text-emerald-400" />
                          ) : (
                            <Copy size={13} />
                          )}
                        </button>
                      </div>

                      {/* Screenshot thumbnail if uploaded */}
                      {pay.screenshotUrl && (
                        <button
                          type="button"
                          onClick={() => setPreviewScreenshot(pay.screenshotUrl || null)}
                          className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-indigo-200 hover:bg-white/10 hover:text-white transition"
                          title="View Payment Proof Screenshot"
                        >
                          <Eye size={13} />
                          <span>Proof</span>
                        </button>
                      )}
                    </div>

                    {/* Actions: Approve / Reject / Delete */}
                    <div className="flex items-center gap-2">
                      {pay.status === "pending" && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleApprovePayment(pay.id, pay.memberName)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 shadow-md transition hover:bg-emerald-400 active:scale-95"
                          >
                            <CheckCircle2 size={13} />
                            <span>Approve & Activate</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRejectPayment(pay.id)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-1.5 text-xs font-bold text-rose-300 transition hover:bg-rose-500/20 active:scale-95"
                          >
                            <XCircle size={13} />
                            <span>Reject</span>
                          </button>
                        </>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDeletePayment(pay.id)}
                        className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:bg-rose-500/20 hover:text-rose-300"
                        title="Delete Record"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Proof Preview Modal */}
          {previewScreenshot && (
            <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
              <div className="relative max-h-[90vh] max-w-2xl rounded-3xl border border-white/15 bg-[#0a1633] p-4 text-white">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h4 className="text-sm font-bold text-white">Payment Proof Screenshot</h4>
                  <button
                    type="button"
                    onClick={() => setPreviewScreenshot(null)}
                    className="rounded-xl bg-white/5 p-1.5 text-slate-400 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="mt-4 flex justify-center overflow-auto max-h-[75vh]">
                  <img
                    src={previewScreenshot}
                    alt="Payment Proof"
                    className="max-w-full rounded-xl object-contain ring-1 ring-white/20"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 1: ADD / EDIT RESOURCE ARTICLE & PDF                           */}
      {/* ==================================================================== */}
      {resourceModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col rounded-3xl border border-white/15 bg-[#0a1633] text-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div>
                <h3 className="font-display text-lg font-bold text-white">
                  {editingResource ? "Edit Resource Article & PDF" : "New Educational Resource Article"}
                </h3>
                <p className="text-xs text-indigo-200/70">
                  Publish industrial knowledge with attached technical PDF manual download.
                </p>
              </div>
              <button
                onClick={() => setResourceModalOpen(false)}
                className="rounded-xl bg-white/5 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveResource} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-indigo-200/70">
                  Article Title *
                </label>
                <input
                  required
                  value={rTitle}
                  onChange={(e) => setRTitle(e.target.value)}
                  placeholder="e.g., Industrial Indigo Slashing & Mercerizing SOP"
                  className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
                />
              </div>

              {/* Category & Read Time */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-indigo-200/70">
                    Category *
                  </label>
                  <input
                    required
                    list="category-suggestions"
                    value={rCategory}
                    onChange={(e) => setRCategory(e.target.value)}
                    placeholder="Select or enter category..."
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
                  />
                  <datalist id="category-suggestions">
                    {CATEGORY_PRESETS.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-indigo-200/70">
                    Estimated Read Time
                  </label>
                  <input
                    value={rReadTime}
                    onChange={(e) => setRReadTime(e.target.value)}
                    placeholder="e.g., 8 min read"
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Author */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-indigo-200/70">
                  Author Byline
                </label>
                <input
                  value={rAuthor}
                  onChange={(e) => setRAuthor(e.target.value)}
                  placeholder="Engr. Asif Jahan · Senior Wet Process Specialist"
                  className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
                />
              </div>

              {/* Summary / Excerpt */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-indigo-200/70">
                  Short Summary / Excerpt *
                </label>
                <textarea
                  required
                  rows={2}
                  value={rDesc}
                  onChange={(e) => setRDesc(e.target.value)}
                  placeholder="A concise 1-2 sentence overview shown on resource cards and search results..."
                  className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
                />
              </div>

              {/* Cover Image Upload / URL */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-indigo-200/70">
                    Cover Image
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setRImageMode("upload")}
                      className={`text-[11px] font-bold transition ${
                        rImageMode === "upload" ? "text-amber-300 underline" : "text-indigo-300/60"
                      }`}
                    >
                      File Upload
                    </button>
                    <span className="text-white/20">|</span>
                    <button
                      type="button"
                      onClick={() => setRImageMode("url")}
                      className={`text-[11px] font-bold transition ${
                        rImageMode === "url" ? "text-amber-300 underline" : "text-indigo-300/60"
                      }`}
                    >
                      Direct URL
                    </button>
                  </div>
                </div>

                {rImageMode === "upload" ? (
                  <div className="mt-2 flex items-center gap-4">
                    <label className="flex flex-1 cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-dashed border-white/20 bg-white/5 px-4 py-3 text-xs font-semibold text-indigo-200 transition hover:border-amber-400/50 hover:bg-white/10">
                      {uploadingImage ? <Loader2 size={16} className="animate-spin text-amber-400" /> : <Upload size={16} />}
                      <span>{uploadingImage ? "Uploading to Cloud..." : "Choose Image File (JPG, PNG, WEBP)"}</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                    {rImage && (
                      <img src={rImage} alt="Preview" className="h-12 w-20 rounded-lg object-cover ring-1 ring-white/20" />
                    )}
                  </div>
                ) : (
                  <input
                    value={rImage}
                    onChange={(e) => setRImage(e.target.value)}
                    placeholder="https://images.pexels.com/..."
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
                  />
                )}
              </div>

              {/* PDF ACCESS RESTRICTION TIER */}
              <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-4 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400/20 text-amber-400">
                    <Lock size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white uppercase tracking-wider">
                      Technical PDF Access Tier
                    </p>
                    <p className="text-[11px] text-indigo-200/70">
                      Determine which membership plan is required to download this manual.
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setRAccessTier("basic");
                      setRIsPremium(true);
                      setRPriceBadge("199 BDT · Basic Plan");
                    }}
                    className={`flex flex-col gap-1 rounded-2xl border p-3.5 text-left transition ${
                      rAccessTier === "basic"
                        ? "border-amber-400 bg-amber-400/10 text-white shadow-md shadow-amber-400/10"
                        : "border-white/10 bg-white/5 text-indigo-200/70 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-amber-300">Basic Plan</span>
                      <span className="font-mono2 text-[10.5px] font-bold text-amber-400">199 BDT</span>
                    </div>
                    <span className="text-[11px] leading-tight text-indigo-200/70">
                      Unlocked for Basic & Premium VIP members.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRAccessTier("premium");
                      setRIsPremium(true);
                      setRPriceBadge("499 BDT · Premium VIP");
                    }}
                    className={`flex flex-col gap-1 rounded-2xl border p-3.5 text-left transition ${
                      rAccessTier === "premium"
                        ? "border-amber-400 bg-amber-400/10 text-white shadow-md shadow-amber-400/10"
                        : "border-white/10 bg-white/5 text-indigo-200/70 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-amber-300 flex items-center gap-1">
                        <Crown size={12} /> Premium VIP
                      </span>
                      <span className="font-mono2 text-[10.5px] font-bold text-amber-400">499 BDT</span>
                    </div>
                    <span className="text-[11px] leading-tight text-indigo-200/70">
                      Exclusive high-level manual for VIP members only.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRAccessTier("free");
                      setRIsPremium(false);
                      setRPriceBadge("Open Manual");
                    }}
                    className={`flex flex-col gap-1 rounded-2xl border p-3.5 text-left transition ${
                      rAccessTier === "free"
                        ? "border-emerald-400 bg-emerald-400/10 text-white shadow-md shadow-emerald-400/10"
                        : "border-white/10 bg-white/5 text-indigo-200/70 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-emerald-300">Open Access</span>
                      <span className="font-mono2 text-[10.5px] font-bold text-emerald-400">Open</span>
                    </div>
                    <span className="text-[11px] leading-tight text-indigo-200/70">
                      Free for everyone, no login or purchase needed.
                    </span>
                  </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 pt-2 border-t border-white/10">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-indigo-200/70">
                      Price / Plan Badge Text
                    </label>
                    <input
                      value={rPriceBadge}
                      onChange={(e) => setRPriceBadge(e.target.value)}
                      placeholder="e.g., 199 BDT · Basic Plan"
                      className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-indigo-200/70">
                      Single PDF Price (Pay-Per-Doc)
                    </label>
                    <input
                      value={rSinglePrice}
                      onChange={(e) => setRSinglePrice(e.target.value)}
                      placeholder="e.g., 49 BDT"
                      className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-bold text-amber-300 placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-200/70">
                      Active Access Rule
                    </p>
                    <p className="mt-1 text-xs text-amber-300">
                      {rAccessTier === "premium"
                        ? "🔒 Requires Premium VIP Plan (499 BDT) or Single Purchase."
                        : rAccessTier === "basic"
                        ? "⭐ Requires Basic Plan (199 BDT) or Single Purchase."
                        : "🔓 Open: Free for all visitors to download."}
                    </p>
                  </div>
                </div>
              </div>

              {/* ATTACHED PDF SECTION */}
              <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-rose-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      Attached Technical PDF Manual
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setRPdfMode("upload")}
                      className={`text-[11px] font-bold transition ${
                        rPdfMode === "upload" ? "text-amber-300 underline" : "text-indigo-300/60"
                      }`}
                    >
                      Upload PDF
                    </button>
                    <span className="text-white/20">|</span>
                    <button
                      type="button"
                      onClick={() => setRPdfMode("url")}
                      className={`text-[11px] font-bold transition ${
                        rPdfMode === "url" ? "text-amber-300 underline" : "text-indigo-300/60"
                      }`}
                    >
                      Paste PDF URL
                    </button>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-indigo-200/70">
                      PDF Document Name
                    </label>
                    <input
                      required
                      value={rPdfTitle}
                      onChange={(e) => setRPdfTitle(e.target.value)}
                      placeholder="e.g., Denim_Indigo_Slashing_Recipe_SOP.pdf"
                      className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-indigo-200/70">
                        File Size
                      </label>
                      <input
                        value={rPdfSize}
                        onChange={(e) => setRPdfSize(e.target.value)}
                        placeholder="e.g., 4.8 MB"
                        className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-indigo-200/70">
                        Pages
                      </label>
                      <input
                        type="number"
                        value={rPdfPages}
                        onChange={(e) => setRPdfPages(Number(e.target.value))}
                        placeholder="35"
                        className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {rPdfMode === "upload" ? (
                  <div>
                    <label className="flex cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-dashed border-rose-400/30 bg-rose-500/5 px-4 py-3 text-xs font-semibold text-rose-200 transition hover:border-rose-400 hover:bg-rose-500/10">
                      {uploadingPdf ? <Loader2 size={16} className="animate-spin text-rose-400" /> : <Upload size={16} />}
                      <span>{uploadingPdf ? "Uploading PDF to Storage..." : "Select & Upload PDF Document (.pdf)"}</span>
                      <input type="file" accept=".pdf" onChange={handlePdfUpload} className="hidden" />
                    </label>
                    {rPdfUrl && (
                      <p className="mt-1.5 text-[11px] text-emerald-400 flex items-center gap-1">
                        <Check size={12} />
                        <span className="truncate">URL: {rPdfUrl}</span>
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      value={rPdfUrl}
                      onChange={(e) => setRPdfUrl(e.target.value)}
                      placeholder="https://example.com/files/document.pdf"
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* ARTICLE WRITING / CONTENT */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-indigo-200/70">
                    Full Educational Article Content (Markdown Supported) *
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setContentTab("write")}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                        contentTab === "write" ? "bg-amber-400 text-[#0a1633]" : "text-indigo-200 hover:text-white"
                      }`}
                    >
                      Write
                    </button>
                    <button
                      type="button"
                      onClick={() => setContentTab("preview")}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                        contentTab === "preview" ? "bg-amber-400 text-[#0a1633]" : "text-indigo-200 hover:text-white"
                      }`}
                    >
                      Preview
                    </button>
                  </div>
                </div>

                {contentTab === "write" ? (
                  <textarea
                    required
                    rows={12}
                    value={rContent}
                    onChange={(e) => setRContent(e.target.value)}
                    placeholder="Write detailed industrial explanations, procedures, parameters, and observations..."
                    className="mt-2 w-full font-mono2 rounded-2xl border border-white/15 bg-white/5 p-4 text-xs leading-relaxed text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
                  />
                ) : (
                  <div className="mt-2 max-h-72 overflow-y-auto rounded-2xl border border-white/15 bg-white/5 p-4 text-xs leading-relaxed text-indigo-100 space-y-3">
                    {rContent.split("\n\n").map((chunk, idx) => {
                      if (chunk.startsWith("### ")) {
                        return (
                          <h4 key={idx} className="font-bold text-amber-300 text-sm mt-3 first:mt-0">
                            {chunk.replace("### ", "")}
                          </h4>
                        );
                      }
                      if (chunk.startsWith("---")) {
                        return <hr key={idx} className="border-white/10 my-2" />;
                      }
                      return <p key={idx}>{chunk}</p>;
                    })}
                  </div>
                )}
                <p className="mt-1.5 text-[11px] text-indigo-300/50">
                  Tip: Use <code className="text-amber-300">### Section Title</code> for headings,{" "}
                  <code className="text-amber-300">- point</code> for bullets, and separate paragraphs with an empty line.
                </p>
              </div>

              {/* Save / Cancel Bar */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setResourceModalOpen(false)}
                  className="rounded-xl border border-white/10 px-5 py-2.5 text-xs font-bold text-slate-300 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-400 px-6 py-2.5 text-xs font-bold text-[#0a1633] shadow-lg shadow-amber-400/20 transition hover:bg-amber-300 active:scale-95"
                >
                  {editingResource ? "Save Changes" : "Publish Resource Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 2: REGISTER / EDIT PAID MEMBER ACCOUNT                         */}
      {/* ==================================================================== */}
      {memberModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative flex max-h-[90vh] w-full max-w-xl flex-col rounded-3xl border border-white/15 bg-[#0a1633] text-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400">
                  <User size={18} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-white">
                    {editingMember ? "Edit Paid Member Account" : "Register New Paid Member"}
                  </h3>
                  <p className="text-xs text-indigo-200/70">
                    Set up email and password credentials for paying PDF resource downloads.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMemberModalOpen(false)}
                className="rounded-xl bg-white/5 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveMember} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-indigo-200/70">
                  Member / Company Name *
                </label>
                <input
                  required
                  value={mName}
                  onChange={(e) => setMName(e.target.value)}
                  placeholder="e.g., Tariqul Islam or Rahman Denim Mills"
                  className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
                />
              </div>

              {/* Email & Password */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-indigo-200/70">
                    Login Email Address *
                  </label>
                  <input
                    required
                    type="email"
                    value={mEmail}
                    onChange={(e) => setMEmail(e.target.value)}
                    placeholder="member@company.com"
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-indigo-200/70">
                    Password *
                  </label>
                  <input
                    required
                    type="text"
                    value={mPassword}
                    onChange={(e) => setMPassword(e.target.value)}
                    placeholder="Set member password"
                    className="mt-1.5 w-full font-mono2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-amber-300 placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-indigo-200/70">
                  Account Status
                </label>
                <div className="mt-1.5 flex gap-3">
                  <label className="flex items-center gap-2 cursor-pointer rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold">
                    <input
                      type="radio"
                      name="mStatus"
                      value="active"
                      checked={mStatus === "active"}
                      onChange={() => setMStatus("active")}
                      className="text-amber-400 focus:ring-0"
                    />
                    <span className="text-emerald-300">Active (Can Log In & Download)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold">
                    <input
                      type="radio"
                      name="mStatus"
                      value="suspended"
                      checked={mStatus === "suspended"}
                      onChange={() => setMStatus("suspended")}
                      className="text-amber-400 focus:ring-0"
                    />
                    <span className="text-rose-300">Suspended</span>
                  </label>
                </div>
              </div>

              {/* Membership Plan Tier */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-indigo-200/70">
                  Membership Plan Tier *
                </label>
                <div className="mt-1.5 grid gap-2.5 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => {
                      setMPlan("premium");
                      setMAccessAll(true);
                    }}
                    className={`flex items-center gap-2 rounded-xl border p-3 text-left transition ${
                      mPlan === "premium"
                        ? "border-amber-400 bg-amber-400/15 text-white shadow-sm"
                        : "border-white/10 bg-white/5 text-indigo-200 hover:bg-white/10"
                    }`}
                  >
                    <Crown size={17} className="text-amber-400 shrink-0" />
                    <div>
                      <p className="font-bold text-xs text-amber-300">Premium VIP</p>
                      <p className="text-[10.5px] text-indigo-200/70">All technical PDFs</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMPlan("basic");
                      setMAccessAll(false);
                    }}
                    className={`flex items-center gap-2 rounded-xl border p-3 text-left transition ${
                      mPlan === "basic"
                        ? "border-amber-400 bg-amber-400/15 text-white shadow-sm"
                        : "border-white/10 bg-white/5 text-indigo-200 hover:bg-white/10"
                    }`}
                  >
                    <BookOpen size={17} className="text-amber-400 shrink-0" />
                    <div>
                      <p className="font-bold text-xs text-amber-300">Basic Plan</p>
                      <p className="text-[10.5px] text-indigo-200/70">Basic factory PDFs</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMPlan("free");
                      setMAccessAll(false);
                    }}
                    className={`flex items-center gap-2 rounded-xl border p-3 text-left transition ${
                      mPlan === "free"
                        ? "border-slate-400 bg-white/15 text-white shadow-sm"
                        : "border-white/10 bg-white/5 text-indigo-200 hover:bg-white/10"
                    }`}
                  >
                    <User size={17} className="text-slate-400 shrink-0" />
                    <div>
                      <p className="font-bold text-xs text-slate-200">Free Account</p>
                      <p className="text-[10.5px] text-indigo-200/70">Articles only</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Access Scope Options */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white uppercase tracking-wider">
                      Individual Resource Overrides
                    </p>
                    <p className="text-[11px] text-indigo-200/70">
                      Optionally hand-pick specific individual PDF manuals if not using standard tier rules.
                    </p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={mAccessAll}
                      onChange={(e) => setMAccessAll(e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-white/20 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-amber-400 peer-checked:after:translate-x-full peer-checked:after:bg-[#0a1633]"></div>
                  </label>
                </div>

                {mAccessAll ? (
                  <div className="rounded-xl bg-indigo-500/10 p-3 text-xs text-indigo-200 border border-indigo-500/20 flex items-center gap-2">
                    <Sparkles size={16} className="text-amber-400 shrink-0" />
                    <span>
                      <strong>Full Access Active:</strong> This member can download all technical PDF manuals without individual restrictions.
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <p className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                      Select Specific Permitted PDF Resources:
                    </p>
                    <div className="max-h-48 overflow-y-auto space-y-1.5 rounded-xl bg-black/20 p-2">
                      {resources.map((res) => (
                        <label
                          key={res.id}
                          className="flex items-center gap-2.5 rounded-lg p-2 text-xs font-medium text-white hover:bg-white/5 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={mAllowedIds.includes(res.id)}
                            onChange={() => handleToggleMemberResource(res.id)}
                            className="rounded text-amber-400 focus:ring-0"
                          />
                          <span className="truncate">{res.title}</span>
                          <span className="ml-auto text-[10px] text-indigo-300/60 font-mono2">
                            {res.priceBadge}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Payment & Order Notes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-indigo-200/70">
                  Payment Reference & Notes
                </label>
                <textarea
                  rows={2}
                  value={mNotes}
                  onChange={(e) => setMNotes(e.target.value)}
                  placeholder="e.g., bKash TrxID #89381923, 2,500 BDT received. Requested Indigo Slashing SOP."
                  className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setMemberModalOpen(false)}
                  className="rounded-xl border border-white/10 px-5 py-2.5 text-xs font-bold text-slate-300 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-400 px-6 py-2.5 text-xs font-bold text-[#0a1633] shadow-lg shadow-amber-400/20 transition hover:bg-amber-300 active:scale-95"
                >
                  {editingMember ? "Update Member" : "Save Member Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
