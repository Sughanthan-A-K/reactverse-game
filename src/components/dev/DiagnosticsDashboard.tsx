'use client';

import { useEffect, useState } from 'react';
import { useDiagnosticsStore, EventSeverity } from '@/store/useDiagnosticsStore';
import { EventBus } from '@/core/engine/event-bus';

export function DiagnosticsDashboard() {
  const {
    isVisible,
    toggleVisibility,
    engines,
    events,
    bootstrapComplete,
    currentScene,
    loadedWorld,
    fps,
    memory,
    eventStats,
    expandedEngine,
    setEngineStatus,
    addEvent,
    setBootstrapComplete,
    setCurrentScene,
    setLoadedWorld,
    setExpandedEngine,
    updateEngineEventCache
  } = useDiagnosticsStore();

  const [eventFilter, setEventFilter] = useState<'ALL' | EventSeverity>('ALL');

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd') {
        toggleVisibility();
      }
    };

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('debug') === 'true') {
      if (!isVisible) toggleVisibility();
    }

    window.addEventListener('keydown', handleKeyDown);

    EventBus.onAny((event, payload) => {
      let severity: EventSeverity = 'INFO';
      let sourceEngine = payload?.sourceEngine || payload?.engine;
      
      if (event === 'FATAL_ERROR' || event === 'ENGINE_ERROR') {
        severity = 'ERROR';
      } else if (event === 'ON_GAME_START' || event === 'ENGINE_INITIALIZED') {
        severity = 'SUCCESS';
      }

      addEvent(event, payload, severity, sourceEngine);

      if (sourceEngine) {
        updateEngineEventCache(sourceEngine, event, 'emitted');
      }

      if (event === 'ENGINE_INITIALIZED' && payload?.engine) {
        setEngineStatus(payload.engine, 'Ready');
      }
      if (event === 'ENGINE_ERROR' && payload?.engine) {
        setEngineStatus(payload.engine, 'Error');
      }
      if (event === 'ON_GAME_START') {
        setBootstrapComplete(true);
      }
      if (event === 'WORLD_LOADED' && payload?.world) {
        setLoadedWorld(payload.world);
      }
      if (event === 'SCENE_STARTED' && payload?.scene) {
        setCurrentScene(payload.scene);
      }
    });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (process.env.NODE_ENV !== 'development' || !isVisible) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ready': return 'text-green-400';
      case 'Error': return 'text-red-500';
      default: return 'text-yellow-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Ready': return '🟢';
      case 'Error': return '🔴';
      default: return '🟡';
    }
  };

  const getSeverityColor = (severity: EventSeverity) => {
    switch (severity) {
      case 'SUCCESS': return 'text-green-400';
      case 'WARNING': return 'text-yellow-400';
      case 'ERROR': return 'text-red-500 bg-red-900/30';
      default: return 'text-blue-300';
    }
  };

  const engineOrder = [
    'GameEngine', 'SaveEngine', 'InputEngine', 'AudioEngine',
    'KnowledgeEngine', 'AchievementEngine', 'StoryEngine',
    'WorldEngine', 'UIEngine', 'AnimationEngine',
    'DirectorEngine', 'GameplayEngine'
  ];

  const filteredEvents = events.filter(e => eventFilter === 'ALL' || e.severity === eventFilter);

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-gray-950 text-green-400 font-mono text-xs z-[9999] p-4 overflow-y-auto border-l border-green-700 shadow-[0_0_50px_rgba(0,255,0,0.1)] flex flex-col">
      <h2 className="text-xl font-bold text-center mb-4 text-green-300 border-b border-green-700 pb-2 flex justify-between items-center">
        <span>ReactVerse Diagnostics</span>
        <button onClick={toggleVisibility} className="text-gray-500 hover:text-green-300 text-sm">✕</button>
      </h2>
      
      {/* Event Statistics */}
      <div className="grid grid-cols-4 gap-2 mb-4 text-center border-b border-green-800 pb-4">
        <div className="bg-gray-900 p-1 rounded">
          <div className="text-gray-500 text-[10px]">TOTAL</div>
          <div className="font-bold">{eventStats.total}</div>
        </div>
        <div className="bg-gray-900 p-1 rounded">
          <div className="text-gray-500 text-[10px]">ENGINES</div>
          <div className="font-bold">{Object.keys(engines).length}</div>
        </div>
        <div className="bg-red-900/20 p-1 rounded">
          <div className="text-red-500 text-[10px]">ERRORS</div>
          <div className="font-bold text-red-400">{eventStats.errors}</div>
        </div>
        <div className="bg-yellow-900/20 p-1 rounded">
          <div className="text-yellow-500 text-[10px]">WARNS</div>
          <div className="font-bold text-yellow-400">{eventStats.warnings}</div>
        </div>
      </div>

      {/* Engine Status / Inspector */}
      <div className="mb-6 flex-shrink-0">
        <h3 className="text-sm font-semibold uppercase text-green-200 mb-2">Engine Inspector</h3>
        <div className="space-y-1">
          {Object.entries(engines).map(([name, details]) => (
            <div key={name} className="border border-green-900/50 rounded overflow-hidden">
              <button 
                onClick={() => setExpandedEngine(expandedEngine === name ? null : name)}
                className="w-full flex items-center justify-between p-1 hover:bg-green-900/20 bg-black transition-colors"
              >
                <div className={`flex items-center space-x-2 ${getStatusColor(details.status)}`}>
                  <span>{getStatusIcon(details.status)}</span>
                  <span className="truncate">{name}</span>
                </div>
                <span className="text-gray-600">{expandedEngine === name ? '▼' : '▶'}</span>
              </button>
              
              {expandedEngine === name && (
                <div className="p-2 bg-gray-900 text-[10px] space-y-1 border-t border-green-900/50">
                  <div className="flex justify-between"><span className="text-gray-500">Status:</span> <span className={getStatusColor(details.status)}>{details.status}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Init Time:</span> <span>{details.initTimestamp || 'N/A'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Version:</span> <span>{details.version}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Last Emitted:</span> <span className="text-blue-300">{details.lastEmittedEvent || 'None'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Last Received:</span> <span className="text-blue-300">{details.lastReceivedEvent || 'None'}</span></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bootstrap Status */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold uppercase text-green-200 mb-2">Bootstrap Sequence</h3>
        <div className="flex flex-wrap gap-1 text-[10px] opacity-75">
          {engineOrder.map((eng, idx) => (
            <span key={eng} className={engines[eng]?.status === 'Ready' ? 'text-green-400' : 'text-gray-600'}>
              {eng.replace('Engine', '')} {idx < engineOrder.length - 1 ? '→' : ''}
            </span>
          ))}
        </div>
      </div>

      {/* State Overview */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-[10px] font-semibold uppercase text-green-200 mb-1">Active Scene</h3>
          <div className="bg-black p-1 rounded text-center border border-green-800 truncate">{currentScene}</div>
        </div>
        <div>
          <h3 className="text-[10px] font-semibold uppercase text-green-200 mb-1">Active World</h3>
          <div className="bg-black p-1 rounded text-center border border-green-800 truncate">{loadedWorld}</div>
        </div>
      </div>

      {/* Event Logger */}
      <div className="flex-1 flex flex-col min-h-[200px]">
        <div className="flex justify-between items-end mb-2">
          <h3 className="text-sm font-semibold uppercase text-green-200">Event Logger</h3>
          <div className="flex gap-1">
            {['ALL', 'INFO', 'WARNING', 'ERROR'].map((filter) => (
              <button 
                key={filter}
                onClick={() => setEventFilter(filter as any)}
                className={`px-1.5 py-0.5 rounded text-[9px] ${eventFilter === filter ? 'bg-green-700 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-black p-2 rounded flex-1 overflow-y-auto border border-green-800 space-y-1 scroll-smooth">
          {filteredEvents.length === 0 && <span className="text-gray-600 italic">No events recorded...</span>}
          {filteredEvents.map((ev) => (
            <div key={ev.id} className={`border-l-2 pl-2 py-1 ${getSeverityColor(ev.severity)} ${ev.severity === 'ERROR' ? 'border-red-500' : 'border-green-700'}`}>
              <div className="flex gap-2">
                <span className="text-gray-600">[{ev.timestamp}]</span>
                <span className="font-bold">{ev.name}</span>
              </div>
              {ev.sourceEngine && (
                <div className="text-[9px] text-gray-500">Src: {ev.sourceEngine}</div>
              )}
              {ev.payload && (
                <div className="text-[10px] mt-1 break-words opacity-80">
                  {JSON.stringify(ev.payload)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Future Reserved Panels */}
      <div className="mt-4 grid grid-cols-4 gap-2 opacity-40 text-center">
        <div className="bg-gray-900 rounded p-1">
          <div className="text-[9px] uppercase text-gray-400">FPS</div>
          <div className="text-xs">{fps}</div>
        </div>
        <div className="bg-gray-900 rounded p-1">
          <div className="text-[9px] uppercase text-gray-400">MEM</div>
          <div className="text-xs">{memory}M</div>
        </div>
        <div className="bg-gray-900 rounded p-1">
          <div className="text-[9px] uppercase text-gray-400">NET</div>
          <div className="text-xs">0kb</div>
        </div>
        <div className="bg-gray-900 rounded p-1">
          <div className="text-[9px] uppercase text-gray-400">SAVE</div>
          <div className="text-xs">Idle</div>
        </div>
      </div>
    </div>
  );
}
