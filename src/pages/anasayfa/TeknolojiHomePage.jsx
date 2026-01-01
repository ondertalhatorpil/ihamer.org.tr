import React from "react";
import { Link } from "react-router-dom";
import { Cpu, ChevronLeft, ChevronDown } from "lucide-react";

const TeknolojiHomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <header className="bg-teal-800 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Teknoloji Programları
          </h1>
          <p className="text-blue-100">
            Teknoloji Ağırlıklı İmam Hatip Liseleri
          </p>
        </div>
      </header>

      {/* Back Button */}
      <div className="container mx-auto max-w-6xl px-4 py-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-teal-800 text-white rounded-full font-semibold hover:bg-teal-900 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Ana Sayfaya Dön
        </Link>
      </div>

      {/* Content Section */}
      <section className="container mx-auto max-w-6xl px-4 pb-12">
        <div className="rounded-lg p-8 space-y-6">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-teal-900 mb-4">
              Yabancı Dil Hazırlık ve Fen Bilimleri Programı Teknoloji Anadolu İmam Hatip Liseleri
            </h2>

            <p className="text-justify text-gray-700 leading-relaxed">
              Teknoloji Anadolu İmam Hatip Liseleri, hızla değişen ve küreselleşen dünyada 
              yabancı dil becerisiyle uluslararası düzeyde rekabet edebilen ve dijital 
              becerileriyle teknoloji üretebilen, uzmanlaştığı alana yönelik öğrendiği teknik 
              İngilizce ile teknolojik kavramları bilen, bu alandaki literatürden okumalar 
              yapabilen ve üretilen teknolojiyi takip edebilen gençler yetiştirmeyi 
              hedeflemektedir.
            </p>

            <p className="text-justify text-gray-700 leading-relaxed">
              Temel derslerde Fen Liseleri ile aynı öğretim programları ve haftalık ders 
              saatleri ile eğitim veren bu okullarda öğrencilerin bilim, teknoloji, mühendislik, 
              sanat ve matematik disiplinleri arasındaki ayrımı ortadan kaldıran, proje tabanlı 
              öğrenmenin gerçekleştiği STEAM eğitimi ile inovasyon becerisine sahip olması 
              beklenmektedir.
            </p>

            <div className="bg-blue-50 p-6 rounded-lg mt-6 border-l-4 border-teal-800">
              <div className="flex items-start gap-3">
                <Cpu className="w-6 h-6 text-teal-800 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Atölye Çalışmaları ve Yarışmalar
                  </h3>
                  <p className="text-justify text-gray-700 text-sm">
                    Teknoloji Anadolu İmam Hatip Liselerinde Matematik, Fizik, Kimya, Biyoloji, 
                    Dijital Teknoloji ve Robotik Kodlama vb. alanlarda atölye çalışmalarıyla 
                    öğrencilerin inovasyon becerilerinin geliştirilmesi, TÜBİTAK ve TEKNOFEST 
                    başta olmak üzere ulusal ve uluslararası düzeyde gerçekleştirilen proje 
                    yarışmaları ve olimpiyatlara Fen Bilimleri kategorilerinin yanında teknoloji 
                    tasarım, yazılım, insansız hava aracı gibi insanlık yararına teknoloji 
                    üreten kategorilerdeki yarışmalara da katılmaları sağlanmaktadır.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-justify text-gray-700 mt-6 leading-relaxed">
              Teknoloji Anadolu İmam Hatip Liselerinde teknoloji ve akademi alanında iyi 
              yetişmiş, dijital çağda ülkemize katkı sunabilecek bilgi, beceri ve deneyim 
              sahibi, millî ve manevi değerlerine bağlı bireyler yetişmesine imkân 
              sağlanmaktadır.
            </p>

            <p className="text-justify text-gray-700 leading-relaxed font-semibold">
              Bilim ve medeniyet tarihimizde öne çıkan bilim insanları ve düşünürlerin 
              hayatları, eserleri ve etkilerini öğrenerek geçmişinden aldığı ilhamla geleceğini 
              tasarlayan özgüvenli bilim insanı adaylarının, teknoloji ve akademi alanında iyi 
              yetişmiş, dijital çağda ülkemizin millî teknoloji hamlesine katkı sunabilecek 
              bilgi, beceri ve deneyim sahibi, millî ve mânevî değerlere bağlı bireyler olarak 
              yetiştirilmesi hedeflenmektedir.
            </p>
          </div>

          {/* Okulları Keşfet Butonu */}
          <div className="flex justify-center mt-10">
            <Link
              to="/teknoloji-programlari/okullar"
              className="inline-flex items-center gap-3 px-8 py-4 bg-teal-800 text-white rounded-full font-semibold text-lg hover:bg-teal-900 transition-all transform hover:scale-105 shadow-lg"
            >
              <Cpu className="w-6 h-6" />
              Okulları Keşfet
              <ChevronDown className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TeknolojiHomePage;