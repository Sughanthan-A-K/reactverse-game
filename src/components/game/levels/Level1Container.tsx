'use client';

import { useEffect, useState } from 'react';
import { useDirectorStore } from '@/store/useDirectorStore';
import { EngineRegistry } from '@/core/engine/engine-registry';
import { EventBus } from '@/core/engine/event-bus';
import { CinematicView } from '../CinematicView';
import { Level1Timeline } from '@/story/cutscenes/level1';

export function Level1Container() {
  const { currentAction } = useDirectorStore();
  const [activePuzzle, setActivePuzzle] = useState<string | null>(null);

  useEffect(() => {
    const director: any = EngineRegistry.get('DirectorEngine');
    if (director) {
      director.playScene('LEVEL_1', Level1Timeline);
    }

    const onStartGameplay = (payload?: any) => {
      setActivePuzzle(payload?.puzzleId || null);
    };

    EventBus.on('START_GAMEPLAY', onStartGameplay);

    return () => {
      EventBus.off('START_GAMEPLAY', onStartGameplay);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePuzzleComplete = () => {
    setActivePuzzle(null);
    EventBus.emit('GAMEPLAY_COMPLETED');
  };

  return (
    <div className="relative h-full w-full bg-black">
      {/* Underlying gameplay layer */}
      {activePuzzle && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 z-0 bg-gradient-to-br from-blue-900/30 to-purple-900/30 text-white font-mono">
          <div className="bg-black/60 p-8 rounded-xl border border-blue-500/30 shadow-2xl backdrop-blur-md max-w-4xl w-full">
            <h2 className="text-2xl font-bold mb-6 text-blue-400 border-b border-blue-900 pb-2">
              Gameplay Phase: {activePuzzle.replace(/_/g, ' ').toUpperCase()}
            </h2>
            
            {activePuzzle === 'discovery' && (
              <div className="text-center">
                <p className="mb-4">Drag the Crystal of Value and Crystal of Reference to see their behaviors.</p>
                <div className="flex justify-center space-x-8 mb-8">
                  <div className="w-24 h-24 bg-blue-500/50 rounded-full flex items-center justify-center animate-pulse border-2 border-blue-300">Value</div>
                  <div className="w-24 h-24 bg-purple-500/50 rounded-full flex items-center justify-center animate-pulse border-2 border-purple-300">Reference</div>
                </div>
                <button onClick={handlePuzzleComplete} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded font-bold">Discover Secret</button>
              </div>
            )}
            {activePuzzle === 'aha_moment' && (
              <div className="text-center">
                <h3 className="text-xl font-bold text-yellow-400 mb-4 animate-bounce">Aha!</h3>
                <p className="mb-4">You realize the Reference crystal connects to the original.</p>
                <button onClick={handlePuzzleComplete} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded font-bold">Continue</button>
              </div>
            )}
            {activePuzzle === 'explanation_visuals' && (
              <div className="text-center">
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div className="p-4 border border-blue-500 rounded bg-blue-900/20">Primitive (Value)<br/>Independent Copy</div>
                  <div className="p-4 border border-purple-500 rounded bg-purple-900/20">Object (Reference)<br/>Shared Memory Pointer</div>
                </div>
                <button onClick={handlePuzzleComplete} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded font-bold">Understood</button>
              </div>
            )}
            {activePuzzle?.startsWith('challenge_') && (
              <div className="text-center">
                <h3 className="text-xl text-yellow-400 mb-4">Challenge: {activePuzzle.split('_')[1].toUpperCase()}</h3>
                <button onClick={handlePuzzleComplete} className="px-6 py-2 bg-yellow-600 hover:bg-yellow-500 rounded font-bold">Solve Puzzle</button>
              </div>
            )}
            {activePuzzle === 'boss_battle' && (
              <div className="text-center">
                <h3 className="text-3xl text-red-500 font-bold mb-4 animate-pulse">The Mirror Guardian</h3>
                <p className="mb-4 text-red-300">Quick! Use the spread operator to deflect the corrupted reference!</p>
                <button onClick={handlePuzzleComplete} className="px-6 py-2 bg-red-600 hover:bg-red-500 rounded font-bold">Defeat Boss</button>
              </div>
            )}
            {activePuzzle === 'interview' && (
              <div className="text-center">
                <h3 className="text-xl text-green-400 font-bold mb-4">Zoho Interviewer</h3>
                <p className="mb-4 italic">"Why does the spread operator solve the issue?"</p>
                <div className="space-y-2 flex flex-col mb-4">
                  <button onClick={handlePuzzleComplete} className="p-2 border border-green-500 hover:bg-green-900 rounded">Because it creates a shallow copy, breaking the top-level reference.</button>
                </div>
              </div>
            )}
            {activePuzzle === 'mini_project' && (
              <div className="text-center">
                <h3 className="text-xl text-blue-400 font-bold mb-4">Fix the Inventory</h3>
                <pre className="text-left bg-black p-4 rounded text-sm text-gray-300 border border-gray-700 mb-4">
                  {`const player1 = { inventory: ['Sword'] };\n// Fix this:\nconst player2 = { ...player1, inventory: [...player1.inventory] };`}
                </pre>
                <button onClick={handlePuzzleComplete} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded font-bold">Deploy Fix</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cinematic Overlay - higher z-index, but transparent backgrounds pass clicks */}
      {/* We only render CinematicView if it's NOT a pure gameplay block, or we render it always and it just hides if no camera/dialogue */}
      <div className={`absolute inset-0 z-10 pointer-events-none`}>
        <div className="pointer-events-auto h-full w-full">
          <CinematicView sceneId="LEVEL_1" timeline={Level1Timeline} />
        </div>
      </div>
    </div>
  );
}
