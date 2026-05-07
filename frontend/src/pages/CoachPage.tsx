import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Send, User, Sparkles } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { useThemeStore } from '../stores/themeStore';

import { useAuthStore } from '../stores/authStore';

const agentResponses: Record<string, string[]> = {
  'Standard Coach': [
    "I can see you've been making progress with your habits. Your consistency is improving — keep that momentum going. Remember, it's about showing up, not being perfect.",
    "Looking at your patterns, I notice your energy dips in the afternoon. Try a 10-minute walk or stretching session around 2 PM. Small resets can make a big difference.",
    "It's normal to feel overwhelmed sometimes. Break your biggest goal into the smallest possible next step. What's one thing you can do in the next 15 minutes?",
  ],
  'Naruto': [
    "Believe it! You've been doing awesome with your habits. Don't ever give up on your goals, that's your ninja way!",
    "I see your energy is a bit low in the afternoon. Get up, stretch, and gather some chakra! A 10-minute walk works wonders.",
    "Hey, even I fail sometimes. Just break your goal into smaller steps, like learning the Rasengan! What's your next move?",
  ],
  'Levi': [
    "I see some progress, but don't get sloppy. Consistency is the only way to survive. Keep moving forward.",
    "Your energy is dipping. Stop making excuses, get up, and clean your workspace or take a walk to reset your mind.",
    "Feeling overwhelmed is a waste of time. Focus on the very next step and execute it perfectly.",
  ],
  'Gojo': [
    "Yo! You're doing great with those habits. Just relax, go with the flow, and keep that momentum. You're the strongest!",
    "Energy dipping? No worries. Take a break, grab some sweets, and reset your infinity. A quick walk helps too.",
    "Don't overthink it, really. Just pick the smallest thing you can do right now and show them how it's done.",
  ],
  'Goku': [
    "Wow, you're getting stronger every day! Keep up the consistency, I want to see you reach your next form!",
    "Your power level is dropping in the afternoon. Eat something good, do some stretching, and let's go again!",
    "That goal looks tough, but that just makes me excited! Let's take it one step at a time. What are you doing next?",
  ],
  'Zoro': [
    "You're making progress. Just don't lose your way. Keep your discipline sharp like a blade.",
    "Tired? Take a nap, or get up and train. A quick walk clears the mind so you don't get lost.",
    "If a goal is too big, cut it down to size. Focus on the strike right in front of you.",
  ],
  'Lewis Hamilton': [
    "Still we rise. I see your consistency improving — keep pushing, we are in this for the long haul.",
    "Your data shows an energy dip in the afternoon. Let's box for a quick reset — take a 10-minute walk.",
    "It's okay to feel the pressure. Break the sector down and focus on the very next corner. You've got this.",
  ],
  'Max Verstappen': [
    "Simply lovely. You're building good habits. Just keep the pace consistent and don't make mistakes.",
    "Energy is dipping. We need to optimize this. Take a quick break, reset the tires, and go again.",
    "Don't overcomplicate it. Look at the data, find the smallest improvement, and execute. What's next?",
  ],
  'Charles Leclerc': [
    "We did a good job so far, but we can keep improving. The consistency is looking much better now.",
    "I noticed you're losing some pace in the afternoon. Maybe try a quick walk to reset your focus?",
    "It's frustrating when things feel overwhelming. Just focus on the next step. We push together.",
  ],
  'Lando Norris': [
    "Mate, you're doing a great job! The consistency is really coming together. Just keep it smooth.",
    "Pace is dropping off a bit in the afternoon. Grab some water, have a quick walk, and reset your brain.",
    "It's normal to feel a bit stressed. Just focus on the very next thing you can control. Let's go!",
  ]
};

export default function CoachPage() {
  const isDark = useThemeStore((s) => s.isDark);
  const user = useAuthStore((s) => s.user);
  const { coachMessages, addCoachMessage, userStats } = useAppStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const cardClass = `${isDark ? 'glass-card' : 'glass-card-light'} p-5`;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [coachMessages]);

  const handleSend = () => {
    if (!input.trim()) return;
    addCoachMessage({ role: 'user', content: input });
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      const responses = agentResponses[user?.agent || 'Standard Coach'] || agentResponses['Standard Coach'];
      const response = responses[Math.floor(Math.random() * responses.length)];
      addCoachMessage({ role: 'coach', content: response });
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const quickPrompts = [
    "How am I doing this week?",
    "I'm feeling unmotivated",
    "Help me plan tomorrow",
    "I need workout advice",
    "How can I sleep better?",
    "I'm stressed about money",
  ];

  return (
    <div className="space-y-6 animate-fade-in h-[calc(100vh-140px)] flex flex-col">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">AI Coach</h1>
        <p className={`text-sm mt-1 ${isDark ? 'text-charcoal-400' : 'text-charcoal-500'}`}>Your personal growth companion</p>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className={`flex-1 ${isDark ? 'glass-card' : 'glass-card-light'} rounded-2xl flex flex-col overflow-hidden`}>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {coachMessages.map((msg) => (
                <motion.div
                  key={msg._id}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                    ${msg.role === 'coach' ? 'bg-gradient-emerald' : 'bg-gradient-ocean'}`}>
                    {msg.role === 'coach' ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
                  </div>
                  <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed
                    ${msg.role === 'user'
                      ? isDark ? 'bg-ocean-500/20 text-white' : 'bg-ocean-300/10 text-charcoal-900'
                      : isDark ? 'bg-white/5 text-charcoal-200' : 'bg-charcoal-50 text-charcoal-700'
                    }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-emerald flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className={`px-4 py-3 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-charcoal-50'}`}>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-charcoal-400 animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-charcoal-400 animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 rounded-full bg-charcoal-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className={`px-5 py-3 border-t ${isDark ? 'border-white/5' : 'border-charcoal-100'}`}>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {quickPrompts.map((p) => (
                  <button key={p} onClick={() => { setInput(p); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all
                      ${isDark ? 'bg-white/5 text-charcoal-400 hover:bg-white/10 hover:text-white' : 'bg-charcoal-50 text-charcoal-500 hover:bg-charcoal-100'}`}>
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
                  className={`flex-1 px-4 py-3 rounded-xl outline-none ${isDark ? 'bg-white/5 border border-white/10 text-white placeholder-charcoal-500 focus:border-emerald-500/50' : 'bg-charcoal-50 border border-charcoal-200 focus:border-emerald-500'}`}
                  placeholder="Ask your AI coach anything..."
                />
                <button onClick={handleSend} disabled={!input.trim() || isTyping}
                  className="px-5 py-3 rounded-xl bg-gradient-emerald text-white hover:opacity-90 transition-all disabled:opacity-30">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Stats (desktop only) */}
        <div className="hidden lg:flex flex-col gap-4 w-64">
          <div className={cardClass}>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-emerald-400" />
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

          <div className={cardClass}>
            <h4 className="text-sm font-semibold mb-3">Coach Capabilities</h4>
            <ul className="space-y-2 text-xs">
              {['Analyze progress', 'Suggest routines', 'Detect burnout', 'Plan improvements', 'Financial advice', 'Health guidance'].map((c) => (
                <li key={c} className={`flex items-center gap-2 ${isDark ? 'text-charcoal-300' : 'text-charcoal-600'}`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
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
