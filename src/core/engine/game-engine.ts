import { BaseEngine, EngineRegistry } from './engine-registry';
import { EventBus } from './event-bus';

class GameEngine implements BaseEngine {
  init(): void {
    console.log('[GameEngine] Initialized');
  }

  shutdown(): void {
    console.log('[GameEngine] Shut down');
  }
}

export const instance = new GameEngine();
EngineRegistry.register('GameEngine', instance);
