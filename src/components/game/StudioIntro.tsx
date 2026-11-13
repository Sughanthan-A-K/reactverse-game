'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/useGameStore';

export function StudioIntro() {
  const { setGameState } = useGameStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setGameState('OPENING_CINEMATIC');
    }, 5000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex items-center justify-center h-full w-full bg-black text-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        exit={{ opacity: 0, transition: { duration: 1 } }}
        className="text-center"
      >
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-xl font-light text-gray-300 tracking-wide mb-2"
        >
          A Frontend Learning Experience
        </motion.p>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 1 }}
          className="text-sm font-mono text-gray-500 tracking-widest uppercase"
        >
          Built for Future Engineers
        </motion.p>
      </motion.div>
    </div>
  );
}
