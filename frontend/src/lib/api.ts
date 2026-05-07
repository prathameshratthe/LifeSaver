const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  signup: (name: string, email: string, password: string) =>
    request('/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
  getMe: () => request('/auth/me'),
  updateProfile: (data: Record<string, unknown>) =>
    request('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),
  onboard: (data: Record<string, unknown>) =>
    request('/auth/onboard', { method: 'POST', body: JSON.stringify(data) }),

  // Habits
  getHabits: () => request('/habits'),
  createHabit: (data: Record<string, unknown>) =>
    request('/habits', { method: 'POST', body: JSON.stringify(data) }),
  updateHabit: (id: string, data: Record<string, unknown>) =>
    request(`/habits/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteHabit: (id: string) =>
    request(`/habits/${id}`, { method: 'DELETE' }),
  toggleHabit: (id: string, date: string) =>
    request(`/habits/${id}/toggle`, { method: 'POST', body: JSON.stringify({ date }) }),

  // Goals
  getGoals: () => request('/goals'),
  createGoal: (data: Record<string, unknown>) =>
    request('/goals', { method: 'POST', body: JSON.stringify(data) }),
  updateGoal: (id: string, data: Record<string, unknown>) =>
    request(`/goals/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteGoal: (id: string) =>
    request(`/goals/${id}`, { method: 'DELETE' }),

  // Finance
  getTransactions: () => request('/finance/transactions'),
  addTransaction: (data: Record<string, unknown>) =>
    request('/finance/transactions', { method: 'POST', body: JSON.stringify(data) }),
  getBudgets: () => request('/finance/budgets'),
  setBudget: (data: Record<string, unknown>) =>
    request('/finance/budgets', { method: 'POST', body: JSON.stringify(data) }),
  getSavingsGoals: () => request('/finance/savings'),
  addSavingsGoal: (data: Record<string, unknown>) =>
    request('/finance/savings', { method: 'POST', body: JSON.stringify(data) }),

  // Journal
  getJournalEntries: () => request('/journal'),
  addJournalEntry: (data: Record<string, unknown>) =>
    request('/journal', { method: 'POST', body: JSON.stringify(data) }),

  // Health
  getHealthLogs: () => request('/health'),
  addHealthLog: (data: Record<string, unknown>) =>
    request('/health', { method: 'POST', body: JSON.stringify(data) }),

  // Focus
  getFocusSessions: () => request('/focus'),
  addFocusSession: (data: Record<string, unknown>) =>
    request('/focus', { method: 'POST', body: JSON.stringify(data) }),

  // Career
  getJobApplications: () => request('/career/applications'),
  addJobApplication: (data: Record<string, unknown>) =>
    request('/career/applications', { method: 'POST', body: JSON.stringify(data) }),
  getSkills: () => request('/career/skills'),
  addSkill: (data: Record<string, unknown>) =>
    request('/career/skills', { method: 'POST', body: JSON.stringify(data) }),

  // Analytics
  getAnalytics: () => request('/analytics'),
  getWeeklyReport: () => request('/analytics/weekly'),

  // Gamification
  getUserStats: () => request('/gamification/stats'),
  getBadges: () => request('/gamification/badges'),

  // AI Coach
  sendCoachMessage: (content: string) =>
    request('/coach', { method: 'POST', body: JSON.stringify({ content }) }),
  getCoachHistory: () => request('/coach'),

  // Notifications
  getNotifications: () => request('/notifications'),
  markRead: (id: string) =>
    request(`/notifications/${id}/read`, { method: 'PUT' }),
};
