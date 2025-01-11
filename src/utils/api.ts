import { FibonacciSequence } from '../types/game';

const API_URL = 'http://localhost:5001';

export async function analyzeGrid(grid: number[][]): Promise<FibonacciSequence[]> {
  try {
    const response = await fetch(`${API_URL}/analyze-grid`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ grid })
    });
    const data = await response.json();
    return data.sequences || [];
  } catch (error) {
    console.error('API Error:', error);
    return [];
  }
}

export const analyzePotential = async (grid: number[][]): Promise<number[][]> => {
  try {
    const response = await fetch('http://localhost:5001/analyze-potential', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ grid }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.potentialMap;
  } catch (error) {
    console.error('Error analyzing potential:', error);
    return Array(grid.length).fill(0).map(() => Array(grid[0].length).fill(0));
  }
}; 