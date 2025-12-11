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
      <div 
        // bg-center sınıfı resmin ortasını odaklar
        className="w-full px-5 h-[220px] relative flex flex-col md:justify-start md:items-start justify-center items-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/public/kurumsal/assest/wrapper-2.png')"
        }}
      >
        {/* Overlay - DEĞİŞTİRİLDİ: Soldan sağa gradient (Solda koyu, sağa doğru şeffaflaşan) */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
        
        {/* Content */}
        <div className="relative z-[2] text-white md:text-left text-center">
          <p className="text-white text-4xl font-black mt-2.5 text-center md:text-left mb-7 mt-14">Haberler</p>
          <h1 className="mt-2">
            <a href="/" className="text-white no-underline font-bold text-xl hover:opacity-80 transition-opacity">
              <span>Anasayfa</span>
              <i className="fas fa-angle-right text-[0.8rem] mx-2"></i>
            </a>
            <a href="/haberler" className="text-white no-underline font-bold hover:opacity-80 text-xl">
              <span>Haberler</span>
            </a>
          </h1>
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