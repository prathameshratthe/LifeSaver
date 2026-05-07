import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Flame, Trash2, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { useThemeStore } from '../stores/themeStore';
import type { HabitCategory } from '../types';

const categories: { value: HabitCategory; label: string; color: string }[] = [
  { value: 'health', label: '🏥 Health', color: '#0cce6b' },
  { value: 'fitness', label: '💪 Fitness', color: '#f59e0b' },
  { value: 'career', label: '💼 Career', color: '#53a8d4' },
  { value: 'learning', label: '📚 Learning', color: '#8b5cf6' },
  { value: 'finance', label: '💰 Finance', color: '#f59e0b' },
  { value: 'spiritual', label: '🧘 Spiritual', color: '#a78bfa' },
  { value: 'relationships', label: '❤️ Relationships', color: '#f43f5e' },
];

const icons = ['🧘', '💪', '📚', '💧', '📵', '💰', '🏃', '🎯', '🧠', '🌅', '🥗', '😴', '✍️', '🎨'];

export default function HabitsPage() {
  const isDark = useThemeStore((s) => s.isDark);
  const { habits, addHabit, toggleHabitDate, deleteHabit } = useAppStore();
  const [showAdd, setShowAdd] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const [newHabit, setNewHabit] = useState({ name: '', category: 'health' as HabitCategory, difficulty: 'medium' as const, frequency: 'daily' as const, color: '#0cce6b', icon: '🎯' });

  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  const todayStr = today.toISOString().split('T')[0];
  const todayCompleted = habits.filter((h) => h.completedDates.includes(todayStr)).length;
  const totalCompletionPct = habits.length > 0 ? Math.round((todayCompleted / habits.length) * 100) : 0;

  // Heatmap: last 12 weeks
  const heatmapWeeks = Array.from({ length: 12 }, (_, wi) => {
    return Array.from({ length: 7 }, (_, di) => {
      const d = new Date();
      d.setDate(d.getDate() - ((11 - wi) * 7 + (6 - di)));
      const ds = d.toISOString().split('T')[0];
      const completed = habits.filter((h) => h.completedDates.includes(ds)).length;
      const ratio = habits.length > 0 ? completed / habits.length : 0;
      return { date: ds, level: Math.round(ratio * 5) };
    });
  });

  const handleAdd = () => {
    if (!newHabit.name.trim()) return;
    addHabit(newHabit);
    setNewHabit({ name: '', category: 'health', difficulty: 'medium', frequency: 'daily', color: '#0cce6b', icon: '🎯' });
    setShowAdd(false);
  };

  const cardClass = `${isDark ? 'glass-card' : 'glass-card-light'} p-5`;

  return (
    <div className="flex flex-col gap-6 animate-fade-in w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Habits</h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-charcoal-400' : 'text-charcoal-500'}`}>{todayCompleted}/{habits.length} completed today · {totalCompletionPct}%</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-emerald text-white font-medium text-sm hover:opacity-90 transition-all">
          <Plus className="w-4 h-4" /> Add Habit
        </button>
      </div>

      {/* Heatmap */}
      <motion.div className={cardClass} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h3 className="text-lg font-semibold mb-4">Activity Heatmap</h3>
        <div className="flex gap-1 overflow-x-auto pb-2">
          {heatmapWeeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((day) => (
                <div
                  key={day.date}
                  className={`w-4 h-4 rounded-sm heatmap-${day.level} cursor-pointer`}
                  title={`${day.date}: ${day.level * 20}%`}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-3 justify-end">
          <span className={`text-xs ${isDark ? 'text-charcoal-500' : 'text-charcoal-400'}`}>Less</span>
          {[0, 1, 2, 3, 4, 5].map((l) => (
            <div key={l} className={`w-3 h-3 rounded-sm heatmap-${l}`} />
          ))}
          <span className={`text-xs ${isDark ? 'text-charcoal-500' : 'text-charcoal-400'}`}>More</span>
        </div>
      </motion.div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={() => setWeekOffset(weekOffset - 1)} className={`p-2 rounded-xl ${isDark ? 'hover:bg-white/5' : 'hover:bg-charcoal-50'}`}>
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-sm font-medium">
          {new Date(weekDays[0]).toLocaleDateString('en', { month: 'short', day: 'numeric' })} — {new Date(weekDays[6]).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
        </span>
        <button onClick={() => setWeekOffset(weekOffset + 1)} className={`p-2 rounded-xl ${isDark ? 'hover:bg-white/5' : 'hover:bg-charcoal-50'}`} disabled={weekOffset >= 0}>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Habits List */}
      <div className="space-y-3">
        {habits.map((habit, i) => (
          <motion.div
            key={habit._id}
            className={cardClass}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{habit.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{habit.name}</div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className={`text-xs px-2 py-0.5 rounded-lg ${isDark ? 'bg-white/5 text-charcoal-400' : 'bg-charcoal-100 text-charcoal-500'}`}>{habit.category}</span>
                  <span className="flex items-center gap-1 text-xs text-orange-400"><Flame className="w-3 h-3" />{habit.currentStreak}d</span>
                  <span className={`text-xs ${isDark ? 'text-charcoal-500' : 'text-charcoal-400'}`}>Best: {habit.bestStreak}d</span>
                </div>
              </div>
              <button onClick={() => deleteHabit(habit._id)} className="p-2 rounded-lg text-charcoal-500 hover:text-rose-400 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Week checkboxes */}
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day) => {
                const completed = habit.completedDates.includes(day);
                const isToday = day === todayStr;
                const isFuture = day > todayStr;
                return (
                  <button
                    key={day}
                    onClick={() => !isFuture && toggleHabitDate(habit._id, day)}
                    disabled={isFuture}
                    className={`flex flex-col items-center gap-1 py-2 rounded-xl transition-all
                      ${completed
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : isFuture
                          ? 'opacity-30'
                          : isDark ? 'bg-white/3 hover:bg-white/5 text-charcoal-400' : 'bg-charcoal-50 hover:bg-charcoal-100 text-charcoal-500'
                      }
                      ${isToday ? 'ring-1 ring-emerald-500/30' : ''}`}
                  >
                    <span className="text-[10px] font-medium">{new Date(day).toLocaleDateString('en', { weekday: 'short' })}</span>
                    <span className="text-xs">{new Date(day).getDate()}</span>
                    {completed && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Habit Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAdd(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`w-full max-w-md rounded-2xl p-6 ${isDark ? 'bg-charcoal-900 border border-white/10' : 'bg-white border border-charcoal-100'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold">New Habit</h3>
                <button onClick={() => setShowAdd(false)} className="p-1.5 rounded-lg hover:bg-white/5"><X className="w-5 h-5" /></button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-charcoal-300' : 'text-charcoal-600'}`}>Habit Name</label>
                  <input
                    value={newHabit.name}
                    onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl outline-none transition-all ${isDark ? 'bg-white/5 border border-white/10 text-white focus:border-emerald-500/50' : 'bg-charcoal-50 border border-charcoal-200 focus:border-emerald-500'}`}
                    placeholder="e.g., Morning meditation"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-charcoal-300' : 'text-charcoal-600'}`}>Icon</label>
                  <div className="flex flex-wrap gap-2">
                    {icons.map((ic) => (
                      <button key={ic} onClick={() => setNewHabit({ ...newHabit, icon: ic })}
                        className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${newHabit.icon === ic ? 'bg-emerald-500/20 ring-1 ring-emerald-500/30' : isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-charcoal-50 hover:bg-charcoal-100'}`}>
                        {ic}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-charcoal-300' : 'text-charcoal-600'}`}>Category</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((c) => (
                      <button key={c.value} onClick={() => setNewHabit({ ...newHabit, category: c.value, color: c.color })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${newHabit.category === c.value ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : isDark ? 'bg-white/5 text-charcoal-400 border border-white/10' : 'bg-charcoal-50 text-charcoal-500 border border-charcoal-200'}`}>
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-charcoal-300' : 'text-charcoal-600'}`}>Difficulty</label>
                  <div className="flex gap-2">
                    {(['easy', 'medium', 'hard'] as const).map((d) => (
                      <button key={d} onClick={() => setNewHabit({ ...newHabit, difficulty: d })}
                        className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium capitalize transition-all ${newHabit.difficulty === d ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : isDark ? 'bg-white/5 text-charcoal-400 border border-white/10' : 'bg-charcoal-50 text-charcoal-500 border border-charcoal-200'}`}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={handleAdd}
                  className="w-full py-3 rounded-xl bg-gradient-emerald text-white font-semibold hover:opacity-90 transition-all">
                  Create Habit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
