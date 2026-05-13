import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Sparkles, Calendar, Tag } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { useThemeStore } from '../stores/themeStore';

const prompts = [
  'What are you grateful for today?',
  'What is bothering you right now?',
  'What can you control today?',
  'What would make today great?',
  'What lesson did you learn recently?',
  'What are you avoiding?',
  'What made you smile today?',
];

export default function JournalPage() {
  const isDark = useThemeStore((s) => s.isDark);
  const { journalEntries, addJournalEntry } = useAppStore();
  const [showWrite, setShowWrite] = useState(false);
  const [content, setContent] = useState('');
  const [gratitude, setGratitude] = useState(['', '', '']);
  const [tags, setTags] = useState('');
  const [mood, setMood] = useState(3);

  const cardClass = `${isDark ? 'glass-card' : 'glass-card-light'} p-5`;
  const todayPrompt = prompts[new Date().getDate() % prompts.length];

  const handleSave = () => {
    if (!content.trim()) return;
    addJournalEntry({
      content,
      mood,
      energy: 3,
      stress: 3,
      motivation: 3,
      gratitude: gratitude.filter((g) => g.trim()),
      date: new Date().toISOString().split('T')[0],
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
    });
    setContent('');
    setGratitude(['', '', '']);
    setTags('');
    setShowWrite(false);
  };

  const moods = ['😢', '😕', '😐', '🙂', '😄'];

  return (
    <div className="flex flex-col gap-6 animate-fade-in w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Journal</h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-charcoal-400' : 'text-charcoal-500'}`}>Reflect, process, and grow</p>
        </div>
        <button onClick={() => setShowWrite(!showWrite)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-emerald text-white font-medium text-sm">
          <Plus className="w-4 h-4" /> New Entry
        </button>
      </div>

      {/* Daily Prompt */}
      <motion.div className={`${cardClass} bg-gradient-to-br from-lavender-500/10 to-ocean-500/5`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-lavender-400" />
          <span className="text-sm font-medium text-lavender-400">Today's Prompt</span>
        </div>
        <p className="text-lg font-medium">{todayPrompt}</p>
      </motion.div>

      {/* Write Entry */}
      {showWrite && (
        <motion.div className={cardClass} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
          <h3 className="text-lg font-semibold mb-4">Write Your Entry</h3>

          {/* Mood */}
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-sm ${isDark ? 'text-charcoal-400' : 'text-charcoal-500'}`}>Mood:</span>
            {moods.map((emoji, i) => (
              <button key={i} onClick={() => setMood(i + 1)}
                className={`text-2xl p-1 rounded-lg transition-all ${mood === i + 1 ? 'bg-emerald-500/15 scale-110' : ''}`}>
                {emoji}
              </button>
            ))}
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl outline-none resize-none h-40 mb-4 ${isDark ? 'bg-white/5 border border-white/10 text-white placeholder-charcoal-500 focus:border-emerald-500/50' : 'bg-charcoal-50 border border-charcoal-200 focus:border-emerald-500'}`}
            placeholder="How are you feeling? What's on your mind..."
          />

          {/* Gratitude */}
          <div className="mb-4">
            <label className={`text-sm font-medium mb-2 block ${isDark ? 'text-charcoal-300' : 'text-charcoal-600'}`}>3 Things I'm Grateful For</label>
            {gratitude.map((g, i) => (
              <input key={i} value={g} onChange={(e) => { const ng = [...gratitude]; ng[i] = e.target.value; setGratitude(ng); }}
                className={`w-full px-4 py-2.5 rounded-xl outline-none mb-2 ${isDark ? 'bg-white/5 border border-white/10 text-white' : 'bg-charcoal-50 border border-charcoal-200'}`}
                placeholder={`Gratitude ${i + 1}...`} />
            ))}
          </div>

          {/* Tags */}
          <input value={tags} onChange={(e) => setTags(e.target.value)}
            className={`w-full px-4 py-2.5 rounded-xl outline-none mb-4 ${isDark ? 'bg-white/5 border border-white/10 text-white' : 'bg-charcoal-50 border border-charcoal-200'}`}
            placeholder="Tags (comma-separated)" />

          <button onClick={handleSave} className="w-full py-3 rounded-xl bg-gradient-emerald text-white font-semibold hover:opacity-90">
            Save Entry
          </button>
        </motion.div>
      )}

      {/* Past Entries */}
      <div className="space-y-4">
        {journalEntries.map((entry, i) => (
          <motion.div key={entry._id} className={cardClass} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{moods[(entry.mood || 3) - 1]}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-charcoal-400" />
                    <span className={`text-sm ${isDark ? 'text-charcoal-400' : 'text-charcoal-500'}`}>
                      {new Date(entry.date).toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <p className={`text-sm leading-relaxed mb-3 ${isDark ? 'text-charcoal-200' : 'text-charcoal-700'}`}>{entry.content}</p>
            {entry.gratitude.length > 0 && (
              <div className={`mb-3 p-3 rounded-xl ${isDark ? 'bg-emerald-500/5' : 'bg-emerald-50'}`}>
                <span className="text-xs font-medium text-emerald-400 block mb-1">Grateful for:</span>
                <ul className="space-y-0.5">
                  {entry.gratitude.map((g, gi) => (
                    <li key={gi} className="text-xs text-charcoal-300">✨ {g}</li>
                  ))}
                </ul>
              </div>
            )}
            {entry.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="w-3 h-3 text-charcoal-500" />
                {entry.tags.map((t) => (
                  <span key={t} className={`text-xs px-2 py-0.5 rounded-lg ${isDark ? 'bg-white/5 text-charcoal-400' : 'bg-charcoal-100 text-charcoal-500'}`}>{t}</span>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
