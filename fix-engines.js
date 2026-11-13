const fs = require('fs');
const engines = [
  'game-engine', 'director-engine', 'story-engine', 'world-engine',
  'gameplay-engine', 'knowledge-engine', 'save-engine', 'achievement-engine',
  'audio-engine', 'animation-engine', 'ui-engine', 'input-engine'
];

for (const engine of engines) {
  const parts = engine.split('-');
  const className = parts.map(p => p[0].toUpperCase() + p.slice(1)).join('');
  const code = `import { BaseEngine, EngineRegistry } from './engine-registry';
import { EventBus } from './event-bus';

class ${className} implements BaseEngine {
  init(): void {
    console.log('[${className}] Initialized');
  }

  shutdown(): void {
    console.log('[${className}] Shut down');
  }
}

export const instance = new ${className}();
EngineRegistry.register('${className}', instance);
`;
  fs.writeFileSync('src/core/engine/' + engine + '.ts', code);
}

const registryCode = `export interface BaseEngine {
  init(): void;
  update?(deltaTime: number): void;
  shutdown(): void;
}

class EngineRegistryClass {
  private engines: Map<string, BaseEngine> = new Map();

  register(name: string, engine: BaseEngine): void {
    if (this.engines.has(name)) {
      console.warn('Engine ' + name + ' is already registered.');
      return;
    }
    this.engines.set(name, engine);
    console.log('Registered ' + name);
  }

  get<T extends BaseEngine>(name: string): T {
    const engine = this.engines.get(name);
    if (!engine) {
      throw new Error('Engine ' + name + ' not found!');
    }
    return engine as T;
  }

  initAll(): void {
    const order = [
      'GameEngine', 'SaveEngine', 'InputEngine', 'AudioEngine',
      'KnowledgeEngine', 'AchievementEngine', 'StoryEngine',
      'WorldEngine', 'UIEngine', 'AnimationEngine',
      'DirectorEngine', 'GameplayEngine'
    ];

    for (const name of order) {
      if (this.engines.has(name)) {
        console.log('Initializing ' + name + '...');
        this.engines.get(name)!.init();
      }
    }
  }

  shutdownAll(): void {
    this.engines.forEach((engine, name) => {
      console.log('Shutting down ' + name + '...');
      engine.shutdown();
    });
  }
}

export const EngineRegistry = new EngineRegistryClass();
`;
fs.writeFileSync('src/core/engine/engine-registry.ts', registryCode);

const eventBusCode = `export type EventName = 
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
  | 'GAME_PAUSED';

export interface EventPayload {
  [key: string]: any;
}

type EventHandler = (payload?: EventPayload) => void;

class EventBusClass {
  private listeners: Map<EventName, EventHandler[]> = new Map();

  on(event: EventName, handler: EventHandler): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(handler);
  }

  off(event: EventName, handler: EventHandler): void {
    if (!this.listeners.has(event)) return;
    const handlers = this.listeners.get(event)!.filter(h => h !== handler);
    this.listeners.set(event, handlers);
  }

  emit(event: EventName, payload?: EventPayload): void {
    console.log('Emitting ' + event, payload);
    if (!this.listeners.has(event)) return;
    this.listeners.get(event)!.forEach(handler => handler(payload));
  }
}

export const EventBus = new EventBusClass();
`;
fs.writeFileSync('src/core/engine/event-bus.ts', eventBusCode);
