/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Sliders, Lock, RefreshCw, Layers } from 'lucide-react';
import { AppData, AffiliateLink, RatecardProfile, RatecardService } from './types';
import LinktreeView from './components/LinktreeView';
import RatecardView from './components/RatecardView';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  // Simple, super robust client router based on window path routing
  const [currentView, setCurrentView] = useState<'home' | 'ratecard' | 'admin'>(() => {
    const path = window.location.pathname;
    if (path === '/ratecard') return 'ratecard';
    if (path === '/admin') return 'admin';
    return 'home';
  });

  // Handle back button of the browser
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/ratecard') setCurrentView('ratecard');
      else if (path === '/admin') setCurrentView('admin');
      else setCurrentView('home');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (view: 'home' | 'ratecard' | 'admin') => {
    setCurrentView(view);
    const path = view === 'home' ? '/' : `/${view}`;
    window.history.pushState(null, '', path);
    // Smooth scroll back to top of the page on view switch
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch all initial linktree and ratecard content
  const loadData = async () => {
    try {
      // Added timestamp parameter to prevent browser caching on production/CPanel
      const res = await fetch(`/api/data?t=${Date.now()}`);
      if (!res.ok) throw new Error('Gagal mengambil data dari server database');
      const json = await res.json();
      setData(json);
      setErrorStatus(null);
    } catch (err: any) {
      console.error(err);
      setErrorStatus(err.message || 'Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Increment click counts in the background
  const registerClick = async (linkId: string) => {
    try {
      await fetch(`/api/links/${linkId}/click`, { method: 'POST' });
      // Optimistic update local metrics
      if (data) {
        const updatedLinks = data.links.map(l => 
          l.id === linkId ? { ...l, clicks: (l.clicks || 0) + 1 } : l
        );
        setData({ ...data, links: updatedLinks });
      }
    } catch (err) {
      console.error('Failed to register link click analytics', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden" id="loading-screen">
        {/* Ambient decorative lighting */}
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-100/40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-slate-200/40 blur-3xl pointer-events-none" />

        <div className="text-center relative z-10" id="loading-spinner">
          <div className="w-14 h-14 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-sm font-display font-semibold text-slate-700 tracking-wide">{data?.profile?.name || "Creator Hub"}</h2>
          <p className="text-xs text-slate-400 mt-1">Memuat database local...</p>
        </div>
      </div>
    );
  }

  if (errorStatus || !data) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 px-4" id="error-screen">
        <div className="bg-white border border-slate-150 max-w-sm rounded-3xl p-8 shadow-xl text-center">
          <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 font-bold font-mono">!</span>
          </div>
          <h2 className="text-md font-display font-black text-slate-800">Gagal Tersambung</h2>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">{errorStatus || 'Koneksi database tidak tersedia'}</p>
          <button 
            onClick={() => { setLoading(true); loadData(); }}
            className="mt-6 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
            id="retry-fetch-btn"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Cobalah Lagi
          </button>
        </div>
      </div>
    );
  }

  const getAppBgStyle = () => {
    if (currentView === 'ratecard') {
      return { backgroundColor: '#0B0B0F' };
    }
    if (currentView === 'admin') {
      return { backgroundColor: '#f8fafc' };
    }
    const ds = data?.profile?.designSettings;
    if (ds?.backgroundType === 'gradient') {
      return {
        background: `linear-gradient(135deg, ${ds.colors.background} 0%, ${ds.colors.backgroundGradientSecond || '#F1F5F9'} 100%)`
      };
    }
    return { backgroundColor: ds?.colors.background || '#f8fafc' };
  };

  return (
    <div 
      className={`min-h-screen w-full relative transition-all duration-500 selection:bg-indigo-500 selection:text-white ${currentView === 'ratecard' ? '' : 'pb-20'}`} 
      id="main-application-frame"
      style={getAppBgStyle()}
    >
      {/* Visual background lights for top-tier aesthetics */}
      {currentView !== 'ratecard' && (
        <>
          <div className="absolute top-0 right-0 w-[40%] h-[40%] rounded-full bg-indigo-100/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-[20%] left-0 w-[40%] h-[40%] rounded-full bg-slate-100/50 blur-3xl pointer-events-none" />
        </>
      )}

      {/* Main Container switch */}
      <div className="relative z-15 min-h-[80vh]">
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <motion.div
              key="linktree"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              id="view-linktree"
            >
              <LinktreeView 
                links={data.links}
                profile={data.profile}
                onLinkClick={registerClick}
                onNavigateToRatecard={() => navigateTo('ratecard')}
              />
            </motion.div>
          )}

          {currentView === 'ratecard' && (
            <motion.div
              key="ratecard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              id="view-ratecard"
            >
              <RatecardView 
                profile={data.profile}
                services={data.services}
                projects={data.projects}
                brands={data.brands || []}
                onNavigateBack={() => navigateTo('home')}
                onNavigateToAdmin={() => navigateTo('admin')}
              />
            </motion.div>
          )}

          {currentView === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              id="view-admin"
            >
              <AdminPanel 
                onNavigateBack={() => navigateTo('home')}
                onRefreshData={loadData}
                links={data.links}
                profile={data.profile}
                services={data.services}
                projects={data.projects}
                brands={data.brands}
                clickLogs={data.clickLogs}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
