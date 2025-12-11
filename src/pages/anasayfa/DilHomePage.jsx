import React from "react";
import { Link } from "react-router-dom";
import { Languages, ChevronLeft, ChevronDown, Globe } from "lucide-react";

const DilHomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <header className="bg-teal-800  text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Dil Programları
          </h1>
          <p className="text-blue-100">
            Dil Ağırlıklı Eğitim Veren İmam Hatip Liseleri, öğrencilere çok
            dilli eğitim imkânı sunarak hem akademik başarılarını hem de küresel
            yetkinliklerini geliştirmektedir.
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
              Dil Ağırlıklı Eğitim Veren Anadolu İmam Hatip Liseleri
            </h2>

            <p className="text-gray-700 leading-relaxed">
              Fen ve Sosyal Bilimler Proje Anadolu İmam Hatip Liselerinin bir
              kısmında dil hazırlık eğitimi verilmektedir. Buna göre 4 yıllık
              lise eğitiminden önce başta Arapça olmak üzere 1 yıl boyunca
              İngilizce, Almanca, İspanyolca, Rusça, İtalyanca, Çince,
              Fransızca, Farsça, Korece ve Japonca dillerinden biri
              öğretilmektedir. Bu program hızla değişen ve küreselleşen dünyada
              yabancı dil becerisiyle uluslararası düzeyde akranları ile rekabet
              edebilecek seviyede yetişen, küresel bağlamda sosyoekonomik
              gelişmeleri fark eden, İslam ülkeleri, Müslüman toplumlar ve dünya
              ile iletişim kurabilen bireyler yetiştirmeyi hedeflemektedir.
              Hazırlık eğitimine paralel olarak hazırlık dil sınıfı programı
              uygulayan Anadolu İmam Hatip Lisesi öğrencilerinin yaz tatilinde
              öğrendikleri dilin kültürünü daha iyi tanımaları amacıyla
              öğrendikleri dilin konuşulduğu ülkelere Çelebi Programı kapsamında
              geziler de düzenlenmektedir.
            </p>

            <div className="bg-blue-50 p-6 rounded-lg mt-6 border-l-4 border-teal-800">
              <div className="flex items-start gap-3">
                <Globe className="w-6 h-6 text-teal-800 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Çelebi Programı
                  </h3>
                  <p className="text-gray-700 text-sm">
                    Diyanet İşleri Başkanlığı uhdesinde faaliyet gösteren
                    MÜSDAV’ın Millî Eğitim Bakanlığı Din Öğretimi Genel
                    Müdürlüğü ve Diyanet İşleri Başkanlığı Dış İlişkiler Genel
                    Müdürlüğü iş birliği ile 2020 yılında hayata geçirdiği
                    projedir. Program Almanca, Çince, Farsça, Fransızca,
                    İspanyolca, İtalyanca, Japonca ve Rusça hazırlık dil sınıfı
                    programı uygulayan Anadolu İmam Hatip Liselerini
                    kapsamaktadır. Gönüllü öğrencilerin katılımıyla devam eden
                    programın süresi dört yıldır. Program kapsamında tahliller
                    (kitap, film ve belgesel), sosyal etkinlikler, şehir
                    içi/dışı geziler, tematik buluşmalar, uluslararası öğrenci
                    buluşmaları, yurt içi ve yurt dışı kamp etkinlikleri
                    gerçekleştirilmektedir. Bu çerçevede Almanya, Fransa, İran,
                    İspanya, Japonya, Kazakistan ve Özbekistan gibi ülkelerde
                    yurt dışı eğitim ve kültür kampları gerçekleştirilmektedir.
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Okulları Keşfet Butonu */}
          <div className="flex justify-center mt-10">
            <Link
              to="/dil-programlari/okullar"
              className="inline-flex items-center gap-3 px-8 py-4 bg-teal-800 text-white rounded-full font-semibold text-lg hover:bg-teal-900 transition-all transform hover:scale-105 shadow-lg"
            >
              <Languages className="w-6 h-6" />
              Okulları Keşfet
              <ChevronDown className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DilHomePage;
