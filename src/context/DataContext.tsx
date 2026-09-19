import React, { createContext, useContext, useState, useEffect } from "react";
import {
  TroubleItem,
  FashionCard,
  DictTerm,
  GalleryItem,
  SiteConfig,
} from "../types/content";
import {
  TROUBLES as DEFAULT_TROUBLES,
  FASHION_CARDS as DEFAULT_FASHION,
  DICTIONARY as DEFAULT_DICTIONARY,
  GALLERY as DEFAULT_GALLERY,
  SITE_CONFIG as DEFAULT_SITE_CONFIG,
} from "../data/content";
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
  getSupabaseHost,
} from "../lib/supabase";

interface DataContextType {
  troubles: TroubleItem[];
  fashionCards: FashionCard[];
  dictionary: DictTerm[];
  gallery: GalleryItem[];
  siteConfig: SiteConfig;

  // Cloud status
  isCloudConnected: boolean;
  cloudHost: string;

  // Auth & Navigation
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  isAuthenticated: boolean;
  login: (pin: string) => boolean;
  logout: () => void;

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
  AUTH: "du_admin_auth_v1",
};

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
    id: `fash-${idx + 1}-${Date.now().toString(36)}`,
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

function initConfig(): SiteConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error("Error reading site config from storage", e);
  }
  return { ...DEFAULT_SITE_CONFIG };
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [troubles, setTroubles] = useState<TroubleItem[]>(initTroubles);
  const [fashionCards, setFashionCards] = useState<FashionCard[]>(initFashion);
  const [dictionary, setDictionary] = useState<DictTerm[]>(initDictionary);
  const [gallery, setGallery] = useState<GalleryItem[]>(initGallery);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(initConfig);

  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(isSupabaseConfigured);
  const [cloudHost] = useState<string>(getSupabaseHost);

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.AUTH) === "true";
    } catch {
      return false;
    }
  });

  // Initial remote fetch if Supabase is configured
  useEffect(() => {
    if (isSupabaseConfigured()) {
      fetchRemoteData()
        .then((remote) => {
          if (remote.troubles && remote.troubles.length > 0) setTroubles(remote.troubles);
          if (remote.fashion && remote.fashion.length > 0) setFashionCards(remote.fashion);
          if (remote.dictionary && remote.dictionary.length > 0) setDictionary(remote.dictionary);
          if (remote.gallery && remote.gallery.length > 0) setGallery(remote.gallery);
          if (remote.siteConfig) setSiteConfig(remote.siteConfig);
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

  // Auth Methods
  const login = (pin: string): boolean => {
    if (pin.trim() === ADMIN_PIN) {
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem(STORAGE_KEYS.AUTH, "true");
      } catch {}
      setIsLoginModalOpen(false);
      setIsAdminOpen(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsAdminOpen(false);
    try {
      sessionStorage.removeItem(STORAGE_KEYS.AUTH);
    } catch {}
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

    localStorage.removeItem(STORAGE_KEYS.TROUBLES);
    localStorage.removeItem(STORAGE_KEYS.FASHION);
    localStorage.removeItem(STORAGE_KEYS.DICTIONARY);
    localStorage.removeItem(STORAGE_KEYS.GALLERY);
    localStorage.removeItem(STORAGE_KEYS.CONFIG);
  };

  return (
    <DataContext.Provider
      value={{
        troubles,
        fashionCards,
        dictionary,
        gallery,
        siteConfig,
        isCloudConnected,
        cloudHost,
        isAdminOpen,
        setIsAdminOpen,
        isLoginModalOpen,
        setIsLoginModalOpen,
        isAuthenticated,
        login,
        logout,
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