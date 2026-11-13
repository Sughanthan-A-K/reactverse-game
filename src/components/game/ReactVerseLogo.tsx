'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/useGameStore';

export function ReactVerseLogo() {
  const { setGameState } = useGameStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setGameState('STUDIO');
    }, 4000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex items-center justify-center h-full w-full bg-black">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
        className="flex flex-col items-center"
      >
        <div className="relative">
          {/* React Atom Symbol Abstraction */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-48 h-48 border border-blue-500/30 rounded-full flex items-center justify-center absolute -top-12 -left-4"
            style={{ borderRadius: '50% 50% 50% 50% / 30% 30% 70% 70%' }}
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="w-48 h-48 border border-purple-500/30 rounded-full flex items-center justify-center absolute -top-12 -left-4"
            style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }}
          />
          
          <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 tracking-tighter drop-shadow-2xl z-10 relative">
            ReactVerse
          </h1>
        </div>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-gray-400 tracking-[0.3em] uppercase text-sm mt-4"
        >
          Rise of the Frontend Guardian
        </motion.p>
      </motion.div>
    </div>
  );
}
