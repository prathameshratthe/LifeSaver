import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Target, Check, X, ChevronRight, Flag } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { useThemeStore } from '../stores/themeStore';

export default function GoalsPage() {
  const isDark = useThemeStore((s) => s.isDark);
  const { goals, addGoal, toggleMilestone } = useAppStore();
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [newGoal, setNewGoal] = useState({ title: '', description: '', category: 'health', targetDate: '', milestones: [{ _id: '1', title: '', completed: false }] });
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);

  const filtered = goals.filter((g) => filter === 'all' || g.status === filter);
  const cardClass = `${isDark ? 'glass-card' : 'glass-card-light'} p-5`;

  const handleAdd = () => {
    if (!newGoal.title.trim()) return;
    addGoal({
      ...newGoal,
      milestones: newGoal.milestones.filter((m) => m.title.trim()).map((m, i) => ({ ...m, _id: String(i + 1) })),
    });
    setNewGoal({ title: '', description: '', category: 'health', targetDate: '', milestones: [{ _id: '1', title: '', completed: false }] });
    setShowAdd(false);
  };

  const categoryColors: Record<string, string> = {
    health: 'bg-emerald-500/10 text-emerald-400', career: 'bg-ocean-300/10 text-ocean-300',
    finance: 'bg-amber-500/10 text-amber-400', learning: 'bg-lavender-500/10 text-lavender-400',
    relationships: 'bg-rose-500/10 text-rose-400', fitness: 'bg-orange-500/10 text-orange-400',
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Goals</h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-charcoal-400' : 'text-charcoal-500'}`}>{goals.filter((g) => g.status === 'active').length} active goals</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-emerald text-white font-medium text-sm">
          <Plus className="w-4 h-4" /> New Goal
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'active', 'completed'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${filter === f ? 'bg-emerald-500/15 text-emerald-400' : isDark ? 'bg-white/5 text-charcoal-400' : 'bg-charcoal-50 text-charcoal-500'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {filtered.map((goal, i) => (
          <motion.div
            key={goal._id}
            className={cardClass}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="flex items-start gap-3 cursor-pointer" onClick={() => setExpandedGoal(expandedGoal === goal._id ? null : goal._id)}>
              <div className={`w-10 h-10 rounded-xl ${categoryColors[goal.category] || 'bg-charcoal-500/10 text-charcoal-400'} flex items-center justify-center flex-shrink-0`}>
                <Target className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold truncate">{goal.title}</h3>
                  {goal.status === 'completed' && <span className="text-xs px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400">Done</span>}
                </div>
                <p className={`text-sm mt-0.5 ${isDark ? 'text-charcoal-400' : 'text-charcoal-500'} truncate`}>{goal.description}</p>
                {/* Progress bar */}
                <div className="mt-3 flex items-center gap-3">
                  <div className={`flex-1 h-2 rounded-full ${isDark ? 'bg-white/5' : 'bg-charcoal-100'}`}>
                    <motion.div
                      className="h-2 rounded-full bg-gradient-emerald"
                      initial={{ width: 0 }}
                      animate={{ width: `${goal.progress}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    />
                  </div>
                  <span className="text-sm font-medium text-emerald-400">{goal.progress}%</span>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 transition-transform ${expandedGoal === goal._id ? 'rotate-90' : ''} ${isDark ? 'text-charcoal-500' : 'text-charcoal-400'}`} />
            </div>

            <AnimatePresence>
              {expandedGoal === goal._id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                    <div className="flex items-center gap-2 mb-3">
                      <Flag className="w-4 h-4 text-charcoal-400" />
                      <span className={`text-sm ${isDark ? 'text-charcoal-400' : 'text-charcoal-500'}`}>
                        Target: {new Date(goal.targetDate).toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    {goal.milestones.map((m) => (
                      <button
                        key={m._id}
                        onClick={(e) => { e.stopPropagation(); toggleMilestone(goal._id, m._id); }}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${isDark ? 'hover:bg-white/5' : 'hover:bg-charcoal-50'}`}
                      >
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all
                          ${m.completed ? 'bg-emerald-500 border-emerald-500' : isDark ? 'border-charcoal-500' : 'border-charcoal-300'}`}>
                          {m.completed && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className={`text-sm ${m.completed ? 'line-through text-charcoal-500' : ''}`}>{m.title}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Add Goal Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-md rounded-2xl p-6 max-h-[85vh] overflow-y-auto ${isDark ? 'bg-charcoal-900 border border-white/10' : 'bg-white border border-charcoal-100'}`}
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold">New Goal</h3>
                <button onClick={() => setShowAdd(false)} className="p-1.5 rounded-lg hover:bg-white/5"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <input value={newGoal.title} onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl outline-none ${isDark ? 'bg-white/5 border border-white/10 text-white focus:border-emerald-500/50' : 'bg-charcoal-50 border border-charcoal-200 focus:border-emerald-500'}`}
                  placeholder="Goal title" />
                <textarea value={newGoal.description} onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl outline-none resize-none h-20 ${isDark ? 'bg-white/5 border border-white/10 text-white focus:border-emerald-500/50' : 'bg-charcoal-50 border border-charcoal-200 focus:border-emerald-500'}`}
                  placeholder="Description" />
                <input type="date" value={newGoal.targetDate} onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl outline-none ${isDark ? 'bg-white/5 border border-white/10 text-white focus:border-emerald-500/50' : 'bg-charcoal-50 border border-charcoal-200 focus:border-emerald-500'}`} />
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-charcoal-300' : 'text-charcoal-600'}`}>Milestones</label>
                  {newGoal.milestones.map((m, i) => (
                    <input key={i} value={m.title} onChange={(e) => {
                      const ms = [...newGoal.milestones]; ms[i] = { ...ms[i], title: e.target.value }; setNewGoal({ ...newGoal, milestones: ms });
                    }} className={`w-full px-4 py-2.5 rounded-xl outline-none mb-2 ${isDark ? 'bg-white/5 border border-white/10 text-white' : 'bg-charcoal-50 border border-charcoal-200'}`}
                      placeholder={`Milestone ${i + 1}`} />
                  ))}
                  <button onClick={() => setNewGoal({ ...newGoal, milestones: [...newGoal.milestones, { _id: String(newGoal.milestones.length + 1), title: '', completed: false }] })}
                    className="text-sm text-emerald-400 hover:text-emerald-300">+ Add milestone</button>
                </div>
                <button onClick={handleAdd} className="w-full py-3 rounded-xl bg-gradient-emerald text-white font-semibold hover:opacity-90">Create Goal</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
