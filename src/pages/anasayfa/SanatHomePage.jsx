import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Music, Palette } from "lucide-react";

const SanatHomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-teal-700 to-teal-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Sanat Programı Uygulayan Anadolu İmam Hatip Liseleri
          </h1>
          <p className="text-purple-100">
            Geleneksel/Çağdaş Görsel Sanatlar ve Musiki Programları
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
      <div className="container mx-auto max-w-6xl px-4 pb-12">
        <div className=" rounded-lg  p-8 space-y-6">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-teal-800 mb-4">
              Geleneksel/Çağdaş Görsel Sanatlar ve Musiki Programı Uygulayan
              Anadolu İmam Hatip Liseleri
            </h2>

            <p className="text-gray-700 leading-relaxed">
              Sanat programı uygulayan Anadolu İmam Hatip Liseleri
              medeniyetimizin ihyâ ve inşâsında sorumluluk sahibi akl-ı selim,
              kalb-i selim ve zevk-i selim sahibi kültür ve sanat alanında millî
              ve mânevî değerleri benimsemiş, topluma rol model olan güzel
              ahlaklı bireylerin yetiştirilmesini hedeflemektedir.
            </p>

            <p className="text-gray-700 leading-relaxed">
              Sanat Programı Uygulayan Anadolu İmam Hatip Liselerinde hüsn-i
              hat, ebru, tezhip, kaligrafi, resim gibi geleneksel ve çağdaş
              görsel sanatlar, ney, kanun, ud, tambur, bendir, keman ve bağlama
              gibi mûsikî enstrümanları, Kur'an-ı Kerim'i güzel okuma ve cami
              mûsikîsi formlarının icrası, ses terbiyesi ve mûsikî eğitimi ile
              geleneksel güfte ve bestelerin seslendirilmesi gibi eğitimler
              verilmektedir.
            </p>

            <p className="text-gray-700 leading-relaxed">
              Bu okullarda üniversitelerle iş birliği içerisinde
              akademisyenlerin ve sanatkârlar okul danışma kurullarında yer
              almaktadır. Öğrenciler eğitimleri boyunca kültür ve sanat alanında
              gerçekleştirilen yurt içi ve yurt dışı konser ve sergilere katılma
              imkânı elde etmektedirler.
            </p>

            <p className="text-gray-700 leading-relaxed">
              Müfredatları ise temel derslerde Anadolu Liseleri ile aynı öğretim
              programları ve haftalık ders saatleri olarak düzenlenmiştir.
            </p>
          </div>

          {/* Program Selection Cards */}
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            {/* Musiki Kartı */}
            <Link
              to="/sanat-programlari/musiki"
              className="group relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 hover:shadow-3xl hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-teal-800 to-amber-600 opacity-90 group-hover:opacity-95 transition-opacity" />
              <div className="relative p-12 min-h-[350px] flex flex-col justify-center items-center text-white">
                {/* <Music className="w-16 h-16 mb-6 group-hover:scale-110 transition-transform" /> */}
                <img src="/kurumsal/assest/musiki1.png" alt="kanun" className="w-46 h-46 mb-6 group-hover:scale-110 transition-transform" />
                <h2 className="text-3xl font-bold mb-4 text-center">
                  Musiki Programı
                </h2>
                <p className="text-center text-blue-100 mb-6 max-w-md">
                  Geleneksel Türk musikisi ve cami musikisi eğitimi veren
                  okullarımız
                </p>
                <span className="inline-block px-8 py-3 border-2 border-amber-400 text-amber-400 rounded-full font-semibold uppercase tracking-wide group-hover:bg-amber-400 group-hover:text-teal-900 transition-all">
                  Okulları Keşfet
                </span>
              </div>
            </Link>

            {/* Görsel Sanatlar Kartı */}
            <Link
              to="/sanat-programlari/gorsel-sanatlar"
              className="group relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 hover:shadow-3xl hover:scale-105"
            >
               <div className="absolute inset-0 bg-gradient-to-br from-teal-800 to-amber-600 opacity-90 group-hover:opacity-95 transition-opacity" />
              <div className="relative p-12 min-h-[350px] flex flex-col justify-center items-center text-white">
              <img src="/kurumsal/assest/görsellogo1.png" alt="çini" className="w-36 h-36 mb-6 group-hover:scale-110 transition-transform" />
                <h2 className="text-3xl font-bold mb-4 text-center">
                  Geleneksel Ve Çağdaş Görsel Sanatlar Programı
                </h2>
                <p className="text-center text-pink-100 mb-6 max-w-md">
                  Hat, ebru, tezhip gibi geleneksel sanatlar eğitimi veren
                  okullarımız
                </p>
                
                <span className="inline-block px-8 py-3 border-2 border-teal-400 text-teal-400 rounded-full font-semibold uppercase tracking-wide group-hover:bg-teal-400 group-hover:text-amber-900 transition-all">
                  Okulları Keşfet
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SanatHomePage;
