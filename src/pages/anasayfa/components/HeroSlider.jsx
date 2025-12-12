import React, { useState, useEffect, useRef, useCallback } from 'react';

const sliderImages = [
  "/public/kurumsal/assest/hikmetinİzindeAfisSlider.jpg",
  "/public/kurumsal/assest/slider-1.jpeg",
  "/public/kurumsal/assest/slider-2.jpeg",
  "/public/kurumsal/assest/slider-3.jpeg",
  "/public/kurumsal/assest/slider-4.jpeg",
  "/public/kurumsal/assest/slider-5.jpeg",
  "/public/kurumsal/assest/slider-6.jpeg",

];

const HeroSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    
    const trackRef = useRef(null);
    const sliderRef = useRef(null);
    const intervalRef = useRef(null);

    // Kaydırma (Swipe) hassasiyeti (piksel cinsinden)
    const minSwipeDistance = 50;

    const goToSlide = useCallback((index) => {
        if (trackRef.current && sliderRef.current) {
            const slideWidth = sliderRef.current.clientWidth;
            trackRef.current.style.transform = `translateX(-${index * slideWidth}px)`;
            setCurrentIndex(index);
        }
    }, []);

    const pauseAutoPlay = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    }, []);

    const startAutoPlay = useCallback(() => {
        pauseAutoPlay();
        intervalRef.current = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % sliderImages.length);
        }, 5000);
    }, [pauseAutoPlay]);

    // --- SWIPE (DOKUNMATİK) MANTIĞI BAŞLANGICI ---
    const onTouchStart = (e) => {
        pauseAutoPlay(); // Dokunulduğunda otomatiği durdur
        setTouchEnd(null); // Reset
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        startAutoPlay(); // Bırakıldığında tekrar başlat
        if (!touchStart || !touchEnd) return;
        
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            // Sola kaydırıldı -> Sonraki slayt
            const nextIndex = currentIndex === sliderImages.length - 1 ? 0 : currentIndex + 1;
            goToSlide(nextIndex);
        }
        
        if (isRightSwipe) {
            // Sağa kaydırıldı -> Önceki slayt
            const prevIndex = currentIndex === 0 ? sliderImages.length - 1 : currentIndex - 1;
            goToSlide(prevIndex);
        }
    };
    // --- SWIPE MANTIĞI BİTİŞİ ---

    useEffect(() => {
        if (trackRef.current && sliderRef.current) {
            const slideWidth = sliderRef.current.clientWidth;
            trackRef.current.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        }
    }, [currentIndex]);

    useEffect(() => {
        startAutoPlay();
        const sliderElement = sliderRef.current;
        if (sliderElement) {
            sliderElement.addEventListener('mouseenter', pauseAutoPlay);
            sliderElement.addEventListener('mouseleave', startAutoPlay);
        }
        
        return () => {
            pauseAutoPlay();
            if (sliderElement) {
                sliderElement.removeEventListener('mouseenter', pauseAutoPlay);
                sliderElement.removeEventListener('mouseleave', startAutoPlay);
            }
        };
    }, [startAutoPlay, pauseAutoPlay]);

    useEffect(() => {
        const handleResize = () => {
            if (trackRef.current && sliderRef.current) {
                const slideWidth = sliderRef.current.clientWidth;
                setCurrentIndex(latestIndex => {
                    trackRef.current.style.transform = `translateX(-${latestIndex * slideWidth}px)`;
                    return latestIndex;
                });
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <section 
            ref={sliderRef} 
            className="relative overflow-hidden w-full bg-accent-gold m-0 touch-pan-y" // touch-pan-y: dikey kaydırmaya izin ver, yatayı js ile kontrol et
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            <div ref={trackRef} className="flex transition-transform duration-700 ease-in-out select-none">
                {sliderImages.map((src, index) => (
                    <div key={index} className="flex-shrink-0 w-full relative block">
                        <div className="relative w-full">
                            <img 
                                src={src} 
                                alt={`Ana Görsel ${index + 1}`} 
                                className="block w-full h-auto pointer-events-none" // Resimlerin sürüklenmesini engelle (native drag)
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* NAVIGASYON NOKTALARI */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-[3] flex flex-row gap-2 max-w-[calc(100%-2rem)] p-1.5 
                            md:flex-col md:gap-1.5 md:top-1/2 md:left-auto md:right-4 md:bottom-auto md:-translate-y-1/2 md:translate-x-0 
                            md:w-4 md:h-[60vh] md:justify-center">
                {sliderImages.map((_, index) => {
                    const isActive = currentIndex === index;
                    return (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            /* Mantık:
                                flex-1: Standart boyut.
                                flex-[4]: Aktif olan diğerlerinin 4 katı yer kaplamaya çalışsın.
                                max-h-12: Aktif olan çok da devasa olmasın.
                                min-h-[4px]: Pasif olanlar tamamen kaybolmasın.
                            */
                            className={`cursor-pointer transition-all duration-500 rounded-full 
                                        flex-shrink-0 w-2.5 h-2.5
                                        md:w-[8px] md:flex-shrink md:h-auto md:min-h-[6px]
                                        ${isActive 
                                            ? 'bg-[#B58E65] md:flex-[5] md:max-h-16 shadow-[0_0_10px_rgba(181,142,101,0.6)]' 
                                            : 'bg-gray-800/80 hover:bg-gray-600 md:flex-1 md:max-h-3'
                                        }`}
                            aria-label={`Slayt ${index + 1}'e git`}
                        ></button>
                    );
                })}
            </div>
        </section>
    );
};

export default HeroSlider;