import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import BottomNav from './BottomNav';
import GamificationBar from '../GamificationBar';
import { useThemeStore } from '../../stores/themeStore';
import { useAppStore } from '../../stores/appStore';

export default function AppLayout() {
  const navigate = useNavigate();
  const isDark = useThemeStore((s) => s.isDark);
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const { initData, hasInitialized, isLoading } = useAppStore();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    if (!hasInitialized && !isLoading) {
      initData();
    }
  }, [navigate, hasInitialized, isLoading, initData]);

  if (isLoading && !hasInitialized) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center gap-4 ${isDark ? 'bg-gradient-main text-white' : 'bg-gradient-main-light text-charcoal-900'}`}
      >
        <div className="relative w-16 h-16">
          <div
            className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--theme-primary-dim)', borderTopColor: 'var(--theme-primary)' }}
          />
          <div
            className="absolute inset-2 rounded-full border-2 border-t-transparent animate-spin"
            style={{
              borderColor: 'var(--theme-primary-dim)',
              borderTopColor: 'var(--theme-secondary)',
              animationDirection: 'reverse',
              animationDuration: '0.7s',
            }}
          />
        </div>
        <p className="text-sm text-charcoal-400 animate-pulse">Loading your dashboard…</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-main text-white' : 'bg-gradient-main-light text-charcoal-900'}`}>
      <Sidebar />
      <div className={`transition-all duration-300 flex flex-col min-h-screen ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        <TopBar />
        {/* Gamification bar — always visible */}
        <GamificationBar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 w-full max-w-7xl mx-auto pb-24 md:pb-8">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
