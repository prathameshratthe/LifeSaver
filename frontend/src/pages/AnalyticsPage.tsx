import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';
import { TrendingUp, Target, Flame, Timer, Brain, Trophy } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { useThemeStore } from '../stores/themeStore';

const COLORS = ['#0cce6b', '#53a8d4', '#8b5cf6', '#f59e0b', '#f43f5e', '#a78bfa', '#fbbf24'];

export default function AnalyticsPage() {
  const isDark = useThemeStore((s) => s.isDark);
  const { habits, moodEntries, focusSessions, lifeScore, userStats, transactions } = useAppStore();
  const cardClass = `${isDark ? 'glass-card' : 'glass-card-light'} p-5`;

  // Habit consistency (last 30 days)
  const habitConsistency = habits.map((h) => {
    const last30 = Array.from({ length: 30 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - i); return d.toISOString().split('T')[0]; });
    const completed = last30.filter((d) => h.completedDates.includes(d)).length;
    return { name: h.name, consistency: Math.round((completed / 30) * 100), icon: h.icon };
  });

  // Weekly productivity
  const weeklyData = Array.from({ length: 8 }, (_, wi) => {
    const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - (7 - wi) * 7);
    return {
      week: `W${wi + 1}`,
      habits: Math.round(50 + Math.random() * 40),
      focus: Math.round(10 + Math.random() * 30),
      mood: Number((3 + Math.random() * 1.5).toFixed(1)),
    };
  });

  // Focus by category
  const focusByCategory = ['coding', 'reading', 'writing', 'learning', 'planning'].map((cat) => ({
    name: cat,
    value: focusSessions.filter((s) => s.category === cat).reduce((a, s) => a + s.duration, 0),
  })).filter((d) => d.value > 0);

  // Life score radar
  const radarData = Object.entries(lifeScore).map(([key, value]) => ({
    subject: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
    current: value,
    target: Math.min(value + 15, 100),
  }));

  // Monthly mood trend
  const moodTrend = moodEntries.slice(-14).map((m) => ({
    date: new Date(m.date).toLocaleDateString('en', { day: 'numeric', month: 'short' }),
    mood: m.mood,
    energy: m.energy,
    stress: m.stress,
  }));

  return (
    <div className="flex flex-col gap-6 animate-fade-in w-full">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Analytics</h1>
        <p className={`text-sm mt-1 ${isDark ? 'text-charcoal-400' : 'text-charcoal-500'}`}>Your progress at a glance</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Flame, label: 'Habits Done', value: userStats.habitsCompleted, color: 'text-orange-400', bg: 'bg-orange-500/10' },
          { icon: Timer, label: 'Focus Hours', value: `${Math.round(userStats.totalFocusHours)}h`, color: 'text-ocean-300', bg: 'bg-ocean-300/10' },
          { icon: Trophy, label: 'XP Earned', value: userStats.xp.toLocaleString(), color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { icon: TrendingUp, label: 'Discipline', value: `${userStats.disciplineScore}%`, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        ].map((s, i) => (
          <motion.div key={s.label} className={cardClass} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className={`text-xs ${isDark ? 'text-charcoal-400' : 'text-charcoal-500'}`}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Life Score Radar */}
        <motion.div className={cardClass} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <h3 className="text-lg font-semibold mb-4">Life Score Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'} />
              <PolarAngleAxis dataKey="subject" tick={{ fill: isDark ? '#8891a5' : '#5a6480', fontSize: 10 }} />
              <Radar dataKey="target" stroke="#53a8d4" fill="#53a8d4" fillOpacity={0.05} strokeWidth={1} strokeDasharray="4 4" />
              <Radar dataKey="current" stroke="#0cce6b" fill="#0cce6b" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Weekly Productivity */}
        <motion.div className={cardClass} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h3 className="text-lg font-semibold mb-4">Weekly Productivity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <XAxis dataKey="week" tick={{ fill: isDark ? '#8891a5' : '#5a6480', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: isDark ? '#8891a5' : '#5a6480', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: isDark ? '#1e2a4a' : '#fff', border: 'none', borderRadius: 12 }} />
              <Bar dataKey="habits" fill="#0cce6b" radius={[6, 6, 0, 0]} name="Habit %" />
              <Bar dataKey="focus" fill="#53a8d4" radius={[6, 6, 0, 0]} name="Focus hrs" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Mood Trend */}
        <motion.div className={cardClass} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <h3 className="text-lg font-semibold mb-4">Mood Improvement</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={moodTrend}>
              <XAxis dataKey="date" tick={{ fill: isDark ? '#8891a5' : '#5a6480', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={[1, 5]} tick={{ fill: isDark ? '#8891a5' : '#5a6480', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: isDark ? '#1e2a4a' : '#fff', border: 'none', borderRadius: 12 }} />
              <Line type="monotone" dataKey="mood" stroke="#0cce6b" strokeWidth={2} dot={{ fill: '#0cce6b', r: 3 }} />
              <Line type="monotone" dataKey="energy" stroke="#53a8d4" strokeWidth={2} dot={{ fill: '#53a8d4', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Focus Distribution */}
        <motion.div className={cardClass} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h3 className="text-lg font-semibold mb-4">Focus Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={focusByCategory} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" stroke="none" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {focusByCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: isDark ? '#1e2a4a' : '#fff', border: 'none', borderRadius: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Habit Consistency */}
      <motion.div className={cardClass} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <h3 className="text-lg font-semibold mb-4">Habit Consistency (30 days)</h3>
        <div className="space-y-3">
          {habitConsistency.map((h) => (
            <div key={h.name} className="flex items-center gap-3">
              <span className="text-xl w-8">{h.icon}</span>
              <span className="text-sm font-medium w-32 truncate">{h.name}</span>
              <div className={`flex-1 h-2.5 rounded-full ${isDark ? 'bg-white/5' : 'bg-charcoal-100'}`}>
                <div className="h-2.5 rounded-full bg-gradient-emerald transition-all" style={{ width: `${h.consistency}%` }} />
              </div>
              <span className="text-sm font-medium text-emerald-400 w-12 text-right">{h.consistency}%</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* AI Weekly Review */}
      <motion.div className={`${cardClass} bg-gradient-to-br from-ocean-500/10 to-lavender-500/5`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-5 h-5 text-ocean-300" />
          <h3 className="text-lg font-semibold">AI Weekly Review</h3>
        </div>
        <div className="space-y-3 text-sm">
          <p className={isDark ? 'text-charcoal-200' : 'text-charcoal-700'}>
            📈 <strong>Great progress this week!</strong> Your habit consistency improved by 12% compared to last week. You completed 85% of your daily habits.
          </p>
          <p className={isDark ? 'text-charcoal-200' : 'text-charcoal-700'}>
            ⚡ <strong>Focus improvement:</strong> You logged 15% more focus hours this week. Your most productive time is between 9 AM and 12 PM.
          </p>
          <p className={isDark ? 'text-charcoal-200' : 'text-charcoal-700'}>
            💡 <strong>Suggestion:</strong> Your mood dips on Wednesdays. Consider adding a midweek reflection or a short walk to break the pattern.
          </p>
          <p className={isDark ? 'text-charcoal-200' : 'text-charcoal-700'}>
            🎯 <strong>Next week focus:</strong> Try increasing your sleep consistency. Your performance is 23% better on days with 7+ hours of sleep.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
