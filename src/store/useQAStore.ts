import { create } from 'zustand';

export interface QAChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  notes: string;
}

export type BugSeverity = 'Low' | 'Medium' | 'High' | 'Critical';

export interface QABug {
  id: string;
  time: string;
  screen: string;
  severity: BugSeverity;
  description: string;
  status: 'Open' | 'Resolved';
}

export interface QAStoreState {
  isVisible: boolean;
  milestone: string;
  checklist: QAChecklistItem[];
  bugs: QABug[];
  startTime: string;

  toggleVisibility: () => void;
  toggleChecklistItem: (id: string) => void;
  updateItemNotes: (id: string, notes: string) => void;
  addBug: (screen: string, severity: BugSeverity, description: string) => void;
  resolveBug: (id: string) => void;
  exportSession: () => string;
}

const INITIAL_CHECKLIST: QAChecklistItem[] = [
  { id: 'engine_splash', label: 'Engine Splash', checked: false, notes: '' },
  { id: 'logo_reveal', label: 'Logo Reveal', checked: false, notes: '' },
  { id: 'studio_intro', label: 'Studio Intro', checked: false, notes: '' },
  { id: 'opening_cinematic', label: 'Opening Cinematic', checked: false, notes: '' },
  { id: 'main_menu', label: 'Main Menu', checked: false, notes: '' },
  { id: 'player_profile', label: 'Player Profile', checked: false, notes: '' },
  { id: 'mentor_intro', label: 'Mentor Introduction', checked: false, notes: '' },
  { id: 'js_kingdom', label: 'JavaScript Kingdom', checked: false, notes: '' },
  { id: 'mission_brief', label: 'Mission Brief', checked: false, notes: '' },
  { id: 'diagnostics', label: 'Diagnostics Dashboard', checked: false, notes: '' },
  { id: 'console_clean', label: 'Console Clean', checked: false, notes: '' },
  { id: 'performance', label: 'Performance Verified', checked: false, notes: '' },
];

const generateId = () => Math.random().toString(36).substring(2, 9);
const getTimestamp = () => new Date().toLocaleTimeString();

export const useQAStore = create<QAStoreState>((set, get) => ({
  isVisible: false,
  milestone: 'Milestone 2',
  checklist: INITIAL_CHECKLIST,
  bugs: [],
  startTime: new Date().toISOString(),

  toggleVisibility: () => set((state) => ({ isVisible: !state.isVisible })),
  
  toggleChecklistItem: (id) => set((state) => ({
    checklist: state.checklist.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    )
  })),

  updateItemNotes: (id, notes) => set((state) => ({
    checklist: state.checklist.map(item => 
      item.id === id ? { ...item, notes } : item
    )
  })),

  addBug: (screen, severity, description) => set((state) => {
    const newBug: QABug = {
      id: generateId(),
      time: getTimestamp(),
      screen,
      severity,
      description,
      status: 'Open'
    };
    return { bugs: [newBug, ...state.bugs] };
  }),

  resolveBug: (id) => set((state) => ({
    bugs: state.bugs.map(bug => 
      bug.id === id ? { ...bug, status: 'Resolved' } : bug
    )
  })),

  exportSession: () => {
    const state = get();
    const data = {
      milestone: state.milestone,
      startTime: state.startTime,
      exportTime: new Date().toISOString(),
      completed: state.checklist.filter(i => i.checked).length,
      total: state.checklist.length,
      checklist: state.checklist,
      bugs: state.bugs
    };
    return JSON.stringify(data, null, 2);
  }
}));
