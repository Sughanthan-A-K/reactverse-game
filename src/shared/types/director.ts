export type ActionType = 'camera' | 'dialogue' | 'animation' | 'effect' | 'transition' | 'wait' | 'event' | 'gameplay';

export interface BaseDirectorAction {
  type: ActionType;
  id?: string;
  duration?: number; // ms to wait before moving to next automatically (if applicable)
}

export interface CameraAction extends BaseDirectorAction {
  type: 'camera';
  action: 'fade_in' | 'fade_out' | 'zoom_in' | 'zoom_out' | 'pan';
  target?: string;
}

export interface DialogueAction extends BaseDirectorAction {
  type: 'dialogue';
  speaker: string;
  text: string;
  requireInteraction?: boolean; // Default true, requires player to press next
}

export interface AnimationAction extends BaseDirectorAction {
  type: 'animation';
  target: string;
  preset: string;
}

export interface EffectAction extends BaseDirectorAction {
  type: 'effect';
  action: string;
}

export interface TransitionAction extends BaseDirectorAction {
  type: 'transition';
  to: string; // scene id
}

export interface WaitAction extends BaseDirectorAction {
  type: 'wait';
  duration: number; // Mandatory
}

export interface EventAction extends BaseDirectorAction {
  type: 'event';
  eventName: string;
  payload?: any;
}

export interface GameplayAction extends BaseDirectorAction {
  type: 'gameplay';
  puzzleId: string;
}

export type DirectorAction =
  | CameraAction
  | DialogueAction
  | AnimationAction
  | EffectAction
  | TransitionAction
  | WaitAction
  | EventAction
  | GameplayAction;

export type DirectorTimeline = DirectorAction[];
