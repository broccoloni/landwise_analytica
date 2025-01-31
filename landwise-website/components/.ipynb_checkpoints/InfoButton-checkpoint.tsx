'use client';

import { useState, useRef, useEffect } from 'react';
import { CircleHelp } from 'lucide-react';
import clsx from 'clsx';

interface InfoButtonProps {
  children: React.ReactNode;
  size?: number;
  className?: string; // Optional className for custom styling
}

const InfoButton: React.FC<InfoButtonProps> = ({ children, size = 30, className }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState<'left' | 'right'>('left');
  const popupRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const togglePopup = () => {
    setIsVisible((prev) => !prev);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      popupRef.current &&
      !popupRef.current.contains(e.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(e.target as Node)
    ) {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    if (isVisible && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      // Determine popup position based on button position
      if (buttonRect.left + 300 > viewportWidth) {
        setPopupPosition('right'); // Move popup to the left
      } else {
        setPopupPosition('left'); // Keep popup on the right
      }
    }
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => document.removeEventListener('click', handleClickOutside);
  }, [isVisible]);

  return (
    <div className={clsx('relative inline-block', className)}>
      <button
        ref={buttonRef}
        onClick={togglePopup}
        className=""
      >
        <CircleHelp className="text-gray-800 dark:text-medium-green" size={size} />
      </button>

      {isVisible && (
        <div
          ref={popupRef}
          className={clsx(
            'absolute mt-2 w-96 p-4 bg-white dark:text-white dark:bg-gray-500 border rounded shadow-lg z-10',
            popupPosition === 'left' ? 'left-0' : 'right-0'
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default InfoButton;
