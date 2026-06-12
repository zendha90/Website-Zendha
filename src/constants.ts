import { DesignSettings } from "./types";

export const PREDEFINED_THEMES: { [key: string]: Omit<DesignSettings, 'theme'> } = {
  minimalist: {
    header: { layout: 'classic', titleStyle: 'text' },
    colors: { background: '#FFFFFF', buttons: '#1e293b', buttonText: '#FFFFFF', pageText: '#334155', title: '#0f172a' }
  },
  darkMode: {
    header: { layout: 'classic', titleStyle: 'text' },
    colors: { background: '#0f172a', buttons: '#8b82f6', buttonText: '#FFFFFF', pageText: '#cbd5e1', title: '#FFFFFF' }
  },
  softPastel: {
    header: { layout: 'classic', titleStyle: 'text' },
    colors: { background: '#fff1f2', buttons: '#e11d48', buttonText: '#fff1f2', pageText: '#881337', title: '#4c0519' }
  },
  corporateBlue: {
    header: { layout: 'classic', titleStyle: 'text' },
    colors: { background: '#f8fafc', buttons: '#0284c7', buttonText: '#FFFFFF', pageText: '#1e293b', title: '#0c4a6e' }
  }
};
