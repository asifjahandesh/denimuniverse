import { createClient, SupabaseClient } from "@supabase/supabase-js";
import {
  TroubleItem,
  FashionCard,
  DictTerm,
  GalleryItem,
  SiteConfig,
  ResourceItem,
  MemberAccount,
  PaymentRecord,
} from "../types/content";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = (): boolean => {
  return (
    typeof supabaseUrl === "string" &&
    supabaseUrl.trim().length > 0 &&
    !supabaseUrl.includes("your-project-id") &&
    typeof supabaseAnonKey === "string" &&
    supabaseAnonKey.trim().length > 0 &&
    !supabaseAnonKey.includes("your-anon-key")
  );
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const getSupabaseHost = (): string => {
  if (!supabaseUrl) return "Unconfigured";
  try {
    return new URL(supabaseUrl).hostname;
  } catch {
    return supabaseUrl;
  }
};

/**
 * Diagnostic test to verify database connectivity.
 */
export async function testSupabaseConnection(): Promise<{
  success: boolean;
  message: string;
  count?: number;
}> {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      success: false,
      message:
        "Supabase credentials not configured in environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY). Running in Local Storage Mode.",
    };
  }

  try {
    const { data, error, count } = await supabase
      .from("troubles")
      .select("id", { count: "exact", head: true });

    if (error) {
      return {
        success: false,
        message: `Supabase query error: ${error.message}`,
      };
    }

    return {
      success: true,
      message: `Successfully connected to Supabase database! Found ${count ?? 0} defect cases in table 'troubles'.`,
      count: count ?? 0,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      message: `Connection failed: ${msg}`,
    };
  }
}

/**
 * Upload an image file directly to the Supabase Storage bucket 'denim-media'.
 * Returns public CDN URL on success.
 */
export async function uploadImageToSupabase(file: File): Promise<string> {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error("Supabase is not configured.");
  }

  const fileExt = file.name.split(".").pop() || "jpg";
  const cleanName = file.name.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 30);
  const filePath = `uploads/${Date.now()}_${cleanName}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("denim-media")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Storage upload failed: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from("denim-media").getPublicUrl(filePath);
  return data.publicUrl;
}

/**
 * Fetch all remote data from Supabase.
 */
export async function fetchRemoteData(): Promise<{
  troubles?: TroubleItem[];
  fashion?: FashionCard[];
  dictionary?: DictTerm[];
  gallery?: GalleryItem[];
  siteConfig?: SiteConfig;
  resources?: ResourceItem[];
  members?: MemberAccount[];
  payments?: PaymentRecord[];
}> {
  if (!isSupabaseConfigured() || !supabase) {
    return {};
  }

  const results: {
    troubles?: TroubleItem[];
    fashion?: FashionCard[];
    dictionary?: DictTerm[];
    gallery?: GalleryItem[];
    siteConfig?: SiteConfig;
    resources?: ResourceItem[];
    members?: MemberAccount[];
    payments?: PaymentRecord[];
  } = {};

  try {
    const [tRes, fRes, dRes, gRes, cRes, rRes, mRes] = await Promise.all([
      supabase.from("troubles").select("*").order("created_at", { ascending: true }),
      supabase.from("fashion").select("*").order("created_at", { ascending: true }),
      supabase.from("dictionary").select("*").order("created_at", { ascending: true }),
      supabase.from("gallery").select("*").order("created_at", { ascending: true }),
      supabase.from("site_config").select("*").eq("id", "main").single(),
      supabase.from("resources").select("*").order("created_at", { ascending: true }),
      supabase.from("members").select("*").order("created_at", { ascending: true }),
    ]);

    if (tRes.data && tRes.data.length > 0) {
      results.troubles = tRes.data.map((item) => ({
        id: item.id,
        title: item.title,
        tag: item.tag,
        problem: item.problem,
        causes: Array.isArray(item.causes) ? item.causes : [],
        solutions: Array.isArray(item.solutions) ? item.solutions : [],
        severity: item.severity,
      }));
    }

    if (fRes.data && fRes.data.length > 0) {
      results.fashion = fRes.data.map((item) => ({
        id: item.id,
        title: item.title,
        desc: item.desc || item.desc_text || "",
        tag: item.tag,
        image: item.image,
        stat: item.stat,
        content: item.content || undefined,
        author: item.author || undefined,
        readTime: item.read_time || item.readTime || undefined,
        publishedAt: item.published_at || item.publishedAt || undefined,
      }));
    }

    if (dRes.data && dRes.data.length > 0) {
      results.dictionary = dRes.data.map((item) => ({
        id: item.id,
        term: item.term,
        short: item.short,
        detail: item.detail,
        cat: item.cat,
      }));
    }

    if (gRes.data && gRes.data.length > 0) {
      results.gallery = gRes.data.map((item) => ({
        id: item.id,
        src: item.src,
        title: item.title,
        cat: item.cat,
        tall: !!item.tall,
      }));
    }

    if (cRes.data) {
      results.siteConfig = {
        brand: cRes.data.brand || "Denim Universe",
        tagline: cRes.data.tagline || "Explore the World of Denim",
        facebookUrl: cRes.data.facebook_url || "",
        email: cRes.data.email || "",
        whatsapp: cRes.data.whatsapp || "",
        location: cRes.data.location || "",
        logo: cRes.data.logo || "/logo.png",
        svgIcon: cRes.data.svg_icon || "/favicon.svg",
        gaId: cRes.data.ga_id || "",
      };
    }

    if (rRes.data && rRes.data.length > 0) {
      results.resources = rRes.data.map((item) => ({
        id: item.id,
        title: item.title,
        slug: item.slug || undefined,
        category: item.category,
        desc: item.description || item.desc || "",
        content: item.content || "",
        author: item.author || "Denim Universe",
        readTime: item.read_time || item.readTime || "5 min read",
        publishedAt: item.published_at || item.publishedAt || "Recent",
        image: item.image || "",
        isPremium: item.is_premium !== false,
        accessTier: (item.access_tier || (item.is_premium === false ? "free" : "premium")) as "free" | "basic" | "premium",
        singlePrice: item.single_price || "49 BDT",
        priceBadge: item.price_badge || "499 BDT · Paid Manual",
        pdfTitle: item.pdf_title || "Technical_Document.pdf",
        pdfUrl: item.pdf_url || "",
        pdfSize: item.pdf_size || "4.5 MB",
        pdfPages: item.pdf_pages || 20,
      }));
    }

    if (mRes.data && mRes.data.length > 0) {
      results.members = mRes.data.map((item) => ({
        id: item.id,
        email: item.email,
        password: item.password,
        name: item.name,
        status: item.status || "active",
        plan: (item.plan || (item.access_all ? "premium" : "free")) as "free" | "basic" | "premium",
        accessAll: item.plan === "premium" || item.access_all === true,
        allowedResourceIds: Array.isArray(item.allowed_resource_ids) ? item.allowed_resource_ids : [],
        notes: item.notes || "",
        createdAt: item.created_at || new Date().toISOString(),
      }));
    }

    // Try fetching payments safely
    try {
      const payRes = await supabase.from("payments").select("*").order("created_at", { ascending: false });
      if (payRes.data && payRes.data.length > 0) {
        results.payments = payRes.data.map((d) => ({
          id: d.id,
          memberId: d.member_id || undefined,
          memberName: d.member_name || "",
          memberEmail: d.member_email || "",
          paymentType: d.payment_type as "plan" | "single_pdf",
          planId: d.plan_id || undefined,
          planName: d.plan_name || undefined,
          resourceId: d.resource_id || undefined,
          resourceTitle: d.resource_title || undefined,
          amount: d.amount || "",
          method: (d.method || "bkash") as "bkash" | "nagad" | "bank" | "other",
          senderNumber: d.sender_number || undefined,
          trxId: d.trx_id || "",
          screenshotUrl: d.screenshot_url || undefined,
          status: (d.status || "pending") as "pending" | "approved" | "rejected",
          createdAt: d.created_at || new Date().toISOString(),
          reviewedAt: d.reviewed_at || undefined,
          adminNotes: d.admin_notes || undefined,
        }));
      }
    } catch (e) {
      console.warn("Could not load payments table from Supabase", e);
    }
  } catch (err) {
    console.error("Failed to fetch remote data from Supabase:", err);
  }

  return results;
}

// ----------------------------------------------------------------------------
// Cloud Mutations (Async Fire & Handle)
// ----------------------------------------------------------------------------

export async function syncRemoteTrouble(item: TroubleItem): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from("troubles").upsert({
      id: item.id,
      title: item.title,
      tag: item.tag,
      problem: item.problem,
      causes: item.causes,
      solutions: item.solutions,
      severity: item.severity,
    });
  } catch (e) {
    console.error("Error upserting trouble to Supabase", e);
  }
}

export async function deleteRemoteTrouble(id: string): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from("troubles").delete().eq("id", id);
  } catch (e) {
    console.error("Error deleting trouble from Supabase", e);
  }
}

export async function syncRemoteFashion(item: FashionCard): Promise<void> {
  if (!supabase) return;
  try {
    const payload: Record<string, unknown> = {
      id: item.id,
      title: item.title,
      desc: item.desc,
      tag: item.tag,
      image: item.image,
      stat: item.stat,
    };
    if (item.content !== undefined) payload.content = item.content;
    if (item.author !== undefined) payload.author = item.author;
    if (item.readTime !== undefined) payload.read_time = item.readTime;
    if (item.publishedAt !== undefined) payload.published_at = item.publishedAt;

    await supabase.from("fashion").upsert(payload);
  } catch (e) {
    console.error("Error upserting fashion to Supabase", e);
  }
}

export async function deleteRemoteFashion(id: string): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from("fashion").delete().eq("id", id);
  } catch (e) {
    console.error("Error deleting fashion from Supabase", e);
  }
}

export async function syncRemoteDictionary(item: DictTerm): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from("dictionary").upsert({
      id: item.id,
      term: item.term,
      short: item.short,
      detail: item.detail,
      cat: item.cat,
    });
  } catch (e) {
    console.error("Error upserting dictionary to Supabase", e);
  }
}

export async function deleteRemoteDictionary(id: string): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from("dictionary").delete().eq("id", id);
  } catch (e) {
    console.error("Error deleting dictionary from Supabase", e);
  }
}

export async function syncRemoteGallery(item: GalleryItem): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from("gallery").upsert({
      id: item.id,
      src: item.src,
      title: item.title,
      cat: item.cat,
      tall: item.tall ?? false,
    });
  } catch (e) {
    console.error("Error upserting gallery to Supabase", e);
  }
}

export async function deleteRemoteGallery(id: string): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from("gallery").delete().eq("id", id);
  } catch (e) {
    console.error("Error deleting gallery from Supabase", e);
  }
}

export async function syncRemoteSiteConfig(config: SiteConfig): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from("site_config").upsert({
      id: "main",
      brand: config.brand,
      tagline: config.tagline,
      facebook_url: config.facebookUrl,
      email: config.email,
      whatsapp: config.whatsapp,
      location: config.location,
      logo: config.logo,
      svg_icon: config.svgIcon,
      ga_id: config.gaId || null,
      updated_at: new Date().toISOString(),
    });
  } catch (e) {
    console.error("Error upserting site config to Supabase", e);
  }
}

export async function addRemoteSubscriber(email: string): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from("subscribers").upsert({
      email: email.trim().toLowerCase(),
      created_at: new Date().toISOString(),
    }, { onConflict: "email" });
  } catch (e) {
    console.warn("Could not save subscriber to Supabase", e);
  }
}

export async function addRemoteMessage(msg: { name: string; email: string; topic: string; message: string }): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from("messages").insert({
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: msg.name,
      email: msg.email,
      topic: msg.topic,
      message: msg.message,
      created_at: new Date().toISOString(),
    });
  } catch (e) {
    console.warn("Could not save message to Supabase", e);
  }
}

export async function fetchRemoteSubscribers(): Promise<string[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("subscribers")
      .select("email")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ? data.map((d: { email: string }) => d.email) : [];
  } catch (e) {
    console.warn("Could not fetch remote subscribers", e);
    return [];
  }
}

export async function fetchRemoteMessages(): Promise<Array<{ id: string; name: string; email: string; topic: string; message: string; created_at: string }>> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.warn("Could not fetch remote messages", e);
    return [];
  }
}

export async function syncRemoteResource(item: ResourceItem): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from("resources").upsert({
      id: item.id,
      title: item.title,
      slug: item.slug || null,
      category: item.category,
      description: item.desc,
      content: item.content,
      author: item.author,
      read_time: item.readTime,
      published_at: item.publishedAt,
      image: item.image,
      is_premium: item.isPremium,
      access_tier: item.accessTier || (item.isPremium ? "premium" : "free"),
      single_price: item.singlePrice || "49 BDT",
      price_badge: item.priceBadge,
      pdf_title: item.pdfTitle,
      pdf_url: item.pdfUrl,
      pdf_size: item.pdfSize,
      pdf_pages: item.pdfPages || null,
      updated_at: new Date().toISOString(),
    });
  } catch (e) {
    console.warn("Could not sync resource to Supabase", e);
  }
}

export async function deleteRemoteResource(id: string): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from("resources").delete().eq("id", id);
  } catch (e) {
    console.warn("Could not delete resource from Supabase", e);
  }
}

export async function syncRemoteMember(item: MemberAccount): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from("members").upsert({
      id: item.id,
      email: item.email.trim().toLowerCase(),
      password: item.password,
      name: item.name,
      status: item.status,
      plan: item.plan || (item.accessAll ? "premium" : "free"),
      access_all: item.plan === "premium" || item.accessAll,
      allowed_resource_ids: item.allowedResourceIds,
      notes: item.notes || null,
      updated_at: new Date().toISOString(),
    });
  } catch (e) {
    console.warn("Could not sync member to Supabase", e);
  }
}

export async function deleteRemoteMember(id: string): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from("members").delete().eq("id", id);
  } catch (e) {
    console.warn("Could not delete member from Supabase", e);
  }
}

export async function syncRemotePayment(payment: PaymentRecord): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from("payments").upsert({
      id: payment.id,
      member_id: payment.memberId || null,
      member_name: payment.memberName,
      member_email: payment.memberEmail.trim().toLowerCase(),
      payment_type: payment.paymentType,
      plan_id: payment.planId || null,
      plan_name: payment.planName || null,
      resource_id: payment.resourceId || null,
      resource_title: payment.resourceTitle || null,
      amount: payment.amount,
      method: payment.method,
      sender_number: payment.senderNumber || null,
      trx_id: payment.trxId.trim(),
      screenshot_url: payment.screenshotUrl || null,
      status: payment.status,
      created_at: payment.createdAt,
      reviewed_at: payment.reviewedAt || null,
      admin_notes: payment.adminNotes || null,
    });
  } catch (e) {
    console.warn("Could not sync payment to Supabase", e);
  }
}

export async function deleteRemotePayment(id: string): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from("payments").delete().eq("id", id);
  } catch (e) {
    console.warn("Could not delete payment from Supabase", e);
  }
}

export async function fetchRemotePayments(): Promise<PaymentRecord[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    if (!data) return [];
    return data.map((d) => ({
      id: d.id,
      memberId: d.member_id || undefined,
      memberName: d.member_name || "",
      memberEmail: d.member_email || "",
      paymentType: d.payment_type as "plan" | "single_pdf",
      planId: d.plan_id || undefined,
      planName: d.plan_name || undefined,
      resourceId: d.resource_id || undefined,
      resourceTitle: d.resource_title || undefined,
      amount: d.amount || "",
      method: (d.method || "bkash") as "bkash" | "nagad" | "bank" | "other",
      senderNumber: d.sender_number || undefined,
      trxId: d.trx_id || "",
      screenshotUrl: d.screenshot_url || undefined,
      status: (d.status || "pending") as "pending" | "approved" | "rejected",
      createdAt: d.created_at || new Date().toISOString(),
      reviewedAt: d.reviewed_at || undefined,
      adminNotes: d.admin_notes || undefined,
    }));
  } catch (e) {
    console.warn("Could not fetch remote payments from Supabase", e);
    return [];
  }
}


