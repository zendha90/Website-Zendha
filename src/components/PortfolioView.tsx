import React, { useState, useRef } from 'react';
import { 
  Play, 
  Pause,
  Volume2,
  VolumeX,
  ArrowUpRight, 
  Instagram, 
  Video as VideoIcon, 
  Film, 
  ExternalLink, 
  ArrowLeft, 
  Mail, 
  MessageSquare, 
  Sparkles, 
  X, 
  SlidersHorizontal
} from 'lucide-react';
import { RatecardProfile, PortfolioReel } from '../types';

interface PortfolioViewProps {
  profile: RatecardProfile;
  reels?: PortfolioReel[];
  onNavigateToHome: () => void;
  onNavigateToRatecard: () => void;
  onNavigateToAdmin?: () => void;
}

// Subcomponent for individual video card with inline video player
function ReelCard({ reel }: { reel: PortfolioReel; key?: React.Key }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const isInstagram = reel.videoUrl && (reel.videoUrl.includes('instagram.com/reel/') || reel.videoUrl.includes('instagram.com/p/'));
  let instagramShortcode: string | null = null;
  if (isInstagram && reel.videoUrl) {
    const match = reel.videoUrl.match(/instagram\.com\/(?:reel|p)\/([^/?#&]+)/);
    instagramShortcode = match ? match[1] : null;
  }

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error("Video play error:", err);
      });
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="group relative aspect-[9/16] rounded-xl overflow-hidden bg-[#1a1c1c] border border-[#333535] hover:border-[#8e9192] transition-all duration-300 flex flex-col justify-between">
      {/* Video / Image Area */}
      <div className="absolute inset-0 w-full h-full bg-black overflow-hidden">
        {instagramShortcode ? (
          <iframe
            src={`https://www.instagram.com/p/${instagramShortcode}/embed`}
            className="w-full h-full border-0 bg-black"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowTransparency={true}
            title={reel.title}
          />
        ) : reel.videoUrl ? (
          <>
            <video
              ref={videoRef}
              src={reel.videoUrl}
              poster={reel.coverImageUrl}
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover cursor-pointer"
              onClick={togglePlay}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            {/* Play/Pause Controller Overlay */}
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause video" : "Play video"}
              className={`absolute inset-0 m-auto w-14 h-14 rounded-full bg-black/60 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-300 cursor-pointer ${
                isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100 scale-100'
              }`}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-current" />
              ) : (
                <Play className="w-6 h-6 fill-current translate-x-0.5" />
              )}
            </button>

            {/* Mute/Unmute Toggle Button (Top Right) */}
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute video" : "Mute video"}
              className="absolute top-3 right-3 z-20 p-2 rounded-lg bg-black/70 text-white/80 hover:text-white backdrop-blur-md border border-white/10 transition-colors cursor-pointer"
              title={isMuted ? "Aktifkan Suara" : "Matikan Suara"}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
            </button>
          </>
        ) : (
          <img
            src={reel.coverImageUrl}
            alt={reel.title}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Gradient Bottom Overlay for Text Readability */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0c0f0f] via-[#0c0f0f]/80 to-transparent pointer-events-none z-10" />

      {/* Top Left Tag */}
      <div className="relative z-20 p-4">
        <span className="px-2.5 py-1 rounded bg-[#121414]/80 backdrop-blur-md border border-[#444748] text-[10px] font-['JetBrains_Mono',monospace] text-[#c4c7c7] uppercase tracking-wider">
          {reel.category || 'REEL'}
        </span>
      </div>

      {/* Bottom Title Label (Technical Obsidian Studio Style) */}
      <div className="relative z-20 p-4 font-['JetBrains_Mono',monospace] flex items-center justify-between text-xs tracking-wider">
        <div className="truncate pr-2 text-slate-200 font-medium">
          <span className="text-[#8e9192] uppercase">{reel.category || 'REEL'} // </span>
          <span className="text-white uppercase font-bold">{reel.title}</span>
        </div>
        {reel.videoUrl && isInstagram && (
          <a
            href={reel.videoUrl}
            target="_blank"
            rel="noreferrer"
            className="p-1 text-slate-400 hover:text-white transition-colors"
            title="Buka Reel di Instagram"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}

export default function PortfolioView({
  profile,
  reels = [],
  onNavigateToHome,
  onNavigateToRatecard,
  onNavigateToAdmin
}: PortfolioViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [showHireModal, setShowHireModal] = useState<boolean>(false);

  // Filter active reels
  const activeReels = reels.filter(r => r.isActive);

  // Extract unique categories
  const categories = ['ALL', ...Array.from(new Set(activeReels.map(r => r.category.toUpperCase())))];

  // Filtered reels list
  const filteredReels = selectedCategory === 'ALL' 
    ? activeReels 
    : activeReels.filter(r => r.category.toUpperCase() === selectedCategory);

  const studioName = profile.name ? profile.name.toUpperCase() : "STUDIO_01";

  return (
    <div className="min-h-screen bg-[#121414] text-[#e2e2e2] font-['Montserrat',sans-serif] selection:bg-[#e2e2e2] selection:text-[#121414] relative overflow-x-hidden" id="portfolio-view">
      
      {/* TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#121414]/90 border-b border-[#282a2b] px-4 md:px-12 py-4">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          
          {/* Studio Brand Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={onNavigateToHome}
              className="group flex items-center gap-2 px-3 py-1.5 rounded bg-[#1a1c1c] hover:bg-[#282a2b] border border-[#333535] text-xs font-['JetBrains_Mono',monospace] text-[#c4c7c7] transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>LINKTREE</span>
            </button>

            <span className="text-[#444748]">/</span>

            <h1 className="text-sm md:text-base font-['Montserrat',sans-serif] font-bold tracking-widest text-white uppercase">
              {studioName}
            </h1>
          </div>

          {/* Center Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-['JetBrains_Mono',monospace] tracking-widest text-[#8e9192]">
            <a href="#work" className="hover:text-white transition-colors">REEL</a>
            <a href="#work" className="hover:text-white transition-colors">PROJECTS</a>
            <a href="#about" className="hover:text-white transition-colors">ARCHIVE</a>
            <button onClick={onNavigateToRatecard} className="hover:text-white transition-colors cursor-pointer uppercase">
              RATECARD
            </button>
          </nav>

          {/* Right Action */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHireModal(true)}
              className="px-5 py-2 rounded bg-transparent hover:bg-white/10 border border-[#e2e2e2] text-white font-['JetBrains_Mono',monospace] font-bold text-xs tracking-wider transition-all cursor-pointer"
            >
              HIRE ME
            </button>

            {onNavigateToAdmin && (
              <button
                onClick={onNavigateToAdmin}
                className="p-2 rounded bg-[#1a1c1c] hover:bg-[#282a2b] border border-[#333535] text-[#8e9192] hover:text-white transition-colors cursor-pointer"
                title="Admin Settings"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* SECTION 00 // INDEX (HERO) */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-12 pt-16 md:pt-24 pb-16">
        <div className="space-y-6 max-w-4xl">
          
          {/* Index Marker */}
          <div className="inline-block px-2.5 py-1 bg-[#1a1c1c] border border-[#333535] rounded text-xs font-['JetBrains_Mono',monospace] text-[#8e9192] tracking-widest">
            00 // INDEX
          </div>

          {/* Studio Title */}
          <div className="space-y-2">
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white uppercase leading-none">
              {studioName}
            </h2>
            <h3 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#8e9192] uppercase">
              VISUAL STORYTELLER
            </h3>
          </div>

          {/* Subtitle */}
          <p className="text-[#c4c7c7] text-sm md:text-base leading-relaxed max-w-2xl font-normal">
            Precision editing for brands and creators. Crafting narratives through meticulous cut, color, and sound in a distraction-free technical environment.
          </p>

        </div>
      </section>

      {/* SECTION 01 // WORK */}
      <section id="work" className="max-w-[1440px] mx-auto px-4 md:px-12 py-12 border-t border-[#282a2b]">
        
        {/* 9:16 Vertical Video Reels Grid - Videos Play Direct Inline */}
        {activeReels.length === 0 ? (
          <div className="p-16 text-center rounded-xl bg-[#1a1c1c] border border-[#282a2b] text-[#8e9192] font-['JetBrains_Mono',monospace] text-xs uppercase tracking-widest">
            Belum ada video reel.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {activeReels.map((reel) => (
              <ReelCard key={reel.id} reel={reel} />
            ))}
          </div>
        )}

      </section>

      {/* SECTION 02 // CREATOR STATEMENT & ARCHIVE */}
      <section id="about" className="max-w-[1440px] mx-auto px-4 md:px-12 py-16 border-t border-[#282a2b]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#1a1c1c] border border-[#282a2b] rounded-2xl p-8 md:p-12">
          
          <div className="md:col-span-4 flex flex-col items-center text-center md:items-start md:text-left gap-4">
            <img 
              src={profile.avatarUrl} 
              alt={profile.name}
              className="w-28 h-28 md:w-36 md:h-36 rounded-2xl object-cover border border-[#444748] shadow-2xl"
            />
            <div>
              <h4 className="text-xl font-bold text-white uppercase">{profile.name}</h4>
              <p className="text-xs font-['JetBrains_Mono',monospace] text-[#8e9192] mt-1">{profile.bio}</p>
            </div>
          </div>

          <div className="md:col-span-8 space-y-6">
            <div className="text-xs font-['JetBrains_Mono',monospace] text-[#8e9192] tracking-widest uppercase">
              02 // CREATOR ARCHIVE
            </div>
            <p className="text-[#c4c7c7] text-sm md:text-base leading-relaxed">
              "Every edit is built with mathematical rhythm and pacing. Specialized in retaining visual focus, crafting dynamic sound beds, and polishing color grade to industry benchmarks."
            </p>
            
            <div className="flex flex-wrap gap-3 pt-2 font-['JetBrains_Mono',monospace]">
              {profile.instagram && (
                <a 
                  href={profile.instagram} 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-4 py-2 rounded bg-[#121414] hover:bg-[#282a2b] border border-[#333535] text-xs text-[#c4c7c7] flex items-center gap-2 transition-colors"
                >
                  <Instagram className="w-4 h-4 text-[#b1cad7]" />
                  <span>INSTAGRAM</span>
                </a>
              )}
              {profile.tiktok && (
                <a 
                  href={profile.tiktok} 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-4 py-2 rounded bg-[#121414] hover:bg-[#282a2b] border border-[#333535] text-xs text-[#c4c7c7] flex items-center gap-2 transition-colors"
                >
                  <VideoIcon className="w-4 h-4 text-[#b1cad7]" />
                  <span>TIKTOK</span>
                </a>
              )}
              {profile.email && (
                <a 
                  href={`mailto:${profile.email}`}
                  className="px-4 py-2 rounded bg-[#121414] hover:bg-[#282a2b] border border-[#333535] text-xs text-[#c4c7c7] flex items-center gap-2 transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#b1cad7]" />
                  <span>EMAIL</span>
                </a>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* SECTION // READY TO COLLABORATE? (CTA) */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-12 py-20 text-center border-t border-[#282a2b]">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight uppercase">
            READY TO COLLABORATE?
          </h2>

          <p className="text-[#c4c7c7] text-sm md:text-base leading-relaxed font-['JetBrains_Mono',monospace]">
            Available for freelance projects globally. Specialized in commercial, documentary, and narrative editing.
          </p>

          <div className="pt-4">
            <button
              onClick={() => setShowHireModal(true)}
              className="px-8 py-3.5 rounded bg-transparent hover:bg-white text-white hover:text-black border border-[#e2e2e2] font-['JetBrains_Mono',monospace] font-bold text-xs tracking-widest uppercase transition-all cursor-pointer inline-flex items-center gap-3"
            >
              <span>GET IN TOUCH</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#282a2b] py-8 px-4 md:px-12 text-xs font-['JetBrains_Mono',monospace] text-[#8e9192]">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="font-bold text-white uppercase tracking-wider">
            {studioName}
          </div>

          <div className="flex items-center gap-6">
            <a href={profile.instagram || "#"} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              INSTAGRAM
            </a>
            <button onClick={onNavigateToHome} className="hover:text-white transition-colors cursor-pointer">
              LINKTREE
            </button>
            <button onClick={onNavigateToRatecard} className="hover:text-white transition-colors cursor-pointer">
              RATECARD
            </button>
          </div>

          <div>
            © {new Date().getFullYear()} {studioName}. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>

      {/* HIRE ME CONTACT MODAL */}
      {showHireModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#1a1c1c] border border-[#444748] rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#282a2b] pb-4">
              <h3 className="text-sm font-bold font-['JetBrains_Mono',monospace] text-white uppercase flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#b1cad7]" />
                <span>START A PROJECT</span>
              </h3>
              <button
                onClick={() => setShowHireModal(false)}
                className="p-1 rounded bg-[#282a2b] text-[#8e9192] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs font-['JetBrains_Mono',monospace] text-[#c4c7c7] leading-relaxed">
              Hubungi langsung melalui saluran komunikasi resmi untuk diskusi brief video reel, jadwal produksi, dan penawaran khusus.
            </p>

            <div className="space-y-3 font-['JetBrains_Mono',monospace]">
              {profile.whatsapp && (
                <a
                  href={profile.whatsapp.startsWith('http') ? profile.whatsapp : `https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 px-4 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-between transition-colors shadow-lg"
                >
                  <div className="flex items-center gap-2.5">
                    <MessageSquare className="w-4 h-4" />
                    <span>WHATSAPP DIRECT</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              )}

              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="w-full py-3.5 px-4 rounded bg-[#121414] hover:bg-[#282a2b] border border-[#333535] text-white font-bold text-xs flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-[#b1cad7]" />
                    <span>EMAIL COMMISSION</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              )}

              <button
                onClick={() => { setShowHireModal(false); onNavigateToRatecard(); }}
                className="w-full py-3.5 px-4 rounded bg-[#334a55]/40 hover:bg-[#334a55]/60 border border-[#b1cad7]/30 text-[#a0b9c5] font-bold text-xs flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Film className="w-4 h-4 text-[#b1cad7]" />
                  <span>CEK PRICING RATECARD</span>
                </div>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
