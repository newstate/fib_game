import { useGameState } from './useGameState';
import { useSelector } from './useSelector';
import { useSequences } from './useSequences';
import { useSettings } from './useSettings';
import { useKeyboardControls } from './useKeyboardControls';

export const useGameLogic = () => {
  const {
    gameState,
    displayTime,
    clearedPercentage,
    setClearedPercentage,
    startGame,
    resetGame,
    updateGrid,
    calculateClearedPercentage
  } = useGameState();

  const { selector, moveSelector } = useSelector();
  const { settings, setSettings } = useSettings();
  
  const { 
    cellBackgrounds,
    isCalculatingPotential,
    getCellBackground
  } = useSequences(gameState.grid, settings.showHighlighting, settings.showPotential);

  useKeyboardControls({
    gameState,
    selector,
    settings,
    moveSelector,
    setSettings,
    startGame,
    resetGame,
    updateGrid,
    setClearedPercentage,
    calculateClearedPercentage
  });

  return {
    grid: gameState.grid,
    selector,
    clearedPercentage,
    settings,
    cellBackgrounds,
    setSettings,
    getCellBackground,
    isCalculatingPotential,
    displayTime,
    isStarted: gameState.isStarted,
    startGame,
    resetGame
  };
}; 