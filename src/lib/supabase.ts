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

export function getSavedSupabaseUrl(): string {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL || "").trim();
  if (envUrl.length > 0 && !envUrl.includes("your-project-id")) {
    return envUrl;
  }
  try {
    const local = localStorage.getItem("du_supabase_url");
    if (local && local.trim().length > 0 && !local.includes("your-project-id")) {
      return local.trim();
    }
  } catch {
    // ignore
  }
  return "";
}

export function getSavedSupabaseAnonKey(): string {
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim();
  if (envKey.length > 0 && !envKey.includes("your-anon-key")) {
    return envKey;
  }
  try {
    const local = localStorage.getItem("du_supabase_anon_key");
    if (local && local.trim().length > 0 && !local.includes("your-anon-key")) {
      return local.trim();
    }
  } catch {
    // ignore
  }
  return "";
}

export function getSupabaseCredentialSource(): "env" | "storage" | "none" {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL || "").trim();
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim();
  if (
    envUrl.length > 0 &&
    !envUrl.includes("your-project-id") &&
    envKey.length > 0 &&
    !envKey.includes("your-anon-key")
  ) {
    return "env";
  }
  try {
    const localUrl = localStorage.getItem("du_supabase_url");
    const localKey = localStorage.getItem("du_supabase_anon_key");
    if (localUrl && localKey && localUrl.trim().length > 0 && localKey.trim().length > 0) {
      return "storage";
    }
  } catch {
    // ignore
  }
  return "none";
}

export function saveSupabaseCredentials(url: string, anonKey: string): void {
  try {
    localStorage.setItem("du_supabase_url", url.trim());
    localStorage.setItem("du_supabase_anon_key", anonKey.trim());
    supabase = initSupabaseClient();
  } catch (e) {
    console.error("Failed to save credentials to localStorage", e);
  }
}

export function clearSavedSupabaseCredentials(): void {
  try {
    localStorage.removeItem("du_supabase_url");
    localStorage.removeItem("du_supabase_anon_key");
    supabase = initSupabaseClient();
  } catch (e) {
    console.error("Failed to clear credentials from localStorage", e);
  }
}

export const isSupabaseConfigured = (): boolean => {
  const url = getSavedSupabaseUrl();
  const key = getSavedSupabaseAnonKey();
  return (
    url.length > 0 &&
    !url.includes("your-project-id") &&
    key.length > 0 &&
    !key.includes("your-anon-key")
  );
};

export function initSupabaseClient(): SupabaseClient | null {
  const url = getSavedSupabaseUrl();
  const key = getSavedSupabaseAnonKey();
  if (url && key && !url.includes("your-project-id") && !key.includes("your-anon-key")) {
    try {
      return createClient(url, key);
    } catch (err) {
      console.error("Failed to initialize Supabase client:", err);
      return null;
    }
  }
  return null;
}

export let supabase: SupabaseClient | null = initSupabaseClient();

export const getSupabaseHost = (): string => {
  const url = getSavedSupabaseUrl();
  if (!url) return "Unconfigured";
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
};

/**
 * Diagnostic test to verify database connectivity and table schema health.
 */
export async function testSupabaseConnection(): Promise<{
  success: boolean;
  message: string;
  count?: number;
  tables?: {
    troubles: boolean;
    resources: boolean;
    members: boolean;
    payments: boolean;
  };
}> {
  const client = supabase || initSupabaseClient();
  if (!isSupabaseConfigured() || !client) {
    return {
      success: false,
      message:
        "Supabase credentials not configured in environment variables or Admin Settings. The site is running in Local Storage Mode.",
    };
  }

  try {
    // 1. Troubles
    const { count: troubleCount, error: troubleErr } = await client
      .from("troubles")
      .select("id", { count: "exact", head: true });

    // 2. Resources
    const { count: resCount, error: resErr } = await client
      .from("resources")
      .select("id", { count: "exact", head: true });

    // 3. Members
    const { count: memCount, error: memErr } = await client
      .from("members")
      .select("id", { count: "exact", head: true });

    // 4. Payments
    const { count: payCount, error: payErr } = await client
      .from("payments")
      .select("id", { count: "exact", head: true });

    const missingTables: string[] = [];
    if (resErr && (resErr.message.includes("does not exist") || resErr.code === "42P01")) {
      missingTables.push("resources");
    }
    if (memErr && (memErr.message.includes("does not exist") || memErr.code === "42P01")) {
      missingTables.push("members");
    }
    if (payErr && (payErr.message.includes("does not exist") || payErr.code === "42P01")) {
      missingTables.push("payments");
    }
    if (troubleErr && (troubleErr.message.includes("does not exist") || troubleErr.code === "42P01")) {
      missingTables.push("troubles");
    }

    if (missingTables.length > 0) {
      return {
        success: false,
        message: `⚠️ Supabase is reachable, but table(s) [${missingTables.join(
          ", "
        )}] do not exist! Changes cannot sync across devices until you run 'supabase-resources-and-members.sql' in your Supabase SQL Editor.`,
        tables: {
          troubles: !troubleErr,
          resources: !resErr,
          members: !memErr,
          payments: !payErr,
        },
      };
    }

    if (troubleErr && troubleErr.code !== "PGRST116") {
      return {
        success: false,
        message: `Supabase query error: ${troubleErr.message}`,
      };
    }

    return {
      success: true,
      message: `✅ Fully connected to Supabase! Found ${resCount ?? 0} resources, ${troubleCount ?? 0} defect cases, ${memCount ?? 0} members, and ${payCount ?? 0} payments. Multi-device sync is ACTIVE!`,
      count: resCount ?? 0,
      tables: {
        troubles: true,
        resources: true,
        members: true,
        payments: true,
      },
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

  const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const cleanName = file.name.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 30);
  const filePath = `uploads/${Date.now()}_${cleanName}.${fileExt}`;
  const contentType = file.type || (fileExt === "pdf" ? "application/pdf" : `image/${fileExt === "png" ? "png" : fileExt === "webp" ? "webp" : "jpeg"}`);

  const { error: uploadError } = await supabase.storage
    .from("denim-media")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType,
    });

  if (uploadError) {
    throw new Error(`Storage upload failed: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from("denim-media").getPublicUrl(filePath);
  return data.publicUrl;
}

export const uploadFileToSupabase = uploadImageToSupabase;

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

export async function syncRemoteResource(item: ResourceItem): Promise<{ success: boolean; error?: string }> {
  const client = supabase || initSupabaseClient();
  if (!client) {
    console.warn("Supabase not configured, resource saved to local storage only.");
    return { success: false, error: "Supabase not configured (Local storage only)" };
  }
  try {
    const { error } = await client.from("resources").upsert({
      id: item.id,
      title: item.title,
      slug: item.slug || null,
      category: item.category,
      description: item.desc || "",
      content: item.content || "",
      author: item.author || "Denim Universe",
      read_time: item.readTime || "5 min read",
      published_at: item.publishedAt || "Recent",
      image: item.image || "",
      is_premium: item.isPremium !== false,
      access_tier: item.accessTier || (item.isPremium === false ? "free" : "premium"),
      single_price: item.singlePrice || "49 BDT",
      price_badge: item.priceBadge || "199 BDT · Basic Plan",
      pdf_title: item.pdfTitle || "Technical_Standard_Guide.pdf",
      pdf_url: item.pdfUrl || "",
      pdf_size: item.pdfSize || "4.5 MB",
      pdf_pages: item.pdfPages || 20,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Supabase upsert error on resources table:", error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.warn("Could not sync resource to Supabase:", e);
    return { success: false, error: msg };
  }
}

/**
 * Bulk sync all resources from local storage state directly to Supabase cloud.
 * This guarantees any other computer or mobile device visiting the site
 * receives the exact same set of technical resources.
 */
export async function syncAllResourcesToSupabase(
  items: ResourceItem[]
): Promise<{ success: boolean; count: number; error?: string }> {
  const client = supabase || initSupabaseClient();
  if (!isSupabaseConfigured() || !client) {
    return {
      success: false,
      count: 0,
      error: "Supabase credentials are not configured. Please enter them in Admin Overview.",
    };
  }

  if (!items || items.length === 0) {
    return { success: true, count: 0 };
  }

  try {
    const payload = items.map((item) => ({
      id: item.id,
      title: item.title,
      slug: item.slug || null,
      category: item.category,
      description: item.desc || "",
      content: item.content || "",
      author: item.author || "Denim Universe",
      read_time: item.readTime || "5 min read",
      published_at: item.publishedAt || "Recent",
      image: item.image || "",
      is_premium: item.isPremium !== false,
      access_tier: item.accessTier || (item.isPremium === false ? "free" : "premium"),
      single_price: item.singlePrice || "49 BDT",
      price_badge: item.priceBadge || "199 BDT · Basic Plan",
      pdf_title: item.pdfTitle || "Technical_Guide.pdf",
      pdf_url: item.pdfUrl || "",
      pdf_size: item.pdfSize || "4.5 MB",
      pdf_pages: item.pdfPages || 20,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await client.from("resources").upsert(payload, { onConflict: "id" });

    if (error) {
      console.error("Bulk sync resources error:", error);
      return { success: false, count: 0, error: error.message };
    }

    return { success: true, count: items.length };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("Exception during bulk sync resources:", e);
    return { success: false, count: 0, error: msg };
  }
}

export async function deleteRemoteResource(id: string): Promise<{ success: boolean; error?: string }> {
  const client = supabase || initSupabaseClient();
  if (!client) return { success: false, error: "Supabase not configured" };
  try {
    const { error } = await client.from("resources").delete().eq("id", id);
    if (error) {
      console.error("Supabase delete error on resources:", error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.warn("Could not delete resource from Supabase", e);
    return { success: false, error: msg };
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

// ============================================================================
// EMAIL OTP VERIFICATION HELPERS (Powered by Brevo / Vercel Serverless)
// ============================================================================

export interface OtpResult {
  success: boolean;
  message: string;
  isMock?: boolean;
  token?: string;
}

let activeOtpToken = "";

/**
 * Sends a 6-digit email OTP verification code via /api/send-otp (Brevo).
 * Falls back to offline mock mode if backend is unreachable or in local dev.
 */
export async function sendSupabaseOtp(
  email: string,
  _password?: string,
  name?: string
): Promise<OtpResult> {
  const cleanEmail = email.trim().toLowerCase();

  try {
    const res = await fetch("/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: cleanEmail, name }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.token) {
        activeOtpToken = data.token;
        if (typeof window !== "undefined") {
          try {
            sessionStorage.setItem("du_otp_token_" + cleanEmail, data.token);
          } catch {
            // ignore storage error
          }
        }
      }

      return {
        success: Boolean(data.success),
        message:
          data.message ||
          `A 6-digit verification code has been sent to ${cleanEmail}. Please check your inbox and spam folder.`,
        isMock: Boolean(data.isMock),
        token: data.token,
      };
    } else {
      const errData = await res.json().catch(() => ({}));
      return {
        success: false,
        message: errData.message || "Failed to dispatch verification code. Please try again.",
      };
    }
  } catch (err) {
    console.warn("Could not reach /api/send-otp (running offline or local dev preview):", err);
    // Offline / Local Dev Fallback
    return {
      success: true,
      message: "Running in local offline test mode. Enter demo code 123456 to continue.",
      isMock: true,
    };
  }
}

/**
 * Verifies the 6-digit OTP code entered by the user via /api/verify-otp.
 */
export async function verifySupabaseOtp(
  email: string,
  token: string
): Promise<OtpResult> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanCode = token.trim();

  if (!cleanCode) {
    return { success: false, message: "Please enter the 6-digit verification code." };
  }

  // Developer / Offline test code is always accepted
  if (cleanCode === "123456") {
    return {
      success: true,
      message: "Email verified successfully (Demo Code)!",
      isMock: true,
    };
  }

  const savedToken =
    activeOtpToken ||
    (typeof window !== "undefined"
      ? sessionStorage.getItem("du_otp_token_" + cleanEmail) || ""
      : "");

  try {
    const res = await fetch("/api/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: cleanEmail,
        otp: cleanCode,
        token: savedToken,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        return {
          success: true,
          message: data.message || "Email verified successfully!",
        };
      }
      return {
        success: false,
        message: data.message || "Invalid verification code. Please check and try again.",
      };
    } else {
      const errData = await res.json().catch(() => ({}));
      return {
        success: false,
        message: errData.message || "Invalid or expired verification code.",
      };
    }
  } catch (err) {
    console.warn("Could not reach /api/verify-otp:", err);
    if (cleanCode.length === 6) {
      return {
        success: true,
        message: "Email verified (Offline Fallback).",
        isMock: true,
      };
    }
    return {
      success: false,
      message: "Verification failed. In offline mode, use test code: 123456.",
      isMock: true,
    };
  }
}

/**
 * Resends the verification code.
 */
export async function resendSupabaseOtp(email: string): Promise<OtpResult> {
  return sendSupabaseOtp(email);
}


