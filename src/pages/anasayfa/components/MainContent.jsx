import { useState, useRef } from 'react';
import { FaClock } from 'react-icons/fa';

// Veri objeleri aynı kalabilir
const newsData = {
    haberler: [
        { img: "https://ihamer.org.tr/wp-content/uploads/2024/07/Degisen-Dunyada-Genclik-Din-ve-Degerler-Egitimi-kapak-370x256.jpeg", title: "Hikmetin İzinde Öğretmen Kampı Başvuru Sonuçları Açıklandı", date: "4 Ağustos 2025" },
        { img: "https://ihamer.org.tr/wp-content/uploads/2024/07/Degisen-Dunyada-Genclik-Din-ve-Degerler-Egitimi-kapak-370x256.jpeg", title: "İmam Hatiplerde Program Çeşitliliği Raporu Yayınlandı", date: "6 Ekim 2024" },
    ],
    konusmalar: [
        { img: "https://ihamer.org.tr/wp-content/uploads/2024/07/Degisen-Dunyada-Genclik-Din-ve-Degerler-Egitimi-kapak-370x256.jpeg", title: "Değişen Dünyada Gençlik, Din ve Değerler Eğitimi", date: "1 Haziran 2024" },
        { img: "https://ihamer.org.tr/wp-content/uploads/2024/07/Degisen-Dunyada-Genclik-Din-ve-Degerler-Egitimi-kapak-370x256.jpeg", title: "Türkiye’de Din Eğitimi ve İmam Hatip Okulları", date: "23 Şubat 2024" },
        { img: "https://ihamer.org.tr/wp-content/uploads/2024/07/Degisen-Dunyada-Genclik-Din-ve-Degerler-Egitimi-kapak-370x256.jpeg", title: "Lise Öğrencilerinin İmam Hatip Tercih Etme Nedenleri", date: "26 Ocak 2024" },
        { img: "https://ihamer.org.tr/wp-content/uploads/2024/07/Degisen-Dunyada-Genclik-Din-ve-Degerler-Egitimi-kapak-370x256.jpeg", title: "Türkiye’nin İmam Hatipleri ve Muhafazakar Toplumsal Hareketlilik", date: "23 Ocak 2023" },
        { img: "https://ihamer.org.tr/wp-content/uploads/2024/07/Degisen-Dunyada-Genclik-Din-ve-Degerler-Egitimi-kapak-370x256.jpeg", title: "İmam Hatiplerde Hafızlık Eğitiminde Dikkat Edilmesi Gereken Hususlar", date: "28 Ekim 2023" },
    ],
    calistaylar: [ 
         { img: "https://ihamer.org.tr/wp-content/uploads/2024/07/Degisen-Dunyada-Genclik-Din-ve-Degerler-Egitimi-kapak-370x256.jpeg", title: "Değişen Dünyada Gençlik, Din ve Değerler Eğitimi", date: "1 Haziran 2024" },
        { img: "https://ihamer.org.tr/wp-content/uploads/2024/07/Degisen-Dunyada-Genclik-Din-ve-Degerler-Egitimi-kapak-370x256.jpeg", title: "Türkiye’de Din Eğitimi ve İmam Hatip Okulları", date: "23 Şubat 2024" },
        { img: "https://ihamer.org.tr/wp-content/uploads/2024/07/Degisen-Dunyada-Genclik-Din-ve-Degerler-Egitimi-kapak-370x256.jpeg", title: "Lise Öğrencilerinin İmam Hatip Tercih Etme Nedenleri", date: "26 Ocak 2024" },
        { img: "https://ihamer.org.tr/wp-content/uploads/2024/07/Degisen-Dunyada-Genclik-Din-ve-Degerler-Egitimi-kapak-370x256.jpeg", title: "Türkiye’nin İmam Hatipleri ve Muhafazakar Toplumsal Hareketlilik", date: "23 Ocak 2023" },
        { img: "https://ihamer.org.tr/wp-content/uploads/2024/07/Degisen-Dunyada-Genclik-Din-ve-Degerler-Egitimi-kapak-370x256.jpeg", title: "İmam Hatiplerde Hafızlık Eğitiminde Dikkat Edilmesi Gereken Hususlar", date: "28 Ekim 2023" },
     ],
    'bilgi-notlari': [ 
         { img: "https://ihamer.org.tr/wp-content/uploads/2024/07/Degisen-Dunyada-Genclik-Din-ve-Degerler-Egitimi-kapak-370x256.jpeg", title: "Değişen Dünyada Gençlik, Din ve Değerler Eğitimi", date: "1 Haziran 2024" },
        { img: "https://ihamer.org.tr/wp-content/uploads/2024/07/Degisen-Dunyada-Genclik-Din-ve-Degerler-Egitimi-kapak-370x256.jpeg", title: "Türkiye’de Din Eğitimi ve İmam Hatip Okulları", date: "23 Şubat 2024" },
        { img: "https://ihamer.org.tr/wp-content/uploads/2024/07/Degisen-Dunyada-Genclik-Din-ve-Degerler-Egitimi-kapak-370x256.jpeg", title: "Lise Öğrencilerinin İmam Hatip Tercih Etme Nedenleri", date: "26 Ocak 2024" },
        { img: "https://ihamer.org.tr/wp-content/uploads/2024/07/Degisen-Dunyada-Genclik-Din-ve-Degerler-Egitimi-kapak-370x256.jpeg", title: "Türkiye’nin İmam Hatipleri ve Muhafazakar Toplumsal Hareketlilik", date: "23 Ocak 2023" },
        { img: "https://ihamer.org.tr/wp-content/uploads/2024/07/Degisen-Dunyada-Genclik-Din-ve-Degerler-Egitimi-kapak-370x256.jpeg", title: "İmam Hatiplerde Hafızlık Eğitiminde Dikkat Edilmesi Gereken Hususlar", date: "28 Ekim 2023" },
     ],
};
const programData = [ /* ... diğer veriler ... */ ];


const NewsSlider = ({ category, cards }) => {
    const sliderRef = useRef(null);
    const scrollAmount = 300; // Tek seferde kaydırma miktarı

    return (
        <div className="flex-grow relative min-w-0">
            {/* DEĞİŞİKLİK 1: KAYDIRMA ÇUBUĞUNU GİZLEMEK İÇİN BİR WRAPPER EKLENDİ */}
            <div className="overflow-hidden">
                {/* DEĞİŞİKLİK 2: `scrollbar-hide` SINIFI EKLENECEK (aşağıdaki CSS adımını inceleyin) */}
                <div ref={sliderRef} id={category} className="flex gap-5 transition-transform duration-500 ease-in-out p-1 md:p-0 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide">
                    {cards.map((card, index) => (
                        // DEĞİŞİKLİK 3: MOBİL KART GENİŞLİĞİ GÜNCELLENDİ
                        <a href="#" key={index} className="flex-shrink-0 w-[80%] sm:w-[45%] md:w-1/3 flex flex-col bg-white rounded-lg overflow-hidden transition-transform duration-300 hover:-translate-y-1.5 snap-start shadow-sm border border-gray-100">
                            <img src={card.img} alt={card.title} className="w-full h-44 object-cover" />
                            <h3 className="text-base font-semibold p-4 flex-grow">{card.title}</h3>
                            {card.date && (
                                <p className="px-4 pb-4 text-sm italic opacity-50 flex items-center">
                                    <FaClock className="mr-2" /> {card.date}
                                </p>
                            )}
                        </a>
                    ))}
                </div>
            </div>
             {/* DEĞİŞİKLİK 4: OK BUTONLARI ARTIK MOBİLDE DE GÖRÜNÜR VE STİLLERİ GÜNCELLENDİ */}
             <button onClick={() => { sliderRef.current.scrollLeft -= scrollAmount }} className="absolute top-1/2 -translate-y-1/2 -left-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full w-9 h-9 text-lg flex items-center justify-center shadow-md z-10 transition hover:bg-white md:-left-5 md:w-11 md:h-11">❮</button>
             <button onClick={() => { sliderRef.current.scrollLeft += scrollAmount }} className="absolute top-1/2 -translate-y-1/2 -right-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full w-9 h-9 text-lg flex items-center justify-center shadow-md z-10 transition hover:bg-white md:-right-5 md:w-11 md:h-11">❯</button>
        </div>
    )
}


const MainContent = () => {
    const [activeCategory, setActiveCategory] = useState('haberler');
    const categories = ['haberler', 'konusmalar', 'calistaylar', 'bilgi-notlari'];

    return (
        <main>
            <section className="max-w-6xl mx-auto my-10 px-4 sm:px-6 overflow-hidden">
                <h2 className="text-center text-3xl font-bold text-[#2c3e50] mb-6">Güncel Haberler</h2>
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-row justify-center md:flex-col md:justify-start md:items-start p-2.5 md:border-r md:border-gray-200 min-w-[180px] border-b md:border-b-0 overflow-x-auto scrollbar-hide">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`flex-shrink-0 w-auto md:w-full text-left md:text-center text-base md:text-lg font-semibold p-2.5 md:p-4 rounded-lg transition-all duration-300 relative capitalize
                                ${activeCategory === cat ? 'text-accent-gold' : 'text-gray-600 hover:bg-gray-100'}
                                after:content-[''] after:absolute after:transition-all after:duration-300
                                md:after:left-[-11px] md:after:top-1/2 md:after:-translate-y-1/2 md:after:w-1 md:after:h-[70%]
                                after:bottom-[-16px] md:after:bottom-auto after:left-0 after:w-full after:h-1
                                ${activeCategory === cat ? 'after:bg-brand-teal' : 'after:bg-transparent'}`}
                            >
                                {cat.replace('-', ' ')}
                            </button>
                        ))}
                    </div>
                    {/* DEĞİŞİKLİK 5: KATEGORİ DEĞİŞİMİNDE ANİMASYON EKLENDİ */}
                    <div className="flex-grow relative min-w-0">
                       {categories.map(cat => (
                           <div key={cat} className={`transition-opacity duration-500 ease-in-out ${activeCategory === cat ? 'opacity-100' : 'opacity-0 hidden'}`}>
                               <NewsSlider category={cat} cards={newsData[cat]} />
                           </div>
                       ))}
                    </div>
                </div>
            </section>

            <div className="h-24 bg-accent-gold relative">
                 <div className="absolute top-[-2px] h-[calc(100%+2px)] left-0 w-full bg-background" style={{clipPath: 'polygon(0 0, 100% 0, 50% 50%)'}}></div>
            </div>

            <section className="py-16 px-4 bg-accent-gold">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-center text-3xl font-bold text-brand-teal">İmam Hatip Okullarında Program Çeşitliliği</h2>
                    <p className="text-center text-background max-w-3xl mx-auto mt-4">
                        İmam Hatip Okulları; hafızlık, sanat, spor, musiki, teknoloji, dil ve ilahiyat programı uygulayan okulları ile zengin bir program çeşitliliğine sahiptir.
                    </p>

                    <div className="mt-12 grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                        {programData.map((program, index) => (
                             <div key={index} className="bg-white rounded-lg overflow-hidden flex flex-col transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl">
                                <img src={program.img} alt={program.title} className="w-full h-32 md:h-44 object-cover" />
                                <div className="p-4 md:p-6 flex flex-col flex-grow">
                                    <h3 className="text-lg md:text-2xl font-bold mb-2">{program.title}</h3>
                                    <p className="text-sm md:text-base text-gray-600 flex-grow mb-4">{program.desc}</p>
                                    <a href={program.link} className="block w-full py-2 px-4 mt-auto bg-brand-teal text-white text-center rounded-lg font-medium transition-colors duration-300 hover:bg-accent-gold hover:text-brand-teal">
                                        Detaylı Bilgi
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default MainContent;