import React from 'react';
import { MagnifierProps } from '../types/game';

export const Magnifier: React.FC<MagnifierProps> = ({ grid, selector, gridSize, getCellBackground, settings }) => {
  const offset = Math.floor(settings.magnifierSize / 2);
  
  const getMagnifierCells = () => {
    const cells = [];
    for (let i = -offset; i <= offset; i++) {
      for (let j = -offset; j <= offset; j++) {
        const row = (selector.row + i + gridSize) % gridSize;
        const col = (selector.col + j + gridSize) % gridSize;
        cells.push({ row, col, value: grid[row][col] });
      }
    }
    return cells;
  };

  return (
    <>      
      <div 
        className="absolute bg-white border-2 border-orange-500 rounded-lg overflow-hidden"
        style={{
          width: `${settings.magnifierSize * 24}px`,
          height: `${settings.magnifierSize * 24}px`,
          left: `${selector.col * 100 / gridSize}%`,
          top: `${selector.row * 100 / gridSize}%`,
          transform: 'translate(-50%, -50%)',
          display: 'grid',
          gridTemplateColumns: `repeat(${settings.magnifierSize}, 1fr)`,
          gridTemplateRows: `repeat(${settings.magnifierSize}, 1fr)`,
          gap: '0',
          zIndex: 20
        }}
      >
        {getMagnifierCells().map((cell, idx) => (
          <div
            key={idx}
            className={`
              relative
              flex items-center justify-center
              text-base font-mono
              ${
                cell.value < 0
                  ? ''
                  : `box-border border-[1px] border-black/30 border-inset ${getCellBackground(cell.row, cell.col) || 'bg-white'}`
              }
              ${cell.row === selector.row && cell.col === selector.col 
                ? 'cell-selector'
                : ''}
            `}
          >
            {cell.value >= 0 && (
              <span>{cell.value || ''}</span>
            )}
          </div>
        ))}
      </div>
    </>
  );
}; 