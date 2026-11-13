import { EventBus } from './event-bus';

export interface BaseEngine {
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
        try {
          this.engines.get(name)!.init();
          EventBus.emit('ENGINE_INITIALIZED', { engine: name });
        } catch (error) {
          console.error(`Error initializing ${name}:`, error);
          EventBus.emit('ENGINE_ERROR', { engine: name, error });
        }
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
