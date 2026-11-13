'use client';

import { useEffect, useState } from 'react';
import { useQAStore, BugSeverity } from '@/store/useQAStore';

export function QADashboard() {
  const {
    isVisible,
    toggleVisibility,
    milestone,
    checklist,
    bugs,
    toggleChecklistItem,
    updateItemNotes,
    addBug,
    resolveBug,
    exportSession
  } = useQAStore();

  const [bugScreen, setBugScreen] = useState('');
  const [bugSeverity, setBugSeverity] = useState<BugSeverity>('Medium');
  const [bugDescription, setBugDescription] = useState('');

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'q') {
        toggleVisibility();
      }
    };

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('qa') === 'true') {
      if (!isVisible) toggleVisibility();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (process.env.NODE_ENV !== 'development' || !isVisible) {
    return null;
  }

  const completedCount = checklist.filter(i => i.checked).length;
  const isComplete = completedCount === checklist.length;
  const openBugs = bugs.filter(b => b.status === 'Open').length;

  const handleAddBug = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bugDescription.trim() || !bugScreen.trim()) return;
    addBug(bugScreen, bugSeverity, bugDescription);
    setBugScreen('');
    setBugDescription('');
  };

  const handleExport = () => {
    const json = exportSession();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reactverse-qa-${milestone.replace(' ', '-').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-y-0 left-0 w-[450px] bg-gray-50 text-gray-900 z-[10000] p-4 overflow-y-auto border-r border-gray-300 shadow-2xl flex flex-col font-sans">
      <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-300">
        <div>
          <h2 className="text-xl font-bold text-blue-700">ReactVerse QA</h2>
          <div className="text-sm text-gray-500 font-mono">{milestone}</div>
        </div>
        <button onClick={toggleVisibility} className="text-gray-400 hover:text-red-500 text-lg">✕</button>
      </div>
      
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm font-semibold mb-1">
          <span>Progress</span>
          <span>{completedCount} / {checklist.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${(completedCount / checklist.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Checklist */}
      <div className="mb-8 space-y-3">
        <h3 className="font-bold text-sm uppercase text-gray-500">Checklist</h3>
        {checklist.map(item => (
          <div key={item.id} className={`p-3 rounded border transition-colors ${item.checked ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 shadow-sm'}`}>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={item.checked}
                onChange={() => toggleChecklistItem(item.id)}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className={`font-medium ${item.checked ? 'text-green-800 line-through opacity-70' : 'text-gray-800'}`}>
                {item.label}
              </span>
            </label>
            <div className="mt-2 pl-8">
              <input 
                type="text" 
                placeholder="Developer notes (optional)..."
                value={item.notes}
                onChange={(e) => updateItemNotes(item.id, e.target.value)}
                className="w-full text-xs p-1.5 border border-gray-200 rounded bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Bug Recording */}
      <div className="mb-8 bg-white p-4 rounded border border-red-200 shadow-sm">
        <h3 className="font-bold text-sm uppercase text-red-600 mb-3">Record Bug</h3>
        <form onSubmit={handleAddBug} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] text-gray-500 uppercase">Screen / Context</label>
              <input required type="text" value={bugScreen} onChange={e => setBugScreen(e.target.value)} className="w-full text-sm p-1.5 border rounded" placeholder="e.g. Logo Reveal" />
            </div>
            <div>
              <label className="block text-[10px] text-gray-500 uppercase">Severity</label>
              <select value={bugSeverity} onChange={e => setBugSeverity(e.target.value as BugSeverity)} className="w-full text-sm p-1.5 border rounded">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[10px] text-gray-500 uppercase">Description</label>
            <textarea required value={bugDescription} onChange={e => setBugDescription(e.target.value)} className="w-full text-sm p-1.5 border rounded" rows={2} placeholder="What happened?"></textarea>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-gray-400 italic">Screenshot (Not Implemented Yet)</span>
            <button type="submit" className="bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded text-xs font-bold hover:bg-red-100">
              Log Bug
            </button>
          </div>
        </form>
      </div>

      {/* Bugs List */}
      {bugs.length > 0 && (
        <div className="mb-8 space-y-2">
          <h3 className="font-bold text-sm uppercase text-gray-500">Logged Bugs</h3>
          {bugs.map(bug => (
            <div key={bug.id} className={`p-2 rounded text-xs border ${bug.status === 'Resolved' ? 'bg-gray-100 border-gray-200 opacity-60' : 'bg-red-50 border-red-200'}`}>
              <div className="flex justify-between font-bold mb-1">
                <span>[{bug.severity}] {bug.screen}</span>
                <span className="text-gray-400 font-mono">{bug.time}</span>
              </div>
              <p className="mb-2 text-gray-700">{bug.description}</p>
              {bug.status === 'Open' ? (
                <button onClick={() => resolveBug(bug.id)} className="text-[10px] bg-white border border-gray-300 px-2 py-0.5 rounded shadow-sm hover:bg-gray-50">Mark Resolved</button>
              ) : (
                <span className="text-[10px] text-green-600 font-bold">✓ Resolved</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Test Session Summary */}
      <div className="mt-auto pt-6 border-t border-gray-200">
        <h3 className="font-bold text-sm uppercase text-gray-500 mb-3">Session Summary</h3>
        <div className="bg-gray-100 p-3 rounded space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Status</span>
            {isComplete ? (
              <span className="font-bold text-green-600">READY FOR APPROVAL</span>
            ) : (
              <span className="font-bold text-yellow-600">IN PROGRESS</span>
            )}
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Completed</span>
            <span className="font-mono">{completedCount} / {checklist.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Open Bugs</span>
            <span className={`font-mono ${openBugs > 0 ? 'text-red-500 font-bold' : ''}`}>{openBugs}</span>
          </div>
        </div>
        <button 
          onClick={handleExport}
          className="w-full mt-4 bg-blue-600 text-white py-2 rounded font-bold uppercase tracking-wider hover:bg-blue-700 transition-colors"
        >
          Export QA Report
        </button>
      </div>
    </div>
  );
}
