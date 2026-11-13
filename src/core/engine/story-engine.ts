import { BaseEngine, EngineRegistry } from './engine-registry';
import { EventBus } from './event-bus';

class StoryEngine implements BaseEngine {
  init(): void {
    console.log('[StoryEngine] Initialized');
  }

  shutdown(): void {
    console.log('[StoryEngine] Shut down');
  }
}

export const instance = new StoryEngine();
EngineRegistry.register('StoryEngine', instance);
