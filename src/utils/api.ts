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