import { BaseEngine, EngineRegistry } from './engine-registry';
import { EventBus } from './event-bus';

class SaveEngine implements BaseEngine {
  init(): void {
    console.log('[SaveEngine] Initialized');
  }

  shutdown(): void {
    console.log('[SaveEngine] Shut down');
  }
}

export const instance = new SaveEngine();
EngineRegistry.register('SaveEngine', instance);
