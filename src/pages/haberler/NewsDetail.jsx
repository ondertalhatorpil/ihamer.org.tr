import React, { useState, useRef, useEffect } from "react";
import {
  Calendar,
  Share2,
  ChevronLeft,
  ChevronRight,
  Link as LinkIcon,
} from "lucide-react";
import { useParams, Link } from "react-router-dom";
import newsData from "../../news.json";

const NewsDetail = () => {
  const [gallerySliderIndex, setGallerySliderIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [sliderIndex, setSliderIndex] = useState(0);
  const thumbnailContainerRef = useRef(null);

  // Touch events state'leri
  const [galleryTouchStart, setGalleryTouchStart] = useState(null);
  const [galleryTouchEnd, setGalleryTouchEnd] = useState(null);
  const [galleryIsDragging, setGalleryIsDragging] = useState(false);
  const [galleryDragOffset, setGalleryDragOffset] = useState(0);

  const [newsTouchStart, setNewsTouchStart] = useState(null);
  const [newsTouchEnd, setNewsTouchEnd] = useState(null);
  const [newsIsDragging, setNewsIsDragging] = useState(false);
  const [newsDragOffset, setNewsDragOffset] = useState(0);

  const [lightboxTouchStart, setLightboxTouchStart] = useState(null);
  const [lightboxTouchEnd, setLightboxTouchEnd] = useState(null);
  const [lightboxIsDragging, setLightboxIsDragging] = useState(false);
  const [lightboxDragOffset, setLightboxDragOffset] = useState(0);

  const { newsId } = useParams();
  const allNews = newsData;
  const selectedNews = allNews.find((news) => String(news.id) === newsId);

  const minSwipeDistance = 30;

  // --- Touch Handlers ---
  const onGalleryTouchStart = (e) => {
    setGalleryTouchStart(e.targetTouches[0].clientX);
    setGalleryTouchEnd(null);
    setGalleryIsDragging(true);
    setGalleryDragOffset(0);
  };

  const onGalleryTouchMove = (e) => {
    if (!galleryTouchStart) return;
    const currentTouch = e.targetTouches[0].clientX;
    setGalleryTouchEnd(currentTouch);
    setGalleryDragOffset(currentTouch - galleryTouchStart);
  };

  const onGalleryTouchEnd = () => {
    setGalleryIsDragging(false);
    if (!galleryTouchStart || !galleryTouchEnd) {
      setGalleryDragOffset(0);
      return;
    }
    const distance = galleryTouchStart - galleryTouchEnd;
    if (Math.abs(distance) > minSwipeDistance) {
      distance > 0 ? nextGallerySlide() : prevGallerySlide();
    }
    setGalleryDragOffset(0);
    setGalleryTouchStart(null);
    setGalleryTouchEnd(null);
  };

  const onNewsTouchStart = (e) => {
    setNewsTouchStart(e.targetTouches[0].clientX);
    setNewsTouchEnd(null);
    setNewsIsDragging(true);
    setNewsDragOffset(0);
  };

  const onNewsTouchMove = (e) => {
    if (!newsTouchStart) return;
    const currentTouch = e.targetTouches[0].clientX;
    setNewsTouchEnd(currentTouch);
    setNewsDragOffset(currentTouch - newsTouchStart);
  };

  const onNewsTouchEnd = () => {
    setNewsIsDragging(false);
    if (!newsTouchStart || !newsTouchEnd) {
      setNewsDragOffset(0);
      return;
    }
    const distance = newsTouchStart - newsTouchEnd;
    if (Math.abs(distance) > minSwipeDistance) {
      distance > 0 ? nextSlide() : prevSlide();
    }
    setNewsDragOffset(0);
    setNewsTouchStart(null);
    setNewsTouchEnd(null);
  };

  const onLightboxTouchStart = (e) => {
    setLightboxTouchStart(e.targetTouches[0].clientX);
    setLightboxTouchEnd(null);
    setLightboxIsDragging(true);
    setLightboxDragOffset(0);
  };

  const onLightboxTouchMove = (e) => {
    if (!lightboxTouchStart) return;
    const currentTouch = e.targetTouches[0].clientX;
    setLightboxTouchEnd(currentTouch);
    setLightboxDragOffset(currentTouch - lightboxTouchStart);
  };

  const onLightboxTouchEnd = () => {
    setLightboxIsDragging(false);
    if (!lightboxTouchStart || !lightboxTouchEnd) {
      setLightboxDragOffset(0);
      return;
    }
    const distance = lightboxTouchStart - lightboxTouchEnd;
    if (Math.abs(distance) > minSwipeDistance) {
      distance > 0 ? nextLightboxImage() : prevLightboxImage();
    }
    setLightboxDragOffset(0);
    setLightboxTouchStart(null);
    setLightboxTouchEnd(null);
  };

  // --- Helper Functions ---
  const isListyText = (val) => {
    if (typeof val !== "string") return false;
    const lines = val.split(/\r?\n/).map((l) => l.trim());
    const nonEmpty = lines.filter(Boolean);
    if (nonEmpty.length < 3) return false;
    const dashy = nonEmpty.filter((l) => /–|-/.test(l)).length;
    const looksNumbered = nonEmpty.filter((l) => /^\d+\./.test(l)).length;
    return (
      looksNumbered >= Math.ceil(nonEmpty.length * 0.5) ||
      dashy >= Math.ceil(nonEmpty.length * 0.5) ||
      nonEmpty.length >= 10
    );
  };

  const renderLinesList = (val) => {
    const lines = String(val)
      .split(/\r?\n/)
      .map((l) => l.trim());
    return (
      <ul className="list-disc pl-6 space-y-2 mb-6">
        {lines.map((line, idx) => {
          if (!line) return null;
          const clean = line.replace(/^\d+\.\s*/, "");
          if (/^hanımlar$/i.test(clean)) {
            return (
              <li key={idx} className="list-none pl-0 font-semibold mt-4">
                {clean}
              </li>
            );
          }
          return <li key={idx}>{clean}</li>;
        })}
      </ul>
    );
  };

  const handleShare = () => {
    const text = encodeURIComponent(selectedNews.title);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://wa.me/?text=${text}%20${url}`, "_blank");
  };

  const nextSlide = () => {
    const filteredNews = allNews.filter((n) => n.id !== selectedNews.id);
    setSliderIndex((prev) => (prev + 1) % Math.max(1, filteredNews.length - 2));
  };

  const prevSlide = () => {
    const filteredNews = allNews.filter((n) => n.id !== selectedNews.id);
    setSliderIndex(
      (prev) =>
        (prev - 1 + Math.max(1, filteredNews.length - 2)) %
        Math.max(1, filteredNews.length - 2)
    );
  };

  const nextGallerySlide = () => {
    if (selectedNews.gallery) {
      setGallerySliderIndex(
        (prev) => (prev + 1) % Math.max(1, selectedNews.gallery.length - 3)
      );
    }
  };

  const prevGallerySlide = () => {
    if (selectedNews.gallery) {
      setGallerySliderIndex(
        (prev) =>
          (prev - 1 + Math.max(1, selectedNews.gallery.length - 3)) %
          Math.max(1, selectedNews.gallery.length - 3)
      );
    }
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "auto";
  };

  const nextLightboxImage = () => {
    setLightboxIndex((prev) => (prev + 1) % selectedNews.gallery.length);
  };

  const prevLightboxImage = () => {
    setLightboxIndex(
      (prev) =>
        (prev - 1 + selectedNews.gallery.length) % selectedNews.gallery.length
    );
  };

  useEffect(() => {
    if (lightboxOpen && thumbnailContainerRef.current && selectedNews.gallery) {
      const container = thumbnailContainerRef.current;
      const thumbnails = container.children;
      if (thumbnails[lightboxIndex]) {
        const thumbnail = thumbnails[lightboxIndex];
        const containerWidth = container.offsetWidth;
        const thumbnailLeft = thumbnail.offsetLeft;
        const thumbnailWidth = thumbnail.offsetWidth;
        const scrollPosition =
          thumbnailLeft - containerWidth / 2 + thumbnailWidth / 2;
        container.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        });
      }
    }
  }, [lightboxIndex, lightboxOpen, selectedNews.gallery]);

  if (!selectedNews) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Haber yükleniyor veya bulunamadı...
      </div>
    );
  }

  return (
    <div className="min-h-screen  overflow-x-hidden">
      {/* Wrapper Section */}

      {/* News Detail */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* News Image */}
          <div className="w-full h-[400px] mb-8 rounded-md overflow-hidden shadow-lg bg-gray-100">
            <img
              src={selectedNews.image}
              alt={selectedNews.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Category Badge */}
          <div className="mb-4">
            <span
              className={`inline-block text-sm font-bold ${
                selectedNews.category === "Haberler"
                  ? "text-amber-700"
                  : "text-indigo-900"
              }`}
            >
              {selectedNews.category}
            </span>
          </div>

          {/* News Title */}
          <h1 className="text-md md:text-2xl font-bold text-gray-900 mb-4 leading-tight">
            {selectedNews.title}
          </h1>

          {/* Date and Speaker */}
          <div className="flex flex-wrap items-center gap-6 text-gray-500 text-lg mb-8 pb-8 border-b-2 border-gray-200">
            <div className="flex items-center gap-2">
              <Calendar size={20} />
              <span>{selectedNews.date}</span>
            </div>

            {selectedNews.category === "İhamer Konuşmaları" &&
              selectedNews.speaker && (
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="font-semibold text-gray-700">Konuk:</span>
                  <span>{selectedNews.speaker}</span>
                </div>
              )}
          </div>

          {/* Content */}
          <div className="relative">
            <div
              className="absolute right-0 left-120 top-0 bottom-0 w-220 bg-no-repeat bg-contain bg-center opacity-30 pointer-events-none hidden lg:block"
              style={{
                backgroundImage:
                  "url('https://ihamer.org.tr/wp-content/uploads/2025/08/kalem_png.png')",
                backgroundSize: "contain",
                backgroundPosition: "center right",
              }}
            />
            <div className="relative z-10 max-w-none lg:pr-96">
              {selectedNews.sections.map((section, index) => {
                // Link Type
                if (section.type === "link") {
                  return (
                    <div key={index} className="my-8">
                      <a
                        href={section.content}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-6 py-4 bg-gray-800 text-white no-underline font-semibold rounded-4xl shadow-md transition-all duration-300 hover:text-[#ae9242] hover:shadow-lg"
                      >
                        <LinkIcon size={20} />
                        <span className="break-all">{section.content}</span>
                      </a>
                    </div>
                  );
                }

                if (section.type === "heading") {
                  return (
                    <h2
                      key={index}
                      className="text-xl md:text-xl font-bold text-gray-700 mt-8 mb-4"
                    >
                      {section.content}
                    </h2>
                  );
                }

                if (
                  section.type === "paragraph" &&
                  isListyText(section.content)
                ) {
                  return (
                    <div key={index}>{renderLinesList(section.content)}</div>
                  );
                }

                return (
                  <p
                    key={index}
                    className="text-gray-500 leading-relaxed mb-6 text-sm md:text-base"
                  >
                    {section.content}
                  </p>
                );
              })}
            </div>
          </div>

          {/* Share Button */}
          <div className="mt-12 pt-8 border-t-2 border-gray-200">
            <button
              onClick={handleShare}
              className="flex items-center gap-3 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-4xl font-semibold transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              <Share2 size={20} />
              <span>WhatsApp'ta Paylaş</span>
            </button>
          </div>

          {/* News Gallery Slider */}
          {selectedNews.gallery && selectedNews.gallery.length > 0 && (
            <div className="mt-16 pt-8 border-t-2 border-gray-200">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">
                  Haber Görselleri
                </h2>

                {/* GALERİ BUTONLARI GÜNCELLENDİ */}
                {selectedNews.gallery.length > 4 && (
                  <div className="flex gap-2">
                    <button
                      onClick={prevGallerySlide}
                      className="group bg-white border border-gray-200 hover:border-[#ae9242] text-gray-600 hover:text-[#ae9242] rounded-full w-10 h-10 flex items-center justify-center shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer"
                    >
                      <svg
                        className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={nextGallerySlide}
                      className="group bg-white border border-gray-200 hover:border-[#ae9242] text-gray-600 hover:text-[#ae9242] rounded-full w-10 h-10 flex items-center justify-center shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer"
                    >
                      <svg
                        className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              <div
                className="overflow-hidden touch-pan-y"
                onTouchStart={onGalleryTouchStart}
                onTouchMove={onGalleryTouchMove}
                onTouchEnd={onGalleryTouchEnd}
              >
                <div
                  className="flex gap-4"
                  style={{
                    transform: `translateX(calc(-${
                      gallerySliderIndex * (100 / 4)
                    }% + ${galleryIsDragging ? galleryDragOffset : 0}px))`,
                    transition: galleryIsDragging
                      ? "none"
                      : "transform 500ms ease-in-out",
                  }}
                >
                  {selectedNews.gallery.map((image, index) => (
                    <div
                      key={index}
                      onClick={() => !galleryIsDragging && openLightbox(index)}
                      // Burada mobil ve desktop genişlik ayarları (önceki isteğinizdeki gibi) korunmuştur.
                      className="min-w-[calc(45%-0.75rem)] sm:min-w-[calc(33.333%-0.75rem)] md:min-w-[calc(25%-0.75rem)] lg:min-w-[calc(20%-0.75rem)] relative h-48 rounded-lg overflow-hidden cursor-pointer group shadow-md hover:shadow-xl transition-all duration-300"
                    >
                      {/* Ana Galeri Resmi */}
                      <img
                        src={image}
                        alt={`Galeri ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 select-none pointer-events-none relative z-0"
                        draggable="false"
                      />

                      {/* LOGO OVERLAY KATMANI */}
                      {/* 1. absolute inset-0: Resmi tamamen kapla.
        2. flex items-center justify-center: İçindeki logoyu tam ortaya hizala.
        3. bg-black/0 group-hover:bg-black/30: Üzerine gelince arka planı hafifçe karart (isteğe bağlı).
    */}
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 group-hover:bg-black/50 transition-all duration-300">
                        {/* Logo Resmi */}
                        <img
                          // BURAYA KENDİ LOGO URL'NİZİ YAZIN:
                          src="/src/assets/images/kalem.png"
                          alt="Logo Watermark"
                          // opacity-0: Başlangıçta görünmez.
                          // group-hover:opacity-40: Üzerine gelince %40 opaklıkla görünür (sayıyı artırıp azaltabilirsiniz).
                          // w-1/2: Kutusunun yarısı kadar genişlikte olsun.
                          className="w-1/2 h-auto object-contain opacity-0 group-hover:opacity-100 transition-opacity duration-500 select-none pointer-events-none filter drop-shadow-lg"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Lightbox Modal */}
          {lightboxOpen && selectedNews.gallery && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
              onClick={closeLightbox}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevLightboxImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-[51] bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-all duration-300 cursor-pointer"
              >
                <ChevronLeft size={32} />
              </button>

              <div
                className="max-w-5xl max-h-[80vh] w-full flex items-center justify-center touch-pan-y"
                onClick={(e) => e.stopPropagation()}
                onTouchStart={onLightboxTouchStart}
                onTouchMove={onLightboxTouchMove}
                onTouchEnd={onLightboxTouchEnd}
              >
                <div
                  style={{
                    transform: `translateX(${
                      lightboxIsDragging ? lightboxDragOffset : 0
                    }px)`,
                    transition: lightboxIsDragging
                      ? "none"
                      : "transform 300ms ease-out",
                  }}
                >
                  <img
                    src={selectedNews.gallery[lightboxIndex]}
                    alt={`Galeri ${lightboxIndex + 1}`}
                    className="max-w-full max-h-[80vh] object-contain rounded-lg select-none pointer-events-none"
                    draggable="false"
                  />
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextLightboxImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-[51] bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-all duration-300 cursor-pointer"
              >
                <ChevronRight size={32} />
              </button>

              <div
                ref={thumbnailContainerRef}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-3 p-4 bg-black/50 rounded-lg backdrop-blur-sm overflow-x-auto max-w-[90vw] scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent"
                onClick={(e) => e.stopPropagation()}
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(255,255,255,0.3) transparent",
                }}
              >
                {selectedNews.gallery.map((image, index) => (
                  <div
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex(index);
                    }}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                      index === lightboxIndex
                        ? "opacity-100 ring-2 ring-white"
                        : "opacity-50 hover:opacity-75"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other News Slider */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Diğer Haberler
            </h2>

            <div className="relative">
              {/* DİĞER HABERLER SOL BUTON */}
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 group bg-white border border-gray-200 hover:border-[#ae9242] text-gray-600 hover:text-[#ae9242] rounded-full w-10 h-10 flex items-center justify-center shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer"
                aria-label="Önceki"
              >
                <svg
                  className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <div
                className="overflow-hidden touch-pan-y"
                onTouchStart={onNewsTouchStart}
                onTouchMove={onNewsTouchMove}
                onTouchEnd={onNewsTouchEnd}
              >
                <div
                  className="flex gap-4"
                  style={{
                    transform: `translateX(calc(-${
                      sliderIndex * (100 / 3)
                    }% + ${newsIsDragging ? newsDragOffset : 0}px))`,
                    transition: newsIsDragging
                      ? "none"
                      : "transform 500ms ease-in-out",
                  }}
                >
                  {allNews
                    .filter((n) => n.id !== selectedNews.id)
                    .map((item) => (
                      <Link
                        key={item.id}
                        to={`/haber/${item.id}`}
                        onClick={(e) => newsIsDragging && e.preventDefault()}
                        className="min-w-[calc(65%-1rem)] sm:min-w-[calc(50%-1rem)] md:min-w-[calc(40%-1rem)] lg:min-w-[calc(33.333%-1rem)] group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:-translate-y-1"
                      >
                        <div className="relative h-40 overflow-hidden bg-gray-100">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 select-none pointer-events-none"
                            draggable="false"
                          />
                        </div>

                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className={`text-xs font-bold ${
                                item.category === "Haberler"
                                  ? "text-amber-700"
                                  : "text-indigo-900"
                              }`}
                            >
                              {item.category}
                            </span>
                          </div>

                          <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem] leading-tight">
                            {item.title}
                          </h3>

                          <div className="flex items-center gap-2 text-gray-500 text-xs">
                            <Calendar size={12} />
                            <span>{item.date}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>

              {/* DİĞER HABERLER SAĞ BUTON */}
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 group bg-white border border-gray-200 hover:border-[#ae9242] text-gray-600 hover:text-[#ae9242] rounded-full w-10 h-10 flex items-center justify-center shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer"
                aria-label="Sonraki"
              >
                <svg
                  className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-12 text-start">
            <Link
              to="/haberler"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-4xl font-semibold transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              <ChevronLeft size={20} />
              <span>Tüm Haberlere Dön</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
