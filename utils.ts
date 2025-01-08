export function isGeneralizedFibonacciSequence(numbers: number[]): boolean {
  if (numbers.length < 3) return false;
  if (numbers.some(n => n === 0)) return false;
  
  for (let i = 2; i < numbers.length; i++) {
    if (numbers[i] !== numbers[i-1] + numbers[i-2]) {
      return false;
    }
  }
  return true;
} 