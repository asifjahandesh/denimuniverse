import React, { useState, useEffect } from "react";
import {
  X,
  CreditCard,
  CheckCircle2,
  Copy,
  Check,
  Upload,
  Crown,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Phone,
  Building2,
  ExternalLink,
  Eye,
} from "lucide-react";
import { Modal } from "./common";
import { useData } from "../context/DataContext";
import { ResourceItem, PaymentRecord } from "../types/content";

export default function CheckoutModal() {
  const {
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    checkoutTarget,
    currentMember,
    membershipSettings,
    submitPayment,
    openMemberProfile,
    openMemberModal,
    openPdfReader,
  } = useData();

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [method, setMethod] = useState<"bkash" | "nagad" | "bank" | "other">("bkash");
  const [senderNumber, setSenderNumber] = useState("");
  const [trxId, setTrxId] = useState("");
  const [screenshotDataUrl, setScreenshotDataUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Success State
  const [completedPayment, setCompletedPayment] = useState<PaymentRecord | null>(null);
  const [autoUnlocked, setAutoUnlocked] = useState(false);

  // Copy state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (isCheckoutModalOpen) {
      setErrorMsg(null);
      setCompletedPayment(null);
      setAutoUnlocked(false);
      setTrxId("");
      setSenderNumber("");
      setScreenshotDataUrl("");
      if (currentMember) {
        setName(currentMember.name || "");
        setEmail(currentMember.email || "");
      } else {
        setName("");
        setEmail("");
      }
    }
  }, [isCheckoutModalOpen, currentMember]);

  if (!isCheckoutModalOpen || !checkoutTarget) return null;

  const isSinglePdf = checkoutTarget.type === "single_pdf";
  const resource: ResourceItem | undefined = checkoutTarget.resource;

  // Pricing
  const itemName = isSinglePdf
    ? `${resource?.title || "Technical Document"} (Single PDF)`
    : checkoutTarget.planName || "Membership Plan";

  const itemPrice = isSinglePdf
    ? resource?.singlePrice || "49 BDT"
    : checkoutTarget.planPrice || (checkoutTarget.planId === "basic" ? (membershipSettings?.basicPlan?.price || "199 BDT") : (membershipSettings?.premiumPlan?.price || "499 BDT"));

  // Payment receiver details
  const bkashNumber = membershipSettings?.paymentMethods?.bkash || "01700000000 (Personal)";
  const nagadNumber = membershipSettings?.paymentMethods?.nagad || "01800000000 (Personal)";
  const bankDetails =
    membershipSettings?.paymentMethods?.bank || "City Bank / DBBL / Brac Bank (Available on request)";

  const handleCopy = (text: string, key: string) => {
    const cleanNumber = text.split(" ")[0]; // clean just the number if formatted
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanTrx = trxId.trim().toUpperCase();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMsg("Please enter a valid email address to associate your access.");
      return;
    }

    if (!cleanTrx || cleanTrx.length < 5) {
      setErrorMsg("Please enter a valid Transaction ID (at least 5 alphanumeric characters).");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = submitPayment({
        memberName: name.trim() || cleanEmail.split("@")[0],
        memberEmail: cleanEmail,
        paymentType: isSinglePdf ? "single_pdf" : "plan",
        planId: checkoutTarget.planId,
        planName: checkoutTarget.planName,
        resourceId: resource?.id,
        resourceTitle: resource?.title,
        amount: itemPrice,
        method,
        senderNumber: senderNumber.trim() || undefined,
        trxId: cleanTrx,
        screenshotUrl: screenshotDataUrl || undefined,
      });

      setCompletedPayment(result.payment);
      setAutoUnlocked(result.autoActivated);
    } catch {
      setErrorMsg("Failed to submit payment. Please try again or contact support.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={isCheckoutModalOpen}
      onClose={() => setIsCheckoutModalOpen(false)}
      wide
    >
      <div className="relative overflow-hidden rounded-3xl bg-[#0a1633] text-white">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/20">
              <CreditCard size={19} />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-white sm:text-lg">
                {isSinglePdf ? "Secure Document Checkout" : "Membership Plan Checkout"}
              </h3>
              <p className="text-xs text-slate-400">
                In-app payment processing via bKash, Nagad, or Bank
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCheckoutModalOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white"
            aria-label="Close modal"
          >
            <X size={17} />
          </button>
        </div>

        {/* COMPLETED SUCCESS SCREEN */}
        {completedPayment ? (
          <div className="p-6 text-center sm:p-9">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 ring-8 ring-emerald-500/10">
              <CheckCircle2 size={36} />
            </div>

            {autoUnlocked ? (
              <>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
                  <Sparkles size={14} /> INSTANT AUTO-UNLOCKED
                </span>
                <h3 className="mt-3 font-display text-xl font-bold text-white sm:text-2xl">
                  Payment Verified! Document Unlocked
                </h3>
                <p className="mx-auto mt-2 max-w-md text-xs text-slate-300 sm:text-sm">
                  Your transaction ID (<strong className="font-mono text-amber-400">{completedPayment.trxId}</strong>) has been verified. You can now read this technical manual in the protected viewer anytime.
                </p>

                {resource && (
                  <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCheckoutModalOpen(false);
                        openPdfReader(resource);
                      }}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-amber-400/20 transition active:scale-95 hover:brightness-110 cursor-pointer"
                    >
                      <Eye size={16} />
                      <span>View PDF SOP</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCheckoutModalOpen(false);
                        openMemberProfile();
                      }}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 cursor-pointer"
                    >
                      View in My Library
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-300">
                  <Check size={14} /> SUBMISSION RECEIVED
                </span>
                <h3 className="mt-3 font-display text-xl font-bold text-white sm:text-2xl">
                  Payment Submitted for Admin Verification
                </h3>
                <p className="mx-auto mt-2 max-w-md text-xs text-slate-300 sm:text-sm">
                  Thank you! Your payment with Transaction ID <strong className="font-mono text-amber-400">{completedPayment.trxId}</strong> has been forwarded to the Admin Panel. Your {completedPayment.planName} will be activated as soon as it is reviewed.
                </p>

                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => {
                      setIsCheckoutModalOpen(false);
                      openMemberProfile();
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-amber-300"
                  >
                    Check Status in Profile
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          /* PAYMENT FORM & INSTRUCTIONS */
          <div className="grid grid-cols-1 gap-0 divide-y divide-white/10 lg:grid-cols-12 lg:divide-x lg:divide-y-0">
            {/* Left Column: Order Summary & Payment Numbers (5 cols) */}
            <div className="bg-white/[0.02] p-5 sm:p-7 lg:col-span-5">
              {/* Selected Item Card */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Item to purchase
                </span>
                <h4 className="mt-1 font-display text-base font-bold text-white">
                  {itemName}
                </h4>
                {isSinglePdf && resource?.category && (
                  <p className="text-xs text-slate-400">Category: {resource.category}</p>
                )}
                <div className="mt-3 flex items-baseline justify-between border-t border-white/10 pt-3">
                  <span className="text-xs text-slate-400">Payable Amount:</span>
                  <span className="text-xl font-extrabold text-amber-400 sm:text-2xl">
                    {itemPrice}
                  </span>
                </div>
              </div>

              {/* Step-by-step instructions */}
              <div className="mt-5 space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Step 1: Send Money to Receiver
                </h5>

                {/* bKash */}
                <div className="rounded-xl border border-white/10 bg-gradient-to-r from-pink-950/20 to-pink-900/10 p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-pink-400">bKash (Send Money)</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(bkashNumber, "bkash")}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-300 transition hover:text-white"
                    >
                      {copiedKey === "bkash" ? (
                        <Check size={13} className="text-emerald-400" />
                      ) : (
                        <Copy size={13} />
                      )}
                      <span>Copy Number</span>
                    </button>
                  </div>
                  <p className="mt-1 font-mono text-sm font-bold text-white">{bkashNumber}</p>
                </div>

                {/* Nagad */}
                <div className="rounded-xl border border-white/10 bg-gradient-to-r from-orange-950/20 to-orange-900/10 p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-orange-400">Nagad (Send Money)</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(nagadNumber, "nagad")}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-300 transition hover:text-white"
                    >
                      {copiedKey === "nagad" ? (
                        <Check size={13} className="text-emerald-400" />
                      ) : (
                        <Copy size={13} />
                      )}
                      <span>Copy Number</span>
                    </button>
                  </div>
                  <p className="mt-1 font-mono text-sm font-bold text-white">{nagadNumber}</p>
                </div>

                {/* Bank info */}
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-300">
                    <Building2 size={13} className="text-amber-400" />
                    <span>Bank Transfer Option:</span>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed">{bankDetails}</p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-amber-400/20 bg-amber-400/5 p-3 text-xs text-amber-200">
                <p className="font-semibold">⚡ Instant Document Unlocking:</p>
                <p className="mt-0.5 text-[11px] text-amber-200/80">
                  {isSinglePdf
                    ? "Single PDFs unlock immediately once you submit your Transaction ID."
                    : "Membership plans are verified by our team and activated promptly."}
                </p>
              </div>
            </div>

            {/* Right Column: Submission Form (7 cols) */}
            <div className="p-5 sm:p-7 lg:col-span-7">
              <form onSubmit={handleSubmit} className="space-y-4">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Step 2: Enter Transaction Details
                </h5>

                {errorMsg && (
                  <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                    <AlertCircle size={15} className="shrink-0 text-rose-400" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Email and Name */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-300">
                      Your Email Address <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="e.g. yourname@company.com"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-base text-white placeholder-slate-500 outline-none transition focus:border-amber-400 focus:bg-white/10 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-300">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Asif Jahan"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-base text-white placeholder-slate-500 outline-none transition focus:border-amber-400 focus:bg-white/10 sm:text-sm"
                    />
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-300">
                    Payment Method Used <span className="text-rose-400">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["bkash", "nagad", "bank"] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMethod(m)}
                        className={`rounded-xl border py-2 text-xs font-bold capitalize transition ${
                          method === m
                            ? "border-amber-400 bg-amber-400/20 text-amber-300 ring-1 ring-amber-400/30"
                            : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {m === "bkash" ? "bKash" : m === "nagad" ? "Nagad" : "Bank"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sender Number and TrxID */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-300">
                      Sender Phone / Account (Optional)
                    </label>
                    <input
                      type="text"
                      value={senderNumber}
                      onChange={(e) => setSenderNumber(e.target.value)}
                      placeholder="e.g. 017XXXXXXXX"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-base text-white placeholder-slate-500 outline-none transition focus:border-amber-400 focus:bg-white/10 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-300">
                      Transaction ID (TrxID) <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                      required
                      placeholder="e.g. BK9X84J21L"
                      className="w-full rounded-xl border border-amber-400/40 bg-white/5 px-3.5 py-2.5 font-mono text-base font-bold text-amber-300 placeholder-slate-500 outline-none transition focus:border-amber-400 focus:bg-white/10 focus:ring-1 focus:ring-amber-400 sm:text-sm"
                    />
                  </div>
                </div>

                {/* Payment Proof Screenshot (Not mandatory) */}
                <div>
                  <label className="mb-1 flex items-center justify-between text-xs font-medium text-slate-300">
                    <span>Payment Screenshot Proof</span>
                    <span className="text-[11px] text-slate-500">(Optional)</span>
                  </label>
                  <label className="flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-white/20 bg-white/[0.02] px-4 py-3 transition hover:border-amber-400/40 hover:bg-white/[0.04]">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Upload size={16} className="text-amber-400" />
                      <span>
                        {screenshotDataUrl ? "Screenshot selected (Click to replace)" : "Choose screenshot image"}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleScreenshotChange}
                      className="hidden"
                    />
                    {screenshotDataUrl && (
                      <span className="text-xs font-bold text-emerald-400">Attached</span>
                    )}
                  </label>
                  {screenshotDataUrl && (
                    <div className="mt-2 flex items-center gap-2">
                      <img
                        src={screenshotDataUrl}
                        alt="Proof preview"
                        className="h-12 w-12 rounded-lg object-cover ring-1 ring-white/20"
                      />
                      <button
                        type="button"
                        onClick={() => setScreenshotDataUrl("")}
                        className="text-xs text-rose-400 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-amber-400/20 transition hover:brightness-110 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Verifying & Submitting...</span>
                    ) : isSinglePdf ? (
                      <>
                        <Sparkles size={16} />
                        <span>Submit TrxID & Unlock PDF Instantly</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={16} />
                        <span>Submit Payment for Activation</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
