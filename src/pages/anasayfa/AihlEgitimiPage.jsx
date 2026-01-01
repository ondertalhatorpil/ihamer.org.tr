import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronDown } from 'lucide-react';

const AihlEgitimiPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-700 to-amber-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Hafız Pekiştiren Anadolu İmam Hatip Liseleri
          </h1>
          <p className="text-amber-100">
            Hafızlık Pekiştirme ve İlahiyat Odaklı Hafızlık Programları
          </p>
        </div>
      </header>

      {/* Back Button */}
      <div className="container mx-auto max-w-6xl px-4 py-6">
        <Link
          to="/HafizlikProgramlari"
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-700 text-white rounded-full font-semibold hover:bg-amber-800 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Program Seçimine Geri Dön
        </Link>
      </div>

      {/* Content Section */}
      <div className="container mx-auto max-w-6xl px-4 pb-12">
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">
              Hafızlık Pekiştirme ve İlahiyat Odaklı Hafızlık Programları
            </h2>
            
            <h3 className="text-xl font-bold text-amber-900 mt-8 mb-4">
              Pekiştirme Anadolu İmam Hatip Liseleri
            </h3>

            <p className="text-justify text-gray-700 leading-relaxed">
              Sadece hafız öğrencilerin eğitim gördüğü bu programlarda, öğrenciler liseye geçiş sınavı, ortaokul başarı puanı ve okullardaki meslek dersleri öğretmenleri, akademisyenler ile müftülüklerden katılan uzmanlardan oluşan bir heyet tarafından yapılan hafızlık mülakatları sonucunda okullara kabul edilmektedir.
            </p>

            <h3 className="text-xl font-bold text-amber-900 mt-8 mb-4">
              Programın Amacı
            </h3>

            <p className="text-gray-700 leading-relaxed">
              Bu okulların temel amacı;
            </p>

            <ul className="list-none space-y-2 text-gray-700 ml-6">
              <li className="flex items-start">
                <span className="text-amber-600 mr-2">•</span>
                <span>Hafız öğrencilerin hafızlıklarını muhafaza etmeleri,</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-600 mr-2">•</span>
                <span>Kur'an-ı Kerim'in ana konularını bilmeleri,</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-600 mr-2">•</span>
                <span>Dinî ve ahlaki sorumluluklarının bilincinde olmaları,</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-600 mr-2">•</span>
                <span>Din hizmetleriyle ilgili temel becerileri kazanmaları,</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-600 mr-2">•</span>
                <span>Temel İslam Bilimleri alanında ilgi ve kabiliyetleri doğrultusunda daha donanımlı, özgüveni yüksek, medeniyet değerlerinin farkında bireyler olarak yetişmeleri,</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-600 mr-2">•</span>
                <span>Ve yükseköğrenime hazırlanmalarına imkân sağlamaktır.</span>
              </li>
            </ul>

            <h3 className="text-xl font-bold text-amber-900 mt-8 mb-4">
              Eğitim ve İş Birliği
            </h3>

            <p className="text-justify text-gray-700 leading-relaxed">
              Ayrıca, İlahiyat ve din hizmetleri alanını tercih edecek hafız öğrenciler için özel program ve projeler hayata geçirilmekte; fakültelerle iş birliği içinde ilave mesleki programlar ve takviye dersler uygulanmaktadır.
            </p>

            <p className="text-gray-700 leading-relaxed">
              Bu okullarda hafız öğrenciler;
            </p>

            <div className="bg-amber-50 border-l-4 border-amber-600 p-4 my-6">
              <ul className="list-none space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="text-amber-600 mr-2">✓</span>
                  <span>Cami mûsikîsi</span>
                </li>
                <li className="flex items-center">
                  <span className="text-amber-600 mr-2">✓</span>
                  <span>Mukabele</span>
                </li>
                <li className="flex items-center">
                  <span className="text-amber-600 mr-2">✓</span>
                  <span>Hatimle teravih</span>
                </li>
                <li className="flex items-center">
                  <span className="text-amber-600 mr-2">✓</span>
                  <span>İmamlık</span>
                </li>
                <li className="flex items-center">
                  <span className="text-amber-600 mr-2">✓</span>
                  <span>Hatiplik</span>
                </li>
                <li className="flex items-center">
                  <span className="text-amber-600 mr-2">✓</span>
                  <span>Müezzinlik</span>
                </li>
                <li className="flex items-center">
                  <span className="text-amber-600 mr-2">✓</span>
                  <span>Vaizlik</span>
                </li>
              </ul>
              <p className="text-gray-700 mt-4">
                gibi konularda mesleki anlamda desteklenmektedir.
              </p>
            </div>

            <h3 className="text-xl font-bold text-amber-900 mt-8 mb-4">
              Hedef
            </h3>

            <p className="text-justify text-gray-700 leading-relaxed font-semibold">
              Bu programlar aracılığıyla, hem topluma öncülük edebilecek hem de din görevliliği makamının hakkını verebilecek yetkin şahsiyetlerin yetiştirilmesi hedeflenmektedir.
            </p>
          </div>

          {/* Okulların Listeleri Butonu */}
          <div className="flex justify-center mt-10">
            <Link
              to="/HafizlikProgramlari/aihl-okul-listesi"
              className="inline-flex items-center gap-3 px-8 py-4 bg-amber-700 text-white rounded-full font-semibold text-lg hover:bg-amber-800 transition-all transform hover:scale-105 shadow-lg"
            >
              Okulların Listeleri
              <ChevronDown className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AihlEgitimiPage;