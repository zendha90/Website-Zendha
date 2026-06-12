import React, { useState } from 'react';
import { Palette } from 'lucide-react';
import { RatecardProfile } from '../types';
import { PREDEFINED_THEMES } from '../constants';

export default function DesignSettingsForm({ profile, onSave }: { profile: RatecardProfile; onSave: (profile: RatecardProfile) => void }) {
  const [design, setDesign] = useState(profile.designSettings || {
    theme: 'minimalist',
    header: {
      layout: 'classic',
      titleStyle: 'text',
    },
    colors: {
      background: '#FFFFFF',
      buttons: '#1E293B',
      buttonText: '#FFFFFF',
      pageText: '#334155',
      title: '#0F172A',
    }
  });

  const handleThemeChange = (theme: string) => {
    setDesign({
        theme,
        ...PREDEFINED_THEMES[theme]
    });
  };

  const handleSave = () => {
    onSave({ ...profile, designSettings: design });
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-slate-800">Customize Design</h2>

      {/* Theme Selection */}
      <div className="space-y-4">
        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <Palette className="w-4 h-4 text-indigo-500" />
          Template Tema Ready
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
                    ? 'ring-2 ring-indigo-500 border-transparent shadow-lg' 
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex flex-col gap-2">
                  <span className={`text-xs font-bold capitalize ${design.theme === theme ? 'text-indigo-600' : 'text-slate-700'}`}>
                    {theme.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  
                  {/* Visual Color Preview Chip */}
                  <div className="flex -space-x-1">
                    <div className="w-6 h-6 rounded-full border border-slate-100 shadow-sm" style={{ backgroundColor: themeColors.background }} />
                    <div className="w-6 h-6 rounded-full border border-slate-100 shadow-sm" style={{ backgroundColor: themeColors.buttons }} />
                    <div className="w-6 h-6 rounded-full border border-slate-100 shadow-sm" style={{ backgroundColor: themeColors.title }} />
                  </div>
                </div>

                {design.theme === theme && (
                  <div className="absolute top-2 right-2">
                    <div className="bg-indigo-600 text-white p-1 rounded-full">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        <label className="text-sm font-semibold text-slate-700">Header Layout</label>
        <div className="grid grid-cols-5 gap-2">
          {['classic', 'hero', 'banner', 'cutout', 'shape'].map((layout) => (
            <button
              key={layout}
              onClick={() => setDesign({...design, header: {...design.header, layout: layout as any}})}
              className={`p-2 rounded-lg border text-xs capitalize ${design.header.layout === layout ? 'bg-indigo-50 border-indigo-500' : 'border-slate-200'}`}
            >
              {layout}
            </button>
          ))}
        </div>
      </div>

      {/* Mini Preview Section */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-3">Live Preview (Mini)</label>
        <div 
          className="w-full max-w-[280px] mx-auto rounded-3xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-500"
          style={{ backgroundColor: design.colors.background }}
        >
          <div className="p-4 space-y-3">
             <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-slate-200 shadow-sm" />
                <div className="h-3 w-20 rounded bg-slate-200" style={{ backgroundColor: design.colors.title + '40' }} />
                <div className="h-2 w-32 rounded bg-slate-200" style={{ backgroundColor: design.colors.pageText + '40' }} />
             </div>
             
             <div className="space-y-2 pt-2">
               {[1, 2].map(i => (
                 <div key={i} className="bg-white rounded-xl border border-slate-100 p-2 flex gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 shrink-0" />
                    <div className="flex-1 space-y-1.5 py-1">
                       <div className="h-2 w-full rounded bg-slate-100" />
                       <div className="h-4 w-full rounded" style={{ backgroundColor: design.colors.buttons }} />
                    </div>
                 </div>
               ))}
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
              onChange={(e) => setDesign({...design, colors: {...design.colors, [item.key]: e.target.value}})}
              className="w-full h-10 rounded-lg cursor-pointer"
            />
          </div>
        ))}
      </div>

      <button onClick={handleSave} className="w-full bg-indigo-600 text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition">Save Design Changes</button>
    </div>
  );
}
