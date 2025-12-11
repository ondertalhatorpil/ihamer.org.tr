import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTopButton = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-[9999] bg-teal-700 text-white p-4 rounded-full shadow-2xl hover:bg-teal-800 transition-all duration-300 hover:scale-110"
          aria-label="Yukarı Çık"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </>
  );
};

export default ScrollToTopButton;