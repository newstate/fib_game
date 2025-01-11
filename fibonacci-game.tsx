import React from 'react';
import { Magnifier } from './src/components/Magnifier';
import { Controls } from './src/components/Controls';
import { useGameLogic } from './src/hooks/useGameLogic';
import { GRID_SIZE } from './src/constants/game';

const FibonacciGame = () => {
  const {
    grid,
    selector,
    score,
    settings,
    getCellBackground,
    setSettings,
    isCalculatingPotential
  } = useGameLogic();

  return (
    <div
      className="min-h-screen flex items-center justify-center gap-4 p-2"
      style={{
        backgroundColor: '#f5f5dc'
      }}
    >
      <div className="relative aspect-square w-[min(90vh,90vw)] shrink-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url("images/dontpanic.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0
          }}
        />

        <div
          className="relative grid w-full h-full overflow-hidden"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
            gap: '0',
            zIndex: 10
          }}
        >
          {grid.map((row, rowIndex) => 
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  relative
                  flex items-center justify-center
                  text-sm font-mono
                  aspect-square
                  overflow-hidden
                  ${
                    cell < 0
                      ? ''
                      : `box-border border-[1px] border-black/30 border-inset ${getCellBackground(rowIndex, colIndex) || 'bg-white'}`
                  }
                  ${
                    rowIndex === selector.row && colIndex === selector.col 
                      ? 'cell-selector'
                      : ''
                  }
                `}
              >
                {cell >= 0 && (
                  <span className="truncate">
                    {cell || ''}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
        
        {settings.showMagnifier && (
          <Magnifier 
            grid={grid}
            selector={selector}
            gridSize={GRID_SIZE}
            getCellBackground={getCellBackground}
            settings={settings}
          />
        )}
      </div>
      <Controls 
        score={score}
        settings={settings}
        onSettingsChange={setSettings}
        isCalculatingPotential={isCalculatingPotential}
      />
    </div>
  );
};

export default FibonacciGame;