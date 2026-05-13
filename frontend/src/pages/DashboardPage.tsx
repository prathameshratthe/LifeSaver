import { motion } from 'framer-motion';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, AreaChart, Area
} from 'recharts';
import { Flame, Target, Zap, TrendingUp, Trophy, Brain, Calendar, Star, ChevronRight } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { useThemeStore } from '../stores/themeStore';
import { Link } from 'react-router-dom';
import CharacterCard from '../components/CharacterCard';

const motivationalLines: Record<string, string[]> = {
  default: [
    "Small progress is still progress. Keep going.",
    "You're building something most people never will — discipline.",
    "Today's effort is tomorrow's strength.",
    "The comeback is always stronger than the setback.",
  ],
  anime: [
    "Believe in yourself dattebayo! Your ninja way starts today.",
    "Even the strongest didn't start strong. Train every day.",
    "Your power level is rising. Don't stop now!",
    "Break your limits. That's how legends are born.",
  ],
  f1: [
    "Every lap counts. Push through the chicanes of life.",
    "Champions don't wait for perfect conditions. They drive.",
    "Fastest lap of your life starts now. Stay focused.",
    "Box, box — pit stop done. Now go full power!",
  ],
};

export default function DashboardPage() {
  const isDark = useThemeStore((s) => s.isDark);
  const { appMode, agent } = useThemeStore();
  const { habits, moodEntries, lifeScore, userStats, focusSessions } = useAppStore();

  const today = new Date().toISOString().split('T')[0];
  const todayCompleted = habits.filter((h) => h.completedDates.includes(today)).length;
  const totalHabits = habits.length;
  const completionPct = totalHabits > 0 ? Math.round((todayCompleted / totalHabits) * 100) : 0;

  const quotes = motivationalLines[appMode] || motivationalLines.default;
  const quote = quotes[new Date().getDate() % quotes.length];

  // XP calculation
  const xpForLevel = (lvl: number) => lvl * 500;
  const xpInLevel = userStats.xp - xpForLevel(userStats.level - 1);
  const xpNeeded = xpForLevel(userStats.level) - xpForLevel(userStats.level - 1);
  const xpPct = Math.min(100, Math.round((xpInLevel / xpNeeded) * 100));

  // Life score for radar
  const radarData = Object.entries(lifeScore).map(([key, value]) => ({
    subject: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
    value,
    fullMark: 100,
  }));

  // Mood chart data
  const moodChartData = moodEntries.slice(-7).map((m) => ({
    date: new Date(m.date).toLocaleDateString('en', { weekday: 'short' }),
    mood: m.mood,
    energy: m.energy,
    motivation: m.motivation,
  }));

  // Focus data
  const focusData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const ds = d.toISOString().split('T')[0];
    const sessions = focusSessions.filter((s) => s.startTime.startsWith(ds));
    return {
      day: d.toLocaleDateString('en', { weekday: 'short' }),
      minutes: sessions.reduce((a, s) => a + s.duration, 0),
    };
  });

  const cardClass = `${isDark ? 'glass-card' : 'glass-card-light'} p-5`;

  const greeting = appMode === 'anime'
    ? `Yo ${userStats.level >= 5 ? 'Genin' : 'Trainee'}! Ready to level up today?`
    : appMode === 'f1'
    ? `Driver, prepare for today's race!`
    : `Good ${new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'} 👋`;

  return (
    <div className="flex flex-col gap-6 animate-fade-in w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="flex-1">
          <motion.h1 className="text-2xl md:text-3xl font-bold" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            {greeting}
          </motion.h1>
          <p className={`mt-1 ${isDark ? 'text-charcoal-400' : 'text-charcoal-500'}`}>
            {new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Agent greeting card + XP — side by side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Agent card */}
        <div className="lg:col-span-1">
          <CharacterCard agent={agent} mode={appMode} compact={false} showQuote={false} />
        </div>

        {/* Daily Focus Card + XP */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Daily Focus */}
          <motion.div
            className="flex-1 rounded-2xl p-6 border relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, var(--theme-primary-dim), rgba(30,42,74,0.3))',
              borderColor: 'var(--theme-primary-dim)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Sweep shine */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
              <div className="absolute top-0 left-[-60%] w-[40%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-20deg] animate-[race-stripe_4s_linear_infinite]" />
            </div>

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 rounded-full" style={{ background: 'var(--theme-primary)' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--theme-primary)' }}>Daily Focus</span>
                </div>
                <h2 className="text-xl font-bold mb-2">Build consistency today</h2>
                <p className={`text-sm ${isDark ? 'text-charcoal-300' : 'text-charcoal-500'} mb-4 italic`}>"{quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" style={{ color: 'var(--theme-primary)' }} />
                    <span className="text-sm">{todayCompleted}/{totalHabits} habits done</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span className="text-sm">{userStats.weeklyStreak} week streak</span>
                  </div>
                </div>
              </div>
              <div className="relative w-20 h-20 flex-shrink-0">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="35" fill="none" stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} strokeWidth="6" />
                  <circle cx="40" cy="40" r="35" fill="none" stroke="url(#themeGrad)" strokeWidth="6" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 35}`}
                    strokeDashoffset={`${2 * Math.PI * 35 * (1 - completionPct / 100)}`}
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="themeGrad">
                      <stop offset="0%" stopColor="var(--theme-primary)" />
                      <stop offset="100%" stopColor="var(--theme-secondary)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-lg font-bold">{completionPct}%</div>
              </div>
            </div>
          </motion.div>

          {/* XP Progress */}
          <motion.div
            className={cardClass}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" style={{ color: 'var(--theme-primary)' }} />
                <span className="text-sm font-semibold">XP Progress — Level {userStats.level}</span>
              </div>
              <span className="text-xs text-charcoal-400">{xpInLevel} / {xpNeeded} XP</span>
            </div>
            <div className="xp-bar-track">
              <motion.div
                className="xp-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${xpPct}%` }}
                transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-charcoal-400">Lv {userStats.level}</span>
              <span className="text-xs" style={{ color: 'var(--theme-primary)' }}>{xpPct}% to Lv {userStats.level + 1}</span>
              <span className="text-xs text-charcoal-400">Lv {userStats.level + 1}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Zap, label: 'Level', value: userStats.level, key: 'level' },
          { icon: Star, label: 'XP', value: userStats.xp.toLocaleString(), key: 'xp' },
          { icon: Trophy, label: 'Badges', value: userStats.badges.length, key: 'badges' },
          { icon: TrendingUp, label: 'Discipline', value: `${userStats.disciplineScore}%`, key: 'disc' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className={`${cardClass} relative overflow-hidden`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.05 }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ background: 'var(--theme-primary-dim)' }}
            >
              <stat.icon className="w-5 h-5" style={{ color: 'var(--theme-primary)' }} />
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className={`text-xs ${isDark ? 'text-charcoal-400' : 'text-charcoal-500'}`}>{stat.label}</div>
            {/* Subtle themed accent */}
            <div
              className="absolute bottom-0 left-0 right-0 h-0.5"
              style={{ background: 'var(--theme-gradient)', opacity: 0.5 }}
            />
          </motion.div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Life Score Radar */}
        <motion.div className={cardClass} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Life Score</h3>
            <Brain className={`w-5 h-5 ${isDark ? 'text-charcoal-400' : 'text-charcoal-500'}`} />
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
              <PolarGrid stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'} />
              <PolarAngleAxis dataKey="subject" tick={{ fill: isDark ? '#8891a5' : '#5a6480', fontSize: 11 }} />
              <Radar dataKey="value" stroke="var(--theme-primary)" fill="var(--theme-primary)" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Mood Trends */}
        <motion.div className={cardClass} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Mood Trends</h3>
            <Link to="/app/wellness" className={`text-xs flex items-center gap-1 ${isDark ? 'text-charcoal-400 hover:text-white' : 'text-charcoal-500 hover:text-charcoal-900'}`}>
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={moodChartData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <XAxis dataKey="date" tick={{ fill: isDark ? '#8891a5' : '#5a6480', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[1, 5]} tick={{ fill: isDark ? '#8891a5' : '#5a6480', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: isDark ? '#1e2a4a' : '#fff', border: 'none', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }} />
              <Line type="monotone" dataKey="mood" stroke="var(--theme-primary)" strokeWidth={2} dot={{ fill: 'var(--theme-primary)', r: 4 }} />
              <Line type="monotone" dataKey="energy" stroke="#53a8d4" strokeWidth={2} dot={{ fill: '#53a8d4', r: 4 }} />
              <Line type="monotone" dataKey="motivation" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-4 justify-center">
            {[{ label: 'Mood', color: 'var(--theme-primary)' }, { label: 'Energy', color: '#53a8d4' }, { label: 'Motivation', color: '#8b5cf6' }].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
                <span className={`text-xs ${isDark ? 'text-charcoal-400' : 'text-charcoal-500'}`}>{l.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Habit Streaks */}
        <motion.div className={cardClass} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Habit Streaks</h3>
            <Link to="/app/habits" className={`text-xs flex items-center gap-1 ${isDark ? 'text-charcoal-400 hover:text-white' : 'text-charcoal-500 hover:text-charcoal-900'}`}>
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {habits.slice(0, 5).map((h) => (
              <div key={h._id} className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? 'bg-white/3 hover:bg-white/5' : 'bg-charcoal-50 hover:bg-charcoal-100'} transition-all`}>
                <span className="text-xl">{h.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{h.name}</div>
                  <div className={`text-xs ${isDark ? 'text-charcoal-400' : 'text-charcoal-500'}`}>{h.currentStreak} day streak</div>
                </div>
                <div className="flex items-center gap-1">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-semibold">{h.bestStreak}</span>
                </div>
              </div>
            ))}
            {habits.length === 0 && (
              <div className="text-center py-8 text-charcoal-400 text-sm">
                No habits yet. <Link to="/app/habits" className="underline" style={{ color: 'var(--theme-primary)' }}>Add your first →</Link>
              </div>
            )}
          </div>
        </motion.div>

        {/* Focus Hours */}
        <motion.div className={cardClass} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Focus This Week</h3>
            <Link to="/app/focus" className={`text-xs flex items-center gap-1 ${isDark ? 'text-charcoal-400 hover:text-white' : 'text-charcoal-500 hover:text-charcoal-900'}`}>
              Start session <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={focusData}>
              <defs>
                <linearGradient id="focusGradThemed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--theme-primary)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--theme-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: isDark ? '#8891a5' : '#5a6480', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: isDark ? '#8891a5' : '#5a6480', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: isDark ? '#1e2a4a' : '#fff', border: 'none', borderRadius: 12 }} />
              <Area type="monotone" dataKey="minutes" stroke="var(--theme-primary)" fill="url(#focusGradThemed)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
          <div className={`text-center mt-2 text-sm ${isDark ? 'text-charcoal-400' : 'text-charcoal-500'}`}>
            Total: <span className="font-semibold" style={{ color: 'var(--theme-primary)' }}>{Math.round(userStats.totalFocusHours)}h</span> focused
          </div>
        </motion.div>
      </div>

      {/* Weekly Reflection */}
      <motion.div className={cardClass} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Weekly Reflection</h3>
          <Calendar className={`w-5 h-5 ${isDark ? 'text-charcoal-400' : 'text-charcoal-500'}`} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { q: 'What went well this week?', placeholder: 'Completed morning routine 5/7 days...' },
            { q: 'What ruined your focus?', placeholder: 'Social media before bed...' },
            { q: 'What should improve next week?', placeholder: 'Start work earlier, exercise daily...' },
            { q: 'What are you avoiding?', placeholder: 'Having that difficult conversation...' },
          ].map((item) => (
            <div key={item.q}>
              <label className={`text-sm font-medium ${isDark ? 'text-charcoal-300' : 'text-charcoal-600'} mb-1.5 block`}>{item.q}</label>
              <textarea
                className={`w-full px-3 py-2.5 rounded-xl text-sm resize-none h-20 outline-none transition-all
                  ${isDark ? 'bg-white/5 border border-white/10 text-white placeholder-charcoal-500' : 'bg-charcoal-50 border border-charcoal-200 text-charcoal-900 placeholder-charcoal-400'}`}
                onFocus={(e) => (e.target.style.borderColor = 'var(--theme-primary)')}
                onBlur={(e) => (e.target.style.borderColor = isDark ? 'rgba(255,255,255,0.1)' : '#dce0e8')}
                placeholder={item.placeholder}
              />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
