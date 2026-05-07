import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Target, Brain, Wallet, Heart, Flame, BarChart3, Shield, Zap } from 'lucide-react';

const features = [
  { icon: Flame, title: 'Habit Tracking', desc: 'Build powerful habits with streaks, heatmaps, and smart reminders', color: 'from-orange-500 to-rose-500' },
  { icon: Target, title: 'Goal Setting', desc: 'Set meaningful goals with milestones and visual progress tracking', color: 'from-emerald-500 to-teal-500' },
  { icon: Brain, title: 'AI Life Coach', desc: 'Get personalized guidance, burnout detection, and improvement plans', color: 'from-violet-500 to-purple-500' },
  { icon: Wallet, title: 'Financial Recovery', desc: 'Track expenses, manage budgets, and build savings goals', color: 'from-amber-500 to-orange-500' },
  { icon: Heart, title: 'Mental Wellness', desc: 'Journal, meditate, practice gratitude, and track your mood', color: 'from-pink-500 to-rose-500' },
  { icon: BarChart3, title: 'Deep Analytics', desc: 'Visualize your progress with beautiful charts and insights', color: 'from-blue-500 to-cyan-500' },
  { icon: Shield, title: 'Discipline Modes', desc: 'F1, UFC, Anime, Monk, and Founder modes for structured growth', color: 'from-slate-500 to-zinc-500' },
  { icon: Zap, title: 'Smart Dopamine Control', desc: 'Earn entertainment through productive actions, not passive scrolling', color: 'from-yellow-500 to-amber-500' },
];

const testimonials = [
  { name: 'Alex R.', text: "This app completely changed how I approach my day. I went from feeling lost to having clear direction and purpose.", role: 'Software Developer' },
  { name: 'Sarah M.', text: "The discipline modes are incredible. The Monk Mode helped me break my social media addiction and focus on what matters.", role: 'Entrepreneur' },
  { name: 'James K.', text: "Finally an app that doesn't just track habits but actually helps you rebuild your entire life structure.", role: 'Student' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-main text-white flex flex-col w-full relative">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-charcoal-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-emerald flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">LifeReset</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="px-4 py-2 md:px-5 md:py-2.5 rounded-xl text-sm font-medium text-charcoal-300 hover:text-white transition-colors">
              Log in
            </Link>
            <Link to="/signup" className="px-4 py-2 md:px-5 md:py-2.5 rounded-xl text-sm font-medium bg-gradient-emerald text-white hover:opacity-90 transition-opacity whitespace-nowrap">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-6">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-ocean-300/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-lavender-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative w-full max-w-4xl mx-auto text-center flex flex-col items-center gap-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Your Life Operating System
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            Your life is not over.
            <br />
            <span className="text-gradient">It just needs structure,</span>
            <br />
            clarity, and consistency.
          </h1>

          <p className="text-lg md:text-xl text-charcoal-300 max-w-2xl">
            A calm, intelligent system to rebuild your discipline, health, finances, career, and mental clarity — one day at a time.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full mt-4">
            <Link to="/signup" className="flex items-center justify-center gap-2 px-8 py-4 w-full sm:w-auto rounded-2xl bg-gradient-emerald text-white font-semibold text-lg hover:opacity-90 transition-all">
              Start Your Reset
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="px-8 py-4 w-full sm:w-auto rounded-2xl border border-white/10 text-charcoal-300 hover:text-white hover:border-white/20 transition-all font-medium">
              I have an account
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl mt-12">
            {[
              { value: '14+', label: 'Life Areas' },
              { value: '5', label: 'Discipline Modes' },
              { value: 'AI', label: 'Powered Coach' },
            ].map((stat) => (
              <div key={stat.label} className="glass-card p-6 flex flex-col items-center justify-center text-center">
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">{stat.value}</div>
                <div className="text-sm text-charcoal-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="w-full py-24 px-6 flex flex-col items-center border-t border-white/5">
        <div className="w-full max-w-6xl flex flex-col gap-12">
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything you need to <span className="text-gradient">rebuild</span></h2>
            <p className="text-charcoal-300 text-lg max-w-xl mx-auto">A complete system covering every area of your life that needs attention</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {features.map((f) => (
              <div key={f.title} className="glass-card p-6 flex flex-col">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-charcoal-300 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="w-full py-24 px-6 flex flex-col items-center border-t border-white/5">
        <div className="w-full max-w-4xl flex flex-col gap-12">
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-bold">How it <span className="text-gradient">works</span></h2>
          </div>

          <div className="flex flex-col gap-8 w-full">
            {[
              { step: '01', title: 'Tell us where you are', desc: 'Share your current struggles, goals, and areas that feel out of control. No judgment.' },
              { step: '02', title: 'Get your personalized plan', desc: 'We create a structured recovery plan with daily actions, habits, and focus areas tailored to you.' },
              { step: '03', title: 'Build consistency', desc: 'Track your habits, complete challenges, earn XP, and watch your life score improve day by day.' },
              { step: '04', title: 'Feel the progress', desc: 'With analytics, AI coaching, and visual progress tracking, you\'ll see and feel the transformation.' },
            ].map((item) => (
              <div key={item.step} className="flex flex-col sm:flex-row gap-6 items-start glass-card p-6 w-full">
                <div className="w-14 h-14 rounded-2xl bg-gradient-emerald flex items-center justify-center text-xl font-bold flex-shrink-0 text-white">
                  {item.step}
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-charcoal-300">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-24 px-6 flex flex-col items-center border-t border-white/5">
        <div className="w-full max-w-6xl flex flex-col gap-12">
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-bold">People who <span className="text-gradient">reset</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {testimonials.map((t) => (
              <div key={t.name} className="glass-card p-6 flex flex-col justify-between h-full">
                <p className="text-charcoal-200 mb-6 leading-relaxed flex-1">"{t.text}"</p>
                <div className="flex items-center gap-3 mt-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-ocean-300 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                    {t.name[0]}
                  </div>
                  <div className="flex flex-col">
                    <div className="font-medium text-sm">{t.name}</div>
                    <div className="text-xs text-charcoal-400">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-24 px-6 flex flex-col items-center border-t border-white/5">
        <div className="w-full max-w-3xl glass-card p-8 md:p-12 flex flex-col items-center text-center gap-6">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to take control?</h2>
          <p className="text-charcoal-300 max-w-lg">
            Start with small steps. Build consistency. Feel the change. Your reset begins now.
          </p>
          <Link to="/signup" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-emerald text-white font-semibold text-lg hover:opacity-90 transition-all mt-4">
            Begin Your Reset <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 py-8 px-6 flex flex-col items-center gap-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <span className="font-bold text-gradient">LifeReset</span>
        </div>
        <p className="text-sm text-charcoal-500">Built with purpose. Designed for progress.</p>
      </footer>
    </div>
  );
}
