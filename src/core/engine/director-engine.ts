import { BaseEngine, EngineRegistry } from './engine-registry';
import { EventBus } from './event-bus';
import { useDirectorStore } from '@/store/useDirectorStore';
import { DirectorTimeline, DirectorAction } from '@/shared/types/director';

class DirectorEngine implements BaseEngine {
  private currentTimeline: DirectorTimeline = [];
  private currentIndex: number = -1;
  private isPlaying: boolean = false;
  private waitTimeout: ReturnType<typeof setTimeout> | null = null;

  init(): void {
    console.log('[DirectorEngine] Initialized');
    
    EventBus.on('DIALOGUE_COMPLETED', () => {
      this.advance();
    });

    EventBus.on('ANIMATION_COMPLETED', () => {
      const action = this.currentAction();
      if (action?.type === 'animation' && !action.duration) {
        this.advance();
      }
    });

    EventBus.on('GAMEPLAY_COMPLETED', () => {
      const action = this.currentAction();
      if (action?.type === 'gameplay') {
        this.advance();
      }
    });
  }

  shutdown(): void {
    console.log('[DirectorEngine] Shut down');
    if (this.waitTimeout) clearTimeout(this.waitTimeout);
  }

  playScene(sceneId: string, timeline: DirectorTimeline): void {
    console.log(`[DirectorEngine] Playing scene: ${sceneId}`);
    this.currentTimeline = timeline;
    this.currentIndex = -1;
    this.isPlaying = true;
    
    useDirectorStore.getState().startTimeline(sceneId, timeline);
    EventBus.emit('SCENE_STARTED', { scene: sceneId });
    
    this.advance();
  }

  private currentAction(): DirectorAction | null {
    if (this.currentIndex >= 0 && this.currentIndex < this.currentTimeline.length) {
      return this.currentTimeline[this.currentIndex];
    }
    return null;
  }

  private advance(): void {
    if (!this.isPlaying) return;
    if (this.waitTimeout) {
      clearTimeout(this.waitTimeout);
      this.waitTimeout = null;
    }

    this.currentIndex++;

    if (this.currentIndex >= this.currentTimeline.length) {
      this.finishScene();
      return;
    }

    const action = this.currentAction();
    if (!action) return;

    useDirectorStore.getState().setAction(action, this.currentIndex);

    // Execute logic based on action type
    switch (action.type) {
      case 'dialogue':
        EventBus.emit('TRIGGER_DIALOGUE', { speaker: action.speaker, text: action.text });
        if (action.duration) {
          this.waitTimeout = setTimeout(() => this.advance(), action.duration);
        } else if (action.requireInteraction === false) {
           this.advance(); // immediately next if no interaction required and no duration
        }
        // Otherwise waits for DIALOGUE_COMPLETED event
        break;

      case 'camera':
        EventBus.emit('TRIGGER_ANIMATION', { target: 'camera', action: action.action });
        if (action.duration) {
          this.waitTimeout = setTimeout(() => this.advance(), action.duration);
        } else {
          this.advance(); // immediate
        }
        break;

      case 'animation':
        EventBus.emit('TRIGGER_ANIMATION', { target: action.target, preset: action.preset });
        if (action.duration) {
          this.waitTimeout = setTimeout(() => this.advance(), action.duration);
        } // else waits for ANIMATION_COMPLETED
        break;

      case 'effect':
        if (action.duration) {
          this.waitTimeout = setTimeout(() => this.advance(), action.duration);
        } else {
          this.advance();
        }
        break;

      case 'wait':
        this.waitTimeout = setTimeout(() => this.advance(), action.duration);
        break;

      case 'event':
        EventBus.emit(action.eventName as any, action.payload);
        if (action.duration) {
          this.waitTimeout = setTimeout(() => this.advance(), action.duration);
        } else {
          this.advance();
        }
        break;

      case 'gameplay':
        EventBus.emit('START_GAMEPLAY', { puzzleId: (action as any).puzzleId });
        break;

      case 'transition':
        // Transition usually ends the current timeline and hands off to WorldEngine
        this.finishScene();
        EventBus.emit('WORLD_LOADED', { world: action.to });
        break;
    }
  }

  private finishScene(): void {
    this.isPlaying = false;
    this.currentTimeline = [];
    useDirectorStore.getState().endTimeline();
    EventBus.emit('SCENE_ENDED');
  }
}

export const instance = new DirectorEngine();
EngineRegistry.register('DirectorEngine', instance);
