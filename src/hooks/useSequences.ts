import { useState, useEffect, useCallback } from 'react';
import { analyzeGrid, analyzePotential } from '../utils/api';
import { GRID_SIZE, SEQUENCE_LENGTHS } from '../constants/game';

export const useSequences = (grid: number[][], showHighlighting: boolean, showPotential: boolean) => {
  const [cellBackgrounds, setCellBackgrounds] = useState<string[][]>(
    Array(GRID_SIZE).fill('').map(() => Array(GRID_SIZE).fill(''))
  );
  const [potentialHighlights, setPotentialHighlights] = useState<number[][]>(
    Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0))
  );
  const [isCalculatingPotential, setIsCalculatingPotential] = useState(false);

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

  useEffect(() => {
    const updatePotentialHighlights = async () => {
      if (!showPotential) {
        setPotentialHighlights(Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0)));
        return;
      }
      
      setIsCalculatingPotential(true);
      const potentialMap = await analyzePotential(grid);
      setPotentialHighlights(potentialMap);
      setIsCalculatingPotential(false);
    };

    updatePotentialHighlights();
  }, [grid, showPotential]);

  const getCellBackground = useCallback((row: number, col: number) => {
    if (!showHighlighting) return '';
    
    if (cellBackgrounds[row][col]) {
      return cellBackgrounds[row][col];
    }
    
    const potential = potentialHighlights[row][col];
    if (potential > 0) {
      if (potential <= 10) return 'bg-red-200';
      if (potential <= 20) return 'bg-red-300';
      if (potential <= 30) return 'bg-red-400';
      if (potential <= 40) return 'bg-red-500';
      if (potential <= 50) return 'bg-red-600';
      return 'bg-red-700';
    }
    
    return '';
  }, [cellBackgrounds, potentialHighlights, showHighlighting]);

  return {
    cellBackgrounds,
    isCalculatingPotential,
    getCellBackground
  };
}; 