'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react'; 

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show the button when the user scrolls past a certain point (100px)
  const toggleVisibility = () => {
    const offset = window.pageYOffset;

    if (offset > 150) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    // Wait until component fully mounts to add scroll listener
    // Otherwise it scrolls down on page load
    const handleScroll = () => toggleVisibility();
    setTimeout(() => window.addEventListener('scroll', handleScroll), 0);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="fixed bottom-10 right-10">
      {isVisible && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex px-4 py-2 rounded-full bg-accent-medium text-white shadow-lg hover:opacity-75 transition duration-300"
        >
          <p className="font-bold mr-2">Scroll Up</p>
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default ScrollToTop;
