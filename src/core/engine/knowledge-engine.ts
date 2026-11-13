import { BaseEngine, EngineRegistry } from './engine-registry';
import { EventBus } from './event-bus';

class KnowledgeEngine implements BaseEngine {
  init(): void {
    console.log('[KnowledgeEngine] Initialized');
  }

  shutdown(): void {
    console.log('[KnowledgeEngine] Shut down');
  }
}

export const instance = new KnowledgeEngine();
EngineRegistry.register('KnowledgeEngine', instance);
