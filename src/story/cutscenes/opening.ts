import { DirectorTimeline } from '@/shared/types/director';

export const BootSequenceTimeline: DirectorTimeline = [
  // Wait for engines to finish splash sequence (managed by UI initially, but let's assume it transitions to logo)
  { type: 'wait', duration: 2000 },
  { type: 'event', eventName: 'TRANSITION_TO_LOGO' }
];

export const OpeningCinematicTimeline: DirectorTimeline = [
  { type: 'camera', action: 'fade_in', duration: 1000 },
  { type: 'wait', duration: 1000 },
  
  // Year 2145
  { type: 'dialogue', speaker: 'System', text: 'Year 2145.', duration: 2000, requireInteraction: false },
  
  // Bug King
  { type: 'dialogue', speaker: 'System', text: 'The Bug King has infected every software company.', duration: 3000, requireInteraction: false },
  
  // Collapse
  { type: 'dialogue', speaker: 'System', text: 'Entire digital cities are collapsing.', duration: 3000, requireInteraction: false },
  
  // Forgetting
  { type: 'dialogue', speaker: 'System', text: 'Frontend developers are losing their knowledge.', duration: 3000, requireInteraction: false },
  
  // Last Hope
  { type: 'dialogue', speaker: 'System', text: 'You are the final trainee capable of restoring the world.', duration: 3000, requireInteraction: false },
  
  { type: 'camera', action: 'fade_out', duration: 1500 },
  
  // Hand off to Main Menu
  { type: 'event', eventName: 'TRANSITION_TO_MENU' }
];

export const MentorIntroTimeline: DirectorTimeline = [
  { type: 'camera', action: 'fade_in', duration: 1000 },
  
  { type: 'dialogue', speaker: 'Mentor', text: 'Ah, you have finally arrived.', requireInteraction: true },
  { type: 'dialogue', speaker: 'Mentor', text: 'I am the Architect. But you may simply call me Mentor.', requireInteraction: true },
  { type: 'dialogue', speaker: 'Mentor', text: 'The Bug King has shattered our foundations. Our memory is leaking, our states are corrupted.', requireInteraction: true },
  { type: 'dialogue', speaker: 'Mentor', text: 'Before you can heal the ReactVerse, you must first understand the ancient language it was built upon.', requireInteraction: true },
  
  { type: 'camera', action: 'zoom_in', duration: 1000 },
  { type: 'dialogue', speaker: 'Mentor', text: 'Let us step into the JavaScript Kingdom.', requireInteraction: true },
  
  { type: 'camera', action: 'fade_out', duration: 1500 },
  
  // Hand off to JS Kingdom
  { type: 'event', eventName: 'TRANSITION_TO_JS_KINGDOM' }
];

export const MissionBriefTimeline: DirectorTimeline = [
  { type: 'wait', duration: 2000 },
  { type: 'camera', action: 'fade_in', duration: 1000 },
  
  { type: 'dialogue', speaker: 'System', text: 'Mission 1: The Memory Crystals', duration: 3000, requireInteraction: false },
  { type: 'dialogue', speaker: 'System', text: 'Status: READY', duration: 2000, requireInteraction: false },
  
  { type: 'camera', action: 'fade_out', duration: 2000 },
  
  { type: 'event', eventName: 'MILESTONE_2_COMPLETE' }
];
