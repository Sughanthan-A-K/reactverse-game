import './game-engine';
import './save-engine';
import './input-engine';
import './audio-engine';
import './knowledge-engine';
import './achievement-engine';
import './story-engine';
import './world-engine';
import './ui-engine';
import './animation-engine';
import './director-engine';
import './gameplay-engine';

import { EngineRegistry } from './engine-registry';
import { EventBus } from './event-bus';

export function bootstrapReactVerse() {
  console.log('[Bootstrap] Starting ReactVerse Engine...');
  EngineRegistry.initAll();
  
  // Test Event Bus
  EventBus.on('ON_GAME_START', () => {
    console.log('[Bootstrap] Game Started successfully!');
  });
  
  EventBus.emit('ON_GAME_START');
}
