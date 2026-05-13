import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ArrowLeft, Check, Zap } from 'lucide-react';
import { useThemeStore, type AppMode } from '../stores/themeStore';
import CharacterCard from '../components/CharacterCard';

const struggles = [
  'Overthinking', 'Procrastination', 'Financial stress', 'Career confusion',
  'Bad sleep', 'Anxiety', 'No discipline', 'Social media addiction',
  'Lack of confidence', 'Loneliness', 'Health issues', 'Burnout',
];
const habitOptions = [
  'Exercise', 'Reading', 'Meditation', 'Journaling', 'Healthy eating',
  'Early wake-up', 'Coding', 'No junk food', 'Water intake', 'Stretching',
];
const outOfControlOptions = [
  'Time management', 'Spending', 'Diet', 'Sleep schedule', 'Screen time',
  'Emotions', 'Career direction', 'Relationships', 'Health', 'Focus',
];

const steps = [
  { title: 'Choose Your Path', subtitle: 'Pick a mode and your personal AI coach' },
  { title: 'About You', subtitle: 'Let us know who you are' },
  { title: 'Your Struggles', subtitle: "What's been holding you back?" },
  { title: 'Your Goals', subtitle: 'Where do you want to be?' },
  { title: 'Your Habits', subtitle: 'What do you want to build?' },
  { title: 'Out of Control', subtitle: 'What feels unmanageable?' },
  { title: 'Ready!', subtitle: 'Your personalized plan awaits' },
];

const agentsByMode: Record<AppMode, string[]> = {
  default: ['Standard Coach'],
  anime: ['Naruto', 'Levi', 'Gojo', 'Goku', 'Zoro'],
  f1: ['Lewis Hamilton', 'Max Verstappen', 'Charles Leclerc', 'Lando Norris'],
};

const modeConfig: Record<AppMode, { label: string; emoji: string; tagline: string; activeClass: string }> = {
  default: {
    label: 'Default',
    emoji: '✨',
    tagline: 'Clean, focused, evidence-based coaching',
    activeClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-[0_0_16px_rgba(12,206,107,0.25)]',
  },
  anime: {
    label: 'Anime',
    emoji: '⚡',
    tagline: 'Unleash your inner protagonist energy',
    activeClass: 'bg-orange-500/20 text-orange-400 border-orange-500/50 shadow-[0_0_16px_rgba(249,115,22,0.3)]',
  },
  f1: {
    label: 'F1',
    emoji: '🏎️',
    tagline: 'Race through life like a World Champion',
    activeClass: 'bg-red-500/20 text-red-400 border-red-500/50 shadow-[0_0_16px_rgba(220,38,38,0.3)]',
  },
};

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { setMode, appMode, agent: storedAgent } = useThemeStore();

  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    appMode: appMode as AppMode,
    agent: storedAgent,
    name: '',
    age: '',
    stressLevel: 5,
    sleepSchedule: '11pm-7am',
    selectedStruggles: [] as string[],
    careerGoals: '',
    financialGoals: '',
    healthGoals: '',
    selectedHabits: [] as string[],
    selectedOutOfControl: [] as string[],
  });

  const toggleItem = (key: 'selectedStruggles' | 'selectedHabits' | 'selectedOutOfControl', item: string) => {
    setData((d) => ({
      ...d,
      [key]: d[key].includes(item) ? d[key].filter((i) => i !== item) : [...d[key], item],
    }));
  };

  const handleModeSelect = (mode: AppMode) => {
    const firstAgent = agentsByMode[mode][0];
    setMode(mode, firstAgent); // Instant theme change!
    setData((d) => ({ ...d, appMode: mode, agent: firstAgent }));
  };

  const handleAgentSelect = (agent: string) => {
    setMode(data.appMode, agent);
    setData((d) => ({ ...d, agent }));
  };

  const canProceed = () => {
    if (step === 0) return data.appMode && data.agent;
    if (step === 1) return data.name && data.age;
    if (step === 2) return data.selectedStruggles.length > 0;
    if (step === 3) return true;
    if (step === 4) return data.selectedHabits.length > 0;
    if (step === 5) return data.selectedOutOfControl.length > 0;
    return true;
  };

  const finish = async () => {
    try {
      await fetch('/api/auth/onboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });
    } catch (_) { /* ignore */ }
    navigate('/app/dashboard');
  };

  const progressPct = (step / (steps.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-main flex items-center justify-center p-4 transition-all duration-700">
      {/* Animated background orbs — color follows theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ background: 'var(--theme-primary-dim)' }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl"
          style={{ background: 'rgba(var(--theme-secondary), 0.08)' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.div
          className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full blur-3xl opacity-20"
          style={{ background: 'var(--theme-glow)' }}
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <motion.div
        className="relative w-full max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-charcoal-400">Step {step + 1} of {steps.length}</span>
            <span className="text-xs font-medium" style={{ color: 'var(--theme-primary)' }}>
              {Math.round(progressPct)}% complete
            </span>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'var(--theme-gradient)' }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <motion.div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'var(--theme-gradient)' }}
            animate={{ boxShadow: ['0 0 20px var(--theme-glow)', '0 0 40px var(--theme-glow)', '0 0 20px var(--theme-glow)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-7 h-7 text-white" />
          </motion.div>
          <motion.h2
            key={step}
            className="text-2xl font-bold text-white"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {steps[step].title}
          </motion.h2>
          <p className="text-charcoal-400 text-sm mt-1">{steps[step].subtitle}</p>
        </div>

        {/* Card */}
        <div className="glass-card p-8 min-h-[320px] racing-stripe">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* ===== STEP 0: Mode + Agent selection ===== */}
              {step === 0 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-charcoal-300 mb-3">
                      Select Your Mode
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(Object.keys(modeConfig) as AppMode[]).map((mode) => {
                        const cfg = modeConfig[mode];
                        const isActive = data.appMode === mode;
                        return (
                          <motion.button
                            key={mode}
                            onClick={() => handleModeSelect(mode)}
                            whileTap={{ scale: 0.95 }}
                            className={`relative px-3 py-4 rounded-xl text-sm font-semibold transition-all border flex flex-col items-center gap-2
                              ${isActive ? cfg.activeClass : 'bg-white/5 text-charcoal-300 border-white/10 hover:border-white/20'}`}
                          >
                            <span className="text-2xl">{cfg.emoji}</span>
                            <span>{cfg.label}</span>
                            {isActive && (
                              <motion.div
                                className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
                                style={{ background: 'var(--theme-primary)' }}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                              >
                                <Check className="w-2.5 h-2.5 text-white" />
                              </motion.div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                    {/* Mode tagline */}
                    <motion.p
                      key={data.appMode}
                      className="text-xs text-charcoal-400 mt-2 text-center italic"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {modeConfig[data.appMode].tagline}
                    </motion.p>
                  </div>

                  {/* Agent selection */}
                  <AnimatePresence mode="popLayout">
                    {data.appMode !== 'default' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <label className="block text-sm font-medium text-charcoal-300 mb-3">
                          Choose Your AI Coach
                        </label>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {agentsByMode[data.appMode].map((agentName) => (
                            <motion.button
                              key={agentName}
                              onClick={() => handleAgentSelect(agentName)}
                              whileTap={{ scale: 0.97 }}
                              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all border text-left relative
                                ${data.agent === agentName
                                  ? 'mode-btn-active'
                                  : 'bg-white/5 text-charcoal-300 border-white/10 hover:border-white/20'
                                }`}
                            >
                              {agentName}
                              {data.agent === agentName && (
                                <motion.span
                                  className="absolute right-2 top-1/2 -translate-y-1/2"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                >
                                  <Zap className="w-3.5 h-3.5" style={{ color: 'var(--theme-primary)' }} />
                                </motion.span>
                              )}
                            </motion.button>
                          ))}
                        </div>

                        {/* Live character card preview */}
                        <AnimatePresence mode="wait">
                          <CharacterCard
                            key={data.agent}
                            agent={data.agent}
                            mode={data.appMode}
                            showQuote={true}
                          />
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* ===== STEP 1: About You ===== */}
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-charcoal-300 mb-2">Your Name</label>
                    <input
                      value={data.name}
                      onChange={(e) => setData({ ...data, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-charcoal-500 outline-none transition-all"
                      style={{ '--tw-ring-color': 'var(--theme-primary)' } as React.CSSProperties}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--theme-primary)')}
                      onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                      placeholder="What should we call you?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal-300 mb-2">Your Age</label>
                    <input
                      type="number"
                      value={data.age}
                      onChange={(e) => setData({ ...data, age: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-charcoal-500 outline-none transition-all"
                      onFocus={(e) => (e.target.style.borderColor = 'var(--theme-primary)')}
                      onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                      placeholder="25"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal-300 mb-2">
                      Daily Stress Level: <span style={{ color: 'var(--theme-primary)' }}>{data.stressLevel}/10</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={data.stressLevel}
                      onChange={(e) => setData({ ...data, stressLevel: Number(e.target.value) })}
                      className="w-full"
                      style={{ accentColor: 'var(--theme-primary)' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal-300 mb-2">Sleep Schedule</label>
                    <select
                      value={data.sleepSchedule}
                      onChange={(e) => setData({ ...data, sleepSchedule: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none transition-all"
                      onFocus={(e) => (e.target.style.borderColor = 'var(--theme-primary)')}
                      onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                    >
                      <option value="9pm-5am">9 PM – 5 AM (Early Bird)</option>
                      <option value="10pm-6am">10 PM – 6 AM (Standard)</option>
                      <option value="11pm-7am">11 PM – 7 AM (Normal)</option>
                      <option value="12am-8am">12 AM – 8 AM (Late)</option>
                      <option value="irregular">Irregular / No routine</option>
                    </select>
                  </div>
                </div>
              )}

              {/* ===== STEP 2: Struggles ===== */}
              {step === 2 && (
                <div className="flex flex-wrap gap-3">
                  {struggles.map((s) => (
                    <motion.button
                      key={s}
                      onClick={() => toggleItem('selectedStruggles', s)}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border
                        ${data.selectedStruggles.includes(s)
                          ? 'mode-btn-active'
                          : 'bg-white/5 text-charcoal-300 border-white/10 hover:border-white/20'}`}
                    >
                      {s}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* ===== STEP 3: Goals ===== */}
              {step === 3 && (
                <div className="space-y-5">
                  {[
                    { key: 'careerGoals', label: 'Career Goals', placeholder: 'e.g., Get a remote developer job' },
                    { key: 'financialGoals', label: 'Financial Goals', placeholder: 'e.g., Save $10K emergency fund' },
                    { key: 'healthGoals', label: 'Health Goals', placeholder: 'e.g., Exercise 4x/week, sleep by 11 PM' },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-charcoal-300 mb-2">{label}</label>
                      <textarea
                        value={data[key as keyof typeof data] as string}
                        onChange={(e) => setData({ ...data, [key]: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-charcoal-500 outline-none transition-all resize-none h-20"
                        onFocus={(e) => (e.target.style.borderColor = 'var(--theme-primary)')}
                        onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                        placeholder={placeholder}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* ===== STEP 4: Habits ===== */}
              {step === 4 && (
                <div className="flex flex-wrap gap-3">
                  {habitOptions.map((h) => (
                    <motion.button
                      key={h}
                      onClick={() => toggleItem('selectedHabits', h)}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border
                        ${data.selectedHabits.includes(h)
                          ? 'mode-btn-active'
                          : 'bg-white/5 text-charcoal-300 border-white/10 hover:border-white/20'}`}
                    >
                      {h}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* ===== STEP 5: Out of Control ===== */}
              {step === 5 && (
                <div className="flex flex-wrap gap-3">
                  {outOfControlOptions.map((o) => (
                    <motion.button
                      key={o}
                      onClick={() => toggleItem('selectedOutOfControl', o)}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border
                        ${data.selectedOutOfControl.includes(o)
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                          : 'bg-white/5 text-charcoal-300 border-white/10 hover:border-white/20'}`}
                    >
                      {o}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* ===== STEP 6: Done ===== */}
              {step === 6 && (
                <div className="text-center py-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 10 }}
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{
                      background: 'var(--theme-gradient)',
                      boxShadow: '0 0 40px var(--theme-glow)',
                    }}
                  >
                    <Check className="w-10 h-10 text-white" />
                  </motion.div>

                  <h3 className="text-xl font-bold text-white mb-1">
                    You're all set, {data.name || 'friend'}!
                  </h3>
                  <p className="text-charcoal-400 text-sm mb-5">
                    Your coach <span className="font-semibold" style={{ color: 'var(--theme-primary)' }}>{data.agent}</span> is ready to guide you.
                  </p>

                  {/* Character card summary */}
                  {data.appMode !== 'default' && (
                    <div className="mb-5">
                      <CharacterCard agent={data.agent} mode={data.appMode} compact />
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 justify-center">
                    {data.selectedStruggles.slice(0, 4).map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1 rounded-lg text-xs"
                        style={{ background: 'var(--theme-primary-dim)', color: 'var(--theme-primary)' }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          {step > 0 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-charcoal-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 6 ? (
            <motion.button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-medium hover:opacity-90 transition-all disabled:opacity-30"
              style={{ background: 'var(--theme-gradient)' }}
            >
              Next <ArrowRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <motion.button
              onClick={finish}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold hover:opacity-90 transition-all"
              style={{
                background: 'var(--theme-gradient)',
                boxShadow: '0 4px 20px var(--theme-glow)',
              }}
            >
              Go to Dashboard <ArrowRight className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
