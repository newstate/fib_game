import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { useGameContext } from '../context/GameContext';
import { CUSTOM_IMAGES } from '../constants/game';

interface ShareGameProps {
  isGameRunning: boolean;
  grid: number[][];
  elapsedTime: number;
}

export const ShareGame: React.FC<ShareGameProps> = ({ isGameRunning, grid, elapsedTime }) => {
  const [isSending, setIsSending] = useState(false);
  const [userGuess, setUserGuess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const { setIsFormActive } = useGameContext();

  // Initialize EmailJS when component mounts
  useEffect(() => {
    emailjs.init({
      publicKey: "iH0uNE_PEsEvxWUxN",
      blockHeadless: true,
    });

    // Clean up form state when component unmounts
    return () => {
      setShowForm(false);
      setIsFormActive(false);
    };
  }, []);

  const handleShowForm = () => {
    setShowForm(true);
    setIsFormActive(true);  // Set form active immediately when showing
  };

  const handleHideForm = () => {
    // Ensure state updates happen in the correct order
    setIsFormActive(false);
    setTimeout(() => {
      setShowForm(false);
      setUserGuess('');
    }, 0);
  };

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSending) return;
    setIsSending(true);

    try {
      // Get the image ID from the URL
      const urlParams = new URLSearchParams(window.location.search);
      const imageId = urlParams.get('image') || 'default';
      
      const gridState = grid.map(row => 
        row.map(cell => cell === -1 ? 'x' : '0').join('')
      ).join('|');

      const hours = Math.floor(elapsedTime / 3600000);
      const minutes = Math.floor((elapsedTime % 3600000) / 60000);
      const seconds = Math.floor((elapsedTime % 60000) / 1000);
      const timeString = `${hours}h ${minutes}m ${seconds}s`;

      const result = await emailjs.send(
        'service_cc12spg',
        'template_9rqtu7j',
        {
          from_name: imageId,
          to_name: 'Admin', // You can customize this if needed
          message: `Guess: ${userGuess}\n\nCompletion Time: ${timeString}\n\nGrid State: ${gridState}`,
          timestamp: new Date().toISOString()
        }
      );

      console.log('Success:', result.status, result.text);
      // Update state in correct order
      setIsFormActive(false);
      setTimeout(() => {
        setShowForm(false);
        setUserGuess('');
        setIsSending(false);
      }, 0);
      
      alert('Thank you! Your game result has been sent successfully.');
    } catch (error) {
      console.error('Error sending game result:', error);
      alert('Failed to send game result. Please try again.');
      setIsSending(false);
    }
  };

  if (!isGameRunning) return null;

  if (!showForm) {
    return (
      <button 
        className="share-button font-bold py-2 px-4 rounded border-2 border-blue-500 bg-white text-blue-500 flex items-center gap-2"
        onClick={handleShowForm}
      >
        I Recognized It! 
        <span role="img" aria-label="smiley">😊</span>
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
      </button>
    );
  }

  return (
    <form 
      onSubmit={handleShare}
      className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-4 max-w-md"
    >
      <div>
        <label htmlFor="guess" className="block text-sm font-medium text-gray-700 mb-1">
          What do you think the hidden image represents?
        </label>
        <textarea
          id="guess"
          value={userGuess}
          onChange={(e) => setUserGuess(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          rows={3}
          placeholder="Type your guess here..."
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSending}
          className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isSending ? "Sending..." : "Submit"}
        </button>
        <button
          type="button"
          onClick={handleHideForm}
          className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}; 