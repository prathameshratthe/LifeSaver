import { motion } from 'framer-motion';
import { User, Mail, Calendar, Trophy, Flame, Target, Zap, Star, Award } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { useThemeStore } from '../stores/themeStore';

export default function ProfilePage() {
  const isDark = useThemeStore((s) => s.isDark);
  const { user, userStats, habits } = useAppStore();
  const cardClass = `${isDark ? 'glass-card' : 'glass-card-light'} p-5`;

  const xpForNextLevel = (userStats.level) * 200;
  const xpProgress = ((userStats.xp % 200) / 200) * 100;

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-3xl mx-auto w-full">
      {/* Profile Header */}
      <motion.div
        className={`${cardClass} text-center py-10`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 rounded-2xl bg-gradient-emerald flex items-center justify-center text-4xl font-bold text-white mx-auto uppercase">
            {user?.name?.[0] || 'U'}
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-sm font-bold text-white shadow-lg">
            {userStats.level}
          </div>
        </div>
        <h2 className="text-2xl font-bold mt-2">{user?.name || 'User'}</h2>
        <p className={`text-sm ${isDark ? 'text-charcoal-400' : 'text-charcoal-500'}`}>
          Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en', { month: 'long', year: 'numeric' }) : 'recently'}
        </p>

        {/* XP Bar */}
        <div className="mt-6 max-w-sm mx-auto">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-emerald-400">Level {userStats.level}</span>
            <span className={isDark ? 'text-charcoal-400' : 'text-charcoal-500'}>{userStats.xp % 200}/{200} XP</span>
          </div>
          <div className={`h-3 rounded-full ${isDark ? 'bg-white/5' : 'bg-charcoal-100'}`}>
            <motion.div
              className="h-3 rounded-full bg-gradient-emerald"
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Star, label: 'Total XP', value: userStats.xp.toLocaleString(), color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { icon: Flame, label: 'Best Streak', value: `${Math.max(...habits.map((h) => h.bestStreak), 0)}d`, color: 'text-orange-400', bg: 'bg-orange-500/10' },
          { icon: Target, label: 'Habits Done', value: userStats.habitsCompleted, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { icon: Zap, label: 'Focus Hours', value: `${Math.round(userStats.totalFocusHours)}h`, color: 'text-ocean-300', bg: 'bg-ocean-300/10' },
        ].map((s, i) => (
          <motion.div key={s.label} className={cardClass} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div className="text-xl font-bold">{s.value}</div>
            <div className={`text-xs ${isDark ? 'text-charcoal-400' : 'text-charcoal-500'}`}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Badges */}
      <motion.div className={cardClass} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="flex items-center gap-2 mb-5">
          <Award className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-semibold">Achievements</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {userStats.badges.map((badge) => (
            <div key={badge._id} className={`text-center p-4 rounded-xl ${isDark ? 'bg-white/3' : 'bg-charcoal-50'}`}>
              <div className="text-3xl mb-2">{badge.icon}</div>
              <div className="text-sm font-medium">{badge.name}</div>
              <div className={`text-xs mt-1 ${isDark ? 'text-charcoal-400' : 'text-charcoal-500'}`}>{badge.description}</div>
            </div>
          ))}
          {/* Locked badges */}
          {['🔒', '🔒', '🔒', '🔒'].map((_, i) => (
            <div key={`locked-${i}`} className={`text-center p-4 rounded-xl ${isDark ? 'bg-white/3' : 'bg-charcoal-50'} opacity-40`}>
              <div className="text-3xl mb-2">🔒</div>
              <div className="text-sm font-medium">Locked</div>
              <div className={`text-xs mt-1 ${isDark ? 'text-charcoal-500' : 'text-charcoal-400'}`}>Keep going!</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Profile Info */}
      <motion.div className={cardClass} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <h3 className="text-lg font-semibold mb-5">Profile Information</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <User className={`w-5 h-5 ${isDark ? 'text-charcoal-400' : 'text-charcoal-500'}`} />
            <div>
              <div className={`text-xs ${isDark ? 'text-charcoal-500' : 'text-charcoal-400'}`}>Name</div>
              <div className="text-sm font-medium">{user?.name || 'User'}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className={`w-5 h-5 ${isDark ? 'text-charcoal-400' : 'text-charcoal-500'}`} />
            <div>
              <div className={`text-xs ${isDark ? 'text-charcoal-500' : 'text-charcoal-400'}`}>Email</div>
              <div className="text-sm font-medium">{user?.email || 'user@example.com'}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className={`w-5 h-5 ${isDark ? 'text-charcoal-400' : 'text-charcoal-500'}`} />
            <div>
              <div className={`text-xs ${isDark ? 'text-charcoal-500' : 'text-charcoal-400'}`}>Joined</div>
              <div className="text-sm font-medium">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Unknown'}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
