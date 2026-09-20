import React, { useState } from "react";
import {
  Lock,
  Mail,
  Key,
  X,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  Eye,
  EyeOff,
  Sparkles,
  User,
  Check,
  Crown,
  Copy,
  BookOpen,
  HelpCircle,
  CreditCard,
  Upload,
  Phone,
  Clock,
} from "lucide-react";
import { Modal } from "./common";
import { useData } from "../context/DataContext";

export default function MemberLoginModal() {
  const {
    isMemberLoginModalOpen,
    setIsMemberLoginModalOpen,
    memberAuthMode,
    setMemberAuthMode,
    memberLogin,
    memberSignUp,
    currentMember,
    membershipSettings,
    siteConfig,
    openCheckout,
    openMemberProfile,
  } = useData();

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<"free" | "basic" | "premium">("basic");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Payment states for Basic / Premium signup
  const [paymentMethod, setPaymentMethod] = useState<"bkash" | "nagad" | "bank">("bkash");
  const [senderNumber, setSenderNumber] = useState("");
  const [trxId, setTrxId] = useState("");
  const [screenshotDataUrl, setScreenshotDataUrl] = useState<string>("");

  // Under Review confirmation screen after paid plan registration
  const [underReviewState, setUnderReviewState] = useState<{
    name: string;
    email: string;
    planName: string;
    planPrice: string;
    trxId: string;
    method: string;
    screenshotAttached: boolean;
  } | null>(null);

  if (!isMemberLoginModalOpen) return null;

  const handleClose = () => {
    setUnderReviewState(null);
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsMemberLoginModalOpen(false);
  };

  const handleCopy = (text: string, key: string) => {
    const cleanNumber = text.split(" ")[0];
    navigator.clipboard.writeText(cleanNumber || text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      setErrorMsg("Screenshot size must be under 3MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setScreenshotDataUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setSubmitting(true);

    try {
      const result = memberLogin(email, password);
      if (result.success) {
        setSuccessMsg(result.message);
        setTimeout(() => {
          setIsMemberLoginModalOpen(false);
          setEmail("");
          setPassword("");
          setSuccessMsg(null);
        }, 800);
      } else {
        setErrorMsg(result.message);
      }
    } catch {
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // If Basic or Premium is selected, Transaction ID is strictly required
    if (selectedPlan !== "free") {
      const cleanTrx = trxId.trim().toUpperCase();
      if (!cleanTrx || cleanTrx.length < 5) {
        setErrorMsg(
          `Please enter your Transaction ID (at least 5 characters) to complete registration for the ${
            selectedPlan === "basic" ? "Basic Plan (199 BDT)" : "Premium VIP Plan (499 BDT)"
          }.`
        );
        return;
      }
    }

    setSubmitting(true);

    try {
      const result = memberSignUp({
        name,
        email,
        password,
        plan: selectedPlan,
        payment:
          selectedPlan !== "free"
            ? {
                method: paymentMethod,
                senderNumber: senderNumber.trim() || undefined,
                trxId: trxId.trim().toUpperCase(),
                screenshotUrl: screenshotDataUrl || undefined,
              }
            : undefined,
      });

      if (result.success) {
        if (result.paymentPending) {
          // Switch modal to dedicated "Activation Under Review" view
          setUnderReviewState({
            name: name.trim() || email.split("@")[0],
            email: email.trim().toLowerCase(),
            planName: selectedPlan === "basic" ? "Basic Plan" : "Premium VIP Plan",
            planPrice:
              selectedPlan === "basic"
                ? membershipSettings.basicPlan?.price || "199 BDT"
                : membershipSettings.premiumPlan?.price || "499 BDT",
            trxId: trxId.trim().toUpperCase(),
            method: paymentMethod,
            screenshotAttached: !!screenshotDataUrl,
          });
          setName("");
          setEmail("");
          setPassword("");
          setTrxId("");
          setSenderNumber("");
          setScreenshotDataUrl("");
          setErrorMsg(null);
          setSuccessMsg(null);
        } else {
          setSuccessMsg(result.message);
          setTimeout(() => {
            setIsMemberLoginModalOpen(false);
            setName("");
            setEmail("");
            setPassword("");
            setSuccessMsg(null);
          }, 900);
        }
      } else {
        setErrorMsg(result.message);
      }
    } catch {
      setErrorMsg("An error occurred during registration. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoCredentials = (type: "basic" | "premium") => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setMemberAuthMode("signin");
    if (type === "basic") {
      setEmail("basic@denimuniverse.com");
      setPassword("denim2026");
    } else {
      setEmail("demo@denimuniverse.com");
      setPassword("denim2026");
    }
  };

  const bkashNumber = membershipSettings?.paymentMethods?.bkash || "01700000000 (Personal)";
  const nagadNumber = membershipSettings?.paymentMethods?.nagad || "01800000000 (Personal)";

  const whatsappPhone =
    membershipSettings?.paymentMethods?.whatsapp?.replace(/[^0-9]/g, "") ||
    siteConfig?.whatsapp?.replace(/[^0-9]/g, "") ||
    "8801700000000";

  const getWhatsAppLink = (planName: string) => {
    const userEmail = currentMember?.email || email || "my account";
    const msg = encodeURIComponent(
      `Hello Denim Universe! I want to activate the ${planName} for ${userEmail}. Please provide payment instructions.`
    );
    return `https://wa.me/${whatsappPhone}?text=${msg}`;
  };

  return (
    <Modal
      open={isMemberLoginModalOpen}
      onClose={handleClose}
      wide={memberAuthMode === "packages" || !!underReviewState}
    >
      <div className="relative overflow-hidden rounded-3xl bg-[#0a1633] text-white">
        {underReviewState ? (
          /* ================================================================= */
          /* ACTIVATION UNDER REVIEW CONFIRMATION VIEW                          */
          /* ================================================================= */
          <div>
            {/* Review Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-7 bg-amber-500/10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400/20 text-amber-400 ring-1 ring-amber-400/30">
                  <Clock size={20} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-white sm:text-lg">
                    Registration Complete — Activation Under Review
                  </h3>
                  <p className="text-xs text-amber-200/80">
                    Payment verification in progress. Our admin verifies all Transaction IDs manually.
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="rounded-xl bg-white/5 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Review Content */}
            <div className="p-5 sm:p-7 space-y-5">
              {/* Security / Anti-Fraud Info Banner */}
              <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 sm:p-5 text-amber-200">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-400/20 text-amber-400">
                    <ShieldCheck size={18} />
                  </div>
                  <div className="text-xs space-y-1.5 leading-relaxed">
                    <p className="font-bold text-sm text-amber-300">
                      Why is my package activation under review?
                    </p>
                    <p className="text-amber-200/90">
                      To protect Denim Universe against fake or invalid Transaction IDs, all{" "}
                      <strong className="text-white">Basic ({membershipSettings.basicPlan?.price || "199 BDT"})</strong> and{" "}
                      <strong className="text-white">Premium VIP ({membershipSettings.premiumPlan?.price || "499 BDT"})</strong>{" "}
                      packages require manual verification by our administration before full download access to technical PDFs is enabled.
                    </p>
                    <p className="text-amber-200/80">
                      Your account is currently active on the <strong className="text-white">Free tier</strong>. You can sign in immediately to explore all documents, research summaries, and free publications. As soon as admin verifies your Transaction ID with our bKash/Nagad merchant statement, your package will be activated instantly!
                    </p>
                  </div>
                </div>
              </div>

              {/* Submitted Payment & Account Summary Card */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Submitted Registration Details
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 text-[11px] font-bold text-amber-300">
                    <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                    Pending Admin Approval
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                    <div className="text-slate-400">Member Account</div>
                    <div className="font-semibold text-white mt-0.5">{underReviewState.name}</div>
                    <div className="text-slate-400 text-[11px] mt-0.5 flex items-center gap-1">
                      <Mail size={11} className="text-slate-500" />
                      {underReviewState.email}
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                    <div className="text-slate-400">Selected Package</div>
                    <div className="font-bold text-amber-300 mt-0.5 flex items-center gap-1.5">
                      <Crown size={13} className="text-amber-400" />
                      {underReviewState.planName}
                    </div>
                    <div className="text-slate-400 text-[11px] mt-0.5">
                      Amount: <strong className="text-white">{underReviewState.planPrice}</strong>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                    <div className="text-slate-400">Payment Gateway</div>
                    <div className="font-bold text-white uppercase mt-0.5">
                      {underReviewState.method}
                    </div>
                    <div className="text-slate-400 text-[11px] mt-0.5">
                      Proof Screenshot:{" "}
                      {underReviewState.screenshotAttached ? (
                        <span className="text-emerald-400 font-semibold inline-flex items-center gap-1">
                          <Check size={11} /> Attached
                        </span>
                      ) : (
                        <span className="text-slate-400">None attached</span>
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-3">
                    <div className="text-amber-300/80 font-medium">Submitted TrxID</div>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="font-mono text-sm font-bold text-white tracking-wider">
                        {underReviewState.trxId}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(underReviewState.trxId, "review-trx")}
                        className="inline-flex items-center gap-1 rounded-lg border border-amber-400/30 bg-amber-400/10 px-2 py-1 text-[11px] font-bold text-amber-300 hover:bg-amber-400/20 transition cursor-pointer"
                      >
                        {copiedKey === "review-trx" ? (
                          <>
                            <Check size={11} className="text-emerald-400" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={11} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* What Happens Next steps */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-xs space-y-2.5">
                <span className="font-bold uppercase tracking-wider text-slate-300 text-[11px] block">
                  What Happens Next?
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-400/20 text-[11px] font-bold text-amber-400">
                      1
                    </span>
                    <span className="text-slate-300">
                      Admin matches your Transaction ID against our merchant statement.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-400/20 text-[11px] font-bold text-amber-400">
                      2
                    </span>
                    <span className="text-slate-300">
                      Upon confirmation, full package access is enabled automatically.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-400/20 text-[11px] font-bold text-amber-400">
                      3
                    </span>
                    <span className="text-slate-300">
                      You can check your status anytime from your Member Profile.
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    openMemberProfile();
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 py-3 text-xs font-bold text-slate-950 hover:brightness-110 shadow-lg shadow-amber-500/20 transition cursor-pointer"
                >
                  <User size={15} />
                  <span>View Status in Member Profile</span>
                </button>

                <a
                  href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                    `Hello Denim Universe! I just registered for ${underReviewState.planName} (${underReviewState.planPrice}) with TrxID: ${underReviewState.trxId} for ${underReviewState.email}. Please verify and activate my account.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition"
                >
                  <MessageCircle size={15} />
                  <span>Fast-Track via WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={handleClose}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
                >
                  <span>Explore Library (Free Tier)</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Top Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/20">
              {memberAuthMode === "packages" ? <Crown size={19} /> : <Lock size={18} />}
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-white sm:text-lg">
                {memberAuthMode === "signin" && "Member Access & Sign In"}
                {memberAuthMode === "signup" && "Create Member Account"}
                {memberAuthMode === "packages" && "Technical Resource Packages"}
              </h3>
              <p className="text-xs text-indigo-200/70">
                {memberAuthMode === "packages"
                  ? "Select a plan to download industrial denim SOPs and laboratory manuals."
                  : "Access protected technical PDF downloads & factory manuals."}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="rounded-xl bg-white/5 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation Switcher */}
        <div className="flex border-b border-white/10 bg-white/[0.02] px-5 sm:px-7">
          <button
            type="button"
            onClick={() => {
              setErrorMsg(null);
              setSuccessMsg(null);
              setMemberAuthMode("signin");
            }}
            className={`border-b-2 py-3 px-4 text-xs font-bold transition ${
              memberAuthMode === "signin"
                ? "border-amber-400 text-amber-300"
                : "border-transparent text-indigo-200/70 hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setErrorMsg(null);
              setSuccessMsg(null);
              setMemberAuthMode("signup");
            }}
            className={`border-b-2 py-3 px-4 text-xs font-bold transition ${
              memberAuthMode === "signup"
                ? "border-amber-400 text-amber-300"
                : "border-transparent text-indigo-200/70 hover:text-white"
            }`}
          >
            Create Account (Sign Up)
          </button>
          <button
            type="button"
            onClick={() => {
              setErrorMsg(null);
              setSuccessMsg(null);
              setMemberAuthMode("packages");
            }}
            className={`border-b-2 py-3 px-4 text-xs font-bold transition flex items-center gap-1.5 ${
              memberAuthMode === "packages"
                ? "border-amber-400 text-amber-300"
                : "border-transparent text-indigo-200/70 hover:text-white"
            }`}
          >
            <Sparkles size={12} className="text-amber-400" />
            <span>Packages & Pricing</span>
          </button>
        </div>

        {/* Notifications & Status Alerts */}
        <div className="px-5 pt-4 sm:px-7">
          {errorMsg && (
            <div className="flex items-center gap-2.5 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-200 animate-fade-in">
              <AlertCircle size={16} className="shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-200 animate-fade-in">
              <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* ================================================================= */}
        {/* 1. SIGN IN FORM                                                   */}
        {/* ================================================================= */}
        {memberAuthMode === "signin" && (
          <form onSubmit={handleSignInSubmit} className="p-5 sm:p-7 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-200/70">
                Email Address
              </label>
              <div className="relative mt-1.5">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-300/60" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="member@company.com"
                  className="w-full rounded-2xl border border-white/15 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-indigo-200/70">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="flex items-center gap-1 text-[11px] text-indigo-300/80 hover:text-white"
                >
                  {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                  <span>{showPassword ? "Hide" : "Show"}</span>
                </button>
              </div>
              <div className="relative mt-1.5">
                <Key size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-300/60" />
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your member password"
                  className="w-full rounded-2xl border border-white/15 bg-white/5 py-3 pl-10 pr-10 text-sm text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none font-mono2"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-amber-400 py-3 text-sm font-bold text-[#0a1633] shadow-lg shadow-amber-400/20 transition hover:bg-amber-300 active:scale-95 disabled:opacity-50"
            >
              <Lock size={16} />
              <span>{submitting ? "Authenticating..." : "Sign In & Unlock PDFs"}</span>
            </button>

            {/* Quick Demo Logins Bar */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 text-center">
              <p className="text-[11px] font-semibold text-indigo-200/70">Instant One-Click Demo Testing:</p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => fillDemoCredentials("basic")}
                  className="rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-400/20 transition active:scale-95"
                >
                  Demo Basic Member
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoCredentials("premium")}
                  className="rounded-xl border border-indigo-400/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-bold text-indigo-200 hover:bg-indigo-500/20 transition active:scale-95"
                >
                  Demo Premium VIP Member
                </button>
              </div>
            </div>

            {/* Switch to Sign Up */}
            <div className="pt-2 text-center text-xs text-indigo-200/70">
              Don't have an account yet?{" "}
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setSuccessMsg(null);
                  setMemberAuthMode("signup");
                }}
                className="font-bold text-amber-300 underline hover:text-amber-200 ml-1"
              >
                Sign Up here
              </button>
            </div>
          </form>
        )}

        {/* ================================================================= */}
        {/* 2. SIGN UP (SELF REGISTRATION) FORM                               */}
        {/* ================================================================= */}
        {memberAuthMode === "signup" && (
          <form onSubmit={handleSignUpSubmit} className="p-5 sm:p-7 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-200/70">
                Full Name / Company
              </label>
              <div className="relative mt-1.5">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-300/60" />
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Tariqul Islam or Rahman Textile"
                  className="w-full rounded-2xl border border-white/15 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-200/70">
                Email Address *
              </label>
              <div className="relative mt-1.5">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-300/60" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full rounded-2xl border border-white/15 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-indigo-200/70">
                  Password *
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="flex items-center gap-1 text-[11px] text-indigo-300/80 hover:text-white"
                >
                  {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                  <span>{showPassword ? "Hide" : "Show"}</span>
                </button>
              </div>
              <div className="relative mt-1.5">
                <Key size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-300/60" />
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password (min 4 chars)"
                  className="w-full rounded-2xl border border-white/15 bg-white/5 py-3 pl-10 pr-10 text-sm text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none font-mono2"
                />
              </div>
            </div>

            {/* Select Plan during registration */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-200/70">
                Select Initial Membership Package
              </label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPlan("free")}
                  className={`rounded-xl border p-2.5 text-center transition ${
                    selectedPlan === "free"
                      ? "border-emerald-400 bg-emerald-500/10 text-emerald-300 font-bold"
                      : "border-white/10 bg-white/5 text-indigo-200 hover:bg-white/10"
                  }`}
                >
                  <p className="text-xs font-bold">Free</p>
                  <p className="text-[10px] text-indigo-300/60">Read Articles</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPlan("basic")}
                  className={`rounded-xl border p-2.5 text-center transition ${
                    selectedPlan === "basic"
                      ? "border-amber-400 bg-amber-400/15 text-amber-300 font-bold ring-1 ring-amber-400/40"
                      : "border-white/10 bg-white/5 text-indigo-200 hover:bg-white/10"
                  }`}
                >
                  <p className="text-xs font-bold">Basic Plan</p>
                  <p className="text-[10px] text-amber-300/80">{membershipSettings.basicPlan.price}</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPlan("premium")}
                  className={`rounded-xl border p-2.5 text-center transition ${
                    selectedPlan === "premium"
                      ? "border-indigo-400 bg-indigo-500/20 text-indigo-200 font-bold ring-1 ring-indigo-400/40"
                      : "border-white/10 bg-white/5 text-indigo-200 hover:bg-white/10"
                  }`}
                >
                  <p className="text-xs font-bold">Premium VIP</p>
                  <p className="text-[10px] text-indigo-300">{membershipSettings.premiumPlan.price}</p>
                </button>
              </div>
            </div>

            {/* Free Plan Information Banner */}
            {selectedPlan === "free" && (
              <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-3.5 text-xs text-emerald-300">
                <div className="flex items-center gap-2 font-bold text-emerald-300">
                  <CheckCircle2 size={15} className="text-emerald-400" />
                  <span>Free Member Account</span>
                </div>
                <p className="mt-1 text-[11.5px] text-emerald-200/80 leading-relaxed">
                  Immediate free access to online technical articles and knowledge base. No payment required.
                </p>
              </div>
            )}

            {/* Basic / Premium Payment Gateway Section */}
            {selectedPlan !== "free" && (
              <div className="space-y-3.5 rounded-2xl border border-amber-400/30 bg-amber-400/5 p-4">
                {/* Header & Payable Amount */}
                <div className="flex items-center justify-between border-b border-amber-400/20 pb-3">
                  <div>
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-amber-300">
                      Payment Required For {selectedPlan === "basic" ? "Basic Plan" : "Premium VIP Plan"}
                    </span>
                    <p className="text-[11.5px] text-slate-300 mt-0.5">
                      Send money via bKash / Nagad Personal, then enter your TrxID below:
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="block text-[9.5px] uppercase font-bold text-amber-200/60">Payable</span>
                    <span className="text-base font-black text-amber-400">
                      {selectedPlan === "basic"
                        ? membershipSettings.basicPlan?.price || "199 BDT"
                        : membershipSettings.premiumPlan?.price || "499 BDT"}
                    </span>
                  </div>
                </div>

                {/* bKash & Nagad Accounts with Copy */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="rounded-xl border border-pink-500/25 bg-pink-500/10 p-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-pink-300 uppercase">bKash (Personal)</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(bkashNumber, "bkash")}
                        className="flex items-center gap-1 text-[10px] text-pink-200 hover:text-white transition cursor-pointer"
                      >
                        {copiedKey === "bkash" ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                        <span>{copiedKey === "bkash" ? "Copied!" : "Copy"}</span>
                      </button>
                    </div>
                    <p className="mt-1 font-mono text-xs font-bold text-white tracking-wide">{bkashNumber}</p>
                  </div>

                  <div className="rounded-xl border border-orange-500/25 bg-orange-500/10 p-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-orange-300 uppercase">Nagad (Personal)</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(nagadNumber, "nagad")}
                        className="flex items-center gap-1 text-[10px] text-orange-200 hover:text-white transition cursor-pointer"
                      >
                        {copiedKey === "nagad" ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                        <span>{copiedKey === "nagad" ? "Copied!" : "Copy"}</span>
                      </button>
                    </div>
                    <p className="mt-1 font-mono text-xs font-bold text-white tracking-wide">{nagadNumber}</p>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-indigo-200/70">
                    Payment Method Used *
                  </label>
                  <div className="mt-1.5 grid grid-cols-3 gap-2">
                    {(["bkash", "nagad", "bank"] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setPaymentMethod(m)}
                        className={`rounded-xl border py-2 text-center text-xs font-bold capitalize transition ${
                          paymentMethod === m
                            ? "border-amber-400 bg-amber-400/20 text-amber-300 shadow-sm"
                            : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                        }`}
                      >
                        {m === "bank" ? "Bank" : m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sender Mobile Number (Optional) */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-indigo-200/70">
                    Sender Mobile Number (Optional)
                  </label>
                  <div className="relative mt-1">
                    <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-300/60" />
                    <input
                      type="text"
                      value={senderNumber}
                      onChange={(e) => setSenderNumber(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className="w-full rounded-xl border border-white/15 bg-white/5 py-2 pl-9 pr-3 font-mono text-xs text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Transaction ID (Required) */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-300">
                      Transaction ID (TrxID) *
                    </label>
                    <span className="text-[10px] text-amber-200/70">From bKash / Nagad SMS</span>
                  </div>
                  <div className="relative mt-1">
                    <CheckCircle2 size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400" />
                    <input
                      required
                      type="text"
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      placeholder="e.g., BLK92A87X or 9H43B12"
                      className="w-full rounded-xl border border-amber-400/40 bg-amber-400/10 py-2.5 pl-9 pr-3 font-mono text-xs font-bold text-white placeholder:text-amber-200/30 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Payment Proof Screenshot (Optional) */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-indigo-200/70">
                    Payment Proof Screenshot (Optional)
                  </label>
                  <div className="mt-1">
                    {screenshotDataUrl ? (
                      <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <img
                            src={screenshotDataUrl}
                            alt="Screenshot preview"
                            className="h-8 w-8 rounded object-cover border border-emerald-400/30"
                          />
                          <span className="text-xs text-emerald-300 truncate">Screenshot attached</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setScreenshotDataUrl("")}
                          className="text-xs font-bold text-red-400 hover:text-red-300 px-2 cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/5 py-2.5 px-3 text-xs text-indigo-200 hover:border-amber-400 hover:bg-white/10 transition">
                        <Upload size={14} className="text-amber-400" />
                        <span>Upload payment screenshot</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleScreenshotChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-amber-400 py-3 text-sm font-bold text-[#0a1633] shadow-lg shadow-amber-400/20 transition hover:bg-amber-300 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <User size={16} />
              <span>
                {submitting
                  ? "Processing Registration..."
                  : selectedPlan === "free"
                  ? "Create Free Account"
                  : `Pay ${
                      selectedPlan === "basic"
                        ? membershipSettings.basicPlan?.price || "199 BDT"
                        : membershipSettings.premiumPlan?.price || "499 BDT"
                    } & Complete Registration`}
              </span>
            </button>

            {/* Switch to Sign In */}
            <div className="pt-2 text-center text-xs text-indigo-200/70">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setSuccessMsg(null);
                  setMemberAuthMode("signin");
                }}
                className="font-bold text-amber-300 underline hover:text-amber-200 ml-1"
              >
                Sign In here
              </button>
            </div>
          </form>
        )}

        {/* ================================================================= */}
        {/* 3. PACKAGES & PRICING COMPARISON                                  */}
        {/* ================================================================= */}
        {memberAuthMode === "packages" && (
          <div className="p-5 sm:p-7 space-y-6">
            {/* Cards Grid */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* BASIC PLAN CARD */}
              <div className="flex flex-col justify-between rounded-3xl border border-amber-400/30 bg-gradient-to-b from-amber-400/10 via-white/[0.02] to-transparent p-5 sm:p-6">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-amber-400/20 px-3 py-1 text-[11px] font-bold text-amber-300">
                      {membershipSettings.basicPlan.badge || "Basic Tier"}
                    </span>
                    <span className="font-mono2 text-xl font-extrabold text-white">
                      {membershipSettings.basicPlan.price}
                    </span>
                  </div>

                  <h4 className="font-display mt-3 text-lg font-bold text-white">
                    {membershipSettings.basicPlan.name}
                  </h4>
                  <p className="mt-1 text-xs text-indigo-200/70">
                    {membershipSettings.basicPlan.description}
                  </p>

                  <div className="mt-4 space-y-2 border-t border-white/10 pt-4">
                    {membershipSettings.basicPlan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-indigo-100">
                        <Check size={14} className="mt-0.5 shrink-0 text-amber-400" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMemberLoginModalOpen(false);
                      openCheckout({
                        type: "plan",
                        planId: "basic",
                        planName: membershipSettings.basicPlan.name || "Basic Technical Plan",
                        planPrice: membershipSettings.basicPlan.price || "199 BDT",
                      });
                    }}
                    className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl bg-amber-400 py-2.5 text-xs font-bold text-[#0a1633] transition hover:bg-amber-300 active:scale-95 cursor-pointer shadow-md"
                  >
                    <CreditCard size={15} />
                    <span>Activate Basic Plan ({membershipSettings.basicPlan.price})</span>
                  </button>
                </div>
              </div>

              {/* PREMIUM VIP PLAN CARD */}
              <div className="relative flex flex-col justify-between rounded-3xl border-2 border-indigo-500/50 bg-gradient-to-b from-indigo-500/20 via-indigo-950/30 to-[#060d22] p-5 sm:p-6 shadow-xl shadow-indigo-950/50">
                <div className="absolute -top-3 right-6 rounded-full bg-indigo-500 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow">
                  UNLIMITED
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-[11px] font-bold text-indigo-200 border border-indigo-400/30">
                      {membershipSettings.premiumPlan.badge || "All Unlocked"}
                    </span>
                    <span className="font-mono2 text-2xl font-extrabold text-amber-300">
                      {membershipSettings.premiumPlan.price}
                    </span>
                  </div>

                  <h4 className="font-display mt-3 text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles size={18} className="text-amber-400" />
                    <span>{membershipSettings.premiumPlan.name}</span>
                  </h4>
                  <p className="mt-1 text-xs text-indigo-200/70">
                    {membershipSettings.premiumPlan.description}
                  </p>

                  <div className="mt-4 space-y-2 border-t border-white/10 pt-4">
                    {membershipSettings.premiumPlan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-indigo-100">
                        <Check size={14} className="mt-0.5 shrink-0 text-emerald-400" />
                        <span className="font-medium">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMemberLoginModalOpen(false);
                      openCheckout({
                        type: "plan",
                        planId: "premium",
                        planName: membershipSettings.premiumPlan.name || "Premium Master SOP Plan",
                        planPrice: membershipSettings.premiumPlan.price || "499 BDT",
                      });
                    }}
                    className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-300 py-2.5 text-xs font-bold text-[#0a1633] shadow-lg shadow-amber-400/30 transition hover:brightness-105 active:scale-95 cursor-pointer"
                  >
                    <Crown size={15} />
                    <span>Activate Premium Plan ({membershipSettings.premiumPlan.price})</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Payment Details & Manual Payment Activation */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs space-y-3">
              <p className="font-bold text-white flex items-center gap-2 text-xs uppercase tracking-wider">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>Payment Methods & Instant Activation</span>
              </p>
              <p className="text-indigo-200/80 leading-relaxed text-[11.5px]">
                {membershipSettings.paymentMethods.notice}
              </p>

              <div className="grid gap-2 sm:grid-cols-2 pt-2 border-t border-white/10">
                {membershipSettings.paymentMethods.bkash && (
                  <div className="flex items-center justify-between rounded-xl bg-black/20 p-2.5">
                    <div>
                      <p className="font-mono2 text-[10px] uppercase text-rose-400 font-bold">bKash (Personal)</p>
                      <p className="font-mono2 text-xs text-white">{membershipSettings.paymentMethods.bkash}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(membershipSettings.paymentMethods.bkash || "", "bkash")}
                      className="p-1 text-indigo-300 hover:text-white"
                      title="Copy Number"
                    >
                      {copiedKey === "bkash" ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    </button>
                  </div>
                )}

                {membershipSettings.paymentMethods.nagad && (
                  <div className="flex items-center justify-between rounded-xl bg-black/20 p-2.5">
                    <div>
                      <p className="font-mono2 text-[10px] uppercase text-amber-400 font-bold">Nagad (Personal)</p>
                      <p className="font-mono2 text-xs text-white">{membershipSettings.paymentMethods.nagad}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(membershipSettings.paymentMethods.nagad || "", "nagad")}
                      className="p-1 text-indigo-300 hover:text-white"
                      title="Copy Number"
                    >
                      {copiedKey === "nagad" ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsMemberLoginModalOpen(false);
                    openCheckout({
                      type: "plan",
                      planId: "premium",
                      planName: membershipSettings.premiumPlan.name || "Membership Plan",
                      planPrice: membershipSettings.premiumPlan.price || "499 BDT",
                    });
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-amber-400/40 bg-amber-400/10 py-2.5 text-xs font-bold text-amber-300 hover:bg-amber-400/20 transition cursor-pointer"
                >
                  <CreditCard size={14} />
                  <span>Already sent money? Submit Transaction ID & Payment Proof</span>
                </button>
              </div>
            </div>
          </div>
        )}
          </>
        )}
      </div>
    </Modal>
  );
}
