import React, { useState, useEffect } from 'react';
import { GameSettings } from '../types/game';

interface ControlsProps {
  clearedPercentage: number;
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
  isCalculatingPotential: boolean;
}

export const Controls: React.FC<ControlsProps> = ({ 
  clearedPercentage, 
  settings, 
  onSettingsChange,
  isCalculatingPotential 
}) => {
  const [dots, setDots] = useState('');

  // Animation for loading dots
  useEffect(() => {
    if (!isCalculatingPotential) return;
    
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isCalculatingPotential]);

  return (
    <div className="flex flex-col gap-4">
      <div className="text-4xl font-bold">
        Grid Cleared: {clearedPercentage}%
      </div>
      <div className="bg-white/90 p-4 rounded-lg shadow-md">
        <details open>
          <summary className="text-xl font-bold mb-4 cursor-pointer">Controls</summary>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 text-sm">
              <h3 className="font-semibold">Movement</h3>
              <p>↑ ↓ ← → Arrow keys to move</p>
              <p>Hold Shift + arrows to move faster</p>
              <p>Press '[' or ']' to adjust Magnifier size</p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold">Display Options</h3>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.showMagnifier}
                    onChange={(e) => onSettingsChange({
                      ...settings,
                      showMagnifier: e.target.checked
                    })}
                    className="w-4 h-4"
                  />
                  <span>Show Magnifier (M)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.showHighlighting}
                    onChange={(e) => onSettingsChange({
                      ...settings,
                      showHighlighting: e.target.checked
                    })}
                    className="w-4 h-4"
                  />
                  <span>Show Sequence Highlighting (H)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.showPotential}
                    onChange={(e) => onSettingsChange({
                      ...settings,
                      showPotential: e.target.checked
                    })}
                    className="w-4 h-4"
                  />
                  <span>Show Next Move Potential (C)</span>
                  <span className="text-xs text-gray-500 italic">experimental feature</span>
                </label>
              </div>
            </div>
          </div>
        </details>
      </div>
      {isCalculatingPotential && (
        <div className="text-left font-mono">
          Calculating next move potential{dots}
        </div>
      )}
    </div>
  );
}; 