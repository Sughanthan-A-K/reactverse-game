import { create } from 'zustand';
import { DirectorAction, DialogueAction } from '../shared/types/director';

export interface DirectorState {
  isPlaying: boolean;
  currentTimelineId: string | null;
  currentActionIndex: number;
  currentAction: DirectorAction | null;
  activeDialogue: DialogueAction | null;
  cameraState: {
    action: string | null;
    target: string | null;
  };
  
  startTimeline: (id: string, timeline: DirectorAction[]) => void;
  nextAction: () => void;
  setAction: (action: DirectorAction, index: number) => void;
  endTimeline: () => void;
}

export const useDirectorStore = create<DirectorState>((set, get) => ({
  isPlaying: false,
  currentTimelineId: null,
  currentActionIndex: -1,
  currentAction: null,
  activeDialogue: null,
  cameraState: { action: null, target: null },

  startTimeline: (id, timeline) => {
    set({
      isPlaying: true,
      currentTimelineId: id,
      currentActionIndex: -1,
      currentAction: null,
      activeDialogue: null,
    });
  },

  nextAction: () => {
    // Engine will call this or we handle it via event
  },

  setAction: (action, index) => {
    set((state) => {
      const updates: Partial<DirectorState> = {
        currentAction: action,
        currentActionIndex: index,
      };

      if (action.type === 'dialogue') {
        updates.activeDialogue = action as DialogueAction;
      } else if (action.type === 'camera') {
        updates.cameraState = {
          action: action.action,
          target: (action as any).target || null,
        };
      }

      // If previous action was dialogue and this one is not, clear it? 
      // Actually we let the engine decide or the next action overwrites.
      if (action.type !== 'dialogue' && state.activeDialogue) {
        updates.activeDialogue = null;
      }

      return updates;
    });
  },

  endTimeline: () => {
    set({
      isPlaying: false,
      currentTimelineId: null,
      currentActionIndex: -1,
      currentAction: null,
      activeDialogue: null,
    });
  }
}));
