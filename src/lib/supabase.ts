import { createClient, SupabaseClient } from "@supabase/supabase-js";
import {
  TroubleItem,
  FashionCard,
  DictTerm,
  GalleryItem,
  SiteConfig,
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
  } = {};

  try {
    const [tRes, fRes, dRes, gRes, cRes] = await Promise.all([
      supabase.from("troubles").select("*").order("created_at", { ascending: true }),
      supabase.from("fashion").select("*").order("created_at", { ascending: true }),
      supabase.from("dictionary").select("*").order("created_at", { ascending: true }),
      supabase.from("gallery").select("*").order("created_at", { ascending: true }),
      supabase.from("site_config").select("*").eq("id", "main").single(),
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
      };
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
    await supabase.from("fashion").upsert({
      id: item.id,
      title: item.title,
      desc: item.desc,
      tag: item.tag,
      image: item.image,
      stat: item.stat,
    });
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
      updated_at: new Date().toISOString(),
    });
  } catch (e) {
    console.error("Error upserting site config to Supabase", e);
  }
}
