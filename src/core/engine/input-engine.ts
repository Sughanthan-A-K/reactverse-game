import { BaseEngine, EngineRegistry } from './engine-registry';
import { EventBus } from './event-bus';

class InputEngine implements BaseEngine {
  init(): void {
    console.log('[InputEngine] Initialized');
  }

  shutdown(): void {
    console.log('[InputEngine] Shut down');
  }
}

export const instance = new InputEngine();
EngineRegistry.register('InputEngine', instance);
