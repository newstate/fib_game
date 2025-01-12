import { createContext, useContext } from 'react';

interface GameContextType {
  isFormActive: boolean;
  setIsFormActive: (active: boolean) => void;
}

export const GameContext = createContext<GameContextType>({
  isFormActive: false,
  setIsFormActive: () => {},
});

export const useGameContext = () => useContext(GameContext); 