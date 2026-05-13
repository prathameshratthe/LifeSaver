import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Droplets, Moon, Activity, Scale, Zap } from 'lucide-react';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useAppStore } from '../stores/appStore';
import { useThemeStore } from '../stores/themeStore';

export default function WellnessPage() {
  const isDark = useThemeStore((s) => s.isDark);
  const { healthLogs, addHealthLog } = useAppStore();
  const [todayLog, setTodayLog] = useState({ date: new Date().toISOString().split('T')[0], sleepHours: 7, waterIntake: 2, exercise: 30, steps: 5000, weight: 75, energyLevel: 3 });
  const [todayMood, setTodayMood] = useState({ mood: 3, energy: 3, stress: 3, motivation: 3 });

  const cardClass = `${isDark ? 'glass-card' : 'glass-card-light'} p-5`;
  const moods = ['😢', '😕', '😐', '🙂', '😄'];

  const sleepData = healthLogs.slice(-7).map((l) => ({
    day: new Date(l.date).toLocaleDateString('en', { weekday: 'short' }),
    hours: Number(l.sleepHours.toFixed(1)),
  }));

  const waterData = healthLogs.slice(-7).map((l) => ({
    day: new Date(l.date).toLocaleDateString('en', { weekday: 'short' }),
    liters: Number(l.waterIntake.toFixed(1)),
  }));

  const saveTodayLog = () => {
    addHealthLog(todayLog);

  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in w-full">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Wellness</h1>
        <p className={`text-sm mt-1 ${isDark ? 'text-charcoal-400' : 'text-charcoal-500'}`}>Track health, mood & energy</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { icon: Moon, label: 'Sleep', value: `${todayLog.sleepHours}h`, color: 'text-lavender-400', bg: 'bg-lavender-500/10' },
          { icon: Droplets, label: 'Water', value: `${todayLog.waterIntake}L`, color: 'text-ocean-300', bg: 'bg-ocean-300/10' },
          { icon: Activity, label: 'Exercise', value: `${todayLog.exercise}m`, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { icon: Zap, label: 'Energy', value: `${todayLog.energyLevel}/5`, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { icon: Scale, label: 'Weight', value: `${todayLog.weight}kg`, color: 'text-rose-400', bg: 'bg-rose-500/10' },
          { icon: Heart, label: 'Steps', value: todayLog.steps.toLocaleString(), color: 'text-pink-400', bg: 'bg-pink-500/10' },
        ].map((s, i) => (
          <motion.div key={s.label} className={cardClass} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center mb-2`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <div className="text-lg font-bold">{s.value}</div>
            <div className={`text-xs ${isDark ? 'text-charcoal-400' : 'text-charcoal-500'}`}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Log Today */}
      <motion.div className={cardClass} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h3 className="text-lg font-semibold mb-4">Log Today</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: 'Sleep (hours)', key: 'sleepHours', min: 0, max: 12, step: 0.5 },
            { label: 'Water (liters)', key: 'waterIntake', min: 0, max: 5, step: 0.5 },
            { label: 'Exercise (min)', key: 'exercise', min: 0, max: 180, step: 5 },
            { label: 'Steps', key: 'steps', min: 0, max: 20000, step: 500 },
            { label: 'Weight (kg)', key: 'weight', min: 30, max: 200, step: 0.5 },
            { label: 'Energy (1-5)', key: 'energyLevel', min: 1, max: 5, step: 1 },
          ].map((field) => (
            <div key={field.key}>
              <label className={`text-xs font-medium mb-1 block ${isDark ? 'text-charcoal-300' : 'text-charcoal-600'}`}>
                {field.label}: <span className="text-emerald-400">{(todayLog as any)[field.key]}</span>
              </label>
              <input type="range" min={field.min} max={field.max} step={field.step}
                value={(todayLog as any)[field.key]}
                onChange={(e) => setTodayLog({ ...todayLog, [field.key]: Number(e.target.value) })}
                className="w-full accent-emerald-500" />
            </div>
          ))}
        </div>

        {/* Mood */}
        <div className="mt-6">
          <h4 className={`text-sm font-medium mb-3 ${isDark ? 'text-charcoal-300' : 'text-charcoal-600'}`}>How do you feel?</h4>
          <div className="flex gap-3 justify-center">
            {moods.map((emoji, i) => (
              <button key={i} onClick={() => setTodayMood({ ...todayMood, mood: i + 1 })}
                className={`text-3xl p-2 rounded-xl transition-all ${todayMood.mood === i + 1 ? 'bg-emerald-500/15 scale-110 ring-1 ring-emerald-500/30' : isDark ? 'hover:bg-white/5' : 'hover:bg-charcoal-50'}`}>
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <button onClick={saveTodayLog} className="mt-6 w-full py-3 rounded-xl bg-gradient-emerald text-white font-semibold hover:opacity-90 transition-all">
          Save Today's Log
        </button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sleep Chart */}
        <motion.div className={cardClass} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <h3 className="text-lg font-semibold mb-4">Sleep Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={sleepData}>
              <defs>
                <linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: isDark ? '#8891a5' : '#5a6480', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[4, 10]} tick={{ fill: isDark ? '#8891a5' : '#5a6480', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: isDark ? '#1e2a4a' : '#fff', border: 'none', borderRadius: 12 }} />
              <Area type="monotone" dataKey="hours" stroke="#8b5cf6" fill="url(#sleepGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Water Chart */}
        <motion.div className={cardClass} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h3 className="text-lg font-semibold mb-4">Water Intake</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={waterData}>
              <defs>
                <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#53a8d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#53a8d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: isDark ? '#8891a5' : '#5a6480', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 5]} tick={{ fill: isDark ? '#8891a5' : '#5a6480', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: isDark ? '#1e2a4a' : '#fff', border: 'none', borderRadius: 12 }} />
              <Area type="monotone" dataKey="liters" stroke="#53a8d4" fill="url(#waterGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Affirmations */}
      <motion.div className={`${cardClass} bg-gradient-to-br from-lavender-500/10 to-emerald-500/5`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <h3 className="text-lg font-semibold mb-3">✨ Daily Affirmation</h3>
        <p className="text-lg italic text-charcoal-200">
          "You are not behind. You are exactly where you need to be. Every small step forward counts."
        </p>
      </motion.div>
    </div>
  );
}
