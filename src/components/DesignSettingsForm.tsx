import React, { useState } from 'react';
import { Palette } from 'lucide-react';
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
    }
  };

  const [design, setDesign] = useState<DesignSettings>(() => {
    if (!profile.designSettings) return defaultDesign;
    return {
      ...defaultDesign,
      ...profile.designSettings,
      header: { ...defaultDesign.header, ...(profile.designSettings.header || {}) },
      typography: { ...defaultDesign.typography, ...(profile.designSettings.typography || {}) },
      buttons: { ...defaultDesign.buttons, ...(profile.designSettings.buttons || {}) },
      colors: { ...defaultDesign.colors, ...(profile.designSettings.colors || {}) }
    } as DesignSettings;
  });

  const handleThemeChange = (theme: string) => {
    const newDesign = {
        theme,
        ...PREDEFINED_THEMES[theme]
    } as any;
    setDesign(newDesign);
  };

  const handleSave = () => {
    onSave({ ...profile, designSettings: design });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-black text-slate-800 tracking-tight">Customization</h2>
      </div>

      {/* Theme Selection */}
      <div className="space-y-4">
        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
          <Palette className="w-4 h-4 text-indigo-500" />
          Color Template
        </label>
        <div className="grid grid-cols-2 gap-3">
          {Object.keys(PREDEFINED_THEMES).map((theme) => {
            const themeColors = PREDEFINED_THEMES[theme].colors;
            return (
              <button
                key={theme}
                onClick={() => handleThemeChange(theme)}
                className={`group relative p-4 rounded-2xl border text-left transition-all duration-300 ${
                  design.theme === theme 
                    ? 'ring-2 ring-indigo-500 border-transparent shadow-lg bg-white' 
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex flex-col gap-2">
                  <span className={`text-[11px] font-black uppercase tracking-wider ${design.theme === theme ? 'text-indigo-600' : 'text-slate-500'}`}>
                    {theme.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  
                  {/* Visual Color Preview Chip */}
                  <div className="flex -space-x-1">
                    <div className="w-6 h-6 rounded-full border border-white shadow-sm ring-1 ring-slate-100" style={{ backgroundColor: themeColors.background }} />
                    <div className="w-6 h-6 rounded-full border border-white shadow-sm ring-1 ring-slate-100" style={{ backgroundColor: themeColors.buttons }} />
                    <div className="w-6 h-6 rounded-full border border-white shadow-sm ring-1 ring-slate-100" style={{ backgroundColor: themeColors.title }} />
                  </div>
                </div>

                {design.theme === theme && (
                  <div className="absolute top-2 right-2">
                    <div className="bg-indigo-600 text-white p-1 rounded-full">
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
      
      {/* Header Layout */}
      <div className="space-y-3">
        <label className="text-sm font-bold text-slate-700">Header Layout</label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {['classic', 'hero', 'banner', 'cutout', 'shape'].map((layout) => (
            <button
              key={layout}
              onClick={() => {
                setDesign({...design, header: {...design.header, layout: layout as any}});
              }}
              className={`p-2 rounded-xl border text-[10px] font-bold uppercase tracking-tight transition ${design.header.layout === layout ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-300'}`}
            >
              {layout}
            </button>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div className="space-y-3">
        <label className="text-sm font-bold text-slate-700">Font</label>
        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 'sans', label: 'Modern', class: 'font-sans' },
            { id: 'display', label: 'Bold', class: 'font-display' },
            { id: 'serif', label: 'Elegant', class: 'font-serif' },
            { id: 'mono', label: 'Tech', class: 'font-mono' }
          ].map((font) => (
            <button
              key={font.id}
              onClick={() => {
                setDesign({...design, typography: { fontFamily: font.id as any }});
              }}
              className={`p-3 rounded-xl border text-sm transition-all ${design.typography?.fontFamily === font.id ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500 shadow-sm' : 'border-slate-100 bg-white hover:border-slate-300'}`}
            >
              <div className="flex flex-col items-center">
                <span className={`${font.class} text-lg font-bold ${design.typography?.fontFamily === font.id ? 'text-indigo-600' : 'text-slate-800'}`}>Aa</span>
                <p className="text-[9px] mt-1 font-bold uppercase tracking-tighter opacity-60 truncate">{font.label}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Button Style */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-6">
           <div className="space-y-3">
             <label className="text-sm font-bold text-slate-700">Card Shape</label>
             <div className="grid grid-cols-2 gap-2">
               {[
                 { id: 'rounded-none', label: 'Square' },
                 { id: 'rounded-lg', label: 'Soft' },
                 { id: 'rounded-2xl', label: 'Modern' },
                 { id: 'rounded-full', label: 'Capsule' }
               ].map((style) => (
                 <button
                   key={style.id}
                   onClick={() => {
                     setDesign({...design, buttons: { ...design.buttons, style: style.id as any }});
                   }}
                   className={`px-3 py-2 rounded-xl border text-[10px] font-bold tracking-tight transition-all capitalize ${design.buttons?.style === style.id ? 'bg-slate-800 text-white border-slate-800' : 'border-slate-100 bg-white text-slate-500'}`}
                 >
                   {style.label}
                 </button>
               ))}
             </div>
           </div>

           <div className="space-y-3">
             <label className="text-sm font-bold text-slate-700">Card Shadow</label>
             <div className="grid grid-cols-2 gap-2">
               {[
                 { id: 'none', label: 'None' },
                 { id: 'soft', label: 'Natural' },
                 { id: 'hard', label: 'Hard' }
               ].map((shadow) => (
                 <button
                   key={shadow.id}
                   onClick={() => {
                     setDesign({...design, buttons: { ...design.buttons, shadow: shadow.id as any }});
                   }}
                   className={`px-3 py-2 rounded-xl border text-[10px] font-bold tracking-tight transition-all capitalize ${design.buttons?.shadow === shadow.id ? 'bg-slate-800 text-white border-slate-800' : 'border-slate-100 bg-white text-slate-500'}`}
                 >
                   {shadow.label}
                 </button>
               ))}
             </div>
           </div>
        </div>
      </div>

      {/* Mini Preview Section */}
      <div className="p-5 bg-slate-900 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
        
        <div className="flex items-center justify-between mb-4 relative z-10">
          <label className="text-[10px] font-mono font-black text-white/40 uppercase tracking-[0.2em] block">Mini Preview</label>
          <div className="flex items-center gap-2">
            {JSON.stringify(design) !== JSON.stringify(profile.designSettings) && (
              <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                <span className="text-[8px] text-amber-500 font-black uppercase tracking-tighter">Unsaved</span>
                <div className="w-1 h-1 rounded-full bg-amber-500 animate-pulse" />
              </div>
            )}
            <span className="text-[8px] bg-white/10 text-white/50 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">{design.header.layout}</span>
          </div>
        </div>
        
        <div 
          className={`w-full max-w-[240px] mx-auto rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden transition-all duration-300 bg-white ${
            design.typography?.fontFamily === 'display' ? 'font-display' : 
            design.typography?.fontFamily === 'serif' ? 'font-serif' : 
            design.typography?.fontFamily === 'mono' ? 'font-mono' : 'font-sans'
          }`}
          style={{ 
            backgroundColor: design.colors.background,
            fontFamily: 
              design.typography?.fontFamily === 'display' ? '"Space Grotesk", sans-serif' : 
              design.typography?.fontFamily === 'serif' ? '"Playfair Display", serif' : 
              design.typography?.fontFamily === 'mono' ? '"JetBrains Mono", monospace' : '"Inter", sans-serif'
          }}
        >
          {/* Mock Banner Layout Visual */}
          {design.header.layout === 'banner' && (
            <div className="w-full h-12" style={{ backgroundColor: design.colors.buttons + '15' }} />
          )}
          
          <div className={`p-5 space-y-4 ${design.header.layout === 'banner' ? '-mt-8' : ''}`}>
             <div className={`flex gap-3 ${
               design.header.layout === 'hero' ? 'flex-col items-center text-center' : 
               design.header.layout === 'classic' ? 'flex-row items-center text-left' :
               'flex-col items-center text-center'
             }`}>
                {/* Avatar Shape Mock */}
                <div className={`w-14 h-14 shadow-lg transition-all duration-500 shrink-0 flex items-center justify-center p-0.5 ${
                  design.header.layout === 'shape' ? 'rounded-[1.2rem] rotate-12' : 
                  design.header.layout === 'cutout' ? 'rounded-xl' : 'rounded-full'
                }`} style={{ backgroundColor: '#FFF', border: `2px solid ${design.colors.buttons}` }}>
                    <div className={`w-full h-full bg-slate-100 ${
                       design.header.layout === 'shape' ? 'rounded-[0.8rem]' : 
                       design.header.layout === 'cutout' ? 'rounded-lg' : 'rounded-full'
                    }`} />
                </div>
                
                <div className={`flex flex-col gap-1.5 ${design.header.layout === 'classic' ? 'items-start' : 'items-center'}`}>
                  <div className="h-3 w-16 rounded" style={{ backgroundColor: design.colors.title }} />
                  <div className="h-1.5 w-28 rounded" style={{ backgroundColor: design.colors.pageText + '50' }} />
                </div>
             </div>
             
              {/* Simple Button Mock */}
             <div className="space-y-2 pt-2">
               {[1, 2].map(i => {
                 const roundedClass = design.buttons?.style || 'rounded-2xl';
                 const shadowStyle = design.buttons?.shadow === 'soft' 
                   ? { boxShadow: '0 4px 12px rgba(0,0,0,0.08)' } 
                   : design.buttons?.shadow === 'hard' 
                   ? { boxShadow: '4px 4px 0px rgba(0,0,0,0.2)', border: '2px solid rgba(0,0,0,0.1)' } 
                   : { boxShadow: 'none' };

                 return (
                   <div 
                     key={i} 
                     className={`border p-2.5 flex gap-3 transition-all duration-300 ${roundedClass}`}
                     style={{ 
                       backgroundColor: design.colors.background === '#FFFFFF' ? '#F8FAFC' : design.colors.background + '60',
                       borderColor: design.colors.pageText + '10',
                       ...shadowStyle
                      }}
                   >
                      <div className={`w-8 h-8 shrink-0 ${roundedClass === 'rounded-full' ? 'rounded-full' : 'rounded-lg'}`} style={{ backgroundColor: design.colors.buttons + '15' }} />
                      <div className="flex-1 space-y-1.5 py-1">
                         <div className="h-1.5 w-12 rounded" style={{ backgroundColor: design.colors.title + '20' }} />
                         <div className="text-[9px] font-bold truncate leading-none" style={{ color: design.colors.buttons }}>
                           Sample Label
                         </div>
                         <div className="h-1 w-full rounded-full opacity-10" style={{ backgroundColor: design.colors.pageText }} />
                      </div>
                   </div>
                 );
               })}
             </div>
          </div>
        </div>
      </div>

      {/* Colors */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { key: 'background', label: 'Background' },
          { key: 'buttons', label: 'Buttons' },
          { key: 'buttonText', label: 'Button Text' },
          { key: 'pageText', label: 'Page Text' },
          { key: 'title', label: 'Title' },
        ].map((item: any) => (
          <div key={item.key}>
            <label className="text-xs font-semibold text-slate-600 block mb-1">{item.label}</label>
            <input
              type="color"
              value={design.colors[item.key as keyof typeof design.colors]}
              onChange={(e) => {
                const newColors = {...design.colors, [item.key]: e.target.value};
                const newDesign = {...design, colors: newColors};
                setDesign(newDesign);
              }}
              className="w-full h-10 rounded-lg cursor-pointer border-transparent"
            />
          </div>
        ))}
      </div>

      <button 
        onClick={handleSave} 
        className="w-full bg-indigo-600 text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all active:scale-[0.98] shadow-md shadow-indigo-100"
      >
        Save All Design Settings
      </button>
    </div>
  );
}
