export interface AffiliateLink {
  id: string;
  title: string;
  url: string;
  category: string;
  clicks: number;
  isActive: boolean;
  priority: number;
  description?: string;
  imageUrl?: string;
}

export interface RatecardProfile {
  name: string;
  bio: string;
  instagram: string;
  tiktok: string;
  youtube: string;
  email: string;
  avatarUrl: string;
  whatsapp?: string;
  
  // Customizable Ratecard Texts
  heroTagline?: string;
  heroTitle1?: string;
  heroTitleHighlight?: string;
  heroDescription?: string;
  domicile?: string;
  contactPhone?: string;
  stats?: Array<{ value: string; label: string; desc: string }>;
  termsOfService?: string[];
  
  // New Customizable Titles
  studioDirectorTitle?: string;
  studioEstdYear?: string;
}

export interface RatecardService {
  id: string;
  title: string;
  price: string;
  description: string;
  icon: string;
  isActive: boolean;
  priority: number;
  additionalFees?: Array<{ label: string; value: string }>;
}

export interface RatecardProject {
  id: string;
  title: string;
  highlight: string;
  views: string;
  imageUrl?: string;
  category: string;
  url: string;
}

export interface RatecardBrand {
  id: string;
  name: string;
  logoUrl?: string;
  isActive: boolean;
  priority: number;
}

export interface ClickLog {
  id: string;
  linkId: string;
  timestamp: string; // ISO String
}

export interface AppData {
  links: AffiliateLink[];
  profile: RatecardProfile;
  services: RatecardService[];
  projects: RatecardProject[];
  brands?: RatecardBrand[];
  clickLogs?: ClickLog[];
}
