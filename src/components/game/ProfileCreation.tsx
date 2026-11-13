'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/useGameStore';
import { EventBus } from '@/core/engine/event-bus';
import { EngineRegistry } from '@/core/engine/engine-registry';

export function ProfileCreation() {
  const { setPlayerProfile, setGameState } = useGameStore();
  const [name, setName] = useState('');
  const [difficulty, setDifficulty] = useState('Beginner');

  const difficulties = ['Beginner', 'Intermediate', 'Advanced', 'Zoho', 'FAANG'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setPlayerProfile(name, difficulty);
    
    // Simulate save via SaveEngine
    try {
      const saveEngine: any = EngineRegistry.get('SaveEngine');
      if (saveEngine) {
        // Save profile logic would go here
        EventBus.emit('SAVE_COMPLETED', { profile: { name, difficulty } });
      }
    } catch (err) {
      console.warn(err);
    }

    setGameState('MENTOR_INTRO');
  };

  return (
    <div className="flex items-center justify-center h-full w-full bg-black">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 border border-gray-800 p-8 rounded-lg max-w-md w-full shadow-2xl shadow-blue-900/20"
      >
        <h2 className="text-3xl font-light text-white mb-6 text-center tracking-widest uppercase">
          Initialization
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-400 text-sm font-mono mb-2">Developer Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black border border-gray-700 rounded px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Enter your name..."
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm font-mono mb-2">Target Difficulty</label>
            <div className="grid grid-cols-2 gap-2">
              {difficulties.map(diff => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setDifficulty(diff)}
                  className={`px-3 py-2 rounded text-sm font-mono transition-colors ${
                    difficulty === diff 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-black border border-gray-700 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-white text-black font-bold uppercase tracking-widest py-3 rounded hover:bg-gray-200 transition-colors mt-8"
          >
            Create Profile
          </button>
        </form>
      </motion.div>
    </div>
  );
}
