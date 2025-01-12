import React from 'react';
import { useState } from 'react';
import { Magnifier } from './src/components/Magnifier';
import { Controls } from './src/components/Controls';
import { useGameLogic } from './src/hooks/useGameLogic';
import { GRID_SIZE } from './src/constants/game';
import { ShareGame } from './src/components/ShareGame';
import { GameContext } from './src/context/GameContext';

const FibonacciGame = () => {
  const {
    grid,
    selector,
    clearedPercentage,
    settings,
    getCellBackground,
    setSettings,
    isCalculatingPotential,
    displayTime,
    isStarted,
    startGame,
    resetGame,
    gameState
  } = useGameLogic();
  const [isFormActive, setIsFormActive] = useState(false);

  return (
    <GameContext.Provider value={{ isFormActive, setIsFormActive }}>
      <div id="game-container"
        className="min-h-screen flex items-center justify-center gap-4 p-2"
        style={{
          backgroundColor: '#f5f5dc'
        }}
      >
        <div className="relative aspect-square w-[min(90vh,90vw)] shrink-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("${gameState.customImage.url}")`,
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
          clearedPercentage={clearedPercentage}
          settings={settings}
          onSettingsChange={setSettings}
          isCalculatingPotential={isCalculatingPotential}
          displayTime={displayTime}
          isStarted={isStarted}
          onStartGame={startGame}
          onResetGame={resetGame}
        >
          <ShareGame 
            isGameRunning={isStarted} 
            grid={grid}
            elapsedTime={gameState.elapsedTime}
          />
        </Controls>
      </div>
    </GameContext.Provider>
  );
};

export default FibonacciGame;