import React, { useState } from 'react';
import html2canvas from 'html2canvas';

interface ShareGameProps {
  isGameRunning: boolean;
}

export const ShareGame: React.FC<ShareGameProps> = ({ isGameRunning }) => {
  const [isCapturing, setIsCapturing] = useState(false);

  const handleShare = async () => {
    if (isCapturing) return;
    setIsCapturing(true);

    try {
      const gameElement = document.getElementById('game-container');
      if (!gameElement) {
        throw new Error('Game container not found');
      }

      // Hide any UI elements you don't want in the screenshot
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const canvas = await html2canvas(gameElement, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        scale: 2,
        logging: false,
        removeContainer: true,
        ignoreElements: (element) => {
          // Ignore the share button itself and any other UI elements you want to exclude
          return element.classList.contains('share-button') || 
                 element.classList.contains('controls-panel');
        }
      });

      // Restore original body overflow
      document.body.style.overflow = originalOverflow;

      // Create blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), 'image/png', 1.0);
      });

      // Create file
      const file = new File([blob], 'game-progress.png', { type: 'image/png' });

      // Download file
      const downloadUrl = URL.createObjectURL(file);
      const downloadLink = document.createElement('a');
      downloadLink.href = downloadUrl;
      downloadLink.download = 'game-progress.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(downloadUrl);

      // Open email client
      const subject = encodeURIComponent('I found the hidden image!');
      const body = encodeURIComponent('I think the hidden image is: \n\nI\'ve attached my game progress.');
      window.open(`mailto:gaspardbos@gmail.com?subject=${subject}&body=${body}`, '_self');

    } catch (error) {
      console.error('Error capturing game:', error);
      alert('Failed to capture game state. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  if (!isGameRunning) return null;

  return (
    <button 
      className="share-button font-bold py-2 px-4 rounded border-2 border-blue-500 bg-white text-blue-500 flex items-center gap-2"
      onClick={handleShare}
      disabled={isCapturing}
    >
      {isCapturing ? (
        "Capturing..."
      ) : (
        <>
          "I Found It!" 
          <span role="img" aria-label="smiley">😊</span>
          Share Result
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
        </>
      )}
    </button>
  );
}; 