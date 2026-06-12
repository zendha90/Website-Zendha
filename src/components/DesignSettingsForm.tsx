import React, { useState } from 'react';
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
      <div className="space-y-3">
        <label className="text-sm font-semibold text-slate-700">Choose Theme</label>
        <div className="grid grid-cols-2 gap-3">
          {Object.keys(PREDEFINED_THEMES).map((theme) => (
            <button
              key={theme}
              onClick={() => handleThemeChange(theme)}
              className={`p-3 rounded-xl border text-sm capitalize transition ${design.theme === theme ? 'bg-indigo-50 border-indigo-500 font-bold' : 'border-slate-200 hover:border-slate-300'}`}
            >
              {theme}
            </button>
          ))}
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
