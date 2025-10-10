import React, { useState, useEffect, useRef, useCallback } from 'react';

const sliderImages = [
  "https://ihamer.org.tr/wp-content/uploads/2025/07/WhatsApp-Image-2025-07-29-at-14.21.02-1600x468.jpeg",
  "https://ihamer.org.tr/wp-content/uploads/2025/07/WhatsApp-Image-2025-07-29-at-14.10.30-1600x468.jpeg",
  "https://ihamer.org.tr/wp-content/uploads/2024/10/IHAMER-100-1959x574.jpg",
  "https://ihamer.org.tr/wp-content/uploads/2024/05/Turkiyenin-Imam-Hatipleri-ve-Muhafazakar-Toplumsal-Hareketlilik.webp",
  "https://ihamer.org.tr/wp-content/uploads/2024/05/Lise-Ogrencilerinin-Imam-Hatip-Tercih-Etme-Nedenleri.webp",
  "https://ihamer.org.tr/wp-content/uploads/2024/05/Turkiyede-Din-Egitimi-ve-Imam-Hatip-Okullari.webp",
];

const HeroSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const trackRef = useRef(null);
    const sliderRef = useRef(null);
    const intervalRef = useRef(null);

    const goToSlide = useCallback((index) => {
        if (trackRef.current && sliderRef.current) {
            const slideWidth = sliderRef.current.clientWidth;
            trackRef.current.style.transform = `translateX(-${index * slideWidth}px)`;
            setCurrentIndex(index);
        }
    }, []);

    const startAutoPlay = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setCurrentIndex(prevIndex => {
                const nextIndex = (prevIndex + 1) % sliderImages.length;
                return nextIndex;
            });
        }, 5000);
    }, []);

    useEffect(() => {
        goToSlide(currentIndex);
    }, [currentIndex, goToSlide]);

    useEffect(() => {
        startAutoPlay();
        
        const sliderElement = sliderRef.current;
        sliderElement.addEventListener('mouseenter', () => clearInterval(intervalRef.current));
        sliderElement.addEventListener('mouseleave', startAutoPlay);

        const resizeObserver = new ResizeObserver(() => {
            goToSlide(currentIndex);
        });
        if (trackRef.current) {
            resizeObserver.observe(trackRef.current);
        }

        return () => {
            clearInterval(intervalRef.current);
            if (sliderElement) {
              sliderElement.removeEventListener('mouseenter', () => clearInterval(intervalRef.current));
              sliderElement.removeEventListener('mouseleave', startAutoPlay);
            }
            if (trackRef.current) {
              resizeObserver.unobserve(trackRef.current);
            }
        };
    }, [startAutoPlay, goToSlide, currentIndex]);


    return (
        <section ref={sliderRef} className="relative overflow-hidden w-full bg-accent-gold m-0">
            <div ref={trackRef} className="flex transition-transform duration-700 ease-in-out">
                {sliderImages.map((src, index) => (
                    <a href="#" key={index} className="flex-shrink-0 w-full relative block">
                        <div className="relative w-full">
                            <img src={src} alt={`Ana Görsel ${index + 1}`} className="block w-full h-auto" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
                        </div>
                    </a>
                ))}
            </div>

            {/* KAPSAYICI DIV'İ RESPONSIVE HALE GETİRİLDİ */}
            {/* Mobil: altta, ortada, yatay | Masaüstü (md): sağda, ortada, dikey */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-[3] flex flex-row gap-2 max-w-[calc(100%-2rem)] overflow-x-auto p-1.5 
                            md:flex-col md:gap-3 md:top-1/2 md:left-auto md:right-4 md:bottom-auto md:-translate-y-1/2 md:translate-x-0 md:max-w-none md:overflow-y-auto md:max-h-[70vh]">
                {sliderImages.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        // BUTONLAR RESPONSIVE HALE GETİRİLDİ
                        // Mobil: küçük, daire | Masaüstü (md): büyük, dikey
                        className={`cursor-pointer transition-all duration-300 flex-shrink-0 rounded-full w-2.5 h-2.5 md:w-[8px] md:h-8
                                    ${currentIndex === index ? 'bg-[#B58E65] scale-125 md:scale-y-125 md:scale-100' : 'bg-gray-800'}`}
                        aria-label={`Slayt ${index + 1}'e git`}
                    ></button>
                ))}
            </div>
        </section>
    );
};

export default HeroSlider;