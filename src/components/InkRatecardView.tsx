import React from 'react';
import { 
  ArrowLeft, 
  Instagram, 
  Youtube, 
  ArrowUpRight, 
  CheckCircle, 
  Search,
  ExternalLink,
  Mail,
  Clock,
  Sparkles,
  MapPin,
  Calendar,
  Layers
} from 'lucide-react';
import { RatecardProfile, RatecardService, RatecardProject, RatecardBrand } from '../types';

interface InkRatecardViewProps {
  profile: RatecardProfile;
  services: RatecardService[];
  projects: RatecardProject[];
  brands?: RatecardBrand[];
  onNavigateBack: () => void;
  onNavigateToAdmin: () => void;
}

// Custom WhatsApp SVG Icon
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

  return (
    <div className="w-full min-h-screen bg-white text-[#0A0A0A] font-sans antialiased flex flex-col selection:bg-[#0A0A0A] selection:text-white" id="ink-ratecard-root">
      
      {/* 1. Barton Road Editorial Header */}
      <header className="w-full border-b border-neutral-200 sticky top-0 bg-white/95 backdrop-blur-xs z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <span className="font-black text-sm tracking-tight text-[#0A0A0A]">
              {profile.name || "Kreator"} Official Rate Card
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border border-neutral-200 text-neutral-600 bg-neutral-50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Jadwal Produksi Aktif Q4
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onNavigateBack}
              className="px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:text-black transition-colors rounded-md hover:bg-neutral-100 flex items-center gap-1 cursor-pointer"
              aria-label="Kembali ke halaman utama"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali</span>
            </button>
            <a
              href="#sow-pricing"
              className="hidden sm:inline-block px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:text-black underline underline-offset-4"
            >
              Daftar Paket
            </a>
            <a
              href={profile.whatsapp ? profile.whatsapp : `https://wa.me/?text=${encodeURIComponent('Halo, saya tertarik untuk mendiskusikan kolaborasi brand.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0A0A0A] text-white hover:bg-neutral-800 px-3.5 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 shadow-xs"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              <span>Diskusi Brief</span>
            </a>
          </div>

        </div>
      </header>

      {/* 2. Main Editorial Canvas */}
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-14 space-y-16 sm:space-y-24 flex-grow">
        
        {/* HERO SECTION */}
        <section className="max-w-4xl space-y-6 pt-4 pb-4" id="ink-hero">
          <div className="space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-bold block">
              {profile.heroTagline || `${profile.name || "Kreator"} • Official Rate Card`}
            </span>
            <h1 className="font-black text-4xl sm:text-6xl lg:text-7xl tracking-tighter leading-[1.04] text-[#0A0A0A]">
              {profile.heroTitle1 || `${profile.name || "Kreator"} Rate Card & Production Studio.`}
            </h1>
            {profile.heroTitleHighlight && (
              <p className="font-bold text-xl sm:text-2xl text-neutral-700 tracking-tight">
                {profile.heroTitleHighlight}
              </p>
            )}
          </div>

          <p className="text-base sm:text-lg text-neutral-600 font-normal leading-relaxed max-w-2xl">
            {profile.heroDescription || profile.bio || "Daftar tarif resmi kerja sama konten, review produk, dan sponsorship untuk brand berkualitas dengan standar editorial tinggi."}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={profile.whatsapp || `https://wa.me/?text=${encodeURIComponent('Halo, saya ingin menanyakan jadwal kolaborasi konten.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-h-11 px-6 py-3 rounded-md bg-[#0A0A0A] text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors shadow-xs"
            >
              Mulai Kolaborasi
            </a>
            <a
              href="#sow-pricing"
              className="inline-flex items-center justify-center min-h-11 px-6 py-3 rounded-md bg-[#F4F1EA] text-[#0A0A0A] text-xs font-bold uppercase tracking-wider hover:bg-[#EAE5DC] border border-black/5 transition-colors"
            >
              Lihat Tarif SOW
            </a>
          </div>
        </section>

        {/* 3. WORKFLOW SECTION ("Your first Saturday" style) */}
        <section className="pt-12 sm:pt-16 border-t border-neutral-200" id="ink-workflow">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* Left Column: Heading & Bicycle/Studio photo card */}
            <div className="lg:col-span-5 space-y-6">
              <h2 className="font-black text-3xl sm:text-4xl tracking-tight text-[#0A0A0A]">
                Alur Kerja Sama
              </h2>

              <div className="rounded-2xl border border-neutral-200 overflow-hidden bg-neutral-100 aspect-[4/5] sm:aspect-square max-w-sm shadow-xs group">
                <img 
                  src={profile.avatarUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2"} 
                  alt={profile.name} 
                  loading="lazy"
                  className="w-full h-full object-cover filter contrast-105"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-[#0A0A0A]">
                  {profile.name} Studio &amp; Production
                </p>
                <p className="text-[11px] text-neutral-500 font-sans">
                  {profile.domicile || "Indonesia"} • Est. {profile.studioEstdYear || "2024"}
                </p>
              </div>
            </div>

            {/* Right Column: 4-Step Numbered Process */}
            <div className="lg:col-span-7">
              <p className="text-xs sm:text-sm text-neutral-500 font-sans mb-8">
                Dari brief awal hingga konten tayang, dalam 4 tahapan transparan:
              </p>

              <div className="space-y-8 divide-y divide-neutral-200">
                
                {/* Step 1 */}
                <div className="space-y-2">
                  <span className="block font-black text-5xl sm:text-6xl text-neutral-300 leading-none">
                    1
                  </span>
                  <h3 className="font-black text-xl sm:text-2xl text-[#0A0A0A] tracking-tight">
                    Kirimkan Brief &amp; Unit Produk
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-lg">
                    Brand mengonfirmasi objektif kampanye, USP kunci produk, dan mengirimkan unit produk fisik ke studio.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="pt-8 space-y-2">
                  <span className="block font-black text-5xl sm:text-6xl text-neutral-300 leading-none">
                    2
                  </span>
                  <h3 className="font-black text-xl sm:text-2xl text-[#0A0A0A] tracking-tight">
                    Draf Naskah &amp; Alur Cerita
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-lg">
                    Konsep hook naratif dan storyboard visual disiapkan dalam 2 hari kerja dengan kesempatan 1x penyesuaian gratis.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="pt-8 space-y-2">
                  <span className="block font-black text-5xl sm:text-6xl text-neutral-300 leading-none">
                    3
                  </span>
                  <h3 className="font-black text-xl sm:text-2xl text-[#0A0A0A] tracking-tight">
                    Produksi Editorial Berstandar Tinggi
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-lg">
                    Shooting menggunakan pencahayaan alami &amp; audio jernih berstandar editorial profesional dengan visual otentik.
                  </p>
                </div>

                {/* Step 4 */}
                <div className="pt-8 space-y-2">
                  <span className="block font-black text-5xl sm:text-6xl text-neutral-300 leading-none">
                    4
                  </span>
                  <h3 className="font-black text-xl sm:text-2xl text-[#0A0A0A] tracking-tight">
                    Penayangan &amp; Laporan Analitik
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-lg">
                    Konten tayang pada jam tayang prima dan rekapan performa analitik dikirimkan setelah 7 hari penayangan.
                  </p>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* 4. MANIFESTO BANNER QUOTE (Barton Road Centerpiece) */}
        <section className="py-12 sm:py-16 border-y border-neutral-200" id="ink-manifesto">
          <h2 className="font-black text-3xl sm:text-5xl lg:text-6xl tracking-tighter leading-[1.08] text-[#0A0A0A] max-w-4xl">
            Konten otentik dengan audiens terarah untuk brand yang menghargai kualitas narasi.
          </h2>
        </section>

        {/* 5. AUDIENCE REACH & SCHEDULE (Barton "Saturdays, 10 to 2" Table Style) */}
        {stats.length > 0 && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start" id="ink-stats">
            <div className="lg:col-span-5 space-y-2">
              <h2 className="font-black text-3xl sm:text-4xl tracking-tight text-[#0A0A0A]">
                Jangkauan &amp; Metrik Audiens
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 font-sans">
                Data performa rata-rata akun resmi kreator yang terverifikasi.
              </p>
            </div>

            <div className="lg:col-span-7 divide-y divide-neutral-200 border-t border-neutral-200">
              {stats.map((stat, idx) => (
                <div key={idx} className="py-4 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-black text-base sm:text-lg text-[#0A0A0A]">
                      {stat.label}
                    </h3>
                    {stat.desc && (
                      <p className="text-xs text-neutral-500 mt-0.5">{stat.desc}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-black font-mono text-base sm:text-lg text-[#0A0A0A]">
                      {stat.value}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-900 text-white font-mono">
                      Aktif
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. TABULAR SOW PRICING PACKAGES */}
        <section className="space-y-8 scroll-mt-20 pt-4" id="sow-pricing">
          <div className="border-b border-neutral-200 pb-4">
            <h2 className="font-black text-3xl sm:text-4xl tracking-tight text-[#0A0A0A]">
              {profile.pricingTitle || "Daftar Layanan & Paket Kolaborasi"}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              {profile.pricingDescription || "Rincian biaya paket penempatan dan cakupan deliverables konten resmi."}
            </p>
          </div>

          <div className="divide-y divide-neutral-200 border-y border-neutral-200">
            {activeServices.length > 0 ? (
              activeServices.map((service) => (
                <div 
                  key={service.id}
                  className="py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start hover:bg-neutral-50/60 px-2 sm:px-4 rounded-xl transition-colors"
                >
                  {/* Title & Category */}
                  <div className="lg:col-span-4 space-y-1">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-500 font-bold">
                      {service.category || 'Official Placement'}
                    </span>
                    <h3 className="font-black text-xl text-[#0A0A0A] tracking-tight">
                      {service.title}
                    </h3>
                    <div className="pt-2">
                      <span className="text-2xl sm:text-3xl font-black font-mono text-[#0A0A0A]">
                        {service.price}
                      </span>
                    </div>
                  </div>

                  {/* Deliverables Breakdown */}
                  <div className="lg:col-span-5 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">
                      Deliverables
                    </span>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-neutral-700">
                      {(service.description || "Produksi dan publikasi video sesuai konsep yang disepakati.")
                        .split('.')
                        .map(s => s.trim())
                        .filter(s => s.length > 0)
                        .map((bullet, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-2 leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 mt-2 shrink-0" />
                            <span>{bullet}.</span>
                          </li>
                        ))}
                    </ul>

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
                      href={profile.whatsapp ? `${profile.whatsapp}?text=${encodeURIComponent(`Halo, saya berminat memesan paket: ${service.title} (${service.price}). Bisakah kita diskusikan ketersediaan jadwal?`)}` : '#ink-card'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-md bg-[#0A0A0A] hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
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
        </section>

        {/* 7. RECENT VIDEO PROJECTS / SHOWCASE */}
        {projects && projects.length > 0 && (
          <section className="space-y-6 pt-4" id="ink-projects">
            <div className="border-b border-neutral-200 pb-4">
              <h2 className="font-black text-3xl sm:text-4xl tracking-tight text-[#0A0A0A]">
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
                  className="group block border border-neutral-200 rounded-xl overflow-hidden hover:border-black transition-all bg-white"
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
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#0A0A0A] text-white">
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
                    <h3 className="font-bold text-sm text-[#0A0A0A] leading-snug group-hover:underline">
                      {project.title}
                    </h3>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* 8. BRAND PARTNERS LOGOS */}
        {activeBrands.length > 0 && (
          <section className="space-y-6 pt-4" id="ink-brands">
            <div className="border-b border-neutral-200 pb-4">
              <h2 className="font-black text-2xl sm:text-3xl tracking-tight text-[#0A0A0A]">
                {profile.brandsTitle || "Brand Partners"}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                Koleksi brand yang telah berkolaborasi dalam berbagai kampanye.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {activeBrands.map((brand) => (
                <div
                  key={brand.id}
                  className="h-16 rounded-xl border border-neutral-200 bg-white flex items-center justify-center p-3 hover:border-black transition-colors"
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
                    <span className="font-bold text-xs text-[#0A0A0A] truncate">
                      {brand.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 9. BARTON ROAD BLACK MEMBERSHIP CARD SECTION ("£15 covers a whole year") */}
        <section className="py-12 sm:py-16 bg-[#F7F5F0] -mx-4 sm:-mx-8 px-4 sm:px-8 border-y border-neutral-200 rounded-none sm:rounded-2xl" id="ink-card">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            
            {/* The Iconic Black Card */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-[#0A0A0D] text-white p-7 sm:p-8 border border-neutral-800 shadow-xl flex flex-col justify-between min-h-[240px]">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                      Official Creator Partnership
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  
                  <h3 className="font-black text-2xl sm:text-3xl tracking-tight mt-6 text-white">
                    {profile.name || "Aesthetic Creator"}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                    {profile.bio || "Content Creator & Home Living"}
                  </p>
                </div>

                <div className="pt-6 border-t border-neutral-800/80 flex items-center justify-between mt-6">
                  <div className="text-[11px] font-mono text-neutral-400">
                    <span>Active Member </span>
                    <span className="text-white font-bold">{new Date().getFullYear()}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E3F7F2] text-[#0B6E59]">
                    Valid
                  </span>
                </div>
              </div>
            </div>

            {/* Consultation Action Box */}
            <div className="lg:col-span-7 space-y-4">
              <h2 className="font-black text-3xl sm:text-4xl tracking-tight text-[#0A0A0A]">
                {profile.contactTitle || "Mulai Diskusi Kolaborasi"}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-lg">
                {profile.contactDescription || "Tinggalkan pesan mengenai ide kampanye, jadwal peluncuran, atau permintaan penawaran paket kustom."}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={profile.whatsapp || `https://wa.me/?text=${encodeURIComponent('Halo, saya ingin menanyakan kerja sama brand.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center min-h-11 px-5 py-3 rounded-md bg-[#0A0A0A] hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-colors gap-2 shadow-xs"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>Hubungi via WhatsApp</span>
                </a>
                
                <a
                  href={`mailto:${profile.email || "creator@example.com"}?subject=Penawaran Kolaborasi Brand`}
                  className="inline-flex items-center justify-center min-h-11 px-5 py-3 rounded-md bg-white hover:bg-neutral-100 text-[#0A0A0A] border border-neutral-300 text-xs font-bold uppercase tracking-wider transition-colors gap-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Kirim Email Resmi</span>
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* 10. TERMS & COLLABORATION POLICIES */}
        <section className="space-y-6 pt-4" id="ink-terms">
          <div className="border-b border-neutral-200 pb-4">
            <h2 className="font-black text-2xl sm:text-3xl tracking-tight text-[#0A0A0A]">
              {profile.termsTitle || "Syarat & Ketentuan Kolaborasi"}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              {profile.termsDescription || "Ketentuan kerja sama demi memastikan proses produksi berjalan transparan dan terukur."}
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

      </main>

      {/* 11. BREADCRUMB / ARCHITECTURAL FOOTER */}
      <footer className="w-full border-t border-neutral-200 bg-white py-12 text-xs text-neutral-500 font-sans">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="space-y-1">
            <p className="font-bold text-[#0A0A0A]">
              {profile.name} Studio
            </p>
            <p className="text-[11px] text-neutral-400">
              Official Rate Card &amp; Collaboration Portfolio. © {new Date().getFullYear()}. All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            {profile.instagram && (
              <a href={profile.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">
                Instagram
              </a>
            )}
            {profile.tiktok && (
              <a href={profile.tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">
                TikTok
              </a>
            )}
            {profile.youtube && (
              <a href={profile.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">
                YouTube
              </a>
            )}
            <button onClick={onNavigateToAdmin} className="text-neutral-400 hover:text-black transition-colors cursor-pointer">
              Admin
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
