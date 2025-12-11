import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, GraduationCap, ChevronLeft } from 'lucide-react';

const HafizlikHomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-teal-700 to-teal-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Hafızlık Programları
          </h1>
          <p className="text-purple-100">
          Millî ve manevi değerlerle donanmış, akademik ve kişisel gelişimini bir arada sürdüren nesiller yetiştirme hedefiyle çıktığımız bu yolda, size en uygun programı keşfedin.
          </p>
        </div>
      </header>
 
   

      {/* Back Button */}
      <div className="container mx-auto max-w-6xl px-4 py-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-teal-700 text-white rounded-full font-semibold hover:bg-teal-800 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Ana Sayfaya Dön
        </Link>
      </div>

      {/* Path Selector */}
      <section className="container mx-auto px-4 pb-16 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* İHO Kartı */}
          <Link
            to="iho"
            className="group relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 hover:shadow-3xl hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-teal-800 opacity-90 group-hover:opacity-95 transition-opacity" />
            <div className="relative p-12 min-h-[400px] flex flex-col justify-center items-center text-white">
            <img src="/public/kurumsal/assest/kuran.png" alt="kanun" className="w-46 h-46 mb-6 group-hover:scale-110 transition-transform" />
              <h2 className="text-3xl font-bold mb-4">Hafız Yetiştiren İHO</h2>
              <p className="text-center text-teal-100 mb-6 max-w-md">
                Ortaokul düzeyinde, örgün eğitimle birlikte hafızlık projesi yürüten okullarımız.
              </p>
              <span className="inline-block px-8 py-3 border-2 border-amber-400 text-amber-400 rounded-full font-semibold uppercase tracking-wide group-hover:bg-amber-400 group-hover:text-teal-900 transition-all">
                Okulları Keşfet
              </span>
            </div>
          </Link>

          {/* AİHL Kartı */}
          <Link
            to="aihl"
            className="group relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 hover:shadow-3xl hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-teal-800 to-amber-600 opacity-90 group-hover:opacity-95 transition-opacity" />
            <div className="relative p-12 min-h-[400px] flex flex-col justify-center items-center text-white">
            <img src="/public/kurumsal/assest/kuran.png" alt="kanun" className="w-46 h-46 mb-6 group-hover:scale-110 transition-transform" />
              <h2 className="text-3xl font-bold mb-4">Hafız Pekiştiren AİHL</h2>
              <p className="text-center text-amber-100 mb-6 max-w-md">
                Lise düzeyinde, hafızlığı pekiştirme ve ilahiyat odaklı eğitim veren okullarımız.
              </p>
              <span className="inline-block px-8 py-3 border-2 border-teal-400 text-teal-400 rounded-full font-semibold uppercase tracking-wide group-hover:bg-teal-400 group-hover:text-amber-900 transition-all">
                Okulları Keşfet
              </span>
            </div>
          </Link>
          
        </div>
      </section>
    </div>
  );
};

export default HafizlikHomePage;