import React from 'react';

const DocumentSection = () => {
  const documents = [
    {
      id: 1,
      title: `Din Eğitiminde Kur'an-ı Kerim Öğretimi Çalıştayı`,
      image: 'https://ihamer.org.tr/wp-content/uploads/2025/07/684aa2c9cf731.png',
      pdfUrl: 'https://onder.org.tr/data/uploads/document/688876fabd9df.pdf'
    },
    {
      id: 2,
      title: 'Uluslararası İmam Hatip Okulları Çalıştayı',
      image: 'https://ihamer.org.tr/wp-content/uploads/2025/07/684aa3cbc3598.png',
      pdfUrl: 'https://onder.org.tr/data/uploads/document/6888771e45f22.pdf'
    },
    {
        id: 3,
        title: 'İmam Hatip Okullarında Arapça Öğretimi Çalıştayı',
        image: 'https://ihamer.org.tr/wp-content/uploads/2025/07/684aa34e1ef14-1.png',
        pdfUrl: 'https://onder.org.tr/data/uploads/document/68887744526ce.pdf'
      }
  ];


  return (
    <div className="min-h-screen bg-gray-502">
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
          <p className="text-white text-4xl font-black mt-2.5 text-center md:text-left mb-7 mt-14">Çalıştaylar</p>
          <h1 className="mt-2">
            <a href="/" className="text-white no-underline font-bold text-xl hover:opacity-80 transition-opacity">
              <span>Anasayfa</span>
              <i className="fas fa-angle-right text-[0.8rem] mx-2"></i>
            </a>
            <a href="/calistay" className="text-white no-underline font-bold hover:opacity-80 text-xl">
              <span>Çalıştaylar</span>
            </a>
          </h1>
        </div>
      </div>

      {/* Document Section */}
      <section className="py-16 px-5">
        <div className="max-w-7xl mx-auto">
          {/* Card Container */}
          <div className="flex justify-center items-stretch flex-wrap gap-8">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl overflow-hidden w-full md:w-[359px] flex flex-col transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl max-w-md md:max-w-none mx-auto"
              >
                {/* Image Wrapper */}
                <div className="relative w-full h-[500px] group">
                  <img
                    src={doc.image}
                    alt={`${doc.title} Kapak Resmi`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Desktop Hover Overlay */}
                  <div className="hidden md:flex absolute inset-0 bg-gray-800/70 justify-center items-center gap-8 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <a
                      href={doc.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white text-4xl transition-transform duration-200 hover:scale-125"
                      title="Görüntüle"
                    >
                      <i className="fas fa-eye"></i>
                    </a>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-grow">
                  <h3 className="text-xl md:text-2xl mb-3 text-gray-800 font-semibold">
                    {doc.title}
                  </h3>
                </div>

                {/* Mobile Links */}
                <div className="md:hidden flex justify-around items-center border-t border-gray-200 p-4 bg-gray-50">
                  <a
                    href={doc.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 no-underline font-semibold text-base flex items-center gap-2 transition-colors duration-200 hover:text-gray-900"
                  >
                    <i className="fas fa-eye"></i>
                    Görüntüle
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DocumentSection;