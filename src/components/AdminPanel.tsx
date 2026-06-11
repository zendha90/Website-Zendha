import React, { useState, useEffect } from 'react';
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
  Upload
} from 'lucide-react';
import { AffiliateLink, RatecardProfile, RatecardService, RatecardProject } from '../types';

interface AdminPanelProps {
  onNavigateBack: () => void;
  onRefreshData: () => Promise<void>;
  links: AffiliateLink[];
  profile: RatecardProfile;
  services: RatecardService[];
  projects: RatecardProject[];
}

export default function AdminPanel({
  onNavigateBack,
  onRefreshData,
  links,
  profile,
  services,
  projects
}: AdminPanelProps) {
  // Authentication states
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [token, setToken] = useState<string | null>(null);

  // Active Admin Tabs
  const [activeTab, setActiveTab] = useState<'links' | 'profile' | 'services' | 'projects' | 'backup'>('links');

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

  // State management for backup & restore configurations
  const [importFileContent, setImportFileContent] = useState<any>(null);
  const [importFileName, setImportFileName] = useState<string>('');
  const [isImporting, setIsImporting] = useState<boolean>(false);

  // User notifications feedback
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Check storage on mount for active session
  useEffect(() => {
    const savedToken = localStorage.getItem('zendha_admin_token');
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
        localStorage.setItem('zendha_admin_token', data.token);
        setToken(data.token);
        setIsLoggedIn(true);
        setPassword('');
        showToast('Login berhasil! Selamat datang Admin Zendha.');
      } else {
        setLoginError(data.message || 'Password salah!');
      }
    } catch (err) {
      setLoginError('Koneksi ke backend gagal!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('zendha_admin_token');
    setToken(null);
    setIsLoggedIn(false);
    showToast('Logout berhasil!', 'success');
  };

  // Helper header generator
  const getAuthHeader = () => {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || localStorage.getItem('zendha_admin_token')}`
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: 'avatarUrl' | 'link' | 'project') => {
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

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const sanitizedProfile = {
        ...profileForm,
        termsOfService: (profileForm.termsOfService || [])
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
        downloadAnchor.setAttribute("download", `backup-zendharefitra-${new Date().toISOString().split('T')[0]}.json`);
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


  // If NOT Logged In, Render standard beautiful Lock screen
  if (!isLoggedIn) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-16" id="admin-login-screen">
        <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xl text-center">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-xl font-display font-bold text-slate-800">Panel Admin zendharefitra.com</h1>
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
          notification.type === 'success' ? 'bg-emerald-600' : 'bg-red-650'
        }`} id="admin-toast">
          <Sparkles className="w-4 h-4" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Top Welcome Panel */}
      <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 shadow-lg mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="p-3 bg-white/10 rounded-2xl hidden md:block">
            <Sliders className="w-6 h-6 text-indigo-200" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-display font-bold">Halo Admin Zendha! 👋</h1>
            <p className="text-xs text-indigo-200">Kelola real-time link affiliate dan detail ratecard bisnis Anda disini.</p>
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

      {/* Navigation Tabs for Dashboard Options */}
      <div className="border-b border-slate-200 mb-8 flex gap-2">
        <button
          onClick={() => { setActiveTab('links'); setEditingLink(null); }}
          className={`pb-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'links' 
              ? 'border-indigo-600 text-indigo-600' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
          id="btn-tab-links"
        >
          <LinkIcon className="w-3.5 h-3.5" /> Affiliate Links
        </button>
        <button
          onClick={() => { setActiveTab('services'); setEditingService(null); }}
          className={`pb-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'services' 
              ? 'border-indigo-600 text-indigo-600' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
          id="btn-tab-services"
        >
          <Briefcase className="w-3.5 h-3.5" /> Ratecard Services
        </button>
        <button
          onClick={() => { setActiveTab('profile'); }}
          className={`pb-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'profile' 
              ? 'border-indigo-600 text-indigo-600' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
          id="btn-tab-profile"
        >
          <User className="w-3.5 h-3.5" /> Profile Info
        </button>
        <button
          onClick={() => { setActiveTab('projects'); setEditingProject(null); }}
          className={`pb-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'projects' 
              ? 'border-indigo-600 text-indigo-600' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
          id="btn-tab-projects"
        >
          <Video className="w-3.5 h-3.5" /> Viral Videos (IG)
        </button>
        <button
          onClick={() => { setActiveTab('backup'); }}
          className={`pb-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'backup' 
              ? 'border-indigo-600 text-indigo-600' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
          id="btn-tab-backup"
        >
          <Database className="w-3.5 h-3.5" /> Backup &amp; Restore
        </button>
      </div>

      {/* ======================================================== */}
      {/* 1. MANAGE AFFILIATE LINKS VIEW TAB */}
      {/* ======================================================== */}
      {activeTab === 'links' && (
        <div className="space-y-6" id="tab-content-links">
            
            {/* Visual Link Analytical Widgets (High-fidelity CRM design) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="links-stats-bento">
              {/* Total Clicks Widget */}
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex items-center justify-between col-span-1">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">TOTAL CLICKS METRIC</span>
                  <span className="text-3xl font-display font-black text-slate-800 tracking-tight block mt-1">
                    {totalClicks}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1 block">Akumulasi klik sepanjang waktu</span>
                </div>
                <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 shrink-0">
                  <TrendingUp className="w-6 h-6 animate-pulse" />
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
                  className="px-4 py-2.5 bg-indigo-650 hover:bg-indigo-750 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer font-sans"
                  id="btn-trigger-add-link"
                >
                  <PlusCircle className="w-4 h-4" /> Tambah Link Baru
                </button>
              )}
            </div>

          {/* Collapsible Add/Edit Form Box */}
          {editingLink && (
            <div className="bg-slate-55 border border-slate-150 rounded-2xl p-6 shadow-inner" id="link-form-container">
              <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-4">
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
      {/* 2. MANAGE RATEBOARD SERVERS VIEW TAB */}
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
                className="px-4 py-2.5 bg-indigo-650 hover:bg-indigo-750 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer font-sans"
                id="btn-trigger-add-service"
              >
                <PlusCircle className="w-4 h-4" /> Tambah Layanan Baru
              </button>
            )}
          </div>

          {/* Collapsible Add/Edit Service form */}
          {editingService && (
            <div className="bg-slate-55 border border-slate-150 rounded-2xl p-6 shadow-inner" id="service-form-container">
              <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-4">
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

            {/* NEW: Ratecard Hero Customizations Section */}
            <div className="border-t border-slate-100 pt-5 mt-6">
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
            </div>

            {/* NEW: Domicile & Contact Section */}
            <div className="border-t border-slate-100 pt-5 mt-6">
              <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-4">Lokasi Domisili &amp; Telepon Teks</h3>
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

            {/* NEW: Interactive Stats Editor Curation */}
            <div className="border-t border-slate-100 pt-5 mt-6">
              <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-500" /> Statistik &amp; Metrik Audiens Ratecard
              </h3>
              <p className="text-xs text-slate-400 mb-4">Sesuaikan 5 kartu metrik statistik hasil jangkauan audiens organik yang tampil pada halaman Ratecard Anda.</p>
              
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

            {/* NEW: Terms of Service Multi-line editor in Profile */}
            <div className="border-t border-slate-100 pt-5 mt-6">
              <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-4">Syarat &amp; Ketentuan (Satu baris per Syarat)</h3>
              <p className="text-xs text-slate-400 mb-4">Ubah daftar S&amp;K untuk brand partner. Setiap baris baru otomatis akan menjadi bullet point checklist di halaman Ratecard.</p>
              
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
                <p className="text-[10px] text-slate-400 mt-1">Ganti teks di atas baris demi baris demi transparansi kampanye kreatif brand partner.</p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5 mt-6">
              <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-4">Link Sosial Media</h3>
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
                className="px-4 py-2.5 bg-indigo-650 hover:bg-indigo-750 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer font-sans"
                id="btn-trigger-add-project"
              >
                <Plus className="w-4 h-4" /> Tambah Video Baru
              </button>
            )}
          </div>

          {/* New/Edit Project Form Overlay */}
          {editingProject && (
            <div className="bg-slate-55 border border-slate-150 rounded-2xl p-6 shadow-inner" id="project-form-container">
              <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-4">
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
                <h3 className="text-sm font-display font-bold text-slate-800">Ekspor/Unduh Backup</h3>
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
                    <span className="font-bold text-slate-800">{profile?.name || 'Zendha Refitra'}</span>
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
                <h3 className="text-sm font-display font-bold text-slate-800">Impor/Pulihkan Backup</h3>
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

        </div>
      )}
    </div>
  );
}
