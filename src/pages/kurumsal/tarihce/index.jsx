import { useEffect, useRef, useState } from 'react';

export default function ImamHatipTimeline() {
  const [visibleItems, setVisibleItems] = useState([]);
  const timelineRef = useRef(null);

  const timelineData = [
    { year: '1913', text: 'İmam ve hatip yetiştirmek amacıyla Medresetü\'l-Eimme ve\'l-Huteba kuruldu. Bu okullar ortaokul seviyesinde dinî eğitim veren kurumlardır.' },
    { year: '1914', text: 'Vaiz yetiştirmek amacıyla 4 yıl eğitim veren Medresetü\'l-Vaizin adlı yüksekokul kuruldu. Bu okul İslamî ilimlerin yanında fen ve sosyal bilimler eğitimi vermiştir.' },
    { year: '1924', text: 'Tevhid-i Tedrisat Kanunu\'nun 4. Maddesine istinaden ülkenin farklı yerlerinde 29 adet dört yıl eğitim veren İmam Hatip Mektepleri açıldı.' },
    { year: '1930', text: 'İmam Hatip Mektepleri kapatıldı.' },
    { year: '1949', text: 'Din görevlisi ihtiyacını karşılamak üzere on ayrı ilde on ay süreli İmam Hatip Yetiştirme Kursları açıldı.' },
    { year: '1951', text: 'Yedi ilde (Adana, Ankara, Isparta, İstanbul, Kayseri, Konya, Kahramanmaraş) İmam Hatip Okulları yeniden açıldı. İlim Yayma Cemiyeti kuruldu.' },
    { year: '1954', text: 'İmam Hatip Okullarının üç yıllık lise kısımları açıldı.' },
    { year: '1958', text: 'İstanbul İmam Hatip Okulu Mezunlar Cemiyeti ismiyle ÖNDER İmam Hatipliler Derneği\'nin temeli atıldı.' },
    { year: '1972', text: 'Kız öğrencilerin İmam Hatip Okuluna kaydı yönetmelikle engellendi.' },
    { year: '1973', text: 'İmam Hatip Okulu ismi, İmam Hatip Lisesi olarak değiştirildi ve mezunları ilahiyat dışındaki fakültelere de girme hakkı elde etti.' },
    { year: '1997', text: 'Sekiz Yıllık Kesintisiz Eğitim Yasasıyla İmam Hatip Okullarının orta kısmı kapatıldı.' },
    { year: '1998', text: 'İmam Hatip Lisesi öğrencilerinin katsayı uygulamasıyla İlahiyat dışındaki bölümlere girmeleri neredeyse imkansızlaştırıldı. Öğrenci sayısında büyük oranda azalma oldu.' },
    { year: '2001', text: 'İmam Hatipli öğrenciler ÖNDER\'in desteği ile Avusturya\'ya üniversite okumaya gönderildi. Avusturya\'da bu öğrencilere sahip çıkmak için WONDER kuruldu.' },
    { year: '2011', text: 'YÖK yeni bir düzenleme ile katsayı eşitsizliğini tamamen kaldırdı ve İmam Hatip Liselerine rağbet arttı.' },
    { year: '2012', text: 'Eğitimde 4+4+4 sistemine geçildi. İmam Hatip Ortaokulları yeniden açıldı.' },
    { year: '2014', text: 'Proje İmam Hatip Okulları açılmaya başlandı ve İmam Hatip Liselerinde program çeşitliliğine gidildi.' }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setVisibleItems((prev) => [...new Set([...prev, index])]);
          }
        });
      },
      { threshold: 0.2 }
    );

    const items = timelineRef.current?.querySelectorAll('.timeline-item');
    items?.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  // İki kolona ayır
  const leftColumn = timelineData.filter((_, index) => index % 2 === 0);
  const rightColumn = timelineData.filter((_, index) => index % 2 === 1);

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
          <p className="text-white text-4xl font-black mt-2.5 text-center md:text-left mb-7 mt-14">Tarihçe</p>
          <h1 className="mt-2">
            <a href="/" className="text-white no-underline font-bold text-xl hover:opacity-80 transition-opacity">
              <span>Anasayfa</span>
              <i className="fas fa-angle-right text-[0.8rem] mx-2"></i>
            </a>
            <a href="/kurumsal/tarihce" className="text-white no-underline font-bold hover:opacity-80 text-xl">
              <span>Tarihçe</span>
            </a>
          </h1>
        </div>
      </div>

      {/* Premium Arka Plan Tasarımı */}
      <div className="relative overflow-hidden">
        {/* Çoklu Katmanlı Gradient Arka Plan */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 via-white to-stone-50/50"></div>
        
        {/* İnce Geometrik Izgara */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #b45309 1px, transparent 1px),
              linear-gradient(to bottom, #b45309 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px'
          }}
        />

        {/* Selçuklu İslami Geometrik Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage: `url(https://ihamer.org.tr/wp-content/uploads/2024/05/background.png)`,
            backgroundRepeat: 'repeat'
          }}
        />

        {/* Işık Efektleri */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-200/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-200/10 rounded-full blur-3xl"></div>

        {/* Timeline Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-5 py-20 md:py-32">
          
          <div ref={timelineRef} className="relative">
            {/* Premium Merkez Çizgi - Desktop */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2">
              {/* Gradient Çizgi */}
              <div className="w-[2px] h-full bg-gradient-to-b from-transparent via-amber-400/40 to-transparent"></div>
              {/* Kesikli Overlay */}
              <div 
                className="absolute inset-0 w-[2px]"
                style={{ 
                  backgroundImage: 'repeating-linear-gradient(0deg, #d97706 0px, #d97706 20px, transparent 20px, transparent 35px)'
                }}
              />
            </div>

            {/* Mobile: Tek Kolon */}
            <div className="md:hidden space-y-16">
              {timelineData.map((item, index) => (
                <div
                  key={index}
                  data-index={index}
                  className={`timeline-item transition-all duration-700 ${
                    visibleItems.includes(index)
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-8'
                  }`}
                >
                  <div className="relative pl-10">
                    {/* Şık Sol Çizgi */}
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-amber-400/60 via-amber-500/40 to-transparent"></div>
                    
                    {/* Nokta Süsü */}
                    <div className="absolute left-[-4px] top-2 w-[10px] h-[10px] rounded-full bg-amber-600 shadow-lg shadow-amber-600/50"></div>
                    
                    {/* Yıl - Şık Font */}
                    <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-amber-900 mb-4 tracking-tight">
                      {item.year}
                    </h2>
                    
                    {/* Metin - İyileştirilmiş Okunabilirlik */}
                    <p className="text-stone-700 leading-relaxed text-base font-light tracking-wide">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: Premium İki Kolon */}
            <div className="hidden md:grid md:grid-cols-2 md:gap-24">
              {/* Sol Kolon */}
              <div className="space-y-24">
                {leftColumn.map((item,) => {
                  const originalIndex = timelineData.indexOf(item);
                  return (
                    <div
                      key={originalIndex}
                      data-index={originalIndex}
                      className={`timeline-item transition-all duration-700 text-right group ${
                        visibleItems.includes(originalIndex)
                          ? 'opacity-100 translate-x-0'
                          : 'opacity-0 -translate-x-12'
                      }`}
                    >
                      <div className="relative pr-10">
                        {/* Premium Sağ Çizgi */}
                        <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-amber-400/60 via-amber-500/40 to-transparent"></div>
                        
                        {/* Animasyonlu Nokta */}
                        <div className="absolute right-[-5px] top-3 w-[12px] h-[12px] rounded-full bg-amber-600 shadow-lg shadow-amber-600/50 group-hover:scale-125 transition-transform duration-300"></div>
                        
                        {/* Yıl - Gradient Text */}
                        <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-l from-amber-700 via-amber-800 to-amber-900 mb-5 tracking-tighter">
                          {item.year}
                        </h2>
                        
                        {/* İçerik Kartı */}
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 border border-amber-100/50 group-hover:border-amber-200">
                          <p className="text-stone-700 leading-relaxed text-lg font-light">
                            {item.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Sağ Kolon */}
              <div className="space-y-24 pt-48">
                {rightColumn.map((item,) => {
                  const originalIndex = timelineData.indexOf(item);
                  return (
                    <div
                      key={originalIndex}
                      data-index={originalIndex}
                      className={`timeline-item transition-all duration-700 group ${
                        visibleItems.includes(originalIndex)
                          ? 'opacity-100 translate-x-0'
                          : 'opacity-0 translate-x-12'
                      }`}
                    >
                      <div className="relative pl-10">
                        {/* Premium Sol Çizgi */}
                        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-amber-400/60 via-amber-500/40 to-transparent"></div>
                        
                        {/* Animasyonlu Nokta */}
                        <div className="absolute left-[-5px] top-3 w-[12px] h-[12px] rounded-full bg-amber-600 shadow-lg shadow-amber-600/50 group-hover:scale-125 transition-transform duration-300"></div>
                        
                        {/* Yıl - Gradient Text */}
                        <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 mb-5 tracking-tighter">
                          {item.year}
                        </h2>
                        
                        {/* İçerik Kartı */}
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 border border-amber-100/50 group-hover:border-amber-200">
                          <p className="text-stone-700 leading-relaxed text-lg font-light">
                            {item.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}