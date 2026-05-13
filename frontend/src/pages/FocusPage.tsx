import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Timer, Volume2, VolumeX, Coffee, TreePine, CloudRain, Waves, Target } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { useThemeStore } from '../stores/themeStore';

const presets = [
  { label: '25 min', value: 25, type: 'pomodoro' as const },
  { label: '50 min', value: 50, type: 'deep-work' as const },
  { label: '90 min', value: 90, type: 'deep-work' as const },
];

const ambientSounds = [
  { id: 'rain', icon: CloudRain, label: 'Rain' },
  { id: 'forest', icon: TreePine, label: 'Forest' },
  { id: 'cafe', icon: Coffee, label: 'Café' },
  { id: 'waves', icon: Waves, label: 'Waves' },
];

export default function FocusPage() {
  const isDark = useThemeStore((s) => s.isDark);
  const { addFocusSession, focusSessions } = useAppStore();
  const [duration, setDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [customMin, setCustomMin] = useState('');
  const [sessionCategory, setSessionCategory] = useState('coding');
  const startTimeRef = useRef<string>('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSeconds = duration * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const startTimer = useCallback(() => {
    if (!isRunning) {
      startTimeRef.current = new Date().toISOString();
    }
    setIsRunning(true);
  }, [isRunning]);

  const pauseTimer = () => setIsRunning(false);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(duration * 60);
  };

  const setPreset = (min: number) => {
    setDuration(min);
    setTimeLeft(min * 60);
    setIsRunning(false);
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => setTimeLeft((t) => t - 1), 1000);
      return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }
    if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      addFocusSession({
        duration,
        type: duration <= 25 ? 'pomodoro' : 'deep-work',
        startTime: startTimeRef.current,
        endTime: new Date().toISOString(),
        completed: true,
        category: sessionCategory,
      });
    }
  }, [isRunning, timeLeft, duration, addFocusSession, sessionCategory]);

  const completedToday = focusSessions.filter((s) => s.startTime?.startsWith(new Date().toISOString().split('T')[0]) && s.completed).length;
  const totalMinToday = focusSessions.filter((s) => s.startTime?.startsWith(new Date().toISOString().split('T')[0]) && s.completed).reduce((a, s) => a + (s.duration || 0), 0);

  const cardClass = `${isDark ? 'glass-card' : 'glass-card-light'} p-5`;
  const circumference = 2 * Math.PI * 140;

  return (
    <div className="flex flex-col gap-6 animate-fade-in w-full">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Deep Focus</h1>
        <p className={`text-sm mt-1 ${isDark ? 'text-charcoal-400' : 'text-charcoal-500'}`}>Distraction-free productivity</p>
      </div>

      {/* Timer */}
      <motion.div className={`${cardClass} flex flex-col items-center py-10`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Progress Ring */}
        <div className="relative w-72 h-72 mb-8">
          <svg className="w-72 h-72 transform -rotate-90" viewBox="0 0 300 300">
            <circle cx="150" cy="150" r="140" fill="none" stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} strokeWidth="8" />
            <circle cx="150" cy="150" r="140" fill="none" stroke="url(#timerGrad)" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={circumference * (1 - progress / 100)}
              className="transition-all duration-1000" />
            <defs><linearGradient id="timerGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#0cce6b" /><stop offset="100%" stopColor="#53a8d4" /></linearGradient></defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-5xl font-bold tracking-wider font-mono">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <div className={`text-sm mt-2 ${isDark ? 'text-charcoal-400' : 'text-charcoal-500'}`}>
              {isRunning ? 'Stay focused...' : timeLeft === 0 ? 'Session complete!' : 'Ready to focus'}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={resetTimer} className={`p-3 rounded-xl ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-charcoal-50 hover:bg-charcoal-100'} transition-all`}>
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={isRunning ? pauseTimer : startTimer}
            className="p-5 rounded-2xl bg-gradient-emerald text-white hover:opacity-90 transition-all shadow-lg shadow-emerald-500/25"
          >
            {isRunning ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-0.5" />}
          </button>
          <button onClick={() => setActiveSound(activeSound ? null : 'rain')}
            className={`p-3 rounded-xl ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-charcoal-50 hover:bg-charcoal-100'} transition-all`}>
            {activeSound ? <Volume2 className="w-5 h-5 text-emerald-400" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>

        {/* Presets */}
        <div className="flex items-center gap-3">
          {presets.map((p) => (
            <button key={p.value} onClick={() => setPreset(p.value)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${duration === p.value && !isRunning ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : isDark ? 'bg-white/5 text-charcoal-400 border border-white/10' : 'bg-charcoal-50 text-charcoal-500 border border-charcoal-200'}`}>
              {p.label}
            </button>
          ))}
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={customMin}
              onChange={(e) => setCustomMin(e.target.value)}
              placeholder="Custom"
              className={`w-20 px-3 py-2.5 rounded-xl text-sm text-center outline-none ${isDark ? 'bg-white/5 border border-white/10 text-white' : 'bg-charcoal-50 border border-charcoal-200'}`}
            />
            {customMin && (
              <button onClick={() => { setPreset(Number(customMin)); setCustomMin(''); }}
                className="text-xs text-emerald-400 hover:text-emerald-300">Set</button>
            )}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ambient Sounds */}
        <motion.div className={cardClass} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h3 className="text-lg font-semibold mb-4">Ambient Sounds</h3>
          <div className="grid grid-cols-2 gap-3">
            {ambientSounds.map((s) => (
              <button key={s.id} onClick={() => setActiveSound(activeSound === s.id ? null : s.id)}
                className={`flex items-center gap-3 p-4 rounded-xl transition-all ${activeSound === s.id ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : isDark ? 'bg-white/3 hover:bg-white/5 text-charcoal-300 border border-transparent' : 'bg-charcoal-50 hover:bg-charcoal-100 border border-transparent'}`}>
                <s.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{s.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Today's Stats */}
        <motion.div className={cardClass} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <h3 className="text-lg font-semibold mb-4">Today's Focus</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl ${isDark ? 'bg-white/3' : 'bg-charcoal-50'}`}>
              <Timer className="w-5 h-5 text-ocean-300 mb-2" />
              <div className="text-2xl font-bold">{totalMinToday}</div>
              <div className={`text-xs ${isDark ? 'text-charcoal-400' : 'text-charcoal-500'}`}>Minutes focused</div>
            </div>
            <div className={`p-4 rounded-xl ${isDark ? 'bg-white/3' : 'bg-charcoal-50'}`}>
              <Target className="w-5 h-5 text-emerald-400 mb-2" />
              <div className="text-2xl font-bold">{completedToday}</div>
              <div className={`text-xs ${isDark ? 'text-charcoal-400' : 'text-charcoal-500'}`}>Sessions done</div>
            </div>
          </div>

          <div className="mt-4">
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-charcoal-300' : 'text-charcoal-600'}`}>Session Category</label>
            <div className="flex flex-wrap gap-2">
              {['coding', 'reading', 'writing', 'learning', 'planning'].map((c) => (
                <button key={c} onClick={() => setSessionCategory(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${sessionCategory === c ? 'bg-emerald-500/20 text-emerald-400' : isDark ? 'bg-white/5 text-charcoal-400' : 'bg-charcoal-100 text-charcoal-500'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Sessions */}
      <motion.div className={cardClass} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h3 className="text-lg font-semibold mb-4">Recent Sessions</h3>
        <div className="space-y-2">
          {focusSessions.slice(-5).reverse().map((s) => (
            <div key={s._id} className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? 'bg-white/3' : 'bg-charcoal-50'}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.completed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                <Timer className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium capitalize">{s.category}</div>
                <div className={`text-xs ${isDark ? 'text-charcoal-500' : 'text-charcoal-400'}`}>
                  {s.startTime ? new Date(s.startTime).toLocaleDateString('en', { month: 'short', day: 'numeric' }) : 'Unknown'} · {s.duration || 0}min
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-lg ${s.completed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                {s.completed ? 'Completed' : 'Incomplete'}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
