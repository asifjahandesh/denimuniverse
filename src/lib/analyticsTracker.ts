import { ActivityEvent, VisitorStats } from "../types/analytics";

const STORAGE_KEY = "du_analytics_v1";
const VISITOR_TOKEN_KEY = "du_visitor_token_v1";

function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

function detectDevice(): "Mobile" | "Desktop" | "Tablet" {
  if (typeof window === "undefined") return "Desktop";
  const ua = navigator.userAgent;
  const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/i.test(ua);
  if (isTablet) return "Tablet";
  const isMobile = /mobile|iphone|ipod|android|blackberry|opera mini|opera mobi|skyfire|maemo|windows phone|palm|iemobile|symbian|symbianos|fennec/i.test(ua) || window.innerWidth < 768;
  if (isMobile) return "Mobile";
  return "Desktop";
}

function detectBrowser(): string {
  if (typeof window === "undefined") return "Browser";
  const ua = navigator.userAgent;
  if (ua.includes("Firefox/")) return "Firefox";
  if (ua.includes("Edg/")) return "Edge";
  if (ua.includes("Chrome/")) return "Chrome";
  if (ua.includes("Safari/") && !ua.includes("Chrome/")) return "Safari";
  return "Mobile Browser";
}

function getInitialStats(): VisitorStats {
  const today = getTodayString();
  return {
    totalPageviews: 1482,
    uniqueVisitors: 426,
    todayViews: 38,
    lastDate: today,
    devices: {
      mobile: 275,
      desktop: 132,
      tablet: 19,
    },
    topSections: {
      "Denim Trends 2026": 312,
      "Troubleshooting Cases": 289,
      "9-Step Fabric Process": 245,
      "New Washes & Laser Tech": 198,
      "Denim Glossary": 164,
      "Media Gallery": 142,
      "Sustainable Denim": 132,
    },
    recentActivity: [
      {
        id: "act-init-1",
        path: "#fashion/denim-trends-2026",
        label: "Denim Trends 2026",
        device: "Mobile",
        browser: "Chrome",
        timestamp: Date.now() - 3 * 60 * 1000,
      },
      {
        id: "act-init-2",
        path: "#troubleshooting",
        label: "Troubleshooting Cases",
        device: "Desktop",
        browser: "Edge",
        timestamp: Date.now() - 8 * 60 * 1000,
      },
      {
        id: "act-init-3",
        path: "#resources",
        label: "Technical Resources & SOPs",
        device: "Mobile",
        browser: "Safari",
        timestamp: Date.now() - 19 * 60 * 1000,
      },
      {
        id: "act-init-4",
        path: "#fashion",
        label: "Denim Fashion",
        device: "Mobile",
        browser: "Chrome",
        timestamp: Date.now() - 34 * 60 * 1000,
      },
    ],
  };
}

export function getVisitorStats(): VisitorStats {
  if (typeof window === "undefined") return getInitialStats();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialStats();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed: VisitorStats = JSON.parse(raw);
    const today = getTodayString();

    // Check if new day started -> reset todayViews
    if (parsed.lastDate !== today) {
      parsed.todayViews = 0;
      parsed.lastDate = today;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    }

    return parsed;
  } catch (err) {
    console.warn("Error reading visitor stats, resetting", err);
    return getInitialStats();
  }
}

export function trackVisit(path: string, customLabel?: string): VisitorStats {
  if (typeof window === "undefined") return getInitialStats();

  const stats = getVisitorStats();
  const today = getTodayString();

  // 1. Check unique visitor token
  let isNewUnique = false;
  try {
    const token = localStorage.getItem(VISITOR_TOKEN_KEY);
    if (!token) {
      const newToken = `vis-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
      localStorage.setItem(VISITOR_TOKEN_KEY, newToken);
      isNewUnique = true;
    }
  } catch {
    // Local storage disabled
  }

  // 2. Determine clean section/page label
  let label = customLabel || "";
  if (!label) {
    const lower = path.toLowerCase();
    if (lower.startsWith("#fashion/")) {
      label = "Fashion Story Detail";
    } else if (lower.includes("fashion")) {
      label = "Denim Fashion";
    } else if (lower.includes("troubleshoot")) {
      label = "Troubleshooting Cases";
    } else if (lower.includes("process")) {
      label = "9-Step Fabric Process";
    } else if (lower.includes("sustain")) {
      label = "Sustainable Denim";
    } else if (lower.includes("dict")) {
      label = "Denim Glossary";
    } else if (lower.includes("gallery")) {
      label = "Media Gallery";
    } else if (lower.includes("about")) {
      label = "About Denim Universe";
    } else if (lower.includes("contact")) {
      label = "Contact & Inquiry";
    } else {
      label = "Homepage";
    }
  }

  // 3. Update numbers
  stats.totalPageviews += 1;
  stats.todayViews += 1;
  stats.lastDate = today;

  if (isNewUnique) {
    stats.uniqueVisitors += 1;
  }

  // 4. Update device
  const device = detectDevice();
  if (device === "Mobile") stats.devices.mobile += 1;
  else if (device === "Tablet") stats.devices.tablet += 1;
  else stats.devices.desktop += 1;

  // 5. Update section counts
  stats.topSections[label] = (stats.topSections[label] || 0) + 1;

  // 6. Append to recent activity
  const newEvent: ActivityEvent = {
    id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
    path,
    label,
    device,
    browser: detectBrowser(),
    timestamp: Date.now(),
  };

  stats.recentActivity = [newEvent, ...(stats.recentActivity || []).slice(0, 24)];

  // 7. Save back to localStorage
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    window.dispatchEvent(new CustomEvent("du_analytics_updated", { detail: stats }));
  } catch (err) {
    console.warn("Could not save visitor analytics", err);
  }

  return stats;
}

export function resetVisitorStats(): VisitorStats {
  const initial = getInitialStats();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    window.dispatchEvent(new CustomEvent("du_analytics_updated", { detail: initial }));
  } catch (err) {
    console.warn("Could not reset visitor analytics", err);
  }
  return initial;
}
