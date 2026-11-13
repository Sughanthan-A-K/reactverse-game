'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { useDiagnosticsStore } from '@/store/useDiagnosticsStore';
import { EngineSplash } from './EngineSplash';
import { ReactVerseLogo } from './ReactVerseLogo';
import { StudioIntro } from './StudioIntro';
import { CinematicView } from './CinematicView';
import { MainMenu } from './MainMenu';
import { ProfileCreation } from './ProfileCreation';
import { Level1Container } from './levels/Level1Container';
import { BootSequenceTimeline, OpeningCinematicTimeline, MentorIntroTimeline, MissionBriefTimeline } from '@/story/cutscenes/opening';

export function MainGameContainer() {
  const { gameState } = useGameStore();
  const { bootstrapComplete } = useDiagnosticsStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !bootstrapComplete) {
    // Before React hydratation or before engines finish their synchronous init
    return <div className="h-full w-full bg-black"></div>;
  }

  const renderState = () => {
    switch (gameState) {
      case 'BOOT':
      case 'SPLASH':
        return <EngineSplash />;
      case 'LOGO':
        return <ReactVerseLogo />;
      case 'STUDIO':
        return <StudioIntro />;
      case 'OPENING_CINEMATIC':
        return <CinematicView sceneId="OPENING" timeline={OpeningCinematicTimeline} />;
      case 'MAIN_MENU':
        return <MainMenu />;
      case 'PROFILE_CREATION':
        return <ProfileCreation />;
      case 'MENTOR_INTRO':
        return <CinematicView sceneId="MENTOR_INTRO" timeline={MentorIntroTimeline} />;
      case 'JS_KINGDOM':
        return <Level1Container />;
      case 'MISSION_BRIEF':
      case 'FADE_OUT':
        return <div className="h-full w-full bg-black transition-opacity duration-2000 opacity-100"></div>;
      default:
        return <div className="h-full w-full bg-black"></div>;
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden bg-black text-white selection:bg-blue-500/30">
      {renderState()}
    </div>
  );
}
