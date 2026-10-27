import React from 'react';
import { ArrowLeft, ArrowUpRight, Mail, Instagram, Youtube } from 'lucide-react';
import { RatecardProfile, RatecardService, RatecardProject, RatecardBrand } from '../types';

interface InkRatecardViewProps {
  profile: RatecardProfile;
  services: RatecardService[];
  projects: RatecardProject[];
  brands?: RatecardBrand[];
  onNavigateBack: () => void;
  onNavigateToAdmin: () => void;
}

// Minimal WhatsApp SVG icon for functional contact actions
const WhatsAppIcon = ({ className = "w-4 h-4", ...props }: { className?: string } & React.SVGProps<SVGSVGElement>) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    {...props}
  >
    <path d="M12 .02c-6.627 0-12 5.373-12 12 0 2.112.546 4.16 1.585 5.978L.055 24l6.18-1.62c1.763.96 3.75 1.48 5.768 1.48C18.63 23.86 24 18.487 24 11.86c0-3.21-1.248-6.22-3.511-8.487C18.22 1.348 15.21.02 12 .02zm5.978 17.202c-.25 1.406-1.218 2.062-2.187 2.375-1.094.344-2.594.188-4.469-.594-2.094-.875-3.719-2.312-4.938-3.937-1.125-1.469-1.937-3.281-2.094-4.844-.094-.968.219-1.844.938-2.5.281-.25.594-.281.875-.281H7c.219 0 .406.094.5.344.25.625.875 2.156 1 2.375.094.219.094.438-.031.656-.125.188-.25.375-.375.531-.125.156-.25.313-.094.563.313.531.688 1.031 1.125 1.469.563.563 1.156.938 1.719 1.25.25.156.406.125.563-.063.156-.188.688-.781.875-1.062.188-.281.375-.219.625-.125.25.094 1.563.75 1.844.906.281.156.469.25.531.375.063.125.063.781-.188 1.438z" />
  </svg>
);

// Minimal TikTok SVG icon
const TikTokIcon = ({ className = "w-4 h-4", ...props }: { className?: string } & React.SVGProps<SVGSVGElement>) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    {...props}
  >
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.93.98 2.19 1.55 3.51 1.76v3.42c-1.34-.14-2.65-.63-3.76-1.45-.63-.44-1.18-.99-1.61-1.63v7.35c.1 1.34-.23 2.72-.94 3.84a6.536 6.536 0 0 1-5.18 3.32c-1.44.13-2.92-.09-4.23-.7a6.49 6.49 0 0 1-3.61-4.73c-.32-1.47-.19-3.04.42-4.43A6.47 6.47 0 0 1 8.84 7.21v3.44c-1.07.25-2.02.94-2.62 1.86a4.133 4.133 0 0 0-.58 3.29c.36 1.41 1.59 2.52 3.02 2.76 1.15.15 2.37-.15 3.23-.94.75-.63 1.18-1.58 1.2-2.55V.02z" />
  </svg>
);

export default function InkRatecardView({
  profile,
  services,
  projects,
  brands = [],
  onNavigateBack,
  onNavigateToAdmin
}: InkRatecardViewProps) {
  const defaultTerms = [
    "Proses produksi konten maksimal 7 hari kerja setelah produk fisik diterima di studio.",
    "Brief serta poin wajib (USP & do/don't) disampaikan sebelum kesepakatan produksi dimulai.",
    "Pembayaran 100% di awal sebelum produksi dimulai dan belum termasuk pajak.",
    "Klien berhak menerima draf naskah/konsep konten dengan kesempatan revisi 1x.",
    "Gaya visual, estetika, dan alur narasi mengikuti karakter editorial personal kreator.",
    "Kesempatan revisi minor video 1x (terbatas pada penyesuaian teks caption atau voice over).",
    "Paket khusus tersedia untuk pemesanan minimal 3 SOW sekaligus.",
    "Kreator berhak menolak produk atau brand yang melanggar ketentuan hukum yang berlaku."
  ];

  const termsOfService = profile.termsOfService && profile.termsOfService.length > 0
    ? profile.termsOfService
    : defaultTerms;

  const activeServices = services.filter(s => s.isActive);

  const activeBrands = (brands || [])
    .filter(b => b.isActive !== false)
    .sort((a, b) => (a.priority || 0) - (b.priority || 0));

  const stats = profile.stats || [];

  const waHref = profile.whatsapp 
    ? profile.whatsapp 
    : `https://wa.me/?text=${encodeURIComponent(`Halo ${profile.name || ''}, saya tertarik mendiskusikan kolaborasi brand.`)}`;

  return (
    <div className="w-full min-h-screen bg-white text-neutral-950 font-sans antialiased flex flex-col selection:bg-neutral-950 selection:text-white" id="ink-ratecard-root">
      
      {/* 1. HEADER: Barton Road clean architecture */}
      <header className="w-full border-b border-neutral-200 sticky top-0 bg-white/95 backdrop-blur-xs z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <span className="font-black text-sm tracking-tight text-neutral-950">
              {profile.name || "Kreator"}
            </span>
            <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#E8F5E9] text-[#1B5E20]">
              Terbuka untuk Kolaborasi Q4
            </span>
          </div>

          <nav className="flex items-center gap-3 sm:gap-5">
            <button
              onClick={onNavigateBack}
              className="px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-950 transition-colors flex items-center gap-1 cursor-pointer"
              aria-label="Kembali ke halaman utama"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali</span>
            </button>
            <a
              href="#stats-section"
              className="hidden md:inline-block text-xs font-medium text-neutral-600 hover:text-neutral-950 transition-colors"
            >
              Statistik
            </a>
            <a
              href="#projects-section"
              className="hidden md:inline-block text-xs font-medium text-neutral-600 hover:text-neutral-950 transition-colors"
            >
              Portofolio
            </a>
            <a
              href="#pricing-section"
              className="hidden md:inline-block text-xs font-medium text-neutral-600 hover:text-neutral-950 transition-colors"
            >
              Tarif SOW
            </a>
            <a
              href="#contact-section"
              className="hidden md:inline-block text-xs font-medium text-neutral-600 hover:text-neutral-950 transition-colors"
            >
              Kontak
            </a>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-neutral-950 text-white hover:bg-neutral-800 px-4 py-2 rounded-full text-xs font-semibold transition-colors inline-flex items-center gap-1.5"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              <span>Diskusi Brief</span>
            </a>
          </nav>

        </div>
      </header>

      {/* 2. MAIN EDITORIAL CONTENT: Sequence matches standard ratecard layout */}
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-10 sm:py-16 space-y-20 sm:space-y-28 flex-grow">
        
        {/* SECTION 1: HERO & PROFIL KREATOR */}
        <section className="space-y-10" id="creator-hero">
          <div className="max-w-4xl space-y-4">
            <h1 className="font-black text-4xl sm:text-6xl lg:text-7xl tracking-tighter leading-[1.04] text-neutral-950">
              {profile.heroTitle1 || `Daftar tarif resmi & produksi konten ${profile.name || "Kreator"}.`}
            </h1>
            {profile.heroTitleHighlight && (
              <p className="font-bold text-xl sm:text-2xl text-neutral-700 tracking-tight">
                {profile.heroTitleHighlight}
              </p>
            )}
            <p className="text-base sm:text-lg text-neutral-600 font-normal leading-relaxed max-w-2xl pt-2">
              {profile.heroDescription || profile.bio || "Standar produksi editorial tinggi dengan audiens terverifikasi. Transparan, terukur, dan fokus pada pengenalan nilai inti brand."}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center min-h-11 px-7 py-3 rounded-full bg-neutral-950 text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
              >
                Mulai Kolaborasi
              </a>
              <a
                href="#pricing-section"
                className="inline-flex items-center justify-center min-h-11 px-7 py-3 rounded-full bg-neutral-100 text-neutral-900 text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors"
              >
                Lihat Tarif SOW
              </a>
            </div>
          </div>

          {/* Creator Profile Showcase: Barton Road architectural card */}
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50/60 p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Portrait Studio Photo */}
            <div className="md:col-span-4 lg:col-span-3">
              <div className="aspect-[4/5] rounded-xl overflow-hidden bg-neutral-200 border border-neutral-300">
                <img 
                  src={profile.avatarUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2"} 
                  alt={profile.name} 
                  loading="lazy"
                  className="w-full h-full object-cover filter contrast-105"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Profile Bio & Credential Details */}
            <div className="md:col-span-8 lg:col-span-9 space-y-4">
              <div>
                <span className="text-[11px] uppercase font-mono tracking-wider text-neutral-500 font-bold block">
                  {profile.studioDirectorTitle || "Content Creator & Production Studio"}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight mt-1">
                  {profile.name}
                </h2>
              </div>

              <p className="text-sm sm:text-base text-neutral-700 leading-relaxed max-w-2xl">
                {profile.bio || "Fokus pada konten dekorasi rumah, setup ruangan estetis, serta ulasan produk dengan gaya naratif natural."}
              </p>

              {/* Domicile & Active Year Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-3 border-t border-neutral-200">
                <div>
                  <span className="block text-[11px] uppercase font-mono text-neutral-500 font-bold">
                    Domisili
                  </span>
                  <span className="block text-sm font-bold text-neutral-950 mt-0.5">
                    {profile.domicile || "Indonesia"}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] uppercase font-mono text-neutral-500 font-bold">
                    Tahun Aktif
                  </span>
                  <span className="block text-sm font-bold text-neutral-950 mt-0.5">
                    {profile.studioEstdYear ? `Sejak ${profile.studioEstdYear}` : "Kreator Terverifikasi"}
                  </span>
                </div>
              </div>

              {/* Social Channels in Hero */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {profile.instagram && (
                  <a 
                    href={profile.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-neutral-300 text-neutral-800 hover:border-neutral-950 transition-colors"
                  >
                    <Instagram className="w-3.5 h-3.5 text-neutral-700" />
                    <span>Instagram</span>
                  </a>
                )}
                {profile.tiktok && (
                  <a 
                    href={profile.tiktok} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-neutral-300 text-neutral-800 hover:border-neutral-950 transition-colors"
                  >
                    <TikTokIcon className="w-3.5 h-3.5 text-neutral-700" />
                    <span>TikTok</span>
                  </a>
                )}
                {profile.youtube && (
                  <a 
                    href={profile.youtube} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-neutral-300 text-neutral-800 hover:border-neutral-950 transition-colors"
                  >
                    <Youtube className="w-3.5 h-3.5 text-neutral-700" />
                    <span>YouTube</span>
                  </a>
                )}
                {profile.whatsapp && (
                  <a 
                    href={profile.whatsapp} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-neutral-300 text-neutral-800 hover:border-neutral-950 transition-colors"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5 text-neutral-700" />
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 2: STATISTIK AUDIENS & JANGKAUAN (Saturdays, 10 to 2 Table Style) */}
        {stats.length > 0 && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start pt-6 border-t border-neutral-200" id="stats-section">
            <div className="lg:col-span-5 space-y-2">
              <h2 className="font-black text-3xl sm:text-4xl tracking-tight text-neutral-950">
                {profile.statsTitle || "Statistik Audiens & Jangkauan"}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 font-sans">
                {profile.statsDescription || "Data performa rata-rata akun resmi kreator yang terverifikasi."}
              </p>
            </div>

            <div className="lg:col-span-7 divide-y divide-neutral-200 border-t border-neutral-200">
              {stats.map((stat, idx) => (
                <div key={idx} className="py-4 sm:py-5 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-black text-base sm:text-lg text-neutral-950">
                      {stat.label}
                    </h3>
                    {stat.desc && (
                      <p className="text-xs text-neutral-500 mt-0.5">{stat.desc}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-black font-mono text-base sm:text-lg text-neutral-950">
                      {stat.value}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#E8F5E9] text-[#1B5E20]">
                      Aktif
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 3: CONTOH KONTEN & PORTOFOLIO */}
        {projects && projects.length > 0 && (
          <section className="space-y-6 pt-6 border-t border-neutral-200" id="projects-section">
            <div className="border-b border-neutral-200 pb-4">
              <h2 className="font-black text-3xl sm:text-4xl tracking-tight text-neutral-950">
                {profile.projectsTitle || "Contoh Konten & Portofolio"}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                {profile.projectsDescription || "Sampel video reels dan tayangan konten kolaborasi sebelumnya."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {projects.map((project, pIdx) => (
                <a
                  key={project.id || pIdx}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block border border-neutral-200 rounded-2xl overflow-hidden hover:border-neutral-950 transition-all bg-white"
                >
                  <div className="aspect-[4/5] bg-neutral-100 overflow-hidden relative">
                    <img
                      src={project.imageUrl || "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=400"}
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                      referrerPolicy="no-referrer"
                    />
                    {project.views && (
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-neutral-950 text-white">
                        {project.views} Views
                      </span>
                    )}
                  </div>
                  <div className="p-4 space-y-1">
                    {project.category && (
                      <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 font-bold block">
                        {project.category}
                      </span>
                    )}
                    <h3 className="font-bold text-sm text-neutral-950 leading-snug group-hover:underline flex items-center justify-between">
                      <span>{project.title}</span>
                      <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-950 shrink-0 ml-1" />
                    </h3>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 4: DAFTAR LAYANAN & PAKET KOLABORASI (SOW & Alur Kerja) */}
        <section className="space-y-12 scroll-mt-20 pt-6 border-t border-neutral-200" id="pricing-section">
          
          <div className="border-b border-neutral-200 pb-4">
            <h2 className="font-black text-3xl sm:text-4xl tracking-tight text-neutral-950">
              {profile.pricingTitle || "Daftar Harga & Paket Kolaborasi"}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              {profile.pricingDescription || "Rincian biaya paket penempatan dan cakupan deliverables konten resmi."}
            </p>
          </div>

          {/* Tabular Services */}
          <div className="divide-y divide-neutral-200 border-y border-neutral-200">
            {activeServices.length > 0 ? (
              activeServices.map((service) => (
                <div 
                  key={service.id}
                  className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start"
                >
                  {/* Title & Category */}
                  <div className="lg:col-span-4 space-y-1">
                    <span className="text-[11px] uppercase font-mono tracking-wider text-neutral-500 font-semibold block">
                      {service.category || 'Official Placement'}
                    </span>
                    <h3 className="font-black text-xl sm:text-2xl text-neutral-950 tracking-tight">
                      {service.title}
                    </h3>
                    <div className="pt-2">
                      <span className="text-2xl sm:text-3xl font-black font-mono text-neutral-950">
                        {service.price}
                      </span>
                    </div>
                  </div>

                  {/* Deliverables Breakdown */}
                  <div className="lg:col-span-5 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">
                      Cakupan Deliverables
                    </span>
                    <div className="space-y-2 text-xs sm:text-sm text-neutral-700 leading-relaxed">
                      {(service.description || "Produksi dan publikasi video sesuai konsep yang disepakati.")
                        .split('.')
                        .map(s => s.trim())
                        .filter(s => s.length > 0)
                        .map((item, bIdx) => (
                          <div key={bIdx} className="flex items-baseline gap-2">
                            <span className="text-neutral-400 font-mono select-none">—</span>
                            <span>{item}.</span>
                          </div>
                        ))}
                    </div>

                    {service.additionalFees && service.additionalFees.length > 0 && (
                      <div className="pt-3 border-t border-neutral-200/80 mt-3">
                        <span className="text-[11px] font-bold text-neutral-500 block mb-1">
                          Biaya Tambahan (Opsional):
                        </span>
                        <div className="space-y-1 text-xs text-neutral-600">
                          {service.additionalFees.map((fee, feeIdx) => (
                            <div key={feeIdx} className="flex justify-between items-center text-[11px]">
                              <span>{fee.label}</span>
                              <span className="font-mono font-bold text-neutral-800">{fee.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Booking Action */}
                  <div className="lg:col-span-3 flex lg:justify-end items-center pt-2 lg:pt-4">
                    <a
                      href={profile.whatsapp ? `${profile.whatsapp}?text=${encodeURIComponent(`Halo ${profile.name || ''}, saya berminat memesan paket: ${service.title} (${service.price}). Bisakah kita diskusikan ketersediaan jadwal?`)}` : '#contact-section'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      Pilih Paket Ini
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-xs text-neutral-400">
                Belum ada data paket layanan yang aktif.
              </div>
            )}
          </div>

          {/* Barton Road 4-Step Process Guide */}
          <div className="pt-8 space-y-6">
            <h3 className="font-black text-xl sm:text-2xl tracking-tight text-neutral-950">
              Alur Proses Kolaborasi
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 font-sans">
              Dari brief awal hingga konten tayang dalam 4 langkah transparan:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
              
              <div className="border-t border-neutral-200 pt-4 space-y-2">
                <span className="block font-black text-4xl text-neutral-300 leading-none">1</span>
                <h4 className="font-black text-base text-neutral-950">Brief &amp; Unit Fisik</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Konfirmasi objektif kampanye, USP kunci, dan pengiriman sampel produk ke studio.
                </p>
              </div>

              <div className="border-t border-neutral-200 pt-4 space-y-2">
                <span className="block font-black text-4xl text-neutral-300 leading-none">2</span>
                <h4 className="font-black text-base text-neutral-950">Draf Naskah</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Penyusunan hook naratif dan storyboard visual dengan 1x penyesuaian naskah.
                </p>
              </div>

              <div className="border-t border-neutral-200 pt-4 space-y-2">
                <span className="block font-black text-4xl text-neutral-300 leading-none">3</span>
                <h4 className="font-black text-base text-neutral-950">Produksi Editorial</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Shooting dengan pencahayaan alami &amp; audio jernih standar editorial profesional.
                </p>
              </div>

              <div className="border-t border-neutral-200 pt-4 space-y-2">
                <span className="block font-black text-4xl text-neutral-300 leading-none">4</span>
                <h4 className="font-black text-base text-neutral-950">Tayang &amp; Metrik</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Publikasi jam prima dan pengiriman rekapan analitik setelah 7 hari penayangan.
                </p>
              </div>

            </div>
          </div>

        </section>

        {/* SECTION 5: BRAND PARTNERS */}
        {activeBrands.length > 0 && (
          <section className="space-y-6 pt-6 border-t border-neutral-200" id="brands-section">
            <div className="border-b border-neutral-200 pb-4">
              <h2 className="font-black text-2xl sm:text-3xl tracking-tight text-neutral-950">
                {profile.brandsTitle || "Brand yang Pernah Bekerja Sama"}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                Koleksi brand mitra yang telah berkolaborasi dalam berbagai kampanye.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {activeBrands.map((brand) => (
                <div
                  key={brand.id}
                  className="h-16 rounded-2xl border border-neutral-200 bg-white flex items-center justify-center p-3 hover:border-neutral-950 transition-colors"
                  title={brand.name}
                >
                  {brand.logoUrl ? (
                    <img
                      src={brand.logoUrl}
                      alt={brand.name}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="font-bold text-xs text-neutral-950 truncate">
                      {brand.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 6: SYARAT & KETENTUAN KOLABORASI */}
        <section className="space-y-6 pt-6 border-t border-neutral-200" id="terms-section">
          <div className="border-b border-neutral-200 pb-4">
            <h2 className="font-black text-2xl sm:text-3xl tracking-tight text-neutral-950">
              {profile.termsTitle || "Syarat & Ketentuan Kolaborasi"}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              {profile.termsDescription || "Ketentuan kerja sama demi memastikan proses produksi berjalan lancar, terukur, dan profesional."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
            {termsOfService.map((term, tIdx) => (
              <div 
                key={tIdx}
                className="py-3 border-b border-neutral-200 flex items-start gap-3"
              >
                <span className="font-mono text-xs font-bold text-neutral-400 shrink-0 mt-0.5">
                  {(tIdx + 1).toString().padStart(2, '0')}.
                </span>
                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                  {term}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 7: KONTAK & KEMITRAAN (Barton Road Iconic Black Card) */}
        <section className="py-12 sm:py-16 bg-[#F7F5F0] -mx-4 sm:-mx-8 px-4 sm:px-8 border border-neutral-200 rounded-2xl sm:rounded-3xl scroll-mt-20" id="contact-section">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            
            {/* The Iconic Barton Black Membership Card */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-[#0D0D10] text-white p-7 sm:p-8 border border-neutral-800 shadow-xl flex flex-col justify-between min-h-[240px]">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                      Official Creator Card
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  
                  <h3 className="font-black text-2xl sm:text-3xl tracking-tight mt-6 text-white">
                    {profile.name || "Aesthetic Creator"}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                    {profile.bio || "Content Creator & Visual Storytelling"}
                  </p>
                </div>

                <div className="pt-6 border-t border-neutral-800 flex items-center justify-between mt-6">
                  <div className="text-[11px] font-mono text-neutral-400">
                    <span>Active Member </span>
                    <span className="text-white font-bold">{new Date().getFullYear()}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E8F5E9] text-[#1B5E20]">
                    Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Consultation Action Box */}
            <div className="lg:col-span-7 space-y-4">
              <h2 className="font-black text-3xl sm:text-4xl tracking-tight text-neutral-950">
                {profile.contactTitle || "Mulai Kerja Sama Brand"}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-lg">
                {profile.contactDescription || "Untuk pertanyaan penawaran paket, jadwal publikasi, atau negosiasi SOW khusus, silakan hubungi saluran resmi berikut."}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-3 border-y border-neutral-300/80 my-2">
                <div>
                  <span className="text-[11px] font-mono uppercase font-bold text-neutral-500 block">
                    WhatsApp
                  </span>
                  <p className="text-sm font-bold text-neutral-950 mt-0.5">
                    {profile.contactPhone || "Tersedia via link"}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase font-bold text-neutral-500 block">
                    Lokasi
                  </span>
                  <p className="text-sm font-bold text-neutral-950 mt-0.5">
                    {profile.domicile || "Indonesia"}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center min-h-11 px-6 py-3 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-colors gap-2"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>Hubungi via WhatsApp</span>
                </a>
                
                <a
                  href={`mailto:${profile.email || "creator@example.com"}?subject=Penawaran Kolaborasi Brand`}
                  className="inline-flex items-center justify-center min-h-11 px-6 py-3 rounded-full bg-white hover:bg-neutral-100 text-neutral-950 border border-neutral-300 text-xs font-bold uppercase tracking-wider transition-colors gap-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Kirim Email Bisnis</span>
                </a>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* 3. ARCHITECTURAL FOOTER */}
      <footer className="w-full border-t border-neutral-200 bg-white py-12 text-xs text-neutral-500 font-sans">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="space-y-1">
            <p className="font-bold text-neutral-950">
              {profile.name} Studio
            </p>
            <p className="text-[11px] text-neutral-400">
              © {new Date().getFullYear()} {profile.name || "Kreator"}. Seluruh hak cipta dilindungi.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            {profile.instagram && (
              <a href={profile.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-neutral-950 transition-colors">
                Instagram
              </a>
            )}
            {profile.tiktok && (
              <a href={profile.tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-neutral-950 transition-colors">
                TikTok
              </a>
            )}
            {profile.youtube && (
              <a href={profile.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-neutral-950 transition-colors">
                YouTube
              </a>
            )}
            <button onClick={onNavigateToAdmin} className="text-neutral-400 hover:text-neutral-950 transition-colors cursor-pointer">
              Admin
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
