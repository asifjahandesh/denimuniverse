import React, { useEffect } from "react";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { useData } from "../context/DataContext";

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
 */
export default function Analytics() {
  const { siteConfig } = useData();
  const envGaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  const activeGaId = siteConfig?.gaId?.trim() || (typeof envGaId === "string" ? envGaId.trim() : "");

  // GA4 Script Injection & Tracking
  useEffect(() => {
    if (!activeGaId || !activeGaId.startsWith("G-")) return;

    // Check if script already loaded
    const scriptId = `ga-script-${activeGaId}`;
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${activeGaId}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        window.dataLayer?.push(arguments);
      };
      window.gtag("js", new Date());
      window.gtag("config", activeGaId, {
        page_path: window.location.pathname + window.location.hash,
      });
    }

    // Track hash changes (e.g. #troubleshooting, #fashion, #process)
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

  return (
    <>
      {/* Vercel Web Analytics Collector */}
      <VercelAnalytics />
    </>
  );
}
