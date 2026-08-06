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

// Subcomponent for individual video card with inline video player (Obsidian Studio 9:16 Style)
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
    <div className="group relative aspect-[9/16] bg-[#282a2b] border border-[#444748] overflow-hidden transition-all duration-300 flex flex-col justify-between hover:border-[#b1cad7]">
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
              className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-700 ease-out"
              onClick={togglePlay}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            {/* Dark overlay */}
            <div className={`absolute inset-0 bg-black/40 transition-colors duration-300 pointer-events-none ${isPlaying ? 'bg-black/10' : 'group-hover:bg-black/20'}`} />

            {/* Play/Pause Controller Overlay */}
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause video" : "Play video"}
              className={`absolute inset-0 m-auto w-16 h-16 rounded-full bg-[#121414]/70 border border-white/20 backdrop-blur-md flex items-center justify-center text-[#b1cad7] transition-all duration-300 cursor-pointer ${
                isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-90 group-hover:opacity-100 scale-100'
              }`}
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 fill-current" />
              ) : (
                <Play className="w-7 h-7 fill-current translate-x-0.5" />
              )}
            </button>

            {/* Mute/Unmute Toggle Button (Top Right) */}
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute video" : "Mute video"}
              className="absolute top-3 right-3 z-20 p-2 rounded bg-[#0c0f0f]/80 text-white/80 hover:text-white backdrop-blur-md border border-white/10 transition-colors cursor-pointer"
              title={isMuted ? "Aktifkan Suara" : "Matikan Suara"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-[#b1cad7]" />}
            </button>
          </>
        ) : (
          <img
            src={reel.coverImageUrl}
            alt={reel.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-80"
          />
        )}
      </div>

      {/* Top Left Tag */}
      <div className="relative z-20 p-4">
        <span className="px-3 py-1 bg-[#121414]/90 backdrop-blur-md border border-[#444748] text-[11px] font-['JetBrains_Mono',monospace] text-[#c9c6c5] uppercase tracking-widest">
          {reel.category || 'REEL'}
        </span>
      </div>

      {/* Bottom Title Label */}
      <div className="relative z-20 p-4 bg-gradient-to-t from-[#121414] via-[#121414]/80 to-transparent font-['JetBrains_Mono',monospace] flex items-center justify-between text-xs tracking-wider">
        <div className="truncate pr-2 text-[#e2e2e2] font-medium">
          <span className="text-[#8e9192] uppercase">{reel.category || 'REEL'} // </span>
          <span className="text-white uppercase font-bold">{reel.title}</span>
        </div>
        {reel.videoUrl && isInstagram && (
          <a
            href={reel.videoUrl}
            target="_blank"
            rel="noreferrer"
            className="p-1 text-[#8e9192] hover:text-white transition-colors shrink-0"
            title="Buka Reel di Instagram"
          >
            <ExternalLink className="w-4 h-4" />
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
  const [showHireModal, setShowHireModal] = useState<boolean>(false);

  // Filter active reels
  const activeReels = reels.filter(r => r.isActive);

  const studioName = profile.portfolioStudioName 
    ? profile.portfolioStudioName.toUpperCase() 
    : (profile.name ? profile.name.toUpperCase() : "STUDIO_01");

  const heroIndexMarker = profile.portfolioHeroIndexMarker || "00 // INDEX";
  const heroSubtitle = profile.portfolioHeroSubtitle || "VISUAL STORYTELLER";
  const heroDescription = profile.portfolioHeroDescription || "Precision editing for brands and creators. Crafting narratives through meticulous cut, color, and sound in a distraction-free technical environment.";
  const ctaTitle = profile.portfolioCtaTitle || "READY TO COLLABORATE?";
  const ctaDescription = profile.portfolioCtaDescription || "Available for freelance projects globally. Specialized in commercial, documentary, and narrative editing.";
  const ctaButtonText = profile.portfolioCtaButtonText || "GET IN TOUCH";
  const modalDescription = profile.portfolioModalDescription || "Hubungi langsung melalui saluran komunikasi resmi untuk diskusi brief video reel, jadwal produksi, dan penawaran khusus.";

  React.useEffect(() => {
    if (profile.portfolioPageTitle) {
      document.title = profile.portfolioPageTitle;
    } else if (profile.name) {
      document.title = `${profile.name} // Portfolio & Reels`;
    }
  }, [profile]);

  return (
    <div className="min-h-screen bg-[#121414] text-[#e2e2e2] font-['Montserrat',sans-serif] selection:bg-[#c9c6c5] selection:text-[#121414] flex flex-col relative overflow-x-hidden" id="portfolio-view">
      
      {/* TOP NAVIGATION BAR */}
      <nav className="w-full top-0 border-b border-[#444748] bg-[#121414]/95 backdrop-blur-md sticky z-50">
        <div className="flex justify-between items-center px-4 md:px-8 py-4 max-w-[1440px] mx-auto">
          
          {/* Logo / Brand Name */}
          <div className="flex items-center gap-3">
            <button 
              onClick={onNavigateToHome}
              className="group flex items-center gap-2 px-2.5 py-1.5 bg-[#1a1c1c] hover:bg-[#282a2b] border border-[#444748] text-xs font-['JetBrains_Mono',monospace] text-[#c4c7c7] transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>LINKTREE</span>
            </button>
            <span className="text-[#444748] hidden sm:inline">/</span>
            <div className="font-['Montserrat',sans-serif] text-lg md:text-xl font-bold tracking-tight text-white uppercase">
              {studioName}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 font-['JetBrains_Mono',monospace] text-xs tracking-widest">
            <a href="#work" className="text-[#c9c6c5] font-bold border-b border-[#c9c6c5] pb-1 uppercase">
              REEL
            </a>
            <a href="#process" className="text-[#c4c7c7] font-medium hover:text-white transition-colors uppercase">
              PROCESS
            </a>
            <button 
              onClick={onNavigateToRatecard} 
              className="text-[#c4c7c7] font-medium hover:text-white transition-colors cursor-pointer uppercase"
            >
              RATECARD
            </button>
            <button 
              onClick={() => setShowHireModal(true)} 
              className="text-[#c4c7c7] font-medium hover:text-white transition-colors cursor-pointer uppercase"
            >
              CONTACT
            </button>
          </div>

          {/* Right Action Button */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowHireModal(true)}
              className="bg-[#b1cad7] hover:bg-[#cde6f4] text-[#1c333e] font-['JetBrains_Mono',monospace] text-xs font-bold px-5 py-2.5 uppercase tracking-widest transition-colors cursor-pointer"
            >
              HIRE ME
            </button>

            {onNavigateToAdmin && (
              <button
                onClick={onNavigateToAdmin}
                className="p-2 bg-[#1a1c1c] hover:bg-[#282a2b] border border-[#444748] text-[#8e9192] hover:text-white transition-colors cursor-pointer"
                title="Admin Settings"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow max-w-[1440px] mx-auto w-full px-4 md:px-8 py-10 md:py-16 space-y-16 md:space-y-24">
        
        {/* HERO SECTION */}
        <section className="border-b border-[#444748] pb-12 md:pb-16 pt-4">
          <div className="font-['JetBrains_Mono',monospace] text-xs text-[#c9c6c5] mb-6 uppercase tracking-widest bg-[#282a2b] px-3 py-1.5 border border-[#444748] inline-block">
            {heroIndexMarker}
          </div>
          
          <h1 className="font-['Montserrat',sans-serif] text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 uppercase leading-tight tracking-tight">
            {studioName} <br />
            <span className="text-[#8e9192] font-bold">{heroSubtitle}</span>
          </h1>

          <p className="font-['Montserrat',sans-serif] text-sm sm:text-base md:text-lg text-[#c4c7c7] max-w-3xl leading-relaxed">
            {heroDescription}
          </p>

          {/* Profile Creator Bar & Socials */}
          <div className="mt-8 pt-6 border-t border-[#282a2b] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img 
                src={profile.avatarUrl} 
                alt={profile.name || "Creator"}
                className="w-12 h-12 rounded border border-[#444748] object-cover shrink-0"
              />
              <div>
                <div className="font-bold text-sm text-white uppercase">{profile.name}</div>
                {profile.bio && <div className="text-xs font-['JetBrains_Mono',monospace] text-[#8e9192]">{profile.bio}</div>}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 font-['JetBrains_Mono',monospace]">
              {profile.instagram && (
                <a 
                  href={profile.instagram} 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-[#1a1c1c] hover:bg-[#282a2b] border border-[#444748] text-xs text-[#c4c7c7] hover:text-white flex items-center gap-2 transition-colors"
                >
                  <Instagram className="w-3.5 h-3.5 text-[#b1cad7]" />
                  <span>INSTAGRAM</span>
                </a>
              )}
              {profile.tiktok && (
                <a 
                  href={profile.tiktok} 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-[#1a1c1c] hover:bg-[#282a2b] border border-[#444748] text-xs text-[#c4c7c7] hover:text-white flex items-center gap-2 transition-colors"
                >
                  <VideoIcon className="w-3.5 h-3.5 text-[#b1cad7]" />
                  <span>TIKTOK</span>
                </a>
              )}
              {profile.email && (
                <a 
                  href={`mailto:${profile.email}`}
                  className="px-3 py-1.5 bg-[#1a1c1c] hover:bg-[#282a2b] border border-[#444748] text-xs text-[#c4c7c7] hover:text-white flex items-center gap-2 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#b1cad7]" />
                  <span>EMAIL</span>
                </a>
              )}
            </div>
          </div>
        </section>

        {/* SECTION 01 // WORK (VIDEO REELS GALLERY) */}
        <section id="work" className="space-y-8">
          <div className="font-['JetBrains_Mono',monospace] text-xs text-[#c9c6c5] uppercase tracking-widest flex items-center">
            <span>01 // WORK</span>
            <div className="h-[1px] bg-[#444748] flex-grow ml-4"></div>
          </div>

          {activeReels.length === 0 ? (
            <div className="p-16 text-center bg-[#1a1c1c] border border-[#444748] text-[#8e9192] font-['JetBrains_Mono',monospace] text-xs uppercase tracking-widest">
              Belum ada video reel aktif. Silakan tambahkan melalui Admin Panel.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {activeReels.map((reel) => (
                <ReelCard key={reel.id} reel={reel} />
              ))}
            </div>
          )}
        </section>

        {/* SECTION 02 // PROCESS */}
        <section id="process" className="space-y-8">
          <div className="font-['JetBrains_Mono',monospace] text-xs text-[#c9c6c5] uppercase tracking-widest flex items-center">
            <span>02 // PROCESS</span>
            <div className="h-[1px] bg-[#444748] flex-grow ml-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="p-6 bg-[#1a1c1c] border border-[#444748] space-y-3">
              <div className="font-['JetBrains_Mono',monospace] text-xs text-[#c9c6c5] font-bold">01.</div>
              <h3 className="font-['Montserrat',sans-serif] text-base font-bold text-white uppercase">Discovery & Strategy</h3>
              <p className="font-['Montserrat',sans-serif] text-xs text-[#c4c7c7] leading-relaxed">
                Deep dive into the brand voice and narrative goals to establish a clear creative direction.
              </p>
            </div>

            <div className="p-6 bg-[#1a1c1c] border border-[#444748] space-y-3">
              <div className="font-['JetBrains_Mono',monospace] text-xs text-[#c9c6c5] font-bold">02.</div>
              <h3 className="font-['Montserrat',sans-serif] text-base font-bold text-white uppercase">Creative Editing</h3>
              <p className="font-['Montserrat',sans-serif] text-xs text-[#c4c7c7] leading-relaxed">
                The technical craft of assembly, pacing, and rhythm to build a compelling visual story.
              </p>
            </div>

            <div className="p-6 bg-[#1a1c1c] border border-[#444748] space-y-3">
              <div className="font-['JetBrains_Mono',monospace] text-xs text-[#c9c6c5] font-bold">03.</div>
              <h3 className="font-['Montserrat',sans-serif] text-base font-bold text-white uppercase">Sound & Color</h3>
              <p className="font-['Montserrat',sans-serif] text-xs text-[#c4c7c7] leading-relaxed">
                Applying the cinematic polish through professional color grading and immersive sound design.
              </p>
            </div>

            <div className="p-6 bg-[#1a1c1c] border border-[#444748] space-y-3">
              <div className="font-['JetBrains_Mono',monospace] text-xs text-[#c9c6c5] font-bold">04.</div>
              <h3 className="font-['Montserrat',sans-serif] text-base font-bold text-white uppercase">Review & Delivery</h3>
              <p className="font-['Montserrat',sans-serif] text-xs text-[#c4c7c7] leading-relaxed">
                Collaborative refinement and final export in high-fidelity formats for all platforms.
              </p>
            </div>
          </div>
        </section>

        {/* READY TO COLLABORATE CTA SECTION */}
        <section className="pt-12 border-t border-[#444748] text-center space-y-6">
          <h2 className="font-['Montserrat',sans-serif] text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight uppercase">
            {ctaTitle}
          </h2>

          <p className="font-['JetBrains_Mono',monospace] text-xs sm:text-sm text-[#c4c7c7] max-w-xl mx-auto leading-relaxed">
            {ctaDescription}
          </p>

          <div className="pt-2">
            <button 
              onClick={() => setShowHireModal(true)}
              className="inline-block border border-[#b1cad7] text-[#b1cad7] hover:bg-[#b1cad7] hover:text-[#1c333e] font-['JetBrains_Mono',monospace] text-xs font-bold px-8 py-3.5 uppercase tracking-widest transition-colors cursor-pointer"
            >
              {ctaButtonText}
            </button>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="w-full py-10 border-t border-[#444748] bg-[#0c0f0f] mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-8 max-w-[1440px] mx-auto gap-6 font-['JetBrains_Mono',monospace] text-xs">
          <div className="font-['Montserrat',sans-serif] text-lg font-bold text-white tracking-tight uppercase">
            {studioName}
          </div>

          <div className="flex flex-wrap gap-6 text-[#c4c7c7]">
            {profile.instagram && (
              <a href={profile.instagram} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                INSTAGRAM
              </a>
            )}
            {profile.tiktok && (
              <a href={profile.tiktok} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                TIKTOK
              </a>
            )}
            <button onClick={onNavigateToHome} className="hover:text-white transition-colors cursor-pointer">
              LINKTREE
            </button>
            <button onClick={onNavigateToRatecard} className="hover:text-white transition-colors cursor-pointer">
              RATECARD
            </button>
          </div>

          <div className="text-[#8e9192]">
            © {new Date().getFullYear()} {studioName}. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>

      {/* HIRE ME CONTACT MODAL */}
      {showHireModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#1a1c1c] border border-[#444748] p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#282a2b] pb-4">
              <h3 className="text-sm font-bold font-['JetBrains_Mono',monospace] text-white uppercase flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#b1cad7]" />
                <span>START A PROJECT</span>
              </h3>
              <button
                onClick={() => setShowHireModal(false)}
                className="p-1 bg-[#282a2b] text-[#8e9192] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs font-['JetBrains_Mono',monospace] text-[#c4c7c7] leading-relaxed">
              {modalDescription}
            </p>

            <div className="space-y-3 font-['JetBrains_Mono',monospace]">
              {profile.whatsapp && (
                <a
                  href={profile.whatsapp.startsWith('http') ? profile.whatsapp : `https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-between transition-colors shadow-lg"
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
                  className="w-full py-3.5 px-4 bg-[#121414] hover:bg-[#282a2b] border border-[#333535] text-white font-bold text-xs flex items-center justify-between transition-colors"
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
                className="w-full py-3.5 px-4 bg-[#334a55]/40 hover:bg-[#334a55]/60 border border-[#b1cad7]/30 text-[#a0b9c5] font-bold text-xs flex items-center justify-between transition-colors cursor-pointer"
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

