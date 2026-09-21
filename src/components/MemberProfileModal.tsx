import React, { useState } from "react";
import {
  User,
  Mail,
  FileText,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  X,
  ExternalLink,
  Crown,
  ShieldCheck,
  LogOut,
  Sparkles,
  Copy,
  Check,
  Calendar,
  Layers,
  Eye,
} from "lucide-react";
import { Modal } from "./common";
import { useData } from "../context/DataContext";

export default function MemberProfileModal() {
  const {
    isMemberProfileModalOpen,
    setIsMemberProfileModalOpen,
    currentMember,
    memberLogout,
    resources,
    hasResourceAccess,
    payments,
    membershipSettings,
    openCheckout,
    openMemberModal,
    openPdfReader,
  } = useData();

  const [activeTab, setActiveTab] = useState<"unlocked" | "payments">("unlocked");
  const [copiedTrxId, setCopiedTrxId] = useState<string | null>(null);

  if (!isMemberProfileModalOpen) return null;

  const handleCopyTrx = (trxId: string) => {
    navigator.clipboard.writeText(trxId);
    setCopiedTrxId(trxId);
    setTimeout(() => setCopiedTrxId(null), 2000);
  };

  const handleLogout = () => {
    memberLogout();
    setIsMemberProfileModalOpen(false);
  };

  // If user is not logged in
  if (!currentMember) {
    return (
      <Modal open={isMemberProfileModalOpen} onClose={() => setIsMemberProfileModalOpen(false)}>
        <div className="relative overflow-hidden rounded-3xl bg-[#0a1633] p-8 text-center text-white">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/20">
            <User size={30} />
          </div>
          <h3 className="font-display text-xl font-bold text-white">Member Profile</h3>
          <p className="mt-2 text-sm text-slate-300">
            You are not currently logged in. Please sign in or create an account to view your unlocked PDFs and payment history.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => {
                setIsMemberProfileModalOpen(false);
                openMemberModal("signin");
              }}
              className="rounded-xl bg-amber-400 px-6 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsMemberProfileModalOpen(false);
                openMemberModal("signup");
              }}
              className="rounded-xl border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Create Account
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  // Filter unlocked resources
  const unlockedResources = resources.filter(
    (res) => res.pdfUrl && (hasResourceAccess(res.id) || !res.isPremium || res.accessTier === "free")
  );

  // Filter member payments
  const memberPayments = payments.filter(
    (p) =>
      (p.memberEmail && p.memberEmail.toLowerCase() === currentMember.email.toLowerCase()) ||
      (p.memberId && p.memberId === currentMember.id)
  );

  const isPremium = currentMember.plan === "premium" || currentMember.accessAll;
  const isBasic = currentMember.plan === "basic";

  const pendingPlanPayment = memberPayments.find(
    (p) => p.paymentType === "plan" && p.status === "pending"
  );

  return (
    <Modal
      open={isMemberProfileModalOpen}
      onClose={() => setIsMemberProfileModalOpen(false)}
      wide
    >
      <div className="relative overflow-hidden rounded-3xl bg-[#0a1633] text-white">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/20">
              {isPremium ? <Crown size={20} /> : <User size={20} />}
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-white sm:text-lg">
                Member Profile & Library
              </h3>
              <p className="text-xs text-slate-400">
                Manage your technical documents, subscription, and payments
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsMemberProfileModalOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white"
            aria-label="Close modal"
          >
            <X size={17} />
          </button>
        </div>

        {/* Profile Info Banner */}
        <div className="border-b border-white/10 bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-[#0a1633] p-5 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-xl font-black text-slate-950 shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/30">
                {currentMember.name ? currentMember.name.charAt(0).toUpperCase() : currentMember.email.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-lg font-bold text-white sm:text-xl">
                    {currentMember.name || "Member"}
                  </h4>
                  {isPremium && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-gradient-to-r from-amber-400/20 to-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-300">
                      <Crown size={12} className="text-amber-400" />
                      PREMIUM VIP
                    </span>
                  )}
                  {isBasic && !isPremium && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-sky-400/30 bg-sky-400/10 px-2.5 py-0.5 text-xs font-bold text-sky-300">
                      <ShieldCheck size={12} className="text-sky-400" />
                      BASIC MEMBER
                    </span>
                  )}
                  {!isPremium && !isBasic && (
                    pendingPlanPayment ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/15 px-2.5 py-0.5 text-xs font-bold text-amber-300 animate-pulse">
                        <Clock size={12} className="text-amber-400" />
                        {pendingPlanPayment.planName?.toUpperCase() || "PACKAGE"} ACTIVATION UNDER REVIEW
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-slate-500/30 bg-slate-500/10 px-2.5 py-0.5 text-xs font-medium text-slate-400">
                        FREE ACCOUNT
                      </span>
                    )
                  )}
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1.5">
                    <Mail size={13} className="text-slate-500" />
                    {currentMember.email}
                  </span>
                  {currentMember.createdAt && (
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar size={13} className="text-slate-500" />
                      Joined {new Date(currentMember.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              {!isPremium && (
                <button
                  onClick={() => {
                    setIsMemberProfileModalOpen(false);
                    openCheckout({
                      type: "plan",
                      planId: "premium",
                      planName: "Premium VIP Lifetime",
                      planPrice: membershipSettings.premiumPlan?.price || "499 BDT",
                    });
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-md shadow-amber-400/10 transition hover:brightness-110 cursor-pointer"
                >
                  <Sparkles size={14} />
                  Upgrade to VIP Plan ({membershipSettings.premiumPlan?.price || "499 BDT"})
                </button>
              )}
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-300"
              >
                <LogOut size={13} />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Pending Plan Verification Banner */}
        {pendingPlanPayment && (
          <div className="bg-amber-400/10 border-b border-amber-400/20 px-5 py-3 sm:px-7 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-200">
            <div className="flex items-start sm:items-center gap-2.5">
              <Clock size={16} className="text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <span className="font-bold text-amber-300">
                  {pendingPlanPayment.planName || "Membership"} Activation Pending:
                </span>{" "}
                Payment of {pendingPlanPayment.amount} via {pendingPlanPayment.method.toUpperCase()} (TrxID:{" "}
                <span className="font-mono font-bold text-white bg-amber-400/20 px-1.5 py-0.5 rounded">
                  {pendingPlanPayment.trxId}
                </span>
                ) is awaiting admin verification.
              </div>
            </div>
            <span className="shrink-0 self-start sm:self-auto rounded-full border border-amber-400/30 bg-amber-400/20 px-2.5 py-0.5 text-[10.5px] font-bold text-amber-300">
              Admin Review in Progress
            </span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 px-5 sm:px-7">
          <button
            onClick={() => setActiveTab("unlocked")}
            className={`relative flex items-center gap-2 py-3.5 text-xs font-semibold transition sm:text-sm ${
              activeTab === "unlocked"
                ? "text-amber-400"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <FileText size={16} />
            My Unlocked PDFs
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-bold text-white">
              {unlockedResources.length}
            </span>
            {activeTab === "unlocked" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("payments")}
            className={`relative ml-6 flex items-center gap-2 py-3.5 text-xs font-semibold transition sm:text-sm ${
              activeTab === "payments"
                ? "text-amber-400"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <CreditCard size={16} />
            Payment History
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-bold text-white">
              {memberPayments.length}
            </span>
            {activeTab === "payments" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="max-h-[60vh] overflow-y-auto p-5 sm:p-7">
          {activeTab === "unlocked" && (
            <div>
              {unlockedResources.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-center">
                  <FileText className="mx-auto mb-3 text-slate-500" size={36} />
                  <h4 className="text-base font-semibold text-white">No PDFs Unlocked Yet</h4>
                  <p className="mt-1 text-xs text-slate-400">
                    You currently have a Free Account. Unlock individual PDFs or subscribe to Basic / Premium VIP for full access.
                  </p>
                  <button
                    onClick={() => {
                      setIsMemberProfileModalOpen(false);
                      openCheckout({
                        type: "plan",
                        planId: "basic",
                        planName: "Basic Library Plan",
                        planPrice: membershipSettings.basicPlan?.price || "199 BDT",
                      });
                    }}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-300 cursor-pointer"
                  >
                    View Packages ({membershipSettings.basicPlan?.price || "199 BDT"})
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {unlockedResources.map((res) => {
                    const isIndividuallyUnlocked =
                      currentMember.allowedResourceIds?.includes(res.id);

                    return (
                      <div
                        key={res.id}
                        className="group flex flex-col justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-amber-400/30 hover:bg-white/[0.05] sm:flex-row sm:items-center"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-md bg-amber-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                              {res.category || "Technical Manual"}
                            </span>
                            {isPremium ? (
                              <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                                Unlocked with VIP Plan
                              </span>
                            ) : isIndividuallyUnlocked ? (
                              <span className="rounded-md bg-sky-500/10 px-2 py-0.5 text-[10px] font-bold text-sky-300">
                                Single Document Purchase
                              </span>
                            ) : (
                              <span className="rounded-md bg-slate-500/10 px-2 py-0.5 text-[10px] font-bold text-slate-300">
                                {res.accessTier === "basic" ? "Basic Tier Access" : "Open Access"}
                              </span>
                            )}
                          </div>
                          <h4 className="mt-1.5 truncate text-sm font-bold text-white sm:text-base">
                            {res.title}
                          </h4>
                          <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                            <span>Denim Universe Official PDF</span>
                            {res.pdfSize && <span>• {res.pdfSize}</span>}
                            {res.pdfPages && <span>• {res.pdfPages} Pages</span>}
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setIsMemberProfileModalOpen(false);
                              openPdfReader(res);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/20 transition active:scale-95 hover:brightness-110 cursor-pointer"
                          >
                            <Eye size={14} />
                            View PDF
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "payments" && (
            <div>
              {memberPayments.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-center">
                  <CreditCard className="mx-auto mb-3 text-slate-500" size={36} />
                  <h4 className="text-base font-semibold text-white">No Payment History Found</h4>
                  <p className="mt-1 text-xs text-slate-400">
                    When you purchase a plan or a single PDF manual, your payment submissions and transaction verification status will show here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {memberPayments.map((pay) => (
                    <div
                      key={pay.id}
                      className="flex flex-col justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-center"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-300">
                            {pay.paymentType === "single_pdf" ? "Single PDF" : "Plan Subscription"}
                          </span>
                          {pay.status === "approved" && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/20 px-2 py-0.5 text-[11px] font-bold text-emerald-300">
                              <CheckCircle2 size={12} />
                              Active / Verified
                            </span>
                          )}
                          {pay.status === "pending" && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/20 px-2 py-0.5 text-[11px] font-bold text-amber-300">
                              <Clock size={12} />
                              Pending Admin Review
                            </span>
                          )}
                          {pay.status === "rejected" && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/20 px-2 py-0.5 text-[11px] font-bold text-rose-300">
                              <XCircle size={12} />
                              Rejected
                            </span>
                          )}
                        </div>

                        <h4 className="mt-1.5 font-bold text-white sm:text-base">
                          {pay.planName || pay.resourceTitle || "Technical Resource"}
                        </h4>

                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                          <span className="font-semibold text-amber-400">Amount: {pay.amount}</span>
                          <span>• Method: {pay.method.toUpperCase()}</span>
                          {pay.senderNumber && <span>• From: {pay.senderNumber}</span>}
                          <span>• Date: {new Date(pay.createdAt).toLocaleDateString()}</span>
                        </div>

                        {pay.adminNotes && (
                          <p className="mt-1.5 text-xs text-slate-400 italic">
                            Note from Admin: {pay.adminNotes}
                          </p>
                        )}
                      </div>

                      <div className="flex shrink-0 flex-col items-start gap-1.5 sm:items-end">
                        <span className="text-[10px] uppercase tracking-wider text-slate-500">
                          Transaction ID
                        </span>
                        <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-mono font-bold text-slate-200">
                          <span>{pay.trxId}</span>
                          <button
                            onClick={() => handleCopyTrx(pay.trxId)}
                            className="text-slate-400 transition hover:text-amber-400"
                            title="Copy TrxID"
                          >
                            {copiedTrxId === pay.trxId ? (
                              <Check size={13} className="text-emerald-400" />
                            ) : (
                              <Copy size={13} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 bg-white/[0.02] px-5 py-4 sm:flex-row sm:px-7">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck size={14} className="text-amber-400" />
            <span>Need assistance with your membership or library access? Contact support anytime.</span>
          </div>
          <button
            onClick={() => setIsMemberProfileModalOpen(false)}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
