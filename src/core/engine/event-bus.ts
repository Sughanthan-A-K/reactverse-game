export type EventName = 
  | 'ON_GAME_START'
  | 'ON_GAME_PAUSE'
  | 'REQUEST_PAUSE'
  | 'FATAL_ERROR'
  | 'SCENE_STARTED'
  | 'SCENE_ENDED'
  | 'TRIGGER_DIALOGUE'
  | 'DIALOGUE_COMPLETED'
  | 'ANIMATION_COMPLETED'
  | 'CHAPTER_UNLOCKED'
  | 'LEVEL_COMPLETED'
  | 'WORLD_LOADED'
  | 'MISSION_COMPLETED'
  | 'MISSION_FAILED'
  | 'BOSS_DEFEATED'
  | 'PLAYER_INPUT_ACTION'
  | 'VAULT_UPDATED'
  | 'CONFIDENCE_CHANGED'
  | 'SAVE_COMPLETED'
  | 'LOAD_COMPLETED'
  | 'CHECKPOINT_REACHED'
  | 'ACHIEVEMENT_UNLOCKED'
  | 'AUDIO_ENDED'
  | 'TRIGGER_AUDIO'
  | 'TRIGGER_ANIMATION'
  | 'UI_INTERACTION'
  | 'GAME_PAUSED'
  | 'ENGINE_INITIALIZED'
  | 'ENGINE_ERROR' | 'TRANSITION_TO_LOGO' | 'TRANSITION_TO_MENU' | 'TRANSITION_TO_JS_KINGDOM' | 'MILESTONE_2_COMPLETE' | 'START_GAMEPLAY' | 'GAMEPLAY_COMPLETED' | 'LEVEL_1_COMPLETE';

export interface EventPayload {
  [key: string]: any;
}

type EventHandler = (payload?: EventPayload) => void;

class EventBusClass {
  private listeners: Map<EventName, EventHandler[]> = new Map();
  // We can track history in the store instead, but EventBus should let observers hook into 'ALL' events if needed.
  private globalListeners: ((event: EventName, payload?: EventPayload) => void)[] = [];

  on(event: EventName, handler: EventHandler): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(handler);
  }

  onAny(handler: (event: EventName, payload?: EventPayload) => void): void {
    this.globalListeners.push(handler);
  }

  off(event: EventName, handler: EventHandler): void {
    if (!this.listeners.has(event)) return;
    const handlers = this.listeners.get(event)!.filter(h => h !== handler);
    this.listeners.set(event, handlers);
  }

  emit(event: EventName, payload?: EventPayload): void {
    console.log('[EventBus] Emitting ' + event, payload);
    
    // Notify specific listeners
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.forEach(handler => handler(payload));
    }
    
    // Notify global listeners
    this.globalListeners.forEach(handler => handler(event, payload));
  }
}

export const EventBus = new EventBusClass();


