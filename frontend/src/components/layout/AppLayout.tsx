import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import BottomNav from './BottomNav';
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
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gradient-main text-white' : 'bg-gradient-main-light text-charcoal-900'}`}>
        <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-main text-white' : 'bg-gradient-main-light text-charcoal-900'}`}>
      <Sidebar />
      <div className={`transition-all duration-300 flex flex-col min-h-screen ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        <TopBar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 w-full max-w-7xl mx-auto pb-24 md:pb-8">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
