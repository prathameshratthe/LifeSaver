import { motion } from 'framer-motion';
import { Moon, Sun, Bell, Download, RotateCcw, Shield, Palette, Globe, Volume2 } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';
import { useState } from 'react';

export default function SettingsPage() {
  const { isDark, toggle } = useThemeStore();
  const [notifications, setNotifications] = useState({ habits: true, sleep: true, water: true, focus: true, reflection: false });
  const cardClass = `${isDark ? 'glass-card' : 'glass-card-light'} p-5`;

  const ToggleSwitch = ({ on, onChange }: { on: boolean; onChange: () => void }) => (
    <button onClick={onChange} className={`w-11 h-6 rounded-full transition-all relative ${on ? 'bg-emerald-500' : isDark ? 'bg-white/10' : 'bg-charcoal-200'}`}>
      <div className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5 transition-all ${on ? 'left-5.5' : 'left-0.5'}`} style={{ left: on ? '22px' : '2px' }} />
    </button>
  );

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
        <p className={`text-sm mt-1 ${isDark ? 'text-charcoal-400' : 'text-charcoal-500'}`}>Customize your experience</p>
      </div>

      {/* Appearance */}
      <motion.div className={cardClass} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-5">
          <Palette className="w-5 h-5 text-lavender-400" />
          <h3 className="text-lg font-semibold">Appearance</h3>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isDark ? <Moon className="w-5 h-5 text-charcoal-400" /> : <Sun className="w-5 h-5 text-amber-400" />}
            <div>
              <div className="font-medium text-sm">Dark Mode</div>
              <div className={`text-xs ${isDark ? 'text-charcoal-400' : 'text-charcoal-500'}`}>Switch between dark and light themes</div>
            </div>
          </div>
          <ToggleSwitch on={isDark} onChange={toggle} />
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div className={cardClass} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <div className="flex items-center gap-3 mb-5">
          <Bell className="w-5 h-5 text-ocean-300" />
          <h3 className="text-lg font-semibold">Notifications</h3>
        </div>
        <div className="space-y-4">
          {[
            { key: 'habits', label: 'Habit Reminders', desc: 'Get reminded to complete your daily habits' },
            { key: 'sleep', label: 'Sleep Reminders', desc: 'Wind-down notification before bedtime' },
            { key: 'water', label: 'Water Reminders', desc: 'Hydration reminders throughout the day' },
            { key: 'focus', label: 'Focus Sessions', desc: 'Scheduled deep work reminders' },
            { key: 'reflection', label: 'Reflection Prompts', desc: 'End-of-day journaling reminders' },
          ].map((n) => (
            <div key={n.key} className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">{n.label}</div>
                <div className={`text-xs ${isDark ? 'text-charcoal-400' : 'text-charcoal-500'}`}>{n.desc}</div>
              </div>
              <ToggleSwitch on={(notifications as Record<string, boolean>)[n.key]} onChange={() => setNotifications({ ...notifications, [n.key]: !(notifications as Record<string, boolean>)[n.key] })} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Data */}
      <motion.div className={cardClass} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex items-center gap-3 mb-5">
          <Shield className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-semibold">Data & Privacy</h3>
        </div>
        <div className="space-y-3">
          <button className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${isDark ? 'bg-white/3 hover:bg-white/5' : 'bg-charcoal-50 hover:bg-charcoal-100'}`}>
            <Download className="w-5 h-5 text-ocean-300" />
            <div className="text-left">
              <div className="font-medium text-sm">Export Data</div>
              <div className={`text-xs ${isDark ? 'text-charcoal-400' : 'text-charcoal-500'}`}>Download all your data as JSON</div>
            </div>
          </button>
          <button className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${isDark ? 'bg-white/3 hover:bg-white/5' : 'bg-charcoal-50 hover:bg-charcoal-100'}`}>
            <RotateCcw className="w-5 h-5 text-amber-400" />
            <div className="text-left">
              <div className="font-medium text-sm">Backup Progress</div>
              <div className={`text-xs ${isDark ? 'text-charcoal-400' : 'text-charcoal-500'}`}>Save your progress to cloud</div>
            </div>
          </button>
          <button className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-rose-400 ${isDark ? 'bg-rose-500/5 hover:bg-rose-500/10' : 'bg-rose-50 hover:bg-rose-100'}`}>
            <RotateCcw className="w-5 h-5" />
            <div className="text-left">
              <div className="font-medium text-sm">Reset All Goals</div>
              <div className={`text-xs ${isDark ? 'text-rose-400/60' : 'text-rose-400'}`}>This action cannot be undone</div>
            </div>
          </button>
        </div>
      </motion.div>

      {/* About */}
      <motion.div className={cardClass} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <h3 className="text-lg font-semibold mb-3">About LifeReset</h3>
        <p className={`text-sm ${isDark ? 'text-charcoal-400' : 'text-charcoal-500'} mb-2`}>
          Version 1.0.0 — Built with purpose. Designed for progress.
        </p>
        <p className={`text-xs ${isDark ? 'text-charcoal-500' : 'text-charcoal-400'}`}>
          Your life operating system for rebuilding discipline, clarity, and consistency.
        </p>
      </motion.div>
    </div>
  );
}
