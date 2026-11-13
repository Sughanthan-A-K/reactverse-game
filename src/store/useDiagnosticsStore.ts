import { create } from 'zustand';
import { EventName, EventPayload } from '../core/engine/event-bus';

export type EngineStatus = 'Initializing' | 'Ready' | 'Error';
export type EventSeverity = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';

export interface DiagnosticsEvent {
  id: string;
  timestamp: string;
  name: EventName;
  payload?: EventPayload;
  severity: EventSeverity;
  sourceEngine?: string;
}

export interface EngineDetails {
  status: EngineStatus;
  initTimestamp?: string;
  dependencies: string[];
  lastEmittedEvent?: EventName;
  lastReceivedEvent?: EventName;
  currentState?: string;
  version: string;
}

export interface DiagnosticsState {
  isVisible: boolean;
  engines: Record<string, EngineDetails>;
  events: DiagnosticsEvent[];
  currentScene: string;
  loadedWorld: string;
  bootstrapComplete: boolean;
  fps: number;
  memory: number;
  eventStats: {
    total: number;
    errors: number;
    warnings: number;
  };
  expandedEngine: string | null;

  toggleVisibility: () => void;
  setEngineStatus: (engine: string, status: EngineStatus) => void;
  addEvent: (name: EventName, payload?: EventPayload, severity?: EventSeverity, sourceEngine?: string) => void;
  setBootstrapComplete: (complete: boolean) => void;
  setCurrentScene: (scene: string) => void;
  setLoadedWorld: (world: string) => void;
  setExpandedEngine: (engine: string | null) => void;
  updateEngineEventCache: (engine: string, eventName: EventName, type: 'emitted' | 'received') => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);
const getTimestamp = () => new Date().toLocaleTimeString();

const createInitialEngine = (): EngineDetails => ({
  status: 'Initializing',
  dependencies: [],
  version: '0.1.0-alpha',
});

const INITIAL_ENGINES: Record<string, EngineDetails> = {
  GameEngine: createInitialEngine(),
  SaveEngine: createInitialEngine(),
  InputEngine: createInitialEngine(),
  AudioEngine: createInitialEngine(),
  KnowledgeEngine: createInitialEngine(),
  AchievementEngine: createInitialEngine(),
  StoryEngine: createInitialEngine(),
  WorldEngine: createInitialEngine(),
  UIEngine: createInitialEngine(),
  AnimationEngine: createInitialEngine(),
  DirectorEngine: createInitialEngine(),
  GameplayEngine: createInitialEngine(),
};

export const useDiagnosticsStore = create<DiagnosticsState>((set) => ({
  isVisible: false,
  engines: { ...INITIAL_ENGINES },
  events: [],
  currentScene: 'Boot',
  loadedWorld: 'None',
  bootstrapComplete: false,
  fps: 60,
  memory: 120,
  eventStats: { total: 0, errors: 0, warnings: 0 },
  expandedEngine: null,

  toggleVisibility: () => set((state) => ({ isVisible: !state.isVisible })),
  
  setExpandedEngine: (engine) => set({ expandedEngine: engine }),

  setEngineStatus: (engine, status) => set((state) => {
    const details = state.engines[engine] ? { ...state.engines[engine] } : createInitialEngine();
    details.status = status;
    if (status === 'Ready' && !details.initTimestamp) {
      details.initTimestamp = getTimestamp();
    }
    return {
      engines: { ...state.engines, [engine]: details }
    };
  }),

  updateEngineEventCache: (engine, eventName, type) => set((state) => {
    if (!state.engines[engine]) return state;
    const details = { ...state.engines[engine] };
    if (type === 'emitted') details.lastEmittedEvent = eventName;
    else details.lastReceivedEvent = eventName;
    return { engines: { ...state.engines, [engine]: details } };
  }),

  addEvent: (name, payload, severity = 'INFO', sourceEngine) => set((state) => {
    const newEvent: DiagnosticsEvent = {
      id: generateId(),
      timestamp: getTimestamp(),
      name,
      payload,
      severity,
      sourceEngine
    };
    
    // Retain last 100 events
    const updatedEvents = [newEvent, ...state.events].slice(0, 100);
    
    return { 
      events: updatedEvents,
      eventStats: {
        total: state.eventStats.total + 1,
        errors: state.eventStats.errors + (severity === 'ERROR' ? 1 : 0),
        warnings: state.eventStats.warnings + (severity === 'WARNING' ? 1 : 0),
      }
    };
  }),

  setBootstrapComplete: (complete) => set({ bootstrapComplete: complete }),
  setCurrentScene: (scene) => set({ currentScene: scene }),
  setLoadedWorld: (world) => set({ loadedWorld: world })
}));
