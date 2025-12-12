import React from 'react';

const DocumentSection = () => {
  const documents = [
    {
      id: 1,
      title: `Din Eğitiminde Kur'an-ı Kerim Öğretimi Çalıştayı`,
      image: "/public/kurumsal/assest/Din Eğitiminde Kur'an-ı Kerim Öğretimi Çalıştayı.png",
      pdfUrl: 'https://onder.org.tr/data/uploads/document/688876fabd9df.pdf'
    },
    {
      id: 2,
      title: 'Uluslararası İmam Hatip Okulları Çalıştayı',
      image: '/public/kurumsal/assest/Uluslararası İmam Hatip Okulları Çalıştayı.png',
      pdfUrl: 'https://onder.org.tr/data/uploads/document/6888771e45f22.pdf'
    },
    {
        id: 3,
        title: 'İmam Hatip Okullarında Arapça Öğretimi Çalıştayı',
        image: '/public/kurumsal/assest/İmam Hatip Okullarında Arapça Öğretimi Çalıştayı.png',
        pdfUrl: 'https://onder.org.tr/data/uploads/document/68887744526ce.pdf'
      }
  ];


  return (
    <div className="min-h-screen bg-gray-502">
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
        <span className="group-hover:underline text-xs md:text-sm">Anasayfa</span>
      </a>
      <svg className="w-3 h-3 md:w-4 md:h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
        <span className="group-hover:underline text-xs md:text-sm text-white">Çalıştay</span>
      <svg className="w-3 h-3 md:w-4 md:h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
      <span className="text-white font-medium text-xs md:text-sm">Çalıştay</span>
    </nav>

    {/* Title */}
    <div className="space-y-1.5 md:space-y-2">
      <div className="flex items-center gap-2 md:gap-3">
        <div className="hidden md:block w-8 md:w-12 h-1 bg-gradient-to-r from-[#b48f65] to-[#ae9242] rounded-full"></div>
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
          Çalıştay Raporları
        </h1>
      </div>
      <p className="text-white/80 text-xs md:text-base font-light max-w-2xl pl-0 md:pl-14">
        İmam Hatip Araştırma ve Eğitim Merkezi Çalıştay Raporları
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