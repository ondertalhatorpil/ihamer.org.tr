import React from 'react';

const KvkPolitikası = () => {
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
        <span className="text-xs md:text-sm">Anasayfa</span>
      </a>
    </nav>

    {/* Title */}
    <div className="space-y-1.5 md:space-y-2">
      <div className="flex items-center gap-2 md:gap-3">
        <div className="hidden md:block w-8 md:w-12 h-1 bg-gradient-to-r from-[#b48f65] to-[#ae9242] rounded-full"></div>
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
          KVKK
        </h1>
      </div>
      <p className="text-white/80 text-xs md:text-base font-light max-w-2xl pl-0 md:pl-14">
        
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

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-10">
          
          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
            Gizlilik ve Kişisel Verilerin Korunması Politikası
          </h1>
          
          <p className="text-gray-700 leading-relaxed mb-8">
            İmam Hatip Araştırmaları Merkezi (İHAMER) olarak, 6698 sayılı
            Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında kişisel
            verilerinizin güvenliği bizim için en önemli önceliktir.
          </p>

          <hr className="my-8 border-gray-200" />

          {/* Section 1 */}
          <h2 className="text-4xl font-bold text-gray-500 mb-3">
            1. Kişisel Verilerin İşlenme İlkeleri
          </h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            KVKK'nın 4. maddesi uyarınca, İHAMER tarafından kişisel verileriniz
            şu ilkelere uygun olarak işlenmektedir:
          </p>
          <ul className="space-y-2 ml-6 mb-6">
            <li className="text-gray-700">– Hukuka ve dürüstlük kurallarına uygun olma</li>
            <li className="text-gray-700">– Doğru ve gerektiğinde güncel olma</li>
            <li className="text-gray-700">– Belirli, açık ve meşru amaçlar için işlenme</li>
            <li className="text-gray-700">– İşlendikleri amaçla bağlantılı, sınırlı ve ölçülü olma</li>
            <li className="text-gray-700">– İlgili mevzuatta öngörülen veya işlendikleri amaç için gerekli olan süre kadar muhafaza edilme</li>
          </ul>

          {/* Section 2 */}
          <h2 className="text-4xl font-bold text-gray-500 mb-3">
            2. İşlenen Kişisel Veriler
          </h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            İHAMER, faaliyetleri kapsamında aşağıdaki kişisel verileri işleyebilir:
          </p>
          <ul className="space-y-2 ml-6 mb-6">
            <li className="text-gray-700">– <strong>Kimlik Bilgileri:</strong> Ad, soyad, T.C. kimlik numarası, doğum tarihi vb.</li>
            <li className="text-gray-700">– <strong>İletişim Bilgileri:</strong> Telefon numarası, e-posta, adres</li>
            <li className="text-gray-700">– <strong>Eğitim Bilgileri:</strong> Okul bilgileri, başarı durumu, sınav sonuçları</li>
            <li className="text-gray-700">– <strong>Finansal Bilgiler:</strong> Burs ödemeleri için banka hesap bilgileri</li>
            <li className="text-gray-700">– <strong>Görsel/İşitsel Veriler:</strong> Etkinlik fotoğraf ve video kayıtları</li>
            <li className="text-gray-700">– <strong>Özel Nitelikli Veriler:</strong> Yasal sınırlar çerçevesinde (KVKK m.6) sağlık bilgileri veya gerekli izin belgeleri</li>
          </ul>

          {/* Section 3 */}
          <h2 className="text-4xl font-bold text-gray-500 mb-3">
            3. Kişisel Verilerin İşlenme Amaçları
          </h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            KVKK'nın 5. ve 6. maddelerine dayanarak kişisel verileriniz şu amaçlarla işlenmektedir:
          </p>
          <ul className="space-y-2 ml-6 mb-6">
            <li className="text-gray-700">– Burs başvurularının değerlendirilmesi, ödemelerin yapılması</li>
            <li className="text-gray-700">– Eğitim, seminer, etkinlik ve projelerin yürütülmesi</li>
            <li className="text-gray-700">– Kurum içi raporlama, istatistiksel çalışmalar ve planlamalar</li>
            <li className="text-gray-700">– İlgili mevzuattan doğan yükümlülüklerin yerine getirilmesi</li>
            <li className="text-gray-700">– Sizlerle sağlıklı iletişimin kurulması</li>
            <li className="text-gray-700">– Etkinliklerimizin tanıtımı ve bilgilendirme faaliyetlerinin yürütülmesi</li>
          </ul>

          {/* Section 4 */}
          <h2 className="text-4xl font-bold text-gray-500 mb-3">
            4. Kişisel Verilerin Aktarılması
          </h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            KVKK'nın 8. ve 9. maddeleri uyarınca kişisel verileriniz, gerekli güvenlik önlemleri alınarak:
          </p>
          <ul className="space-y-2 ml-6 mb-3">
            <li className="text-gray-700">– Yasal zorunluluk halinde resmî kurum ve kuruluşlara</li>
            <li className="text-gray-700">– İHAMER'in iş birliği yaptığı eğitim kurumlarına ve proje ortaklarına</li>
            <li className="text-gray-700">– Hukuki süreçlerde avukatlara ve ilgili mercilere</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-6">
            aktarılabilecektir. Yurt dışına veri aktarımı yalnızca açık rızanız bulunması veya kanuni zorunluluk halinde yapılır.
          </p>

          {/* Section 5 */}
          <h2 className="text-4xl font-bold text-gray-500 mb-3">
            5. Kişisel Verilerin Toplanma Yöntemleri ve Hukuki Sebepler
          </h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Kişisel verileriniz; başvuru formları, web sitemiz, e-posta, telefon, etkinlik kayıt sistemleri gibi çeşitli kanallar aracılığıyla toplanmaktadır.
          </p>
          <p className="text-gray-700 font-semibold mb-3">
            KVKK'nın 5. maddesi uyarınca işlenmenin hukuki sebepleri şunlardır:
          </p>
          <ul className="space-y-2 ml-6 mb-6">
            <li className="text-gray-700">– Kanunlarda açıkça öngörülmesi</li>
            <li className="text-gray-700">– Bir sözleşmenin kurulması veya ifası için gerekli olması</li>
            <li className="text-gray-700">– Hukuki yükümlülüklerin yerine getirilmesi</li>
            <li className="text-gray-700">– İHAMER'in meşru menfaatleri</li>
            <li className="text-gray-700">– İlgili kişinin açık rızası</li>
          </ul>

          {/* Section 6 */}
          <h2 className="text-4xl font-bold text-gray-500 mb-3">
            6. Kişisel Verilerin Saklanması ve Güvenliği
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            KVKK'nın 12. maddesi uyarınca İHAMER, kişisel verilerinizi yetkisiz erişim, kaybolma, kötüye kullanım veya ifşa edilme risklerine karşı korumak için gerekli idari ve teknik tedbirleri almaktadır. Veriler yalnızca belirtilen amaçlar için işlenmekte ve gerekli süre boyunca muhafaza edilmektedir.
          </p>

          {/* Section 7 */}
          <h2 className="text-4xl font-bold text-gray-500 mb-3">
            7. İlgili Kişinin Hakları
          </h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            KVKK'nın 11. maddesi uyarınca kişisel veri sahipleri olarak şu haklara sahipsiniz:
          </p>
          <ul className="space-y-2 ml-6 mb-6">
            <li className="text-gray-700">– Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
            <li className="text-gray-700">– İşlenmişse buna ilişkin bilgi talep etme</li>
            <li className="text-gray-700">– İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
            <li className="text-gray-700">– Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
            <li className="text-gray-700">– Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
            <li className="text-gray-700">– KVKK'nın 7. maddesi kapsamında silinmesini veya yok edilmesini talep etme</li>
            <li className="text-gray-700">– İşlemenin kısıtlanmasını veya itiraz etme</li>
            <li className="text-gray-700">– Zarara uğramanız hâlinde tazminat talep etme</li>
          </ul>

          {/* Section 8 */}
          <h2 className="text-4xl font-bold text-gray-500 mb-3">
            8. Başvuru Yöntemi
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Haklarınıza ilişkin taleplerinizi, KVKK'nın 13. maddesi uyarınca yazılı olarak veya Kişisel Verileri Koruma Kurulu'nun belirlediği yöntemlerle İHAMER'e iletebilirsiniz. Talepleriniz en geç 30 gün içinde sonuçlandırılacaktır.
          </p>

          {/* Section 9 */}
          <h2 className="text-4xl font-bold text-gray-500 mb-3">
            9. İletişim
          </h2>
          <p className="text-gray-700 font-semibold mb-3">
            📌 İmam Hatip Araştırmaları Merkezi (İHAMER)
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Adres:</strong> Alemdar Mahallesi Hükümet Caddesi No:1 Fatih/İstanbul
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Telefon:</strong> (0212) 521 19 58
          </p>
          <p className="text-gray-700 mb-6">
            <strong>E-posta:</strong>{' '}
            <a
              href="mailto:ihamer@onder.org.tr"
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              ihamer@onder.org.tr
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default KvkPolitikası;