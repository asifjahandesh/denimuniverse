import React, { createContext, useContext, useState, useEffect } from "react";
import {
  TroubleItem,
  FashionCard,
  DictTerm,
  GalleryItem,
  SiteConfig,
  ResourceItem,
  MemberAccount,
  MembershipSettings,
  PaymentRecord,
} from "../types/content";
import {
  TROUBLES as DEFAULT_TROUBLES,
  FASHION_CARDS as DEFAULT_FASHION,
  DICTIONARY as DEFAULT_DICTIONARY,
  GALLERY as DEFAULT_GALLERY,
  SITE_CONFIG as DEFAULT_SITE_CONFIG,
} from "../data/content";
import {
  DEFAULT_RESOURCES,
  DEFAULT_MEMBERS,
  DEFAULT_MEMBERSHIP_SETTINGS,
  normalizeCategory,
} from "../data/resources";
import {
  isSupabaseConfigured,
  fetchRemoteData,
  syncRemoteTrouble,
  deleteRemoteTrouble,
  syncRemoteFashion,
  deleteRemoteFashion,
  syncRemoteDictionary,
  deleteRemoteDictionary,
  syncRemoteGallery,
  deleteRemoteGallery,
  syncRemoteSiteConfig,
  syncRemoteResource,
  deleteRemoteResource,
  syncRemoteMember,
  deleteRemoteMember,
  syncRemotePayment,
  deleteRemotePayment,
  getSupabaseHost,
} from "../lib/supabase";

interface DataContextType {
  troubles: TroubleItem[];
  fashionCards: FashionCard[];
  dictionary: DictTerm[];
  gallery: GalleryItem[];
  siteConfig: SiteConfig;
  resources: ResourceItem[];
  selectedResourceCategory: string;
  setSelectedResourceCategory: (cat: string) => void;
  navigateToResourceCategory: (cat: string) => void;
  members: MemberAccount[];

  // Cloud status
  isCloudConnected: boolean;
  cloudHost: string;

  // Admin Auth & Navigation
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  isAuthenticated: boolean;
  login: (pin: string) => boolean;
  logout: () => void;
  closeAdmin: () => void;

  // Member Auth & Plans (For Paid PDF Resources)
  membershipSettings: MembershipSettings;
  updateMembershipSettings: (settings: Partial<MembershipSettings>) => void;
  currentMember: MemberAccount | null;
  isMemberLoginModalOpen: boolean;
  setIsMemberLoginModalOpen: (open: boolean) => void;
  memberAuthMode: "signin" | "signup" | "packages";
  setMemberAuthMode: (mode: "signin" | "signup" | "packages") => void;
  openMemberModal: (mode?: "signin" | "signup" | "packages") => void;
  memberLogin: (email: string, pass: string) => { success: boolean; message: string };
  memberSignUp: (data: {
    name: string;
    email: string;
    password: string;
    plan?: "free" | "basic" | "premium";
    payment?: {
      method: "bkash" | "nagad" | "bank" | "other";
      senderNumber?: string;
      trxId: string;
      screenshotUrl?: string;
    };
  }) => { success: boolean; message: string; member?: MemberAccount; paymentPending?: boolean };
  memberLogout: () => void;
  hasResourceAccess: (resourceId: string) => boolean;

  // Payments & Activations
  payments: PaymentRecord[];
  submitPayment: (data: {
    memberName: string;
    memberEmail: string;
    paymentType: "plan" | "single_pdf";
    planId?: "basic" | "premium";
    planName?: string;
    resourceId?: string;
    resourceTitle?: string;
    amount: string;
    method: "bkash" | "nagad" | "bank" | "other";
    senderNumber?: string;
    trxId: string;
    screenshotUrl?: string;
  }) => { success: boolean; autoActivated: boolean; message: string; payment: PaymentRecord };
  approvePayment: (paymentId: string, notes?: string) => void;
  rejectPayment: (paymentId: string, notes?: string) => void;
  deletePayment: (paymentId: string) => void;

  // Member Profile Modal
  isMemberProfileModalOpen: boolean;
  setIsMemberProfileModalOpen: (open: boolean) => void;
  openMemberProfile: () => void;

  // Checkout / Payment Modal
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;
  checkoutTarget: {
    type: "plan" | "single_pdf";
    planId?: "basic" | "premium";
    planName?: string;
    planPrice?: string;
    resource?: ResourceItem;
  } | null;
  openCheckout: (target: {
    type: "plan" | "single_pdf";
    planId?: "basic" | "premium";
    planName?: string;
    planPrice?: string;
    resource?: ResourceItem;
  }) => void;

  // Trouble CRUD
  addTrouble: (item: Omit<TroubleItem, "id">) => void;
  updateTrouble: (id: string, item: Partial<TroubleItem>) => void;
  deleteTrouble: (id: string) => void;

  // Fashion CRUD
  addFashion: (item: Omit<FashionCard, "id">) => void;
  updateFashion: (id: string, item: Partial<FashionCard>) => void;
  deleteFashion: (id: string) => void;

  // Dictionary CRUD
  addDictTerm: (item: Omit<DictTerm, "id">) => void;
  updateDictTerm: (id: string, item: Partial<DictTerm>) => void;
  deleteDictTerm: (id: string) => void;

  // Gallery CRUD
  addGalleryItem: (item: Omit<GalleryItem, "id">) => void;
  updateGalleryItem: (id: string, item: Partial<GalleryItem>) => void;
  deleteGalleryItem: (id: string) => void;

  // Resource CRUD
  addResource: (item: Omit<ResourceItem, "id">) => void;
  updateResource: (id: string, item: Partial<ResourceItem>) => void;
  deleteResource: (id: string) => void;

  // Member Account CRUD
  addMember: (item: Omit<MemberAccount, "id" | "createdAt">) => void;
  updateMember: (id: string, item: Partial<MemberAccount>) => void;
  deleteMember: (id: string) => void;

  // Site Config
  updateSiteConfig: (config: Partial<SiteConfig>) => void;

  // Reset
  resetToDefaults: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const ADMIN_PIN = "0707";
const STORAGE_KEYS = {
  TROUBLES: "du_troubles_v1",
  FASHION: "du_fashion_v1",
  DICTIONARY: "du_dictionary_v1",
  GALLERY: "du_gallery_v1",
  CONFIG: "du_config_v1",
  RESOURCES: "du_resources_v1",
  MEMBERS: "du_members_v1",
  MEMBER_SESSION: "du_member_session_v1",
  PLANS: "du_plan_settings_v1",
  PAYMENTS: "du_payments_v1",
};

function initMembershipSettings(): MembershipSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PLANS);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Auto-migrate legacy USD or previous prices to: Basic 199 BDT, Premium 499 BDT
      if (
        parsed.basicPlan?.price?.includes("$") ||
        parsed.basicPlan?.price?.includes("990") ||
        !parsed.basicPlan?.price ||
        parsed.premiumPlan?.price?.includes("$") ||
        parsed.premiumPlan?.price?.includes("1,990") ||
        parsed.premiumPlan?.price?.includes("1990") ||
        !parsed.premiumPlan?.price
      ) {
        parsed.basicPlan.price = "199 BDT";
        parsed.premiumPlan.price = "499 BDT";
      }
      return parsed;
    }
  } catch (e) {
    console.error("Error reading plan settings from storage", e);
  }
  return { ...DEFAULT_MEMBERSHIP_SETTINGS };
}

// Initializer helper with ID injection if missing
function initTroubles(): TroubleItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.TROUBLES);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error("Error reading troubles from storage", e);
  }
  return DEFAULT_TROUBLES.map((t, idx) => ({
    id: `tr-${idx + 1}-${Date.now().toString(36)}`,
    ...t,
  }));
}

function initFashion(): FashionCard[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.FASHION);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error("Error reading fashion from storage", e);
  }
  return DEFAULT_FASHION.map((f, idx) => ({
    id: `fash-${idx + 1}`,
    ...f,
  }));
}

function initDictionary(): DictTerm[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.DICTIONARY);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error("Error reading dictionary from storage", e);
  }
  return DEFAULT_DICTIONARY.map((d, idx) => ({
    id: `dict-${idx + 1}-${Date.now().toString(36)}`,
    ...d,
  }));
}

function initGallery(): GalleryItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.GALLERY);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error("Error reading gallery from storage", e);
  }
  return DEFAULT_GALLERY.map((g, idx) => ({
    id: `gal-${idx + 1}-${Date.now().toString(36)}`,
    ...g,
  }));
}

function initSiteConfig(): SiteConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error("Error reading config from storage", e);
  }
  return { ...DEFAULT_SITE_CONFIG };
}

function initResources(): ResourceItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.RESOURCES);
    if (stored) {
      const parsed: ResourceItem[] = JSON.parse(stored);
      // Auto-migrate legacy USD / old BDT prices & cleanse legacy categories
      const migrated = parsed.map((r) => {
        let priceBadge = r.priceBadge || "";
        let singlePrice = r.singlePrice || "49 BDT";
        const cat = normalizeCategory(r.category);
        if (priceBadge.includes("$19") || priceBadge.includes("1,990") || priceBadge.includes("1990")) priceBadge = "499 BDT · Premium SOP";
        if (priceBadge.includes("$15") || priceBadge.includes("1,490") || priceBadge.includes("1490")) priceBadge = "499 BDT · Premium SOP";
        if (priceBadge.includes("$9") || priceBadge.includes("990")) priceBadge = "199 BDT · Basic Manual";
        if (singlePrice.includes("$4") || singlePrice.includes("390") || singlePrice === "$4") singlePrice = "49 BDT";
        return {
          ...r,
          category: cat,
          priceBadge: priceBadge || (r.accessTier === "premium" ? "499 BDT · Premium SOP" : r.accessTier === "basic" ? "199 BDT · Basic Manual" : "Free"),
          singlePrice: singlePrice || "49 BDT",
        };
      });

      // Merge any new default category manuals if they don't exist in local storage yet
      const existingIds = new Set(migrated.map((m) => m.id));
      const missingDefaults = DEFAULT_RESOURCES.filter((d) => !existingIds.has(d.id));
      const fullList = [...migrated, ...missingDefaults];

      // Immediately persist cleansed categories to localStorage to permanently purge stale values
      try {
        localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(fullList));
      } catch (e) {
        console.warn("Failed to overwrite cleansed resources in storage", e);
      }

      return fullList;
    }
  } catch (e) {
    console.error("Error reading resources from storage", e);
  }
  return DEFAULT_RESOURCES;
}

function initMembers(): MemberAccount[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error("Error reading members from storage", e);
  }
  return DEFAULT_MEMBERS;
}

function initMemberSession(): MemberAccount | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.MEMBER_SESSION);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error("Error reading member session", e);
  }
  return null;
}

function initPayments(): PaymentRecord[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error("Error reading payments from storage", e);
  }
  return [
    {
      id: "pay-seed-1",
      memberId: "mem-premium-demo",
      memberName: "Denim Specialist",
      memberEmail: "demo@denimuniverse.com",
      paymentType: "plan",
      planId: "premium",
      planName: "Premium VIP Lifetime",
      amount: "499 BDT",
      method: "bkash",
      senderNumber: "01700000000",
      trxId: "BK9X84J21L",
      status: "approved",
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      reviewedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      adminNotes: "Auto-approved demo account",
    },
    {
      id: "pay-seed-2",
      memberId: "mem-basic-demo",
      memberName: "Apparel Tech",
      memberEmail: "basic@denimuniverse.com",
      paymentType: "plan",
      planId: "basic",
      planName: "Basic Library Plan",
      amount: "199 BDT",
      method: "nagad",
      senderNumber: "01800000000",
      trxId: "NG4P71Q99K",
      status: "approved",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      reviewedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      adminNotes: "Auto-approved demo account",
    },
  ];
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [troubles, setTroubles] = useState<TroubleItem[]>(initTroubles);
  const [fashionCards, setFashionCards] = useState<FashionCard[]>(initFashion);
  const [dictionary, setDictionary] = useState<DictTerm[]>(initDictionary);
  const [gallery, setGallery] = useState<GalleryItem[]>(initGallery);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(initSiteConfig);
  const [resources, setResources] = useState<ResourceItem[]>(initResources);
  const [selectedResourceCategory, setSelectedResourceCategory] = useState<string>("All");

  const navigateToResourceCategory = (cat: string) => {
    setSelectedResourceCategory(cat);
    if (window.location.hash.startsWith("#resources/") || window.location.hash.startsWith("#fashion/")) {
      window.location.hash = "#resources";
    }
    setTimeout(() => {
      const el = document.getElementById("resources");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.hash = "#resources";
      }
    }, 60);
  };
  const [members, setMembers] = useState<MemberAccount[]>(initMembers);
  const [membershipSettings, setMembershipSettings] = useState<MembershipSettings>(initMembershipSettings);

  // Cloud status
  const [isCloudConnected, setIsCloudConnected] = useState(false);
  const [cloudHost, setCloudHost] = useState("");

  // Admin Auth State
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Member Auth State (For Protected PDF Resources)
  const [currentMember, setCurrentMember] = useState<MemberAccount | null>(initMemberSession);
  const [isMemberLoginModalOpen, setIsMemberLoginModalOpen] = useState(false);
  const [memberAuthMode, setMemberAuthMode] = useState<"signin" | "signup" | "packages">("signin");

  // Member Profile Modal
  const [isMemberProfileModalOpen, setIsMemberProfileModalOpen] = useState(false);
  const openMemberProfile = () => {
    setIsMemberProfileModalOpen(true);
  };

  // Payments & Checkout Modal
  const [payments, setPayments] = useState<PaymentRecord[]>(initPayments);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutTarget, setCheckoutTarget] = useState<{
    type: "plan" | "single_pdf";
    planId?: "basic" | "premium";
    planName?: string;
    planPrice?: string;
    resource?: ResourceItem;
  } | null>(null);

  const openCheckout = (target: {
    type: "plan" | "single_pdf";
    planId?: "basic" | "premium";
    planName?: string;
    planPrice?: string;
    resource?: ResourceItem;
  }) => {
    setCheckoutTarget(target);
    setIsCheckoutModalOpen(true);
  };

  const openMemberModal = (mode: "signin" | "signup" | "packages" = "signin") => {
    setMemberAuthMode(mode);
    setIsMemberLoginModalOpen(true);
  };

  // Check Supabase on Mount
  useEffect(() => {
    if (isSupabaseConfigured()) {
      setCloudHost(getSupabaseHost());
      fetchRemoteData()
        .then((remote) => {
          if (remote.troubles && remote.troubles.length > 0) setTroubles(remote.troubles);
          if (remote.fashion && remote.fashion.length > 0) setFashionCards(remote.fashion);
          if (remote.dictionary && remote.dictionary.length > 0) setDictionary(remote.dictionary);
          if (remote.gallery && remote.gallery.length > 0) setGallery(remote.gallery);
          if (remote.siteConfig) setSiteConfig(remote.siteConfig);
          if (remote.resources && remote.resources.length > 0) {
            const sanitized = remote.resources.map((r) => ({
              ...r,
              category: normalizeCategory(r.category),
            }));
            setResources(sanitized);
          }
          if (remote.members && remote.members.length > 0) setMembers(remote.members);
          if (remote.payments && remote.payments.length > 0) setPayments(remote.payments);
          setIsCloudConnected(true);
        })
        .catch((err) => {
          console.error("Supabase initial fetch failed:", err);
        });
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TROUBLES, JSON.stringify(troubles));
    } catch (e) {
      console.error("Failed to save troubles", e);
    }
  }, [troubles]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FASHION, JSON.stringify(fashionCards));
    } catch (e) {
      console.error("Failed to save fashion", e);
    }
  }, [fashionCards]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DICTIONARY, JSON.stringify(dictionary));
    } catch (e) {
      console.error("Failed to save dictionary", e);
    }
  }, [dictionary]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(gallery));
    } catch (e) {
      console.error("Failed to save gallery", e);
    }
  }, [gallery]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(siteConfig));
    } catch (e) {
      console.error("Failed to save site config", e);
    }
  }, [siteConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(resources));
    } catch (e) {
      console.error("Failed to save resources", e);
    }
  }, [resources]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
    } catch (e) {
      console.error("Failed to save members", e);
    }
  }, [members]);

  useEffect(() => {
    try {
      if (currentMember) {
        localStorage.setItem(STORAGE_KEYS.MEMBER_SESSION, JSON.stringify(currentMember));
      } else {
        localStorage.removeItem(STORAGE_KEYS.MEMBER_SESSION);
      }
    } catch (e) {
      console.error("Failed to save member session", e);
    }
  }, [currentMember]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
    } catch (e) {
      console.error("Failed to save payments", e);
    }
  }, [payments]);

  // Admin Auth Methods — Strictly in-memory, NEVER stored to disk or session
  const login = (pin: string): boolean => {
    if (pin.trim() === ADMIN_PIN) {
      setIsAuthenticated(true);
      setIsLoginModalOpen(false);
      setIsAdminOpen(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsAdminOpen(false);
    setIsLoginModalOpen(false);
    try {
      sessionStorage.removeItem("du_admin_auth_v1");
      localStorage.removeItem("du_admin_auth_v1");
    } catch {}
  };

  const closeAdmin = () => {
    setIsAuthenticated(false);
    setIsAdminOpen(false);
    setIsLoginModalOpen(false);
  };

  // Member Auth Methods (For Paid PDF Download Access)
  const memberLogin = (email: string, pass: string): { success: boolean; message: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    const member = members.find((m) => m.email.toLowerCase() === cleanEmail);

    if (!member) {
      return { success: false, message: "No account found with this email. Please sign up or check your spelling." };
    }

    if (member.password !== cleanPass) {
      return { success: false, message: "Incorrect password. Please check your password or contact support." };
    }

    if (member.status !== "active") {
      return { success: false, message: "This account is currently suspended. Please contact admin." };
    }

    setCurrentMember(member);
    setIsMemberLoginModalOpen(false);
    return { success: true, message: `Welcome back, ${member.name || member.email}!` };
  };

  const memberSignUp = (data: {
    name: string;
    email: string;
    password: string;
    plan?: "free" | "basic" | "premium";
    payment?: {
      method: "bkash" | "nagad" | "bank" | "other";
      senderNumber?: string;
      trxId: string;
      screenshotUrl?: string;
    };
  }): { success: boolean; message: string; member?: MemberAccount; paymentPending?: boolean } => {
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanName = data.name.trim();
    const cleanPass = data.password.trim();
    const chosenPlan = data.plan || "free";

    if (!cleanEmail || !cleanEmail.includes("@")) {
      return { success: false, message: "Please provide a valid email address." };
    }
    if (!cleanPass || cleanPass.length < 4) {
      return { success: false, message: "Password must be at least 4 characters." };
    }

    const exists = members.some((m) => m.email.toLowerCase() === cleanEmail);
    if (exists) {
      return { success: false, message: "An account with this email already exists. Please sign in instead." };
    }

    // If user chose Basic or Premium plan, payment & Transaction ID are mandatory
    if (chosenPlan !== "free") {
      const cleanTrx = data.payment?.trxId?.trim().toUpperCase() || "";
      if (!cleanTrx || cleanTrx.length < 5) {
        return {
          success: false,
          message: `Transaction ID (min 5 characters) is required to complete registration for the ${
            chosenPlan === "basic" ? "Basic Plan (199 BDT)" : "Premium VIP Plan (499 BDT)"
          }.`,
        };
      }

      const planPrice =
        chosenPlan === "basic"
          ? membershipSettings.basicPlan?.price || "199 BDT"
          : membershipSettings.premiumPlan?.price || "499 BDT";
      const planName = chosenPlan === "basic" ? "Basic Plan" : "Premium VIP Plan";

      // Create member with "free" status temporarily until admin verifies the payment
      const newMember: MemberAccount = {
        id: `mem-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
        email: cleanEmail,
        password: cleanPass,
        name: cleanName || cleanEmail.split("@")[0],
        status: "active",
        plan: "free", // Kept as free until admin approval
        accessAll: false,
        allowedResourceIds: [],
        notes: `Registered with ${chosenPlan.toUpperCase()} request (${planPrice}). Payment submitted (TrxID: ${cleanTrx}). Pending admin verification.`,
        createdAt: new Date().toISOString(),
      };

      // Create pending payment record for Admin Panel
      const newPayment: PaymentRecord = {
        id: `pay-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
        memberId: newMember.id,
        memberName: newMember.name,
        memberEmail: newMember.email,
        paymentType: "plan",
        planId: chosenPlan,
        planName,
        amount: planPrice,
        method: data.payment?.method || "bkash",
        senderNumber: data.payment?.senderNumber?.trim() || undefined,
        trxId: cleanTrx,
        screenshotUrl: data.payment?.screenshotUrl || undefined,
        status: "pending",
        createdAt: new Date().toISOString(),
        adminNotes: `Submitted during Sign Up for ${chosenPlan} plan. Requires admin review & activation.`,
      };

      setMembers((prev) => [newMember, ...prev]);
      setPayments((prev) => [newPayment, ...prev]);
      setCurrentMember(newMember);

      syncRemoteMember(newMember);
      syncRemotePayment(newPayment);

      return {
        success: true,
        message: `Registration & Payment received! Your ${planName} request (${planPrice}, TrxID: ${cleanTrx}) is under review. Our admin will activate your package shortly.`,
        member: newMember,
        paymentPending: true,
      };
    }

    // Free account: immediate registration, no payment required
    const newMember: MemberAccount = {
      id: `mem-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      email: cleanEmail,
      password: cleanPass,
      name: cleanName || cleanEmail.split("@")[0],
      status: "active",
      plan: "free",
      accessAll: false,
      allowedResourceIds: [],
      notes: "Self-registered free account",
      createdAt: new Date().toISOString(),
    };

    setMembers((prev) => [newMember, ...prev]);
    setCurrentMember(newMember);
    setIsMemberLoginModalOpen(false);
    syncRemoteMember(newMember);

    return {
      success: true,
      message: `Account created successfully! Welcome, ${newMember.name}.`,
      member: newMember,
    };
  };

  const memberLogout = () => {
    setCurrentMember(null);
  };

  const updateMembershipSettings = (updated: Partial<MembershipSettings>) => {
    setMembershipSettings((prev) => {
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(next));
      } catch (e) {
        console.error("Error saving plan settings", e);
      }
      return next;
    });
  };

  const hasResourceAccess = (resourceId: string): boolean => {
    const res = resources.find((r) => r.id === resourceId);
    if (!res) return false;
    // Free tier is open to all visitors
    if (res.accessTier === "free" || !res.isPremium) return true;

    // Any non-free manual requires an active logged-in member
    if (!currentMember || currentMember.status !== "active") return false;

    // Premium plan members or full access accounts have access to ALL manuals
    if (currentMember.plan === "premium" || currentMember.accessAll) return true;

    // Basic plan members have access if the resource is Basic tier
    if (currentMember.plan === "basic") {
      if (res.accessTier === "basic" || res.accessTier === "free" || !res.isPremium) return true;
    }

    // Explicit individual manual grant
    return currentMember.allowedResourceIds?.includes(resourceId) ?? false;
  };

  // Payments & Plan Activations
  const submitPayment = (data: {
    memberName: string;
    memberEmail: string;
    paymentType: "plan" | "single_pdf";
    planId?: "basic" | "premium";
    planName?: string;
    resourceId?: string;
    resourceTitle?: string;
    amount: string;
    method: "bkash" | "nagad" | "bank" | "other";
    senderNumber?: string;
    trxId: string;
    screenshotUrl?: string;
  }): { success: boolean; autoActivated: boolean; message: string; payment: PaymentRecord } => {
    const isSingle = data.paymentType === "single_pdf";
    const status = isSingle ? "approved" : "pending";

    const newPayment: PaymentRecord = {
      id: `pay-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      memberId: currentMember?.id,
      memberName: data.memberName.trim() || currentMember?.name || "Member",
      memberEmail: data.memberEmail.trim().toLowerCase() || currentMember?.email || "",
      paymentType: data.paymentType,
      planId: data.planId,
      planName: data.planName,
      resourceId: data.resourceId,
      resourceTitle: data.resourceTitle,
      amount: data.amount,
      method: data.method,
      senderNumber: data.senderNumber,
      trxId: data.trxId.trim().toUpperCase(),
      screenshotUrl: data.screenshotUrl,
      status,
      createdAt: new Date().toISOString(),
      reviewedAt: isSingle ? new Date().toISOString() : undefined,
      adminNotes: isSingle ? "Auto-unlocked upon transaction ID submission" : undefined,
    };

    setPayments((prev) => [newPayment, ...prev]);
    syncRemotePayment(newPayment);

    // If single PDF, auto-unlock instantly
    if (isSingle && data.resourceId) {
      if (currentMember) {
        const currentAllowed = currentMember.allowedResourceIds || [];
        if (!currentAllowed.includes(data.resourceId)) {
          const updatedAllowed = [...currentAllowed, data.resourceId];
          const updatedMember: MemberAccount = {
            ...currentMember,
            allowedResourceIds: updatedAllowed,
          };
          setCurrentMember(updatedMember);
          setMembers((prev) => prev.map((m) => (m.id === currentMember.id ? updatedMember : m)));
          syncRemoteMember(updatedMember);
        }
      } else {
        const cleanEmail = (data.memberEmail || "").trim().toLowerCase();
        const existing = members.find((m) => m.email.toLowerCase() === cleanEmail);
        if (existing) {
          const currentAllowed = existing.allowedResourceIds || [];
          const updatedAllowed = currentAllowed.includes(data.resourceId)
            ? currentAllowed
            : [...currentAllowed, data.resourceId];
          const updatedMember: MemberAccount = {
            ...existing,
            allowedResourceIds: updatedAllowed,
          };
          setCurrentMember(updatedMember);
          setMembers((prev) => prev.map((m) => (m.id === existing.id ? updatedMember : m)));
          syncRemoteMember(updatedMember);
        } else if (cleanEmail) {
          const newMember: MemberAccount = {
            id: `mem-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
            email: cleanEmail,
            name: data.memberName.trim() || cleanEmail.split("@")[0],
            status: "active",
            plan: "free",
            accessAll: false,
            allowedResourceIds: [data.resourceId],
            notes: "Created via Single PDF Checkout",
            createdAt: new Date().toISOString(),
          };
          setMembers((prev) => [newMember, ...prev]);
          setCurrentMember(newMember);
          syncRemoteMember(newMember);
        }
      }
    }

    return {
      success: true,
      autoActivated: isSingle,
      message: isSingle
        ? "Payment verified! Your document has been unlocked and is ready to download."
        : "Payment submitted successfully! Your account will be upgraded as soon as Admin reviews your transaction ID.",
      payment: newPayment,
    };
  };

  const approvePayment = (paymentId: string, notes?: string) => {
    const payment = payments.find((p) => p.id === paymentId);
    if (!payment) return;

    const updatedPayment: PaymentRecord = {
      ...payment,
      status: "approved",
      reviewedAt: new Date().toISOString(),
      adminNotes: notes || payment.adminNotes || "Approved by Admin",
    };

    setPayments((prev) => prev.map((p) => (p.id === paymentId ? updatedPayment : p)));
    syncRemotePayment(updatedPayment);

    // If payment was for a plan, upgrade target member
    if (payment.paymentType === "plan" && payment.planId) {
      const targetMember = members.find(
        (m) => (payment.memberId && m.id === payment.memberId) || m.email.toLowerCase() === payment.memberEmail.toLowerCase()
      );
      if (targetMember) {
        const upgradedMember: MemberAccount = {
          ...targetMember,
          plan: payment.planId,
          accessAll: payment.planId === "premium",
          notes: `Upgraded to ${payment.planId} via TrxID ${payment.trxId}`,
        };
        setMembers((prev) => prev.map((m) => (m.id === targetMember.id ? upgradedMember : m)));
        if (currentMember && currentMember.id === targetMember.id) {
          setCurrentMember(upgradedMember);
        }
        syncRemoteMember(upgradedMember);
      }
    } else if (payment.paymentType === "single_pdf" && payment.resourceId) {
      // If single pdf manual approval
      const targetMember = members.find(
        (m) => (payment.memberId && m.id === payment.memberId) || m.email.toLowerCase() === payment.memberEmail.toLowerCase()
      );
      if (targetMember) {
        const currentAllowed = targetMember.allowedResourceIds || [];
        if (!currentAllowed.includes(payment.resourceId)) {
          const upgradedMember: MemberAccount = {
            ...targetMember,
            allowedResourceIds: [...currentAllowed, payment.resourceId],
          };
          setMembers((prev) => prev.map((m) => (m.id === targetMember.id ? upgradedMember : m)));
          if (currentMember && currentMember.id === targetMember.id) {
            setCurrentMember(upgradedMember);
          }
          syncRemoteMember(upgradedMember);
        }
      }
    }
  };

  const rejectPayment = (paymentId: string, notes?: string) => {
    const payment = payments.find((p) => p.id === paymentId);
    if (!payment) return;

    const updatedPayment: PaymentRecord = {
      ...payment,
      status: "rejected",
      reviewedAt: new Date().toISOString(),
      adminNotes: notes || "Payment verification rejected by Admin",
    };

    setPayments((prev) => prev.map((p) => (p.id === paymentId ? updatedPayment : p)));
    syncRemotePayment(updatedPayment);
  };

  const deletePayment = (paymentId: string) => {
    setPayments((prev) => prev.filter((p) => p.id !== paymentId));
    deleteRemotePayment(paymentId);
  };

  // Trouble CRUD
  const addTrouble = (item: Omit<TroubleItem, "id">) => {
    const newItem: TroubleItem = {
      ...item,
      id: `tr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    setTroubles((prev) => [newItem, ...prev]);
    syncRemoteTrouble(newItem);
  };

  const updateTrouble = (id: string, updated: Partial<TroubleItem>) => {
    setTroubles((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, ...updated } : t));
      const target = next.find((t) => t.id === id);
      if (target) syncRemoteTrouble(target);
      return next;
    });
  };

  const deleteTrouble = (id: string) => {
    setTroubles((prev) => prev.filter((t) => t.id !== id));
    deleteRemoteTrouble(id);
  };

  // Fashion CRUD
  const addFashion = (item: Omit<FashionCard, "id">) => {
    const newItem: FashionCard = {
      ...item,
      id: `fash-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    setFashionCards((prev) => [newItem, ...prev]);
    syncRemoteFashion(newItem);
  };

  const updateFashion = (id: string, updated: Partial<FashionCard>) => {
    setFashionCards((prev) => {
      const next = prev.map((f) => (f.id === id ? { ...f, ...updated } : f));
      const target = next.find((f) => f.id === id);
      if (target) syncRemoteFashion(target);
      return next;
    });
  };

  const deleteFashion = (id: string) => {
    setFashionCards((prev) => prev.filter((f) => f.id !== id));
    deleteRemoteFashion(id);
  };

  // Dictionary CRUD
  const addDictTerm = (item: Omit<DictTerm, "id">) => {
    const newItem: DictTerm = {
      ...item,
      id: `dict-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    setDictionary((prev) => [newItem, ...prev]);
    syncRemoteDictionary(newItem);
  };

  const updateDictTerm = (id: string, updated: Partial<DictTerm>) => {
    setDictionary((prev) => {
      const next = prev.map((d) => (d.id === id ? { ...d, ...updated } : d));
      const target = next.find((d) => d.id === id);
      if (target) syncRemoteDictionary(target);
      return next;
    });
  };

  const deleteDictTerm = (id: string) => {
    setDictionary((prev) => prev.filter((d) => d.id !== id));
    deleteRemoteDictionary(id);
  };

  // Gallery CRUD
  const addGalleryItem = (item: Omit<GalleryItem, "id">) => {
    const newItem: GalleryItem = {
      ...item,
      id: `gal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    setGallery((prev) => [newItem, ...prev]);
    syncRemoteGallery(newItem);
  };

  const updateGalleryItem = (id: string, updated: Partial<GalleryItem>) => {
    setGallery((prev) => {
      const next = prev.map((g) => (g.id === id ? { ...g, ...updated } : g));
      const target = next.find((g) => g.id === id);
      if (target) syncRemoteGallery(target);
      return next;
    });
  };

  const deleteGalleryItem = (id: string) => {
    setGallery((prev) => prev.filter((g) => g.id !== id));
    deleteRemoteGallery(id);
  };

  // Resource CRUD
  const addResource = (item: Omit<ResourceItem, "id">) => {
    const newItem: ResourceItem = {
      ...item,
      category: normalizeCategory(item.category),
      id: `res-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    setResources((prev) => [newItem, ...prev]);
    syncRemoteResource(newItem);
  };

  const updateResource = (id: string, updated: Partial<ResourceItem>) => {
    const sanitizedUpdated: Partial<ResourceItem> = {
      ...updated,
      ...(updated.category ? { category: normalizeCategory(updated.category) } : {}),
    };
    setResources((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, ...sanitizedUpdated } : r));
      const target = next.find((r) => r.id === id);
      if (target) syncRemoteResource(target);
      return next;
    });
  };

  const deleteResource = (id: string) => {
    setResources((prev) => prev.filter((r) => r.id !== id));
    deleteRemoteResource(id);
  };

  // Member CRUD
  const addMember = (item: Omit<MemberAccount, "id" | "createdAt">) => {
    const newMember: MemberAccount = {
      ...item,
      id: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    setMembers((prev) => [newMember, ...prev]);
    syncRemoteMember(newMember);
  };

  const updateMember = (id: string, updated: Partial<MemberAccount>) => {
    setMembers((prev) => {
      const next = prev.map((m) => (m.id === id ? { ...m, ...updated } : m));
      const target = next.find((m) => m.id === id);
      if (target) {
        syncRemoteMember(target);
        if (currentMember && currentMember.id === id) {
          setCurrentMember(target);
        }
      }
      return next;
    });
  };

  const deleteMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    if (currentMember && currentMember.id === id) {
      setCurrentMember(null);
    }
    deleteRemoteMember(id);
  };

  // Site Config
  const updateSiteConfig = (config: Partial<SiteConfig>) => {
    setSiteConfig((prev) => {
      const next = { ...prev, ...config };
      syncRemoteSiteConfig(next);
      return next;
    });
  };

  // Reset to Defaults
  const resetToDefaults = () => {
    const defaultTr = DEFAULT_TROUBLES.map((t, idx) => ({
      id: `tr-def-${idx + 1}`,
      ...t,
    }));
    const defaultFash = DEFAULT_FASHION.map((f, idx) => ({
      id: `fash-def-${idx + 1}`,
      ...f,
    }));
    const defaultDict = DEFAULT_DICTIONARY.map((d, idx) => ({
      id: `dict-def-${idx + 1}`,
      ...d,
    }));
    const defaultGal = DEFAULT_GALLERY.map((g, idx) => ({
      id: `gal-def-${idx + 1}`,
      ...g,
    }));

    setTroubles(defaultTr);
    setFashionCards(defaultFash);
    setDictionary(defaultDict);
    setGallery(defaultGal);
    setSiteConfig({ ...DEFAULT_SITE_CONFIG });
    setResources([...DEFAULT_RESOURCES]);
    setMembers([...DEFAULT_MEMBERS]);
    setMembershipSettings({ ...DEFAULT_MEMBERSHIP_SETTINGS });
    setPayments(initPayments());
    setCurrentMember(null);

    localStorage.removeItem(STORAGE_KEYS.TROUBLES);
    localStorage.removeItem(STORAGE_KEYS.FASHION);
    localStorage.removeItem(STORAGE_KEYS.DICTIONARY);
    localStorage.removeItem(STORAGE_KEYS.GALLERY);
    localStorage.removeItem(STORAGE_KEYS.CONFIG);
    localStorage.removeItem(STORAGE_KEYS.RESOURCES);
    localStorage.removeItem(STORAGE_KEYS.MEMBERS);
    localStorage.removeItem(STORAGE_KEYS.MEMBER_SESSION);
    localStorage.removeItem(STORAGE_KEYS.PLANS);
    localStorage.removeItem(STORAGE_KEYS.PAYMENTS);
  };

  return (
    <DataContext.Provider
      value={{
        troubles,
        fashionCards,
        dictionary,
        gallery,
        siteConfig,
        resources,
        selectedResourceCategory,
        setSelectedResourceCategory,
        navigateToResourceCategory,
        members,
        membershipSettings,
        updateMembershipSettings,
        isCloudConnected,
        cloudHost,
        isAdminOpen,
        setIsAdminOpen,
        isLoginModalOpen,
        setIsLoginModalOpen,
        isAuthenticated,
        login,
        logout,
        closeAdmin,
        currentMember,
        isMemberLoginModalOpen,
        setIsMemberLoginModalOpen,
        memberAuthMode,
        setMemberAuthMode,
        openMemberModal,
        memberLogin,
        memberSignUp,
        memberLogout,
        hasResourceAccess,
        payments,
        submitPayment,
        approvePayment,
        rejectPayment,
        deletePayment,
        isMemberProfileModalOpen,
        setIsMemberProfileModalOpen,
        openMemberProfile,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        checkoutTarget,
        openCheckout,
        addTrouble,
        updateTrouble,
        deleteTrouble,
        addFashion,
        updateFashion,
        deleteFashion,
        addDictTerm,
        updateDictTerm,
        deleteDictTerm,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        addResource,
        updateResource,
        deleteResource,
        addMember,
        updateMember,
        deleteMember,
        updateSiteConfig,
        resetToDefaults,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export function useData(): DataContextType {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}