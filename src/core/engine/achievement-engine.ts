import { BaseEngine, EngineRegistry } from './engine-registry';
import { EventBus } from './event-bus';

class AchievementEngine implements BaseEngine {
  init(): void {
    console.log('[AchievementEngine] Initialized');
  }

  shutdown(): void {
    console.log('[AchievementEngine] Shut down');
  }
}

export const instance = new AchievementEngine();
EngineRegistry.register('AchievementEngine', instance);
