import { create } from 'zustand';
import { api } from '../lib/api';
import type { Habit, Goal, Transaction, Budget, SavingsGoal, JournalEntry, HealthLog, FocusSession, JobApplication, Skill, MoodEntry, UserStats, Badge, AppNotification, CoachMessage, DisciplineSchedule, LifeScore, DopamineCredits, VisionItem } from '../types';

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  onboarded: boolean;
}

const emptyUserStats: UserStats = {
  xp: 0, level: 1, disciplineScore: 0, badges: [], weeklyStreak: 0, totalFocusHours: 0, habitsCompleted: 0
};

const emptyLifeScore: LifeScore = {
  health: 0, career: 0, finance: 0, discipline: 0, relationships: 0, mentalHealth: 0, learning: 0
};

interface AppState {
  // Data
  user: UserProfile | null;
  habits: Habit[];
  goals: Goal[];
  transactions: Transaction[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  journalEntries: JournalEntry[];
  healthLogs: HealthLog[];
  focusSessions: FocusSession[];
  jobApplications: JobApplication[];
  skills: Skill[];
  moodEntries: MoodEntry[];
  userStats: UserStats;
  lifeScore: LifeScore;
  notifications: AppNotification[];
  coachMessages: CoachMessage[];
  disciplineSchedules: DisciplineSchedule[];
  dopamineCredits: DopamineCredits | null;
  visionItems: VisionItem[];
  sidebarOpen: boolean;
  isLoading: boolean;
  hasInitialized: boolean;
  error: string | null;

  // Actions
  setSidebarOpen: (open: boolean) => void;
  initData: () => Promise<void>;
  logout: () => void;
  
  // Async Mutations
  addHabit: (habit: any) => Promise<void>;
  toggleHabitDate: (habitId: string, date: string) => Promise<void>;
  deleteHabit: (habitId: string) => Promise<void>;
  
  addGoal: (goal: any) => Promise<void>;
  updateGoalProgress: (goalId: string, progress: number) => Promise<void>;
  toggleMilestone: (goalId: string, milestoneId: string) => Promise<void>;
  
  addTransaction: (tx: any) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addBudget: (budget: any) => Promise<void>;
  addSavingsGoal: (goal: any) => Promise<void>;
  
  addJournalEntry: (entry: any) => Promise<void>;
  addHealthLog: (log: any) => Promise<void>;
  addFocusSession: (session: any) => Promise<void>;
  
  addJobApplication: (app: any) => Promise<void>;
  addSkill: (skill: any) => Promise<void>;
  
  sendCoachMessage: (message: string) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
}

export const useAppStore = create<AppState>()((set, get) => ({
  user: null,
  habits: [],
  goals: [],
  transactions: [],
  budgets: [],
  savingsGoals: [],
  journalEntries: [],
  healthLogs: [],
  focusSessions: [],
  jobApplications: [],
  skills: [],
  moodEntries: [],
  userStats: emptyUserStats,
  lifeScore: emptyLifeScore,
  notifications: [],
  coachMessages: [],
  disciplineSchedules: [],
  dopamineCredits: null,
  visionItems: [],
  sidebarOpen: true,
  isLoading: false,
  hasInitialized: false,
  error: null,

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  logout: () => {
    localStorage.removeItem('token');
    set({
      habits: [], goals: [], transactions: [], budgets: [], savingsGoals: [],
      journalEntries: [], healthLogs: [], focusSessions: [], jobApplications: [],
      skills: [], moodEntries: [], userStats: emptyUserStats, lifeScore: emptyLifeScore,
      notifications: [], coachMessages: [], dopamineCredits: null,
      user: null,
      hasInitialized: false
    });
  },

  initData: async () => {
    set({ isLoading: true, error: null });
    try {
      // Fetch data in parallel
      const [
        meRes, habits, goals, txs, budgets, savings, journal, health, focus, 
        apps, skills, stats, notifications, coach
      ] = await Promise.all([
        api.getMe().catch(() => ({ user: null })),
        api.getHabits().catch(() => []),
        api.getGoals().catch(() => []),
        api.getTransactions().catch(() => []),
        api.getBudgets().catch(() => []),
        api.getSavingsGoals().catch(() => []),
        api.getJournalEntries().catch(() => []),
        api.getHealthLogs().catch(() => []),
        api.getFocusSessions().catch(() => []),
        api.getJobApplications().catch(() => []),
        api.getSkills().catch(() => []),
        api.getUserStats().catch(() => emptyUserStats),
        api.getNotifications().catch(() => []),
        api.getCoachHistory().catch(() => []),
      ]);

      set({
        user: meRes?.user || null,
        habits, goals, transactions: txs, budgets, savingsGoals: savings,
        journalEntries: journal, healthLogs: health, focusSessions: focus,
        jobApplications: apps, skills, userStats: stats, notifications,
        coachMessages: coach, isLoading: false, hasInitialized: true
      });
    } catch (err: any) {
      set({ error: err.message || 'Failed to initialize data', isLoading: false, hasInitialized: false });
    }
  },

  addHabit: async (habit) => {
    try {
      const newHabit = await api.createHabit(habit);
      set((s) => ({ habits: [...s.habits, newHabit] }));
    } catch (error) { console.error('Failed to add habit', error); }
  },

  toggleHabitDate: async (habitId, date) => {
    const prevHabits = get().habits;
    set((s) => ({
      habits: s.habits.map(h => {
        if (h._id !== habitId) return h;
        const exists = h.completedDates.includes(date);
        return {
          ...h,
          completedDates: exists ? h.completedDates.filter(d => d !== date) : [...h.completedDates, date]
        };
      })
    }));
    try {
      await api.toggleHabit(habitId, date);
      const stats = await api.getUserStats();
      set({ userStats: stats });
    } catch (error) {
      console.error('Failed to toggle habit', error);
      set({ habits: prevHabits }); // Rollback
    }
  },

  deleteHabit: async (habitId) => {
    const prevHabits = get().habits;
    set((s) => ({ habits: s.habits.filter(h => h._id !== habitId) }));
    try { await api.deleteHabit(habitId); } 
    catch (error) { set({ habits: prevHabits }); }
  },

  addGoal: async (goal) => {
    try {
      const newGoal = await api.createGoal(goal);
      set((s) => ({ goals: [...s.goals, newGoal] }));
    } catch (error) { console.error(error); }
  },

  updateGoalProgress: async (goalId, progress) => {
    try {
      const updated = await api.updateGoal(goalId, { progress });
      set((s) => ({ goals: s.goals.map(g => g._id === goalId ? updated : g) }));
    } catch (error) { console.error(error); }
  },

  toggleMilestone: async (goalId, milestoneId) => {
    const goal = get().goals.find(g => g._id === goalId);
    if (!goal) return;
    const newMilestones = goal.milestones.map(m => 
      m._id === milestoneId ? { ...m, completed: !m.completed } : m
    );
    try {
      const updated = await api.updateGoal(goalId, { milestones: newMilestones });
      set((s) => ({ goals: s.goals.map(g => g._id === goalId ? updated : g) }));
    } catch (error) { console.error(error); }
  },

  addTransaction: async (tx) => {
    try {
      const newTx = await api.addTransaction(tx);
      set((s) => ({ transactions: [newTx, ...s.transactions] }));
    } catch (error) { console.error(error); }
  },

  deleteTransaction: async (id) => {
    set((s) => ({ transactions: s.transactions.filter(t => t._id !== id) }));
  },

  addBudget: async (budget) => {
    try {
      const newBudget = await api.setBudget(budget);
      set((s) => ({ budgets: [...s.budgets, newBudget] }));
    } catch (error) { console.error(error); }
  },

  addSavingsGoal: async (goal) => {
    try {
      const newGoal = await api.addSavingsGoal(goal);
      set((s) => ({ savingsGoals: [...s.savingsGoals, newGoal] }));
    } catch (error) { console.error(error); }
  },

  addJournalEntry: async (entry) => {
    try {
      const newEntry = await api.addJournalEntry(entry);
      set((s) => ({ journalEntries: [newEntry, ...s.journalEntries] }));
    } catch (error) { console.error(error); }
  },

  addHealthLog: async (log) => {
    try {
      const newLog = await api.addHealthLog(log);
      set((s) => ({ healthLogs: [...s.healthLogs, newLog] }));
    } catch (error) { console.error(error); }
  },

  addFocusSession: async (session) => {
    try {
      const newSession = await api.addFocusSession(session);
      set((s) => ({ focusSessions: [...s.focusSessions, newSession] }));
      const stats = await api.getUserStats();
      set({ userStats: stats });
    } catch (error) { console.error(error); }
  },

  addJobApplication: async (app) => {
    try {
      const newApp = await api.addJobApplication(app);
      set((s) => ({ jobApplications: [...s.jobApplications, newApp] }));
    } catch (error) { console.error(error); }
  },

  addSkill: async (skill) => {
    try {
      const newSkill = await api.addSkill(skill);
      set((s) => ({ skills: [...s.skills, newSkill] }));
    } catch (error) { console.error(error); }
  },

  sendCoachMessage: async (message) => {
    const tempId = Math.random().toString();
    const userMsg = { _id: tempId, role: 'user', content: message, timestamp: new Date().toISOString() };
    set((s) => ({ 
      coachMessages: [...s.coachMessages, userMsg as CoachMessage]
    }));
    try {
      const response = await api.sendCoachMessage(message);
      set((s) => ({
        coachMessages: [...s.coachMessages.filter(m => m._id !== tempId), 
          { _id: Math.random().toString(), role: 'user', content: message, timestamp: new Date().toISOString() } as CoachMessage,
          response
        ]
      }));
    } catch (error) {
      console.error(error);
      set((s) => ({ coachMessages: s.coachMessages.filter(m => m._id !== tempId) }));
    }
  },

  markNotificationRead: async (id) => {
    try {
      await api.markRead(id);
      set((s) => ({
        notifications: s.notifications.map(n => n._id === id ? { ...n, read: true } : n)
      }));
    } catch (error) { console.error(error); }
  }
}));
