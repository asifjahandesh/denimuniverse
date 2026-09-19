export interface ActivityEvent {
  id: string;
  path: string;
  label: string;
  device: "Mobile" | "Desktop" | "Tablet";
  browser: string;
  timestamp: number;
}

export interface VisitorStats {
  totalPageviews: number;
  uniqueVisitors: number;
  todayViews: number;
  lastDate: string; // YYYY-MM-DD
  devices: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  topSections: Record<string, number>;
  recentActivity: ActivityEvent[];
}
