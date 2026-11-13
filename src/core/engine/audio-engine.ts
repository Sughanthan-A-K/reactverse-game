import { BaseEngine, EngineRegistry } from './engine-registry';
import { EventBus } from './event-bus';

class AudioEngine implements BaseEngine {
  init(): void {
    console.log('[AudioEngine] Initialized');
  }

  shutdown(): void {
    console.log('[AudioEngine] Shut down');
  }
}

export const instance = new AudioEngine();
EngineRegistry.register('AudioEngine', instance);
