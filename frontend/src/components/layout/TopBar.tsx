import { Bell, Menu, Moon, Sun, Search } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';
import { useAppStore } from '../../stores/appStore';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TopBar() {
  const { isDark, toggle } = useThemeStore();
  const { notifications, markNotificationRead, setSidebarOpen, sidebarOpen, user } = useAppStore();
  const [showNotifs, setShowNotifs] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className={`sticky top-0 z-30 px-6 md:px-8 lg:px-10 py-4 flex items-center justify-between gap-4
      ${isDark ? 'bg-charcoal-900/80' : 'bg-white/80'} backdrop-blur-xl border-b ${isDark ? 'border-white/5' : 'border-charcoal-100'}`}>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`p-2 rounded-xl md:hidden ${isDark ? 'hover:bg-white/5 text-charcoal-300' : 'hover:bg-charcoal-50 text-charcoal-600'}`}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search */}
        <div className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-xl ${isDark ? 'bg-white/5' : 'bg-charcoal-50'}`}>
          <Search className={`w-4 h-4 ${isDark ? 'text-charcoal-400' : 'text-charcoal-500'}`} />
          <input
            type="text"
            placeholder="Search..."
            className={`bg-transparent outline-none text-sm w-48 ${isDark ? 'text-white placeholder-charcoal-400' : 'text-charcoal-900 placeholder-charcoal-500'}`}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={toggle}
          className={`p-2.5 rounded-xl transition-all ${isDark ? 'hover:bg-white/5 text-charcoal-300' : 'hover:bg-charcoal-50 text-charcoal-600'}`}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className={`p-2.5 rounded-xl transition-all relative ${isDark ? 'hover:bg-white/5 text-charcoal-300' : 'hover:bg-charcoal-50 text-charcoal-600'}`}
          >
            <Bell className="w-5 h-5" />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-rose-500 rounded-full text-xs text-white flex items-center justify-center font-medium">
                {unread}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifs && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                className={`absolute right-0 top-12 w-80 rounded-2xl shadow-2xl overflow-hidden z-50
                  ${isDark ? 'bg-charcoal-800 border border-white/10' : 'bg-white border border-charcoal-100'}`}
              >
                <div className="p-4 border-b border-white/5">
                  <h3 className="font-semibold">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.slice(0, 10).map((n) => (
                    <button
                      key={n._id}
                      onClick={() => markNotificationRead(n._id)}
                      className={`w-full text-left p-4 border-b transition-all
                        ${isDark ? 'border-white/5 hover:bg-white/5' : 'border-charcoal-50 hover:bg-charcoal-50'}
                        ${!n.read ? (isDark ? 'bg-emerald-500/5' : 'bg-emerald-50') : ''}`}
                    >
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className={`text-xs mt-1 ${isDark ? 'text-charcoal-400' : 'text-charcoal-500'}`}>{n.message}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-xl bg-gradient-emerald flex items-center justify-center text-white text-sm font-bold cursor-pointer uppercase">
          {user?.name?.[0] || 'U'}
        </div>
      </div>
    </header>
  );
}
