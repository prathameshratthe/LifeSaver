import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, TrendingDown, TrendingUp, Wallet, PiggyBank, X, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useAppStore } from '../stores/appStore';
import { useThemeStore } from '../stores/themeStore';

const expenseCategories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Health', 'Shopping', 'Education', 'Rent', 'Other'];
const COLORS = ['#0cce6b', '#53a8d4', '#8b5cf6', '#f59e0b', '#f43f5e', '#a78bfa', '#fbbf24', '#fb7185', '#6ee7b7'];

export default function FinancePage() {
  const isDark = useThemeStore((s) => s.isDark);
  const { transactions, addTransaction, savingsGoals, budgets } = useAppStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newTx, setNewTx] = useState({ type: 'expense' as 'income' | 'expense', amount: '', category: 'Food', description: '', date: new Date().toISOString().split('T')[0] });

  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((a, t) => a + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((a, t) => a + t.amount, 0);
  const balance = totalIncome - totalExpense;

  // Spending by category
  const categoryData = expenseCategories.map((cat) => ({
    name: cat,
    value: transactions.filter((t) => t.type === 'expense' && t.category === cat).reduce((a, t) => a + t.amount, 0),
  })).filter((d) => d.value > 0);

  // Monthly data
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(); d.setMonth(d.getMonth() - (5 - i));
    const month = d.toLocaleDateString('en', { month: 'short' });
    return { month, income: 4000 + Math.random() * 2000, expense: 2000 + Math.random() * 1500 };
  });

  const handleAdd = () => {
    if (!newTx.amount || !newTx.description) return;
    addTransaction({ ...newTx, amount: Number(newTx.amount) });
    setNewTx({ type: 'expense', amount: '', category: 'Food', description: '', date: new Date().toISOString().split('T')[0] });
    setShowAdd(false);
  };

  const cardClass = `${isDark ? 'glass-card' : 'glass-card-light'} p-5`;

  return (
    <div className="flex flex-col gap-6 animate-fade-in w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Finance</h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-charcoal-400' : 'text-charcoal-500'}`}>Track, budget, and grow</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-emerald text-white font-medium text-sm">
          <Plus className="w-4 h-4" /> Add Transaction
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Balance', value: balance, icon: Wallet, color: 'text-emerald-400', bg: 'bg-emerald-500/10', trend: '+12%' },
          { label: 'Income', value: totalIncome, icon: ArrowUpRight, color: 'text-ocean-300', bg: 'bg-ocean-300/10', trend: '+8%' },
          { label: 'Expenses', value: totalExpense, icon: ArrowDownRight, color: 'text-rose-400', bg: 'bg-rose-500/10', trend: '-5%' },
        ].map((item, i) => (
          <motion.div key={item.label} className={cardClass} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center`}>
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <span className={`text-xs font-medium ${item.color}`}>{item.trend}</span>
            </div>
            <div className="text-2xl font-bold">${item.value.toLocaleString()}</div>
            <div className={`text-xs mt-0.5 ${isDark ? 'text-charcoal-400' : 'text-charcoal-500'}`}>{item.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Chart */}
        <motion.div className={cardClass} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" stroke="none">
                {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: isDark ? '#1e2a4a' : '#fff', border: 'none', borderRadius: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 justify-center">
            {categoryData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                <span className={`text-xs ${isDark ? 'text-charcoal-400' : 'text-charcoal-500'}`}>{d.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Monthly Trend */}
        <motion.div className={cardClass} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h3 className="text-lg font-semibold mb-4">Monthly Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" tick={{ fill: isDark ? '#8891a5' : '#5a6480', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: isDark ? '#8891a5' : '#5a6480', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: isDark ? '#1e2a4a' : '#fff', border: 'none', borderRadius: 12 }} />
              <Bar dataKey="income" fill="#0cce6b" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expense" fill="#f43f5e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Savings Goals */}
      <motion.div className={cardClass} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Savings Goals</h3>
          <PiggyBank className={`w-5 h-5 ${isDark ? 'text-charcoal-400' : 'text-charcoal-500'}`} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savingsGoals.map((g) => (
            <div key={g._id} className={`p-4 rounded-xl ${isDark ? 'bg-white/3' : 'bg-charcoal-50'}`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{g.icon}</span>
                <div>
                  <div className="font-medium">{g.name}</div>
                  <div className={`text-xs ${isDark ? 'text-charcoal-400' : 'text-charcoal-500'}`}>Target: ${g.target.toLocaleString()}</div>
                </div>
              </div>
              <div className={`h-2 rounded-full ${isDark ? 'bg-white/5' : 'bg-charcoal-200'} mb-2`}>
                <div className="h-2 rounded-full bg-gradient-emerald transition-all" style={{ width: `${Math.min((g.current / g.target) * 100, 100)}%` }} />
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-emerald-400">${g.current.toLocaleString()}</span>
                <span className={isDark ? 'text-charcoal-500' : 'text-charcoal-400'}>{Math.round((g.current / g.target) * 100)}%</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Budget Tracker */}
      <motion.div className={cardClass} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h3 className="text-lg font-semibold mb-4">Budget Tracker</h3>
        <div className="space-y-4">
          {budgets.map((b) => {
            const pct = Math.round((b.spent / b.limit) * 100);
            const isOver = pct > 80;
            return (
              <div key={b._id}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm font-medium">{b.category}</span>
                  <span className={`text-xs ${isOver ? 'text-rose-400' : isDark ? 'text-charcoal-400' : 'text-charcoal-500'}`}>${b.spent} / ${b.limit}</span>
                </div>
                <div className={`h-2 rounded-full ${isDark ? 'bg-white/5' : 'bg-charcoal-100'}`}>
                  <div className={`h-2 rounded-full transition-all ${isOver ? 'bg-gradient-sunset' : 'bg-gradient-emerald'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                </div>
              </div>
            );
          })}
        </div>
        <div className={`mt-4 p-3 rounded-xl text-sm ${isDark ? 'bg-emerald-500/5 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
          💡 You spent 18% less this week than last week. Keep it up!
        </div>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div className={cardClass} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        <div className="space-y-2">
          {transactions.slice(0, 8).map((t) => (
            <div key={t._id} className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? 'bg-white/3' : 'bg-charcoal-50'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.type === 'income' ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
                {t.type === 'income' ? <TrendingUp className="w-5 h-5 text-emerald-400" /> : <TrendingDown className="w-5 h-5 text-rose-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{t.description}</div>
                <div className={`text-xs ${isDark ? 'text-charcoal-500' : 'text-charcoal-400'}`}>{t.category} · {new Date(t.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</div>
              </div>
              <span className={`font-semibold ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {t.type === 'income' ? '+' : '-'}${t.amount}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Add Transaction Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-md rounded-2xl p-6 ${isDark ? 'bg-charcoal-900 border border-white/10' : 'bg-white border border-charcoal-100'}`} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold">Add Transaction</h3>
                <button onClick={() => setShowAdd(false)} className="p-1.5 rounded-lg hover:bg-white/5"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div className="flex gap-2">
                  {(['expense', 'income'] as const).map((t) => (
                    <button key={t} onClick={() => setNewTx({ ...newTx, type: t })}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${newTx.type === t ? (t === 'income' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30') : isDark ? 'bg-white/5 text-charcoal-400 border border-white/10' : 'bg-charcoal-50 text-charcoal-500 border border-charcoal-200'}`}>
                      {t}
                    </button>
                  ))}
                </div>
                <input type="number" value={newTx.amount} onChange={(e) => setNewTx({ ...newTx, amount: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl outline-none ${isDark ? 'bg-white/5 border border-white/10 text-white focus:border-emerald-500/50' : 'bg-charcoal-50 border border-charcoal-200 focus:border-emerald-500'}`}
                  placeholder="Amount" />
                <input value={newTx.description} onChange={(e) => setNewTx({ ...newTx, description: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl outline-none ${isDark ? 'bg-white/5 border border-white/10 text-white focus:border-emerald-500/50' : 'bg-charcoal-50 border border-charcoal-200 focus:border-emerald-500'}`}
                  placeholder="Description" />
                <select value={newTx.category} onChange={(e) => setNewTx({ ...newTx, category: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl outline-none ${isDark ? 'bg-white/5 border border-white/10 text-white focus:border-emerald-500/50' : 'bg-charcoal-50 border border-charcoal-200 focus:border-emerald-500'}`}>
                  {(newTx.type === 'income' ? ['Salary', 'Freelance', 'Investment', 'Other'] : expenseCategories).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <input type="date" value={newTx.date} onChange={(e) => setNewTx({ ...newTx, date: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl outline-none ${isDark ? 'bg-white/5 border border-white/10 text-white focus:border-emerald-500/50' : 'bg-charcoal-50 border border-charcoal-200 focus:border-emerald-500'}`} />
                <button onClick={handleAdd} className="w-full py-3 rounded-xl bg-gradient-emerald text-white font-semibold hover:opacity-90">Add Transaction</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
