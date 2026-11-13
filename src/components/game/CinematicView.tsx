'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDirectorStore } from '@/store/useDirectorStore';
import { EngineRegistry } from '@/core/engine/engine-registry';
import { EventBus } from '@/core/engine/event-bus';
import { useGameStore } from '@/store/useGameStore';

export function CinematicView({ 
  sceneId, 
  timeline 
}: { 
  sceneId: string, 
  timeline: any[] 
}) {
  const { currentAction, activeDialogue, cameraState } = useDirectorStore();
  const { setGameState } = useGameStore();

  useEffect(() => {
    // Start Director Engine
    const director: any = EngineRegistry.get('DirectorEngine');
    if (director) {
      director.playScene(sceneId, timeline);
    }

    const onMenu = () => setGameState('MAIN_MENU');
    const onJSKingdom = () => setGameState('JS_KINGDOM');
    const onMilestoneComplete = () => setGameState('FADE_OUT');

    EventBus.on('TRANSITION_TO_MENU', onMenu);
    EventBus.on('TRANSITION_TO_JS_KINGDOM', onJSKingdom);
    EventBus.on('MILESTONE_2_COMPLETE', onMilestoneComplete);

    return () => {
      EventBus.off('TRANSITION_TO_MENU', onMenu);
      EventBus.off('TRANSITION_TO_JS_KINGDOM', onJSKingdom);
      EventBus.off('MILESTONE_2_COMPLETE', onMilestoneComplete);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceneId, timeline]);

  const handleDialogueNext = () => {
    if (activeDialogue && activeDialogue.requireInteraction !== false) {
      EventBus.emit('DIALOGUE_COMPLETED');
    }
  };

  // Compute camera CSS classes based on state
  let cameraClasses = "w-full h-full transition-all duration-1000 ease-in-out relative bg-black ";
  if (cameraState.action === 'fade_in') cameraClasses += "opacity-100 scale-100 blur-none";
  else if (cameraState.action === 'fade_out') cameraClasses += "opacity-0 scale-95 blur-md";
  else if (cameraState.action === 'zoom_in') cameraClasses += "opacity-100 scale-110 blur-none";
  else cameraClasses += "opacity-0"; // default initial state before action

  return (
    <div className={cameraClasses} onClick={handleDialogueNext}>
      {/* Background Environment Placeholder */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black z-0">
        {sceneId === 'MENTOR_INTRO' && (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black" />
        )}
      </div>

      {/* Cinematic Bars (Letterbox) */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-black z-10"></div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-black z-10"></div>

      {/* Subtitle / Dialogue Area */}
      <div className="absolute bottom-20 left-0 right-0 flex justify-center z-20">
        <AnimatePresence mode="wait">
          {activeDialogue && (
            <motion.div
              key={activeDialogue.text}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-black/80 border border-gray-700/50 p-6 rounded-lg max-w-3xl w-full mx-4 shadow-2xl backdrop-blur-sm"
            >
              <div className="text-blue-400 font-mono text-sm uppercase mb-2 tracking-widest font-bold">
                {activeDialogue.speaker}
              </div>
              <div className="text-white text-xl md:text-2xl font-light leading-relaxed">
                <Typewriter text={activeDialogue.text} />
              </div>
              {activeDialogue.requireInteraction !== false && (
                <div className="text-right mt-4 text-gray-500 animate-pulse text-sm">
                  Click to continue ▶
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Simple Typewriter component
function Typewriter({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) {
        clearInterval(interval);
      }
    }, 30); // 30ms per character

    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}</span>;
}
