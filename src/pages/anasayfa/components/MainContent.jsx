import React, {
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
  useMemo,
} from "react";
import News from "../../../news.json"; // Dosya yolunuzun doğru olduğundan emin olun
import { Link } from "react-router-dom";

// İkon bileşeni
const ClockIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="currentColor"
    className={props.className}
    viewBox="0 0 16 16"
  >
    <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
  </svg>
);

const programData = [
    {
      img: "/public/kurumsal/assest/dil.jpg",
      title: "Dil",
      desc: "Dil Ağırlıklı Eğitim Veren İmam Hatip Liseleri",
      link: "/dil-programlari",
    },
    {
      img: "/public/kurumsal/assest/sanat.jpg",
      title: "Sanat",
      desc: "Geleneksel ve Çağdaş Görsel Sanatlar Programı Uygulayan İmam Hatip Liseleri",
      link: "/sanat-programlari",
    },
    {
      img: "/public/kurumsal/assest/teknoloji.jpg",
      title: "Teknoloji",
      desc: "Teknoloji Ağırlıklı İmam Hatip Liseleri",
      link: "/teknoloji-programlari",
    },
    {
      img: "/public/kurumsal/assest/spor.jpg",
      title: "Spor",
      desc: "Spor Programı Uygulayan İmam Hatip Liseleri",
      link: "/spor-programlari",
    },
    {
      img: "/public/kurumsal/assest/hafizlik.jpg",
      title: "Hafızlık",
      desc: "Hafızlık Pekiştirme Programı Uygulayan İmam Hatip Liseleri ve İmam Hatip Ortaokulları",
      link: "/HafizlikProgramlari",
    },
    {
      img: "/public/kurumsal/assest/uluslararası.jpg",
      title: "Uluslararası",
      desc: "Uluslararası İmam Hatip Liseleri",
      link: "/uluslararasi-programlar",
    },
  ];

// --- NewsSlider ---
const NewsSlider = ({ category, cards }) => {
  const sliderRef = useRef(null);
  const scrollAmount = 350; 

  const handleNext = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    if (scrollLeft + clientWidth >= scrollWidth - 10) {
      sliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      sliderRef.current.scrollLeft += scrollAmount;
    }
  };

  const handlePrev = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    if (scrollLeft <= 10) {
      sliderRef.current.scrollTo({
        left: scrollWidth - clientWidth,
        behavior: "smooth",
      });
    } else {
      sliderRef.current.scrollLeft -= scrollAmount;
    }
  };

  if (!Array.isArray(cards) || cards.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full text-gray-500">
        Bu kategori için içerik bulunamadı.
      </div>
    );
  }

  return (
    <div className="flex-grow relative min-w-0 h-full">
      <div className="overflow-hidden h-full pb-4 pl-1">
        <div
          ref={sliderRef}
          id={category}
          className="flex gap-4 md:gap-8 transition-transform duration-500 ease-in-out py-2 px-1 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide h-full items-stretch touch-pan-x"
          style={{ cursor: "grab" }}
          onMouseDown={(e) => {
            const slider = sliderRef.current;
            if (!slider) return;
            slider.style.cursor = "grabbing";
            const startX = e.pageX - slider.offsetLeft;
            const scrollLeft = slider.scrollLeft;

            const handleMouseMove = (e) => {
              const x = e.pageX - slider.offsetLeft;
              const walk = (x - startX) * 2;
              slider.scrollLeft = scrollLeft - walk;
            };

            const handleMouseUp = () => {
              slider.style.cursor = "grab";
              document.removeEventListener("mousemove", handleMouseMove);
              document.removeEventListener("mouseup", handleMouseUp);
            };

            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
          }}
        >
          {cards.map((card) => {
            const cardClasses =
              "bg-white shadow-md rounded-lg overflow-hidden min-w-[260px] w-[260px] md:min-w-[290px] md:w-[290px] snap-start flex flex-col h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 block border border-gray-100";

            const cardContent = (
              <>
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-40 md:h-48 object-cover flex-shrink-0"
                />
                <div className="p-4 md:p-5 flex flex-col flex-grow min-h-0">
                  <h3 className="text-sm md:text-lg font-bold text-gray-800 flex-grow line-clamp-3 md:line-clamp-4 mb-3 leading-snug">
                    {card.title}
                  </h3>
                  {card.date && (
                    <p className="text-xs md:text-sm text-gray-500 font-medium flex items-center mt-auto flex-shrink-0 pt-2 border-t border-gray-100">
                      <ClockIcon className="mr-2 text-[#ae9242]" /> {card.date}
                    </p>
                  )}
                </div>
              </>
            );

            if (card.pdfUrl) {
              return (
                <a
                  href={card.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={card.id}
                  className={cardClasses}
                >
                  {cardContent}
                </a>
              );
            }

            return (
              <Link
                to={`/haber/${card.id}`}
                key={card.id}
                className={cardClasses}
              >
                {cardContent}
              </Link>
            );
          })}
        </div>
      </div>
      
      {/* Navigasyon Okları */}
      <div className="hidden md:flex absolute -top-14 right-2 gap-3 z-20">
        <button
          onClick={handlePrev}
          className="group bg-white border border-gray-200 hover:border-[#ae9242] text-gray-600 hover:text-[#ae9242] rounded-full w-10 h-10 flex items-center justify-center shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer"
          aria-label="Önceki"
        >
          <svg 
            className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform duration-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={handleNext}
          className="group bg-white border border-gray-200 hover:border-[#ae9242] text-gray-600 hover:text-[#ae9242] rounded-full w-10 h-10 flex items-center justify-center shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer"
          aria-label="Sonraki"
        >
          <svg 
            className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};
// ---------------------------------------------


const groupNewsByCategory = (newsArray) => {
  const categoryMap = {
    Haberler: "haberler",
    "İhamer Konuşmaları": "konuşmalar",
  };

  return newsArray.reduce((acc, item) => {
    const categorySlug = categoryMap[item.category];
    if (categorySlug) {
      if (!acc[categorySlug]) {
        acc[categorySlug] = [];
      }
      acc[categorySlug].push(item);
    }
    return acc;
  }, {});
};

// --- MainContent ---
const MainContent = () => {
  const [activeCategory, setActiveCategory] = useState("haberler");
  const categories = ["haberler", "konuşmalar", "çalıştaylar", "bilgi-notları"];

  const [indicatorStyle, setIndicatorStyle] = useState({});
  const menuRef = useRef(null);
  const menuItemsRef = useRef({});

  // === DÜZENLEME BURADA YAPILDI ===
  // News verisini ID'ye göre büyükten küçüğe sıralıyoruz (En yeni en üstte)
  const groupedNews = useMemo(() => {
    // Veriyi bozmamak için kopyasını alıp sıralıyoruz
    const sortedNews = [...News].sort((a, b) => b.id - a.id);
    return groupNewsByCategory(sortedNews);
  }, []);

  const calistayData = [
    {
      id: "c1",
      title: `Din Eğitiminde Kur'an-ı Kerim Öğretimi Çalıştayı`,
      image:
        "https://ihamer.org.tr/wp-content/uploads/2025/07/684aa2c9cf731.png",
      pdfUrl: "https://onder.org.tr/data/uploads/document/688876fabd9df.pdf",
    },
    {
      id: "c2",
      title: "Uluslararası İmam Hatip Okulları Çalıştayı",
      image:
        "https://ihamer.org.tr/wp-content/uploads/2025/07/684aa3cbc3598.png",
      pdfUrl: "https://onder.org.tr/data/uploads/document/6888771e45f22.pdf",
    },
    {
      id: "c3",
      title: "İmam Hatip Okullarında Arapça Öğretimi Çalıştayı",
      image:
        "https://ihamer.org.tr/wp-content/uploads/2025/07/684aa34e1ef14-1.png",
      pdfUrl: "https://onder.org.tr/data/uploads/document/68887744526ce.pdf",
    },
  ];

  const bilgiNotuData = [
    {
      id: "b1",
      title: "Bilgi Notu 1",
      image:
        "https://ihamer.org.tr/wp-content/uploads/2024/10/656f0c8c2576e.jpeg",
      pdfUrl: "https://onder.org.tr/data/uploads/document/690db5e698cf2.pdf",
    },
    {
      id: "b2",
      title: "Bilgi Notu 2",
      image:
        "https://ihamer.org.tr/wp-content/uploads/2024/10/Bilgi-Notlari-2.png",
      pdfUrl: " https://onder.org.tr/data/uploads/document/690db6105f192.pdf",
    },
  ];

  const allCategoryData = useMemo(
    () => ({
      ...groupedNews,
      // Manuel verileri de tersine çevirdim ki (c3, b2 gibi) son eklenenler başa gelsin
      çalıştaylar: [...calistayData].reverse(),
      "bilgi-notları": [...bilgiNotuData].reverse(),
    }),
    [groupedNews]
  );

  const updateIndicator = useCallback(() => {
    const activeButton = menuItemsRef.current[activeCategory];
    const menuContainer = menuRef.current;
    if (!activeButton || !menuContainer) return;

    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      setIndicatorStyle({
        left: activeButton.offsetLeft,
        width: activeButton.offsetWidth,
        top: "auto",
        bottom: 0,
        height: "3px",
        borderRadius: "2px",
      });
    } else {
      setIndicatorStyle({
        top: activeButton.offsetTop,
        height: activeButton.offsetHeight,
        left: -2,
        width: "3px",
        bottom: "auto",
        borderRadius: "2px",
      });
    }
  }, [activeCategory]);

  useLayoutEffect(() => {
    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [updateIndicator]);

  return (
    <main className="">
      <section className="max-w-7xl mx-auto my-12 px-4 sm:px-6 overflow-hidden">
        <h2 className="text-center text-3xl font-bold text-[#2c3e50] mb-10">
          Güncel Gelişmeler
        </h2>
        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
          {/* MENÜ */}
          <div
            ref={menuRef}
            className="relative grid grid-cols-4 md:flex md:flex-col md:items-start gap-2 md:gap-0 md:border-r md:border-gray-200 md:min-w-[200px]"
          >
            {/* Indicator */}
            <div
              className="absolute bg-[#ae9242] transition-all duration-500 ease-in-out hidden md:block"
              style={indicatorStyle}
            />

            {categories.map((cat) => (
              <button
                ref={(el) => (menuItemsRef.current[cat] = el)}
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative z-10 text-center md:text-left text-[10px] md:text-lg font-semibold py-2 px-2 md:p-5 rounded-full md:rounded-r-xl transition-all duration-300 capitalize whitespace-normal md:whitespace-nowrap w-full
                  ${
                    activeCategory === cat
                      ? "text-white bg-[#ae9242] md:text-[#ae9242] md:bg-gray-50/50 shadow-lg md:shadow-none"
                      : "text-gray-600 bg-white md:bg-transparent border border-gray-200 md:border-0 hover:bg-gray-50 md:hover:bg-gray-100/30"
                  }`}
              >
                {cat.replace("-", " ")}
              </button>
            ))}
          </div>

          {/* SLIDER ALANI */}
          <div className="flex-grow relative min-w-0 h-[340px] sm:h-[360px] md:h-[440px] md:pt-4">
            {categories.map((cat) => (
              <div
                key={cat}
                className={`transition-opacity duration-500 ease-in-out absolute w-full h-full
                    ${
                      activeCategory === cat
                        ? "opacity-100 z-10"
                        : "opacity-0 pointer-events-none z-0"
                    }`}
              >
                <NewsSlider category={cat} cards={allCategoryData[cat] || []} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alt kısımlar */}
      <div className="h-16 md:h-24 bg-[#b48f65] relative overflow-hidden">
        <div
          className="absolute -top-1 h-[calc(100%+4px)] left-0 w-full bg-white"
          style={{ clipPath: "polygon(0% 0%, 100% 0%, 50% 100%, 0% 0%)" }}
        ></div>
      </div>

      <section className="py-16 px-4 bg-[#b48f65]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-5xl font-bold text-white">
            İmam Hatip Okullarında Program Çeşitliliği
          </h2>
          <p className="text-center text-xl text-[#212529] text- max-w-3xl mx-auto mt-4">
            İmam Hatip Okulları; Dil, Sanat, Teknoloji, Spor, Hafızlık,
            Uluslararası programı uygulayan okulları ile zengin bir program
            çeşitliliğine sahiptir.
          </p>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {programData.map((program, index) => (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden flex flex-col transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl "
              >
                <img
                  src={program.img}
                  alt={program.title}
                  className="w-full h-40 md:h-48 object-cover"
                />
                <div className="p-5 md:p-6 flex flex-col flex-grow">
                  <h3 className="text-lg md:text-3xl font-bold text-gray-800 mb-2 text-center">
                    {program.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 flex-grow mb-4 text-center">
                    {program.desc}
                  </p>

                  <Link
                    to={program.link}
                    className="block w-full text-sm py-2.5 px-4 mt-auto bg-[#212529] text-white text-center rounded-3xl font-semibold transition-all duration-300 hover:bg-[#1a1826] hover:scale-105"
                  >
                    Detaylı Bilgi
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default function App() {
  return (
    <div className="font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      <MainContent />
    </div>
  );
}