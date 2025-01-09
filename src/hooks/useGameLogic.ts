import { useState, useCallback, useEffect } from 'react';
import { Selector, GameSettings } from '../types/game';
import { analyzeGrid } from '../utils/api';
import {
  GRID_SIZE,
  MOVEMENT_KEYS,
  FIBONACCI_KEY,
  MAGNIFIER_KEY,
  HIGHLIGHT_KEY,
  INCREASE_MAGNIFIER_KEY,
  DECREASE_MAGNIFIER_KEY,
  SEQUENCE_LENGTHS
} from '../constants/game';

export const useGameLogic = () => {
  const [grid, setGrid] = useState(() => 
    Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0))
  );
  
  const [selector, setSelector] = useState<Selector>(() => ({
    row: Math.floor(Math.random() * GRID_SIZE),
    col: Math.floor(Math.random() * GRID_SIZE)
  }));
  
  const [score, setScore] = useState(0);
  const [cellBackgrounds, setCellBackgrounds] = useState<string[][]>(
    Array(GRID_SIZE).fill('').map(() => Array(GRID_SIZE).fill(''))
  );
  const [settings, setSettings] = useState<GameSettings>({
    showMagnifier: true,
    showHighlighting: true,
    magnifierSize: 9,
  });

  useEffect(() => {
    const updateBackgrounds = async () => {
      const newBackgrounds = Array(GRID_SIZE).fill('').map(() => Array(GRID_SIZE).fill(''));
      const sequences = await analyzeGrid(grid);
      
      // Remove sub-sequences contained within longer sequences
      const filteredSequences = sequences.filter((seqA) => {
        return !sequences.some((seqB) =>
          seqB.length > seqA.length &&
          seqB.type === seqA.type &&
          seqB.index === seqA.index &&
          seqB.start <= seqA.start &&
          (seqB.start + seqB.length) >= (seqA.start + seqA.length)
        );
      });

      // Sort sequences so shorter ones are processed first
      const sortedSequences = filteredSequences.sort((a, b) => a.length - b.length);

      // Highlight cells for 3-, 4-, or 5-length sequences with different shades of green
      sortedSequences.forEach(seq => {
        if (SEQUENCE_LENGTHS.includes(seq.length)) {
          let highlightClass = '';
          if (seq.length === 3) {
            highlightClass = 'bg-green-200';
          } else if (seq.length === 4) {
            highlightClass = 'bg-green-300';
          } else if (seq.length === 5) {
            highlightClass = 'bg-green-400';
          }

          if (seq.type === 'row') {
            for (let i = seq.start; i < seq.start + seq.length; i++) {
              newBackgrounds[seq.index][i] = highlightClass;
            }
          } else {
            for (let i = seq.start; i < seq.start + seq.length; i++) {
              newBackgrounds[i][seq.index] = highlightClass;
            }
          }
        }
      });

      setCellBackgrounds(newBackgrounds);
    };

    updateBackgrounds();
  }, [grid]);

  const checkSequences = useCallback(async (gridToCheck: number[][]) => {
    const sequences = await analyzeGrid(gridToCheck);
    return sequences;
  }, []);

  const handleKeyboardLogic = useCallback(async (e: KeyboardEvent) => {
    if (MOVEMENT_KEYS.includes(e.key)) {
      e.preventDefault();
      const moveAmount = e.shiftKey ? 5 : 1;
      
      setSelector(prev => {
        let newRow = prev.row;
        let newCol = prev.col;
        
        switch (e.key) {
          case 'ArrowUp':
            newRow = (prev.row - moveAmount + GRID_SIZE) % GRID_SIZE;
            break;
          case 'ArrowDown':
            newRow = (prev.row + moveAmount) % GRID_SIZE;
            break;
          case 'ArrowLeft':
            newCol = (prev.col - moveAmount + GRID_SIZE) % GRID_SIZE;
            break;
          case 'ArrowRight':
            newCol = (prev.col + moveAmount) % GRID_SIZE;
            break;
        }
        
        return { row: newRow, col: newCol };
      });
    }
    
    if (e.key.toLowerCase() === FIBONACCI_KEY) {
      e.preventDefault();
      const newGrid = grid.map(row => [...row]);
      
      // Increment row and column, but skip cleared cells
      for (let i = 0; i < GRID_SIZE; i++) {
        if (newGrid[selector.row][i] !== -1) { // <-- skip increment if cleared
          newGrid[selector.row][i]++;
        }
        if (i !== selector.row && newGrid[i][selector.col] !== -1) { // <-- skip increment if cleared
          newGrid[i][selector.col]++;
        }
      }
      
      const sequences = await checkSequences(newGrid);
      
      // Sort sequences by descending length
      const sortedSequences = sequences.sort((a, b) => b.length - a.length);
      
      let sequencesCleared = 0;
      
      // Clear 5-length sequences by marking them -1
      sortedSequences.forEach(seq => {
        if (seq.length === 5) {
          if (seq.type === 'row') {
            for (let i = seq.start; i < seq.start + seq.length; i++) {
              newGrid[seq.index][i] = -1; // <-- mark cell as cleared
            }
          } else {
            for (let i = seq.start; i < seq.start + seq.length; i++) {
              newGrid[i][seq.index] = -1; // <-- mark cell as cleared
            }
          }
          sequencesCleared++;
        }
      });
      
      if (sequencesCleared > 0) {
        setScore(s => s + sequencesCleared);
      }
      
      setGrid(newGrid);
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
      setSettings(prev => {
        const newSize = Math.max(7, prev.magnifierSize - 2);
        return { ...prev, magnifierSize: newSize };
      });
    } else if (e.key === INCREASE_MAGNIFIER_KEY) {
      e.preventDefault();
      setSettings(prev => {
        const newSize = Math.min(25, prev.magnifierSize + 2);
        return { ...prev, magnifierSize: newSize };
      });
    }
  }, [grid, selector, checkSequences, setSettings]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyboardLogic);
    return () => window.removeEventListener('keydown', handleKeyboardLogic);
  }, [handleKeyboardLogic]);

  return {
    grid,
    selector,
    score,
    settings,
    cellBackgrounds,
    setSettings,
    getCellBackground: useCallback((row: number, col: number) => {
      return settings.showHighlighting ? cellBackgrounds[row][col] : '';
    }, [cellBackgrounds, settings.showHighlighting])
  };
}; 