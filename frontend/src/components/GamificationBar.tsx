import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Flame, Target, Star } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { useThemeStore } from '../stores/themeStore';
import { useState, useEffect, useRef } from 'react';

// XP thresholds per level
const xpForLevel = (level: number) => level * 500;

function LevelUpToast({ level, onDone }: { level: number; onDone: () => void }) {
  const { appMode } = useThemeStore();
  const emoji = appMode === 'anime' ? '⚡' : appMode === 'f1' ? '🏁' : '🚀';
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="level-up-toast"
      initial={{ opacity: 0, scale: 0.5, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -40 }}
      transition={{ type: 'spring', damping: 12 }}
    >
      {emoji} LEVEL UP! You're now Level {level} {emoji}
    </motion.div>
  );
}

export default function GamificationBar() {
  const { userStats, habits } = useAppStore();
  const { appMode } = useThemeStore();
  const [showLevelUp, setShowLevelUp] = useState(false);
  const prevLevel = useRef(userStats.level);

  const level = userStats.level;
  const xp = userStats.xp;
  const currentLevelXp = xpForLevel(level - 1);
  const nextLevelXp = xpForLevel(level);
  const xpInLevel = xp - currentLevelXp;
  const xpNeeded = nextLevelXp - currentLevelXp;
  const pct = Math.min(100, Math.round((xpInLevel / xpNeeded) * 100));

  const today = new Date().toISOString().split('T')[0];
  const doneToday = habits.filter(h => h.completedDates.includes(today)).length;
  const totalHabits = habits.length;

  // Detect level-up
  useEffect(() => {
    if (userStats.level > prevLevel.current) {
      setShowLevelUp(true);
      prevLevel.current = userStats.level;
    }
  }, [userStats.level]);

  const modeLabel = appMode === 'anime' ? '⚡ Anime Mode' : appMode === 'f1' ? '🏎 F1 Mode' : '✨ Default';

  return (
    <>
      <AnimatePresence>
        {showLevelUp && (
          <LevelUpToast level={level} onDone={() => setShowLevelUp(false)} />
        )}
      </AnimatePresence>

      <div className="w-full px-4 md:px-6 py-2 border-b border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center gap-4 flex-wrap">
          {/* Level badge */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="level-badge">Lv {level}</div>
            <div className="hidden sm:flex items-center gap-1">
              <span className="text-xs text-charcoal-400">XP</span>
              <span className="text-xs font-semibold" style={{ color: 'var(--theme-primary)' }}>
                {xp.toLocaleString()}
              </span>
            </div>
          </div>

          {/* XP Bar */}
          <div className="flex-1 min-w-[100px] max-w-xs">
            <div className="xp-bar-track">
              <motion.div
                className="xp-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
              />
            </div>
            <div className="flex justify-between mt-0.5">
              <span className="text-[9px] text-charcoal-500">{xpInLevel} / {xpNeeded} XP</span>
              <span className="text-[9px] text-charcoal-500">→ Lv {level + 1}</span>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-3 flex-shrink-0 ml-auto">
            {/* Streak */}
            <div className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-xs font-medium text-charcoal-300">{userStats.weeklyStreak}w</span>
            </div>

            {/* Daily mission */}
            <div className="flex items-center gap-1">
              <Target className="w-3.5 h-3.5" style={{ color: 'var(--theme-primary)' }} />
              <span className="text-xs font-medium text-charcoal-300">{doneToday}/{totalHabits}</span>
            </div>

            {/* Discipline score */}
            <div className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-medium text-charcoal-300">{userStats.disciplineScore}%</span>
            </div>

            {/* Badges count */}
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-lavender-400" />
              <span className="text-xs font-medium text-charcoal-300">{userStats.badges.length}</span>
            </div>

            {/* Mode badge */}
            <div className="hidden md:block theme-badge">{modeLabel}</div>
          </div>
        </div>
      </div>
    </>
  );
}
