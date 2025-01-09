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