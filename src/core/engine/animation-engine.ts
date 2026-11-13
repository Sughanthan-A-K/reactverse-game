import { BaseEngine, EngineRegistry } from './engine-registry';
import { EventBus } from './event-bus';

class AnimationEngine implements BaseEngine {
  init(): void {
    console.log('[AnimationEngine] Initialized');
  }

  shutdown(): void {
    console.log('[AnimationEngine] Shut down');
  }
}

export const instance = new AnimationEngine();
EngineRegistry.register('AnimationEngine', instance);
