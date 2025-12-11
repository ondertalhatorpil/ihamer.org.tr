import React from "react";
import { Link } from "react-router-dom";
import { Trophy, ChevronLeft, ChevronDown } from "lucide-react";

const SporHomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-teal-700 to-teal-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Spor Programları
          </h1>
          <p className="text-purple-100">
            Spor programı uygulayan Anadolu İmam Hatip Liseleri akademik ve
            sportif hedeflerle birlikte millî, mânevî, ahlâkî, insânî ve
            kültürel değerlere sahip sporcuların yetiştirilmesini
            hedeflemektedir.
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

      {/* Content Section */}
      <section className="container mx-auto max-w-6xl px-4 pb-12">
        <div className="rounded-lg p-8 space-y-6">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-green-900 mb-4">
              Spor Programı Uygulayan Anadolu İmam Hatip Liseleri
            </h2>

            <p className="text-gray-700 leading-relaxed">
              Spor programı uygulayan Anadolu İmam Hatip Liseleri akademik ve
              sportif hedeflerle birlikte millî, mânevî, ahlâkî, insânî ve
              kültürel değerlere sahip sporcuların yetiştirilmesini
              hedeflemektedir.
            </p>

            <p className="text-gray-700 leading-relaxed">
              Bu okullarda güreş ve okçuluk gibi geleneksel ve millî sporları,
              futbol, basketbol, voleybol, hentbol, atletizm ve yüzme gibi
              popüler spor dalları, karate, taekwondo, kungfu, judo, wushu vb.
              Uzakdoğu sporları seçilebilmektedir.
            </p>

            <p className="text-gray-700 leading-relaxed">
              Lise eğitimi boyunca öğrenciler yerel, ulusal ve uluslararası
              düzeyde spor yarışmalarına, turnuvalara ve olimpiyatlara katılma
              imkânı elde etmektedirler. Bununla birlikte öğrenciler akademik ve
              mesleki eğitimle birlikte eş zamanlı olarak spor programıyla
              üniversitelere, Beden Eğitimi ve Spor Yüksekokullarına ve Spor
              Bilimleri Fakültelerine hazırlanmaktadırlar.
            </p>

            <p className="text-gray-700 leading-relaxed font-semibold">
              Spor programı uygulayan Anadolu İmam Hatip Liselerinden mezun olan
              öğrenciler aynı zamanda yardımcı antrenörlük belgesi almaya da hak
              kazanmaktadır.
            </p>
          </div>

          {/* Okulları Keşfet Butonu */}
          <div className="flex justify-center mt-10">
            <Link
              to="/spor-programlari/okullar"
              className="inline-flex items-center gap-3 px-8 py-4 bg-teal-700 text-white rounded-full font-semibold text-lg hover:bg-teal-800 transition-all transform hover:scale-105 shadow-lg"
            >
              <Trophy className="w-6 h-6" />
              Okulları Keşfet
              <ChevronDown className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SporHomePage;
