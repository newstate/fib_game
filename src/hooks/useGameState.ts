import { useState, useEffect, useCallback } from 'react';
import { GRID_SIZE } from '../constants/game';
import { CUSTOM_IMAGES, CustomImage } from '../constants/game';
import { useGameContext } from '../context/GameContext';

const GAME_STATE_KEY = 'fibonacciGameState';

interface GameState {
  grid: number[][];
  startTime: number | null;
  elapsedTime: number;
  isStarted: boolean;
  customImage: CustomImage;
}

export const useGameState = () => {
  const { isFormActive } = useGameContext();
  const loadInitialState = (): GameState => {
    const savedState = localStorage.getItem(GAME_STATE_KEY);
    if (savedState) {
      return JSON.parse(savedState);
    }
    return {
      grid: Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0)),
      startTime: null,
      elapsedTime: 0,
      isStarted: false,
      customImage: CUSTOM_IMAGES.default
    };
  };

  const [gameState, setGameState] = useState<GameState>(loadInitialState);
  const [displayTime, setDisplayTime] = useState('00:00:00');
  const [clearedPercentage, setClearedPercentage] = useState(0);

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
    setGameState(prev => ({
      grid: emptyGrid,
      startTime: null,
      elapsedTime: 0,
      isStarted: false,
      customImage: prev.customImage
    }));
    setDisplayTime('00:00:00');
    setClearedPercentage(0);
  }, []);

  // Timer effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (gameState.isStarted && !isFormActive) {
      intervalId = setInterval(() => {
        const currentTime = Date.now();
        const totalElapsed = gameState.elapsedTime + (currentTime - gameState.startTime!);
        
        const hours = Math.floor(totalElapsed / 3600000);
        const minutes = Math.floor((totalElapsed % 3600000) / 60000);
        const seconds = Math.floor((totalElapsed % 60000) / 1000);

        setDisplayTime(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );

        setGameState(prev => ({
          ...prev,
          elapsedTime: totalElapsed
        }));
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [gameState.isStarted, gameState.startTime, isFormActive]);

  const updateGrid = useCallback((newGrid: number[][]) => {
    setGameState(prev => ({
      ...prev,
      grid: newGrid
    }));
  }, []);

  const calculateClearedPercentage = useCallback((gridToCheck: number[][]) => {
    const totalCells = GRID_SIZE * GRID_SIZE;
    const clearedCells = gridToCheck.flat().filter(cell => cell === -1).length;
    return Math.round((clearedCells / totalCells) * 100);
  }, []);

  useEffect(() => {
    // Get image ID from URL params
    const params = new URLSearchParams(window.location.search);
    const imageId = params.get('image') || 'default';
    
    const selectedImage = CUSTOM_IMAGES[imageId] || CUSTOM_IMAGES.default;
    setGameState(prev => ({
      ...prev,
      customImage: selectedImage
    }));
  }, []);

  return {
    gameState,
    displayTime,
    clearedPercentage,
    setClearedPercentage,
    startGame,
    resetGame,
    updateGrid,
    calculateClearedPercentage
  };
}; 