import { useEffect, useCallback } from 'react';
import { GameState, GameSettings, Selector } from '../types/game';
import {
  MOVEMENT_KEYS,
  FIBONACCI_KEY,
  MAGNIFIER_KEY,
  HIGHLIGHT_KEY,
  INCREASE_MAGNIFIER_KEY,
  DECREASE_MAGNIFIER_KEY,
  POTENTIAL_KEY,
  GRID_SIZE
} from '../constants/game';
import { analyzeGrid } from '../utils/api';

interface UseKeyboardControlsProps {
  gameState: GameState;
  selector: Selector;
  settings: GameSettings;
  moveSelector: (direction: 'up' | 'down' | 'left' | 'right', amount: number) => void;
  setSettings: React.Dispatch<React.SetStateAction<GameSettings>>;
  startGame: () => void;
  resetGame: () => void;
  updateGrid: (newGrid: number[][]) => void;
  setClearedPercentage: (percentage: number) => void;
  calculateClearedPercentage: (grid: number[][]) => number;
}

export const useKeyboardControls = ({
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
}: UseKeyboardControlsProps) => {
  const handleKeyboardLogic = useCallback(async (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (gameState.isStarted) {
        resetGame();
        return;
      }
      startGame();
      return;
    }

    if (!gameState.isStarted) return;

    if (MOVEMENT_KEYS.includes(e.key)) {
      e.preventDefault();
      const moveAmount = e.shiftKey ? 5 : 1;
      
      switch (e.key) {
        case 'ArrowUp':
          moveSelector('up', moveAmount);
          break;
        case 'ArrowDown':
          moveSelector('down', moveAmount);
          break;
        case 'ArrowLeft':
          moveSelector('left', moveAmount);
          break;
        case 'ArrowRight':
          moveSelector('right', moveAmount);
          break;
      }
    }
    
    if (e.key.toLowerCase() === FIBONACCI_KEY) {
      e.preventDefault();
      const newGrid = gameState.grid.map(row => [...row]);
      
      // Increment row and column, but skip cleared cells
      for (let i = 0; i < GRID_SIZE; i++) {
        if (newGrid[selector.row][i] !== -1) {
          newGrid[selector.row][i]++;
        }
        if (i !== selector.row && newGrid[i][selector.col] !== -1) {
          newGrid[i][selector.col]++;
        }
      }
      
      const sequences = await analyzeGrid(newGrid);
      
      // Sort sequences by descending length
      const sortedSequences = sequences.sort((a, b) => b.length - a.length);
      
      let sequencesCleared = 0;
      
      // Clear 5-length sequences
      sortedSequences.forEach(seq => {
        if (seq.length === 5) {
          if (seq.type === 'row') {
            for (let i = seq.start; i < seq.start + seq.length; i++) {
              newGrid[seq.index][i] = -1;
            }
          } else {
            for (let i = seq.start; i < seq.start + seq.length; i++) {
              newGrid[i][seq.index] = -1;
            }
          }
          sequencesCleared++;
        }
      });
      
      if (sequencesCleared > 0) {
        setClearedPercentage(calculateClearedPercentage(newGrid));
      }
      
      updateGrid(newGrid);
    }

    if (e.key.toLowerCase() === MAGNIFIER_KEY) {
      e.preventDefault();
      setSettings(prev => ({
        ...prev,
        showMagnifier: !prev.showMagnifier
      }));
    }

    if (e.key.toLowerCase() === HIGHLIGHT_KEY) {
      e.preventDefault();
      setSettings(prev => ({
        ...prev,
        showHighlighting: !prev.showHighlighting
      }));
    }

    if (e.key === DECREASE_MAGNIFIER_KEY) {
      e.preventDefault();
      setSettings(prev => ({
        ...prev,
        magnifierSize: Math.max(7, prev.magnifierSize - 2)
      }));
    } else if (e.key === INCREASE_MAGNIFIER_KEY) {
      e.preventDefault();
      setSettings(prev => ({
        ...prev,
        magnifierSize: Math.min(25, prev.magnifierSize + 2)
      }));
    }

    if (e.key.toLowerCase() === POTENTIAL_KEY) {
      e.preventDefault();
      setSettings(prev => ({
        ...prev,
        showPotential: !prev.showPotential
      }));
    }
  }, [
    gameState.isStarted,
    gameState.grid,
    selector,
    settings,
    moveSelector,
    setSettings,
    startGame,
    resetGame,
    updateGrid,
    setClearedPercentage,
    calculateClearedPercentage
  ]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyboardLogic);
    return () => window.removeEventListener('keydown', handleKeyboardLogic);
  }, [handleKeyboardLogic]);
}; 