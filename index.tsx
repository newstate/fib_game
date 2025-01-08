import React from 'react';
import { createRoot } from 'react-dom/client';
import FibonacciGame from './fibonacci-game';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<FibonacciGame />); 