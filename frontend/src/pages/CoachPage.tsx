import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Send, User, Sparkles } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { useThemeStore } from '../stores/themeStore';
import CharacterCard from '../components/CharacterCard';
import type { CoachMessage } from '../types';

export default function CoachPage() {
  const isDark = useThemeStore((s) => s.isDark);
  const { appMode, agent } = useThemeStore();
  const { coachMessages, sendCoachMessage, userStats } = useAppStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const cardClass = `${isDark ? 'glass-card' : 'glass-card-light'} p-5`;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [coachMessages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const msg = input.trim();
    setInput('');
    setIsTyping(true);
    try {
      await sendCoachMessage(msg);
    } finally {
      setIsTyping(false);
    }
  };

  const quickPrompts = appMode === 'anime'
    ? ["How's my chakra today?", "Help me train harder", "I feel like giving up", "What's my next mission?", "Rate my discipline", "How to beat procrastination?"]
    : appMode === 'f1'
    ? ["How's my pace this week?", "Analyze my performance", "I need a strategy change", "Push for fastest lap", "Tire management advice", "Mental reset needed"]
    : ["How am I doing this week?", "I'm feeling unmotivated", "Help me plan tomorrow", "I need workout advice", "How can I sleep better?", "I'm stressed about money"];

  return (
    <div className="space-y-6 animate-fade-in h-[calc(100vh-190px)] flex flex-col">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">AI Coach</h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-charcoal-400' : 'text-charcoal-500'}`}>
            Powered by GPT-4o · In character with <span style={{ color: 'var(--theme-primary)' }}>{agent}</span>
          </p>
        </div>
        <div
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold"
          style={{ background: 'var(--theme-primary-dim)', color: 'var(--theme-primary)' }}
        >
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--theme-primary)' }} />
          {agent} Online
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className={`flex-1 ${isDark ? 'glass-card' : 'glass-card-light'} rounded-2xl flex flex-col overflow-hidden`}>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {coachMessages.length === 0 && (
                <motion.div
                  className="flex flex-col items-center justify-center h-full gap-4 text-center py-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                    style={{ background: 'var(--theme-primary-dim)', border: '1px solid var(--theme-primary-dim)' }}
                  >
                    {appMode === 'anime' ? '⚡' : appMode === 'f1' ? '🏎️' : '🧠'}
                  </div>
                  <p className={`text-sm ${isDark ? 'text-charcoal-400' : 'text-charcoal-500'} max-w-xs`}>
                    {agent} is ready. Ask anything about your habits, goals, or mindset.
                  </p>
                </motion.div>
              )}

              {coachMessages.map((msg: CoachMessage) => (
                <motion.div
                  key={msg._id}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {/* Avatar */}
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: msg.role === 'coach' ? 'var(--theme-gradient)' : 'rgba(83,168,212,0.3)',
                    }}
                  >
                    {msg.role === 'coach'
                      ? <Bot className="w-4 h-4 text-white" />
                      : <User className="w-4 h-4 text-white" />
                    }
                  </div>

                  {/* Bubble */}
                  <div
                    className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed`}
                    style={msg.role === 'coach'
                      ? {
                          background: isDark ? 'rgba(255,255,255,0.04)' : '#f0f2f5',
                          color: isDark ? '#b3b9c9' : '#3d4a6b',
                          borderLeft: '2px solid var(--theme-primary)',
                        }
                      : {
                          background: 'var(--theme-primary-dim)',
                          color: 'white',
                        }
                    }
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'var(--theme-gradient)' }}
                  >
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className={`px-4 py-3 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-charcoal-50'}`}>
                    <div className="flex gap-1">
                      {[0, 0.1, 0.2].map((delay, i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 rounded-full"
                          style={{ background: 'var(--theme-primary)' }}
                          animate={{ y: [0, -6, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className={`px-5 py-3 border-t ${isDark ? 'border-white/5' : 'border-charcoal-100'}`}>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {quickPrompts.map((p) => (
                  <button
                    key={p}
                    onClick={() => setInput(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex-shrink-0
                      ${isDark ? 'bg-white/5 text-charcoal-400 hover:text-white' : 'bg-charcoal-50 text-charcoal-500 hover:bg-charcoal-100'}`}
                    style={{ borderColor: 'transparent' }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--theme-primary-dim)')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'transparent')}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className={`p-4 border-t ${isDark ? 'border-white/5' : 'border-charcoal-100'}`}>
              <div className="flex gap-3">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className={`flex-1 px-4 py-3 rounded-xl outline-none transition-all ${isDark ? 'bg-white/5 border border-white/10 text-white placeholder-charcoal-500' : 'bg-charcoal-50 border border-charcoal-200'}`}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--theme-primary)')}
                  onBlur={(e) => (e.target.style.borderColor = isDark ? 'rgba(255,255,255,0.1)' : '#dce0e8')}
                  placeholder={`Ask ${agent} anything…`}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="px-5 py-3 rounded-xl text-white hover:opacity-90 transition-all disabled:opacity-30"
                  style={{ background: 'var(--theme-gradient)' }}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar (desktop) */}
        <div className="hidden lg:flex flex-col gap-4 w-64">
          {/* Character card */}
          <CharacterCard agent={agent} mode={appMode} compact={false} showQuote={true} />

          {/* Stats */}
          <div className={cardClass}>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5" style={{ color: 'var(--theme-primary)' }} />
              <span className="text-sm font-semibold">Your Stats</span>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Level', value: userStats.level },
                { label: 'XP', value: userStats.xp.toLocaleString() },
                { label: 'Discipline', value: `${userStats.disciplineScore}%` },
                { label: 'Streak', value: `${userStats.weeklyStreak} weeks` },
                { label: 'Focus', value: `${Math.round(userStats.totalFocusHours)}h` },
              ].map((s) => (
                <div key={s.label} className="flex justify-between">
                  <span className={`text-xs ${isDark ? 'text-charcoal-400' : 'text-charcoal-500'}`}>{s.label}</span>
                  <span className="text-xs font-medium">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Capabilities */}
          <div className={cardClass}>
            <h4 className="text-sm font-semibold mb-3">Coach Capabilities</h4>
            <ul className="space-y-2 text-xs">
              {['Analyze progress', 'Suggest routines', 'Detect burnout', 'Plan improvements', 'Financial advice', 'Health guidance'].map((c) => (
                <li key={c} className={`flex items-center gap-2 ${isDark ? 'text-charcoal-300' : 'text-charcoal-600'}`}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--theme-primary)' }} />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
