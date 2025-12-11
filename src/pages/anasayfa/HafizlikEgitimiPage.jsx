import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronDown } from 'lucide-react';

const HafizlikEgitimiPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-teal-700 to-teal-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Hafız Yetiştiren İmam Hatip Ortaokulları
          </h1>
          <p className="text-teal-100">
            İmam Hatip Ortaokullarında Hafızlık Eğitimi Uygulaması
          </p>
        </div>
      </header>

      {/* Back Button */}
      <div className="container mx-auto max-w-6xl px-4 py-6">
        <Link
          to="/HafizlikProgramlari"
          className="inline-flex items-center gap-2 px-6 py-3 bg-teal-700 text-white rounded-full font-semibold hover:bg-teal-800 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Program Seçimine Geri Dön
        </Link>
      </div>

      {/* Content Section */}
      <div className="container mx-auto max-w-6xl px-4 pb-12">
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-teal-900 mb-4">
              İmam Hatip Ortaokullarında Hafızlık Eğitimi Uygulaması
            </h2>
            
            <p className="text-gray-700 leading-relaxed">
              İmam hatip ortaokullarında uygulanan farklı modellerden biri hafızlık eğitimidir. Kur'an-ı Kerim'i baştan sona ezberleme anlamına gelen hafızlık geleneği, Kur'an'ın ilk indirildiği döneme, yani Hz. Muhammed (s.a.v.) devrine dayanır.
            </p>

            <p className="text-gray-700 leading-relaxed">
              Vahyin ilk muhatabı ve tebliğcisi olan Hz. Muhammed (s.a.v.), hafızların ilki ve öncüsü kabul edilir. İlk inen ayetleri hem yazıya geçiren hem de ezberleyen vahiy kâtipleri, Kur'an'ın ilk hafızlarıdır. Hz. Peygamber'in Kur'an-ı Kerim'i okumayı ve ezberlemeyi teşvik eden hadisleri nedeniyle hafızlık, tarih boyunca Müslümanlar arasında özel bir değer görmüştür.
            </p>

            <p className="text-gray-700 leading-relaxed">
              İslam eğitim tarihinde hafızlık, nesilden nesile aktarılan köklü bir gelenek hâline gelmiş; dini eğitimin temel unsurlarından biri olarak varlığını sürdürmüştür.
            </p>

            <h3 className="text-xl font-bold text-teal-900 mt-8 mb-4">
              Cumhuriyet Döneminde Hafızlık Eğitimi
            </h3>

            <p className="text-gray-700 leading-relaxed">
              Cumhuriyet döneminde hafızlık eğitimi, ilkokul sonrası Diyanet İşleri Başkanlığına bağlı Kur'an kurslarında yapılmaktaydı. Ancak 1997 yılında 8 yıllık kesintisiz eğitime geçilmesiyle Kur'an kursları öğrenci kaybı yaşamış, bu durum hafızlık eğitimini de olumsuz etkilemiştir.
            </p>

            <p className="text-gray-700 leading-relaxed">
              Bu süreçte hem Kur'an kurslarına devam edecek öğrenci bulmada hem de hafız yetiştirmede ciddi sorunlar ortaya çıkmıştır.
            </p>

            <h3 className="text-xl font-bold text-teal-900 mt-8 mb-4">
              Örgün Eğitimle Birlikte Hafızlık İzni
            </h3>

            <p className="text-gray-700 leading-relaxed">
              Toplumda artan talepler doğrultusunda, Millî Eğitim Bakanlığı (MEB) 2015 yılında yaptığı düzenleme ile öğrencilere örgün eğitime devam ederken hafızlık yapma imkânı tanımıştır.
            </p>
            <br/>
            <p className="text-gray-700 leading-relaxed">
              Söz konusu yasal düzenleme şu şekildedir;
            </p>

            <div className="bg-teal-50 border-l-4 border-teal-600 p-4 my-6">
              <p className="text-gray-700 leading-relaxed italic">
                "Ortaokul/İmam-hatip ortaokulu 5'inci, 6'ncı ve 7'nci sınıf öğrencilerine, velisinin yazılı başvurusu üzerine bir eğitim ve öğretim yılı Diyanet İşleri Başkanlığının açmış olduğu hafızlık eğitimine devam etmelerine izin verilir. Hafızlık eğitimine devam ettiğini belgelendirenlerden o eğitim ve öğretim yılı için devam zorunluluğu aranmaz. Bu sürenin bitiminde öğrencilerin okula devamları sağlanır. Bu öğrenciler okula döndüklerinde, devam edemedikleri eğitim ve öğretim yılına ait derslerden okul müdürünün sorumluluğu ve koordinesinde, alan öğretmenlerinden oluşturulacak komisyonca sınava alınır. Başarılı olanlar bir üst sınıfa devam ettirilir."
              </p>
            </div>

            <p className="text-gray-700 leading-relaxed">
              Bu düzenlemeye göre, Diyanet İşleri Başkanlığınca açılan Kur'an kurslarına devam eden ve bunu belgelendiren öğrencilere bir eğitim-öğretim yılı izin verilmekte, yıl sonunda yapılan sınavda başarılı olanlara bir üst sınıfta okuma hakkı tanınmaktadır.
            </p>

            <p className="text-gray-700 leading-relaxed">
              Ancak hafızlığa hazırlık ve tamamlama süreçleri dikkate alındığında, öğrenciye verilen bir yıllık sürenin yetersiz kaldığı görülmektedir. Bu nedenle, izin süresinin hafızlık süreçlerine uygun biçimde yeniden düzenlenmesi gerektiği değerlendirilmektedir.
            </p>

            <h3 className="text-xl font-bold text-teal-900 mt-8 mb-4">
              Örgün Eğitimle Birlikte Hafızlık Yapan Okullar
            </h3>

            <p className="text-gray-700 leading-relaxed">
              Hafızlık izni uygulamasının ardından, 2014 yılından itibaren örgün eğitimle birlikte hafızlık eğitimi veren imam hatip ortaokulları açılmıştır.
            </p>

            <p className="text-gray-700 leading-relaxed">
              Bu okullar, Millî Eğitim Bakanlığı Din Öğretimi Genel Müdürlüğü ile Diyanet İşleri Başkanlığı Eğitim Hizmetleri Genel Müdürlüğü arasında imzalanan protokol kapsamında faaliyet göstermektedir.
            </p>

            <p className="text-gray-700 leading-relaxed">
              Bu modelde, öğrenciler bir yandan örgün eğitime devam ederken diğer yandan hafızlık eğitimini sürdürmektedir.
            </p>

            <p className="text-gray-700 leading-relaxed font-semibold">
              MEB verilerine göre, 2023-2024 eğitim-öğretim yılında 66 ilde toplam 195 okulda hafızlık eğitimi verilmesi planlanmıştır. Bugüne kadar, örgün eğitimle birlikte hafızlık eğitimi veren imam hatip ortaokullarında 16.280 öğrenci hafız olmuştur.
            </p>
          </div>

          {/* Okulların Listeleri Butonu */}
          <div className="flex justify-center mt-10">
            <Link
              to="/HafizlikProgramlari/iho-okul-listesi"
              onClick={() => window.scrollTo(0, 0)} //
              className="inline-flex items-center gap-3 px-8 py-4 bg-teal-700 text-white rounded-full font-semibold text-lg hover:bg-teal-800 transition-all transform hover:scale-105 shadow-lg"
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

export default HafizlikEgitimiPage;