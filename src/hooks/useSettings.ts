import { useState } from 'react';
import { GameSettings } from '../types/game';

export const useSettings = () => {
  const [settings, setSettings] = useState<GameSettings>({
    showMagnifier: true,
    showHighlighting: true,
    showPotential: false,
    magnifierSize: 9,
  });

  return { settings, setSettings };
}; 