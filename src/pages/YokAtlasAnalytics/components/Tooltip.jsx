import React from 'react';

const Tooltip = ({ text, children, position = 'top' }) => {
  // Pozisyon sınıfları
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  // Ok (Arrow) sınıfları
  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-slate-800',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-slate-800',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-slate-800',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-slate-800'
  };

  return (
    <div className="relative group inline-flex items-center justify-center">
      {/* Trigger Element (Üzerine gelinen öğe) */}
      <div className="cursor-help">
        {children}
      </div>

      {/* Tooltip Popup */}
      <div 
        className={`absolute ${positionClasses[position] || positionClasses.top} 
        w-max max-w-[250px] px-3 py-2 bg-slate-800 text-white text-xs font-medium rounded-lg shadow-xl 
        opacity-0 invisible group-hover:opacity-100 group-hover:visible 
        transition-all duration-200 z-[999] pointer-events-none text-center leading-relaxed whitespace-normal break-words`}
      >
        {text}
        
        {/* Küçük ok işareti */}
        <div className={`absolute border-4 border-transparent ${arrowClasses[position] || arrowClasses.top}`}></div>
      </div>
    </div>
  );
};

export default Tooltip;