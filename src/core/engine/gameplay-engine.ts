import { BaseEngine, EngineRegistry } from './engine-registry';
import { EventBus } from './event-bus';

class GameplayEngine implements BaseEngine {
  init(): void {
    console.log('[GameplayEngine] Initialized');
  }

  shutdown(): void {
    console.log('[GameplayEngine] Shut down');
  }
}

export const instance = new GameplayEngine();
EngineRegistry.register('GameplayEngine', instance);
