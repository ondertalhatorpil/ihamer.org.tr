import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PageTransition = ({ imageUrl }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Sayfa değiştiğinde geçiş animasyonunu başlat
    setIsTransitioning(true);

    // 800ms sonra geçiş animasyonunu kapat
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!isTransitioning) return null;

  return (
    <>
      <style>{`
        @keyframes fadeOut {
          0% { opacity: 1; }
          70% { opacity: 1; }
          100% { opacity: 0; }
        }
        
        @keyframes scaleIn {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .page-transition-overlay {
          animation: fadeOut 800ms ease-in-out forwards;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        
        .page-transition-image {
          animation: scaleIn 500ms ease-out forwards;
        }
      `}</style>
      
      <div className="page-transition-overlay fixed inset-0 z-[99999] flex items-center justify-center bg-white/80">
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={imageUrl || '/transition-image.png'}
            alt="Yükleniyor..."
            className="page-transition-image max-w-md w-full h-auto object-contain px-8 drop-shadow-2xl"
          />
        </div>
      </div>
    </>
  );
};

export default PageTransition;