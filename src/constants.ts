import { DesignSettings } from "./types";

export const PREDEFINED_THEMES: { [key: string]: Omit<DesignSettings, 'theme'> } = {
  minimalist: {
    header: { layout: 'classic', titleStyle: 'text' },
    colors: { background: '#FFFFFF', buttons: '#1e293b', buttonText: '#FFFFFF', pageText: '#334155', title: '#0f172a' }
  },
  darkMode: {
    header: { layout: 'classic', titleStyle: 'text' },
    colors: { background: '#0f172a', buttons: '#6366f1', buttonText: '#FFFFFF', pageText: '#cbd5e1', title: '#FFFFFF' }
  },
  forestZen: {
    header: { layout: 'classic', titleStyle: 'text' },
    colors: { background: '#f0f4f0', buttons: '#064e3b', buttonText: '#FFFFFF', pageText: '#374151', title: '#064e3b' }
  },
  royalGold: {
    header: { layout: 'classic', titleStyle: 'text' },
    colors: { background: '#fffbeb', buttons: '#92400e', buttonText: '#FFFFFF', pageText: '#78350f', title: '#451a03' }
  },
  softPastel: {
    header: { layout: 'classic', titleStyle: 'text' },
    colors: { background: '#fff1f2', buttons: '#e11d48', buttonText: '#FFFFFF', pageText: '#881337', title: '#4c0519' }
  },
  midnightPurple: {
    header: { layout: 'classic', titleStyle: 'text' },
    colors: { background: '#2e1065', buttons: '#a855f7', buttonText: '#FFFFFF', pageText: '#e9d5ff', title: '#FFFFFF' }
  }
};
