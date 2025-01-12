export const GRID_SIZE = 50;
export const MOVEMENT_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
export const FIBONACCI_KEY = 'f';
export const MAGNIFIER_SIZE = 9;
export const MAGNIFICATION = 2;
export const MAGNIFIER_KEY = 'm';
export const HIGHLIGHT_KEY = 'h';
export const INCREASE_MAGNIFIER_KEY = ']';
export const DECREASE_MAGNIFIER_KEY = '[';
export const SEQUENCE_LENGTHS = [3, 4, 5];
export const POTENTIAL_KEY = 'c';

export interface CustomImage {
  id: string;
  url: string;
  hint?: string;
}

export const CUSTOM_IMAGES: Record<string, CustomImage> = {
  default: {
    id: 'default',
    url: '/path/to/default/image.jpg'
  }
  // Add more images here
}; 