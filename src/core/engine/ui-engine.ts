import { BaseEngine, EngineRegistry } from './engine-registry';
import { EventBus } from './event-bus';

class UiEngine implements BaseEngine {
  init(): void {
    console.log('[UiEngine] Initialized');
  }

  shutdown(): void {
    console.log('[UiEngine] Shut down');
  }
}

export const instance = new UiEngine();
EngineRegistry.register('UiEngine', instance);
