import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Instagram, 
  Youtube, 
  Lock, 
  Sparkles, 
  TrendingUp, 
  ArrowUpRight,
  Bookmark,
  Zap,
  CheckCircle,
  HelpCircle,
  MessagesSquare,
  Globe,
  Monitor,
  Loader2
} from 'lucide-react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { RatecardProfile, RatecardService, RatecardProject, RatecardBrand } from '../types';

interface RatecardViewProps {
  profile: RatecardProfile;
  services: RatecardService[];
  projects: RatecardProject[];
  brands?: RatecardBrand[];
  onNavigateBack: () => void;
  onNavigateToAdmin: () => void;
}

// Custom WhatsApp SVG Icon for top tier UI
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

// Super cohesive dark mode skeleton matching the premium creative design aesthetic
const RatecardSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#111115" highlightColor="#1A1A24">
      <div className="w-full max-w-7xl mx-auto py-10 space-y-24 animate-pulse">
        {/* Hero Section Skeleton */}
        <div className="pt-8 pb-16 flex flex-col items-center text-center space-y-6">
          <div className="flex justify-center">
            <Skeleton width={260} height={24} className="rounded-full" />
          </div>
          <div className="flex justify-center">
            <Skeleton width={420} height={52} className="rounded-xl" />
          </div>
          <div className="flex justify-center max-w-lg mx-auto w-full px-4">
            <div className="w-full space-y-2 mt-2">
              <Skeleton width="100%" height={16} className="rounded" />
              <Skeleton width="80%" height={16} className="rounded mx-auto" />
            </div>
          </div>
          
          {/* Avatar Area Mock */}
          <div className="w-56 h-56 rounded-full overflow-hidden border border-white/[0.04] mx-auto mt-8 flex items-center justify-center bg-[#111115]">
            <Skeleton circle height="100%" width="100%" />
          </div>

          <div className="flex gap-4 justify-center pt-6 max-w-sm mx-auto w-full px-4">
            <Skeleton width={120} height={36} className="rounded-full" />
            <Skeleton width={120} height={36} className="rounded-full" />
          </div>
        </div>

        {/* Stats Section Skeletons */}
        <div className="space-y-6">
          <div className="flex justify-center">
            <Skeleton width={200} height={20} className="rounded-full" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-[#111115]/50 border border-white/[0.03] p-6 rounded-3xl space-y-3">
                <Skeleton width={70} height={36} className="rounded-lg" />
                <Skeleton width={110} height={18} className="rounded" />
                <Skeleton width="100%" height={12} className="rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

const renderDefaultSvg = (name: string) => {
  const normalized = name.toLowerCase().trim();
  if (normalized === 'ikea') {
    return (
      <svg viewBox="0 0 100 40" className="w-full h-full opacity-80 hover:opacity-100 transition-opacity">
        <rect width="100" height="40" fill="#FFDA1A" rx="4" />
        <ellipse cx="50" cy="20" rx="46" ry="17" fill="#0051BA" />
        <text x="50" y="27" fontFamily="Inter, sans-serif" fontWeight="900" fontSize="20" fill="#FFDA1A" textAnchor="middle" letterSpacing="0.5">IKEA</text>
      </svg>
    );
  }
  if (normalized === 'bose') {
    return (
      <svg viewBox="0 0 100 40" className="w-full h-full opacity-70 hover:opacity-100 transition-opacity">
        <text x="50" y="26" fontFamily="sans-serif" fontWeight="900" fontStyle="italic" fontSize="22" fill="#FFFFFF" textAnchor="middle" letterSpacing="-1">BOSE</text>
      </svg>
    );
  }
  if (normalized === 'midea') {
    return (
      <svg viewBox="0 0 100 40" className="w-full h-full opacity-80 hover:opacity-100 transition-opacity">
        <text x="45" y="24" fontFamily="sans-serif" fontWeight="bold" fontSize="16" fill="#0072C6" textAnchor="middle">Midea</text>
        <path d="M72,12 C78,16 78,24 72,28" stroke="#F18A00" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
    );
  }
  if (normalized === 'indomaret') {
    return (
      <div className="w-full h-full flex flex-col justify-center">
        <div className="w-full h-1.5 flex">
          <div className="flex-1 bg-[#004A99] rounded-tl-sm" />
          <div className="flex-1 bg-[#E41F26]" />
          <div className="flex-1 bg-[#FFF200] rounded-tr-sm" />
        </div>
        <div className="flex-1 w-full flex items-center justify-center bg-[#004A99]/20 rounded-b-sm">
          <span className="text-[10px] font-black tracking-wider text-white">Indomaret</span>
        </div>
      </div>
    );
  }
  if (normalized === 'mr diy' || normalized === 'mr.d.i.y' || normalized === 'mr. d.i.y') {
    return (
      <div className="flex items-center gap-1.5 opacity-85">
        <div className="w-4 h-4 rounded-full bg-[#FFD700] border border-[#D81E21] flex items-center justify-center text-[8px] font-black text-[#D81E21]">🛠️</div>
        <span className="text-[11px] font-black text-[#D81E21] tracking-tighter">MR.D.I.Y</span>
      </div>
    );
  }
  if (normalized === 'olymplast') {
    return (
      <div className="flex flex-col items-center justify-center opacity-80">
        <span className="text-[10px] font-black text-emerald-400 tracking-tight">OLYMPLAST</span>
        <span className="text-[5px] font-bold text-slate-500 uppercase tracking-widest">Furniture</span>
      </div>
    );
  }
  if (normalized === 'polki') {
    return (
      <div className="flex items-center gap-1 opacity-80">
        <span className="text-xs font-black font-mono italic text-blue-400 tracking-wider">POLKI</span>
        <span className="text-xs">✨</span>
      </div>
    );
  }
  if (normalized === 'home guard') {
    return (
      <div className="flex items-center gap-1 text-[10px] font-black text-rose-400 opacity-80">
        <span>🛡️</span>
        <span className="leading-none text-left tracking-tighter text-[8px]">HOME GUARD</span>
      </div>
    );
  }
  if (normalized === 'meco') {
    return (
      <div className="flex items-center gap-1.5 opacity-80">
        <div className="w-3 h-3 rounded-full bg-pink-500" />
        <span className="text-[10px] font-black text-pink-400 font-sans tracking-widest">meco</span>
      </div>
    );
  }
  if (normalized === 'advance') {
    return (
      <div className="flex flex-col items-center justify-center">
        <span className="text-[10px] font-black text-sky-400 italic uppercase">ADVANCE</span>
        <span className="text-[5px] font-bold text-slate-500 uppercase tracking-widest">Advancing Life</span>
      </div>
    );
  }
  return <span className="text-xs font-bold text-slate-300 group-hover:text-white uppercase tracking-widest text-center px-1 truncate">{name}</span>;
}

const BrandLogoList = ({ brands = [] }: { brands?: RatecardBrand[] }) => {
  const activeBrands = (brands || [])
    .filter(b => b.isActive !== false)
    .sort((a, b) => (a.priority || 0) - (b.priority || 0));

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 justify-items-center justify-center pt-2 w-full">
      {activeBrands.map(brand => (
        <div 
          key={brand.id} 
          className="bg-[#121218]/40 backdrop-blur-md rounded-2xl p-4 h-16 w-full max-w-[150px] flex items-center justify-center border border-white/5 hover:border-white/10 hover:scale-[1.03] transition-all duration-300 group" 
          title={brand.name}
        >
          {brand.logoUrl ? (
            <img 
              src={brand.logoUrl} 
              alt={brand.name} 
              referrerPolicy="no-referrer"
              loading="lazy"
              className="max-h-full max-w-full object-contain opacity-80 hover:opacity-100 transition-opacity" 
            />
          ) : (
            renderDefaultSvg(brand.name)
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
  
  // Track loading status
  const [isPageLoaded, setIsPageLoaded] = React.useState(false);

  // Smooth loading behavior with scroll-locking and asset transition delay
  React.useEffect(() => {
    // Scroll-lock to prevent "stuck / jerky scrolling" on mobile before elements render
    if (!isPageLoaded) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }

    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 1500); // 1.5 seconds layout preparation window

    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      clearTimeout(timer);
    };
  }, [isPageLoaded]);

  const stats = profile.stats && profile.stats.length > 0 ? profile.stats : [
    { value: "60 K", label: "Instagram Followers", desc: "Highly engaged home & setup niche" },
    { value: "1 M", label: "Monthly Reach", desc: "Consistent organic impressions standard" },
    { value: "76 %", label: "Women Followers", desc: "Premium aesthetic layout interest" },
    { value: "6 %", label: "Engagement Rate", desc: "High conversion compared to global median" },
    { value: "8 K", label: "Tiktok Followers", desc: "Rapidly growing creative design workspace" }
  ];

  const termsOfService = profile.termsOfService && profile.termsOfService.length > 0 ? profile.termsOfService : [
    "Proses produksi konten maksimal 1 minggu setelah menerima produk/barang.",
    "Jika ada brief atau point penting wajib disampaikan sebelum kesepakatan produksi.",
    "Pembayaran 100% di awal sebelum produksi dimulai dan harga di atas belum termasuk pajak.",
    "Client/Brand berhak menerima draf script konten dan diberikan kesempatan revisi maksimal 1x.",
    "Semua video, ide kreatif, dan style editing disesuaikan dengan style visual aesthetic creator.",
    "Diberikan kesempatan revisi minor video 1x gratis (hanya untuk editing teks atau voice over).",
    "Negosiasi harga khusus tersedia bagi pengambilan minimal 3 SOW sekaligus.",
    "Berhak melakukan takedown konten apabila melanggar regulasi hukum tanpa refund."
  ];

  // Scroll to specified section helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0B0B0F] text-[#F3F4F6] font-sans antialiased selection:bg-[#8B82F6] selection:text-black relative overflow-x-hidden touch-action-pan-y flex flex-col">
      
      {/* Background Decor Wrapper to prevent any absolute overflow or empty space */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Dynamic Absolute Abstract Glowing Orbs (Premium Awwwards visual style) */}
        <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] max-w-[840px] bg-gradient-to-br from-[#8B82F6]/15 to-[#7C3AED]/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-[40%] left-[-15%] w-[50vw] h-[50vw] max-w-[700px] bg-gradient-to-tr from-[#9333EA]/10 to-[#8B82F6]/5 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[55vw] h-[55vw] max-w-[800px] bg-gradient-to-tr from-[#7C3AED]/12 to-transparent rounded-full blur-[130px] pointer-events-none" />

        {/* Ambient Grid Overlay Accent for high-end studio feel */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      </div>

      {/* Top Header Premium Bar */}
      <div className="w-full relative z-25">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-6 flex items-center justify-between border-b border-white/[0.04]">
          <div className="flex items-center gap-4">
            <button 
              onClick={onNavigateBack}
              className="group flex items-center gap-2.5 text-xs font-mono font-bold tracking-widest uppercase text-slate-400 hover:text-white transition-all py-2 px-4 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08]"
              id="premium-header-back"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {!isPageLoaded ? (
              <span className="text-[10px] font-mono tracking-[0.25em] text-amber-400 font-bold uppercase py-1 px-3 rounded-full bg-amber-500/10 border border-amber-500/20 animate-pulse flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping animate-duration-1000" />
                <span>PREPARING ASSETS</span>
              </span>
            ) : (
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#8B82F6] font-bold uppercase py-1 px-3 rounded-full bg-[#8B82F6]/10 border border-[#8B82F6]/15 animate-fade-in">
                CREATIVE PORTFOLIO
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Luxury Sandbox Container */}
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 py-10 relative z-20 space-y-24 flex-grow">
        {!isPageLoaded ? (
          <RatecardSkeleton />
        ) : (
          <>
            {/* ================= HERO SECTION ================= */}
        <section className="pt-8 pb-16 md:pt-12 md:pb-20 flex flex-col justify-center text-center relative" id="agency-hero">
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Minimal Tagline Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.06] text-xs font-mono text-slate-300 w-max mx-auto tracking-wide"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#8B82F6] animate-pulse" />
              <span>{profile.heroTagline || "STYLISH SPACE & HOME UPGRADES CREATOR"}</span>
            </motion.div>

            {/* Giant Bold Headline inspired by Awwwards Webflow Studio template config */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl sm:text-7xl lg:text-8xl font-sans font-black tracking-tight text-white leading-[0.95]"
              id="luxury-headline"
            >
              {profile.heroTitle1 || "We Design Digital"} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B82F6] via-[#B8A3FF] to-[#D580FF] relative">
                {profile.heroTitleHighlight || "Experiences"}
                <span className="absolute bottom-1 left-0 w-full h-[6px] bg-gradient-to-r from-[#7C3AED] to-[#9333EA] opacity-35 rounded-full" />
              </span>
            </motion.h1>

            {/* Subheadline explaining the digital design studio */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed font-light font-sans"
            >
              {profile.heroDescription || `We curate minimalist workstation setups, premium home upgrades, and cinematic tech content that captures millions of eyeballs. Welcome to the official workflow, rates, and verified organic stats.`}
            </motion.p>
          </div>

          {/* Luxury Floating UI Feature Preview Card of Creator's Core Vibe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0, delay: 0.4 }}
            className="mt-16 w-full max-w-5xl mx-auto"
          >
            <div className="relative group bg-[#111115]/80 backdrop-blur-md rounded-[2.5rem] border border-white/[0.06] p-6 sm:p-12 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col lg:flex-row items-center gap-12 text-left">
              
              {/* Absolutes for Glowing Glassmorphism Details */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#8B82F6]/10 rounded-full blur-[80px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-60 h-60 bg-[#9333EA]/5 rounded-full blur-[60px] pointer-events-none" />

              {/* Avatar Bridge Design Shape Portrait */}
              <div className="relative shrink-0 w-[240px] h-[340px] sm:w-[280px] sm:h-[390px] rounded-[48px] overflow-hidden border border-white/10 shadow-2xl group-hover:border-[#8B82F6]/30 transition-all duration-500">
                <img 
                  src={profile.avatarUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2"} 
                  alt={profile.name} 
                  loading="lazy"
                  className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F]/90 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 font-mono text-[10px] tracking-[0.2em] font-extrabold uppercase bg-white/10 backdrop-blur-md text-[#8B82F6] py-1.5 px-3 rounded-full border border-white/15">
                  {(() => {
                    const val = profile.studioEstdYear || "2026";
                    const normalized = val.toUpperCase();
                    if (normalized.includes("EST") || normalized.includes("SINCE") || normalized.includes("ESTABLISHED")) {
                      return val;
                    }
                    return `ESTD ${val}`;
                  })()}
                </div>
              </div>

              {/* Identity Descriptions */}
              <div className="flex-1 space-y-6">
                <div>
                  <span className="text-xs font-mono tracking-[0.3em] font-extrabold text-[#8B82F6] uppercase">
                    {profile.studioDirectorTitle || "STUDIO DIRECTOR"}
                  </span>
                  <h2 className="text-4xl sm:text-5xl font-sans font-black text-white tracking-tight mt-1.5">
                    {profile.name}
                  </h2>
                </div>

                <p className="text-slate-400 text-base leading-relaxed font-light">
                  {profile.bio || "Saya sangat menyukai segala tentang peralatan rumah tangga, dekorasi rumah aesthetic, dan minimalis setups. Membagikan pengalaman organik nyata yang mengedukasi dan menginspirasi jutaan audiens di media sosial secara konsisten."}
                </p>

                {/* Micro Metrics inline */}
                <div className="grid grid-cols-2 pt-4 border-t border-white/[0.04] gap-6">
                  <div>
                    <span className="block text-[11px] font-mono uppercase tracking-widest text-[#8B82F6]">CREATOR PROFILE</span>
                    <span className="block text-white text-md font-sans font-bold mt-1">{profile.name}</span>
                  </div>
                  <div>
                    <span className="block text-[11px] font-mono uppercase tracking-widest text-[#8B82F6]">LATEST GEOGRAPHY</span>
                    <span className="block text-white text-md font-sans font-bold mt-1">Tangerang, Indonesia</span>
                  </div>
                </div>

                {/* Social Channels Row */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {profile.instagram && (
                    <a 
                      href={profile.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 px-4.5 py-2.5 rounded-full bg-[#1A1A22] text-slate-300 hover:text-white border border-white/[0.05] hover:border-pink-500/30 transition-all font-mono text-xs hover:bg-[#1A1A22]/80"
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
                      className="inline-flex items-center gap-2.5 px-4.5 py-2.5 rounded-full bg-[#1A1A22] text-slate-300 hover:text-white border border-white/[0.05] hover:border-slate-100/30 transition-all font-mono text-xs hover:bg-[#1A1A22]/80"
                    >
                      <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
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
                      className="inline-flex items-center gap-2.5 px-4.5 py-2.5 rounded-full bg-[#1A1A22] text-slate-300 hover:text-white border border-white/[0.05] hover:border-red-500/30 transition-all font-mono text-xs hover:bg-[#1A1A22]/80"
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
                      className="inline-flex items-center gap-2.5 px-4.5 py-2.5 rounded-full bg-[#1A1A22] text-slate-300 hover:text-white border border-white/[0.05] hover:border-emerald-500/30 transition-all font-mono text-xs hover:bg-[#1A1A22]/80"
                    >
                      <WhatsAppIcon className="w-4 h-4 text-emerald-500" />
                      <span>WhatsApp</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </section>


        {/* ================= STATS SECTION ================= */}
        <section className="space-y-10" id="stats-section">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.04] pb-6">
            <div>
              <span className="text-xs font-mono tracking-[0.3em] text-[#8B82F6] font-extrabold uppercase block">
                {profile.statsBadge || "ORGANIC REACH METRICS"}
              </span>
              <h2 className="text-3xl sm:text-5xl font-sans font-black text-white tracking-tight mt-1">
                {profile.statsTitle || "Verified Audience Traction"}
              </h2>
            </div>
            <p className="text-slate-400 text-sm max-w-sm">
              {profile.statsDescription || "Real-time Instagram Insight data with higher conversion & deep engagement than industry baseline standards."}
            </p>
          </div>

          {/* Premium Glowing Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {stats.map((stat, idx) => {
              const match = stat.value.trim().match(/^([\d.,]+)\s*(.*)$/);
              const numPart = match ? match[1] : stat.value;
              const suffixPart = match ? match[2] : "";

              return (
                <div 
                  key={idx}
                  className="group relative bg-[#0E0E13] border border-white/[0.03] hover:border-[#8B82F6]/25 rounded-[1.8rem] p-7 transition-all duration-300 shadow-xl overflow-hidden flex flex-col justify-between min-h-[190px]"
                >
                  {/* Micro Accent Glow on top corner */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-tr from-transparent to-[#8B82F6]/5 group-hover:to-[#8B82F6]/12 rounded-full transition-all duration-500 blur-xl pointer-events-none" />
                  
                  {/* Dynamic clean elegant number rendering */}
                  <div className="flex items-start font-sans font-black tracking-tighter text-[#E6E4D9]">
                    <span className="text-5xl sm:text-6xl leading-none">{numPart}</span>
                    {suffixPart && (
                      <span className="text-xl sm:text-2xl font-bold text-[#E6E4D9]/80 ml-0.5 leading-none pt-1">
                        {suffixPart}
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-8">
                    <h4 className="text-base sm:text-[17px] font-bold font-sans text-slate-200 tracking-tight leading-[1.12] group-hover:text-white transition-colors">
                      {stat.label}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-sans mt-2 leading-snug group-hover:text-slate-400 transition-colors">{stat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>


        {/* ================= INSTAGRAM PROJECTS SECTION ================= */}
        <section className="space-y-10" id="projects-section">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.04] pb-6">
            <div>
              <span className="text-xs font-mono tracking-[0.3em] text-[#8B82F6] font-extrabold uppercase block">
                {profile.projectsBadge || "CASE STUDIES"}
              </span>
              <h2 className="text-3xl sm:text-5xl font-sans font-black text-white tracking-tight mt-1">
                {profile.projectsTitle || "Our Recent Projects (Viral Videos)"}
              </h2>
            </div>
            <p className="text-slate-400 text-sm max-w-sm">
              {profile.projectsDescription || "Highly interactive design updates that caught viral attraction. Click any card to experience the live interactive link."}
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
                  className="group bg-[#111115]/50 border border-white/[0.04] rounded-[2rem] overflow-hidden hover:border-[#8B82F6]/20 transition-all duration-500 flex flex-col justify-between relative block cursor-pointer shadow-xl hover:-translate-y-1.5"
                >
                  <div className="aspect-[3/4] overflow-hidden relative bg-[#09090C] flex items-center justify-center">
                    <img 
                      src={project.imageUrl || "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=400"} 
                      alt={project.title} 
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                      referrerPolicy="no-referrer"
                    />
                    {/* Dark sleek gradient overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F]/95 via-[#0B0B0F]/45 to-black/25" />
                    
                    {/* Top Right views tag inside glass badge */}
                    <span className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-[#8B82F6] border border-white/[0.06] flex items-center gap-1.5 shadow-lg">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {project.views} Views
                    </span>

                    {/* Instagram Pink Badge */}
                    <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md p-2 rounded-xl border border-white/[0.06] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Instagram className="w-3.5 h-3.5 text-pink-500" />
                    </span>

                    {/* Video Text Mock overlay from PDF styled like screen elements of Ohio concept */}
                    <div className="absolute bottom-6 left-6 right-6 text-left space-y-2">
                      <span className="text-[10px] font-mono font-extrabold bg-[#8B82F6]/10 border border-[#8B82F6]/20 rounded-full px-3 py-1 text-[#8B82F6] uppercase tracking-widest block w-max">
                        {project.category}
                      </span>
                      <h4 className="text-xl font-sans font-black text-white leading-snug tracking-tight">
                        {project.title} <span className="text-yellow-400 block font-mono font-semibold mt-1"># {project.highlight}</span>
                      </h4>
                      
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono pt-3 border-t border-white/[0.05] group-hover:text-white transition-colors">
                        <span>View Reel Live</span>
                        <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </a>
              ))
            ) : (
              <div className="col-span-full py-16 text-center text-xs text-slate-500 font-mono border border-dashed border-white/[0.05] rounded-3xl">
                Ready to demonstrate your custom viral reels. Add new projects via your Admin Panel control.
              </div>
            )}
          </div>
        </section>


        {/* ================= PLACEMENTS RATE CARD SECTION (REDESIGNED) ================= */}
        <section className="space-y-10 scroll-mt-24" id="pricing-section">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.04] pb-6">
            <div>
              <span className="text-xs font-mono tracking-[0.3em] text-[#8B82F6] font-extrabold uppercase block">
                {profile.pricingBadge || "TRANSPARENT COLLABORATION RATES"}
              </span>
              <h2 className="text-3xl sm:text-5xl font-sans font-black text-white tracking-tight mt-1">
                {profile.pricingTitle || "Placements Rate Card"}
              </h2>
            </div>
            <p className="text-slate-400 text-sm max-w-sm">
              {profile.pricingDescription || "Extremely clear and clean pricing plans tailored for verified creative projects. No hidden costs."}
            </p>
          </div>

          {/* New Premium Grid: Readable, extremely transparent, NO "Hubungi Kolaborasi" button */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services && services.filter(s => s.isActive).length > 0 ? (
              services.filter(s => s.isActive).map((rate) => (
                <div 
                  key={rate.id}
                  className="group relative bg-[#111115]/50 hover:bg-[#131318]/80 border border-white/[0.04] hover:border-[#8B82F6]/30 rounded-[2.5rem] p-8 sm:p-10 transition-all duration-300 shadow-2xl flex flex-col justify-between overflow-hidden"
                >
                  {/* Premium Subtle Grid Background Accent inside card */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B82F6]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#8B82F6]/10 transition-all duration-500" />
                  
                  <div className="space-y-6">
                    {/* Header Stack: Large clearly readable category & gorgeous pricing view */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.05]">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#8B82F6] uppercase bg-[#8B82F6]/10 px-3 py-1 rounded-full border border-[#8B82F6]/15">
                          OFFICIAL PLACEMENT
                        </span>
                        <h3 className="text-xl sm:text-2xl font-sans font-extrabold text-white leading-tight">
                          {rate.title}
                        </h3>
                      </div>
                      
                      {/* Price Rendered beautifully & clearly with Satoshi-inspired massive typography */}
                      <div className="text-left sm:text-right shrink-0">
                        <span className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest leading-none mb-1">
                          Starts from
                        </span>
                        <span className="text-2xl sm:text-3xl font-mono font-black text-white tracking-tight whitespace-nowrap">
                          {rate.price}
                        </span>
                      </div>
                    </div>

                    {/* Highly readable main paragraph block */}
                    <div className="pt-2 text-left space-y-4 flex-1">
                      <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                        Description &amp; Deliverables
                      </span>
                      <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                        {(rate.description || "Video & production curation crafted inside premium setup workspace, optimizing viral presentation dynamics.")
                          .split('.')
                          .map(s => s.trim())
                          .filter(s => s.length > 0)
                          .map((bullet, bIdx) => (
                            <li key={bIdx} className="flex items-start gap-2.5 leading-relaxed">
                              <span className="p-0.5 rounded-full bg-white/[0.02] border border-white/[0.08] text-slate-400 shrink-0 mt-1">
                                <CheckCircle className="w-3 h-3 text-[#8B82F6]" />
                              </span>
                              <span>{bullet}.</span>
                            </li>
                          ))
                        }
                      </ul>
                    </div>

                    {/* Additional Fees - Tambahan biaya */}
                    <div className="pt-5 border-t border-white/[0.04]">
                      <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block font-bold mb-2.5 underline decoration-[#8B82F6]/60 underline-offset-4">
                        Tambahan biaya:
                      </span>
                      {rate.additionalFees && rate.additionalFees.length > 0 ? (
                        <ul className="space-y-1.5 text-xs text-slate-300">
                          {rate.additionalFees.map((fee, fIdx) => (
                            <li key={fIdx} className="flex justify-between items-start gap-4">
                              <span className="flex items-start gap-2 text-slate-300 text-[11px] sm:text-xs">
                                <span className="w-1 h-1 rounded-full bg-[#8B82F6] shrink-0 mt-1.5" />
                                <span>{fee.label}</span>
                              </span>
                              <span className="font-mono text-[11px] sm:text-xs font-bold text-white shrink-0">
                                {fee.value}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-[11px] text-slate-500 font-mono italic">
                          Teks biaya tambahan opsional.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center text-xs text-slate-500 font-mono border border-dashed border-white/[0.05] rounded-3xl">
                Belum ada data pricing plan tersimpan. Menggunakan default setup rate card.
              </div>
            )}
          </div>
        </section>


        {/* ================= BRANDS WORKED WITH ================= */}
        <section className="bg-gradient-to-b from-[#111115]/60 to-[#0F0F13]/90 border border-white/[0.05] rounded-[2.5rem] p-8 sm:p-12 space-y-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#8B82F6]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="text-center space-y-2">
            <span className="text-xs font-mono tracking-[0.3em] text-[#8B82F6] font-extrabold uppercase block">
              {profile.brandsBadge || "INDUSTRY COLLABORATIONS"}
            </span>
            <h3 className="text-2xl sm:text-3xl font-sans font-black text-white">
              {profile.brandsTitle || "Featured Brands We Worked With"}
            </h3>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <BrandLogoList brands={brands} />
          </div>
          
          <p className="text-[10px] font-mono text-slate-500 text-center uppercase tracking-[0.25em] pt-4">AND MORE THAN 50+ HOME DECOR &amp; TECH PARTNERS</p>
        </section>


        {/* ================= TERMS & CONDITIONS ================= */}
        <section className="space-y-10" id="terms-section">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.04] pb-6">
            <div>
              <span className="text-xs font-mono tracking-[0.3em] text-[#8B82F6] font-extrabold uppercase block">
                {profile.termsBadge || "TERMS OF SERVICES"}
              </span>
              <h2 className="text-3xl sm:text-5xl font-sans font-black text-white tracking-tight mt-1">
                {profile.termsTitle || "Syarat & Ketentuan"}
              </h2>
            </div>
            <p className="text-slate-400 text-sm max-w-sm">
              {profile.termsDescription || "Prosedur operasional standard yang adil, transparan, dan profesional untuk menjamin kelancaran kontrak konten."}
            </p>
          </div>

          {/* Clean downward-flowing bullet point list */}
          <div className="bg-[#111115]/40 border border-white/[0.04] rounded-[2.5rem] p-8 sm:p-12 flex flex-col gap-5 shadow-xl">
            {termsOfService.map((term, tIdx) => (
              <div 
                key={tIdx} 
                className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.01] border border-white/[0.02] hover:bg-white/[0.02] transition-colors"
              >
                <span className="flex-shrink-0 w-2 h-2 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9333EA] shadow-[0_0_10px_rgba(139,130,246,0.8)] mt-2" />
                <p className="text-xs text-slate-350 leading-relaxed font-sans">{term}</p>
              </div>
            ))}
          </div>
        </section>


        {/* ================= CONTACT SECTION & FOOTER ================= */}
        <section className="scroll-mt-24" id="contact-section">
          <div className="bg-gradient-to-br from-[#121218]/80 via-[#0B0B0F] to-[#121218]/50 border border-white/[0.05] rounded-[3rem] p-8 sm:p-16 text-center space-y-8 relative overflow-hidden shadow-2xl">
            
            {/* Absolute Deep Radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,130,246,0.08)_0%,transparent_70%)] pointer-events-none" />
            
            <div className="space-y-4 max-w-3xl mx-auto">
              <span className="text-xs font-mono tracking-[0.3em] font-extrabold text-[#8B82F6] bg-white/5 py-1.5 px-4 rounded-full border border-white/5 inline-block">
                SECURE COLLABORATION
              </span>
              <h2 className="text-4xl sm:text-6xl font-sans font-black text-white leading-[1.05] tracking-tight">
                LET'S WORK TOGETHER <br />
                AND CREATE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B82F6] to-[#D580FF]">SOMETHING GREAT</span>
              </h2>
              <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto font-light font-sans pt-2">
                Have a customized target or specific scope of work? Connect with design studio lead, {profile.name || "creative director"}.
              </p>
            </div>

            {/* Premium details block */}
            <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 text-left border-y border-white/[0.05] py-8 my-8">
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-bold uppercase text-[#8B82F6] block tracking-widest">
                  CONTACT NUMBER / WA
                </span>
                <a href={profile.whatsapp || "https://wa.me/15550199"} target="_blank" rel="noopener noreferrer" className="text-lg font-mono font-bold text-white hover:text-[#8B82F6] block transition-colors">
                  {profile.contactPhone || "Configure Phone Number"}
                </a>
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-bold uppercase text-[#8B82F6] block tracking-widest">
                  DOMICILE &amp; STUDIO LOCATION
                </span>
                <p className="text-base text-slate-300 font-sans font-light">
                  {profile.domicile || "Configure Location / Domicile"}
                </p>
              </div>
            </div>

            {/* Real CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a 
                href={`mailto:${profile.email || "creator@example.com"}?subject=Kolaborasi Brand`}
                className="px-8 py-4 bg-white text-black hover:bg-slate-200 text-xs font-bold font-sans uppercase rounded-full transition-all duration-300 tracking-wider shadow-lg hover:scale-[1.03]"
              >
                Send Business Email
              </a>
              
              {profile.whatsapp && (
                <a 
                  href={profile.whatsapp} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-bold font-sans uppercase rounded-full transition-all duration-300 tracking-wider flex items-center gap-2 shadow-lg hover:scale-[1.03]"
                >
                  <WhatsAppIcon className="w-4 h-4 text-white" />
                  <span>Connect WhatsApp</span>
                </a>
              )}
            </div>
          </div>
        </section>
          </>
        )}

      </div>

      {/* Styled Minimal Footer */}
      <footer className="w-full border-t border-white/[0.04] py-12 relative z-25 bg-[#08080B]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500 font-mono">
          <p>© 2026 {profile.name || "Creator Studio"}. All trademark and intellectual properties reserved.</p>
          <div className="flex items-center gap-6">
            <p className="text-[#8B82F6]/60">Design studio powered by Antigravity</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
