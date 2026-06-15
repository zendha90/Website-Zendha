import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Instagram, 
  Youtube, 
  Mail, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  Flame,
  ShoppingBag,
  Globe,
  Compass,
  MessageCircle,
  Sparkles,
  ArrowRight,
  PlayCircle
} from 'lucide-react';
import { AffiliateLink, RatecardProfile } from '../types';

interface LinktreeViewProps {
  links: AffiliateLink[];
  profile: RatecardProfile;
  onLinkClick: (id: string) => void;
  onNavigateToRatecard: () => void;
}

// Custom High-Quality WhatsApp SVG Icon
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

// Blue verified checkmark icon khas Instagram
const VerifiedBadge = () => (
  <svg 
    viewBox="0 0 24 24" 
    className="w-5 h-5 text-[#0095f6] fill-none shrink-0 inline-block align-middle select-none overflow-visible ml-1" 
    aria-label="Verified"
  >
    {/* Instagram Spiky Medallion Shape */}
    <path 
      d="M12 2.1c.3 0 .7.1 1 .3l2.2 1.3c.4.2.8.3 1.2.2l2.5-.5c.4-.1.8.1 1.1.4s.4.7.4 1.1l-.5 2.5c-.1.4 0 .9.2 1.2l1.3 2.2c.4.7.4 1.5 0 2.2l-1.3 2.2c-.2.4-.3.8-.2 1.2l.5 2.5c.1.4-.1.8-.4 1.1s-.7.4-1.1.4l-2.5-.5c-.4-.1-.9 0-1.2.2L13 21.6c-.3.2-.7.3-1 .3s-.7-.1-1-.3l-2.2-1.3c-.4-.2-.8-.3-1.2-.2l-2.5.5c-.4.1-.8-.1-1.1-.4s-.4-.7-.4-1.1l.5-2.5c.1-.4 0-.9-.2-1.2L2.6 13.1c-.4-.7-.4-1.5 0-2.2l1.3-2.2c.2-.4.3-.8.2-1.2l-.5-2.5c-.1-.4.1-.8.4-1.1s.7-.4 1.1-.4l2.5.5c.4.1.9 0 1.2-.2L11 2.4c.3-.2.7-.3 1-.3z" 
      fill="#0095f6" 
    />
    {/* Clean White Checkmark */}
    <path 
      d="M9.5 12.5l2 2 4-4" 
      stroke="white" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </svg>
);

export default function LinktreeView({ 
  links, 
  profile, 
  onLinkClick 
}: LinktreeViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedLinkId, setExpandedLinkId] = useState<string | null>(null);

  // Calculate top 3 links based on clicks for real-time auto Terpopuler indicator
  const topClickedIds = [...links]
    .filter(link => link.isActive)
    .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
    .slice(0, 3)
    .map(link => link.id);

  const sortOrder = profile.designSettings?.linksSortOrder || 'asc';

  // Keep sorted default list of active links for permanent serial numbers (sorted by priority ASC)
  const sortedDefaultActiveLinks = [...links]
    .filter(l => l.isActive)
    .sort((a, b) => (a.priority || 0) - (b.priority || 0));

  // All active links sorted by user preference
  const activeLinks = [...sortedDefaultActiveLinks]
    .sort((a, b) => {
      const priorityA = a.priority || 0;
      const priorityB = b.priority || 0;
      if (sortOrder === 'desc') {
        return priorityB - priorityA;
      }
      return priorityA - priorityB;
    });

  // Filter links based purely on the search criteria, matching their permanent index
  const filteredLinks = activeLinks.filter((link) => {
    const originalIndex = sortedDefaultActiveLinks.findIndex(l => l.id === link.id);
    const permanentNumber = (originalIndex !== -1 ? originalIndex + 1 : 1).toString();
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    
    return link.title.toLowerCase().includes(query) || 
           (link.description && link.description.toLowerCase().includes(query)) ||
           link.category.toLowerCase().includes(query) ||
           permanentNumber === query ||
           permanentNumber.includes(query);
  });

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedLinkId(expandedLinkId === id ? null : id);
  };

  const handleLinkNavigate = (link: AffiliateLink) => {
    onLinkClick(link.id);
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  // Helper to retrieve category icon
  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('shopee')) return <ShoppingBag className="w-4 h-4 text-orange-500" />;
    if (cat.includes('tokopedia')) return <ShoppingBag className="w-4 h-4 text-green-500" />;
    if (cat.includes('youtube') || cat.includes('video')) return <Youtube className="w-4 h-4 text-red-500" />;
    if (cat.includes('instagram')) return <Instagram className="w-4 h-4 text-pink-500" />;
    if (cat.includes('social') || cat.includes('media')) return <Compass className="w-4 h-4 text-blue-500" />;
    return <Globe className="w-4 h-4 text-slate-500" />;
  };

  // Helper to get font class
  const getFontClass = () => {
    const font = profile.designSettings?.typography?.fontFamily || 'sans';
    switch (font) {
      case 'display': return 'font-display';
      case 'serif': return 'font-serif';
      case 'mono': return 'font-mono';
      default: return 'font-sans';
    }
  };

  const getButtonRoundedClass = () => {
    const style = profile.designSettings?.buttons?.style || 'rounded-2xl';
    return style; // These are Tailwind rounded classes directly
  };

  const getCardHoverStyle = () => {
    const hoverVal = profile.designSettings?.hoverAnimation || 'lift';
    switch (hoverVal) {
      case 'none': return {};
      case 'scale': return { scale: 1.025 };
      default: return { y: -5, scale: 1.01 };
    }
  };

  const getCardBgColor = () => {
    const opacityVal = profile.designSettings?.cardOpacity ?? 100;
    const isLightBg = !profile.designSettings?.colors.background || profile.designSettings?.colors.background.toLowerCase() === '#ffffff';
    
    if (opacityVal < 100) {
      return isLightBg 
        ? `rgba(255, 255, 255, ${opacityVal / 100})` 
        : `rgba(15, 23, 42, ${opacityVal / 100})`;
    }
    
    return profile.designSettings?.colors.background === '#FFFFFF' 
      ? '#FFFFFF' 
      : profile.designSettings?.colors.background + '20';
  };

  const getButtonShadowClass = () => {
    const shadow = profile.designSettings?.buttons?.shadow || 'soft';
    switch (shadow) {
      case 'none': return 'shadow-none';
      case 'hard': return 'shadow-[4px_4px_0px_rgba(15,23,42,0.1)] border-2 border-slate-900/5';
      default: return 'shadow-md';
    }
  };

  return (
    <div className={`w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 relative ${getFontClass()}`} style={{
      backgroundColor: profile.designSettings?.colors.background || undefined,
      color: profile.designSettings?.colors.pageText || undefined,
      fontFamily: 
        profile.designSettings?.typography?.fontFamily === 'display' ? '"Space Grotesk", sans-serif' : 
        profile.designSettings?.typography?.fontFamily === 'serif' ? '"Playfair Display", serif' : 
        profile.designSettings?.typography?.fontFamily === 'mono' ? '"JetBrains Mono", monospace' : '"Inter", sans-serif'
    }}>
      
      {/* Decorative radial gradients - update color to match */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-indigo-50/20 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Header Profile Landing Section */}
      <div 
        className={`flex flex-col mb-10 pb-8 border-b transition-all duration-500 ${
          profile.designSettings?.header.layout === 'hero' ? 'items-center text-center' : 
          profile.designSettings?.header.layout === 'classic' ? 'md:flex-row items-center md:items-start justify-between text-center sm:text-left' :
          profile.designSettings?.header.layout === 'banner' ? 'items-center text-center' :
          profile.designSettings?.header.layout === 'cutout' ? 'items-center text-center' :
          'items-center text-center' // shape
        }`} 
        style={{ borderColor: profile.designSettings?.colors.pageText + '20' }} 
        id="landing-profile-header"
      >
        
        {/* Profile Avatar and Info */}
        <div className={`flex flex-col gap-6 ${
          profile.designSettings?.header.layout === 'classic' ? 'sm:flex-row items-center sm:items-start' : 'items-center'
        }`}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className={`relative shrink-0 group ${
              profile.designSettings?.header.layout === 'banner' ? 'pt-8' : ''
            }`}
          >
            {profile.designSettings?.header.layout === 'banner' && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300%] h-24 rounded-t-3xl -z-10" style={{ backgroundColor: profile.designSettings?.colors.buttons + '15' }} />
            )}
            
            <div className={`relative overflow-hidden border-4 shadow-xl transition-all duration-500 hover:shadow-2xl ${
               profile.designSettings?.header.layout === 'shape' ? 'rounded-[2.5rem] rotate-6 group-hover:rotate-0' : 
               profile.designSettings?.header.layout === 'cutout' ? 'rounded-2xl' : 'rounded-full'
            }`} style={{ borderColor: 'white' }}>
              <img 
                src={profile.avatarUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2"} 
                alt={profile.name} 
                className={`object-cover bg-slate-50 transition-transform duration-700 group-hover:scale-110 ${
                  profile.designSettings?.header.layout === 'classic' ? 'w-24 h-24 sm:w-28 sm:h-28' : 'w-32 h-32'
                }`}
                id="avatar-image"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="absolute bottom-1 right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white animate-pulse" />
          </motion.div>

          <div className={`space-y-2 ${profile.designSettings?.header.layout === 'classic' ? 'text-left' : 'text-center'}`}>
            <div className={`flex items-center gap-2 ${
              profile.designSettings?.header.layout === 'classic' ? 'justify-start' : 'justify-center'
            }`}>
              <motion.h1 
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className={`${
                  profile.designSettings?.header.layout === 'classic' ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl'
                } font-black tracking-tight`}
                id="profile-name"
                style={{ color: profile.designSettings?.colors.title || '#0F172A' }}
              >
                {profile.name}
              </motion.h1>
              <VerifiedBadge />
            </div>

            <motion.p 
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className={`text-sm leading-relaxed ${
                profile.designSettings?.header.layout === 'classic' ? 'max-w-xl' : 'max-w-2xl mx-auto'
              }`}
              id="profile-bio"
              style={{ color: profile.designSettings?.colors.pageText || undefined }}
            >
              {profile.bio}
            </motion.p>

            {/* Social Icons Bar (Including WhatsApp as requested) */}
            <motion.div 
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className={`flex flex-wrap items-center gap-2.5 pt-2 ${
                profile.designSettings?.header.layout === 'hero' ? 'justify-center' : 'justify-center sm:justify-start'
              }`}
              id="social-icons-bar"
            >
              {profile.whatsapp && (
                <a 
                  href={profile.whatsapp} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-white text-slate-600 hover:text-emerald-500 rounded-xl border border-slate-100 shadow-xs hover:shadow-sm transition-all"
                  title="WhatsApp"
                  id="wa-link-icon"
                >
                  <WhatsAppIcon className="w-4.5 h-4.5" />
                </a>
              )}
              {profile.instagram && (
                <a 
                  href={profile.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-white text-slate-600 hover:text-pink-600 rounded-xl border border-slate-100 shadow-xs hover:shadow-sm transition-all"
                  title="Instagram"
                  id="instg-link"
                >
                  <Instagram className="w-4.5 h-4.5" />
                </a>
              )}
              {profile.tiktok && (
                <a 
                  href={profile.tiktok} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-white text-slate-600 hover:text-slate-900 rounded-xl border border-slate-100 shadow-xs hover:shadow-sm transition-all"
                  title="TikTok"
                  id="tiktok-link"
                >
                  <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.93.98 2.19 1.55 3.51 1.76v3.42c-1.34-.14-2.65-.63-3.76-1.45-.63-.44-1.18-.99-1.61-1.63v7.35c.1 1.34-.23 2.72-.94 3.84a6.536 6.536 0 0 1-5.18 3.32c-1.44.13-2.92-.09-4.23-.7a6.49 6.49 0 0 1-3.61-4.73c-.32-1.47-.19-3.04.42-4.43A6.47 6.47 0 0 1 8.84 7.21v3.44c-1.07.25-2.02.94-2.62 1.86a4.133 4.133 0 0 0-.58 3.29c.36 1.41 1.59 2.52 3.02 2.76 1.15.15 2.37-.15 3.23-.94.75-.63 1.18-1.58 1.2-2.55V.02z"/>
                  </svg>
                </a>
              )}
              {profile.youtube && (
                <a 
                  href={profile.youtube} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-white text-slate-600 hover:text-red-500 rounded-xl border border-slate-100 shadow-xs hover:shadow-sm transition-all"
                  title="YouTube"
                  id="yt-link"
                >
                  <Youtube className="w-4.5 h-4.5" />
                </a>
              )}
              {profile.email && (
                <a 
                  href={`mailto:${profile.email}`}
                  className="p-2 bg-white text-slate-600 hover:text-indigo-600 rounded-xl border border-slate-100 shadow-xs hover:shadow-sm transition-all"
                  title="Kirim Email"
                  id="mail-link"
                >
                  <Mail className="w-4.5 h-4.5" />
                </a>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Section Content Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-4" id="landing-main-bar">
        <div>
          <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest inline-flex items-center gap-1" style={{ color: profile.designSettings?.colors.buttons }}>
            <Sparkles className="w-3 h-3 animate-pulse" /> Barang yang aku pakai di rumah
          </span>
          <h2 className="text-xl font-black tracking-tight mt-1" style={{ color: profile.designSettings?.colors.title }}>
            Rekomendasi pilihan
          </h2>
        </div>

        {/* Dynamic Search Bar (Integrated minimally into landing layout) */}
        <div className="relative w-full sm:w-[260px] md:w-[320px]" id="search-container">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input 
            type="text" 
            placeholder="Cari Nama Barang atau nomor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-xs focus:shadow-md focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 outline-none transition-all text-slate-700 text-xs font-sans"
            id="search-input"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-indigo-600 hover:text-indigo-800 font-bold font-mono"
              id="clear-search-btn"
            >
              BATAL
            </button>
          )}
        </div>
      </div>

      {/* Landing Page Curated Product Display */}
      <AnimatePresence mode="popLayout">
        {filteredLinks.length > 0 ? (
          profile.designSettings?.layoutStyle === 'list' ? (
            /* CLASSIC STACKED LIST LAYOUT MODE */
            <div className="flex flex-col gap-3.5 w-full" id="links-list">
              {filteredLinks.map((link, idx) => {
                const originalIndex = sortedDefaultActiveLinks.findIndex(l => l.id === link.id);
                const sequenceNumber = originalIndex !== -1 ? originalIndex + 1 : idx + 1;
                return (
                  <motion.div
                    key={link.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={getCardHoverStyle()}
                    transition={{ delay: Math.min(idx * 0.04, 0.2), duration: 0.3 }}
                    className={`border p-3.5 flex items-center justify-between gap-4 transition-all duration-350 cursor-pointer overflow-hidden group select-none ${getButtonRoundedClass()} ${getButtonShadowClass()}`}
                    onClick={() => handleLinkNavigate(link)}
                    id={`link-list-item-${link.id}`}
                    style={{ 
                      backgroundColor: getCardBgColor(),
                      backdropFilter: (profile.designSettings?.cardOpacity ?? 100) < 100 ? 'blur(12px)' : undefined,
                      borderColor: profile.designSettings?.colors.pageText + '20'
                    }}
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      {/* Sequential tag badge */}
                      <span className="text-[10px] text-slate-400 font-mono font-black w-4 text-right select-none shrink-0">
                        {sequenceNumber}
                      </span>

                      {/* Micro-image preview */}
                      <div className="w-14 h-14 shrink-0 rounded-xl overflow-hidden relative bg-slate-50 border border-slate-100 flex items-center justify-center">
                        {link.imageUrl ? (
                          <img 
                            src={link.imageUrl} 
                            alt={link.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-indigo-50/40 to-slate-100/40 flex items-center justify-center">
                            {getCategoryIcon(link.category)}
                          </div>
                        )}
                        
                        {topClickedIds.includes(link.id) && link.clicks > 0 && (
                          <div className="absolute top-0.5 right-0.5 bg-orange-500 text-white p-0.5 rounded-full shadow-xs">
                            <Flame className="w-2.5 h-2.5 animate-pulse" />
                          </div>
                        )}
                      </div>

                      {/* Descriptive metadata text */}
                      <div className="min-w-0 flex-1">
                        <span className="inline-flex items-center gap-1 text-[8px] font-mono font-bold uppercase tracking-wider text-slate-400">
                          {getCategoryIcon(link.category)}
                          {link.category}
                        </span>
                        <h3 className="font-extrabold text-xs sm:text-sm truncate mt-0.5" style={{ color: profile.designSettings?.colors.title }}>
                          {link.title}
                        </h3>
                        {link.description && (
                          <p className="text-[10px] truncate opacity-70 mt-0.5 leading-normal max-w-lg" style={{ color: profile.designSettings?.colors.pageText }}>
                            {link.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions Container */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {link.videoUrl && (
                        <div 
                          className={`p-2 flex items-center justify-center gap-1 border shadow-xs transition-transform ${getButtonRoundedClass() === 'rounded-none' ? 'rounded-none' : 'rounded-full'}`}
                          style={{
                            borderColor: profile.designSettings?.colors.buttons || '#0f172a',
                            color: profile.designSettings?.colors.buttons || '#0f172a',
                            backgroundColor: 'transparent'
                          }}
                          onClick={(e) => {
                             e.stopPropagation();
                             window.open(link.videoUrl, '_blank');
                          }}
                        >
                          <PlayCircle className="w-3.5 h-3.5" />
                        </div>
                      )}
                      
                      {/* Standard Action Arrow Pill */}
                      <div 
                        className={`py-2 px-4 text-[10px] font-black tracking-wide flex items-center justify-center gap-1 shadow-xs transition-transform ${getButtonRoundedClass() === 'rounded-none' ? 'rounded-none' : 'rounded-full'}`}
                        style={{
                          backgroundColor: profile.designSettings?.colors.buttons || '#0f172a',
                          color: profile.designSettings?.colors.buttonText || '#ffffff'
                        }}
                      >
                        <span className="truncate max-w-[85px]">{link.buttonLabel ? link.buttonLabel : "Link"}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform shrink-0" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            /* COLLAPSIBLE BENTO DECORATIVE GRID LAYOUT MODE */
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 w-full" id="links-grid">
              {filteredLinks.map((link, idx) => {
                const originalIndex = sortedDefaultActiveLinks.findIndex(l => l.id === link.id);
                const sequenceNumber = originalIndex !== -1 ? originalIndex + 1 : idx + 1;
                return (
                  <motion.div
                    key={link.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={getCardHoverStyle()}
                    transition={{ delay: Math.min(idx * 0.05, 0.25), duration: 0.3 }}
                    className={`border transition-all duration-350 cursor-pointer overflow-hidden group flex flex-col relative ${getButtonRoundedClass()} ${getButtonShadowClass()}`}
                    onClick={() => handleLinkNavigate(link)}
                    id={`link-card-${link.id}`}
                    style={{ 
                       backgroundColor: getCardBgColor(),
                       backdropFilter: (profile.designSettings?.cardOpacity ?? 100) < 100 ? 'blur(12px)' : undefined,
                       borderColor: profile.designSettings?.colors.pageText + '20'
                    }}
                  >
                    
                    {/* Aspect Ratio 1:1 Image Box */}
                    <div className="w-full aspect-square overflow-hidden relative bg-slate-50 border-b border-slate-100 flex items-center justify-center">
                      {link.imageUrl ? (
                        <img 
                          src={link.imageUrl} 
                          alt={link.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-50/40 to-slate-100/40 flex flex-col items-center justify-center p-3 sm:p-6 text-center select-none">
                          <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-2rem bg-white border border-slate-150 flex items-center justify-center shadow-xs text-slate-400 group-hover:bg-indigo-50 transition-colors">
                            {getCategoryIcon(link.category)}
                          </span>
                          <span className="text-[8px] sm:text-[10px] uppercase tracking-widest font-mono font-bold text-slate-400 mt-2 sm:mt-3 block">{link.category}</span>
                        </div>
                      )}
                      
                      {/* Floating Sequential ID Tag */}
                      <span className="absolute top-2 left-2 sm:top-3 sm:left-3 text-[9px] sm:text-[11px] text-slate-500 font-sans font-extrabold bg-white/95 backdrop-blur-md px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-md sm:rounded-lg border border-slate-100 shadow-xs">
                        {sequenceNumber}
                      </span>

                      {/* Indicator for High-Clicks Products */}
                      {topClickedIds.includes(link.id) && link.clicks > 0 && (
                        <span className="absolute top-2 right-2 sm:top-3 sm:right-3 text-[7.5px] sm:text-[9px] text-white font-mono font-bold flex items-center gap-1 bg-slate-900/85 backdrop-blur-md px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg border border-white/5 shadow-md">
                          <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-orange-400 animate-pulse" /> TERPOPULER
                        </span>
                      )}
                    </div>

                    {/* Card Descriptive Details */}
                    <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="inline-flex items-center gap-1 text-[8px] sm:text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400">
                          {getCategoryIcon(link.category)}
                          {link.category}
                        </span>

                        <h3 className="font-bold text-xs sm:text-sm mt-1 sm:mt-2 leading-snug transition-colors line-clamp-2" style={{ color: profile.designSettings?.colors.title }}>
                          {link.title}
                        </h3>
                        {link.description && (
                          <p className="text-[10px] sm:text-[11px] mt-1 sm:mt-1.5 line-clamp-2 leading-normal opacity-80" style={{ color: profile.designSettings?.colors.pageText }}>
                            {link.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Highly Polished CTA Button (Extracted outside padding as requested) */}
                    <div className={`border-t grid p-1.5 sm:p-2 gap-1 sm:gap-1.5 w-full bg-slate-50/50 ${link.videoUrl ? 'grid-cols-2' : 'grid-cols-1'}`} style={{ borderColor: profile.designSettings?.colors.pageText + '20' }}>
                      {/* Video Review Button */}
                      {link.videoUrl && (
                        <div 
                          className={`min-w-0 py-2 sm:py-2.5 px-1 text-[9px] sm:text-[10px] font-bold tracking-wide flex items-center justify-center gap-1 transition-all border cursor-pointer ${getButtonRoundedClass()}`}
                          style={{
                            borderColor: profile.designSettings?.colors.buttons || '#0f172a',
                            color: profile.designSettings?.colors.buttons || '#0f172a',
                            backgroundColor: 'transparent'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(link.videoUrl, '_blank');
                          }}
                        >
                          <PlayCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                          <span className="truncate">Video</span>
                        </div>
                      )}

                      {/* Beli Sekarang Button */}
                      <div 
                        className={`min-w-0 py-2 sm:py-2.5 px-1 text-white text-[9px] sm:text-[10px] font-bold tracking-wide flex items-center justify-center gap-1 transition-all shadow-xs cursor-pointer ${getButtonRoundedClass()}`}
                        style={{
                          backgroundColor: profile.designSettings?.colors.buttons || '#0f172a',
                          color: profile.designSettings?.colors.buttonText || '#ffffff'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLinkNavigate(link);
                        }}
                      >
                        <span className="truncate">{link.buttonLabel ? link.buttonLabel : "Link"}</span>
                        <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 transition-transform shrink-0" />
                      </div>
                    </div>

                  </motion.div>
                );
              })}
            </div>
          )
        ) : (
          <motion.div 
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-16 text-center bg-white border border-slate-200/50 rounded-3xl shadow-xs text-slate-400 w-full"
            id="empty-state-search"
          >
            <p className="text-sm font-medium">Tidak ditemukan perlengkapan yang cocok dengan keyword Anda.</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-3 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-xl text-xs transition-colors"
            >
              Reset Pencarian
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Aesthetic Footer Block */}
      <div className="text-center mt-16 text-[11px] text-slate-400 font-mono space-y-2 pb-8">
        <p>© 2026 {profile?.name || "Creator Templates"}. All intellectual rights reserved.</p>
      </div>
    </div>
  );
}
