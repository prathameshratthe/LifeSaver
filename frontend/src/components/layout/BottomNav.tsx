import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Flame, Timer, Wallet, BarChart3 } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';

const items = [
  { path: '/app/dashboard', icon: LayoutDashboard, label: 'Home' },
  { path: '/app/habits', icon: Flame, label: 'Habits' },
  { path: '/app/focus', icon: Timer, label: 'Focus' },
  { path: '/app/finance', icon: Wallet, label: 'Finance' },
  { path: '/app/analytics', icon: BarChart3, label: 'Stats' },
];

export default function BottomNav() {
  const isDark = useThemeStore((s) => s.isDark);

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-40 md:hidden flex items-center justify-around px-2 py-2
      ${isDark ? 'bg-charcoal-900/95 border-t border-white/5' : 'bg-white/95 border-t border-charcoal-100'} backdrop-blur-xl`}>
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all
            ${isActive
              ? 'text-emerald-400'
              : isDark ? 'text-charcoal-500' : 'text-charcoal-400'}`
          }
        >
          <item.icon className="w-5 h-5" />
          <span className="text-[10px] font-medium">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
