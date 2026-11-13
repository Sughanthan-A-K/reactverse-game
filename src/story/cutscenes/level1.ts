import { DirectorTimeline } from '@/shared/types/director';

export const Level1Timeline: DirectorTimeline = [
  // 1. Cinematic Story
  { type: 'camera', action: 'fade_in', duration: 1500 },
  { type: 'dialogue', speaker: 'System', text: 'You enter the Memory Crystal Temple.', requireInteraction: true },
  { type: 'dialogue', speaker: 'System', text: 'Inside are two legendary crystals.', requireInteraction: true },
  { type: 'dialogue', speaker: 'System', text: 'Crystal of Value: Copies itself independently.', requireInteraction: true },
  { type: 'dialogue', speaker: 'System', text: 'Crystal of Reference: Shares its soul. Changing one changes all.', requireInteraction: true },
  { type: 'dialogue', speaker: 'System', text: 'The kingdom is collapsing because developers confuse these powers.', requireInteraction: true },
  
  // 3. Gameplay Discovery
  { type: 'dialogue', speaker: 'System', text: 'Approach the crystals.', duration: 2000, requireInteraction: false },
  { type: 'gameplay', puzzleId: 'discovery' }, // Engine pauses timeline until GAMEPLAY_COMPLETED
  
  // 4. Mentor Hint
  { type: 'camera', action: 'zoom_in', duration: 1000 },
  { type: 'dialogue', speaker: 'Mentor', text: 'Interesting... Did only one crystal change?', requireInteraction: true },
  { type: 'dialogue', speaker: 'Mentor', text: 'What do you think those two crystals are sharing?', requireInteraction: true },
  
  // 5. Aha Moment (Gameplay Resume)
  { type: 'gameplay', puzzleId: 'aha_moment' },
  
  // 6. Concept Explanation
  { type: 'dialogue', speaker: 'System', text: 'You understand.', requireInteraction: true },
  { type: 'dialogue', speaker: 'Mentor', text: 'Primitives are values. They create independent copies.', requireInteraction: true },
  { type: 'dialogue', speaker: 'Mentor', text: 'Objects and Arrays are references. They point to the same memory.', requireInteraction: true },
  { type: 'gameplay', puzzleId: 'explanation_visuals' },
  
  // 7. Challenge
  { type: 'dialogue', speaker: 'Mentor', text: 'Now, prove your understanding.', requireInteraction: true },
  { type: 'gameplay', puzzleId: 'challenge_a' },
  { type: 'gameplay', puzzleId: 'challenge_b' },
  { type: 'gameplay', puzzleId: 'challenge_c' },
  { type: 'gameplay', puzzleId: 'challenge_d' },
  
  // 8. Boss Battle
  { type: 'camera', action: 'fade_out', duration: 1000 },
  { type: 'dialogue', speaker: 'System', text: 'The Mirror Guardian appears.', duration: 2000, requireInteraction: false },
  { type: 'camera', action: 'fade_in', duration: 1000 },
  { type: 'gameplay', puzzleId: 'boss_battle' },
  
  // 9. Interview Simulation
  { type: 'camera', action: 'fade_out', duration: 1000 },
  { type: 'dialogue', speaker: 'System', text: 'An ancient Zoho Interviewer blocks your path.', requireInteraction: true },
  { type: 'camera', action: 'fade_in', duration: 500 },
  { type: 'gameplay', puzzleId: 'interview' },
  
  // 10. Mini Project
  { type: 'dialogue', speaker: 'Mentor', text: 'Theory is useless without practice.', requireInteraction: true },
  { type: 'gameplay', puzzleId: 'mini_project' },
  
  // 11. Mastery Eval & 12. Achievement & 13. Knowledge Vault
  { type: 'event', eventName: 'VAULT_UPDATED', payload: { topic: 'References vs Values' } },
  { type: 'event', eventName: 'ACHIEVEMENT_UNLOCKED', payload: { badge: 'Memory Apprentice' } },
  
  // 14. Continue Story
  { type: 'camera', action: 'fade_out', duration: 1500 },
  { type: 'dialogue', speaker: 'Mentor', text: 'Excellent... You have restored one forgotten law of JavaScript.', requireInteraction: true },
  { type: 'dialogue', speaker: 'Mentor', text: 'Many more remain.', requireInteraction: true },
  { type: 'event', eventName: 'LEVEL_1_COMPLETE' }
];
