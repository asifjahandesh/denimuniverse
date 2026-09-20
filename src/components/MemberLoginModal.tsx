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

  if (!isMemberLoginModalOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
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
    setSubmitting(true);

    try {
      const result = memberSignUp({
        name,
        email,
        password,
        plan: selectedPlan,
      });

      if (result.success) {
        setSuccessMsg(result.message);
        setTimeout(() => {
          setIsMemberLoginModalOpen(false);
          setName("");
          setEmail("");
          setPassword("");
          setSuccessMsg(null);
        }, 900);
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
      onClose={() => setIsMemberLoginModalOpen(false)}
      wide={memberAuthMode === "packages"}
    >
      <div className="relative overflow-hidden rounded-3xl bg-[#0a1633] text-white">
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
            onClick={() => setIsMemberLoginModalOpen(false)}
            className="rounded-xl bg-white/5 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
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

            <button
              type="submit"
              disabled={submitting}
              className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-amber-400 py-3 text-sm font-bold text-[#0a1633] shadow-lg shadow-amber-400/20 transition hover:bg-amber-300 active:scale-95 disabled:opacity-50"
            >
              <User size={16} />
              <span>{submitting ? "Registering..." : "Create Account & Get Started"}</span>
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
      </div>
    </Modal>
  );
}
