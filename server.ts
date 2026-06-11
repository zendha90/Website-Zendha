import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

// Pathing for local file persistence
const DATA_DIR = path.join(process.cwd(), 'data');
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
  imageUrl?: string;
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
  termsOfService?: string[];
  
  // New Customizable Titles
  studioDirectorTitle?: string;
  studioEstdYear?: string;
}

interface RatecardService {
  id: string;
  title: string;
  price: string;
  description: string;
  icon: string; // Video, Instagram, Youtube, MessageSquare, Briefcase, etc.
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
  githubSettings?: GitHubSettings;
  brands?: RatecardBrand[];
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
      url: "https://tiktok.com/@zendharefitra/shop/laptop-stand",
      category: "TikTok Shop",
      clicks: 65,
      isActive: true,
      priority: 4,
      description: "Ergonomis, mengurangi pegal leher saat kerja lama di depan laptop.",
      imageUrl: "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?auto=format&fit=crop&q=80&w=800&h=400"
    },
    {
      id: "link-5",
      title: "Instagram Zendha Refitra - Tips Workspace & Tech",
      url: "https://instagram.com/zendharef_",
      category: "Social Media",
      clicks: 215,
      isActive: true,
      priority: 5,
      description: "Ikuti konten harian seputar setup minimalis, ulasan gadget, dan tutorial teknologi.",
      imageUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=800&h=400"
    }
  ],
  profile: {
    name: "Zendha Refitra",
    bio: "Tech Content Creator & Workspaces Enthusiast. Membagikan inspirasi setup meja kerja minimalis, ulasan gadget fungsional, dan tips produktivitas digital.",
    instagram: "https://instagram.com/zendharef_",
    tiktok: "https://tiktok.com/@zendharefitra",
    youtube: "https://youtube.com/@zendharefitra",
    email: "zendha90@gmail.com",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=400",
    whatsapp: "https://wa.me/628123456789"
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
  githubSettings: {
    enabled: false,
    token: '',
    owner: '',
    repo: '',
    branch: 'main',
    path: 'uploads'
  },
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
      if (!db.githubSettings) {
        db.githubSettings = {
          enabled: false,
          token: '',
          owner: '',
          repo: '',
          branch: 'main',
          path: 'uploads'
        };
        changed = true;
      }
      if (!db.brands || db.brands.length === 0) {
        db.brands = DEFAULT_DB.brands;
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

function writeDb(data: DatabaseSchema): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error("Error writing database file:", err);
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
    const github = db.githubSettings;

    if (github && github.enabled && github.token && github.owner && github.repo) {
      // Clean path directory
      const cleanPath = github.path ? github.path.replace(/^\/+|\/+$/g, '') : 'uploads';
      const githubFilePath = cleanPath ? `${cleanPath}/${cleanFileName}` : cleanFileName;
      const url = `https://api.github.com/repos/${github.owner}/${github.repo}/contents/${githubFilePath}`;
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${github.token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'Node-Portfolio-App'
        },
        body: JSON.stringify({
          message: `Upload image ${cleanFileName} via admin portfolio`,
          content: base64Image,
          branch: github.branch || 'main'
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`GitHub API error: ${response.status} - ${errText}`);
      }

      // Compute the premium Raw URL
      const publicUrl = `https://raw.githubusercontent.com/${github.owner}/${github.repo}/${github.branch || 'main'}/${githubFilePath}`;
      
      // Save local backup copy as fallback
      try {
        const filePath = path.join(UPLOADS_DIR, cleanFileName);
        fs.writeFileSync(filePath, buffer);
      } catch (e) {
        console.warn("Failed local backup write:", e);
      }

      return res.json({ success: true, url: publicUrl });
    } else {
      // Local server save fallback
      const filePath = path.join(UPLOADS_DIR, cleanFileName);
      fs.writeFileSync(filePath, buffer);
      
      const url = `/uploads/${cleanFileName}`;
      res.json({ success: true, url });
    }
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
    writeDb(database);
    res.json({ success: true, message: 'Database zendharefitra berhasil dipulihkan secara penuh!' });
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

// POST Test GitHub Integration File Commit Connection
app.post('/api/github/test', async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ success: false, message: 'Unauthorized' });
  
  const { token, owner, repo, branch, path: folderPath } = req.body;
  const db = readDb();
  
  const currentSettings = db.githubSettings || { enabled: false, token: '', owner: '', repo: '', branch: 'main', path: 'uploads' };
  
  let finalToken = token;
  if (token && (token.includes('...') || token === '********')) {
    finalToken = currentSettings.token;
  }
  
  if (!finalToken || !owner || !repo) {
    return res.status(400).json({ success: false, message: 'Token, Owner, dan Repo wajib diisi untuk melakukan test!' });
  }
  
  const cleanFolderPath = folderPath ? folderPath.replace(/^\/+|\/+$/g, '') : 'uploads';
  const testFileName = `test-connection-${Date.now()}.txt`;
  const githubPath = cleanFolderPath ? `${cleanFolderPath}/${testFileName}` : testFileName;
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${githubPath}`;
  
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${finalToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'Node-Portfolio-App'
      },
      body: JSON.stringify({
        message: 'Test Connection via portfolio admin panel',
        content: Buffer.from(`Koneksi Sukses! Dibuat otomatis oleh Sistem Portfolio Zendha Refitra pada ${new Date().toISOString()}`).toString('base64'),
        branch: branch || 'main'
      })
    });
    
    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ success: false, message: `Gagal ke GitHub: ${response.status} - ${errText}` });
    }
    
    res.json({ success: true, message: `Koneksi berhasil! File test dibuat di repository pada jalur /${githubPath}` });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Koneksi gagal: ' + err.message });
  }
});

// Increment Link Clicks (Public)
app.post('/api/links/:id/click', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const link = db.links.find(l => l.id === id);
  if (link) {
    link.clicks = (link.clicks || 0) + 1;
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
  
  const { title, url, category, description, imageUrl, isActive, priority } = req.body;
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
  const { title, url, category, description, imageUrl, isActive, priority } = req.body;
  
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
    imageUrl: imageUrl !== undefined ? imageUrl : db.links[index].imageUrl,
    isActive: isActive !== undefined ? isActive : db.links[index].isActive,
    priority: priority !== undefined ? Number(priority) : db.links[index].priority
  };
  
  // Resort with priorities
  db.links.sort((a, b) => a.priority - b.priority);
  writeDb(db);
  
  res.json({ success: true, link: db.links[index] });
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
    stats, termsOfService, studioDirectorTitle, studioEstdYear
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
    studioEstdYear: studioEstdYear !== undefined ? studioEstdYear : db.profile.studioEstdYear
  };
  
  writeDb(db);
  res.json({ success: true, profile: db.profile });
});

// Add New Ratecard Service
app.post('/api/ratecard/services', (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ success: false, message: 'Unauthorized' });
  
  const { title, price, description, icon, isActive, priority, additionalFees } = req.body;
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
  const { title, price, description, icon, isActive, priority, additionalFees } = req.body;
  
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
