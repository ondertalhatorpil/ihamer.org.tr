import React from "react";
import { Link } from "react-router-dom";
import { Globe, ChevronLeft, ChevronDown } from "lucide-react";

const UluslararasiHomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <header className="bg-teal-800 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Uluslararası İmam Hatip Liseleri
          </h1>
          <p className="text-blue-100">
            Millî ve manevi değerlerimizi evrensel karakterle buluşturan öncü eğitim kurumlarımız
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
              Uluslararası İmam Hatip Liseleri
            </h2>

            <p className="text-gray-700 leading-relaxed">
              Millî Eğitim Bakanlığı 2023 Vizyon Belgesi'nde İmam Hatip Okullarının evrensel 
              karakterini güçlendirerek millî bir model olarak başka ülkelere örnek olma 
              potansiyelinin artırılması hedeflenmiştir. İlk kez 2006 yılında eğitim-öğretim 
              hayatına başlayan Uluslararası İmam Hatip Liseleri, dünyanın çeşitli ülkelerinden 
              gelen öğrencilerin Türkiye'de eğitim görmelerine imkân sağlayan okullardır.
            </p>

            <p className="text-gray-700 leading-relaxed">
              Millî Eğitim Bakanlığı bünyesinde hizmet veren Uluslararası İmam Hatip Liselerinde 
              okuyan yabancı öğrenci kabul etmesi, İmam Hatip eğitim sisteminin ve kültürünün 
              dünyanın çeşitli ülkeleri açısından önemini ber açık biçimde ortaya koymaktadır.
            </p>

            <p className="text-gray-700 leading-relaxed">
              Uluslararası İmam Hatip Liseleri, farklı kültür, dil, ırk ve kıtalarındaki 
              öğrencilere bir arada uzlaşı içerisinde yaşayarak İslâm kardeşliğini tecrübe 
              etme imkânı sunmaktadır. Yine bu okullar, Müslüman ülkeler ile eğitim ve imam 
              hatipli yetiştirme alanında işbirliğini güçlendirmeye, mesleki alanlarda nitelikli 
              insan kaynağının yetişmesine destek olurken; aynı zamanda Türk-İslam medeniyeti 
              ile Türkiye'yi ön plana çıkartacak misyonla hazırlanan Türkiye'yi ağırlayan başta 
              eğitimci olmak üzere yaygın öncüler yetiştiren diplomatik bir çalışma Türkiye'nin 
              bu ülkelerle sağlıklı ve güçlü iletişim kurmasına zemin hazırlamaktadır.
            </p>

            <div className="bg-blue-50 p-6 rounded-lg mt-6 border-l-4 border-teal-800">
              <div className="flex items-start gap-3">
                <Globe className="w-6 h-6 text-teal-800 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Evrensel Pencere Türkiye
                  </h3>
                  <p className="text-gray-700 text-sm">
                    Evrensel Pencere Türkiye isimli Bakan Müşaviri, Fen ve Kültür dersi 
                    verilirken, Türkçe olmak üzere, öğrencilerin Türkiye'ye ve buranın 
                    kültürüne dair bilgi ve tecrübe sahibi olmalarını sağlamaktadır. 
                    Uluslararası İmam Hatip Liselerinde 70'e yakın ülkeden gelen yabancı 
                    uyruklu öğrenciler, ülkemiz ve İslam medeniyeti ile yakından tanışmaktadır.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed font-semibold mt-6">
              Uluslararası İmam Hatip Liselerinde eğitim gören öğrenciler, hem dini ilimlerde 
              hem de akademik başarıda yetkin bireyler olarak ülkelerine ve dünyaya hizmet 
              etmektedir.
            </p>
          </div>

          {/* Okulları Keşfet Butonu */}
          <div className="flex justify-center mt-10">
            <Link
              to="/uluslararasi-programlar/okullar"
              className="inline-flex items-center gap-3 px-8 py-4 bg-teal-800 text-white rounded-full font-semibold text-lg hover:bg-teal-900 transition-all transform hover:scale-105 shadow-lg"
            >
              <Globe className="w-6 h-6" />
              Okulları Keşfet
              <ChevronDown className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UluslararasiHomePage;