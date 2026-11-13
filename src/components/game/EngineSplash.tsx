'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDiagnosticsStore } from '@/store/useDiagnosticsStore';
import { useGameStore } from '@/store/useGameStore';
import { EventBus } from '@/core/engine/event-bus';

export function EngineSplash() {
  const { engines, bootstrapComplete } = useDiagnosticsStore();
  const { setGameState } = useGameStore();
  
  // To make it cinematic and readable, we artificially stagger the display
  // even if they initialize instantly under the hood.
  const [displayedEngines, setDisplayedEngines] = useState<string[]>([]);
  const [showOnline, setShowOnline] = useState(false);

  const engineNames = [
    'GameEngine', 'StoryEngine', 'KnowledgeEngine', 'DirectorEngine'
  ];

  useEffect(() => {
    let timeoutIds: NodeJS.Timeout[] = [];
    
    // Stagger reveal of engines
    engineNames.forEach((engine, index) => {
      const id = setTimeout(() => {
        setDisplayedEngines(prev => [...prev, engine]);
      }, 500 * (index + 1));
      timeoutIds.push(id);
    });

    const finishId = setTimeout(() => {
      setShowOnline(true);
      
      const transitionId = setTimeout(() => {
        setGameState('LOGO');
      }, 2000);
      timeoutIds.push(transitionId);
      
    }, 500 * (engineNames.length + 1));
    timeoutIds.push(finishId);

    return () => timeoutIds.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-black text-green-400 font-mono">
      <div className="w-96">
        <AnimatePresence>
          {engineNames.map((engine) => (
            displayedEngines.includes(engine) && (
              <motion.div
                key={engine}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between py-2 text-sm md:text-base border-b border-green-900/30"
              >
                <span>Initializing {engine.replace('Engine', ' Engine')}</span>
                <span className="text-green-300">✓</span>
              </motion.div>
            )
          ))}
        </AnimatePresence>
        
        {showOnline && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 text-center text-xl font-bold text-white tracking-widest shadow-green-500/50 drop-shadow-lg"
          >
            ReactVerse Online
          </motion.div>
        )}
      </div>
    </div>
  );
}
