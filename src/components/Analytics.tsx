import React, { useEffect } from "react";
import { useData } from "../context/DataContext";
import { trackVisit } from "../lib/analyticsTracker";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Global Analytics component supporting:
 * 1. Vercel Web Analytics (Automatic, zero-config, privacy-friendly)
 * 2. Google Analytics 4 (GA4) with dynamic ID from Admin Panel (siteConfig.gaId) or .env (VITE_GA_MEASUREMENT_ID)
 * 3. In-App Visitor Tracker for Admin Panel Dashboard
 */
export default function Analytics() {
  const { siteConfig } = useData();
  const envGaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  const activeGaId = siteConfig?.gaId?.trim() || (typeof envGaId === "string" ? envGaId.trim() : "G-XEYN7P0ZQM");

  // In-App Local & Real-time Visitor Tracking
  useEffect(() => {
    trackVisit(window.location.hash || "/");

    const handleLocalTrack = () => {
      trackVisit(window.location.hash || "/");
    };

    window.addEventListener("hashchange", handleLocalTrack);
    return () => {
      window.removeEventListener("hashchange", handleLocalTrack);
    };
  }, []);

  // GA4 Script Injection & Tracking
  useEffect(() => {
    if (!activeGaId || !activeGaId.startsWith("G-")) return;

    // Check if script already loaded in index.html or dynamically
    const scriptId = `ga-script-${activeGaId}`;
    const existingScript = document.getElementById(scriptId) || document.querySelector(`script[src*="${activeGaId}"]`);
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${activeGaId}`;
      document.head.appendChild(script);
    }

    if (!window.gtag) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        window.dataLayer?.push(arguments);
      };
      window.gtag("js", new Date());
      window.gtag("config", activeGaId, {
        page_path: window.location.pathname + window.location.hash,
      });
    }

    // Track hash changes (e.g. #troubleshooting, #fashion, #resources)
    const handleHashChange = () => {
      if (typeof window.gtag === "function") {
        window.gtag("config", activeGaId, {
          page_path: window.location.pathname + window.location.hash,
        });
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [activeGaId]);

  // Vercel Web Analytics (Edge Script injection on production with zero npm package dependency)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (document.getElementById("vercel-va-script")) return;
    if (window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
      const script = document.createElement("script");
      script.id = "vercel-va-script";
      script.src = "/_vercel/insights/script.js";
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  return null;
}
