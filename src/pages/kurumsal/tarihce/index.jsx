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
      <svg className="w-3 h-3 md:w-4 md:h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
        <span className="text-xs md:text-sm text-white">Kurumsal</span>
      <svg className="w-3 h-3 md:w-4 md:h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
      <span className="text-white font-medium text-xs md:text-sm">Tarihçe</span>
    </nav>

    {/* Title */}
    <div className="space-y-1.5 md:space-y-2">
      <div className="flex items-center gap-2 md:gap-3">
        <div className="hidden md:block w-8 md:w-12 h-1 bg-gradient-to-r from-[#b48f65] to-[#ae9242] rounded-full"></div>
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
          Tarihçe
        </h1>
      </div>
      <p className="text-white/80 text-xs md:text-base font-light max-w-2xl pl-0 md:pl-14">
        İmam Hatip Okulları Tarihçesi 
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
        <div className="relative text-justify z-10 max-w-6xl mx-auto px-5 py-20 md:py-32">
          
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