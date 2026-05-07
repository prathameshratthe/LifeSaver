// User types
export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  age?: number;
  onboarded: boolean;
  createdAt: string;
}

export interface OnboardingData {
  name: string;
  age: number;
  struggles: string[];
  careerGoals: string;
  financialGoals: string;
  healthGoals: string;
  sleepSchedule: string;
  stressLevel: number;
  currentHabits: string[];
  outOfControl: string[];
}

// Habit types
export interface Habit {
  _id: string;
  userId: string;
  name: string;
  category: HabitCategory;
  difficulty: 'easy' | 'medium' | 'hard';
  frequency: 'daily' | 'weekly';
  completedDates: string[];
  currentStreak: number;
  bestStreak: number;
  createdAt: string;
  color: string;
  icon: string;
}

export type HabitCategory = 'health' | 'fitness' | 'career' | 'learning' | 'finance' | 'spiritual' | 'relationships';

// Goal types
export interface Goal {
  _id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  targetDate: string;
  progress: number;
  milestones: Milestone[];
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
}

export interface Milestone {
  _id: string;
  title: string;
  completed: boolean;
  completedDate?: string;
}

// Finance types
export interface Transaction {
  _id: string;
  userId: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface Budget {
  _id: string;
  userId: string;
  category: string;
  limit: number;
  spent: number;
  month: string;
}

export interface SavingsGoal {
  _id: string;
  userId: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  icon: string;
}

// Career types
export interface JobApplication {
  _id: string;
  userId: string;
  company: string;
  position: string;
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'rejected';
  appliedDate: string;
  notes: string;
}

export interface Skill {
  _id: string;
  userId: string;
  name: string;
  level: number;
  targetLevel: number;
  category: string;
}

// Wellness types
export interface JournalEntry {
  _id: string;
  userId: string;
  content: string;
  mood: number;
  energy: number;
  stress: number;
  motivation: number;
  gratitude: string[];
  date: string;
  tags: string[];
}

export interface MoodEntry {
  date: string;
  mood: number;
  energy: number;
  stress: number;
  motivation: number;
}

// Health types
export interface HealthLog {
  _id: string;
  userId: string;
  date: string;
  sleepHours: number;
  waterIntake: number;
  exercise: number;
  steps: number;
  weight?: number;
  energyLevel: number;
}

// Focus types
export interface FocusSession {
  _id: string;
  userId: string;
  duration: number;
  type: 'pomodoro' | 'deep-work' | 'custom';
  startTime: string;
  endTime: string;
  completed: boolean;
  category: string;
}

// Gamification types
export interface UserStats {
  xp: number;
  level: number;
  disciplineScore: number;
  badges: Badge[];
  weeklyStreak: number;
  totalFocusHours: number;
  habitsCompleted: number;
}

export interface Badge {
  _id: string;
  name: string;
  description: string;
  icon: string;
  earnedDate: string;
  category: string;
}

// Discipline Mode types
export type DisciplineMode = 'f1' | 'ufc' | 'anime' | 'monk' | 'founder' | 'custom';

export interface DisciplineSchedule {
  _id: string;
  userId: string;
  mode: DisciplineMode;
  active: boolean;
  schedule: ScheduleItem[];
  adherenceScore: number;
}

export interface ScheduleItem {
  time: string;
  activity: string;
  duration: number;
  completed: boolean;
}

// Notification types
export interface AppNotification {
  _id: string;
  type: 'habit' | 'sleep' | 'water' | 'focus' | 'reflection' | 'achievement' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// AI Coach types
export interface CoachMessage {
  _id: string;
  role: 'user' | 'coach';
  content: string;
  timestamp: string;
}

// Analytics types
export interface WeeklyReport {
  week: string;
  habitsCompleted: number;
  totalHabits: number;
  focusHours: number;
  moodAverage: number;
  disciplineScore: number;
  highlights: string[];
  improvements: string[];
}

// Life Score
export interface LifeScore {
  health: number;
  career: number;
  finance: number;
  discipline: number;
  relationships: number;
  mentalHealth: number;
  learning: number;
}

// Dopamine Control
export interface DopamineCredits {
  available: number;
  used: number;
  earnedToday: number;
  isWeekend: boolean;
  maxDaily: number;
}

// Vision Board
export interface VisionItem {
  _id: string;
  userId: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  createdAt: string;
}
