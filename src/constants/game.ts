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

var baseUrl = 'https://gcqowih89q0rcl2g.public.blob.vercel-storage.com/';

export const CUSTOM_IMAGES: Record<string, CustomImage> = {
  default: {
    id: 'default',
    url: baseUrl + 'dontpanic.jpg'
  },
  frank: {
    id: 'frank',
    url: baseUrl + 'frank-69sEXFgMMqkTcxo9KM6CxNQl1y6SqM.JPG'
  },
  maurice: {
    id: 'maurice',
    url: baseUrl + 'maurice.png'
  }
}; 