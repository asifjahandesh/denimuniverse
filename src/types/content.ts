export interface TroubleItem {
  id: string;
  title: string;
  tag: string;
  problem: string;
  causes: string[];
  solutions: string[];
  severity: "High" | "Medium" | "Low";
}

export interface FashionCard {
  id: string;
  title: string;
  desc: string;
  tag: string;
  image: string;
  stat: string;
  content?: string;
  author?: string;
  readTime?: string;
  publishedAt?: string;
}

export interface DictTerm {
  id: string;
  term: string;
  short: string;
  detail: string;
  cat: string;
}

export interface GalleryItem {
  id: string;
  src: string;
  title: string;
  cat: string;
  tall?: boolean;
}

export interface SiteConfig {
  brand: string;
  tagline: string;
  facebookUrl: string;
  email: string;
  whatsapp: string;
  location: string;
  logo: string;
  svgIcon: string;
  gaId?: string;
}

export interface ProcessStep {
  no: string;
  title: string;
  aka: string;
  desc: string;
  points: string[];
  image: string;
}

export interface Category {
  name: string;
  desc: string;
  count: string;
  icon: string;
  topics: string[];
  color: string;
}

export interface Article {
  id: number;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
  body: string[];
}

export interface ResourceItem {
  id: string;
  title: string;
  slug?: string;
  category: string;
  desc: string;
  content: string;
  author: string;
  readTime: string;
  publishedAt: string;
  image: string;
  isPremium: boolean;
  accessTier: "free" | "basic" | "premium";
  priceBadge: string;
  pdfTitle: string;
  pdfUrl: string;
  pdfSize: string;
  pdfPages?: number;
  singlePrice?: string; // e.g. "49 BDT" for individual PDF unlock
}

export interface MemberAccount {
  id: string;
  email: string;
  password: string;
  name: string;
  status: "active" | "suspended";
  plan: "free" | "basic" | "premium";
  accessAll: boolean;
  allowedResourceIds: string[];
  emailVerified?: boolean;
  notes?: string;
  createdAt: string;
}

export interface PlanTierConfig {
  id: "basic" | "premium";
  name: string;
  price: string;
  badge?: string;
  period: string;
  description: string;
  features: string[];
}

export interface MembershipSettings {
  basicPlan: PlanTierConfig;
  premiumPlan: PlanTierConfig;
  paymentMethods: {
    bkash?: string;
    nagad?: string;
    bank?: string;
    whatsapp?: string;
    notice?: string;
  };
}

export interface PaymentRecord {
  id: string;
  memberId?: string;
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
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  reviewedAt?: string;
  adminNotes?: string;
}