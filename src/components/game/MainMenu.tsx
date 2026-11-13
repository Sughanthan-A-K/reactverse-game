'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/store/useGameStore';

export function MainMenu() {
  const { setGameState } = useGameStore();

  const menuItems = [
    { label: 'New Journey', action: () => setGameState('PROFILE_CREATION') },
    { label: 'Continue', action: () => alert('No save found.'), disabled: true },
    { label: 'Knowledge Vault', action: () => alert('Vault locked.'), disabled: true },
    { label: 'Settings', action: () => {} },
    { label: 'Credits', action: () => {} },
  ];

  return (
    <div className="flex flex-col justify-center h-full w-full bg-black pl-24">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-12">
          ReactVerse
        </h1>
        
        <ul className="space-y-6">
          {menuItems.map((item, idx) => (
            <motion.li 
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
            >
              <button
                onClick={item.action}
                disabled={item.disabled}
                className={`text-2xl font-light tracking-wider uppercase transition-all duration-300 ${
                  item.disabled ? 'text-gray-700 cursor-not-allowed' : 'text-gray-300 hover:text-white hover:translate-x-2'
                }`}
              >
                {item.label}
              </button>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
