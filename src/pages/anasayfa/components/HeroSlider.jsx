import React, { useState, useEffect, useRef, useCallback } from 'react';

// Linklerinizi buraya giriniz.
// "http" veya "https" ile başlayanlar YENİ SEKMEDE açılır.
// "/" ile başlayanlar (örn: /iletisim) AYNI SEKMEDE açılır.
const sliderImages = [
  { 
    src: "/kurumsal/assest/talim.jpg", 
    link: "https://dergipark.org.tr/tr/pub/talim/rejection-statistics" // Site içi (Aynı sekme)
  },
  { 
    src: "/kurumsal/assest/slider-0.jpg", 
    link: "https://www.hikmetinizinde.com/" // Site dışı (Yeni sekme)
  },
  { 
    src: "/kurumsal/assest/slider-1.jpeg", 
    link: "/haber/4" 
  },
  { 
    src: "/kurumsal/assest/slider-2.jpeg", 
    link: "/haber/3" 
  },
  { 
    src: "/kurumsal/assest/slider-3.jpeg", 
    link: "/haber/2" // Tıklanınca bir şey yapmaz
  },
  { 
    src: "/kurumsal/assest/slider-4.jpeg", 
    link: "https://onder.org.tr/data/uploads/document/690db6105f192.pdf" 
  },
  { 
    src: "/kurumsal/assest/slider-5.jpeg", 
    link: "#" 
  },
  { 
    src: "/kurumsal/assest/slider-6.jpeg", 
    link: "#" 
  },
];

const HeroSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    
    const trackRef = useRef(null);
    const sliderRef = useRef(null);
    const intervalRef = useRef(null);

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

    const onTouchStart = (e) => {
        pauseAutoPlay();
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        startAutoPlay();
        if (!touchStart || !touchEnd) return;
        
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            const nextIndex = currentIndex === sliderImages.length - 1 ? 0 : currentIndex + 1;
            goToSlide(nextIndex);
        }
        
        if (isRightSwipe) {
            const prevIndex = currentIndex === 0 ? sliderImages.length - 1 : currentIndex - 1;
            goToSlide(prevIndex);
        }
    };

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
            className="relative overflow-hidden w-full bg-accent-gold m-0 touch-pan-y"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            <div ref={trackRef} className="flex transition-transform duration-700 ease-in-out select-none">
                {sliderImages.map((slide, index) => {
                    // KONTROL MANTIĞI: Link http veya https ile başlıyor mu?
                    const isExternal = slide.link.startsWith('http');

                    return (
                        <div key={index} className="flex-shrink-0 w-full relative block">
                            <a 
                                href={slide.link} 
                                className="block w-full h-full cursor-pointer"
                                draggable="false"
                                // Eğer dış link ise '_blank', değilse undefined (varsayılan aynı sekme)
                                target={isExternal ? "_blank" : undefined}
                                // Eğer dış link ise güvenlik önlemi ekle, değilse undefined
                                rel={isExternal ? "noopener noreferrer" : undefined}
                            >
                                <div className="relative w-full">
                                    <img 
                                        src={slide.src} 
                                        alt={`Ana Görsel ${index + 1}`} 
                                        className="block w-full h-auto pointer-events-none" 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
                                </div>
                            </a>
                        </div>
                    );
                })}
            </div>

            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-[3] flex flex-row gap-2 max-w-[calc(100%-2rem)] p-1.5 
                            md:flex-col md:gap-1.5 md:top-1/2 md:left-auto md:right-4 md:bottom-auto md:-translate-y-1/2 md:translate-x-0 
                            md:w-4 md:h-[60vh] md:justify-center">
                {sliderImages.map((_, index) => {
                    const isActive = currentIndex === index;
                    return (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
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