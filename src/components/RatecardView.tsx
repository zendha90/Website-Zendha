import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Instagram, 
  Youtube, 
  ArrowUpRight,
  CheckCircle,
  FolderOpen,
  Calendar,
  Layers
} from 'lucide-react';
import { RatecardProfile, RatecardService, RatecardProject, RatecardBrand } from '../types';

interface RatecardViewProps {
  profile: RatecardProfile;
  services: RatecardService[];
  projects: RatecardProject[];
  brands?: RatecardBrand[];
  onNavigateBack: () => void;
  onNavigateToAdmin: () => void;
}

// Custom WhatsApp SVG Icon
const WhatsAppIcon = ({ className = "w-5 h-5", ...props }: { className?: string } & React.SVGProps<SVGSVGElement>) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    {...props}
  >
    <path d="M12 .02c-6.627 0-12 5.373-12 12 0 2.112.546 4.16 1.585 5.978L.055 24l6.18-1.62c1.763.96 3.75 1.48 5.768 1.48C18.63 23.86 24 18.487 24 11.86c0-3.21-1.248-6.22-3.511-8.487C18.22 1.348 15.21.02 12 .02zm5.978 17.202c-.25 1.406-1.218 2.062-2.187 2.375-1.094.344-2.594.188-4.469-.594-2.094-.875-3.719-2.312-4.938-3.937-1.125-1.469-1.937-3.281-2.094-4.844-.094-.968.219-1.844.938-2.5.281-.25.594-.281.875-.281H7c.219 0 .406.094.5.344.25.625.875 2.156 1 2.375.094.219.094.438-.031.656-.125.188-.25.375-.375.531-.125.156-.25.313-.094.563.313.531.688 1.031 1.125 1.469.563.563 1.156.938 1.719 1.25.25.156.406.125.563-.063.156-.188.688-.781.875-1.062.188-.281.375-.219.625-.125.25.094 1.563.75 1.844.906.281.156.469.25.531.375.063.125.063.781-.188 1.438z" />
  </svg>
);

const BrandLogoList = ({ brands = [], isMinimalist = false }: { brands?: RatecardBrand[]; isMinimalist?: boolean }) => {
  const activeBrands = (brands || [])
    .filter(b => b.isActive !== false)
    .sort((a, b) => (a.priority || 0) - (b.priority || 0));

  if (activeBrands.length === 0) {
    return (
      <div className={`w-full py-8 text-center text-sm rounded-xl border border-dashed ${
        isMinimalist ? 'border-[#DDD3C5] text-[#8E7E74]' : 'border-white/10 text-slate-400'
      }`}>
        Belum ada riwayat kolaborasi brand yang ditambahkan.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 justify-items-center justify-center pt-2 w-full">
      {activeBrands.map(brand => (
        <div 
          key={brand.id} 
          tabIndex={0}
          role="region"
          aria-label={`Brand ${brand.name}`}
          className={
            isMinimalist
              ? "bg-white rounded-xl p-4 h-16 w-full max-w-[160px] flex items-center justify-center border border-[#DDD3C5] transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none shadow-xs"
              : "bg-[#16161D] rounded-xl p-4 h-16 w-full max-w-[160px] flex items-center justify-center border border-white/5 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
          } 
          title={brand.name}
        >
          {brand.logoUrl ? (
            <img 
              src={brand.logoUrl} 
              alt={brand.name} 
              referrerPolicy="no-referrer"
              loading="lazy"
              className="max-h-full max-w-full object-contain" 
            />
          ) : (
            <span className={`text-xs font-semibold tracking-wide text-center px-1 truncate ${
              isMinimalist ? 'text-[#322723]' : 'text-slate-200'
            }`}>
              {brand.name}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default function RatecardView({ 
  profile, 
  services, 
  projects,
  brands = [],
  onNavigateBack,
  onNavigateToAdmin
}: RatecardViewProps) {
  
  // Real stats: only display if the creator has configured them
  const hasConfiguredStats = Boolean(profile.stats && profile.stats.length > 0);
  const stats = profile.stats || [];

  const defaultTerms = [
    "Proses produksi konten maksimal 7 hari kerja setelah produk/barang diterima.",
    "Brief serta poin wajib wajib disampaikan sebelum kesepakatan produksi dimulai.",
    "Pembayaran 100% di awal sebelum produksi dimulai dan belum termasuk pajak.",
    "Klien berhak menerima draf naskah/konsep konten dengan kesempatan revisi 1x.",
    "Gaya visual, estetika, dan alur penyampaian mengikuti identitas personal kreator.",
    "Kesempatan revisi minor video 1x (terbatas pada penyesuaian teks atau pengisian suara).",
    "Paket khusus tersedia untuk pemesanan minimal 3 SOW sekaligus.",
    "Kreator berhak menolak atau menurunkan konten yang melanggar ketentuan hukum."
  ];

  const termsOfService = profile.termsOfService && profile.termsOfService.length > 0 
    ? profile.termsOfService 
    : defaultTerms;

  const isMinimalist = profile.designSettings?.ratecardTheme === 'minimalist';

  return (
    <div className={`w-full min-h-screen ${
      isMinimalist ? 'bg-[#F7F4EE] text-[#322723]' : 'bg-[#0E0E13] text-[#F3F4F6]'
    } font-sans antialiased flex flex-col relative`}>
      
      {/* Top Navigation Bar */}
      <header className="w-full relative z-20 border-b border-inherit">
        <div className={`max-w-6xl mx-auto px-4 sm:px-8 py-5 flex items-center justify-between ${
          isMinimalist ? 'border-[#DDD3C5]' : 'border-white/10'
        }`}>
          <button 
            onClick={onNavigateBack}
            className={`group inline-flex items-center gap-2 text-xs font-semibold tracking-wide uppercase transition-all py-2 px-3.5 rounded-lg focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none ${
              isMinimalist 
                ? 'text-[#322723] bg-white border border-[#DDD3C5] hover:bg-[#EFEAE2]' 
                : 'text-slate-200 bg-white/5 border border-white/10 hover:bg-white/10'
            }`}
            id="ratecard-back-button"
            aria-label="Kembali ke halaman utama"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Kembali</span>
          </button>

          <div className="flex items-center gap-3">
            <span className={`text-xs font-medium px-3 py-1 rounded-md ${
              isMinimalist 
                ? 'text-[#61544E] bg-[#EAE4D9]' 
                : 'text-slate-300 bg-white/5'
            }`}>
              Rate Card Resmi
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-20 flex-grow relative z-10">
        
        {/* ================= HERO SECTION ================= */}
        <section className="pt-4 pb-8 flex flex-col items-center text-center" id="creator-hero">
          <div className="space-y-4 max-w-3xl mx-auto">
            
            <p className={`text-xs font-semibold tracking-wider uppercase ${
              isMinimalist ? 'text-[#8E7E74]' : 'text-indigo-400'
            }`}>
              {profile.heroTagline || "Kreator Konten & Home Living"}
            </p>

            <h1 
              className={`text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight ${
                isMinimalist ? 'font-serif text-[#322723]' : 'text-white'
              }`}
              id="ratecard-headline"
            >
              {profile.heroTitle1 || `${profile.name || "Kreator"} Rate Card`}
              {profile.heroTitleHighlight ? (
                <span className={`block mt-1 ${isMinimalist ? 'text-[#8E7E74] font-normal italic' : 'text-indigo-400'}`}>
                  {profile.heroTitleHighlight}
                </span>
              ) : null}
            </h1>

            <p className={`text-base sm:text-lg max-w-2xl mx-auto leading-relaxed ${
              isMinimalist ? 'text-[#61544E]' : 'text-slate-300'
            }`}>
              {profile.heroDescription || profile.bio || "Daftar harga kerja sama konten, review produk, dan kolaborasi sponsorship resmi."}
            </p>
          </div>

          {/* Creator Profile Card */}
          <div className="mt-10 w-full max-w-4xl mx-auto">
            <div className={`p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-center sm:items-start gap-8 text-left border ${
              isMinimalist 
                ? 'bg-white border-[#DDD3C5] shadow-xs' 
                : 'bg-[#15151C] border-white/10 shadow-sm'
            }`}>
              
              {/* Avatar Portrait */}
              <div className="relative shrink-0 w-44 h-56 sm:w-52 sm:h-64 rounded-xl overflow-hidden border border-inherit">
                <img 
                  src={profile.avatarUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2"} 
                  alt={profile.name} 
                  loading="lazy"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Bio & Details */}
              <div className="flex-1 space-y-4">
                <div>
                  <span className={`text-xs font-semibold uppercase tracking-wider block ${
                    isMinimalist ? 'text-[#8E7E74]' : 'text-indigo-400'
                  }`}>
                    {profile.studioDirectorTitle || "Content Creator"}
                  </span>
                  <h2 className={`text-2xl sm:text-3xl font-bold mt-1 ${
                    isMinimalist ? 'font-serif text-[#322723]' : 'text-white'
                  }`}>
                    {profile.name}
                  </h2>
                </div>

                <p className={`text-sm sm:text-base leading-relaxed ${
                  isMinimalist ? 'text-[#554944]' : 'text-slate-300'
                }`}>
                  {profile.bio || "Fokus pada konten dekorasi rumah, setup ruangan minimalis, dan ulasan produk praktis."}
                </p>

                <div className={`grid grid-cols-2 pt-4 border-t gap-4 ${
                  isMinimalist ? 'border-[#DDD3C5]/60' : 'border-white/10'
                }`}>
                  <div>
                    <span className={`block text-xs uppercase tracking-wider ${
                      isMinimalist ? 'text-[#8E7E74]' : 'text-slate-400'
                    }`}>
                      Domisili
                    </span>
                    <span className={`block text-sm font-semibold mt-0.5 ${
                      isMinimalist ? 'text-[#322723]' : 'text-white'
                    }`}>
                      {profile.domicile || "Indonesia"}
                    </span>
                  </div>
                  <div>
                    <span className={`block text-xs uppercase tracking-wider ${
                      isMinimalist ? 'text-[#8E7E74]' : 'text-slate-400'
                    }`}>
                      Tahun Aktif
                    </span>
                    <span className={`block text-sm font-semibold mt-0.5 ${
                      isMinimalist ? 'text-[#322723]' : 'text-white'
                    }`}>
                      {profile.studioEstdYear ? `Sejak ${profile.studioEstdYear}` : "Kreator Terverifikasi"}
                    </span>
                  </div>
                </div>

                {/* Social Channel Links */}
                <div className="flex flex-wrap items-center gap-2.5 pt-2">
                  {profile.instagram && (
                    <a 
                      href={profile.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none ${
                        isMinimalist 
                          ? 'bg-[#FAF8F5] text-[#322723] border-[#DDD3C5] hover:bg-[#EFEAE2]' 
                          : 'bg-white/5 text-slate-200 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <Instagram className="w-4 h-4 text-pink-500" />
                      <span>Instagram</span>
                    </a>
                  )}
                  {profile.tiktok && (
                    <a 
                      href={profile.tiktok} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none ${
                        isMinimalist 
                          ? 'bg-[#FAF8F5] text-[#322723] border-[#DDD3C5] hover:bg-[#EFEAE2]' 
                          : 'bg-white/5 text-slate-200 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.93.98 2.19 1.55 3.51 1.76v3.42c-1.34-.14-2.65-.63-3.76-1.45-.63-.44-1.18-.99-1.61-1.63v7.35c.1 1.34-.23 2.72-.94 3.84a6.536 6.536 0 0 1-5.18 3.32c-1.44.13-2.92-.09-4.23-.7a6.49 6.49 0 0 1-3.61-4.73c-.32-1.47-.19-3.04.42-4.43A6.47 6.47 0 0 1 8.84 7.21v3.44c-1.07.25-2.02.94-2.62 1.86a4.133 4.133 0 0 0-.58 3.29c.36 1.41 1.59 2.52 3.02 2.76 1.15.15 2.37-.15 3.23-.94.75-.63 1.18-1.58 1.2-2.55V.02z"/>
                      </svg>
                      <span>TikTok</span>
                    </a>
                  )}
                  {profile.youtube && (
                    <a 
                      href={profile.youtube} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none ${
                        isMinimalist 
                          ? 'bg-[#FAF8F5] text-[#322723] border-[#DDD3C5] hover:bg-[#EFEAE2]' 
                          : 'bg-white/5 text-slate-200 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <Youtube className="w-4 h-4 text-red-500" />
                      <span>YouTube</span>
                    </a>
                  )}
                  {profile.whatsapp && (
                    <a 
                      href={profile.whatsapp} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none ${
                        isMinimalist 
                          ? 'bg-[#FAF8F5] text-[#322723] border-[#DDD3C5] hover:bg-[#EFEAE2]' 
                          : 'bg-white/5 text-slate-200 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <WhatsAppIcon className="w-4 h-4 text-emerald-500" />
                      <span>WhatsApp</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= STATS SECTION ================= */}
        {hasConfiguredStats && (
          <section className="space-y-6" id="stats-section">
            <div className={`border-b pb-4 ${isMinimalist ? 'border-[#DDD3C5]' : 'border-white/10'}`}>
              <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                isMinimalist ? 'font-serif text-[#322723]' : 'text-white'
              }`}>
                {profile.statsTitle || "Statistik Audiens & Jangkauan"}
              </h2>
              <p className={`text-sm mt-1 ${isMinimalist ? 'text-[#61544E]' : 'text-slate-400'}`}>
                {profile.statsDescription || "Data performa dan engagement audiens resmi terverifikasi."}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {stats.map((stat, idx) => {
                const match = stat.value.trim().match(/^([\d.,]+)\s*(.*)$/);
                const numPart = match ? match[1] : stat.value;
                const suffixPart = match ? match[2] : "";

                return (
                  <div 
                    key={idx}
                    className={`p-4 sm:p-5 rounded-xl border text-left flex flex-col justify-between ${
                      isMinimalist 
                        ? 'bg-white border-[#DDD3C5]' 
                        : 'bg-[#15151C] border-white/10'
                    }`}
                  >
                    <div className={`flex items-baseline leading-none ${
                      isMinimalist ? 'text-[#322723] font-serif font-bold' : 'text-white font-extrabold'
                    }`}>
                      <span className="text-2xl sm:text-3xl">{numPart}</span>
                      {suffixPart && (
                        <span className="text-sm font-semibold ml-1">{suffixPart}</span>
                      )}
                    </div>
                    
                    <div className="mt-3">
                      <h3 className={`text-xs sm:text-sm font-semibold leading-tight ${
                        isMinimalist ? 'text-[#322723]' : 'text-slate-200'
                      }`}>
                        {stat.label}
                      </h3>
                      {stat.desc && (
                        <p className={`text-[11px] mt-1 leading-snug ${
                          isMinimalist ? 'text-[#8E7E74]' : 'text-slate-400'
                        }`}>
                          {stat.desc}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ================= INSTAGRAM PROJECTS SECTION ================= */}
        <section className="space-y-6" id="projects-section">
          <div className={`border-b pb-4 ${isMinimalist ? 'border-[#DDD3C5]' : 'border-white/10'}`}>
            <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${
              isMinimalist ? 'font-serif text-[#322723]' : 'text-white'
            }`}>
              {profile.projectsTitle || "Contoh Konten & Portofolio"}
            </h2>
            <p className={`text-sm mt-1 ${isMinimalist ? 'text-[#61544E]' : 'text-slate-400'}`}>
              {profile.projectsDescription || "Sampel video reels dan tayangan konten kolaborasi sebelumnya."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects && projects.length > 0 ? (
              projects.map((project, idx) => (
                <a 
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={project.id || idx}
                  className={`group overflow-hidden rounded-xl border transition-all flex flex-col justify-between focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none ${
                    isMinimalist 
                      ? 'bg-white border-[#DDD3C5] hover:border-[#8E7E74]' 
                      : 'bg-[#15151C] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="aspect-[3/4] overflow-hidden relative bg-black flex items-center justify-center">
                    <img 
                      src={project.imageUrl || "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=400"} 
                      alt={project.title} 
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                      referrerPolicy="no-referrer"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {project.views && (
                      <span className="absolute top-4 right-4 px-2.5 py-1 rounded-md text-xs font-semibold bg-black/70 text-white border border-white/10">
                        {project.views} Views
                      </span>
                    )}

                    <div className="absolute bottom-4 left-4 right-4 text-left space-y-1.5">
                      {project.category && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-300">
                          {project.category}
                        </span>
                      )}
                      <h3 className="text-base font-bold text-white leading-snug">
                        {project.title}
                      </h3>
                      
                      <div className="flex items-center gap-1 text-xs text-indigo-300 pt-1">
                        <span>Buka Konten Video</span>
                        <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </div>
                  </div>
                </a>
              ))
            ) : (
              <div className={`col-span-full py-12 text-center text-sm border border-dashed rounded-xl ${
                isMinimalist ? 'border-[#DDD3C5] text-[#8E7E74]' : 'border-white/10 text-slate-400'
              }`}>
                Belum ada contoh konten video yang ditambahkan.
              </div>
            )}
          </div>
        </section>

        {/* ================= PLACEMENTS RATE CARD SECTION ================= */}
        <section className="space-y-6 scroll-mt-20" id="pricing-section">
          <div className={`border-b pb-4 ${isMinimalist ? 'border-[#DDD3C5]' : 'border-white/10'}`}>
            <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${
              isMinimalist ? 'font-serif text-[#322723]' : 'text-white'
            }`}>
              {profile.pricingTitle || "Daftar Harga & Paket Kolaborasi"}
            </h2>
            <p className={`text-sm mt-1 ${isMinimalist ? 'text-[#61544E]' : 'text-slate-400'}`}>
              {profile.pricingDescription || "Rincian biaya paket penempatan dan cakupan deliverables konten."}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {services && services.filter(s => s.isActive).length > 0 ? (
              services.filter(s => s.isActive).map((rate) => (
                <div 
                  key={rate.id}
                  className={`p-6 sm:p-8 rounded-2xl border flex flex-col justify-between ${
                    isMinimalist 
                      ? 'bg-white border-[#DDD3C5]' 
                      : 'bg-[#15151C] border-white/10'
                  }`}
                >
                  <div className="space-y-5">
                    {/* Header: Title and Price */}
                    <div className={`flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 pb-4 border-b ${
                      isMinimalist ? 'border-[#DDD3C5]/60' : 'border-white/10'
                    }`}>
                      <div>
                        <span className={`text-xs font-semibold uppercase tracking-wider block ${
                          isMinimalist ? 'text-[#8E7E74]' : 'text-indigo-400'
                        }`}>
                          {rate.category || 'Paket Kolaborasi'}
                        </span>
                        <h3 className={`text-xl font-bold mt-0.5 ${
                          isMinimalist ? 'font-serif text-[#322723]' : 'text-white'
                        }`}>
                          {rate.title}
                        </h3>
                      </div>
                      
                      <div className="text-left sm:text-right shrink-0">
                        <span className={`text-2xl font-extrabold ${
                          isMinimalist ? 'text-[#322723]' : 'text-white'
                        }`}>
                          {rate.price}
                        </span>
                      </div>
                    </div>

                    {/* Deliverables */}
                    <div className="space-y-3">
                      <span className={`text-xs font-semibold uppercase tracking-wider block ${
                        isMinimalist ? 'text-[#8E7E74]' : 'text-slate-400'
                      }`}>
                        Cakupan Pekerjaan (Deliverables)
                      </span>
                      <ul className="space-y-2 text-sm">
                        {(rate.description || "Produksi dan publikasi video sesuai konsep yang disepakati.")
                          .split('.')
                          .map(s => s.trim())
                          .filter(s => s.length > 0)
                          .map((bullet, bIdx) => (
                            <li key={bIdx} className="flex items-start gap-2.5 leading-relaxed">
                              <CheckCircle className={`w-4 h-4 shrink-0 mt-0.5 ${
                                isMinimalist ? 'text-[#8E7E74]' : 'text-indigo-400'
                              }`} />
                              <span>{bullet}.</span>
                            </li>
                          ))
                        }
                      </ul>
                    </div>

                    {/* Additional Fees */}
                    {rate.additionalFees && rate.additionalFees.length > 0 && (
                      <div className={`pt-4 border-t ${
                        isMinimalist ? 'border-[#DDD3C5]/60' : 'border-white/10'
                      }`}>
                        <span className={`text-xs font-semibold uppercase tracking-wider block mb-2 ${
                          isMinimalist ? 'text-[#8E7E74]' : 'text-slate-400'
                        }`}>
                          Biaya Tambahan (Opsional)
                        </span>
                        <ul className="space-y-1.5 text-xs">
                          {rate.additionalFees.map((fee, fIdx) => (
                            <li key={fIdx} className="flex justify-between items-center gap-4">
                              <span>{fee.label}</span>
                              <span className="font-semibold">{fee.value}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className={`col-span-full py-12 text-center text-sm border border-dashed rounded-xl ${
                isMinimalist ? 'border-[#DDD3C5] text-[#8E7E74]' : 'border-white/10 text-slate-400'
              }`}>
                Belum ada data paket layanan yang aktif.
              </div>
            )}
          </div>
        </section>

        {/* ================= BRANDS WORKED WITH ================= */}
        <section className={`rounded-2xl p-6 sm:p-8 space-y-6 border ${
          isMinimalist ? 'bg-white border-[#DDD3C5]' : 'bg-[#15151C] border-white/10'
        }`}>
          <div className="text-center space-y-1">
            <h2 className={`text-xl sm:text-2xl font-bold ${
              isMinimalist ? 'font-serif text-[#322723]' : 'text-white'
            }`}>
              {profile.brandsTitle || "Brand yang Pernah Bekerja Sama"}
            </h2>
            <p className={`text-xs ${isMinimalist ? 'text-[#8E7E74]' : 'text-slate-400'}`}>
              Daftar brand mitra yang pernah berkolaborasi
            </p>
          </div>

          <BrandLogoList brands={brands} isMinimalist={isMinimalist} />
        </section>

        {/* ================= TERMS & CONDITIONS ================= */}
        <section className="space-y-6" id="terms-section">
          <div className={`border-b pb-4 ${isMinimalist ? 'border-[#DDD3C5]' : 'border-white/10'}`}>
            <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${
              isMinimalist ? 'font-serif text-[#322723]' : 'text-white'
            }`}>
              {profile.termsTitle || "Syarat & Ketentuan Kolaborasi"}
            </h2>
            <p className={`text-sm mt-1 ${isMinimalist ? 'text-[#61544E]' : 'text-slate-400'}`}>
              {profile.termsDescription || "Ketentuan kerja sama untuk memastikan proses produksi berjalan lancar dan profesional."}
            </p>
          </div>

          <div className={`rounded-2xl p-6 sm:p-8 space-y-3.5 border ${
            isMinimalist ? 'bg-white border-[#DDD3C5]' : 'bg-[#15151C] border-white/10'
          }`}>
            {termsOfService.map((term, tIdx) => (
              <div 
                key={tIdx} 
                className={`flex items-start gap-3 p-3.5 rounded-xl border ${
                  isMinimalist ? 'bg-[#FAF8F5] border-[#DDD3C5]/50' : 'bg-white/5 border-white/5'
                }`}
              >
                <span className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                  isMinimalist ? 'bg-[#8E7E74]' : 'bg-indigo-400'
                }`} />
                <p className={`text-xs sm:text-sm leading-relaxed ${
                  isMinimalist ? 'text-[#554944]' : 'text-slate-200'
                }`}>
                  {term}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= CONTACT SECTION ================= */}
        <section className="scroll-mt-20" id="contact-section">
          <div className={`rounded-2xl p-6 sm:p-12 text-center space-y-6 border ${
            isMinimalist ? 'bg-white border-[#DDD3C5]' : 'bg-[#15151C] border-white/10'
          }`}>
            
            <div className="space-y-2 max-w-xl mx-auto">
              <h2 className={`text-2xl sm:text-4xl font-extrabold tracking-tight ${
                isMinimalist ? 'font-serif text-[#322723]' : 'text-white'
              }`}>
                {profile.contactTitle || "Mulai Kerja Sama Brand"}
              </h2>
              <p className={`text-sm sm:text-base ${
                isMinimalist ? 'text-[#61544E]' : 'text-slate-300'
              }`}>
                {profile.contactDescription || "Untuk pertanyaan penawaran paket, jadwal publikasi, atau negosiasi SOW khusus, silakan hubungi saluran resmi berikut."}
              </p>
            </div>

            <div className={`max-w-md mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 text-left border-y py-6 my-6 ${
              isMinimalist ? 'border-[#DDD3C5]/60' : 'border-white/10'
            }`}>
              <div>
                <span className={`text-xs font-semibold uppercase tracking-wider block ${
                  isMinimalist ? 'text-[#8E7E74]' : 'text-slate-400'
                }`}>
                  WhatsApp Resmi
                </span>
                <p className="text-sm font-bold mt-1">
                  {profile.contactPhone || "Belum diatur"}
                </p>
              </div>
              <div>
                <span className={`text-xs font-semibold uppercase tracking-wider block ${
                  isMinimalist ? 'text-[#8E7E74]' : 'text-slate-400'
                }`}>
                  Lokasi / Domicile
                </span>
                <p className="text-sm font-bold mt-1">
                  {profile.domicile || "Indonesia"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a 
                href={`mailto:${profile.email || "creator@example.com"}?subject=Penawaran Kolaborasi Brand`}
                className={`px-6 py-3 text-xs font-bold uppercase rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none ${
                  isMinimalist 
                    ? 'bg-[#322723] text-white hover:bg-[#4E3F39]' 
                    : 'bg-white text-black hover:bg-slate-200'
                }`}
              >
                Kirim Email Bisnis
              </a>
              
              {profile.whatsapp && (
                <a 
                  href={profile.whatsapp} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-3 text-xs font-bold uppercase rounded-lg transition-colors bg-emerald-600 hover:bg-emerald-700 text-white inline-flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-emerald-400 outline-none"
                >
                  <WhatsAppIcon className="w-4 h-4 text-white" />
                  <span>Hubungi via WhatsApp</span>
                </a>
              )}
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className={`w-full border-t py-8 text-center text-xs ${
        isMinimalist 
          ? 'bg-[#FAF8F5] border-[#DDD3C5] text-[#8E7E74]' 
          : 'bg-[#0B0B0F] border-white/10 text-slate-400'
      }`}>
        <p>© {new Date().getFullYear()} {profile.name || "Kreator"}. Seluruh hak cipta dilindungi.</p>
      </footer>

    </div>
  );
}
