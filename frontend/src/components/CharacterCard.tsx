import { motion } from 'framer-motion';
import { type AppMode } from '../stores/themeStore';

interface CharacterCardProps {
  agent: string;
  mode: AppMode;
  compact?: boolean;
  showQuote?: boolean;
}

// Agent metadata: emoji, quote, subtitle
const agentMeta: Record<string, { emoji: string; quote: string; subtitle: string; mode: string }> = {
  'Standard Coach': {
    emoji: '🧠',
    quote: 'Consistency beats intensity. Show up every day.',
    subtitle: 'Evidence-based Life Coach',
    mode: 'Default',
  },
  'Naruto': {
    emoji: '🍥',
    quote: "Believe it! I never go back on my word — that's my ninja way!",
    subtitle: 'Hidden Leaf — 7th Hokage',
    mode: 'Anime',
  },
  'Levi': {
    emoji: '⚔️',
    quote: 'No matter how twisted, keep moving forward.',
    subtitle: 'Survey Corps — Humanity\'s Strongest',
    mode: 'Anime',
  },
  'Gojo': {
    emoji: '♾️',
    quote: "Throughout heaven and earth, I alone am the honored one.",
    subtitle: 'Jujutsu High — Limitless Sorcerer',
    mode: 'Anime',
  },
  'Goku': {
    emoji: '✨',
    quote: "I am the hope of the universe. I am the answer to all living things that cry out for peace.",
    subtitle: 'Saiyan — Ultra Instinct',
    mode: 'Anime',
  },
  'Zoro': {
    emoji: '🗡️',
    quote: "Nothing happened.",
    subtitle: 'Straw Hat Pirates — First Mate',
    mode: 'Anime',
  },
  'Lewis Hamilton': {
    emoji: '🏆',
    quote: "Still I rise. The impossible is always possible.",
    subtitle: 'Mercedes F1 — 7x World Champion',
    mode: 'F1',
  },
  'Max Verstappen': {
    emoji: '🏎️',
    quote: "Simply lovely. I just focus on doing the best I can.",
    subtitle: 'Red Bull Racing — 3x World Champion',
    mode: 'F1',
  },
  'Charles Leclerc': {
    emoji: '🔴',
    quote: "We push together. I give everything for this team.",
    subtitle: 'Scuderia Ferrari — Monaco Prince',
    mode: 'F1',
  },
  'Lando Norris': {
    emoji: '🟠',
    quote: "Don't stress it mate. Just keep your head down and go.",
    subtitle: 'McLaren F1 — Fastest Briton',
    mode: 'F1',
  },
};

const modeColors: Record<AppMode, { badge: string; ring: string }> = {
  default: { badge: 'bg-emerald-500/10 text-emerald-400', ring: 'border-emerald-500/30' },
  anime: {
    badge: 'bg-orange-500/10 text-orange-400',
    ring: 'border-orange-500/30',
  },
  f1: { badge: 'bg-red-500/10 text-red-400', ring: 'border-red-500/30' },
};

export default function CharacterCard({ agent, mode, compact = false, showQuote = true }: CharacterCardProps) {
  const meta = agentMeta[agent] || agentMeta['Standard Coach'];
  const colors = modeColors[mode];

  if (compact) {
    return (
      <motion.div
        className="flex items-center gap-3 p-3 rounded-xl character-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 border ${colors.ring}`}
          style={{ background: 'var(--theme-primary-dim)' }}
        >
          {meta.emoji}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold truncate">{agent}</div>
          <div className="text-xs text-charcoal-400 truncate">{meta.subtitle}</div>
        </div>
        <div className={`ml-auto flex-shrink-0 text-[10px] font-bold px-2 py-1 rounded-full ${colors.badge}`}>
          {meta.mode}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="character-card"
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ type: 'spring', damping: 18, stiffness: 250 }}
    >
      {/* Mode badge */}
      <div className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full mb-3 uppercase tracking-wider ${colors.badge}`}>
        {mode === 'anime' ? '⚡' : mode === 'f1' ? '🏎' : '✨'} {meta.mode} Mode
      </div>

      {/* Agent info */}
      <div className="flex items-center gap-4 mb-3">
        <motion.div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl border-2 ${colors.ring} flex-shrink-0`}
          style={{ background: 'var(--theme-primary-dim)' }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {meta.emoji}
        </motion.div>
        <div>
          <h3 className="text-lg font-bold">{agent}</h3>
          <p className="text-xs text-charcoal-400">{meta.subtitle}</p>
          <div className="flex items-center gap-1 mt-1">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--theme-primary)' }} />
            <span className="text-xs" style={{ color: 'var(--theme-primary)' }}>Active Coach</span>
          </div>
        </div>
      </div>

      {/* Quote */}
      {showQuote && (
        <blockquote className="text-sm italic text-charcoal-300 border-l-2 pl-3"
          style={{ borderColor: 'var(--theme-primary)' }}>
          "{meta.quote}"
        </blockquote>
      )}
    </motion.div>
  );
}
