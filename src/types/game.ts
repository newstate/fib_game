export interface Selector {
  row: number;
  col: number;
}

export interface GameSettings {
  showMagnifier: boolean;
  showHighlighting: boolean;
  showPotential: boolean;
  magnifierSize: number;
}

export interface MagnifierProps {
  grid: number[][];
  selector: Selector;
  gridSize: number;
  getCellBackground: (row: number, col: number) => string;
  settings: GameSettings;
}

export interface FibonacciSequence {
  type: 'row' | 'column';
  index: number;
  start: number;
  length: number;
  values: number[];
}

export interface GameState {
  grid: number[][];
  startTime: number | null;
  elapsedTime: number;
  isStarted: boolean;
} 