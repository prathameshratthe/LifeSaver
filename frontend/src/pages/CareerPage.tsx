import { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Plus, X, GraduationCap, Code, Award } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { useThemeStore } from '../stores/themeStore';

const statusColors: Record<string, string> = {
  applied: 'bg-ocean-300/10 text-ocean-300',
  screening: 'bg-amber-500/10 text-amber-400',
  interview: 'bg-lavender-500/10 text-lavender-400',
  offer: 'bg-emerald-500/10 text-emerald-400',
  rejected: 'bg-rose-500/10 text-rose-400',
};

export default function CareerPage() {
  const isDark = useThemeStore((s) => s.isDark);
  const { jobApplications, skills, addJobApplication } = useAppStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newApp, setNewApp] = useState({ company: '', position: '', status: 'applied' as const, appliedDate: new Date().toISOString().split('T')[0], notes: '' });
  const cardClass = `${isDark ? 'glass-card' : 'glass-card-light'} p-5`;

  const handleAdd = () => {
    if (!newApp.company || !newApp.position) return;
    addJobApplication(newApp);
    setNewApp({ company: '', position: '', status: 'applied', appliedDate: new Date().toISOString().split('T')[0], notes: '' });
    setShowAdd(false);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Career Growth</h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-charcoal-400' : 'text-charcoal-500'}`}>Track applications, skills & progress</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-emerald text-white font-medium text-sm">
          <Plus className="w-4 h-4" /> Add Application
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Applications', value: jobApplications.length, icon: Briefcase, color: 'text-ocean-300', bg: 'bg-ocean-300/10' },
          { label: 'Interviews', value: jobApplications.filter((a) => a.status === 'interview').length, icon: Award, color: 'text-lavender-400', bg: 'bg-lavender-500/10' },
          { label: 'Skills', value: skills.length, icon: Code, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Learning', value: '2.5h/day', icon: GraduationCap, color: 'text-amber-400', bg: 'bg-amber-500/10' },
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

      {/* Job Applications Pipeline */}
      <motion.div className={cardClass} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h3 className="text-lg font-semibold mb-4">Application Pipeline</h3>
        <div className="space-y-3">
          {jobApplications.map((app) => (
            <div key={app._id} className={`flex items-center gap-3 p-4 rounded-xl ${isDark ? 'bg-white/3' : 'bg-charcoal-50'}`}>
              <div className={`w-10 h-10 rounded-xl bg-gradient-ocean flex items-center justify-center text-white font-bold text-sm`}>
                {app.company[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium">{app.position}</div>
                <div className={`text-sm ${isDark ? 'text-charcoal-400' : 'text-charcoal-500'}`}>{app.company}</div>
              </div>
              <span className={`text-xs px-3 py-1 rounded-lg capitalize ${statusColors[app.status]}`}>{app.status}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Skills Roadmap */}
      <motion.div className={cardClass} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <h3 className="text-lg font-semibold mb-4">Skill Roadmap</h3>
        <div className="space-y-4">
          {skills.map((skill) => (
            <div key={skill._id}>
              <div className="flex justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{skill.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-lg ${isDark ? 'bg-white/5 text-charcoal-400' : 'bg-charcoal-100 text-charcoal-500'}`}>{skill.category}</span>
                </div>
                <span className={`text-xs ${isDark ? 'text-charcoal-400' : 'text-charcoal-500'}`}>{skill.level}% / {skill.targetLevel}%</span>
              </div>
              <div className={`h-2.5 rounded-full ${isDark ? 'bg-white/5' : 'bg-charcoal-100'} relative`}>
                <div className="h-2.5 rounded-full bg-gradient-ocean transition-all" style={{ width: `${skill.level}%` }} />
                <div className="absolute top-0 h-2.5 w-0.5 bg-charcoal-400" style={{ left: `${skill.targetLevel}%` }} title={`Target: ${skill.targetLevel}%`} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Add Application Modal */}
      {showAdd && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className={`w-full max-w-md rounded-2xl p-6 ${isDark ? 'bg-charcoal-900 border border-white/10' : 'bg-white border border-charcoal-100'}`} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold">New Application</h3>
              <button onClick={() => setShowAdd(false)} className="p-1.5 rounded-lg hover:bg-white/5"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <input value={newApp.company} onChange={(e) => setNewApp({ ...newApp, company: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl outline-none ${isDark ? 'bg-white/5 border border-white/10 text-white focus:border-emerald-500/50' : 'bg-charcoal-50 border border-charcoal-200 focus:border-emerald-500'}`} placeholder="Company name" />
              <input value={newApp.position} onChange={(e) => setNewApp({ ...newApp, position: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl outline-none ${isDark ? 'bg-white/5 border border-white/10 text-white focus:border-emerald-500/50' : 'bg-charcoal-50 border border-charcoal-200 focus:border-emerald-500'}`} placeholder="Position" />
              <textarea value={newApp.notes} onChange={(e) => setNewApp({ ...newApp, notes: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl outline-none resize-none h-20 ${isDark ? 'bg-white/5 border border-white/10 text-white focus:border-emerald-500/50' : 'bg-charcoal-50 border border-charcoal-200 focus:border-emerald-500'}`} placeholder="Notes" />
              <button onClick={handleAdd} className="w-full py-3 rounded-xl bg-gradient-emerald text-white font-semibold hover:opacity-90">Add Application</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
