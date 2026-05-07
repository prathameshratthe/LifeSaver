import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Target, Flame, Timer, Wallet, Briefcase,
  Heart, BookOpen, BarChart3, Settings, User, Bot,
  ChevronLeft, ChevronRight, Sparkles
} from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';
import { useAppStore } from '../../stores/appStore';

const navItems = [
  { path: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/app/habits', icon: Flame, label: 'Habits' },
  { path: '/app/goals', icon: Target, label: 'Goals' },
  { path: '/app/focus', icon: Timer, label: 'Focus' },
  { path: '/app/finance', icon: Wallet, label: 'Finance' },
  { path: '/app/career', icon: Briefcase, label: 'Career' },
  { path: '/app/wellness', icon: Heart, label: 'Wellness' },
  { path: '/app/journal', icon: BookOpen, label: 'Journal' },
  { path: '/app/coach', icon: Bot, label: 'AI Coach' },
  { path: '/app/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/app/settings', icon: Settings, label: 'Settings' },
  { path: '/app/profile', icon: User, label: 'Profile' },
];

export default function Sidebar() {
  const isDark = useThemeStore((s) => s.isDark);
  const { sidebarOpen, setSidebarOpen } = useAppStore();

  return (
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={`fixed top-0 left-0 h-full z-50 hidden md:flex flex-col transition-all duration-300
          ${isDark ? 'bg-charcoal-900/95 border-r border-white/5' : 'bg-white/95 border-r border-charcoal-100'}
          backdrop-blur-xl ${sidebarOpen ? 'w-64' : 'w-20'}`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 p-5 mb-2">
          <div className="w-10 h-10 min-w-[40px] rounded-xl bg-gradient-emerald flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <h1 className="text-lg font-bold text-gradient">LifeReset</h1>
                <p className={`text-xs ${isDark ? 'text-charcoal-400' : 'text-charcoal-500'}`}>Back on Track</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                ${isActive
                  ? isDark
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'bg-emerald-500/10 text-emerald-500'
                  : isDark
                    ? 'text-charcoal-400 hover:text-white hover:bg-white/5'
                    : 'text-charcoal-500 hover:text-charcoal-900 hover:bg-charcoal-50'
                }
                ${!sidebarOpen ? 'justify-center' : ''}`
              }
            >
              <item.icon className="w-6 h-6 flex-shrink-0" />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="text-sm font-medium overflow-hidden whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}
        </nav>

        {/* Collapse Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`m-3 p-2.5 rounded-xl transition-all duration-200
            ${isDark ? 'hover:bg-white/5 text-charcoal-400' : 'hover:bg-charcoal-50 text-charcoal-500'}
            ${!sidebarOpen ? 'mx-auto' : ''}`}
        >
          {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
      </motion.aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed top-0 left-0 h-full w-72 z-50 md:hidden flex flex-col
              ${isDark ? 'bg-charcoal-900 border-r border-white/5' : 'bg-white border-r border-charcoal-100'}`}
          >
            <div className="flex items-center gap-3 p-5 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-emerald flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gradient">LifeReset</h1>
                <p className={`text-xs ${isDark ? 'text-charcoal-400' : 'text-charcoal-500'}`}>Back on Track</p>
              </div>
            </div>
            <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                    ${isActive
                      ? isDark ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-500/10 text-emerald-500'
                      : isDark ? 'text-charcoal-400 hover:text-white hover:bg-white/5' : 'text-charcoal-500 hover:text-charcoal-900 hover:bg-charcoal-50'
                    }`
                  }
                >
                  <item.icon className="w-6 h-6" />
                  <span className="text-sm font-medium">{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
