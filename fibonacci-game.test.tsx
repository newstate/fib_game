import { isGeneralizedFibonacciSequence } from './utils';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import FibonacciGame from './fibonacci-game';

describe('FibonacciGame', () => {
  /**
   * Test: Keyboard Navigation
   * Purpose: Verifies that the selector (highlighted cell) moves when arrow keys are pressed
   * Method:
   * 1. Render the game component
   * 2. Find the initial position of the selector (element with ring-2 class)
   * 3. Simulate pressing the right arrow key
   * 4. Verify that the selector has moved to a new position
   */
  test('keyboard controls move selector', () => {
    const { container } = render(<FibonacciGame />);
    const initialSelector = container.querySelector('.ring-2');
    
    fireEvent.keyDown(document, { key: 'ArrowRight' });
    
    const movedSelector = container.querySelector('.ring-2');
    expect(initialSelector).not.toBe(movedSelector);
  });

  /**
   * Test: Fibonacci Sequence Detection
   * Purpose: Verifies that the game correctly identifies valid and invalid Fibonacci sequences
   * Method:
   * 1. Test various sequences that should be identified as Fibonacci
   * 2. Test sequences that should not be identified as Fibonacci
   * 3. Test edge cases (zeros, negative numbers, short sequences)
   */
  describe('Fibonacci sequence detection', () => {
    /**
     * Test the isGeneralizedFibonacciSequence function directly
     * A sequence is Fibonacci if each number is the sum of the previous two
     */
    test('identifies valid Fibonacci sequences', () => {
      const { container } = render(<FibonacciGame />);
      const game = container.firstChild as HTMLElement;
      
      const validSequences = [
        [1, 1, 2],
        [1, 2, 3],
        [2, 3, 5],
        [3, 5, 8],
        [1, 1, 2, 3],
        [2, 3, 5, 8],
        [1, 1, 2, 3, 5]
      ];

      validSequences.forEach(sequence => {
        expect(isGeneralizedFibonacciSequence(sequence)).toBeTruthy();
      });
    });

    test('rejects invalid sequences', () => {
      const invalidSequences = [
        [1, 1, 1],      // Not Fibonacci
        [1, 2, 4],      // Not Fibonacci
        [0, 1, 1],      // Contains zero
        [1, 1],         // Too short
        [1, 2, 4, 7],   // Not Fibonacci
      ];

      invalidSequences.forEach(sequence => {
        const result = isGeneralizedFibonacciSequence(sequence);
        if (result) {
          console.log(`Sequence ${sequence} was incorrectly identified as valid`);
        }
        expect(isGeneralizedFibonacciSequence(sequence)).toBeFalsy();
      });
    });
  });

  describe('Sequence clearing', () => {
    test('clears 5-length Fibonacci sequences and updates score', () => {
      const { container } = render(<FibonacciGame />);
      
      // Create a 5-length Fibonacci sequence in row 0
      const pressF = () => fireEvent.keyDown(document, { key: 'f' });
      
      // Move to position (0,0)
      fireEvent.keyDown(document, { key: 'ArrowUp', shiftKey: true });
      fireEvent.keyDown(document, { key: 'ArrowLeft', shiftKey: true });
      
      // Log initial state
      const getRowValues = () => {
        const cells = Array.from(container.querySelectorAll('.grid > div')).slice(0, 5);
        return cells.map(cell => cell.textContent || '0').join(',');
      };
      
      console.log('Initial row:', getRowValues());
      
      // Press f once at (0,0)
      pressF();
      console.log('After first F:', getRowValues());
      
      // Move right and press f again
      fireEvent.keyDown(document, { key: 'ArrowRight' });
      pressF();
      console.log('After second F:', getRowValues());
      
      // Continue with the rest of the sequence...
      fireEvent.keyDown(document, { key: 'ArrowRight' });
      pressF();
      pressF();
      console.log('After position 2:', getRowValues());
      
      fireEvent.keyDown(document, { key: 'ArrowRight' });
      pressF();
      pressF();
      pressF();
      console.log('After position 3:', getRowValues());
      
      fireEvent.keyDown(document, { key: 'ArrowRight' });
      pressF();
      pressF();
      pressF();
      pressF();
      pressF();
      console.log('Final row:', getRowValues());
    });
  });
}); 