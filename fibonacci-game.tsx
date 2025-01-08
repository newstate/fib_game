import React, { useState, useEffect, useCallback, KeyboardEvent as ReactKeyboardEvent } from 'react';
import { analyzeGrid, FibonacciSequence } from './utils/api';

interface Selector {
  row: number;
  col: number;
}

const GRID_SIZE = 50;
const MOVEMENT_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
const FIBONACCI_KEY = 'f';

const FibonacciGame = () => {
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

  const checkSequences = useCallback(async (gridToCheck: number[][]) => {
    const sequences = await analyzeGrid(gridToCheck);
    return sequences;
  }, []);

  const handleKeyDownReact = useCallback((e: ReactKeyboardEvent<HTMLDivElement>) => {
    handleKeyboardLogic(e);
  }, [selector, checkSequences, grid]);

  const handleKeyDownDOM = useCallback((e: KeyboardEvent) => {
    handleKeyboardLogic(e);
  }, [selector, checkSequences, grid]);

  const handleKeyboardLogic = useCallback(async (e: KeyboardEvent | ReactKeyboardEvent<HTMLDivElement>) => {
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
          default:
            break;
        }
        
        return { row: newRow, col: newCol };
      });
    }
    
    if (e.key.toLowerCase() === FIBONACCI_KEY) {
      e.preventDefault();
      const prev = grid;
      const newGrid = prev.map(row => [...row]);
      
      // Increment row and column
      for (let i = 0; i < GRID_SIZE; i++) {
        newGrid[selector.row][i]++;
        if (i !== selector.row) {
          newGrid[i][selector.col]++;
        }
      }
      
      const sequences = await checkSequences(newGrid);

      // 1) Sort sequences by descending length, so 5-length is processed before 4-length.
      const sortedSequences = sequences.sort((a, b) => b.length - a.length);

      let sequencesCleared = 0;

      // 2) Clear those cells.
      sortedSequences.forEach(seq => {
        if (seq.length === 5) {
          if (seq.type === 'row') {
            for (let i = seq.start; i < seq.start + seq.length; i++) {
              newGrid[seq.index][i] = 0;
            }
          } else {
            for (let i = seq.start; i < seq.start + seq.length; i++) {
              newGrid[i][seq.index] = 0;
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
  }, [selector, checkSequences, grid]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDownDOM);
    return () => window.removeEventListener('keydown', handleKeyDownDOM);
  }, [handleKeyDownDOM]);

  useEffect(() => {
    const updateBackgrounds = async () => {
      const newBackgrounds = [...cellBackgrounds];
      const sequences = await analyzeGrid(grid);
      
      // 1) Reset current backgrounds.
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          newBackgrounds[r][c] = '';
        }
      }

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

      // Sort sequences so 3-length is processed first, 4-length second, etc.
      const sortedSequences = filteredSequences.sort((a, b) => a.length - b.length);

      // 2) Highlight cells for 3- or 4-length sequences with different shades of green
      sortedSequences.forEach(seq => {
        if (seq.length === 3 || seq.length === 4) {
          const highlightClass = seq.length === 3 ? 'bg-green-200' : 'bg-green-300';

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

      // 3) Update state with the new backgrounds.
      setCellBackgrounds(newBackgrounds);
    };

    updateBackgrounds();
  }, [grid, selector]);

  const getCellBackground = useCallback((row: number, col: number) => {
    return cellBackgrounds[row][col];
  }, [cellBackgrounds]);

  return (
    <div 
      className="min-h-screen bg-[#f5f5dc] flex items-center justify-center gap-8"
      onKeyDown={handleKeyDownReact}
    >
      <div className="h-screen w-screen max-w-screen-lg p-4">
        <div className="grid h-full w-full" style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          gap: '1px'
        }}>
          {grid.map((row, rowIndex) => 
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  border border-black
                  flex items-center justify-center
                  text-sm font-mono
                  aspect-square
                  ${getCellBackground(rowIndex, colIndex)}
                  ${rowIndex === selector.row && colIndex === selector.col 
                    ? 'ring-2 ring-orange-500 ring-opacity-100 ring-offset-1' 
                    : ''}
                `}
              >
                {cell || ''}
              </div>
            ))
          )}
        </div>
      </div>
      <div className="text-4xl font-bold">
        Score: {score}
      </div>
    </div>
  );
};

export default FibonacciGame;