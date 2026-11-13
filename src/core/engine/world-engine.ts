import { BaseEngine, EngineRegistry } from './engine-registry';
import { EventBus } from './event-bus';

class WorldEngine implements BaseEngine {
  init(): void {
    console.log('[WorldEngine] Initialized');
  }

  shutdown(): void {
    console.log('[WorldEngine] Shut down');
  }
}

export const instance = new WorldEngine();
EngineRegistry.register('WorldEngine', instance);
