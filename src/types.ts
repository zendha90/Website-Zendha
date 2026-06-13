export interface AffiliateLink {
  id: string;
  title: string;
  url: string;
  category: string;
  clicks: number;
  isActive: boolean;
  priority: number;
  description?: string;
  buttonLabel?: string;
  imageUrl?: string;
}

export interface DesignSettings {
  theme: string;
  header: {
    layout: 'classic' | 'hero' | 'banner' | 'cutout' | 'shape';
    titleStyle: 'text' | 'logo';
  };
  typography: {
    fontFamily: 'sans' | 'display' | 'mono' | 'serif';
  };
  buttons: {
    style: 'rounded-full' | 'rounded-2xl' | 'rounded-lg' | 'rounded-none';
    shadow: 'none' | 'soft' | 'hard';
  };
  colors: {
    background: string;
    buttons: string;
    buttonText: string;
    pageText: string;
    title: string;
    backgroundGradientSecond?: string;
  };
  layoutStyle?: 'grid' | 'list';
  backgroundType?: 'solid' | 'gradient' | 'glass';
  cardOpacity?: number;
  hoverAnimation?: 'scale' | 'lift' | 'tilt' | 'none';
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
  contactBadge?: string;
  contactTitle?: string;
  contactTitleHighlight?: string;
  contactDescription?: string;
  stats?: Array<{ value: string; label: string; desc: string }>;
  statsBadge?: string;
  statsTitle?: string;
  statsDescription?: string;
  
  // Projects Section
  projectsBadge?: string;
  projectsTitle?: string;
  projectsDescription?: string;

  // Pricing Section
  pricingBadge?: string;
  pricingTitle?: string;
  pricingDescription?: string;

  // Brands Section
  brandsBadge?: string;
  brandsTitle?: string;

  // Terms Section
  termsBadge?: string;
  termsTitle?: string;
  termsDescription?: string;

  termsOfService?: string[];
  
  // New Customizable Titles
  studioDirectorTitle?: string;
  studioEstdYear?: string;

  // Custom SEO / Browser titles & Favicon
  linktreeTitle?: string;
  ratecardTitle?: string;
  faviconUrl?: string;

  // Design Settings
  designSettings?: DesignSettings;
}

export interface RatecardService {
  id: string;
  title: string;
  price: string;
  description: string;
  icon: string;
  category?: string;
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
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export interface VisitLog {
  id: string;
  timestamp: string; // ISO String
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  viewType: 'linktree' | 'ratecard';
}

export interface AppData {
  links: AffiliateLink[];
  profile: RatecardProfile;
  services: RatecardService[];
  projects: RatecardProject[];
  brands?: RatecardBrand[];
  clickLogs?: ClickLog[];
  visitLogs?: VisitLog[];
}
