import React, { useState, useEffect } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  ArrowLeft, 
  Trash2, 
  Edit3, 
  Plus, 
  Save, 
  Lock, 
  Eye, 
  EyeOff,
  Sliders, 
  ExternalLink,
  PlusCircle, 
  User, 
  Link as LinkIcon, 
  Briefcase,
  LogOut,
  FolderOpen,
  DollarSign,
  TrendingUp,
  Tag,
  Video,
  Instagram,
  Youtube,
  Camera,
  MessageSquare,
  Sparkles,
  RefreshCw,
  Database,
  Download,
  Upload,
  Github,
  Palette,
  History,
  MapPin,
  Award,
  ShieldCheck,
  Share2,
  FileArchive,
  UploadCloud,
  Settings2,
  Target,
  BarChart3,
  LineChart,
  Image,
  Cloud
} from 'lucide-react';
import { AffiliateLink, RatecardProfile, RatecardService, RatecardProject, RatecardBrand, ClickLog } from '../types';
import DesignSettingsForm from './DesignSettingsForm';

interface AdminPanelProps {
  onNavigateBack: () => void;
  onRefreshData: () => Promise<void>;
  links: AffiliateLink[];
  profile: RatecardProfile;
  services: RatecardService[];
  projects: RatecardProject[];
  brands?: RatecardBrand[];
  clickLogs?: ClickLog[];
}

export default function AdminPanel({
  onNavigateBack,
  onRefreshData,
  links,
  profile,
  services,
  projects,
  brands: initialBrands,
  clickLogs = []
}: AdminPanelProps) {
  // Authentication states
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [token, setToken] = useState<string | null>(null);

  // Active Admin Tabs
  const [activeTab, setActiveTab] = useState<'links' | 'profile' | 'services' | 'projects' | 'brands' | 'backup' | 'github' | 'analytics' | 'design' | 'ratecard'>('links');

  // Analytics View States
  const [analyticsTimeRange, setAnalyticsTimeRange] = useState<'today' | 'yesterday' | '7days' | '30days'>('yesterday');
  const [analyticsSource, setAnalyticsSource] = useState<'all' | 'shopee' | 'medsos'>('all');

  // GitHub integration states
  const [githubSettings, setGithubSettings] = useState({
    enabled: false,
    token: '',
    owner: '',
    repo: '',
    branch: 'main',
    path: 'uploads'
  });
  const [isSavingGithub, setIsSavingGithub] = useState(false);
  const [testStatus, setTestStatus] = useState<{ message: string; type: 'success' | 'error' | 'loading' | null }>({ message: '', type: null });
  const [isExportingGithub, setIsExportingGithub] = useState(false);
  const [isImportingGithub, setIsImportingGithub] = useState(false);
  const [isExportingPCZip, setIsExportingPCZip] = useState(false);
  const [isImportingPCZip, setIsImportingPCZip] = useState(false);
  const [githubSyncStatus, setGithubSyncStatus] = useState<{ message: string; type: 'success' | 'error' | 'loading' | null }>({ message: '', type: null });

  // Interactive link editor states
  const [editingLink, setEditingLink] = useState<Partial<AffiliateLink> | null>(null);
  const [isAddingLink, setIsAddingLink] = useState(false);

  // Profile Editor Form State
  const [profileForm, setProfileForm] = useState<RatecardProfile>({ ...profile });

  // Interactive service editor states
  const [editingService, setEditingService] = useState<Partial<RatecardService> | null>(null);
  const [isAddingService, setIsAddingService] = useState(false);

  // Interactive project editor states
  const [editingProject, setEditingProject] = useState<Partial<RatecardProject> | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);

  // Interactive brand editor states
  const [brands, setBrands] = useState<RatecardBrand[]>(initialBrands || []);
  const [editingBrand, setEditingBrand] = useState<Partial<RatecardBrand> | null>(null);
  const [isAddingBrand, setIsAddingBrand] = useState(false);

  // Sync brands once loaded
  useEffect(() => {
    if (initialBrands) {
      setBrands(initialBrands);
    }
  }, [initialBrands]);

  // State management for backup & restore configurations
  const [importFileContent, setImportFileContent] = useState<any>(null);
  const [importFileName, setImportFileName] = useState<string>('');
  const [isImporting, setIsImporting] = useState<boolean>(false);

  // User notifications feedback
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Check storage on mount for active session
  useEffect(() => {
    const savedToken = localStorage.getItem('creator_admin_token');
    if (savedToken) {
      setToken(savedToken);
      setIsLoggedIn(true);
    }
  }, []);

  // Sync profile data once loaded
  useEffect(() => {
    if (profile) {
      setProfileForm({ ...profile });
    }
  }, [profile]);

  const fetchGithubSettings = async (currentToken = token) => {
    if (!currentToken) return;
    try {
      const resp = await fetch('/api/github/settings', {
        headers: {
          'Authorization': `Bearer ${currentToken}`
        }
      });
      const data = await resp.json();
      if (data.success && data.settings) {
        setGithubSettings(data.settings);
      }
    } catch (e) {
      console.error("Gagal memuat pengaturan GitHub:", e);
    }
  };

  const handleExportToGithub = async () => {
    setIsExportingGithub(true);
    setGithubSyncStatus({ message: 'Mengekspor seluruh database dan gambar lokal ke server...', type: 'loading' });
    try {
      const resp = await fetch('/api/github/export-all', {
        method: 'POST',
        headers: getAuthHeader()
      });
      const data = await resp.json();
      if (data.success) {
        let displayMessage = '';
        const { imagesExported, referencesUpdated, hostedOnGithubCount, dbBackupPath } = data.details;
        
        if (imagesExported === 0 && referencesUpdated === 0 && hostedOnGithubCount > 0) {
          displayMessage = `Ekspor selesai! Seluruh berkas media portofolio Anda (${hostedOnGithubCount} gambar) sudah tersimpan & menggunakan tautan permanen CDN GitHub secara langsung sejak awal diunggah. Tidak ada file gambar lokal baru di server yang perlu dikonversi ulang. Berkas database cadangan 'db_backup.json' telah sukses diperbarui di GitHub.`;
        } else if (imagesExported === 0 && referencesUpdated === 0) {
          displayMessage = `Ekspor selesai! File cadangan '${dbBackupPath}' berhasil diunggah ke GitHub. Tidak ada file gambar lokal baru atau referensi link lokal di database yang perlu dikonversi.`;
        } else {
          displayMessage = `Ekspor selesai! Berhasil mengunggah ${imagesExported} berkas gambar baru ke GitHub, memperbarui ${referencesUpdated} tautan referensi database ke tautan permanen CDN GitHub, dan menyimpan file cadangan di '/${dbBackupPath}'.`;
        }

        setGithubSyncStatus({ 
          message: displayMessage, 
          type: 'success' 
        });
        showToast('Sukses mencadangkan data dan media ke GitHub!');
        await onRefreshData();
      } else {
        setGithubSyncStatus({ message: data.message || 'Gagal mengekspor data.', type: 'error' });
        showToast(data.message || 'Gagal mengekspor data.', 'error');
      }
    } catch (err: any) {
      setGithubSyncStatus({ message: 'Koneksi ke backend bermasalah: ' + err.message, type: 'error' });
      showToast('Koneksi bermasalah saat mengekspor: ' + err.message, 'error');
    } finally {
      setIsExportingGithub(false);
    }
  };

  const handleImportFromGithub = async () => {
    if (!window.confirm('Apakah Anda yakin ingin menimpa database lokal saat ini dengan data cadangan yang tersimpan di GitHub? File gambar cadangan juga akan diunduh & dicache kembali secara otomatis.')) {
      return;
    }
    setIsImportingGithub(true);
    setGithubSyncStatus({ message: 'Mengunduh data cadangan penuh dan mengunduh ulang gambar...', type: 'loading' });
    try {
      const resp = await fetch('/api/github/import-all', {
        method: 'POST',
        headers: getAuthHeader()
      });
      const data = await resp.json();
      if (data.success) {
        setGithubSyncStatus({ 
          message: `Impor berhasil diselesaikan! Database berhasil dipulihkan (${data.details.linksCount} link, ${data.details.projectsCount} project, ${data.details.brandsCount} brand). Mengunduh ulang ${data.details.imagesRecached} berkas gambar sebagai cadangan cache lokal.`, 
          type: 'success' 
        });
        showToast('Sukses memulihkan seluruh data dari GitHub!');
        await onRefreshData();
        await fetchGithubSettings();
      } else {
        setGithubSyncStatus({ message: data.message || 'Gagal mengimpor data.', type: 'error' });
        showToast(data.message || 'Gagal mengimpor data_backup.', 'error');
      }
    } catch (err: any) {
      setGithubSyncStatus({ message: 'Koneksi ke backend bermasalah: ' + err.message, type: 'error' });
      showToast('Koneksi bermasalah saat mengimpor: ' + err.message, 'error');
    } finally {
      setIsImportingGithub(false);
    }
  };

  const handleExportZipToPC = async () => {
    setIsExportingPCZip(true);
    setGithubSyncStatus({ message: 'Menyiapkan berkas ZIP cadangan (database & seluruh gambar)...', type: 'loading' });
    try {
      const headers = getAuthHeader();
      const resp = await fetch('/api/github/export-pc-zip', {
        method: 'GET',
        headers
      });
      if (!resp.ok) {
        let msg = 'Gagal melakukan ekspor berkas ZIP.';
        try {
          const errData = await resp.json();
          msg = errData.message || msg;
        } catch (e) {}
        throw new Error(msg);
      }

      const blob = await resp.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      
      const contentDisposition = resp.headers.get('content-disposition');
      let filename = `creator_portfolio_backup_${new Date().toISOString().substring(0, 10)}.zip`;
      if (contentDisposition) {
        const matches = /filename="([^"]+)"/.exec(contentDisposition);
        if (matches && matches[1]) {
          filename = matches[1];
        }
      }
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setGithubSyncStatus({
        message: 'Sukses mengunduh cadangan lengkap! Seluruh file gambar dan database Anda telah dikompresi ke dalam folder ZIP dan diunduh ke komputer Anda.',
        type: 'success'
      });
      showToast('Cadangan ZIP sukses diunduh ke komputer!');
    } catch (err: any) {
      setGithubSyncStatus({ message: 'Gagal melakukan ekspor berkas ZIP: ' + err.message, type: 'error' });
      showToast('Ekspor ZIP gagal: ' + err.message, 'error');
    } finally {
      setIsExportingPCZip(false);
    }
  };

  const handleImportZipFromPC = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!window.confirm(`Apakah Anda yakin ingin mengimpor cadangan dari komputer Anda (${file.name})? Ini akan sepenuhnya menimpa database saat ini, memulihkan seluruh media gambar ke folder server lokal, dan mengunggahnya secara sinkron ke repository GitHub.`)) {
      e.target.value = '';
      return;
    }

    setIsImportingPCZip(true);
    setGithubSyncStatus({ message: `Membaca & mengekstrak berkas ZIP cadangan (${file.name})...`, type: 'loading' });
    try {
      const authHeaders = getAuthHeader();
      const headers = {
        ...authHeaders,
        'Content-Type': 'application/zip'
      };

      const arrayBuffer = await file.arrayBuffer();

      const resp = await fetch('/api/github/import-pc-zip', {
        method: 'POST',
        headers,
        body: arrayBuffer
      });

      const data = await resp.json();
      if (data.success) {
        setGithubSyncStatus({
          message: `Pulihkan data penuh dari berkas ZIP lokal sukses! Berhasil mengimpor database (${data.details.linksCount} link, ${data.details.projectsCount} project, ${data.details.brandsCount} brand) dan memulihkan ${data.details.imagesRestored} berkas gambar ke folder uploads server lokal & server cadangan GitHub.`,
          type: 'success'
        });
        showToast('Sukses memulihkan seluruh data portofolio dari komputer!');
        await onRefreshData();
        await fetchGithubSettings();
      } else {
        setGithubSyncStatus({ message: data.message || 'Gagal mengimpor file backup ZIP.', type: 'error' });
        showToast(data.message || 'Gagal mengimpor file backup ZIP.', 'error');
      }
    } catch (err: any) {
      setGithubSyncStatus({ message: 'Koneksi ke backend bermasalah: ' + err.message, type: 'error' });
      showToast('Koneksi bermasalah saat mengimpor ZIP: ' + err.message, 'error');
    } finally {
      setIsImportingPCZip(false);
      e.target.value = '';
    }
  };

  // Load GitHub settings when logged in
  useEffect(() => {
    if (isLoggedIn && token) {
      fetchGithubSettings(token);
    }
  }, [isLoggedIn, token]);

  // Dynamic CRM analytical calculations for links
  const totalClicks = links.reduce((acc, current) => acc + (current.clicks || 0), 0);
  const sortedLinksByClicks = [...links].sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
  const topLink = sortedLinksByClicks[0];

  // Platforms clicks accumulator
  const platformStats: { [key: string]: number } = {
    'Shopee': 0,
    'Tokopedia': 0,
    'TikTok / Social': 0,
    'Lainnya': 0
  };

  links.forEach(l => {
    const cat = l.category.toLowerCase();
    const clicks = l.clicks || 0;
    if (cat.includes('shopee')) {
      platformStats['Shopee'] += clicks;
    } else if (cat.includes('tokopedia')) {
      platformStats['Tokopedia'] += clicks;
    } else if (cat.includes('tiktok') || cat.includes('social') || cat.includes('media')) {
      platformStats['TikTok / Social'] += clicks;
    } else {
      platformStats['Lainnya'] += clicks;
    }
  });

  // Show status toasts
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('creator_admin_token', data.token);
        setToken(data.token);
        setIsLoggedIn(true);
        setPassword('');
        showToast('Login berhasil! Selamat datang Admin.');
      } else {
        setLoginError(data.message || 'Password salah!');
      }
    } catch (err) {
      setLoginError('Koneksi ke backend gagal!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('creator_admin_token');
    setToken(null);
    setIsLoggedIn(false);
    showToast('Logout berhasil!', 'success');
  };

  // Helper header generator
  const getAuthHeader = () => {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || localStorage.getItem('creator_admin_token')}`
    };
  };

  // ================= AFFILIATE LINKS OPERATIONS =================

  const saveLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink) return;

    const isEdit = !!editingLink.id;
    const urlField = isEdit ? `/api/links/${editingLink.id}` : '/api/links';
    const methodField = isEdit ? 'PUT' : 'POST';

    try {
      const response = await fetch(urlField, {
        method: methodField,
        headers: getAuthHeader(),
        body: JSON.stringify(editingLink)
      });
      const data = await response.json();
      if (data.success) {
        showToast(isEdit ? 'Link berhasil diupdate!' : 'Link baru ditambahkan!');
        setEditingLink(null);
        setIsAddingLink(false);
        await onRefreshData();
      } else {
        showToast(data.message || 'Gagal menyimpan link', 'error');
      }
    } catch (err) {
      showToast('Terjadi kesalahan jaringan', 'error');
    }
  };

  const deleteLink = async (id: string) => {
    if (!window.confirm('Yakin ingin menghapus link rekomendasi ini?')) return;

    try {
      const response = await fetch(`/api/links/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
      const data = await response.json();
      if (data.success) {
        showToast('Link rekomendasi berhasil dihapus!');
        await onRefreshData();
      } else {
        showToast(data.message || 'Gagal menghapus link', 'error');
      }
    } catch (err) {
      showToast('Terjadi kesalahan jaringan', 'error');
    }
  };

  const [isUploading, setIsUploading] = useState<{[key: string]: boolean}>({});

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: 'avatarUrl' | 'link' | 'project' | 'brand') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (10MB)
    if (file.size > 10 * 1024 * 1024) {
      showToast('Ukuran file terlalu besar. Maksimal 10MB.', 'error');
      return;
    }

    setIsUploading(prev => ({ ...prev, [targetField]: true }));

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64Data = reader.result as string;
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
          },
          body: JSON.stringify({
            fileName: file.name,
            base64Data
          })
        });

        const data = await response.json();
        if (data.success) {
          showToast('Gambar berhasil diunggah!');
          if (targetField === 'avatarUrl') {
            setProfileForm(prev => ({ ...prev, avatarUrl: data.url }));
          } else if (targetField === 'link') {
            setEditingLink(prev => ({ ...prev, imageUrl: data.url }));
          } else if (targetField === 'project') {
            setEditingProject(prev => ({ ...prev, imageUrl: data.url }));
          } else if (targetField === 'brand') {
            setEditingBrand(prev => ({ ...prev, logoUrl: data.url }));
          }
        } else {
          showToast(data.message || 'Gagal mengunggah gambar', 'error');
        }
      } catch (err) {
        showToast('Kesalahan jaringan saat mengunggah', 'error');
      } finally {
        setIsUploading(prev => ({ ...prev, [targetField]: false }));
      }
    };
    reader.onerror = () => {
      showToast('Gagal membaca file gambar', 'error');
      setIsUploading(prev => ({ ...prev, [targetField]: false }));
    };
    reader.readAsDataURL(file);
  };

  // ================= PROFILE OPERATIONS =================

  const saveProfile = async (e?: React.FormEvent, profileToSave?: RatecardProfile) => {
    if (e) e.preventDefault();
    const targetProfile = profileToSave || profileForm;

    try {
      const sanitizedProfile = {
        ...targetProfile,
        termsOfService: (targetProfile.termsOfService || [])
          .map(t => t.trim())
          .filter(t => t.length > 0)
      };

      const response = await fetch('/api/ratecard/profile', {
        method: 'PUT',
        headers: getAuthHeader(),
        body: JSON.stringify(sanitizedProfile)
      });
      const data = await response.json();
      if (data.success) {
        showToast('Profile & Ratecard berhasil disimpan!');
        await onRefreshData();
      } else {
        showToast(data.message || 'Gagal mengupdate profile', 'error');
      }
    } catch (err) {
      showToast('Koneksi gagal', 'error');
    }
  };

  // ================= BACKUP & RESTORE OPERATIONS =================

  const handleExportDatabase = async () => {
    try {
      const response = await fetch('/api/backup/export', {
        headers: getAuthHeader()
      });
      const data = await response.json();
      if (data.success) {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data.database, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `backup-creator-portfolio-${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        showToast('Database berhasil diekspor! Simpan file JSON ini di penyimpanan lokal Anda.');
      } else {
        showToast(data.message || 'Gagal mengekspor database', 'error');
      }
    } catch (err) {
      showToast('Kesalahan jaringan saat mengekspor database', 'error');
    }
  };

  const handleBackupFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (!json.profile || !json.links || !json.services || !json.projects) {
          showToast('File backup minimal wajib memiliki data profile, links, services, dan projects.', 'error');
          setImportFileContent(null);
          return;
        }
        setImportFileContent(json);
        showToast('File berkas backup valid! Anda dapat memulihkannya sekarang.');
      } catch (err) {
        showToast('File bukan berkas JSON kustom yang valid.', 'error');
        setImportFileContent(null);
      }
    };
    reader.readAsText(file);
  };

  const handleImportDatabase = async () => {
    if (!importFileContent) {
      showToast('Pilih file backup Anda terlebih dahulu.', 'error');
      return;
    }

    const confirmRestore = window.confirm('PENTING: Seluruh data website (link, ratecard, video) di database server akan ditimpa penuh dengan isi file backup ini. Lanjutkan?');
    if (!confirmRestore) return;

    setIsImporting(true);
    try {
      const response = await fetch('/api/backup/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({ database: importFileContent })
      });

      const data = await response.json();
      if (data.success) {
        showToast('Seluruh database berhasil dipulihkan!');
        setImportFileContent(null);
        setImportFileName('');
        await onRefreshData();
        await fetchGithubSettings();
      } else {
        showToast(data.message || 'Gagal memulihkan data', 'error');
      }
    } catch (err) {
      showToast('Kesalahan koneksi saat memulihkan database', 'error');
    } finally {
      setIsImporting(false);
    }
  };

  // ================= SERVICES OPERATIONS =================

  const saveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    const isEdit = !!editingService.id;
    const urlField = isEdit ? `/api/ratecard/services/${editingService.id}` : '/api/ratecard/services';
    const methodField = isEdit ? 'PUT' : 'POST';

    try {
      const response = await fetch(urlField, {
        method: methodField,
        headers: getAuthHeader(),
        body: JSON.stringify(editingService)
      });
      const data = await response.json();
      if (data.success) {
        showToast(isEdit ? 'Layanan ratecard berhasil diupdate!' : 'Layanan ratecard baru ditambah!');
        setEditingService(null);
        setIsAddingService(false);
        await onRefreshData();
      } else {
        showToast(data.message || 'Gagal menyimpan ratecard', 'error');
      }
    } catch (err) {
      showToast('Terjadi kesalahan jaringan', 'error');
    }
  };

  const deleteService = async (id: string) => {
    if (!window.confirm('Yakin ingin menghapus layanan ratecard ini?')) return;

    try {
      const response = await fetch(`/api/ratecard/services/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
      const data = await response.json();
      if (data.success) {
        showToast('Layanan ratecard berhasil dihapus!');
        await onRefreshData();
      } else {
        showToast(data.message || 'Gagal menghapus layanan', 'error');
      }
    } catch (err) {
      showToast('Koneksi gagal', 'error');
    }
  };

  // Pre-filled forms helpers
  const triggerAddLink = () => {
    setEditingLink({
      title: '',
      url: '',
      category: 'Shopee',
      description: '',
      isActive: true,
      priority: links.length + 1
    });
    setIsAddingLink(true);
  };

  const triggerEditLink = (link: AffiliateLink) => {
    setEditingLink({ ...link });
    setIsAddingLink(false);
  };

  const triggerAddService = () => {
    setEditingService({
      title: '',
      price: 'Rp ',
      description: '',
      icon: 'Video',
      isActive: true,
      priority: services.length + 1
    });
    setIsAddingService(true);
  };

  const triggerEditService = (service: RatecardService) => {
    setEditingService({ ...service });
    setIsAddingService(false);
  };

  // ================= PROJECTS OPERATIONS =================

  const saveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    const isEdit = !!editingProject.id;
    const urlField = isEdit ? `/api/ratecard/projects/${editingProject.id}` : '/api/ratecard/projects';
    const methodField = isEdit ? 'PUT' : 'POST';

    try {
      const response = await fetch(urlField, {
        method: methodField,
        headers: getAuthHeader(),
        body: JSON.stringify(editingProject)
      });
      const data = await response.json();
      if (data.success) {
        showToast(isEdit ? 'Project berhasil diupdate!' : 'Project baru berhasil ditambahkan!');
        setEditingProject(null);
        setIsAddingProject(false);
        await onRefreshData();
      } else {
        showToast(data.message || 'Gagal menyimpan project', 'error');
      }
    } catch (err) {
      showToast('Terjadi kesalahan jaringan', 'error');
    }
  };

  const deleteProject = async (id: string) => {
    if (!window.confirm('Yakin ingin menghapus video project ini?')) return;

    try {
      const response = await fetch(`/api/ratecard/projects/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
      const data = await response.json();
      if (data.success) {
        showToast('Video project berhasil dihapus!');
        await onRefreshData();
      } else {
        showToast(data.message || 'Gagal menghapus project', 'error');
      }
    } catch (err) {
      showToast('Koneksi gagal', 'error');
    }
  };

  const triggerAddProject = () => {
    setEditingProject({
      title: '',
      highlight: '',
      views: '1M',
      category: 'Room Upgrade',
      url: '',
      imageUrl: ''
    });
    setIsAddingProject(true);
  };

  const triggerEditProject = (project: RatecardProject) => {
    setEditingProject({ ...project });
    setIsAddingProject(false);
  };


  // ================= BRANDS & LOGOS OPERATIONS =================

  const saveBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBrand) return;

    const isEdit = !!editingBrand.id;
    const urlField = isEdit ? `/api/ratecard/brands/${editingBrand.id}` : '/api/ratecard/brands';
    const methodField = isEdit ? 'PUT' : 'POST';

    try {
      const response = await fetch(urlField, {
        method: methodField,
        headers: getAuthHeader(),
        body: JSON.stringify(editingBrand)
      });
      const data = await response.json();
      if (data.success) {
        showToast(isEdit ? 'Brand berhasil diupdate!' : 'Brand baru berhasil ditambahkan!');
        setEditingBrand(null);
        setIsAddingBrand(false);
        await onRefreshData();
      } else {
        showToast(data.message || 'Gagal menyimpan brand', 'error');
      }
    } catch (err) {
      showToast('Terjadi kesalahan jaringan', 'error');
    }
  };

  const deleteBrand = async (id: string) => {
    if (!window.confirm('Yakin ingin menghapus brand ini dari list kolaborasi?')) return;

    try {
      const response = await fetch(`/api/ratecard/brands/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
      const data = await response.json();
      if (data.success) {
        showToast('Brand berhasil dihapus!');
        await onRefreshData();
      } else {
        showToast(data.message || 'Gagal menghapus brand', 'error');
      }
    } catch (err) {
      showToast('Koneksi gagal', 'error');
    }
  };

  const triggerAddBrand = () => {
    setEditingBrand({
      name: '',
      logoUrl: '',
      isActive: true,
      priority: (brands.length > 0 ? Math.max(...brands.map(b => b.priority || 0)) + 1 : 1)
    });
    setIsAddingBrand(true);
  };

  const triggerEditBrand = (brand: RatecardBrand) => {
    setEditingBrand({ ...brand });
    setIsAddingBrand(false);
  };


  // If NOT Logged In, Render standard beautiful Lock screen
  if (!isLoggedIn) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-16" id="admin-login-screen">
        <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xl text-center">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-xl font-display font-bold text-slate-800">Panel Admin Hub</h1>
          <p className="text-xs text-slate-400 mt-1 mb-6">Masukkan password admin untuk mengelola isi website Anda.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="text-left">
              <label className="block text-xs font-mono font-medium text-slate-500 mb-1">PASSWORD ADMIN</label>
              <input 
                type="password"
                placeholder="••••••••"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-indigo-400 outline-none text-sm bg-slate-50 font-sans"
                id="admin-password-input"
              />
              {loginError && <p className="text-[11px] text-red-500 mt-1 font-sans">{loginError}</p>}
            </div>
            
            <button 
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs shadow-xs transition-all tracking-wider uppercase font-sans cursor-pointer"
              id="submit-login-button"
            >
              Masuk Dashboard
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-150">
            <button 
              onClick={onNavigateBack}
              className="text-xs font-medium text-slate-400 hover:text-indigo-600 transition-colors flex items-center justify-center gap-1.5 mx-auto"
              id="back-from-login-dashboard"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali ke Linktree
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8" id="admin-dashboard">
      
      {/* Toast Notification Container */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold text-white animate-bounce ${
          notification.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
        }`} id="admin-toast">
          <Sparkles className="w-4 h-4" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Top Welcome Panel */}
          <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 shadow-lg mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="p-3 bg-indigo-500/10 rounded-2xl hidden md:block">
            <Sliders className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-display font-bold">Halo Admin! 👋</h1>
          </div>
        </div>
        <div className="flex gap-2.5">
          <button 
            onClick={onNavigateBack}
            className="px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer font-sans"
            id="back-home-button-dashboard"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Landing Page
          </button>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer font-sans"
            id="logout-button-dashboard"
          >
            <LogOut className="w-3.5 h-3.5" /> Keluar
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8" id="admin-dashboard-container">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-72 shrink-0 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-8">
            
            {/* Linktree Section */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-slate-400 uppercase block pl-3 mb-1">GENERAL CONTROL</span>
              <button 
                onClick={() => { setActiveTab('links'); setEditingLink(null); }} 
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 group ${activeTab === 'links' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                <div className="flex items-center gap-3">
                  <LinkIcon className={`w-4 h-4 ${activeTab === 'links' ? 'text-indigo-200' : 'text-slate-400 group-hover:text-indigo-600'}`} /> 
                  Linktree Links
                </div>
                {activeTab === 'links' && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
              </button>
              <button 
                onClick={() => { setActiveTab('analytics'); }} 
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 group ${activeTab === 'analytics' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                <div className="flex items-center gap-3">
                  <TrendingUp className={`w-4 h-4 ${activeTab === 'analytics' ? 'text-indigo-200' : 'text-slate-400 group-hover:text-indigo-600'}`} /> 
                  Analytics Performa
                </div>
                {activeTab === 'analytics' && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
              </button>
              <button 
                onClick={() => { setActiveTab('design'); }} 
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 group ${activeTab === 'design' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                <div className="flex items-center gap-3">
                  <Palette className={`w-4 h-4 ${activeTab === 'design' ? 'text-indigo-200' : 'text-slate-400 group-hover:text-indigo-600'}`} /> 
                  Design Theme
                </div>
                {activeTab === 'design' && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
              </button>
            </div>

            {/* Ratecard Section */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-slate-400 uppercase block pl-3 mb-1">RATECARD ASSETS</span>
              <button 
                onClick={() => { setActiveTab('ratecard'); }} 
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 group ${activeTab === 'ratecard' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                <div className="flex items-center gap-3">
                  <Sparkles className={`w-4 h-4 ${activeTab === 'ratecard' ? 'text-indigo-200' : 'text-slate-400 group-hover:text-indigo-600'}`} /> 
                  Header & Hero
                </div>
                {activeTab === 'ratecard' && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
              </button>
              <button 
                onClick={() => { setActiveTab('services'); setEditingService(null); }} 
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 group ${activeTab === 'services' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                <div className="flex items-center gap-3">
                  <Briefcase className={`w-4 h-4 ${activeTab === 'services' ? 'text-indigo-200' : 'text-slate-400 group-hover:text-indigo-600'}`} /> 
                  Services Pricing
                </div>
                {activeTab === 'services' && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
              </button>
              <button 
                onClick={() => { setActiveTab('projects'); setEditingProject(null); }} 
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 group ${activeTab === 'projects' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                <div className="flex items-center gap-3">
                  <Video className={`w-4 h-4 ${activeTab === 'projects' ? 'text-indigo-200' : 'text-slate-400 group-hover:text-indigo-600'}`} /> 
                  Portfolio Videos
                </div>
                {activeTab === 'projects' && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
              </button>
              <button 
                onClick={() => { setActiveTab('brands'); setEditingBrand(null); }} 
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 group ${activeTab === 'brands' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                <div className="flex items-center gap-3">
                  <Tag className={`w-4 h-4 ${activeTab === 'brands' ? 'text-indigo-200' : 'text-slate-400 group-hover:text-indigo-600'}`} /> 
                  Brand Partners
                </div>
                {activeTab === 'brands' && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
              </button>
            </div>

            {/* Sistem Section */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-slate-400 uppercase block pl-3 mb-1">SYSTEM CONTROLS</span>
              <button 
                onClick={() => { setActiveTab('profile'); }} 
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 group ${activeTab === 'profile' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                <div className="flex items-center gap-3">
                  <User className={`w-4 h-4 ${activeTab === 'profile' ? 'text-indigo-200' : 'text-slate-400 group-hover:text-indigo-600'}`} /> 
                  Profil Akun
                </div>
                {activeTab === 'profile' && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
              </button>
              <button 
                onClick={() => { setActiveTab('backup'); }} 
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 group ${activeTab === 'backup' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                <div className="flex items-center gap-3">
                  <Database className={`w-4 h-4 ${activeTab === 'backup' ? 'text-indigo-200' : 'text-slate-400 group-hover:text-indigo-600'}`} /> 
                  Backup & Restore
                </div>
                {activeTab === 'backup' && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
              </button>
              <button 
                onClick={() => { setActiveTab('history' as any); }} 
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 group ${activeTab === ('history' as any) ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <History className={`w-4 h-4 shrink-0 ${activeTab === ('history' as any) ? 'text-indigo-200' : 'text-slate-400 group-hover:text-indigo-600'}`} /> 
                  <span className="truncate">System Logs</span>
                </div>
                {activeTab === ('history' as any) && <div className="w-1.5 h-1.5 rounded-full bg-indigo-200 animate-pulse ml-2 shrink-0" />}
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">

      {/* ======================================================== */}
      {/* 1. MANAGE AFFILIATE LINKS VIEW TAB */}
      {/* ======================================================== */}
      {activeTab === 'links' && (
        <div className="space-y-6" id="tab-content-links">
            
            {/* Visual Link Analytical Widgets (High-fidelity CRM design) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="links-stats-bento">
              {/* Total Clicks Widget */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center justify-between col-span-1">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">TOTAL CLICKS METRIC</span>
                  <span className="text-4xl font-display font-black text-slate-900 tracking-tight block mt-2">
                    {totalClicks}
                  </span>
                  <span className="text-xs text-slate-500 mt-2 block">Akumulasi sepanjang waktu</span>
                </div>
                <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600 shrink-0">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>

              {/* Top Performing Item Widget */}
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs col-span-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">TOP PERFORMING ITEM</span>
                  {topLink ? (
                    <>
                      <h4 className="text-slate-800 text-xs font-semibold mt-2 line-clamp-1">
                        {topLink.title}
                      </h4>
                      <span className="text-xs font-mono font-bold text-emerald-600 block mt-1">
                        {topLink.clicks || 0} clicks ({totalClicks > 0 ? ((topLink.clicks / totalClicks) * 100).toFixed(1) : 0}%)
                      </span>
                    </>
                  ) : (
                    <span className="text-xs text-slate-400 block mt-2">Belum ada statistik</span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 font-mono block border-t border-slate-100 pt-2 pb-0.5 mt-2">
                  Konversi link terpopuler Anda
                </span>
              </div>

              {/* Platform Clicks distribution */}
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs col-span-1 space-y-2">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">PLATFORM CLICK SHARE</span>
                
                <div className="space-y-1.5 text-[11px]" id="share-platform-distribution">
                  {Object.entries(platformStats).map(([platform, clicks]) => {
                    const percentage = totalClicks > 0 ? (clicks / totalClicks) * 100 : 0;
                    const barColor = platform === 'Shopee' ? 'bg-orange-500' :
                                     platform === 'Tokopedia' ? 'bg-green-500' :
                                     platform === 'TikTok / Social' ? 'bg-slate-900' : 'bg-blue-500';
                    return (
                      <div key={platform} className="space-y-0.5">
                        <div className="flex justify-between text-[10px] font-medium font-mono text-slate-600">
                          <span>{platform}</span>
                          <span>{clicks} klik ({percentage.toFixed(0)}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${barColor} rounded-full transition-all duration-300`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Header Action Row */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-md font-display font-bold text-slate-800">Daftar Link Affiliate</h2>
                <p className="text-xs text-slate-400">Total {links.length} link belanja terdaftar</p>
              </div>
              {!editingLink && (
                <button
                  onClick={triggerAddLink}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer font-sans"
                  id="btn-trigger-add-link"
                >
                  <PlusCircle className="w-4 h-4" /> Tambah Link Baru
                </button>
              )}
            </div>

          {/* Collapsible Add/Edit Form Box */}
          {editingLink && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-inner" id="link-form-container">
              <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <PlusCircle className="w-3.5 h-3.5 text-indigo-500" />
                {isAddingLink ? 'TAMBAH LINK BARU' : `EDIT LINK: ${editingLink.title}`}
              </h3>
              
              <form onSubmit={saveLink} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase mb-1">Judul Rekomendasi</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Keyboard Wireless Gateron 60%"
                      value={editingLink.title || ''}
                      required
                      onChange={(e) => setEditingLink({...editingLink, title: e.target.value})}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-xs bg-white outline-none focus:border-indigo-400 font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase mb-1">Kategori Platform</label>
                    <select
                      value={editingLink.category || 'Shopee'}
                      onChange={(e) => setEditingLink({...editingLink, category: e.target.value})}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-xs bg-white outline-none focus:border-indigo-400 font-sans"
                    >
                      <option value="Shopee">Shopee</option>
                      <option value="Tokopedia">Tokopedia</option>
                      <option value="TikTok Shop">TikTok Shop</option>
                      <option value="Social Direct">Social Direct (Medsos)</option>
                      <option value="Tech Setup">Link Lainnya</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase mb-1">URL Affiliate Tujuan</label>
                  <input 
                    type="url" 
                    placeholder="https://shope.ee/..."
                    value={editingLink.url || ''}
                    required
                    onChange={(e) => setEditingLink({...editingLink, url: e.target.value})}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-xs bg-white outline-none focus:border-indigo-400 font-mono"
                  />
                </div>

                 <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase mb-1">Cover / Gambar Review Besar (Opsional)</label>
                  <div className="flex gap-2 items-center">
                    <input 
                      type="text" 
                      placeholder="https://images.unsplash.com/photo-... atau url gambar kustom"
                      value={editingLink.imageUrl || ''}
                      onChange={(e) => setEditingLink({...editingLink, imageUrl: e.target.value})}
                      className="flex-1 px-3 py-2.5 border border-slate-200 rounded-lg text-xs bg-white outline-none focus:border-indigo-400 font-mono"
                    />
                    <label className="px-3.5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-xs font-bold cursor-pointer transition-colors shrink-0 text-center select-none">
                      {isUploading['link'] ? 'Uploading...' : 'Unggah File'}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleFileUpload(e, 'link')} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Gunakan foto meja kerja, setup meja atau produk fungsional dari folder lokal / disk lokal.
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase mb-1">Deskripsi Tambahan (Opsional)</label>
                  <textarea 
                    placeholder="Detail tentang spesifikasi keyboard ini atau kenapa Anda merekomendasikannya."
                    value={editingLink.description || ''}
                    rows={2}
                    onChange={(e) => setEditingLink({...editingLink, description: e.target.value})}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-xs bg-white outline-none focus:border-indigo-400 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase mb-1">Nama Tombol CTA (Default: Beli Sekarang)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Cek di Shopee, Lihat Produk, Selengkapnya..."
                    value={editingLink.buttonLabel ?? ''}
                    onChange={(e) => setEditingLink({...editingLink, buttonLabel: e.target.value})}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-xs bg-white outline-none focus:border-indigo-400 font-sans"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase mb-1">Urutan Prioritas Tampil</label>
                    <input 
                      type="number" 
                      min="1"
                      value={editingLink.priority || 1}
                      required
                      onChange={(e) => setEditingLink({...editingLink, priority: Number(e.target.value)})}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-xs bg-white outline-none focus:border-indigo-400 font-mono"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-5">
                    <input 
                      type="checkbox" 
                      id="linkIsActive"
                      checked={editingLink.isActive !== false}
                      onChange={(e) => setEditingLink({...editingLink, isActive: e.target.checked})}
                      className="rounded border-slate-300 text-indigo-650 focus:ring-indigo-500 w-4.5 h-4.5"
                    />
                    <label htmlFor="linkIsActive" className="text-xs font-medium text-slate-600">Jadikan Link Aktif / Publik</label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-slate-150">
                  <button
                    type="button"
                    onClick={() => { setEditingLink(null); setIsAddingLink(false); }}
                    className="px-4 py-2 border border-slate-250 rounded-lg text-xs text-slate-500 hover:bg-slate-100 transition-colors font-sans"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors font-sans flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" /> Simpan Link
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Interactive Lists for Links with click tracking metrics */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden" id="admin-links-list">
            <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">Listings</span>
              <button 
                onClick={async () => { await onRefreshData(); showToast("Data direfresh!"); }}
                className="text-xs text-indigo-500 hover:text-indigo-700 flex items-center gap-1.5"
                title="Refresh Kliks"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Sync Data
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {links.length > 0 ? (
                links.map((link) => (
                  <div 
                    key={link.id}
                    className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/30 transition-colors ${
                      !link.isActive ? 'opacity-60 bg-slate-50/50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      {link.imageUrl && (
                        <img 
                          src={link.imageUrl} 
                          alt="" 
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 object-cover rounded-xl shrink-0 border border-slate-150 bg-slate-100"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                            {link.category}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            Prioritas: {link.priority}
                          </span>
                          {!link.isActive && (
                            <span className="text-[10px] bg-red-50 text-red-600 font-mono px-2 py-0.5 rounded-md">
                              Dihide (Draft)
                            </span>
                          )}
                        </div>
                        <h3 className="font-display font-semibold text-slate-800 text-xs sm:text-sm mt-1">
                          {link.title}
                        </h3>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5 max-w-sm">{link.url}</p>
                      </div>
                    </div>

                    {/* Metric and Action Row */}
                    <div className="flex items-center gap-5 justify-between sm:justify-end shrink-0 border-t sm:border-transparent pt-2.5 sm:pt-0">
                      {/* Click counter badge */}
                      <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-3 py-1 rounded-xl">
                        <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs font-mono font-bold text-slate-700">{link.clicks || 0}</span>
                        <span className="text-[10px] text-slate-400 font-mono">Kliks</span>
                      </div>
                      
                      <div className="flex gap-1.5">
                        <button 
                          onClick={() => triggerEditLink(link)}
                          className="p-2 text-slate-450 hover:text-indigo-650 bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => deleteLink(link.id)}
                          className="p-2 text-slate-450 hover:text-red-650 bg-slate-50 hover:bg-red-50 border border-slate-100 hover:border-red-100 rounded-lg transition-colors cursor-pointer"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Belum ada link affiliate terdaftar. Klik tombol diatas untuk menambahkan.
                </div>
              )}
            </div>
          </div>
        </div>
      )}


      {/* ======================================================== */}
      {/* 2. MANAGE RATEBOARD RATECARD CONFIG TAB */}
      {/* ======================================================== */}
      {activeTab === 'ratecard' && (
        <div className="space-y-6" id="tab-content-ratecard-hero">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mb-6">
            <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Header &amp; Hero Ratecard
            </h3>
            <p className="text-xs text-slate-400 mb-4">Sesuaikan teks headline utama yang muncul pada bagian paling atas halaman Ratecard Anda.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="col-span-1">
                <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase mb-1">Tagline Atas Badge</label>
                <input 
                  type="text" 
                  value={profileForm.heroTagline || ''}
                  placeholder="e.g. STYLISH SPACE & HOME UPGRADES CREATOR"
                  onChange={(e) => setProfileForm({...profileForm, heroTagline: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-indigo-400 outline-none transition-colors font-sans"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase mb-1">Headline Utama (Bagian 1)</label>
                <input 
                  type="text" 
                  value={profileForm.heroTitle1 || ''}
                  placeholder="e.g. We Design Digital"
                  onChange={(e) => setProfileForm({...profileForm, heroTitle1: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-indigo-400 outline-none transition-colors font-sans"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase mb-1">Headline Bagian Sorot (Gradient)</label>
                <input 
                  type="text" 
                  value={profileForm.heroTitleHighlight || ''}
                  placeholder="e.g. Experiences"
                  onChange={(e) => setProfileForm({...profileForm, heroTitleHighlight: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-indigo-400 outline-none transition-colors font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase mb-1">Subheadline Pendahuluan Ratecard</label>
              <textarea 
                value={profileForm.heroDescription || ''}
                rows={3}
                placeholder="Masukkan kalimat perkenalan aesthetic ratecard Anda..."
                onChange={(e) => setProfileForm({...profileForm, heroDescription: e.target.value})}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-indigo-400 outline-none transition-colors font-sans leading-relaxed"
              />
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={() => saveProfile()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-bold shadow-xs transition-all cursor-pointer font-sans flex items-center gap-1.5"
              >
                <Save className="w-3 h-3" /> Simpan Hero Config
              </button>
            </div>
          </div>

          {/* NEW: Domicile & Contact Section */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mb-6">
            <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-indigo-500" /> Lokasi Domisili &amp; Telepon Teks
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase mb-1">Domisili / Studio Location</label>
                <input 
                  type="text" 
                  value={profileForm.domicile || ''}
                  placeholder="e.g. Tangerang, Indonesia"
                  onChange={(e) => setProfileForm({...profileForm, domicile: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-indigo-400 outline-none transition-colors font-sans"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase mb-1">Teks Kontak Telepon / WA WA</label>
                <input 
                  type="text" 
                  value={profileForm.contactPhone || ''}
                  placeholder="e.g. +62-816-273-270"
                  onChange={(e) => setProfileForm({...profileForm, contactPhone: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-indigo-400 outline-none transition-colors font-sans font-mono"
                />
              </div>
            </div>
          </div>

          {/* NEW: Gelar & Tahun Studio Customize Tab */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mb-6">
            <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Award className="w-3.5 h-3.5 text-indigo-500" /> Gelar Kreator &amp; Tahun Berdiri
            </h3>
            <p className="text-xs text-slate-400 mb-4">Sesuaikan gelar utama (misal STUDIO DIRECTOR) dan tahun berdiri (misal ESTD 2026) yang tampil di samping foto profil Anda.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase mb-1">Gelar Utama (Director Title)</label>
                <input 
                  type="text" 
                  value={profileForm.studioDirectorTitle || ''}
                  placeholder="e.g. STUDIO DIRECTOR"
                  onChange={(e) => setProfileForm({...profileForm, studioDirectorTitle: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-indigo-400 outline-none transition-colors font-sans"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono font-bold text-[#8B82F6] uppercase mb-1">Tahun Berdiri (Estd Year / Text)</label>
                <input 
                  type="text" 
                  value={profileForm.studioEstdYear || ''}
                  placeholder="e.g. 2026"
                  onChange={(e) => setProfileForm({...profileForm, studioEstdYear: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-indigo-400 outline-none transition-colors font-sans font-mono font-semibold text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* NEW: Interactive Stats Editor Curation */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mb-6">
            <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-500" /> Statistik &amp; Metrik Audiens Ratecard
            </h3>
            <p className="text-xs text-slate-400 mb-6">Sesuaikan 5 kartu metrik statistik hasil jangkauan audiens organik yang tampil pada halaman Ratecard Anda.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 pb-6 border-b border-slate-50">
              <div className="col-span-1">
                <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase mb-1">Badge Atas Stats</label>
                <input 
                  type="text" 
                  value={profileForm.statsBadge || ''}
                  placeholder="e.g. ORGANIC REACH METRICS"
                  onChange={(e) => setProfileForm({...profileForm, statsBadge: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-indigo-400 outline-none transition-colors font-sans"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase mb-1">Judul Utama Stats</label>
                <input 
                  type="text" 
                  value={profileForm.statsTitle || ''}
                  placeholder="e.g. Verified Audience Traction"
                  onChange={(e) => setProfileForm({...profileForm, statsTitle: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-indigo-400 outline-none transition-colors font-sans"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase mb-1">Deskripsi Pendek Stats</label>
                <input 
                  type="text" 
                  value={profileForm.statsDescription || ''}
                  placeholder="e.g. Real-time Instagram Insight data..."
                  onChange={(e) => setProfileForm({...profileForm, statsDescription: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-indigo-400 outline-none transition-colors font-sans"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[0, 1, 2, 3, 4].map((index) => {
                const currentStats = profileForm.stats || [];
                const statObj = currentStats[index] || { value: '', label: '', desc: '' };
                
                const updateStatField = (field: 'value' | 'label' | 'desc', val: string) => {
                  const newStats = [...currentStats];
                  while (newStats.length <= index) {
                    newStats.push({ value: '', label: '', desc: '' });
                  }
                  newStats[index] = { ...newStats[index], [field]: val };
                  setProfileForm({ ...profileForm, stats: newStats });
                };
                
                return (
                  <div key={index} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
                    <span className="text-[10px] font-mono font-extrabold text-indigo-600 block">CARD METRIC {index + 1}</span>
                    
                    <div>
                      <label className="block text-[9px] font-mono font-semibold text-slate-400 uppercase">Nilai (e.g. 60 K)</label>
                      <input 
                        type="text"
                        value={statObj.value}
                        placeholder="e.g. 60 K"
                        onChange={(e) => updateStatField('value', e.target.value)}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-[10px] bg-white outline-none focus:border-indigo-400 font-sans font-bold"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[9px] font-mono font-semibold text-slate-400 uppercase">Label Kartu</label>
                      <input 
                        type="text"
                        value={statObj.label}
                        placeholder="e.g. Followers"
                        onChange={(e) => updateStatField('label', e.target.value)}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-[10px] bg-white outline-none focus:border-indigo-400 font-sans"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[9px] font-mono font-semibold text-slate-400 uppercase">Deskripsi</label>
                      <textarea 
                        value={statObj.desc}
                        rows={2}
                        placeholder="Deskripsi ringkas..."
                        onChange={(e) => updateStatField('desc', e.target.value)}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-[10px] bg-white outline-none focus:border-indigo-400 font-sans leading-tight resize-none"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* NEW: Projects Section Header Config */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mb-6">
            <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <LineChart className="w-3.5 h-3.5 text-indigo-500" /> Header Seksi Video Project
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase mb-1">Badge Atas Project</label>
                <input 
                  type="text" 
                  value={profileForm.projectsBadge || ''}
                  placeholder="e.g. CASE STUDIES"
                  onChange={(e) => setProfileForm({...profileForm, projectsBadge: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-indigo-400 outline-none transition-colors font-sans"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase mb-1">Judul Utama Project</label>
                <input 
                  type="text" 
                  value={profileForm.projectsTitle || ''}
                  placeholder="e.g. Our Recent Projects"
                  onChange={(e) => setProfileForm({...profileForm, projectsTitle: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-indigo-400 outline-none transition-colors font-sans"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase mb-1">Deskripsi Pendek Project</label>
                <input 
                  type="text" 
                  value={profileForm.projectsDescription || ''}
                  placeholder="e.g. Highly interactive design updates..."
                  onChange={(e) => setProfileForm({...profileForm, projectsDescription: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-indigo-400 outline-none transition-colors font-sans"
                />
              </div>
            </div>
          </div>

          {/* NEW: Pricing Section Header Config */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mb-6">
            <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <BarChart3 className="w-3.5 h-3.5 text-indigo-500" /> Header Seksi Rate Card
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase mb-1">Badge Atas Pricing</label>
                <input 
                  type="text" 
                  value={profileForm.pricingBadge || ''}
                  placeholder="e.g. TRANSPARENT COLLABORATION RATES"
                  onChange={(e) => setProfileForm({...profileForm, pricingBadge: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-indigo-400 outline-none transition-colors font-sans"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase mb-1">Judul Utama Pricing</label>
                <input 
                  type="text" 
                  value={profileForm.pricingTitle || ''}
                  placeholder="e.g. Placements Rate Card"
                  onChange={(e) => setProfileForm({...profileForm, pricingTitle: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-indigo-400 outline-none transition-colors font-sans"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase mb-1">Deskripsi Pendek Pricing</label>
                <input 
                  type="text" 
                  value={profileForm.pricingDescription || ''}
                  placeholder="e.g. Extremely clear and clean pricing..."
                  onChange={(e) => setProfileForm({...profileForm, pricingDescription: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-indigo-400 outline-none transition-colors font-sans"
                />
              </div>
            </div>
          </div>

          {/* NEW: Brands Section Header Config */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mb-6">
            <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Award className="w-3.5 h-3.5 text-indigo-500" /> Header Seksi Brand Collaborations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1">
                <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase mb-1">Badge Atas Brands</label>
                <input 
                  type="text" 
                  value={profileForm.brandsBadge || ''}
                  placeholder="e.g. INDUSTRY COLLABORATIONS"
                  onChange={(e) => setProfileForm({...profileForm, brandsBadge: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-indigo-400 outline-none transition-colors font-sans"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase mb-1">Judul Utama Brands</label>
                <input 
                  type="text" 
                  value={profileForm.brandsTitle || ''}
                  placeholder="e.g. Featured Brands We Worked With"
                  onChange={(e) => setProfileForm({...profileForm, brandsTitle: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-indigo-400 outline-none transition-colors font-sans"
                />
              </div>
            </div>
          </div>

          {/* NEW: Terms of Service Multi-line editor */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mb-6">
            <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" /> Syarat &amp; Ketentuan (Satu baris per Syarat)
            </h3>
            <p className="text-xs text-slate-400 mb-6">Ubah daftar S&amp;K untuk brand partner. Setiap baris baru otomatis akan menjadi bullet point checklist di halaman Ratecard.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 pb-6 border-b border-slate-50">
              <div className="col-span-1">
                <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase mb-1">Badge Atas S&K</label>
                <input 
                  type="text" 
                  value={profileForm.termsBadge || ''}
                  placeholder="e.g. TERMS OF SERVICES"
                  onChange={(e) => setProfileForm({...profileForm, termsBadge: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-indigo-400 outline-none transition-colors font-sans"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase mb-1">Judul Utama S&K</label>
                <input 
                  type="text" 
                  value={profileForm.termsTitle || ''}
                  placeholder="e.g. Syarat & Ketentuan"
                  onChange={(e) => setProfileForm({...profileForm, termsTitle: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-indigo-400 outline-none transition-colors font-sans"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase mb-1">Deskripsi Pendek S&K</label>
                <input 
                  type="text" 
                  value={profileForm.termsDescription || ''}
                  placeholder="e.g. Prosedur operasional standard..."
                  onChange={(e) => setProfileForm({...profileForm, termsDescription: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-indigo-400 outline-none transition-colors font-sans"
                />
              </div>
            </div>

            <div>
              <textarea 
                value={(profileForm.termsOfService || []).join('\n')}
                rows={8}
                onChange={(e) => {
                  const arr = e.target.value.split('\n');
                  setProfileForm({...profileForm, termsOfService: arr});
                }}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-indigo-400 outline-none transition-colors font-sans leading-relaxed"
                placeholder="Masukkan syarat & ketentuan Anda... Tekan ENTER untuk menambah baris baru."
              />
              <p className="text-[10px] text-slate-400 mt-1">Setiap baris akan ditampilkan sebagai checklist di halaman Ratecard.</p>
            </div>
          </div>

          <div className="flex justify-end pt-4 pb-6">
            <button
              type="button"
              onClick={() => saveProfile()}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer font-sans flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" /> Simpan Konfigurasi Ratecard
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. MANAGE RATEBOARD SERVICES VIEW TAB */}
      {/* ======================================================== */}
      {activeTab === 'services' && (
        <div className="space-y-6" id="tab-content-services">
          
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-md font-display font-bold text-slate-800">Daftar Layanan Ratecard</h2>
              <p className="text-xs text-slate-400">Total {services.length} jenis jasa bisnis Anda</p>
            </div>
            {!editingService && (
              <button
                onClick={triggerAddService}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer font-sans"
                id="btn-trigger-add-service"
              >
                <PlusCircle className="w-4 h-4" /> Tambah Layanan Baru
              </button>
            )}
          </div>

          {/* Collapsible Add/Edit Service form */}
          {editingService && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-inner" id="service-form-container">
              <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <PlusCircle className="w-3.5 h-3.5 text-indigo-500" />
                {isAddingService ? 'TAMBAH SERVICE BARU' : `EDIT SERVICE RATE: ${editingService.title}`}
              </h3>
              
              <form onSubmit={saveService} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase mb-1">Judul Layanan / placement</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Dedicated YouTube Video Review"
                      value={editingService.title || ''}
                      required
                      onChange={(e) => setEditingService({...editingService, title: e.target.value})}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-xs bg-white outline-none focus:border-indigo-400 font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase mb-1">Biaya Layanan</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Rp 3.500.000 atau Hubungi Email"
                      value={editingService.price || ''}
                      required
                      onChange={(e) => setEditingService({...editingService, price: e.target.value})}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-xs bg-white outline-none focus:border-indigo-400 font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase mb-1">Aesthetic Icon Representasi</label>
                    <select
                      value={editingService.icon || 'Video'}
                      onChange={(e) => setEditingService({...editingService, icon: e.target.value})}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-xs bg-white outline-none focus:border-indigo-400 font-sans"
                    >
                      <option value="Video">Video (TikTok/Instagram Shorts)</option>
                      <option value="Youtube">Youtube Logo (Dedicated)</option>
                      <option value="Instagram">Instagram Logo (Story / Feed)</option>
                      <option value="Camera">Camera (Photography)</option>
                      <option value="MessageSquare">MessageSquare (Review/Sponsorship)</option>
                      <option value="Briefcase">Briefcase (Custom Partnership)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase mb-1">Urutan Prioritas Tampil</label>
                    <input 
                      type="number" 
                      min="1"
                      value={editingService.priority || 1}
                      required
                      onChange={(e) => setEditingService({...editingService, priority: Number(e.target.value)})}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-xs bg-white outline-none focus:border-indigo-400 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase mb-1">Deskripsi & Deliverables (Rincian Jasa)</label>
                  <textarea 
                    placeholder="e.g. Durasi 30-50 detik, revisi maksimal 1 kali, posting silang Reels & TikTok, keep konten minimal 60 hari."
                    value={editingService.description || ''}
                    rows={3}
                    required
                    onChange={(e) => setEditingService({...editingService, description: e.target.value})}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-xs bg-white outline-none focus:border-indigo-400 font-sans"
                  />
                </div>

                {/* Additional Fees List Editor */}
                <div className="border border-slate-150 rounded-xl p-4 bg-slate-50 space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase">
                      Daftar Tambahan Biaya (Optional)
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const current = editingService.additionalFees || [];
                        setEditingService({
                          ...editingService,
                          additionalFees: [...current, { label: '', value: '' }]
                        });
                      }}
                      className="px-2.5 py-1 bg-indigo-50 border border-indigo-150 text-indigo-700 rounded-lg text-[10px] font-bold hover:bg-indigo-100 transition-all flex items-center gap-1 cursor-pointer select-none"
                    >
                      <PlusCircle className="w-3 h-3" /> Tambah Baris Biaya
                    </button>
                  </div>

                  <p className="text-[10px] text-slate-400">
                    Tambahkan rincian biaya tambahan secara detail (contoh label: "Tag Collaboration", nilai: "+ 100%").
                  </p>

                  {(editingService.additionalFees && editingService.additionalFees.length > 0) ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {editingService.additionalFees.map((fee, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <input
                            type="text"
                            placeholder="Nama biaya tambahan (e.g. Tag Collaboration)"
                            value={fee.label}
                            required
                            onChange={(e) => {
                              const updated = [...(editingService.additionalFees || [])];
                              updated[idx] = { ...updated[idx], label: e.target.value };
                              setEditingService({ ...editingService, additionalFees: updated });
                            }}
                            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white outline-none focus:border-indigo-400 font-sans shadow-xs"
                          />
                          <input
                            type="text"
                            placeholder="+ 100%"
                            value={fee.value}
                            required
                            onChange={(e) => {
                              const updated = [...(editingService.additionalFees || [])];
                              updated[idx] = { ...updated[idx], value: e.target.value };
                              setEditingService({ ...editingService, additionalFees: updated });
                            }}
                            className="w-28 px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono bg-white outline-none focus:border-indigo-400 text-right shadow-xs"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (editingService.additionalFees || []).filter((_, fIdx) => fIdx !== idx);
                              setEditingService({ ...editingService, additionalFees: updated });
                            }}
                            className="p-2 text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-lg border border-transparent hover:border-rose-100 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[10px] text-slate-400 text-center py-2 bg-white rounded-lg border border-slate-150 italic font-mono shadow-xs">
                      Belum ada tambahan biaya diatur. Klik "Tambah Baris Biaya" untuk memulai.
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input 
                    type="checkbox" 
                    id="serviceIsActive"
                    checked={editingService.isActive !== false}
                    onChange={(e) => setEditingService({...editingService, isActive: e.target.checked})}
                    className="rounded border-slate-300 text-indigo-650 focus:ring-indigo-500 w-4.5 h-4.5"
                  />
                  <label htmlFor="serviceIsActive" className="text-xs font-semibold text-slate-650">Aktif - Tampilkan Pada Ratecard Publik</label>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-slate-150">
                  <button
                    type="button"
                    onClick={() => { setEditingService(null); setIsAddingService(false); }}
                    className="px-4 py-2 border border-slate-250 rounded-lg text-xs text-slate-500 hover:bg-slate-100 transition-colors font-sans"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors font-sans flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" /> Simpan Layanan
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List display of Services */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden" id="admin-services-list">
            <div className="divide-y divide-slate-100">
              {services.length > 0 ? (
                services.map((service) => (
                  <div 
                    key={service.id}
                    className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/25 transition-colors ${
                      !service.isActive ? 'opacity-65 bg-slate-55' : ''
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono bg-slate-100 border px-2 py-0.5 rounded text-slate-550 uppercase">
                          Icon: {service.icon}
                        </span>
                        <span className="text-[10px] font-mono text-slate-450">
                          Priority: {service.priority}
                        </span>
                        {!service.isActive && (
                          <span className="text-[10px] bg-red-50 text-red-600 font-mono px-2 py-0.5 rounded-md">
                            Draft (Hidden)
                          </span>
                        )}
                      </div>
                      <h3 className="font-display font-bold text-slate-800 text-sm md:text-md mt-1">
                        {service.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{service.description}</p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3.5 shrink-0 border-t sm:border-transparent pt-3 sm:pt-0">
                      <span className="text-sm font-display font-black text-indigo-600">
                        {service.price}
                      </span>
                      
                      <div className="flex gap-1.5">
                        <button 
                          onClick={() => triggerEditService(service)}
                          className="p-2 text-slate-450 hover:text-indigo-650 bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit Service"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => deleteService(service.id)}
                          className="p-2 text-slate-450 hover:text-red-650 bg-slate-50 hover:bg-red-50 border border-slate-100 hover:border-red-100 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Service"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Belum ada layanan ratecard terdaftar. Klik tombol diatas untuk menambahkan.
                </div>
              )}
            </div>
          </div>
        </div>
      )}


      {/* ======================================================== */}
      {/* 3. MANAGE RATEBOARD PROFILE INFO VIEW TAB */}
      {/* ======================================================== */}
      {activeTab === 'profile' && (
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm" id="tab-content-profile">
          <div className="mb-6">
            <h2 className="text-md font-display font-bold text-slate-800">Informasi Profil Pembuat Konten</h2>
            <p className="text-xs text-slate-400">Informasi ini akan langsung sinkron pada halaman utama Linktree dan Ratecard Anda.</p>
          </div>

          <form onSubmit={saveProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase mb-1">Nama Kreator</label>
                <input 
                  type="text" 
                  value={profileForm.name}
                  required
                  onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-indigo-400 outline-none transition-colors font-sans"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase mb-1">Email Profesional</label>
                <input 
                  type="email" 
                  value={profileForm.email}
                  required
                  onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-indigo-400 outline-none transition-colors font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase mb-1">Deskripsi Singkat / Bio</label>
              <textarea 
                value={profileForm.bio}
                required
                rows={3}
                onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-indigo-400 outline-none transition-colors font-sans leading-relaxed"
              />
            </div>

             <div>
              <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase mb-1">Avatar Foto Profil</label>
              <div className="flex gap-2 items-center">
                <input 
                  type="text" 
                  value={profileForm.avatarUrl}
                  required
                  onChange={(e) => setProfileForm({...profileForm, avatarUrl: e.target.value})}
                  className="flex-1 px-3 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-indigo-400 outline-none transition-colors font-mono"
                  placeholder="URL gambar atau Unggah file..."
                />
                <label className="px-3.5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-xs font-bold cursor-pointer transition-colors shrink-0 text-center select-none">
                  {isUploading['avatarUrl'] ? 'Uploading...' : 'Unggah File'}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => handleFileUpload(e, 'avatarUrl')} 
                    className="hidden" 
                  />
                </label>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Gunakan link gambar eksternal atau klik "Unggah File" untuk meng-host gambar langsung di server Anda.</p>
            </div>

            <div className="border-t border-slate-100 pt-5 mt-6">
              <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Share2 className="w-3.5 h-3.5 text-indigo-500" /> Link Sosial Media
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase mb-1">URL Instagram</label>
                  <input 
                    type="url" 
                    value={profileForm.instagram}
                    onChange={(e) => setProfileForm({...profileForm, instagram: e.target.value})}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-indigo-400 outline-none transition-colors font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase mb-1">URL TikTok</label>
                  <input 
                    type="url" 
                    value={profileForm.tiktok}
                    onChange={(e) => setProfileForm({...profileForm, tiktok: e.target.value})}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-indigo-400 outline-none transition-colors font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase mb-1">URL YouTube</label>
                  <input 
                    type="url" 
                    value={profileForm.youtube}
                    onChange={(e) => setProfileForm({...profileForm, youtube: e.target.value})}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-indigo-400 outline-none transition-colors font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase mb-1">Link WhatsApp</label>
                  <input 
                    type="url" 
                    placeholder="https://wa.me/62812345678"
                    value={profileForm.whatsapp || ''}
                    onChange={(e) => setProfileForm({...profileForm, whatsapp: e.target.value})}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-indigo-400 outline-none transition-colors font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-slate-100 mt-6">
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors font-sans flex items-center gap-1.5 cursor-pointer"
                id="btn-save-profile"
              >
                <Save className="w-4 h-4" /> Simpan Perubahan Profil &amp; Ratecard
              </button>
            </div>
          </form>
        </div>
      )}


      {/* ======================================================== */}
      {/* 4. MANAGE RECENT PROJECTS VIEW TAB (VIRAL VIDEOS) */}
      {/* ======================================================== */}
      {activeTab === 'projects' && (
        <div className="space-y-6" id="tab-content-projects">
          
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-md font-display font-bold text-slate-800">Daftar Viral Videos (Instagram Projects)</h2>
              <p className="text-xs text-slate-400">Total {projects.length} video project terdaftar pada ratecard publik</p>
            </div>
            {!editingProject && (
              <button
                onClick={triggerAddProject}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer font-sans"
                id="btn-trigger-add-project"
              >
                <Plus className="w-4 h-4" /> Tambah Video Baru
              </button>
            )}
          </div>

          {/* New/Edit Project Form Overlay */}
          {editingProject && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-inner" id="project-form-container">
              <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <PlusCircle className="w-3.5 h-3.5 text-indigo-500" />
                {isAddingProject ? 'TAMBAH VIDEO PROJECT BARU' : `EDIT VIDEO: ${editingProject.title}`}
              </h3>

              <form onSubmit={saveProject} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase mb-1">Judul Utama Konten</label>
                    <input 
                      type="text" 
                      placeholder="e.g. PASANG AC TANPA"
                      value={editingProject.title || ''}
                      required
                      onChange={(e) => setEditingProject({...editingProject, title: e.target.value})}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-xs bg-white outline-none focus:border-indigo-400 font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase mb-1">Highlight Kuning (Gaya PDF)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. bobok tembok"
                      value={editingProject.highlight || ''}
                      onChange={(e) => setEditingProject({...editingProject, highlight: e.target.value})}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-xs bg-white outline-none focus:border-indigo-400 font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase mb-1">Jumlah Views (Tampil Khas PDF)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 1.3M atau 500K"
                      value={editingProject.views || ''}
                      required
                      onChange={(e) => setEditingProject({...editingProject, views: e.target.value})}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-xs bg-white outline-none focus:border-indigo-400 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase mb-1">Kategori Konten</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Room Upgrade / Aesthetic"
                      value={editingProject.category || ''}
                      required
                      onChange={(e) => setEditingProject({...editingProject, category: e.target.value})}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-xs bg-white outline-none focus:border-indigo-400 font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase mb-1">URL Instagram Reel / Post</label>
                    <input 
                      type="url" 
                      placeholder="https://instagram.com/p/..."
                      value={editingProject.url || ''}
                      required
                      onChange={(e) => setEditingProject({...editingProject, url: e.target.value})}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-xs bg-white outline-none focus:border-indigo-400 font-mono"
                    />
                  </div>
                </div>

                 <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase mb-1">Cover Image Video / Case Study (Bila Kosong, Ada Default Aesthetic Unsplash)</label>
                  <div className="flex gap-2 items-center">
                    <input 
                      type="text" 
                      placeholder="https://images.unsplash.com/photo-..."
                      value={editingProject.imageUrl || ''}
                      onChange={(e) => setEditingProject({...editingProject, imageUrl: e.target.value})}
                      className="flex-1 px-3 py-2.5 border border-slate-200 rounded-lg text-xs bg-white outline-none focus:border-indigo-400 font-mono"
                    />
                    <label className="px-3.5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-xs font-bold cursor-pointer transition-colors shrink-0 text-center select-none">
                      {isUploading['project'] ? 'Uploading...' : 'Unggah File'}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleFileUpload(e, 'project')} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-slate-150">
                  <button
                    type="button"
                    onClick={() => { setEditingProject(null); setIsAddingProject(false); }}
                    className="px-4 py-2 border border-slate-250 rounded-lg text-xs text-slate-500 hover:bg-slate-100 transition-colors font-sans"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors font-sans flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" /> Simpan Video
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Grid display of Video Projects */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden" id="admin-projects-list">
            <div className="divide-y divide-slate-100">
              {projects && projects.length > 0 ? (
                projects.map((proj) => (
                  <div 
                    key={proj.id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-55 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {proj.imageUrl && (
                        <img 
                          src={proj.imageUrl} 
                          alt="Thumbnail preview" 
                          className="w-12 h-16 rounded-lg object-cover bg-slate-100 border invisible sm:visible shrink-0" 
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-mono bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded text-indigo-700 uppercase">
                            {proj.category}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                            ✨ {proj.views} Views
                          </span>
                        </div>
                        <h3 className="font-display font-bold text-slate-800 text-sm mt-1.5 leading-snug">
                          {proj.title} <span className="text-indigo-600 underline font-mono">{proj.highlight}</span>
                        </h3>
                        <a 
                          href={proj.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-[10px] text-slate-400 hover:text-indigo-600 flex items-center gap-1.5 mt-1 font-mono hover:underline"
                        >
                          Instagram Post Link <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <button 
                        onClick={() => triggerEditProject(proj)}
                        className="p-2 text-slate-450 hover:text-indigo-650 bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 rounded-lg transition-colors cursor-pointer"
                        title="Edit Video"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => deleteProject(proj.id)}
                        className="p-2 text-slate-450 hover:text-red-650 bg-slate-50 hover:bg-red-50 border border-slate-100 hover:border-red-100 rounded-lg transition-colors cursor-pointer"
                        title="Hapus Video"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Belum ada video Instagram terdaftar. Klik 'Tambah Video Baru' diatas untuk mengisi.
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* 4.5. MANAGE BRANDS & LOGOS TAB */}
      {/* ======================================================== */}
      {activeTab === 'brands' && (
        <div className="space-y-6" id="tab-content-brands">
          <div className="flex justify-between items-center bg-slate-50 border border-slate-100 rounded-3xl p-6 shadow-xs flex-col sm:flex-row gap-4">
            <div>
              <h2 className="text-md font-display font-bold text-slate-800">Daftar Brand &amp; Kolaborasi Industri</h2>
              <p className="text-xs text-slate-400">Atur logo brand-brand ternama yang bekerjasama dengan Anda pada halaman Ratecard.</p>
            </div>
            <button 
              onClick={triggerAddBrand}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs select-none"
              id="btn-add-brand"
            >
              <PlusCircle className="w-4 h-4" /> Tambah Brand Baru
            </button>
          </div>

          {/* Form to edit or add brand inline */}
          {editingBrand && (
            <div className="bg-slate-50 border border-indigo-100 rounded-3xl p-6 shadow-xs animate-fadeIn" id="form-brand-editor">
              <h3 className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest mb-4">
                {isAddingBrand ? 'Tambah Brand Baru' : 'Edit Detail Brand'}
              </h3>
              <form onSubmit={saveBrand} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase mb-1">Nama Brand</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. IKEA, BOSE, Samsung"
                      value={editingBrand.name || ''}
                      onChange={(e) => setEditingBrand({...editingBrand, name: e.target.value})}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-xs bg-white outline-none focus:border-indigo-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase mb-1">Prioritas Urutan (Kecil = Tampil Pertama)</label>
                    <input 
                      type="number" 
                      required
                      min={1}
                      placeholder="e.g. 1, 2, 3..."
                      value={editingBrand.priority || 1}
                      onChange={(e) => setEditingBrand({...editingBrand, priority: Number(e.target.value)})}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-xs bg-white outline-none focus:border-indigo-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase mb-1">Logo Brand (Kosongkan jika ingin memakai fallback SVG visual bawaan)</label>
                  <div className="flex gap-2 items-center">
                    <input 
                      type="text" 
                      placeholder="https://images.unsplash.com/photo-... atau url gambar transparan"
                      value={editingBrand.logoUrl || ''}
                      onChange={(e) => setEditingBrand({...editingBrand, logoUrl: e.target.value})}
                      className="flex-1 px-3 py-2.5 border border-slate-200 rounded-lg text-xs bg-white outline-none focus:border-indigo-400 font-mono"
                    />
                    <label className="px-3.5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-xs font-bold cursor-pointer transition-colors shrink-0 text-center select-none">
                      {isUploading['brand'] ? 'Uploading...' : 'Unggah File'}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleFileUpload(e, 'brand')} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Format gambar transparan (.png / .svg) dengan warna kontras terang sangat direkomendasikan untuk tema gelap Ratecard.
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input 
                    type="checkbox" 
                    id="brand-active" 
                    checked={editingBrand.isActive !== false}
                    onChange={(e) => setEditingBrand({...editingBrand, isActive: e.target.checked})}
                    className="w-3.5 h-3.5 accent-indigo-600"
                  />
                  <label htmlFor="brand-active" className="text-xs text-slate-600 font-semibold cursor-pointer">Tampilkan Brand ini pada halaman utama Ratecard</label>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => { setEditingBrand(null); setIsAddingBrand(false); }}
                    className="px-4 py-2 border border-slate-200 rounded-lg text-xs text-slate-500 hover:bg-slate-100 transition-colors font-sans"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors font-sans flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" /> Simpan Brand
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Grid list display of Collaborating Brands */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden" id="admin-brands-list">
            <div className="divide-y divide-slate-100">
              {brands && brands.length > 0 ? (
                brands
                  .sort((a, b) => (a.priority || 0) - (b.priority || 0))
                  .map((brand) => (
                    <div 
                      key={brand.id}
                      className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center p-2 shrink-0">
                          {brand.logoUrl ? (
                            <img 
                              src={brand.logoUrl} 
                              alt={brand.name} 
                              className="max-h-full max-w-full object-contain filter brightness-110" 
                            />
                          ) : (
                            <div className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-tighter truncate w-full text-center">
                              {brand.name}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-mono bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded text-indigo-700 uppercase">
                              Prioritas: {brand.priority || 1}
                            </span>
                            {brand.isActive !== false ? (
                              <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                                ● Aktif
                              </span>
                            ) : (
                              <span className="text-[10px] font-mono text-slate-400 font-bold bg-slate-100 px-2 py-0.5 rounded">
                                Nonaktif
                              </span>
                            )}
                          </div>
                          <h3 className="font-display font-bold text-slate-800 text-sm mt-1.5 leading-snug">
                            {brand.name}
                          </h3>
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end">
                        <button 
                          onClick={() => triggerEditBrand(brand)}
                          className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit Brand"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => deleteBrand(brand.id)}
                          className="p-2 text-slate-400 hover:text-red-600 bg-slate-50 hover:bg-red-50 border border-slate-100 hover:border-red-100 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Brand"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  ))
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Belum ada brand terdaftar. Klik 'Tambah Brand Baru' diatas untuk mengisi.
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {activeTab === 'backup' && (
        <div className="space-y-6" id="tab-content-backup">
          
          {/* Informational Hero Card */}
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono bg-indigo-50 border border-indigo-150 px-2.5 py-1 rounded text-indigo-700 uppercase font-black tracking-wider">
                Sistem Backup Terpadu (JSON)
              </span>
              <h2 className="text-base font-display font-medium text-slate-800 mt-2">
                Simpan &amp; Pulihkan Data Anda Kapan Saja
              </h2>
              <p className="text-xs text-slate-400 max-w-xl">
                Fitur ini membantu Anda mengekspor semua link, detail ratecard, daftar harga jasa, dan showcase video Instagram menjadi satu berkas JSON. Berkas ini berfungsi sebagai cadangan jika sistem di-update atau disetel ulang.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 1. EXPORT CONTAINER */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
                  <Download className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-display font-bold text-slate-800 flex items-center gap-2">
                  <Download className="w-4 h-4 text-indigo-500" /> Ekspor/Unduh Backup
                </h3>
                <p className="text-xs text-slate-400 mt-1 mb-6 leading-relaxed">
                  Cadangkan seluruh data yang telah Anda edit ke dalam file komputer lokal Anda. Berkas ini dapat digunakan sewaktu-waktu jika database website terhapus atau dideploy ulang.
                </p>

                {/* Database Metrics Preview for Extra Quality Assurance */}
                <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100 divide-y divide-slate-150 text-xs text-slate-700">
                  <div className="py-1.5 flex justify-between font-mono">
                    <span className="text-slate-400">Total Links:</span>
                    <span className="font-bold text-slate-800">{links?.length || 0}</span>
                  </div>
                  <div className="py-1.5 flex justify-between font-mono">
                    <span className="text-slate-400">Total Services:</span>
                    <span className="font-bold text-slate-800">{services?.length || 0}</span>
                  </div>
                  <div className="py-1.5 flex justify-between font-mono">
                    <span className="text-slate-400">Total Videos Showcase:</span>
                    <span className="font-bold text-slate-800">{projects?.length || 0}</span>
                  </div>
                  <div className="py-1.5 flex justify-between font-mono">
                    <span className="text-slate-400">Nama Profil:</span>
                    <span className="font-bold text-slate-800">{profile?.name || 'Your Name'}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleExportDatabase}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer font-sans"
              >
                <Download className="w-4 h-4" /> Ekspor &amp; Unduh Berkas JSON Backup
              </button>
            </div>

            {/* 2. IMPORT CONTAINER */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 mb-4">
                  <Upload className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-display font-bold text-slate-800 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-indigo-500" /> Impor/Pulihkan Backup
                </h3>
                <p className="text-xs text-slate-400 mt-1 mb-6 leading-relaxed">
                  Unggah berkas backup `.json` yang telah Anda ekspor sebelumnya untuk memulihkan semua links dan layout ratecard Anda. Tindakan ini akan sepenuhnya MENIMPA database saat ini.
                </p>

                {/* File picker drop area */}
                <div className="border-2 border-dashed border-slate-200 hover:border-indigo-300 transition-colors rounded-2xl p-5 text-center relative bg-slate-50 mb-4">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleBackupFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="text-xs text-slate-500 font-sans">
                    <Database className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                    {importFileName ? (
                      <span className="font-bold text-indigo-600">{importFileName}</span>
                    ) : (
                      <span>Klik atau seret file `.json` hasil backup Anda ke sini</span>
                    )}
                  </div>
                </div>

                {/* Import File Contents Preview Verification */}
                {importFileContent && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs space-y-2 mb-4">
                    <p className="font-semibold text-amber-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Berkas Terbaca &amp; Siap Dipulihkan:
                    </p>
                    <div className="text-[11px] text-amber-700 space-y-1 font-mono">
                      <div>• Profil: {importFileContent.profile?.name || 'Kosong'}</div>
                      <div>• Affiliate Links: {importFileContent.links?.length || 0} items</div>
                      <div>• Ratecard Services: {importFileContent.services?.length || 0} items</div>
                      <div>• Videos Showcase: {importFileContent.projects?.length || 0} items</div>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleImportDatabase}
                disabled={!importFileContent || isImporting}
                className={`w-full py-3 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-2 font-sans ${
                  importFileContent && !isImporting
                    ? 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
                    : 'bg-slate-300 cursor-not-allowed opacity-75'
                }`}
              >
                {isImporting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                {isImporting ? 'Memulihkan Data...' : 'Pulihkan Sekarang (Terapkan Backup)'}
              </button>
            </div>

          </div>

          {/* 💻 Cadangan Lokal Komputer (Ekspor / Impor Berkas ZIP) */}
          <div className="mt-8 pt-8 border-t border-slate-150 space-y-4">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-600" />
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider font-mono flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-indigo-500" /> Cadangan Lokal Komputer (Ekspor / Impor Berkas ZIP)
              </h3>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Gunakan panel ini untuk mengunduh seluruh data portofolio (file database <code className="bg-slate-100 px-1 rounded font-normal text-slate-600">db.json</code> beserta seluruh media gambar yang telah terunggah) ke dalam satu file ZIP di komputer Anda. Anda juga bisa mengunggah kembali file ZIP tersebut untuk memulihkan seluruh portfolio secara instan.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Export ZIP to PC */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 mb-4">
                    <Download className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-display font-bold text-slate-800 flex items-center gap-2">
                    <FileArchive className="w-4 h-4 text-indigo-500" /> Unduh Cadangan Lengkap ke Komputer (.zip)
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 mb-6 leading-relaxed">
                    Mendownload bundel data utuh berisi database serta seluruh berkas gambar yang tersimpan ke dalam komputer Anda dalam satu folder berkas ZIP yang aman dan lengkap.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isExportingPCZip || isImportingPCZip}
                  onClick={handleExportZipToPC}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer font-sans"
                >
                  {isExportingPCZip ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Menyiapkan Berkas ZIP...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Unduh Cadangan ZIP ke PC
                    </>
                  )}
                </button>
              </div>

              {/* Import ZIP from PC */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
                    <Upload className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-display font-bold text-slate-800 flex items-center gap-2">
                    <UploadCloud className="w-4 h-4 text-indigo-500" /> Unggah &amp; Pulihkan Cadangan ZIP dari Komputer
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 mb-6 leading-relaxed">
                    Pilih file ZIP cadangan dari komputer Anda untuk memulihkan seluruh database dan meregenerasi file gambar-gambar di server Anda secara instan.
                  </p>
                </div>
                <label className={`w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer font-sans text-center select-none ${
                  (isExportingPCZip || isImportingPCZip) ? 'opacity-50 pointer-events-none' : ''
                }`}>
                  {isImportingPCZip ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Memulihkan Berkas ZIP...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Pilih & Unggah File ZIP PC
                    </>
                  )}
                  <input
                    type="file"
                    accept=".zip"
                    disabled={isExportingPCZip || isImportingPCZip}
                    onChange={handleImportZipFromPC}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Sync / ZIP status indicator */}
            {githubSyncStatus.type && (
              <div className={`p-4 rounded-xl border text-xs leading-relaxed transition-all mt-3 ${
                githubSyncStatus.type === 'success' 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : githubSyncStatus.type === 'error'
                    ? 'bg-rose-50 border-rose-200 text-rose-800'
                    : 'bg-indigo-50 border-indigo-200 text-indigo-800 animate-pulse'
              }`}>
                <div className="flex gap-2 items-start font-sans">
                  <span className="font-bold shrink-0">
                    {githubSyncStatus.type === 'success' ? '✓ SUKSES:' : githubSyncStatus.type === 'error' ? '✗ GAGAL:' : '⚡ PROSES:'}
                  </span>
                  <span>{githubSyncStatus.message}</span>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {activeTab === 'design' && (
        <div className="space-y-6" id="design-tab-content">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
               <div>
                 <h3 className="text-xl font-display font-bold text-slate-800 flex items-center gap-2">
                   <Settings2 className="w-6 h-6 text-indigo-500" /> Pengaturan Tampilan
                 </h3>
                 <p className="text-xs text-slate-400">Sesuaikan warna dan tema Linktree Anda secara real-time.</p>
               </div>
            </div>
            <DesignSettingsForm profile={profileForm} onSave={(newProfile) => { 
                setProfileForm(newProfile); 
                saveProfile(undefined, newProfile); 
            }} />
          </div>
        </div>
      )}

      {activeTab === 'github' && (
        <div className="space-y-6" id="tab-content-github">
          
          {/* Informational Hero Card */}
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono bg-indigo-50 border border-indigo-150 px-2.5 py-1 rounded text-indigo-700 uppercase font-black tracking-wider">
                GitHub Storage Cloud Sync (Permanent)
              </span>
              <h2 className="text-base font-display font-medium text-slate-800 mt-2">
                Simpan Gambar Hasil Upload secara Permanen di GitHub
              </h2>
              <p className="text-xs text-slate-400 max-w-xl">
                Karena server website berjalan pada container cloud yang bersifat sementara (ephemeral), file gambar yang diupload ke server lokal akan hilang otomatis ketika server melakukan restart atau update code. <strong className="text-slate-600">Integrasi GitHub</strong> mengatasi ini dengan langsung mengirimkan file gambar hasil upload Anda ke repository GitHub pribadi/publik Anda, sehingga gambar memiliki link absolut permanen dan tidak akan pernah hilang.
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xs">
            <form onSubmit={async (e) => {
              e.preventDefault();
              setIsSavingGithub(true);
              try {
                const resp = await fetch('/api/github/settings', {
                  method: 'POST',
                  headers: getAuthHeader(),
                  body: JSON.stringify(githubSettings)
                });
                const data = await resp.json();
                if (data.success) {
                  showToast('Pengaturan GitHub Storage berhasil disimpan!');
                  fetchGithubSettings();
                } else {
                  showToast(data.message || 'Gagal menyimpan pengaturan.', 'error');
                }
              } catch (err: any) {
                showToast('Koneksi ke backend bermasalah: ' + err.message, 'error');
              } finally {
                setIsSavingGithub(false);
              }
            }} className="space-y-6">
              
              <div className="flex items-center justify-between p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                <div>
                  <h3 className="text-xs font-bold font-mono text-slate-600 uppercase flex items-center gap-2">
                    <Target className="w-3.5 h-3.5 text-indigo-500" /> Status Fitur
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Aktifkan untuk mulai mengupload gambar ke GitHub secara langsung</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={githubSettings.enabled}
                    onChange={(e) => setGithubSettings({ ...githubSettings, enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase">
                    GitHub Personal Access Token (PAT)
                  </label>
                  <input
                    type="password"
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    required={githubSettings.enabled}
                    value={githubSettings.token}
                    onChange={(e) => setGithubSettings({ ...githubSettings, token: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white outline-none focus:border-indigo-400 font-mono transition-colors"
                  />
                  <p className="text-[10px] text-slate-400">
                    Gunakan token GitHub (Classic) dengan scope <code className="bg-slate-100 px-1 py-0.5 rounded">repo</code> untuk memberikan akses modifikasi file.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase">
                    Repository Owner Username (GitHub Username)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. your-github-username"
                    required={githubSettings.enabled}
                    value={githubSettings.owner}
                    onChange={(e) => setGithubSettings({ ...githubSettings, owner: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white outline-none focus:border-indigo-400 transition-colors"
                  />
                  <p className="text-[10px] text-slate-400">
                    Nama akun/username GitHub Anda.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase">
                    Repository Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. portfolio-assets"
                    required={githubSettings.enabled}
                    value={githubSettings.repo}
                    onChange={(e) => setGithubSettings({ ...githubSettings, repo: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white outline-none focus:border-indigo-400 transition-colors"
                  />
                  <p className="text-[10px] text-slate-400">
                    Nama repository tempat menyimpan file. Pastikan repository ini sudah dibuat terlebih dahulu di GitHub Anda.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase">
                    Branch Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. main"
                    value={githubSettings.branch}
                    onChange={(e) => setGithubSettings({ ...githubSettings, branch: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white outline-none focus:border-indigo-400 font-mono transition-colors"
                  />
                  <p className="text-[10px] text-slate-400">
                    Nama target cabang/branch (biasanya <code className="bg-slate-100 px-1 py-0.5 rounded">main</code> atau <code className="bg-slate-100 px-1 py-0.5 rounded">master</code>).
                  </p>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase">
                    Upload Folder Path
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. uploads (or leave empty)"
                    value={githubSettings.path}
                    onChange={(e) => setGithubSettings({ ...githubSettings, path: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white outline-none focus:border-indigo-400 font-mono transition-colors"
                  />
                  <p className="text-[10px] text-slate-400">
                    Direktori/jalur penyimpanan folder di dalam repository (misalnya <code className="bg-slate-100 px-1 py-0.5 rounded">uploads</code> atau <code className="bg-slate-100 px-1 py-0.5 rounded">assets/images</code>).
                  </p>
                </div>
              </div>

              {/* Action Buttons for GitHub Config */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-150">
                <button
                  type="submit"
                  disabled={isSavingGithub}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-750 text-white rounded-xl text-xs font-semibold shadow-xs disabled:opacity-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSavingGithub ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Simpan Pengaturan GitHub
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setTestStatus({ message: 'Sedang menguji koneksi (mengirim berkas percobaan)...', type: 'loading' });
                    try {
                      const resp = await fetch('/api/github/test', {
                        method: 'POST',
                        headers: getAuthHeader(),
                        body: JSON.stringify(githubSettings)
                      });
                      const data = await resp.json();
                      if (data.success) {
                        setTestStatus({ message: data.message, type: 'success' });
                      } else {
                        setTestStatus({ message: data.message || 'Gagal menghubungkan ke GitHub. Silakan periksa kredensial Anda.', type: 'error' });
                      }
                    } catch (e: any) {
                      setTestStatus({ message: 'Gagal menghubungi server untuk pengujian: ' + e.message, type: 'error' });
                    }
                  }}
                  disabled={testStatus.type === 'loading'}
                  className="px-5 py-3 bg-slate-100 hover:bg-slate-150 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer select-none"
                >
                  {testStatus.type === 'loading' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-indigo-500" />}
                  Uji Koneksi (Test Sync)
                </button>
              </div>

              {/* Status Indicator Feedback */}
              {testStatus.type && (
                <div className={`p-4 rounded-2xl border text-xs leading-relaxed transition-all ${
                  testStatus.type === 'success' 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : testStatus.type === 'error'
                      ? 'bg-rose-50 border-rose-200 text-rose-800'
                      : 'bg-slate-50 border-slate-200 text-slate-600 animate-pulse'
                }`}>
                  <div className="flex gap-2 items-start font-sans">
                    <span className="font-bold uppercase tracking-wide shrink-0">
                      [{testStatus.type === 'success' ? 'SUKSES' : testStatus.type === 'error' ? 'GAGAL' : 'MENGUJI'}]
                    </span>
                    <span>{testStatus.message}</span>
                  </div>
                </div>
              )}

          </form>
        </div>
      </div>
    )}

    {activeTab === 'analytics' && (() => {
      const now = new Date();
      const getStartOfDay = (d: Date) => {
        const res = new Date(d);
        res.setHours(0, 0, 0, 0);
        return res;
      };
      const getEndOfDay = (d: Date) => {
        const res = new Date(d);
        res.setHours(23, 59, 59, 999);
        return res;
      };
      
      let currentStart = new Date();
      let currentEnd = new Date();
      let prevStart = new Date();
      let prevEnd = new Date();
      let dateLabel = '';
      
      if (analyticsTimeRange === 'today') {
        currentStart = getStartOfDay(now);
        currentEnd = getEndOfDay(now);
        
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        prevStart = getStartOfDay(yesterday);
        prevEnd = getEndOfDay(yesterday);
        
        dateLabel = now.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
      } else if (analyticsTimeRange === 'yesterday') {
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        currentStart = getStartOfDay(yesterday);
        currentEnd = getEndOfDay(yesterday);
        
        const twoDaysAgo = new Date(now);
        twoDaysAgo.setDate(now.getDate() - 2);
        prevStart = getStartOfDay(twoDaysAgo);
        prevEnd = getEndOfDay(twoDaysAgo);
        
        dateLabel = yesterday.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
      } else if (analyticsTimeRange === '7days') {
        currentEnd = getEndOfDay(now);
        currentStart = getStartOfDay(now);
        currentStart.setDate(now.getDate() - 6);
        
        prevEnd = new Date(currentStart);
        prevEnd.setMilliseconds(prevEnd.getMilliseconds() - 1);
        prevStart = new Date(prevEnd);
        prevStart.setDate(prevStart.getDate() - 6);
        
        const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' };
        dateLabel = `${currentStart.toLocaleDateString('id-ID', options)} - ${currentEnd.toLocaleDateString('id-ID', options)}`;
      } else {
        // 30days
        currentEnd = getEndOfDay(now);
        currentStart = getStartOfDay(now);
        currentStart.setDate(now.getDate() - 29);
        
        prevEnd = new Date(currentStart);
        prevEnd.setMilliseconds(prevEnd.getMilliseconds() - 1);
        prevStart = new Date(prevEnd);
        prevStart.setDate(prevStart.getDate() - 29);
        
        const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' };
        dateLabel = `${currentStart.toLocaleDateString('id-ID', options)} - ${currentEnd.toLocaleDateString('id-ID', options)}`;
      }
      
      const sourceFilter = (log: ClickLog) => {
        const link = links.find(l => l.id === log.linkId);
        if (!link) return false;
        if (analyticsSource === 'shopee') {
          return link.category.toLowerCase() === 'shopee';
        }
        if (analyticsSource === 'medsos') {
          return link.category.toLowerCase() !== 'shopee';
        }
        return true;
      };
      
      const currentLogs = clickLogs.filter(log => {
        const logTime = new Date(log.timestamp);
        return logTime >= currentStart && logTime <= currentEnd && sourceFilter(log);
      });
      
      const prevLogs = clickLogs.filter(log => {
        const logTime = new Date(log.timestamp);
        return logTime >= prevStart && logTime <= prevEnd && sourceFilter(log);
      });
      
      const totalClicks = currentLogs.length;
      const prevClicks = prevLogs.length;
      
      const percentChange = prevClicks > 0 
        ? Math.round(((totalClicks - prevClicks) / prevClicks) * 100)
        : totalClicks > 0 ? 100 : 0;
      const trendSymbol = percentChange >= 0 ? '+' : '';
      const trendColor = percentChange > 0 
        ? 'text-emerald-500 font-extrabold' 
        : percentChange < 0 
          ? 'text-rose-500 font-extrabold' 
          : 'text-slate-400 font-bold';
          
      let avgDailyClicks = totalClicks.toString();
      if (analyticsTimeRange === '7days') {
        avgDailyClicks = (totalClicks / 7).toFixed(1);
      } else if (analyticsTimeRange === '30days') {
        avgDailyClicks = (totalClicks / 30).toFixed(1);
      }
      
      const freq: Record<string, number> = {};
      currentLogs.forEach(l => {
        freq[l.linkId] = (freq[l.linkId] || 0) + 1;
      });
      let topLinkId = '';
      let topLinkCount = 0;
      Object.entries(freq).forEach(([id, count]) => {
        if (count > topLinkCount) {
          topLinkCount = count;
          topLinkId = id;
        }
      });
      const topLink = links.find(l => l.id === topLinkId);
      const topLinkContribution = totalClicks > 0 && topLinkCount > 0
        ? Math.round((topLinkCount / totalClicks) * 100)
        : 0;

      let chartData: Array<{ name: string; klik: number }> = [];
      if (analyticsTimeRange === 'today' || analyticsTimeRange === 'yesterday') {
        const hours = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
        const bucketCounts = [0, 0, 0, 0, 0, 0, 0, 0];
        
        currentLogs.forEach(log => {
          const logTime = new Date(log.timestamp);
          const hr = logTime.getHours();
          const index = Math.min(Math.floor(hr / 3), 7);
          bucketCounts[index]++;
        });
        
        chartData = hours.map((name, i) => ({
          name,
          klik: bucketCounts[i]
        }));
      } else {
        const dayCount = analyticsTimeRange === '7days' ? 7 : 30;
        const days = [];
        const bucketCounts = Array(dayCount).fill(0);
        
        for (let i = dayCount - 1; i >= 0; i--) {
          const d = new Date(currentEnd);
          d.setDate(currentEnd.getDate() - i);
          days.push(d);
        }
        
        currentLogs.forEach(log => {
          const logTime = new Date(log.timestamp);
          const dayDiff = Math.floor((logTime.getTime() - getStartOfDay(days[0]).getTime()) / (1000 * 60 * 60 * 24));
          if (dayDiff >= 0 && dayDiff < dayCount) {
            bucketCounts[dayDiff]++;
          }
        });
        
        chartData = days.map((day, i) => ({
          name: day.toLocaleDateString('id-ID', { day: '2-digit', month: 'numeric' }),
          klik: bucketCounts[i]
        }));
      }

      const rankedLinksList = links
        .map(link => {
          const clicksInRange = currentLogs.filter(log => log.linkId === link.id).length;
          return {
            ...link,
            clicksInRange
          };
        })
        .filter(link => {
          if (analyticsSource === 'shopee') return link.category.toLowerCase() === 'shopee';
          if (analyticsSource === 'medsos') return link.category.toLowerCase() !== 'shopee';
          return true;
        })
        .sort((a, b) => b.clicksInRange - a.clicksInRange);

      return (
        <div className="space-y-6" id="tab-content-analytics">
          
          <div className="border-b border-slate-100 bg-white rounded-3xl p-3 md:p-4 shadow-3xs flex flex-wrap gap-2 text-xs font-sans">
            <button
              type="button"
              onClick={() => setAnalyticsSource('all')}
              className={`px-4 py-2 font-bold cursor-pointer transition-colors rounded-xl select-none ${
                analyticsSource === 'all' ? 'bg-indigo-600 text-white font-extrabold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              Semua
            </button>
            <button
              type="button"
              onClick={() => setAnalyticsSource('shopee')}
              className={`px-4 py-2 font-bold cursor-pointer transition-colors rounded-xl select-none ${
                analyticsSource === 'shopee' ? 'bg-indigo-600 text-white font-extrabold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              Tautan Shopee
            </button>
            <button
              type="button"
              onClick={() => setAnalyticsSource('medsos')}
              className={`px-4 py-2 font-bold cursor-pointer transition-colors rounded-xl select-none ${
                analyticsSource === 'medsos' ? 'bg-indigo-600 text-white font-extrabold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              Media Sosial &amp; Lainnya
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setAnalyticsTimeRange('today')}
              className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all cursor-pointer select-none ${
                analyticsTimeRange === 'today'
                  ? 'bg-indigo-50/50 border-indigo-600 text-indigo-600 shadow-2xs font-extrabold'
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              Hari Ini
            </button>
            <button
              type="button"
              onClick={() => setAnalyticsTimeRange('yesterday')}
              className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all cursor-pointer select-none ${
                analyticsTimeRange === 'yesterday'
                  ? 'bg-indigo-50/50 border-indigo-600 text-indigo-600 shadow-2xs font-extrabold'
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              Kemarin
            </button>
            <button
              type="button"
              onClick={() => setAnalyticsTimeRange('7days')}
              className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all cursor-pointer select-none ${
                analyticsTimeRange === '7days'
                  ? 'bg-orange-50/50 border-[#ee4d2d] text-[#ee4d2d] shadow-2xs font-extrabold'
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              7 Hari Terakhir
            </button>
            <button
              type="button"
              onClick={() => setAnalyticsTimeRange('30days')}
              className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all cursor-pointer select-none ${
                analyticsTimeRange === '30days'
                  ? 'bg-orange-50/50 border-[#ee4d2d] text-[#ee4d2d] shadow-2xs font-extrabold'
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              30 Hari Terakhir
            </button>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-display font-medium text-slate-800 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-indigo-500" /> Metrik Utama
                </h3>
                <div className="group relative">
                  <span className="text-slate-400 cursor-help text-xs font-serif italic border border-slate-250 rounded-full w-4 h-4 inline-flex items-center justify-center">?</span>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 bg-slate-900 text-white rounded-lg text-[9px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity leading-normal z-50 shadow-sm font-sans">
                    Menampilkan total klik pada periode berjalan dan perbandingan persentase terhadap periode setara sebelumnya.
                  </div>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-100 self-start sm:self-auto select-none">
                📅 {dateLabel}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div className="border border-indigo-100 bg-indigo-600/3 rounded-2xl p-4 flex flex-col justify-between transition-all hover:bg-indigo-600/5 select-none">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-indigo-600 tracking-wider">Klik Tautan</span>
                  <h4 className="text-2xl font-bold font-sans text-indigo-600 mt-1.5">{totalClicks}</h4>
                </div>
                <div className={`text-[10px] sm:text-[9.5px] mt-3 shrink-0 flex items-center gap-1 font-sans ${trendColor}`}>
                  <span>Pertumbuhan: </span>
                  <span className="font-extrabold">{trendSymbol}{percentChange}%</span>
                  <span className="opacity-70">vs lalu</span>
                </div>
              </div>

              <div className="border border-slate-100 bg-slate-50/50 rounded-2xl p-4 flex flex-col justify-between hover:bg-slate-50 select-none">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-500 tracking-wider">Rata-rata Klik / Hari</span>
                  <h4 className="text-2xl font-bold font-sans text-slate-700 mt-1.5">{avgDailyClicks}</h4>
                </div>
                <span className="text-[10px] text-slate-400 mt-3 block font-sans">Rasio rata-rata klik harian</span>
              </div>

              <div className="border border-slate-100 bg-slate-50/50 rounded-2xl p-4 flex flex-col justify-between hover:bg-slate-50 select-none">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-500 tracking-wider">Produk Terpopuler</span>
                  <h4 className="text-xs font-display font-medium text-slate-800 line-clamp-1 mt-2 mb-1">
                    {topLink ? topLink.title : 'Tidak ada data'}
                  </h4>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 shrink-0 flex items-center justify-between font-sans">
                  <span>{topLinkCount} klik</span>
                  {topLink && <span className="font-mono text-emerald-600 font-extrabold">{topLinkContribution}% Share</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-display font-medium text-slate-800 flex items-center gap-2">
                  <LineChart className="w-4 h-4 text-indigo-500" /> Grafik Klik
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Grafik dinamik logaritmik konversi klik per waktu</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            </div>
            
            <div className="w-full h-64 md:h-80 font-sans" id="recharts-click-analytics-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorKlik" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} 
                    axisLine={false} 
                    tickLine={false} 
                  />
                  <YAxis 
                    tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} 
                    axisLine={false} 
                    tickLine={false} 
                    allowDecimals={false} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.98)', border: '1px solid #f1f5f9', borderRadius: '16px', fontSize: '11px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                    labelClassName="font-extrabold text-slate-800"
                    itemStyle={{ color: '#4f46e5', fontWeight: 'bold' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="klik" 
                    stroke="#4f46e5" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorKlik)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-display font-medium text-slate-800 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-500" /> Performa Produk
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Urutan performa produk linktree berdasarkan total klik dalam rentang waktu terfilter</p>
              </div>
            </div>

            <div className="space-y-3">
              {rankedLinksList.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-100 text-xs text-slate-400 font-sans">
                  Tidak ada data interaksi klik dalam rentang waktu ini.
                </div>
              ) : (
                rankedLinksList.slice(0, 15).map((link, index) => {
                  const rank = index + 1;
                  let rankBg = 'bg-slate-100 text-slate-500 border border-slate-200';
                  if (rank === 1) rankBg = 'bg-indigo-600 text-white font-extrabold border border-indigo-600';
                  else if (rank === 2) rankBg = 'bg-blue-500 text-white font-extrabold border border-blue-500';
                  else if (rank === 3) rankBg = 'bg-sky-500 text-white font-extrabold border border-sky-500';

                  let catBg = 'bg-slate-50 text-slate-500 border-slate-150';
                  if (link.category === 'Shopee') catBg = 'bg-indigo-50 text-indigo-600 border-indigo-100';
                  else if (link.category === 'Tokopedia') catBg = 'bg-indigo-50 text-indigo-600 border-indigo-100';
                  else if (link.category === 'TikTok Shop') catBg = 'bg-indigo-50 text-indigo-600 border-indigo-100';

                  return (
                    <div 
                      key={link.id} 
                      className="p-4 bg-slate-50/40 hover:bg-slate-50/80 border border-slate-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors font-sans"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs select-none ${rankBg}`}>
                          {rank}
                        </div>

                        <div className="w-12 h-12 rounded-xl bg-white border border-slate-150 shrink-0 overflow-hidden flex items-center justify-center relative shadow-3xs">
                          {link.imageUrl ? (
                            <img 
                              src={link.imageUrl} 
                              alt="" 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <LinkIcon className="w-4 h-4 text-slate-300" />
                          )}
                        </div>

                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-slate-800 line-clamp-1 leading-snug">{link.title}</h4>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className={`text-[9px] px-2 py-0.5 rounded border uppercase tracking-wider font-extrabold ${catBg}`}>
                              {link.category}
                            </span>
                            <span className="text-[10px] text-slate-400 line-clamp-1 truncate max-w-[200px]" title={link.url}>
                              {link.url}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-slate-100/50 pt-3 sm:pt-0 shrink-0">
                        <div className="text-left sm:text-right">
                          <span className="text-[10px] font-mono text-slate-400 block font-bold uppercase tracking-wider">Tautan Diklik</span>
                          <span className="text-sm font-sans font-bold text-slate-700">
                            {link.clicksInRange} <span className="text-[10px] font-normal text-slate-400 font-sans">klik</span>
                          </span>
                        </div>
                        
                        <div className="text-right">
                          <span className="text-[10px] font-mono text-slate-400 block font-bold uppercase tracking-wider">Persentase</span>
                          <span className="text-sm font-mono font-bold text-indigo-600 block">
                            {totalClicks > 0 ? Math.round((link.clicksInRange / totalClicks) * 100) : 0}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      );
    })()}

      {/* ======================================================== */}
      {/* 9. VERSION HISTORY / SYSTEM LOGS VIEW TAB */}
      {/* ======================================================== */}
      {(activeTab as any) === 'history' && (
        <div className="space-y-6" id="tab-content-history">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-md font-display font-bold text-slate-800">Riwayat Pembaruan Sistem</h2>
              <p className="text-xs text-slate-400">Rekapitulasi log perubahan versi Admin Dashboard</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Latest Update v1.4.0 */}
            <div className="bg-white border-2 border-indigo-100 rounded-3xl p-6 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50 rounded-full translate-x-24 -translate-y-24 -z-10" />
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 shrink-0">
                    <span className="font-mono font-black text-sm text-white">1.4</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-display font-bold text-slate-800 truncate">Version 1.4.0 (Enhanced Creator Edition)</h3>
                    <p className="text-[10px] font-mono text-slate-400 mt-0.5 truncate">LATEST STABLE BUILD • REFINED WORKSPACE</p>
                     <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest truncate">Released: 12 June 2026</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-bold rounded-full font-mono border border-emerald-100 uppercase animate-pulse">Running Now</span>
              </div>
              
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <div className="shrink-0 w-5 h-5 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700 leading-tight">Normalisasi Template &amp; White-labeling</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Menghapus referensi nama personal untuk mempermudah creator menggunakan aplikasi ini sebagai template mandiri.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="shrink-0 w-5 h-5 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                    <PlusCircle className="w-3 h-3 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700 leading-tight">Pembersihan Visual UI Admin</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Merapikan sidebar menu, memperbaiki layout yang tumpang tindih, dan menyederhanakan navigasi antar modul.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Previous v1.3.0 */}
            <div className="bg-slate-50 border border-slate-250 rounded-2xl p-5 opacity-90">
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-600 text-[10px] font-mono font-bold rounded">v1.3.0</span>
                  <p className="text-xs font-display font-medium text-slate-600 italic">Advanced Ratecard Customization</p>
                </div>
              </div>
              <ul className="space-y-2 text-[10px] text-slate-500">
                <li>• Kustomisasi penuh Header Seksi (Badge, Judul, & Deskripsi) untuk Projects, Pricing, Brands, dan Terms.</li>
                <li>• Penyesuaian real-time untuk Metrik Audiens (Stats section) langsung dari Admin Panel.</li>
                <li>• Multi-line editor untuk Syarat & Ketentuan dengan preview bullet-point otomatis.</li>
              </ul>
            </div>

            {/* Previous v1.2.0 */}
            <div className="bg-slate-50 border border-slate-250 rounded-2xl p-5 opacity-90">
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-slate-200 text-slate-600 text-[10px] font-mono font-bold rounded">v1.2.0</span>
                  <p className="text-xs font-display font-medium text-slate-500 italic">Optimasi Real-time &amp; Live Preview</p>
                </div>
              </div>
              <ul className="space-y-2 text-[10px] text-slate-500">
                <li>• Memperbaiki delay sinkronisasi kustomisasi layout bento grid atau classic list.</li>
                <li>• Penambahan penyesuaian label tombol CTA (e.g. "Beli Sekarang", "Cek Promo").</li>
                <li>• Perbaikan feedback visual real-time pada edit typography, button style, &amp; shadows.</li>
              </ul>
            </div>

            {/* Previous v1.1.0 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 opacity-70">
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-200/50">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-slate-200 text-slate-600 text-[10px] font-mono font-bold rounded">v1.1.0</span>
                  <p className="text-xs font-display font-medium text-slate-500 italic">Stability &amp; Feature Baseline</p>
                </div>
              </div>
              <ul className="space-y-2 text-[10px] text-slate-400">
                <li>• Initial release of Dark Theme support for Ratecard Profile.</li>
                <li>• Social icons integration (WhatsApp &amp; YouTube redirect).</li>
                <li>• Design Tab Beta (Typography selection - Inter, Space Grotesk).</li>
              </ul>
            </div>
          </div>
        </div>
      )}
        </main>
      </div>

      {/* Footer Administration Panel */}
      <div className="w-full text-center py-8 text-xs text-slate-400 font-mono mt-8 border-t border-slate-100">
        <p>Admin Dashboard v1.3.0 | Personal Creator Workspace</p>
      </div>
    </div>
  );
}
