import React from "react";
import newsData from "../../news.json";
import NewsCard from "./NewsCard";
import { Link } from "react-router-dom"; 

export default function NewsPage() {

  // Haberleri ID'ye göre büyükten küçüğe sıralıyoruz (En yeni en üstte)
  // [...newsData] diyerek orijinal diziyi bozmadan (mutate etmeden) bir kopyasını alıp sıralıyoruz.
  const sortedNews = [...newsData].sort((a, b) => b.id - a.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Wrapper Section */}
      <div className="relative w-full h-[180px] md:h-[240px] overflow-hidden bg-gradient-to-br from-[#1a1826] via-[#2d3035] to-[#1a1826]">
        {/* Overlay pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1" fill="white"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)"/>
          </svg>
        </div>
        
        {/* Dekoratif element */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#b48f65] via-[#ae9242] to-transparent"></div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto h-full flex flex-col justify-center px-4 md:px-8">
          {/* Breadcrumb - Üstte */}
          <nav className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm mb-3 md:mb-6">
            <a
              href="/"
              className="text-white/80 hover:text-white transition-colors duration-300 flex items-center gap-1.5 md:gap-2 group"
            >
              <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="group-hover:underline text-xs md:text-sm">Anasayfa</span>
            </a>
            <svg className="w-3 h-3 md:w-4 md:h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white font-medium text-xs md:text-sm">Haberler</span>
          </nav>

          {/* Title */}
          <div className="space-y-1.5 md:space-y-2">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="hidden md:block w-8 md:w-12 h-1 bg-gradient-to-r from-[#b48f65] to-[#ae9242] rounded-full"></div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                Haberler
              </h1>
            </div>
            <p className="text-white/80 text-xs md:text-base font-light max-w-2xl pl-0 md:pl-14">
              İmam Hatip Araştırma ve Eğitim Merkezi Haberler Sayfası
            </p>
          </div>
        </div>

        {/* Dekoratif pattern - sağ alt köşe */}
        <div className="absolute bottom-0 right-0 w-24 h-24 md:w-48 md:h-48 opacity-10">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="180" cy="180" r="100" fill="none" stroke="url(#gradient)" strokeWidth="2"/>
            <circle cx="180" cy="180" r="70" fill="none" stroke="url(#gradient)" strokeWidth="1.5"/>
            <circle cx="180" cy="180" r="40" fill="none" stroke="url(#gradient)" strokeWidth="1"/>
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#b48f65"/>
                <stop offset="100%" stopColor="#ae9242"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* News Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* sortedNews kullanılarak map ediliyor */}
          {sortedNews.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}