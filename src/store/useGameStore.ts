import { create } from 'zustand';

export type GameState = 
  | 'BOOT'
  | 'SPLASH'
  | 'LOGO'
  | 'STUDIO'
  | 'OPENING_CINEMATIC'
  | 'MAIN_MENU'
  | 'PROFILE_CREATION'
  | 'MENTOR_INTRO'
  | 'JS_KINGDOM'
  | 'MISSION_BRIEF'
  | 'FADE_OUT';

export interface GameStoreState {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  
  // Player Profile
  playerName: string;
  difficulty: string;
  setPlayerProfile: (name: string, difficulty: string) => void;
}

export const useGameStore = create<GameStoreState>((set) => ({
  gameState: 'BOOT',
  setGameState: (state) => set({ gameState: state }),
  
  playerName: '',
  difficulty: 'Beginner',
  setPlayerProfile: (name, difficulty) => set({ playerName: name, difficulty }),
}));
