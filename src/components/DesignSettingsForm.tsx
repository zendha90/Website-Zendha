import React, { useState } from 'react';
import { Palette, LayoutGrid, LayoutList, Sparkles, MoveUp, Layers, Sliders, Eye, ArrowUpDown } from 'lucide-react';
import { RatecardProfile, DesignSettings } from '../types';
import { PREDEFINED_THEMES } from '../constants';

export default function DesignSettingsForm({ profile, onSave }: { profile: RatecardProfile; onSave: (profile: RatecardProfile) => void }) {
  const defaultDesign: DesignSettings = {
    theme: 'minimalist',
    header: { layout: 'classic', titleStyle: 'text' },
    typography: { fontFamily: 'sans' },
    buttons: { style: 'rounded-2xl', shadow: 'soft' },
    colors: {
      background: '#FFFFFF',
      buttons: '#1E293B',
      buttonText: '#FFFFFF',
      pageText: '#334155',
      title: '#0F172A',
      backgroundGradientSecond: '#F1F5F9',
    },
    layoutStyle: 'grid',
    backgroundType: 'solid',
    cardOpacity: 100,
    hoverAnimation: 'lift',
    linksSortOrder: 'asc',
  };

  const [design, setDesign] = useState<DesignSettings>(() => {
    if (!profile.designSettings) return defaultDesign;
    return {
      ...defaultDesign,
      ...profile.designSettings,
      header: { ...defaultDesign.header, ...(profile.designSettings.header || {}) },
      typography: { ...defaultDesign.typography, ...(profile.designSettings.typography || {}) },
      buttons: { ...defaultDesign.buttons, ...(profile.designSettings.buttons || {}) },
      colors: { 
        ...defaultDesign.colors, 
        ...(profile.designSettings.colors || {}),
        backgroundGradientSecond: profile.designSettings.colors?.backgroundGradientSecond || '#F1F5F9'
      },
      layoutStyle: profile.designSettings.layoutStyle || 'grid',
      backgroundType: profile.designSettings.backgroundType || 'solid',
      cardOpacity: profile.designSettings.cardOpacity ?? 100,
      hoverAnimation: profile.designSettings.hoverAnimation || 'lift',
      linksSortOrder: profile.designSettings.linksSortOrder || 'asc',
    } as DesignSettings;
  });

  const handleThemeChange = (theme: string) => {
    const themeData = PREDEFINED_THEMES[theme];
    const newDesign = {
      ...design,
      theme,
      header: { ...design.header, ...themeData.header },
      typography: { ...design.typography, ...themeData.typography },
      buttons: { ...design.buttons, ...themeData.buttons },
      colors: {
        ...design.colors,
        ...themeData.colors,
        backgroundGradientSecond: themeData.colors.backgroundGradientSecond || '#e2e8f0',
      },
    } as DesignSettings;
    setDesign(newDesign);
  };

  const handleSave = () => {
    onSave({ ...profile, designSettings: design });
  };

  const getBackgroundCSS = (d: DesignSettings) => {
    if (d.backgroundType === 'gradient') {
      return `linear-gradient(135deg, ${d.colors.background} 0%, ${d.colors.backgroundGradientSecond || '#e2e8f0'} 100%)`;
    }
    return d.colors.background;
  };

  return (
    <div className="space-y-8">
      {/* Theme Presets */}
      <div className="space-y-4">
        <label className="text-xs font-mono font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          Color Presets
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Object.keys(PREDEFINED_THEMES).map((theme) => {
            const themeColors = PREDEFINED_THEMES[theme].colors;
            return (
              <button
                key={theme}
                onClick={() => handleThemeChange(theme)}
                className={`group relative p-3.5 rounded-2xl border text-left transition-all duration-300 ${
                  design.theme === theme 
                    ? 'ring-2 ring-indigo-500 border-transparent shadow-md bg-white' 
                    : 'border-slate-100 hover:border-slate-300 bg-white shadow-xs'
                }`}
              >
                <div className="flex flex-col gap-2">
                  <span className={`text-[10px] font-black uppercase tracking-wider truncate ${design.theme === theme ? 'text-indigo-600' : 'text-slate-500'}`}>
                    {theme.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  
                  {/* Visual Color Preview Chip */}
                  <div className="flex -space-x-1.5 pt-0.5">
                    <div className="w-5.5 h-5.5 rounded-full border border-white shadow-xs" style={{ backgroundColor: themeColors.background }} />
                    <div className="w-5.5 h-5.5 rounded-full border border-white shadow-xs" style={{ backgroundColor: themeColors.buttons }} />
                    <div className="w-5.5 h-5.5 rounded-full border border-white shadow-xs" style={{ backgroundColor: themeColors.title }} />
                  </div>
                </div>

                {design.theme === theme && (
                  <div className="absolute top-2 right-2">
                    <div className="bg-indigo-600 text-white p-0.5 rounded-full">
                      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Layout Style (Grid vs List) */}
      <div className="space-y-3">
        <label className="text-xs font-mono font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-500" />
          Product Layout Style
        </label>
        <p className="text-xs text-slate-400 -mt-1">Pilih gaya penyusunan daftar item Anda.</p>
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => setDesign({ ...design, layoutStyle: 'grid' })}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 ${
              design.layoutStyle === 'grid' || !design.layoutStyle
                ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700 ring-1 ring-indigo-500'
                : 'border-slate-100 bg-white hover:border-slate-300 text-slate-500'
            }`}
          >
            <LayoutGrid className="w-6 h-6 mb-2" />
            <span className="text-xs font-bold font-sans">Bento Grid (Aesthetic)</span>
            <span className="text-[9px] opacity-60 mt-0.5">Tata letak kolom modern</span>
          </button>

          <button
            onClick={() => setDesign({ ...design, layoutStyle: 'list' })}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 ${
              design.layoutStyle === 'list'
                ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700 ring-1 ring-indigo-500'
                : 'border-slate-100 bg-white hover:border-slate-300 text-slate-500'
            }`}
          >
            <LayoutList className="w-6 h-6 mb-2" />
            <span className="text-xs font-bold font-sans">Classic Stacked List</span>
            <span className="text-[9px] opacity-60 mt-0.5">Model lurus ke bawah</span>
          </button>
        </div>
      </div>

      {/* Urutan Daftar Link (Sort Order Option) */}
      <div className="space-y-3">
        <label className="text-xs font-mono font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-indigo-500" />
          Urutan Daftar Link
        </label>
        <p className="text-xs text-slate-400 -mt-1">Pilih metode sorting tautan/produk berdasarkan nilai nomor prioritas.</p>
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => setDesign({ ...design, linksSortOrder: 'asc' })}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 ${
              design.linksSortOrder === 'asc' || !design.linksSortOrder
                ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700 ring-1 ring-indigo-500'
                : 'border-slate-100 bg-white hover:border-slate-300 text-slate-500'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-xs font-mono font-black border border-slate-200 bg-slate-50 text-slate-600 px-1 py-0.5 rounded">1</span>
              <span className="text-xs text-slate-400">→</span>
              <span className="text-xs font-mono font-black border border-slate-200 bg-slate-50 text-slate-600 px-1 py-0.5 rounded">99</span>
            </div>
            <span className="text-xs font-bold font-sans">Nomor Terendah Dulu</span>
            <span className="text-[9px] opacity-60 mt-0.5">Ascending (Prioritas 1, 2, 3...)</span>
          </button>

          <button
            onClick={() => setDesign({ ...design, linksSortOrder: 'desc' })}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 ${
              design.linksSortOrder === 'desc'
                ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700 ring-1 ring-indigo-500'
                : 'border-slate-100 bg-white hover:border-slate-300 text-slate-500'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-xs font-mono font-black border border-slate-200 bg-slate-50 text-slate-600 px-1 py-0.5 rounded">99</span>
              <span className="text-xs text-slate-400">→</span>
              <span className="text-xs font-mono font-black border border-slate-200 bg-slate-50 text-slate-600 px-1 py-0.5 rounded">1</span>
            </div>
            <span className="text-xs font-bold font-sans">Nomor Terbesar Dulu</span>
            <span className="text-[9px] opacity-60 mt-0.5">Descending (Prioritas 99, 98, 97...)</span>
          </button>
        </div>
      </div>
      
      {/* Header Layout */}
      <div className="space-y-3">
        <label className="text-xs font-mono font-black text-indigo-600 uppercase tracking-widest">Header Banner & Avatar Layout</label>
        <div className="grid grid-cols-5 gap-1.5 pt-1">
          {['classic', 'hero', 'banner', 'cutout', 'shape'].map((layout) => (
            <button
              key={layout}
              onClick={() => {
                setDesign({...design, header: {...design.header, layout: layout as any}});
              }}
              className={`py-2 px-1 rounded-xl border text-[9px] font-black uppercase text-center tracking-tighter transition-all ${
                design.header.layout === layout 
                  ? 'bg-slate-800 text-white border-slate-800 shadow-sm' 
                  : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
              }`}
            >
              {layout}
            </button>
          ))}
        </div>
      </div>

      {/* Typography & Fonts */}
      <div className="space-y-3">
        <label className="text-xs font-mono font-black text-indigo-600 uppercase tracking-widest">Brand Typography</label>
        <div className="grid grid-cols-4 gap-2 pt-1">
          {[
            { id: 'sans', label: 'Inter Sans', class: 'font-sans' },
            { id: 'display', label: 'Grotesk Display', class: 'font-display' },
            { id: 'serif', label: 'Editorial Serif', class: 'font-serif' },
            { id: 'mono', label: 'Tech Mono', class: 'font-mono' }
          ].map((font) => (
            <button
              key={font.id}
              onClick={() => {
                setDesign({...design, typography: { fontFamily: font.id as any }});
              }}
              className={`p-3 rounded-xl border text-sm transition-all ${design.typography?.fontFamily === font.id ? 'bg-indigo-50/50 border-indigo-400 ring-1 ring-indigo-400' : 'border-slate-100 bg-white hover:border-slate-300'}`}
            >
              <div className="flex flex-col items-center">
                <span className={`${font.class} text-lg font-black ${design.typography?.fontFamily === font.id ? 'text-indigo-600' : 'text-slate-700'}`}>Aa</span>
                <p className="text-[8px] mt-1 font-bold uppercase tracking-tight opacity-70 truncate max-w-full">{font.label}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Card Stylings (Shapes & Shadow) */}
      <div className="grid grid-cols-2 gap-4">
         <div className="space-y-3">
           <label className="text-xs font-mono font-black text-indigo-600 uppercase tracking-widest">Card Rounded Shape</label>
           <div className="grid grid-cols-2 gap-2">
             {[
               { id: 'rounded-none', label: 'Square' },
               { id: 'rounded-lg', label: 'Soft Edge' },
               { id: 'rounded-2xl', label: 'Modern Curved' },
               { id: 'rounded-full', label: 'Capsule Shape' }
             ].map((style) => (
               <button
                 key={style.id}
                 onClick={() => {
                   setDesign({...design, buttons: { ...design.buttons, style: style.id as any }});
                 }}
                 className={`px-2 py-2 rounded-xl border text-[9px] font-bold tracking-tight transition-all ${design.buttons?.style === style.id ? 'bg-slate-800 text-white border-slate-800' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'}`}
               >
                 {style.label}
               </button>
             ))}
           </div>
         </div>

         <div className="space-y-3">
           <label className="text-xs font-mono font-black text-indigo-600 uppercase tracking-widest">Card Shadow Style</label>
           <div className="grid grid-cols-3 gap-1.5">
             {[
               { id: 'none', label: 'None' },
               { id: 'soft', label: 'Natural' },
               { id: 'hard', label: 'Retro Hard' }
             ].map((shadow) => (
               <button
                 key={shadow.id}
                 onClick={() => {
                   setDesign({...design, buttons: { ...design.buttons, shadow: shadow.id as any }});
                 }}
                 className={`px-1 py-2.5 rounded-xl border text-[9px] font-bold tracking-tight transition-all ${design.buttons?.shadow === shadow.id ? 'bg-slate-800 text-white border-slate-800' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'}`}
               >
                 {shadow.label}
               </button>
             ))}
           </div>
         </div>
      </div>

      {/* Premium Visual Effects (Opacity & Hover Animation) */}
      <div className="grid grid-cols-2 gap-4">
         <div className="space-y-3">
           <label className="text-xs font-mono font-black text-indigo-600 uppercase tracking-widest">Card Acrylic Transparency</label>
           <div className="grid grid-cols-3 gap-1.5">
             {[
               { val: 100, label: 'Solid (100%)' },
               { val: 80, label: 'Acrylic (80%)' },
               { val: 50, label: 'Glass (50%)' }
             ].map((item) => (
               <button
                 key={item.val}
                 onClick={() => {
                   setDesign({...design, cardOpacity: item.val});
                 }}
                 className={`px-1 py-2.5 rounded-xl border text-[9px] font-bold tracking-tight transition-all ${design.cardOpacity === item.val ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-100 bg-white text-slate-500'}`}
               >
                 {item.label}
               </button>
             ))}
           </div>
         </div>

         <div className="space-y-3">
           <label className="text-xs font-mono font-black text-indigo-600 uppercase tracking-widest">Card Hover Effect</label>
           <div className="grid grid-cols-3 gap-1.5">
             {[
               { id: 'scale', label: 'Bounce Scale' },
               { id: 'lift', label: 'Elegant Lift' },
               { id: 'none', label: 'Static' }
             ].map((hov) => (
               <button
                 key={hov.id}
                 onClick={() => {
                   setDesign({...design, hoverAnimation: hov.id as any});
                 }}
                 className={`px-1 py-2.5 rounded-xl border text-[9px] font-bold tracking-tight transition-all ${design.hoverAnimation === hov.id ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-100 bg-white text-slate-500'}`}
               >
                 {hov.label}
               </button>
             ))}
           </div>
         </div>
      </div>

      {/* Background Styling Mode */}
      <div className="space-y-3">
        <label className="text-xs font-mono font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
          <Palette className="w-4 h-4 text-indigo-500" />
          Background Mode
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setDesign({ ...design, backgroundType: 'solid' })}
            className={`p-3 rounded-xl border text-xs font-bold transition-all ${
              design.backgroundType === 'solid' || !design.backgroundType
                ? 'border-indigo-400 bg-indigo-50/20 text-indigo-700 font-extrabold'
                : 'border-slate-100 bg-white text-slate-500'
            }`}
          >
            Solid Color Background
          </button>
          <button
            onClick={() => setDesign({ ...design, backgroundType: 'gradient' })}
            className={`p-3 rounded-xl border text-xs font-bold transition-all ${
              design.backgroundType === 'gradient'
                ? 'border-indigo-400 bg-indigo-50/20 text-indigo-700 font-extrabold'
                : 'border-slate-100 bg-white text-slate-500'
            }`}
          >
            Liquid Gradient
          </button>
        </div>
      </div>

      {/* Deep Dive Theme Colors & ColorPickers */}
      <div className="space-y-3">
        <label className="text-xs font-mono font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-500" />
          Detail Color Palette
        </label>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div>
            <label className="text-[10px] font-bold text-slate-500 block mb-1">
              {design.backgroundType === 'gradient' ? 'Start BG Color' : 'Background Color'}
            </label>
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-150">
              <input
                type="color"
                value={design.colors.background}
                onChange={(e) => setDesign({
                  ...design,
                  colors: { ...design.colors, background: e.target.value }
                })}
                className="w-8 h-8 rounded cursor-pointer border-0"
              />
              <span className="text-[9px] font-mono uppercase text-slate-600">{design.colors.background}</span>
            </div>
          </div>

          {design.backgroundType === 'gradient' && (
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1">End BG Gradient</label>
              <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-150">
                <input
                  type="color"
                  value={design.colors.backgroundGradientSecond || '#F1F5F9'}
                  onChange={(e) => setDesign({
                    ...design,
                    colors: { ...design.colors, backgroundGradientSecond: e.target.value }
                  })}
                  className="w-8 h-8 rounded cursor-pointer border-0"
                />
                <span className="text-[9px] font-mono uppercase text-slate-600">{design.colors.backgroundGradientSecond || '#F1F5F9'}</span>
              </div>
            </div>
          )}

          <div>
            <label className="text-[10px] font-bold text-slate-500 block mb-1">Header Title Text</label>
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-150">
              <input
                type="color"
                value={design.colors.title}
                onChange={(e) => setDesign({
                  ...design,
                  colors: { ...design.colors, title: e.target.value }
                })}
                className="w-8 h-8 rounded cursor-pointer border-0"
              />
              <span className="text-[9px] font-mono uppercase text-slate-600">{design.colors.title}</span>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 block mb-1">Primary Button BG</label>
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-150">
              <input
                type="color"
                value={design.colors.buttons}
                onChange={(e) => setDesign({
                  ...design,
                  colors: { ...design.colors, buttons: e.target.value }
                })}
                className="w-8 h-8 rounded cursor-pointer border-0"
              />
              <span className="text-[9px] font-mono uppercase text-slate-600">{design.colors.buttons}</span>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 block mb-1">Button Text Color</label>
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-150">
              <input
                type="color"
                value={design.colors.buttonText}
                onChange={(e) => setDesign({
                  ...design,
                  colors: { ...design.colors, buttonText: e.target.value }
                })}
                className="w-8 h-8 rounded cursor-pointer border-0"
              />
              <span className="text-[9px] font-mono uppercase text-slate-600">{design.colors.buttonText}</span>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 block mb-1">Secondary Page Text</label>
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-150">
              <input
                type="color"
                value={design.colors.pageText}
                onChange={(e) => setDesign({
                  ...design,
                  colors: { ...design.colors, pageText: e.target.value }
                })}
                className="w-8 h-8 rounded cursor-pointer border-0"
              />
              <span className="text-[9px] font-mono uppercase text-slate-600">{design.colors.pageText}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Live Mini Preview Display Section */}
      <div className="p-5 bg-slate-900 rounded-[2.5rem] shadow-xl relative overflow-hidden group border border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent pointer-events-none" />
        
        <div className="flex items-center justify-between mb-4 relative z-10">
          <label className="text-[10px] font-mono font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            Live Preview Simulation
          </label>
          <div className="flex items-center gap-2">
            {JSON.stringify(design) !== JSON.stringify(profile.designSettings) && (
              <div className="flex items-center gap-1.2 bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-full">
                <span className="text-[7.5px] text-amber-400 font-black uppercase tracking-wider">Unsaved</span>
                <div className="w-1 h-1 rounded-full bg-amber-400 animate-pulse" />
              </div>
            )}
            <span className="text-[7.5px] bg-white/10 text-white/60 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">{design.layoutStyle || 'grid'}</span>
          </div>
        </div>
        
        <div 
          className="w-full max-w-[245px] mx-auto rounded-[2.2rem] shadow-xl border border-slate-800/20 overflow-hidden transition-all duration-300 bg-white"
          style={{ 
            background: getBackgroundCSS(design),
            fontFamily: 
              design.typography?.fontFamily === 'display' ? '"Space Grotesk", sans-serif' : 
              design.typography?.fontFamily === 'serif' ? '"Playfair Display", serif' : 
              design.typography?.fontFamily === 'mono' ? '"JetBrains Mono", monospace' : '"Inter", sans-serif'
          }}
        >
          {/* Mock Banner layout */}
          {design.header.layout === 'banner' && (
            <div className="w-full h-10 transition-all" style={{ backgroundColor: design.colors.buttons + '20' }} />
          )}
          
          <div className={`p-4 space-y-3.5 ${design.header.layout === 'banner' ? '-mt-6' : ''}`}>
             <div className={`flex gap-2.5 ${
               design.header.layout === 'hero' ? 'flex-col items-center text-center' : 
               design.header.layout === 'classic' ? 'flex-row items-center text-left' :
               'flex-col items-center text-center'
             }`}>
                {/* Avatar Shape Mock */}
                <div className={`w-11 h-11 transition-all duration-300 shrink-0 flex items-center justify-center p-0.5 shadow-sm ${
                  design.header.layout === 'shape' ? 'rounded-[0.98rem] rotate-12' : 
                  design.header.layout === 'cutout' ? 'rounded-xl' : 'rounded-full'
                }`} style={{ backgroundColor: '#FFF', border: `1.5px solid ${design.colors.buttons}` }}>
                    <div className={`w-full h-full bg-slate-100 ${
                       design.header.layout === 'shape' ? 'rounded-[0.7rem]' : 
                       design.header.layout === 'cutout' ? 'rounded-lg' : 'rounded-full'
                    }`} />
                </div>
                
                <div className={`flex flex-col gap-1 ${design.header.layout === 'classic' ? 'items-start' : 'items-center'}`}>
                  <div className="h-2 w-14 rounded" style={{ backgroundColor: design.colors.title }} />
                  <div className="h-1.5 w-24 rounded" style={{ backgroundColor: design.colors.pageText + '40' }} />
                </div>
             </div>
             
              {/* Dynamic Render Mock Grid or List based on Selection */}
             {(() => {
               const mockItems = design.linksSortOrder === 'desc' ? [2, 1] : [1, 2];
               return design.layoutStyle === 'list' ? (
                 <div className="space-y-1.5 pt-1">
                   {mockItems.map(i => {
                     const roundedClass = design.buttons?.style || 'rounded-2xl';
                     const shadowStyle = design.buttons?.shadow === 'soft' 
                       ? { boxShadow: '0 2px 6px rgba(0,0,0,0.04)' } 
                       : design.buttons?.shadow === 'hard' 
                       ? { boxShadow: '3px 3px 0px rgba(0,0,0,0.15)', border: '1.5px solid rgba(0,0,0,0.06)' } 
                       : { boxShadow: 'none' };

                     // Opacity calculation for simulation
                     const opacityVal = design.cardOpacity !== undefined ? design.cardOpacity / 100 : 1;
                     const bgCol = `rgba(255, 255, 255, ${0.85 * opacityVal})`;

                     return (
                       <div 
                         key={i} 
                         className={`border px-3 py-2 flex items-center justify-between transition-all duration-300 ${roundedClass}`}
                         style={{ 
                           backgroundColor: bgCol,
                           borderColor: design.colors.pageText + '15',
                           ...shadowStyle
                         }}
                       >
                         <div className="flex items-center gap-2 truncate">
                           <div className={`w-5 h-5 shrink-0 ${roundedClass === 'rounded-full' ? 'rounded-full' : 'rounded'}`} style={{ backgroundColor: design.colors.buttons + '20' }} />
                           <span className="text-[8px] font-black truncate" style={{ color: design.colors.title }}>Produk Estetik #{i}</span>
                         </div>
                         <div className="px-2 py-1 text-[7px] font-black rounded" style={{ backgroundColor: design.colors.buttons, color: design.colors.buttonText }}>
                           Beli
                         </div>
                       </div>
                     );
                   })}
                 </div>
               ) : (
                 <div className="grid grid-cols-2 gap-2 pt-1">
                   {mockItems.map(i => {
                     const roundedClass = design.buttons?.style || 'rounded-2xl';
                     const shadowStyle = design.buttons?.shadow === 'soft' 
                       ? { boxShadow: '0 2px 6px rgba(0,0,0,0.04)' } 
                       : design.buttons?.shadow === 'hard' 
                       ? { boxShadow: '3px 3px 0px rgba(0,0,0,0.15)', border: '1.5px solid rgba(0,0,0,0.06)' } 
                       : { boxShadow: 'none' };

                     const opacityVal = design.cardOpacity !== undefined ? design.cardOpacity / 100 : 1;
                     const bgCol = `rgba(255, 255, 255, ${0.85 * opacityVal})`;

                     return (
                       <div 
                         key={i} 
                         className={`border p-2 flex flex-col justify-between h-[96px] transition-all duration-300 ${roundedClass}`}
                         style={{ 
                           backgroundColor: bgCol,
                           borderColor: design.colors.pageText + '15',
                           ...shadowStyle
                         }}
                       >
                         <div className="w-full h-11 bg-slate-100 rounded-lg overflow-hidden relative">
                           <div className="absolute inset-0 bg-gradient-to-tr from-slate-200/50 to-slate-100/30" />
                         </div>
                         <div className="mt-1 flex-1 flex flex-col justify-between">
                           <div className="text-[7px] font-black line-clamp-1" style={{ color: design.colors.title }}>Produk Pilihan #{i}</div>
                           <div className="py-0.8 text-[6.5px] font-mono font-bold text-center rounded mt-1 shadow-xs" style={{ backgroundColor: design.colors.buttons, color: design.colors.buttonText }}>
                             Beli Sekarang
                           </div>
                         </div>
                       </div>
                     );
                   })}
                 </div>
               );
             })()}
          </div>
        </div>
      </div>

      <button 
        onClick={handleSave} 
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all active:scale-[0.98] shadow-md shadow-indigo-100 mt-2 flex items-center justify-center gap-2"
        id="save-all-design-btn"
      >
        <Sparkles className="w-4 h-4" />
        Terapkan Perubahan Design Terbaru
      </button>
    </div>
  );
}
