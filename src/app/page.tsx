'use client';

import { useEffect } from 'react';
import { EngineRegistry } from '@/core/engine/engine-registry';
import { EventBus } from '@/core/engine/event-bus';
import { useGameStore } from '@/store/useGameStore';
import { MainGameContainer } from '@/components/game/MainGameContainer';
// Need to import engines to ensure they are evaluated and registered
import '@/core/engine/game-engine';
import '@/core/engine/director-engine';
import '@/core/engine/story-engine';
import '@/core/engine/world-engine';
import '@/core/engine/gameplay-engine';
import '@/core/engine/knowledge-engine';
import '@/core/engine/save-engine';
import '@/core/engine/achievement-engine';
import '@/core/engine/audio-engine';
import '@/core/engine/animation-engine';
import '@/core/engine/ui-engine';
import '@/core/engine/input-engine';
import { useDiagnosticsStore } from '@/store/useDiagnosticsStore';

export default function Home() {
  const { setGameState } = useGameStore();
  const { setBootstrapComplete } = useDiagnosticsStore();

  useEffect(() => {
    // Bootstrap ReactVerse Engines
    try {
      EngineRegistry.initAll();
      setBootstrapComplete(true);
      EventBus.emit('ON_GAME_START');
      setGameState('SPLASH');
    } catch (error) {
      console.error('Failed to bootstrap ReactVerse:', error);
      EventBus.emit('FATAL_ERROR', { error });
    }

    return () => {
      EngineRegistry.shutdownAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="h-screen w-screen overflow-hidden bg-black text-white relative">
      <MainGameContainer />
    </main>
  );
}
