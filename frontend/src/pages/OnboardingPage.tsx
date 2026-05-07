import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ArrowLeft, Check } from 'lucide-react';

const struggles = ['Overthinking', 'Procrastination', 'Financial stress', 'Career confusion', 'Bad sleep', 'Anxiety', 'No discipline', 'Social media addiction', 'Lack of confidence', 'Loneliness', 'Health issues', 'Burnout'];
const habitOptions = ['Exercise', 'Reading', 'Meditation', 'Journaling', 'Healthy eating', 'Early wake-up', 'Coding', 'No junk food', 'Water intake', 'Stretching'];
const outOfControlOptions = ['Time management', 'Spending', 'Diet', 'Sleep schedule', 'Screen time', 'Emotions', 'Career direction', 'Relationships', 'Health', 'Focus'];

const steps = [
  { title: 'Choose Your Path', subtitle: 'Select a theme and your personal AI coach' },
  { title: 'About You', subtitle: 'Let us know who you are' },
  { title: 'Your Struggles', subtitle: "What's been holding you back?" },
  { title: 'Your Goals', subtitle: 'Where do you want to be?' },
  { title: 'Your Habits', subtitle: 'What do you want to build?' },
  { title: 'Out of Control', subtitle: 'What feels unmanageable?' },
  { title: 'Ready!', subtitle: "Your personalized plan awaits" },
];

const agentsByMode = {
  default: ['Standard Coach'],
  anime: ['Naruto', 'Levi', 'Gojo', 'Goku', 'Zoro'],
  f1: ['Lewis Hamilton', 'Max Verstappen', 'Charles Leclerc', 'Lando Norris']
};

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    appMode: 'default' as 'default' | 'anime' | 'f1', agent: 'Standard Coach',
    name: '', age: '', stressLevel: 5, sleepSchedule: '11pm-7am',
    selectedStruggles: [] as string[], careerGoals: '', financialGoals: '', healthGoals: '',
    selectedHabits: [] as string[], selectedOutOfControl: [] as string[],
  });

  const toggleItem = (key: 'selectedStruggles' | 'selectedHabits' | 'selectedOutOfControl', item: string) => {
    setData((d) => ({
      ...d,
      [key]: d[key].includes(item) ? d[key].filter((i) => i !== item) : [...d[key], item],
    }));
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
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });
      navigate('/app/dashboard');
    } catch (e) {
      navigate('/app/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-main flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-ocean-300/8 rounded-full blur-3xl" />
      </div>

      <motion.div className="relative w-full max-w-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((_, i) => (
            <div key={i} className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${i <= step ? 'bg-gradient-emerald' : 'bg-white/10'}`} />
          ))}
        </div>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-emerald flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">{steps[step].title}</h2>
          <p className="text-charcoal-400 text-sm mt-1">{steps[step].subtitle}</p>
        </div>

        <div className="glass-card p-8 min-h-[320px]">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              {step === 0 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-charcoal-300 mb-3">Select Mode</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['default', 'anime', 'f1'] as const).map(mode => (
                        <button key={mode} onClick={() => setData({ ...data, appMode: mode, agent: agentsByMode[mode][0] })}
                          className={`px-4 py-3 rounded-xl text-sm font-medium transition-all capitalize border
                            ${data.appMode === mode ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : 'bg-white/5 text-charcoal-300 border-white/10 hover:border-white/20'}`}>
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>
                  <AnimatePresence mode="popLayout">
                    {data.appMode !== 'default' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                        <label className="block text-sm font-medium text-charcoal-300 mb-3 mt-2">Select Your AI Coach</label>
                        <div className="grid grid-cols-2 gap-3">
                          {agentsByMode[data.appMode].map(agent => (
                            <button key={agent} onClick={() => setData({ ...data, agent })}
                              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all border text-left
                                ${data.agent === agent ? 'bg-ocean-500/20 text-ocean-400 border-ocean-500/50' : 'bg-white/5 text-charcoal-300 border-white/10 hover:border-white/20'}`}>
                              {agent}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-charcoal-300 mb-2">Your Name</label>
                    <input value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-charcoal-500 outline-none focus:border-emerald-500/50 transition-all" placeholder="What should we call you?" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal-300 mb-2">Your Age</label>
                    <input type="number" value={data.age} onChange={(e) => setData({ ...data, age: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-charcoal-500 outline-none focus:border-emerald-500/50 transition-all" placeholder="25" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal-300 mb-2">Daily Stress Level: {data.stressLevel}/10</label>
                    <input type="range" min="1" max="10" value={data.stressLevel} onChange={(e) => setData({ ...data, stressLevel: Number(e.target.value) })} className="w-full accent-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal-300 mb-2">Sleep Schedule</label>
                    <select value={data.sleepSchedule} onChange={(e) => setData({ ...data, sleepSchedule: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-emerald-500/50 transition-all">
                      <option value="9pm-5am">9 PM – 5 AM (Early Bird)</option>
                      <option value="10pm-6am">10 PM – 6 AM (Standard)</option>
                      <option value="11pm-7am">11 PM – 7 AM (Normal)</option>
                      <option value="12am-8am">12 AM – 8 AM (Late)</option>
                      <option value="irregular">Irregular / No routine</option>
                    </select>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-wrap gap-3">
                  {struggles.map((s) => (
                    <button key={s} onClick={() => toggleItem('selectedStruggles', s)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${data.selectedStruggles.includes(s) ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-charcoal-300 border border-white/10 hover:border-white/20'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-charcoal-300 mb-2">Career Goals</label>
                    <textarea value={data.careerGoals} onChange={(e) => setData({ ...data, careerGoals: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-charcoal-500 outline-none focus:border-emerald-500/50 transition-all resize-none h-20" placeholder="e.g., Get a remote developer job" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal-300 mb-2">Financial Goals</label>
                    <textarea value={data.financialGoals} onChange={(e) => setData({ ...data, financialGoals: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-charcoal-500 outline-none focus:border-emerald-500/50 transition-all resize-none h-20" placeholder="e.g., Save $10K emergency fund" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal-300 mb-2">Health Goals</label>
                    <textarea value={data.healthGoals} onChange={(e) => setData({ ...data, healthGoals: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-charcoal-500 outline-none focus:border-emerald-500/50 transition-all resize-none h-20" placeholder="e.g., Exercise 4x/week, sleep by 11 PM" />
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="flex flex-wrap gap-3">
                  {habitOptions.map((h) => (
                    <button key={h} onClick={() => toggleItem('selectedHabits', h)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${data.selectedHabits.includes(h) ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-charcoal-300 border border-white/10 hover:border-white/20'}`}>
                      {h}
                    </button>
                  ))}
                </div>
              )}

              {step === 5 && (
                <div className="flex flex-wrap gap-3">
                  {outOfControlOptions.map((o) => (
                    <button key={o} onClick={() => toggleItem('selectedOutOfControl', o)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${data.selectedOutOfControl.includes(o) ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-white/5 text-charcoal-300 border border-white/10 hover:border-white/20'}`}>
                      {o}
                    </button>
                  ))}
                </div>
              )}

              {step === 6 && (
                <div className="text-center py-6">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10 }}
                    className="w-20 h-20 rounded-full bg-gradient-emerald flex items-center justify-center mx-auto mb-6">
                     <Check className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">You're all set, {data.name || 'friend'}!</h3>
                  <p className="text-charcoal-400 text-sm mb-4">We've assigned <span className="font-semibold text-emerald-400">{data.agent}</span> as your AI coach.</p>
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {data.selectedStruggles.slice(0, 4).map((s) => (
                      <span key={s} className="px-3 py-1 rounded-lg bg-rose-500/10 text-rose-400 text-xs">{s}</span>
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
            <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-charcoal-300 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : <div />}

          {step < 6 ? (
            <button onClick={() => setStep(step + 1)} disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-emerald text-white font-medium hover:opacity-90 transition-all disabled:opacity-30">
              Next <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={finish} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-emerald text-white font-medium hover:opacity-90 transition-all">
              Go to Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
