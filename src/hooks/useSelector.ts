import { useState, useCallback } from 'react';
import { Selector } from '../types/game';
import { GRID_SIZE } from '../constants/game';

export const useSelector = () => {
  const [selector, setSelector] = useState<Selector>(() => ({
    row: Math.floor(Math.random() * GRID_SIZE),
    col: Math.floor(Math.random() * GRID_SIZE)
  }));

  const moveSelector = useCallback((direction: 'up' | 'down' | 'left' | 'right', amount: number) => {
    setSelector(prev => {
      let newRow = prev.row;
      let newCol = prev.col;
      
      switch (direction) {
        case 'up':
          newRow = (prev.row - amount + GRID_SIZE) % GRID_SIZE;
          break;
        case 'down':
          newRow = (prev.row + amount) % GRID_SIZE;
          break;
        case 'left':
          newCol = (prev.col - amount + GRID_SIZE) % GRID_SIZE;
          break;
        case 'right':
          newCol = (prev.col + amount) % GRID_SIZE;
          break;
      }
      
      return { row: newRow, col: newCol };
    });
  }, []);

  return { selector, moveSelector };
}; 