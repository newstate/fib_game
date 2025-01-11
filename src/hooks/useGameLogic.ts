import { useState, useCallback, useEffect } from 'react';
import { Selector, GameSettings, GameState } from '../types/game';
import { analyzeGrid, analyzePotential } from '../utils/api';
import {
  GRID_SIZE,
  MOVEMENT_KEYS,
  FIBONACCI_KEY,
  MAGNIFIER_KEY,
  HIGHLIGHT_KEY,
  INCREASE_MAGNIFIER_KEY,
  DECREASE_MAGNIFIER_KEY,
  SEQUENCE_LENGTHS,
  POTENTIAL_KEY
} from '../constants/game';

const GAME_STATE_KEY = 'fibonacciGameState';

export const useGameLogic = () => {
  // Load saved state from localStorage or use default
  const loadInitialState = (): GameState => {
    const savedState = localStorage.getItem(GAME_STATE_KEY);
    if (savedState) {
      return JSON.parse(savedState);
    }
    return {
      grid: Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0)),
      startTime: null,
      elapsedTime: 0,
      isStarted: false
    };
  };

  const [gameState, setGameState] = useState<GameState>(loadInitialState);
  const [selector, setSelector] = useState<Selector>(() => ({
    row: Math.floor(Math.random() * GRID_SIZE),
    col: Math.floor(Math.random() * GRID_SIZE)
  }));
  
  const [clearedPercentage, setClearedPercentage] = useState(0);
  const [cellBackgrounds, setCellBackgrounds] = useState<string[][]>(
    Array(GRID_SIZE).fill('').map(() => Array(GRID_SIZE).fill(''))
  );
  const [settings, setSettings] = useState<GameSettings>({
    showMagnifier: true,
    showHighlighting: true,
    showPotential: false,
    magnifierSize: 9,
  });
  const [potentialHighlights, setPotentialHighlights] = useState<number[][]>(
    Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0))
  );
  const [isCalculatingPotential, setIsCalculatingPotential] = useState(false);

  // Add timer logic
  const [displayTime, setDisplayTime] = useState('00:00:00');

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  const startGame = useCallback(() => {
    if (!gameState.isStarted) {
      setGameState(prev => ({
        ...prev,
        isStarted: true,
        startTime: Date.now(),
      }));
    }
  }, [gameState.isStarted]);

  const resetGame = useCallback(() => {
    const emptyGrid = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0));
    setGameState({
      grid: emptyGrid,
      startTime: null,
      elapsedTime: 0,
      isStarted: false
    });
    setDisplayTime('00:00:00');
    setClearedPercentage(0);
  }, []);

  // Update the timer logic to store elapsed time when game stops
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (gameState.isStarted && gameState.startTime) {
      intervalId = setInterval(() => {
        const currentTime = Date.now();
        const totalElapsed = gameState.elapsedTime + (currentTime - gameState.startTime!);
        
        const hours = Math.floor(totalElapsed / 3600000);
        const minutes = Math.floor((totalElapsed % 3600000) / 60000);
        const seconds = Math.floor((totalElapsed % 60000) / 1000);

        setDisplayTime(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );

        // Update elapsed time in game state
        setGameState(prev => ({
          ...prev,
          elapsedTime: totalElapsed
        }));
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [gameState.isStarted, gameState.startTime]);

  useEffect(() => {
    const updateBackgrounds = async () => {
      const newBackgrounds = Array(GRID_SIZE).fill('').map(() => Array(GRID_SIZE).fill(''));
      const sequences = await analyzeGrid(gameState.grid);
      
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
  }, [gameState.grid]);

  useEffect(() => {
    const updatePotentialHighlights = async () => {
      if (!settings.showPotential) {
        setPotentialHighlights(Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0)));
        return;
      }
      
      setIsCalculatingPotential(true);
      const potentialMap = await analyzePotential(gameState.grid);
      setPotentialHighlights(potentialMap);
      setIsCalculatingPotential(false);
    };

    updatePotentialHighlights();
  }, [gameState.grid, settings.showPotential]);

  const checkSequences = useCallback(async (gridToCheck: number[][]) => {
    const sequences = await analyzeGrid(gridToCheck);
    return sequences;
  }, []);

  const calculateClearedPercentage = useCallback((gridToCheck: number[][]) => {
    const totalCells = GRID_SIZE * GRID_SIZE;
    const clearedCells = gridToCheck.flat().filter(cell => cell === -1).length;
    return Math.round((clearedCells / totalCells) * 100);
  }, []);

  // Update grid through gameState
  const updateGrid = useCallback((newGrid: number[][]) => {
    setGameState(prev => ({
      ...prev,
      grid: newGrid
    }));
  }, []);

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
      
      const sequences = await checkSequences(newGrid);
      
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

    if (e.key.toLowerCase() === POTENTIAL_KEY) {
      e.preventDefault();
      setSettings(prev => ({
        ...prev,
        showPotential: !prev.showPotential
      }));
    }
  }, [gameState.isStarted, gameState.grid, selector, startGame, checkSequences, updateGrid]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyboardLogic);
    return () => window.removeEventListener('keydown', handleKeyboardLogic);
  }, [handleKeyboardLogic]);

  const getCellBackground = useCallback((row: number, col: number) => {
    if (!settings.showHighlighting) return '';
    
    // Show existing sequences in green
    if (cellBackgrounds[row][col]) {
      return cellBackgrounds[row][col];
    }
    
    // Show potential clears in different shades of red
    const potential = potentialHighlights[row][col];
    if (potential > 0) {
      // Use different shades of red based on potential clears
      if (potential <= 10) return 'bg-red-200';      // Darkest red for 1-10
      if (potential <= 20) return 'bg-red-300';
      if (potential <= 30) return 'bg-red-400';
      if (potential <= 40) return 'bg-red-500';
      if (potential <= 50) return 'bg-red-600';
      return 'bg-red-700';                           // Lightest red for 50+
    }
    
    return '';
  }, [cellBackgrounds, potentialHighlights, settings.showHighlighting]);

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