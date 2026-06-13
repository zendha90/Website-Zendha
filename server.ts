import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import AdmZip from 'adm-zip';

const app = express();
const PORT = 3000;

// Pathing for local file persistence
const DATA_DIR = process.env.DATA_PATH ? process.env.DATA_PATH : path.join(process.cwd(), 'data');
console.log('--- SYSTEM STARTUP ---');
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Data Directory Path:', DATA_DIR);
console.log('-----------------------');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Interfaces
interface AffiliateLink {
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

interface ClickLog {
  id: string;
  linkId: string;
  timestamp: string; // ISO String
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

interface VisitLog {
  id: string;
  timestamp: string; // ISO String
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  viewType: 'linktree' | 'ratecard';
}

interface DesignSettings {
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
  };
}

interface RatecardProfile {
  name: string;
  bio: string;
  instagram: string;
  tiktok: string;
  youtube: string;
  email: string;
  avatarUrl: string;
  whatsapp?: string;
  
  // Ratecard Configs
  heroTagline?: string;
  heroTitle1?: string;
  heroTitleHighlight?: string;
  heroDescription?: string;
  domicile?: string;
  contactPhone?: string;
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

  // Contact Section
  contactBadge?: string;
  contactTitle?: string;
  contactTitleHighlight?: string;
  contactDescription?: string;

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

interface RatecardService {
  id: string;
  title: string;
  price: string;
  description: string;
  icon: string; // Video, Instagram, Youtube, MessageSquare, Briefcase, etc.
  category?: string;
  isActive: boolean;
  priority: number;
  additionalFees?: Array<{ label: string; value: string }>;
}

interface RatecardProject {
  id: string;
  title: string;
  highlight: string;
  views: string;
  imageUrl?: string;
  category: string;
  url: string;
}

interface GitHubSettings {
  enabled: boolean;
  token: string;
  owner: string;
  repo: string;
  branch: string;
  path: string;
}

interface RatecardBrand {
  id: string;
  name: string;
  logoUrl?: string;
  isActive: boolean;
  priority: number;
}

interface DatabaseSchema {
  links: AffiliateLink[];
  profile: RatecardProfile;
  services: RatecardService[];
  projects: RatecardProject[];
  brands?: RatecardBrand[];
  clickLogs?: ClickLog[];
  visitLogs?: VisitLog[];
  githubSettings?: {
    enabled: boolean;
    token: string;
    owner: string;
    repo: string;
    branch: string;
    path: string;
  };
}

// Default Data Seed
const DEFAULT_DB: DatabaseSchema = {
  links: [
    {
      id: "link-1",
      title: "Mechanical Keyboard Wireless Gateron Tech",
      url: "https://shope.ee/custom-mechanical-keyboard-gateron",
      category: "Shopee",
      clicks: 142,
      isActive: true,
      priority: 1,
      description: "Keyboard andalan untuk produktivitas & setup clean. Wireless dengan hot-swappable switches.",
      imageUrl: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=800&h=400"
    },
    {
      id: "link-2",
      title: "Desk Mat Kulit Sapi Premium Desk",
      url: "https://shope.ee/premium-leather-deskmat-minimal",
      category: "Shopee",
      clicks: 89,
      isActive: true,
      priority: 2,
      description: "Alas meja bahan kulit sintetis/asli tahan air, memberi kesan mewah & rapi.",
      imageUrl: "https://images.unsplash.com/photo-1632292224971-0d45778bd364?auto=format&fit=crop&q=80&w=800&h=400"
    },
    {
      id: "link-3",
      title: "GaN Charger 65W Triple Port Super Fast",
      url: "https://tokopedia.link/gan-charger-fastcharging",
      category: "Tokopedia",
      clicks: 110,
      isActive: true,
      priority: 3,
      description: "Satu charger untuk semua gadget! Support laptop, tablet, dan smartphone super fast charging.",
      imageUrl: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80&w=800&h=400"
    },
    {
      id: "link-4",
      title: "Stand Holder Laptop Aluminium Adjustable",
      url: "https://tiktok.com/@yourusername/shop/laptop-stand",
      category: "TikTok Shop",
      clicks: 65,
      isActive: true,
      priority: 4,
      description: "Ergonomis, mengurangi pegal leher saat kerja lama di depan laptop.",
      imageUrl: "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?auto=format&fit=crop&q=80&w=800&h=400"
    },
    {
      id: "link-5",
      title: "Instagram Creator - Tips Workspace & Tech",
      url: "https://instagram.com/yourusername",
      category: "Social Media",
      clicks: 215,
      isActive: true,
      priority: 5,
      description: "Ikuti konten harian seputar setup minimalis, ulasan gadget, dan tutorial teknologi.",
      imageUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=800&h=400"
    }
  ],
  profile: {
    name: "Aesthetic Creator",
    bio: "Tech Content Creator & Workspaces Enthusiast. Membagikan inspirasi setup meja kerja minimalis, ulasan gadget fungsional, dan tips produktivitas digital.",
    instagram: "https://instagram.com/yourusername",
    tiktok: "https://tiktok.com/@yourusername",
    youtube: "https://youtube.com/@yourusername",
    email: "creator@example.com",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=400",
    whatsapp: "https://wa.me/628123456789",
    designSettings: {
      theme: 'minimalist',
      header: { layout: 'classic', titleStyle: 'text' },
      typography: { fontFamily: 'sans' },
      buttons: { style: 'rounded-2xl', shadow: 'soft' },
      colors: { background: '#FFFFFF', buttons: '#1e293b', buttonText: '#FFFFFF', pageText: '#334155', title: '#0f172a' }
    }
  },
  services: [
    {
      id: "service-1",
      title: "Instagram Reels & TikTok Video Review (Shorts)",
      price: "Rp 1.500.000",
      description: "Video review berdurasi 30-60 detik. Membahas USP produk, kualitas build, dan integrasi setup. Hak guna komersial 3 bulan, posting silang Instagram Reels & TikTok.",
      icon: "Video",
      isActive: true,
      priority: 1,
      additionalFees: [
        { label: "Add Produk dalam 1 konten (per produk)", value: "+ 50%" },
        { label: "Tag Collaboration", value: "+ 100%" },
        { label: "Owning Content (maksimal 1 bulan)", value: "+ 100%" }
      ]
    },
    {
      id: "service-2",
      title: "YouTube Dedicated Review Video",
      price: "Rp 3.500.000",
      description: "Review mendalam berdurasi 5-10 menit di Channel YouTube Utama. Membahas unboxing, detail spesifikasi, perbandingan, kelebihan & kekurangan, dan link pembelian selama 6 bulan di kolom deksripsi.",
      icon: "Youtube",
      isActive: true,
      priority: 2,
      additionalFees: [
        { label: "Add Produk dalam 1 konten (per produk)", value: "+ 50%" },
        { label: "Tag Collaboration", value: "+ 100%" },
        { label: "Owning Content (maksimal 1 bulan)", value: "+ 100%" }
      ]
    },
    {
      id: "service-3",
      title: "Instagram Story Slide Promo with Link",
      price: "Rp 600.000",
      description: "3 slide berurutan (Hook -> Product Benefit -> Swipe Up/Link Sticker). Mempromosikan kampanye belanja, flash sale, atau rilis produk baru.",
      icon: "Instagram",
      isActive: true,
      priority: 3,
      additionalFees: [
        { label: "Add Produk dalam 1 konten (per produk)", value: "+ 50%" },
        { label: "Tag Collaboration", value: "+ 100%" },
        { label: "Owning Content (maksimal 1 bulan)", value: "+ 100%" }
      ]
    },
    {
      id: "service-4",
      title: "Product Photography Showcase & Setup Integration",
      price: "Rp 1.000.050",
      description: "3 Buah foto produk berkualitas tinggi terintegrasi dengan desk setup minimalis aesthetics. Bisa digunakan untuk aset sosial media brand, resolusi tinggi.",
      icon: "Camera",
      isActive: true,
      priority: 4,
      additionalFees: [
        { label: "Add Produk dalam 1 konten (per produk)", value: "+ 50%" },
        { label: "Tag Collaboration", value: "+ 100%" },
        { label: "Owning Content (maksimal 1 bulan)", value: "+ 100%" }
      ]
    }
  ],
  projects: [
    {
      id: "project-1",
      title: "PASANG AC TANPA",
      highlight: "bobok tembok",
      views: "1.3M",
      imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400",
      category: "Room Upgrades",
      url: "https://www.instagram.com/p/CzX8Y_vvaBc/"
    },
    {
      id: "project-2",
      title: "lah.. kamar cuma",
      highlight: "lebar 3 meter",
      views: "3M",
      imageUrl: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=400",
      category: "Aesthetic Makeover",
      url: "https://www.instagram.com/p/Cyl23vyPrX8/"
    },
    {
      id: "project-3",
      title: "Lebih efisien dan rapi!",
      highlight: "di ACE Indonesia  😍👍",
      views: "2.5M",
      imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=400",
      category: "Organization Hacks",
      url: "https://www.instagram.com/p/Cxl9Y_vPyzX/"
    }
  ],
  brands: [
    { id: "brand-1", name: "IKEA", logoUrl: "", priority: 1, isActive: true },
    { id: "brand-2", name: "BOSE", logoUrl: "", priority: 2, isActive: true },
    { id: "brand-3", name: "Midea", logoUrl: "", priority: 3, isActive: true },
    { id: "brand-4", name: "Indomaret", logoUrl: "", priority: 4, isActive: true },
    { id: "brand-5", name: "MR DIY", logoUrl: "", priority: 5, isActive: true },
    { id: "brand-6", name: "Olymplast", logoUrl: "", priority: 6, isActive: true },
    { id: "brand-7", name: "Polki", logoUrl: "", priority: 7, isActive: true },
    { id: "brand-8", name: "Home Guard", logoUrl: "", priority: 8, isActive: true },
    { id: "brand-9", name: "Meco", logoUrl: "", priority: 9, isActive: true },
    { id: "brand-10", name: "Advance", logoUrl: "", priority: 10, isActive: true }
  ]
};

// Database helper functions
function readDb(): DatabaseSchema {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const db = JSON.parse(content);
      let changed = false;
      if (!db.projects) {
        db.projects = DEFAULT_DB.projects;
        changed = true;
      }

      if (!db.brands || db.brands.length === 0) {
        db.brands = DEFAULT_DB.brands;
        changed = true;
      }

      if (db.profile) {
        if (db.profile.name === "Zendha Refitra") {
          db.profile.name = "Aesthetic Creator";
          db.profile.bio = DEFAULT_DB.profile.bio;
          db.profile.instagram = DEFAULT_DB.profile.instagram;
          db.profile.tiktok = DEFAULT_DB.profile.tiktok;
          db.profile.youtube = DEFAULT_DB.profile.youtube;
          db.profile.email = DEFAULT_DB.profile.email;
          db.profile.contactPhone = DEFAULT_DB.profile.contactPhone || "+62-8123-456-789";
          db.profile.whatsapp = DEFAULT_DB.profile.whatsapp;
          if (db.profile.heroDescription && db.profile.heroDescription.includes("Zendha")) {
            db.profile.heroDescription = DEFAULT_DB.profile.heroDescription;
          }
          changed = true;
        }

        if (!db.profile.designSettings) {
          db.profile.designSettings = { ...DEFAULT_DB.profile.designSettings! };
          changed = true;
        } else {
          // Deep merge sub-fields to ensure no field is missing in runtime
          const ds = db.profile.designSettings;
          const defDs = DEFAULT_DB.profile.designSettings!;
          
          if (!ds.header) { ds.header = { ...defDs.header }; changed = true; }
          if (!ds.typography) { ds.typography = { ...defDs.typography }; changed = true; }
          if (!ds.buttons) { ds.buttons = { ...defDs.buttons }; changed = true; }
          if (!ds.colors) { ds.colors = { ...defDs.colors }; changed = true; }
          
          // Ensure nested color fields exist (handling partial color objects)
          if (ds.colors) {
            Object.keys(defDs.colors).forEach((colorKey) => {
              if (!(ds.colors as any)[colorKey]) {
                (ds.colors as any)[colorKey] = (defDs.colors as any)[colorKey];
                changed = true;
              }
            });
          }
        }
      }
      
      // Auto-migrate any old links to avoid any left-over reference
      if (db.links && Array.isArray(db.links)) {
        db.links.forEach((link: any) => {
          if (link.url && (link.url.includes("zendha") || link.url.includes("zendharefitra"))) {
            link.url = link.url.replace(/zendharefitra/g, "yourusername")
                               .replace(/zendharef_/g, "yourusername")
                               .replace(/zendha90/g, "creator");
            changed = true;
          }
          if (link.title && link.title.includes("Zendha")) {
            link.title = link.title.replace(/Zendha Refitra/g, "Creator").replace(/Zendha/g, "Creator");
            changed = true;
          }
        });
      }

      // Auto-migrate termsOfService references if any
      if (db.profile && db.profile.termsOfService && Array.isArray(db.profile.termsOfService)) {
        db.profile.termsOfService = db.profile.termsOfService.map((term: string) => {
          if (term.includes("zendharefitra")) {
            changed = true;
            return term.replace(/zendharefitra/g, "creator");
          }
          return term;
        });
      }
      
      // Auto-populate realistic click logs if missing or empty
      if (!db.clickLogs || db.clickLogs.length === 0) {
        db.clickLogs = [];
        const linksList = db.links || [];
        if (linksList.length > 0) {
          const now = new Date();
          const clickSources = [
            { utmSource: 'instagram', referrer: 'https://l.instagram.com/' },
            { utmSource: 'tiktok', referrer: 'https://tiktok.com/' },
            { utmSource: 'youtube', referrer: 'https://youtube.com/' },
            { utmSource: 'whatsapp', referrer: 'https://wa.me/' },
            { utmSource: '', referrer: 'https://google.com/' },
            { utmSource: '', referrer: '' }
          ];

          // Generate logs for the last 30 days
          for (let i = 30; i >= 0; i--) {
            const date = new Date();
            date.setDate(now.getDate() - i);
            
            // Random number of clicks for this day
            const dailyClicksCount = Math.floor(Math.random() * 12) + 4; // 4 to 15 clicks
            for (let c = 0; c < dailyClicksCount; c++) {
              // Pick a link. Assign weights so some links have more
              let linkIndex = 0;
              const randVal = Math.random();
              if (randVal < 0.35 && linksList.length > 0) linkIndex = 0;
              else if (randVal < 0.60 && linksList.length > 4) linkIndex = 4;
              else if (randVal < 0.75 && linksList.length > 2) linkIndex = 2;
              else if (randVal < 0.90 && linksList.length > 1) linkIndex = 1;
              else linkIndex = Math.floor(Math.random() * linksList.length);
              
              const selectedLink = linksList[linkIndex] || linksList[0];
              if (selectedLink) {
                // Determine hour (with peak at 17:00 - 21:00)
                let hour = Math.floor(Math.random() * 24);
                const peekChance = Math.random();
                if (peekChance < 0.5) {
                  // 50% chance click falls in peak hours 17:00 - 21:00
                  hour = 17 + Math.floor(Math.random() * 4);
                }
                const min = Math.floor(Math.random() * 60);
                const sec = Math.floor(Math.random() * 60);
                const clickTime = new Date(date);
                clickTime.setHours(hour, min, sec, 0);
                
                // Assign traffic source weights
                const srcRand = Math.random();
                let srcObj = clickSources[5]; // Direct
                if (srcRand < 0.40) srcObj = clickSources[0]; // Instagram
                else if (srcRand < 0.65) srcObj = clickSources[1]; // TikTok
                else if (srcRand < 0.75) srcObj = clickSources[2]; // YouTube
                else if (srcRand < 0.85) srcObj = clickSources[3]; // WhatsApp
                else if (srcRand < 0.95) srcObj = clickSources[4]; // Google search

                db.clickLogs.push({
                  id: `click-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                  linkId: selectedLink.id,
                  timestamp: clickTime.toISOString(),
                  referrer: srcObj.referrer || undefined,
                  utmSource: srcObj.utmSource || undefined
                });
              }
            }
          }
          // Recalculate each link's clicks so the numbers match perfectly
          linksList.forEach((l: any) => {
            l.clicks = db.clickLogs.filter((log: any) => log.linkId === l.id).length;
          });
        }
        changed = true;
      }

      // Auto-populate page visit logs if missing or empty
      if (!db.visitLogs || db.visitLogs.length === 0) {
        db.visitLogs = [];
        const now = new Date();
        const visitSources = [
          { utmSource: 'instagram', referrer: 'https://l.instagram.com/' },
          { utmSource: 'tiktok', referrer: 'https://tiktok.com/' },
          { utmSource: 'youtube', referrer: 'https://youtube.com/' },
          { utmSource: 'whatsapp', referrer: 'https://wa.me/' },
          { utmSource: '', referrer: 'https://google.com/' },
          { utmSource: '', referrer: '' }
        ];

        // Seed visit logs for the last 30 days
        for (let i = 30; i >= 0; i--) {
          const date = new Date();
          date.setDate(now.getDate() - i);
          
          // Daily visits (generally higher than clicks, e.g., 10 to 30 visits per day)
          const dailyVisitsCount = Math.floor(Math.random() * 20) + 12; // 12 to 31 visits
          for (let v = 0; v < dailyVisitsCount; v++) {
            const hr = Math.floor(Math.random() * 24);
            const min = Math.floor(Math.random() * 60);
            const sec = Math.floor(Math.random() * 60);
            const visitTime = new Date(date);
            visitTime.setHours(hr, min, sec, 0);

            const srcRand = Math.random();
            let srcObj = visitSources[5]; // Direct
            if (srcRand < 0.45) srcObj = visitSources[0]; // Instagram
            else if (srcRand < 0.70) srcObj = visitSources[1]; // TikTok
            else if (srcRand < 0.80) srcObj = visitSources[2]; // YouTube
            else if (srcRand < 0.88) srcObj = visitSources[3]; // WhatsApp
            else if (srcRand < 0.95) srcObj = visitSources[4]; // Google

            db.visitLogs.push({
              id: `visit-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              timestamp: visitTime.toISOString(),
              utmSource: srcObj.utmSource || undefined,
              referrer: srcObj.referrer || undefined,
              viewType: Math.random() < 0.65 ? 'linktree' : 'ratecard'
            });
          }
        }
        changed = true;
      }

      if (changed) {
        writeDb(db);
      }
      return db;
    }
  } catch (err) {
    console.error("Error reading database file, using fallback:", err);
  }
  
  // Seed database
  writeDb(DEFAULT_DB);
  return DEFAULT_DB;
}

function writeDb(data: DatabaseSchema): boolean {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error("CRITICAL ERROR: Gagal menulis ke database file (db.json). Periksa izin akses file di server!", err);
    return false;
  }
}

// Setup background server body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Ensure uploads directory exists inside DATA_DIR
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve uploads static folder
app.use('/uploads', express.static(UPLOADS_DIR));

// API Auth Middleware
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'admin123';
const SESSION_TOKEN = `token-${Buffer.from(ADMIN_PASS).toString('base64')}`;

function isAdmin(req: express.Request): boolean {
  const authHeader = req.headers.authorization;
  if (!authHeader) return false;
  const token = authHeader.replace(/^Bearer\s+/, '');
  return token === SESSION_TOKEN;
}

// ---------------- API ENDPOINTS ----------------

// Get All Public Data
app.get('/api/data', (req, res) => {
  const db = readDb();
  // Ensure no caching for live data
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.json(db);
});

// Admin Login
app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASS) {
    res.json({ success: true, token: SESSION_TOKEN });
  } else {
    res.status(401).json({ success: false, message: 'Password salah!' });
  }
});

// Admin Auth Status Check
app.get('/api/auth/profile', (req, res) => {
  if (isAdmin(req)) {
    res.json({ success: true, isAdmin: true });
  } else {
    res.status(401).json({ success: false, isAdmin: false });
  }
});

// Image Upload Endpoint (handles Base64 input)
app.post('/api/upload', async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ success: false, message: 'Unauthorized' });
  
  const { fileName, base64Data } = req.body;
  if (!fileName || !base64Data) {
    return res.status(400).json({ success: false, message: 'Nama file dan draf data base64 wajib diisi' });
  }
  
  try {
    // Sanitize base64 string
    const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Image, 'base64');
    
    // Generate clean unique file name
    const ext = path.extname(fileName) || '.jpg';
    const cleanFileName = `img-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
    
    const db = readDb();
    
    // Local server save
    const filePath = path.join(UPLOADS_DIR, cleanFileName);
    fs.writeFileSync(filePath, buffer);
      
    const url = `/uploads/${cleanFileName}`;
    res.json({ success: true, url });
  } catch (err: any) {
    console.error("Error writing upload file:", err);
    res.status(500).json({ success: false, message: 'Gagal mengupload file: ' + err.message });
  }
});

// Export Database Backup (Admin only)
app.get('/api/backup/export', (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ success: false, message: 'Unauthorized' });
  
  try {
    const db = readDb();
    res.json({ success: true, database: db });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Gagal mengekspor database: ' + err.message });
  }
});

// Import Database Backup (Admin only)
app.post('/api/backup/import', (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ success: false, message: 'Unauthorized' });
  
  const { database } = req.body;
  if (!database || typeof database !== 'object') {
    return res.status(400).json({ success: false, message: 'Format data backup tidak valid.' });
  }
  
  // Basic validation checks
  if (!database.profile || !database.links || !database.services || !database.projects) {
    return res.status(400).json({ success: false, message: 'File backup wajib memiliki format data lengkap (profile, links, services, projects).' });
  }

  try {
    const currentDb = readDb();
    
    // Safely merge GitHub settings to prevent loss of active token or complete settings
    if (database.githubSettings) {
      if (currentDb.githubSettings) {
        const importedConfig = database.githubSettings;
        const currentConfig = currentDb.githubSettings;
        // Merge token if imported is redacted, missing, or masked
        if (!importedConfig.token || 
            importedConfig.token.includes('...') || 
            importedConfig.token === '********' || 
            importedConfig.token === 'REDACTED_FOR_SECURITY') {
          importedConfig.token = currentConfig.token || '';
        }
      }
    } else if (currentDb.githubSettings) {
      // If the backup JSON does not contain githubSettings at all, preserve current live ones
      database.githubSettings = currentDb.githubSettings;
    }

    writeDb(database);
    res.json({ success: true, message: 'Database template berhasil dipulihkan secara penuh!' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Gagal memulihkan database: ' + err.message });
  }
});

// GET GitHub Settings (admin only, hides token)
app.get('/api/github/settings', (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ success: false, message: 'Unauthorized' });
  
  const db = readDb();
  const settings = db.githubSettings || { enabled: false, token: '', owner: '', repo: '', branch: 'main', path: 'uploads' };
  
  // Mask token for safety
  const maskedToken = settings.token 
    ? (settings.token.length > 8 ? `${settings.token.substring(0, 4)}...${settings.token.substring(settings.token.length - 4)}` : '********')
    : '';
    
  res.json({
    success: true,
    settings: {
      ...settings,
      token: maskedToken
    }
  });
});

// POST Save GitHub Settings (admin only)
app.post('/api/github/settings', (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ success: false, message: 'Unauthorized' });
  
  const { enabled, token, owner, repo, branch, path: folderPath } = req.body;
  const db = readDb();
  
  const currentSettings = db.githubSettings || { enabled: false, token: '', owner: '', repo: '', branch: 'main', path: 'uploads' };
  
  let finalToken = token;
  // If user preserves the masked representation, keep original from DB
  if (token && (token.includes('...') || token === '********')) {
    finalToken = currentSettings.token;
  }
  
  db.githubSettings = {
    enabled: !!enabled,
    token: finalToken || '',
    owner: owner || '',
    repo: repo || '',
    branch: branch || 'main',
    path: folderPath || 'uploads'
  };
  
  writeDb(db);
  res.json({ success: true, message: 'Pengaturan GitHub Storage berhasil disimpan!' });
});

// POST Export All Database & Uploaded Images to GitHub
app.post('/api/github/export-all', async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ success: false, message: 'Unauthorized' });

  const db = readDb();
  const settings = db.githubSettings;

  if (!settings || !settings.token || !settings.owner || !settings.repo) {
    return res.status(400).json({ success: false, message: 'Fitur GitHub belum dikonfigurasi secara lengkap. Harap lengkapi dan simpan pengaturan terlebih dahulu.' });
  }

  const cleanPath = settings.path ? settings.path.replace(/^\/+|\/+$/g, '') : 'uploads';
  const githubBaseUrl = `https://raw.githubusercontent.com/${settings.owner}/${settings.repo}/${settings.branch || 'main'}`;

  // Helper to safely upload file to GitHub with overwrite support
  async function uploadToGitHub(filePath: string, base64Content: string, message: string) {
    const url = `https://api.github.com/repos/${settings.owner}/${settings.repo}/contents/${filePath}`;
    const headers = {
      'Authorization': `token ${settings.token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'User-Agent': 'Node-Portfolio-App'
    };

    // Attempt to check if file already exists to retrieve its SHA
    let sha: string | undefined;
    try {
      const getRes = await fetch(`${url}?ref=${settings.branch || 'main'}`, { headers });
      if (getRes.ok) {
        const fileData = await getRes.json() as any;
        sha = fileData.sha;
      }
    } catch (e) {
      // Doesn't exist or transient error, proceed
    }

    const bodyData: any = {
      message,
      content: base64Content,
      branch: settings.branch || 'main'
    };
    if (sha) {
      bodyData.sha = sha;
    }

    const putRes = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(bodyData)
    });

    if (!putRes.ok) {
      const errText = await putRes.text();
      throw new Error(`Gagal mengunggah ${filePath} ke GitHub: ${putRes.status} - ${errText}`);
    }
  }

  try {
    let imagesExported = 0;
    const errors: string[] = [];

    // 1. Scan and upload all local physical files from UPLOADS_DIR
    if (fs.existsSync(UPLOADS_DIR)) {
      const localFiles = fs.readdirSync(UPLOADS_DIR);
      for (const filename of localFiles) {
        // Skip hidden files
        if (filename.startsWith('.')) continue;

        const filePath = path.join(UPLOADS_DIR, filename);
        if (fs.statSync(filePath).isFile()) {
          try {
            const fileBuffer = fs.readFileSync(filePath);
            const base64 = fileBuffer.toString('base64');
            const githubFilePath = cleanPath ? `${cleanPath}/${filename}` : filename;

            await uploadToGitHub(githubFilePath, base64, `Export local uploaded asset ${filename} to GitHub storage repository`);
            imagesExported++;
          } catch (fileErr: any) {
            errors.push(`Gagal mengekspor file ${filename}: ${fileErr.message}`);
          }
        }
      }
    }

    // 2. Rewrite any local /uploads/... URLs in database to permanent raw.githubusercontent.com URLs
    function replaceLocalUrl(url: string | undefined): string | undefined {
      if (!url) return url;
      // Handle both /uploads/... and full paths containing uploads
      if (url.startsWith('/uploads/')) {
        const filename = url.replace('/uploads/', '');
        const relativePath = cleanPath ? `${cleanPath}/${filename}` : filename;
        return `${githubBaseUrl}/${relativePath}`;
      }
      return url;
    }

    let modifiedCount = 0;
    if (db.profile && db.profile.avatarUrl && db.profile.avatarUrl.startsWith('/uploads/')) {
      const original = db.profile.avatarUrl;
      db.profile.avatarUrl = replaceLocalUrl(db.profile.avatarUrl) || db.profile.avatarUrl;
      if (original !== db.profile.avatarUrl) modifiedCount++;
    }

    if (db.links) {
      db.links.forEach((l: any) => {
        if (l.imageUrl && l.imageUrl.startsWith('/uploads/')) {
          const original = l.imageUrl;
          l.imageUrl = replaceLocalUrl(l.imageUrl);
          if (original !== l.imageUrl) modifiedCount++;
        }
      });
    }

    if (db.projects) {
      db.projects.forEach((p: any) => {
        if (p.imageUrl && p.imageUrl.startsWith('/uploads/')) {
          const original = p.imageUrl;
          p.imageUrl = replaceLocalUrl(p.imageUrl);
          if (original !== p.imageUrl) modifiedCount++;
        }
      });
    }

    if (db.brands) {
      db.brands.forEach((b: any) => {
        if (b.logoUrl && b.logoUrl.startsWith('/uploads/')) {
          const original = b.logoUrl;
          b.logoUrl = replaceLocalUrl(b.logoUrl);
          if (original !== b.logoUrl) modifiedCount++;
        }
      });
    }

    // 3. Save modified DB locally
    writeDb(db);

    // Calculate how many assets are already pointing to GitHub CDN (independent of this export)
    let hostedOnGithubCount = 0;
    const checkAlreadyGithubUrl = (url: string | undefined) => {
      if (url && url.startsWith(githubBaseUrl)) {
        hostedOnGithubCount++;
      }
    };
    if (db.profile && db.profile.avatarUrl) checkAlreadyGithubUrl(db.profile.avatarUrl);
    if (db.links) db.links.forEach((l: any) => checkAlreadyGithubUrl(l.imageUrl));
    if (db.projects) db.projects.forEach((p: any) => checkAlreadyGithubUrl(p.imageUrl));
    if (db.brands) db.brands.forEach((b: any) => checkAlreadyGithubUrl(b.logoUrl));

    // 4. Export db.json state itself to GitHub as db_backup.json
    // Make a clone to redact the sensitive raw GitHub token, avoiding GITHUB SECRET DETECTION blocks
    const dbCopy = JSON.parse(JSON.stringify(db));
    if (dbCopy.githubSettings) {
      dbCopy.githubSettings.token = "REDACTED_FOR_SECURITY";
    }
    const dbString = JSON.stringify(dbCopy, null, 2);
    const dbBase64 = Buffer.from(dbString, 'utf8').toString('base64');
    const dbBackupFileName = 'db_backup.json';
    const dbBackupPath = cleanPath ? `${cleanPath}/${dbBackupFileName}` : dbBackupFileName;

    await uploadToGitHub(dbBackupPath, dbBase64, `Full database auto backup containing updated permanent cloud asset references`);

    res.json({
      success: true,
      message: `Ekspor berhasil diselesaikan!`,
      details: {
        imagesExported,
        referencesUpdated: modifiedCount,
        hostedOnGithubCount,
        dbBackupPath,
        errors: errors.length > 0 ? errors : undefined
      }
    });

  } catch (err: any) {
    console.error("Gagal melakukan ekspor sinkronisasi ke GitHub:", err);
    res.status(500).json({ success: false, message: 'Gagal melakukan ekspor lengkap ke GitHub: ' + err.message });
  }
});

// POST Import All Database Backup & Re-cache Referenced Images from GitHub
app.post('/api/github/import-all', async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ success: false, message: 'Unauthorized' });

  const db = readDb();
  const settings = db.githubSettings;

  if (!settings || !settings.token || !settings.owner || !settings.repo) {
    return res.status(400).json({ success: false, message: 'Fitur GitHub belum dikonfigurasi secara lengkap. Harap lengkapi dan simpan pengaturan terlebih dahulu.' });
  }

  const cleanPath = settings.path ? settings.path.replace(/^\/+|\/+$/g, '') : 'uploads';
  const dbBackupFileName = 'db_backup.json';
  const dbBackupPath = cleanPath ? `${cleanPath}/${dbBackupFileName}` : dbBackupFileName;
  const url = `https://api.github.com/repos/${settings.owner}/${settings.repo}/contents/${dbBackupPath}?ref=${settings.branch || 'main'}`;

  try {
    const headers = {
      'Authorization': `token ${settings.token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Node-Portfolio-App'
    };

    // 1. Fetch db_backup.json from GitHub
    const getRes = await fetch(url, { headers });
    if (!getRes.ok) {
      return res.status(404).json({
        success: false,
        message: `File cadangan '${dbBackupPath}' tidak ditemukan di repository GitHub Anda. Pastikan Anda telah melakukan ekspor atau membuat cadangan terlebih dahulu.`
      });
    }

    const fileData = await getRes.json() as any;
    if (!fileData.content) {
      throw new Error('Konten database kosong dari respons API GitHub.');
    }

    // Decode GitHub Base64 content
    const cleanedBase64 = fileData.content.replace(/\s/g, '');
    const decodedDbString = Buffer.from(cleanedBase64, 'base64').toString('utf8');
    const importedDb = JSON.parse(decodedDbString) as DatabaseSchema;

    // Validate imported schema slightly
    if (!importedDb.profile || !importedDb.links || !importedDb.services || !importedDb.projects) {
      return res.status(400).json({
        success: false,
        message: 'File database cadangan di GitHub tidak valid (kehilangan data profile, links, atau services).'
      });
    }

    // Maintain current encryption token if settings was masked in backup
    if (db.githubSettings && importedDb.githubSettings) {
      if (!importedDb.githubSettings.token || 
          importedDb.githubSettings.token.includes('...') || 
          importedDb.githubSettings.token === 'REDACTED_FOR_SECURITY') {
        importedDb.githubSettings.token = db.githubSettings.token;
      }
    }

    // 2. Download any referenced github images back to local uploads/ directory as cached fallback copies
    let imagesDownloaded = 0;
    const githubBaseUrlPrefix = `https://raw.githubusercontent.com/${settings.owner}/${settings.repo}/${settings.branch || 'main'}/`;

    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }

    async function downloadImage(imgUrl: string | undefined) {
      if (!imgUrl || !imgUrl.startsWith(githubBaseUrlPrefix)) return;

      const relativeFilePath = imgUrl.substring(githubBaseUrlPrefix.length);
      const filename = path.basename(relativeFilePath);
      const localFilePath = path.join(UPLOADS_DIR, filename);

      // Skip if already in place
      if (fs.existsSync(localFilePath)) return;

      try {
        const fileContentUrl = `https://api.github.com/repos/${settings.owner}/${settings.repo}/contents/${relativeFilePath}?ref=${settings.branch || 'main'}`;
        const imgRes = await fetch(fileContentUrl, { headers });
        if (imgRes.ok) {
          const imgData = await imgRes.json() as any;
          if (imgData.content) {
            const buffer = Buffer.from(imgData.content.replace(/\s/g, ''), 'base64');
            fs.writeFileSync(localFilePath, buffer);
            imagesDownloaded++;
          }
        }
      } catch (e) {
        console.warn(`Gagal meregenerasi berkas gambar lokal fallback untuk ${filename}:`, e);
      }
    }

    // Run downloading for fallback
    if (importedDb.profile?.avatarUrl) await downloadImage(importedDb.profile.avatarUrl);
    
    if (importedDb.links) {
      for (const l of importedDb.links) {
        if (l.imageUrl) await downloadImage(l.imageUrl);
      }
    }

    if (importedDb.projects) {
      for (const p of importedDb.projects) {
        if (p.imageUrl) await downloadImage(p.imageUrl);
      }
    }

    if (importedDb.brands) {
      for (const b of importedDb.brands) {
        if (b.logoUrl) await downloadImage(b.logoUrl);
      }
    }

    // Save the imported database state as the new local database!
    writeDb(importedDb);

    res.json({
      success: true,
      message: 'Pemulihan data penuh dari GitHub berhasil diselesaikan!',
      details: {
        linksCount: importedDb.links?.length || 0,
        projectsCount: importedDb.projects?.length || 0,
        brandsCount: importedDb.brands?.length || 0,
        imagesRecached: imagesDownloaded
      }
    });

  } catch (err: any) {
    console.error("Gagal memulihkan database dari GitHub:", err);
    res.status(500).json({ success: false, message: 'Gagal memulihkan database dari GitHub: ' + err.message });
  }
});

// GET Export All Database & Uploaded Images from GitHub as a PC-Downloadable ZIP Package
app.get('/api/github/export-pc-zip', async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ success: false, message: 'Unauthorized' });

  try {
    const db = readDb();
    const settings = db.githubSettings;

    const zip = new AdmZip();

    // 1. Prepare db.json content with redacted token
    const dbCopy = JSON.parse(JSON.stringify(db));
    if (dbCopy.githubSettings) {
      dbCopy.githubSettings.token = "REDACTED_FOR_SECURITY";
    }
    const dbString = JSON.stringify(dbCopy, null, 2);
    zip.addFile('db.json', Buffer.from(dbString, 'utf8'));

    // 2. Fetch images directly from GitHub uploads folder if configured
    let imagesAdded = 0;
    const githubBaseUrl = settings && settings.owner && settings.repo 
      ? `https://raw.githubusercontent.com/${settings.owner}/${settings.repo}/${settings.branch || 'main'}`
      : null;

    if (settings && settings.token && settings.owner && settings.repo) {
      const cleanPath = settings.path ? settings.path.replace(/^\/+|\/+$/g, '') : 'uploads';
      const listUrl = `https://api.github.com/repos/${settings.owner}/${settings.repo}/contents/${cleanPath}?ref=${settings.branch || 'main'}`;
      
      const headers = {
        'Authorization': `token ${settings.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Node-Portfolio-App'
      };

      try {
        const listRes = await fetch(listUrl, { headers });
        if (listRes.ok) {
          const files = await listRes.json() as any[];
          if (Array.isArray(files)) {
            for (const file of files) {
              if (file.type === 'file' && !file.name.startsWith('.')) {
                // Skip the db_backup itself as we pack the real db.json separately
                if (file.name === 'db_backup.json') continue;

                try {
                  const imgRes = await fetch(file.download_url || file.url, { headers });
                  if (imgRes.ok) {
                    const buffer = Buffer.from(await imgRes.arrayBuffer());
                    // Put inside uploads folder
                    zip.addFile(`uploads/${file.name}`, buffer);
                    imagesAdded++;
                  }
                } catch (e) {
                  console.warn(`Gagal mengunduh berkas ${file.name} untuk ekspor ZIP:`, e);
                }
              }
            }
          }
        }
      } catch (err) {
        console.warn("Gagal terhubung ke isi folder GitHub:", err);
      }
    }

    // 3. Fallback/supplement: if images from GitHub were 0 or we failed, scan local UPLOADS_DIR
    if (imagesAdded === 0 && fs.existsSync(UPLOADS_DIR)) {
      const localFiles = fs.readdirSync(UPLOADS_DIR);
      for (const filename of localFiles) {
        if (filename.startsWith('.')) continue;
        const filePath = path.join(UPLOADS_DIR, filename);
        if (fs.statSync(filePath).isFile()) {
          try {
            const fileBuffer = fs.readFileSync(filePath);
            zip.addFile(`uploads/${filename}`, fileBuffer);
            imagesAdded++;
          } catch (e) {
            console.warn(`Gagal memasukkan file lokal ${filename} ke ZIP:`, e);
          }
        }
      }
    }

    // 4. Return ZIP file for download
    const zipBuffer = zip.toBuffer();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `creator_portfolio_backup_${timestamp}.zip`;

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', zipBuffer.length);
    res.send(zipBuffer);

  } catch (err: any) {
    console.error("Gagal melakukan ekspor ZIP ke PC:", err);
    res.status(500).json({ success: false, message: 'Gagal mengekspor berkas ZIP: ' + err.message });
  }
});

// POST Import All Database & Uploaded Images from a ZIP Package Uploaded from PC
app.post('/api/github/import-pc-zip', express.raw({ type: 'application/zip', limit: '50mb' }), async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ success: false, message: 'Unauthorized' });

  const zipBuffer = req.body;
  if (!zipBuffer || zipBuffer.length === 0) {
    return res.status(400).json({ success: false, message: 'File ZIP kosong atau rusak.' });
  }

  try {
    const db = readDb();
    const settings = db.githubSettings;

    // Load zip file from binary raw payload
    const zip = new AdmZip(zipBuffer);
    const zipEntries = zip.getEntries();

    // 1. Locate and parse db.json
    const dbEntry = zipEntries.find(e => e.entryName === 'db.json');
    if (!dbEntry) {
      return res.status(400).json({ success: false, message: 'Berkas ZIP tidak valid. File db.json wajib berada di root file ZIP.' });
    }

    const dbContentStr = dbEntry.getData().toString('utf8');
    const importedDb = JSON.parse(dbContentStr) as DatabaseSchema;

    if (!importedDb.profile || !importedDb.links || !importedDb.services || !importedDb.projects) {
      return res.status(400).json({ success: false, message: 'File db.json di dalam ZIP tidak valid (kehilangan tabel data utama).' });
    }

    // Maintain current encryption token if settings was masked in backup
    if (db.githubSettings && importedDb.githubSettings) {
      if (!importedDb.githubSettings.token || 
          importedDb.githubSettings.token === 'REDACTED_FOR_SECURITY' || 
          importedDb.githubSettings.token.includes('...')) {
        importedDb.githubSettings.token = db.githubSettings.token;
      }
    }

    // Ensure uploads directory exists locally
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }

    // Helper to upload newly unpacked files to GitHub right away if available
    async function uploadToGitHub(filePath: string, fileBuffer: Buffer, message: string) {
      if (!settings || !settings.token || !settings.owner || !settings.repo) return;
      
      const cleanPath = settings.path ? settings.path.replace(/^\/+|\/+$/g, '') : 'uploads';
      const filename = path.basename(filePath);
      const githubFilePath = cleanPath ? `${cleanPath}/${filename}` : filename;
      const url = `https://api.github.com/repos/${settings.owner}/${settings.repo}/contents/${githubFilePath}`;
      const headers = {
        'Authorization': `token ${settings.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'Node-Portfolio-App'
      };

      let sha: string | undefined;
      try {
        const getRes = await fetch(`${url}?ref=${settings.branch || 'main'}`, { headers });
        if (getRes.ok) {
          const fileData = await getRes.json() as any;
          sha = fileData.sha;
        }
      } catch (e) {}

      const bodyData: any = {
        message,
        content: fileBuffer.toString('base64'),
        branch: settings.branch || 'main'
      };
      if (sha) bodyData.sha = sha;

      await fetch(url, {
        method: 'PUT',
        headers,
        body: JSON.stringify(bodyData)
      });
    }

    // 2. Extract and restore image files
    let imagesRestored = 0;
    for (const entry of zipEntries) {
      // Check if entry belongs inside uploads folder
      if (entry.entryName.startsWith('uploads/') && !entry.isDirectory) {
        const filename = path.basename(entry.entryName);
        if (filename && !filename.startsWith('.')) {
          const fileBuffer = entry.getData();
          const localPath = path.join(UPLOADS_DIR, filename);

          // Write local file
          fs.writeFileSync(localPath, fileBuffer);
          imagesRestored++;

          // Push to GitHub in parallel to guarantee synchronization
          try {
            await uploadToGitHub(entry.entryName, fileBuffer, `Restore upload asset ${filename} from PC backup package`);
          } catch (gitErr) {
            console.warn(`Gagal mengunggah ${filename} ke GitHub pasca restore:`, gitErr);
          }
        }
      }
    }

    // 3. Save imported database
    writeDb(importedDb);

    res.json({
      success: true,
      message: 'Pemulihan data lengkap dari berkas ZIP PC berhasil!',
      details: {
        linksCount: importedDb.links?.length || 0,
        projectsCount: importedDb.projects?.length || 0,
        brandsCount: importedDb.brands?.length || 0,
        imagesRestored
      }
    });

  } catch (err: any) {
    console.error("Gagal memulihkan database dari berkas ZIP:", err);
    res.status(500).json({ success: false, message: 'Gagal memulihkan data dari berkas ZIP: ' + err.message });
  }
});

// Log Page Visits (Public)
app.post('/api/visits', (req, res) => {
  const { referrer, utmSource, utmMedium, utmCampaign, viewType } = req.body;
  const db = readDb();
  
  if (!db.visitLogs) {
    db.visitLogs = [];
  }
  
  const newVisit = {
    id: `visit-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    timestamp: new Date().toISOString(),
    referrer: referrer || undefined,
    utmSource: utmSource || undefined,
    utmMedium: utmMedium || undefined,
    utmCampaign: utmCampaign || undefined,
    viewType: viewType || 'linktree'
  };
  
  db.visitLogs.push(newVisit);
  writeDb(db);
  
  res.json({ success: true });
});

// Increment Link Clicks (Public)
app.post('/api/links/:id/click', (req, res) => {
  const { id } = req.params;
  const { referrer, utmSource, utmMedium, utmCampaign } = req.body;
  
  const db = readDb();
  const link = db.links.find(l => l.id === id);
  if (link) {
    link.clicks = (link.clicks || 0) + 1;
    
    if (!db.clickLogs) {
      db.clickLogs = [];
    }
    
    db.clickLogs.push({
      id: `click-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      linkId: id,
      timestamp: new Date().toISOString(),
      referrer: referrer || req.query.referrer || undefined,
      utmSource: utmSource || req.query.utmSource || undefined,
      utmMedium: utmMedium || req.query.utmMedium || undefined,
      utmCampaign: utmCampaign || req.query.utmCampaign || undefined
    });
    
    writeDb(db);
    res.json({ success: true, clicks: link.clicks });
  } else {
    res.status(404).json({ success: false, message: 'Link tidak ditemukan' });
  }
});

// ---- Protected Admin API Endpoints ----

// Add New Link
app.post('/api/links', (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ success: false, message: 'Unauthorized' });
  
  const { title, url, category, description, buttonLabel, imageUrl, isActive, priority } = req.body;
  if (!title || !url) {
    return res.status(400).json({ success: false, message: 'Title dan URL wajib diisi' });
  }
  
  const db = readDb();
  const newLink: AffiliateLink = {
    id: `link-${Date.now()}`,
    title,
    url,
    category: category || 'General',
    description: description || '',
    buttonLabel: buttonLabel || '',
    imageUrl: imageUrl || '',
    clicks: 0,
    isActive: isActive !== false,
    priority: Number(priority) || (db.links.length + 1)
  };
  
  db.links.push(newLink);
  // Sort by priority initially
  db.links.sort((a, b) => a.priority - b.priority);
  writeDb(db);
  
  res.status(201).json({ success: true, link: newLink });
});

// Update Link
app.put('/api/links/:id', (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ success: false, message: 'Unauthorized' });
  
  const { id } = req.params;
  const { title, url, category, description, buttonLabel, imageUrl, isActive, priority } = req.body;
  
  const db = readDb();
  const index = db.links.findIndex(l => l.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Link tidak ditemukan' });
  }
  
  db.links[index] = {
    ...db.links[index],
    title: title !== undefined ? title : db.links[index].title,
    url: url !== undefined ? url : db.links[index].url,
    category: category !== undefined ? category : db.links[index].category,
    description: description !== undefined ? description : db.links[index].description,
    buttonLabel: buttonLabel !== undefined ? buttonLabel : db.links[index].buttonLabel,
    imageUrl: imageUrl !== undefined ? imageUrl : db.links[index].imageUrl,
    isActive: isActive !== undefined ? isActive : db.links[index].isActive,
    priority: priority !== undefined ? Number(priority) : db.links[index].priority
  };
  
  // Resort with priorities
  db.links.sort((a, b) => a.priority - b.priority);
  writeDb(db);
  
  const updatedLink = db.links.find(l => l.id === id);
  res.json({ success: true, link: updatedLink });
});

// Delete Link
app.delete('/api/links/:id', (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ success: false, message: 'Unauthorized' });
  
  const { id } = req.params;
  const db = readDb();
  const initialLength = db.links.length;
  db.links = db.links.filter(l => l.id !== id);
  
  if (db.links.length === initialLength) {
    return res.status(404).json({ success: false, message: 'Link tidak ditemukan' });
  }
  
  writeDb(db);
  res.json({ success: true, message: 'Link berhasil dihapus' });
});

// Update Ratecard Profile Info
app.put('/api/ratecard/profile', (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ success: false, message: 'Unauthorized' });
  
  const { 
    name, bio, instagram, tiktok, youtube, email, avatarUrl, whatsapp,
    heroTagline, heroTitle1, heroTitleHighlight, heroDescription, domicile, contactPhone,
    stats, termsOfService, studioDirectorTitle, studioEstdYear, designSettings,
    statsBadge, statsTitle, statsDescription,
    projectsBadge, projectsTitle, projectsDescription,
    pricingBadge, pricingTitle, pricingDescription,
    brandsBadge, brandsTitle,
    termsBadge, termsTitle, termsDescription,
    contactBadge, contactTitle, contactTitleHighlight, contactDescription,
    linktreeTitle, ratecardTitle, faviconUrl
  } = req.body;
  const db = readDb();
  
  db.profile = {
    name: name || db.profile.name,
    bio: bio || db.profile.bio,
    instagram: instagram !== undefined ? instagram : db.profile.instagram,
    tiktok: tiktok !== undefined ? tiktok : db.profile.tiktok,
    youtube: youtube !== undefined ? youtube : db.profile.youtube,
    email: email !== undefined ? email : db.profile.email,
    avatarUrl: avatarUrl !== undefined ? avatarUrl : db.profile.avatarUrl,
    whatsapp: whatsapp !== undefined ? whatsapp : db.profile.whatsapp,
    heroTagline: heroTagline !== undefined ? heroTagline : db.profile.heroTagline,
    heroTitle1: heroTitle1 !== undefined ? heroTitle1 : db.profile.heroTitle1,
    heroTitleHighlight: heroTitleHighlight !== undefined ? heroTitleHighlight : db.profile.heroTitleHighlight,
    heroDescription: heroDescription !== undefined ? heroDescription : db.profile.heroDescription,
    domicile: domicile !== undefined ? domicile : db.profile.domicile,
    contactPhone: contactPhone !== undefined ? contactPhone : db.profile.contactPhone,
    stats: stats !== undefined ? stats : db.profile.stats,
    termsOfService: termsOfService !== undefined ? termsOfService : db.profile.termsOfService,
    studioDirectorTitle: studioDirectorTitle !== undefined ? studioDirectorTitle : db.profile.studioDirectorTitle,
    studioEstdYear: studioEstdYear !== undefined ? studioEstdYear : db.profile.studioEstdYear,
    linktreeTitle: linktreeTitle !== undefined ? linktreeTitle : db.profile.linktreeTitle,
    ratecardTitle: ratecardTitle !== undefined ? ratecardTitle : db.profile.ratecardTitle,
    faviconUrl: faviconUrl !== undefined ? faviconUrl : db.profile.faviconUrl,
    designSettings: designSettings !== undefined ? designSettings : db.profile.designSettings,
    statsBadge: statsBadge !== undefined ? statsBadge : db.profile.statsBadge,
    statsTitle: statsTitle !== undefined ? statsTitle : db.profile.statsTitle,
    statsDescription: statsDescription !== undefined ? statsDescription : db.profile.statsDescription,
    projectsBadge: projectsBadge !== undefined ? projectsBadge : db.profile.projectsBadge,
    projectsTitle: projectsTitle !== undefined ? projectsTitle : db.profile.projectsTitle,
    projectsDescription: projectsDescription !== undefined ? projectsDescription : db.profile.projectsDescription,
    pricingBadge: pricingBadge !== undefined ? pricingBadge : db.profile.pricingBadge,
    pricingTitle: pricingTitle !== undefined ? pricingTitle : db.profile.pricingTitle,
    pricingDescription: pricingDescription !== undefined ? pricingDescription : db.profile.pricingDescription,
    brandsBadge: brandsBadge !== undefined ? brandsBadge : db.profile.brandsBadge,
    brandsTitle: brandsTitle !== undefined ? brandsTitle : db.profile.brandsTitle,
    termsBadge: termsBadge !== undefined ? termsBadge : db.profile.termsBadge,
    termsTitle: termsTitle !== undefined ? termsTitle : db.profile.termsTitle,
    termsDescription: termsDescription !== undefined ? termsDescription : db.profile.termsDescription,
    contactBadge: contactBadge !== undefined ? contactBadge : db.profile.contactBadge,
    contactTitle: contactTitle !== undefined ? contactTitle : db.profile.contactTitle,
    contactTitleHighlight: contactTitleHighlight !== undefined ? contactTitleHighlight : db.profile.contactTitleHighlight,
    contactDescription: contactDescription !== undefined ? contactDescription : db.profile.contactDescription
  };
  
  writeDb(db);
  res.json({ success: true, profile: db.profile });
});

// Add New Ratecard Service
app.post('/api/ratecard/services', (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ success: false, message: 'Unauthorized' });
  
  const { title, price, description, icon, category, isActive, priority, additionalFees } = req.body;
  if (!title || !price) {
    return res.status(400).json({ success: false, message: 'Title dan Price wajib diisi' });
  }
  
  const db = readDb();
  const newService: RatecardService = {
    id: `service-${Date.now()}`,
    title,
    price,
    description: description || '',
    icon: icon || 'Briefcase',
    category: category || 'OFFICIAL PLACEMENT',
    isActive: isActive !== false,
    priority: Number(priority) || (db.services.length + 1),
    additionalFees: additionalFees || []
  };
  
  db.services.push(newService);
  db.services.sort((a, b) => a.priority - b.priority);
  writeDb(db);
  
  res.status(201).json({ success: true, service: newService });
});

// Update Ratecard Service
app.put('/api/ratecard/services/:id', (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ success: false, message: 'Unauthorized' });
  
  const { id } = req.params;
  const { title, price, description, icon, category, isActive, priority, additionalFees } = req.body;
  
  const db = readDb();
  const index = db.services.findIndex(s => s.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Service tidak ditemukan' });
  }
  
  db.services[index] = {
    ...db.services[index],
    title: title !== undefined ? title : db.services[index].title,
    price: price !== undefined ? price : db.services[index].price,
    description: description !== undefined ? description : db.services[index].description,
    icon: icon !== undefined ? icon : db.services[index].icon,
    category: category !== undefined ? category : db.services[index].category,
    isActive: isActive !== undefined ? isActive : db.services[index].isActive,
    priority: priority !== undefined ? Number(priority) : db.services[index].priority,
    additionalFees: additionalFees !== undefined ? additionalFees : db.services[index].additionalFees
  };
  
  db.services.sort((a, b) => a.priority - b.priority);
  writeDb(db);
  
  res.json({ success: true, service: db.services[index] });
});

// Delete Ratecard Service
app.delete('/api/ratecard/services/:id', (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ success: false, message: 'Unauthorized' });
  
  const { id } = req.params;
  const db = readDb();
  const initialLength = db.services.length;
  db.services = db.services.filter(s => s.id !== id);
  
  if (db.services.length === initialLength) {
    return res.status(404).json({ success: false, message: 'Service tidak ditemukan' });
  }
  
  writeDb(db);
  res.json({ success: true, message: 'Service berhasil dihapus' });
});


// Add New Ratecard Project (Viral Videos)
app.post('/api/ratecard/projects', (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ success: false, message: 'Unauthorized' });
  
  const { title, highlight, views, category, url, imageUrl } = req.body;
  if (!title || !views || !url) {
    return res.status(400).json({ success: false, message: 'Title, Views, dan Instagram URL wajib diisi' });
  }
  
  const db = readDb();
  const newProject: RatecardProject = {
    id: `project-${Date.now()}`,
    title,
    highlight: highlight || '',
    views: views || '100K',
    category: category || 'Shorts',
    url,
    imageUrl: imageUrl || ''
  };
  
  db.projects.push(newProject);
  writeDb(db);
  
  res.status(201).json({ success: true, project: newProject });
});

// Update Ratecard Project
app.put('/api/ratecard/projects/:id', (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ success: false, message: 'Unauthorized' });
  
  const { id } = req.params;
  const { title, highlight, views, category, url, imageUrl } = req.body;
  
  const db = readDb();
  const index = db.projects.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Project tidak ditemukan' });
  }
  
  db.projects[index] = {
    ...db.projects[index],
    title: title !== undefined ? title : db.projects[index].title,
    highlight: highlight !== undefined ? highlight : db.projects[index].highlight,
    views: views !== undefined ? views : db.projects[index].views,
    category: category !== undefined ? category : db.projects[index].category,
    url: url !== undefined ? url : db.projects[index].url,
    imageUrl: imageUrl !== undefined ? imageUrl : db.projects[index].imageUrl
  };
  
  writeDb(db);
  res.json({ success: true, project: db.projects[index] });
});

// Delete Ratecard Project
app.delete('/api/ratecard/projects/:id', (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ success: false, message: 'Unauthorized' });
  
  const { id } = req.params;
  const db = readDb();
  const initialLength = db.projects.length;
  db.projects = db.projects.filter(p => p.id !== id);
  
  if (db.projects.length === initialLength) {
    return res.status(404).json({ success: false, message: 'Project tidak ditemukan' });
  }
  
  writeDb(db);
  res.json({ success: true, message: 'Project berhasil dihapus' });
});


// Add New Ratecard Brand
app.post('/api/ratecard/brands', (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ success: false, message: 'Unauthorized' });
  
  const { name, logoUrl, priority, isActive } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, message: 'Nama brand wajib diisi' });
  }
  
  const db = readDb();
  if (!db.brands) db.brands = [];
  
  const newBrand = {
    id: `brand-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name,
    logoUrl: logoUrl || '',
    priority: priority !== undefined ? Number(priority) : db.brands.length + 1,
    isActive: isActive !== undefined ? !!isActive : true
  };
  
  db.brands.push(newBrand);
  writeDb(db);
  
  res.status(201).json({ success: true, brand: newBrand });
});

// Update Ratecard Brand
app.put('/api/ratecard/brands/:id', (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ success: false, message: 'Unauthorized' });
  
  const { id } = req.params;
  const { name, logoUrl, priority, isActive } = req.body;
  
  const db = readDb();
  if (!db.brands) db.brands = [];
  
  const index = db.brands.findIndex(b => b.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Brand tidak ditemukan' });
  }
  
  db.brands[index] = {
    ...db.brands[index],
    name: name !== undefined ? name : db.brands[index].name,
    logoUrl: logoUrl !== undefined ? logoUrl : db.brands[index].logoUrl,
    priority: priority !== undefined ? Number(priority) : db.brands[index].priority,
    isActive: isActive !== undefined ? !!isActive : db.brands[index].isActive
  };
  
  writeDb(db);
  res.json({ success: true, brand: db.brands[index] });
});

// Delete Ratecard Brand
app.delete('/api/ratecard/brands/:id', (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ success: false, message: 'Unauthorized' });
  
  const { id } = req.params;
  const db = readDb();
  if (!db.brands) db.brands = [];
  
  const initialLength = db.brands.length;
  db.brands = db.brands.filter(b => b.id !== id);
  
  if (db.brands.length === initialLength) {
    return res.status(404).json({ success: false, message: 'Brand tidak ditemukan' });
  }
  
  writeDb(db);
  res.json({ success: true, message: 'Brand berhasil dihapus' });
});


// ---------------- ASSET SERVING & INTEGRATION ----------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Vite Dev Mode Middleware setup
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production compiled static assets
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] running on http://127.0.0.1:${PORT} (Production option: ${process.env.NODE_ENV})`);
  });
}

startServer();
