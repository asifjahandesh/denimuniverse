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