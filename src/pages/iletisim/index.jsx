import React from 'react';

export default function IletisimSayfasi() {
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
              <span className="group-hover:underline text-xs md:text-sm">Anasayfa</span>
            </a>
            <svg className="w-3 h-3 md:w-4 md:h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white font-medium text-xs md:text-sm">İletişim</span>
          </nav>

          {/* Title */}
          <div className="space-y-1.5 md:space-y-2">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="hidden md:block w-8 md:w-12 h-1 bg-gradient-to-r from-[#b48f65] to-[#ae9242] rounded-full"></div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                İletişim
              </h1>
            </div>
            <p className="text-white/80 text-xs md:text-base font-light max-w-2xl pl-0 md:pl-14">
              İmam Hatip Araştırma ve Eğitim Merkezi İletişim Sayfası
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

      {/* İletişim Section */}
      <section className="py-[100px] bg-white relative overflow-hidden font-['Lexend']">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        ></div>

        <div className="max-w-[1200px] mx-auto px-5 relative z-[2]">
          {/* Section Title */}
          <div className="text-center mb-[60px]">
            <h2 className="text-[2.5rem] sm:text-[2rem] font-bold text-[#c3976b] mb-[15px] relative pb-5">
              Bize Ulaşın
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-[#c3976b] rounded"></span>
            </h2>
          </div>

          {/* İletişim Wrapper */}
          <div className="flex flex-wrap lg:flex-nowrap gap-10 items-stretch">
            {/* Konum Wrapper */}
            <div className="flex-[1.2] min-w-[320px] overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.662345925089!2d28.974374776040634!3d41.010763071350134!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab9be2d8b7adf%3A0x7f1d877ca0df76c3!2zQWxlbWRhciwgSMO8a8O8bWV0IEtvbmHEn8SxIENkLiBObzo3LCAzNDExMCBGYXRpaC_EsHN0YW5idWw!5e0!3m2!1str!2str!4v1758282693441!5m2!1str!2str"
                width="600"
                height="450"
                className="w-full h-full min-h-[500px] lg:min-h-[400px] border-0 align-middle"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            {/* Bilgiler Wrapper */}
            <div className="flex-1 min-w-[320px] flex flex-col">
              {/* Adres */}
              <div className="flex items-start mb-[35px]">
                <div className="text-[#c3976b] text-[1.8rem] sm:text-[1.5rem] mr-[25px] sm:mr-5 w-10 text-center">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div>
                  <h3 className="text-[1.4rem] sm:text-[1.2rem] font-semibold text-[#c3976b] m-0 mb-2">
                    Adres
                  </h3>
                  <p className="m-0 text-base text-[#1f1e2f] leading-relaxed">
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://www.google.com/maps/place/Alemdar,+H%C3%BCk%C3%BCmet+Kona%C4%9F%C4%B1+Cd.+No:7,+34110+Fatih%2F%C4%B0stanbul/@41.010763,28.97695,16z/data=!4m6!3m5!1s0x14cab9be2d8b7adf:0x7f1d877ca0df76c3!8m2!3d41.0107631!4d28.9769497!16s%2Fg%2F11bymt2h4g?hl=tr&entry=ttu&g_ep=EgoyMDI1MDkyMi4wIKXMDSoASAFQAw%3D%3D"
                      className="text-[#1f1e2f] no-underline hover:text-[#c3976b] transition-colors duration-300"
                    >
                      Akşemsettin, Şair Fuzuli Sk. No: 22/2, 34080 Fatih/İstanbul
                    </a>
                  </p>
                </div>
              </div>

              {/* Telefon */}
           {/*    <div className="flex items-start mb-[35px]">
                <div className="text-[#c3976b] text-[1.8rem] sm:text-[1.5rem] mr-[25px] sm:mr-5 w-10 text-center">
                  <i className="fas fa-phone"></i>
                </div>
                <div>
                  <h3 className="text-[1.4rem] sm:text-[1.2rem] font-semibold text-[#c3976b] m-0 mb-2">
                    Telefon
                  </h3>
                  <p className="m-0 text-base text-[#1f1e2f] leading-relaxed">
                    <a
                      href="tel:+902125211958"
                      className="text-[#1f1e2f] no-underline hover:text-[#c3976b] transition-colors duration-300"
                    >
                      (0212) 521 19 58
                    </a>
                  </p>
                </div>
              </div> */}

              {/* E-posta */}
              <div className="flex items-start mb-[35px]">
                <div className="text-[#c3976b] text-[1.8rem] sm:text-[1.5rem] mr-[25px] sm:mr-5 w-10 text-center">
                  <i className="fas fa-envelope"></i>
                </div>
                <div>
                  <h3 className="text-[1.4rem] sm:text-[1.2rem] font-semibold text-[#c3976b] m-0 mb-2">
                    E-posta
                  </h3>
                  <p className="m-0 text-base text-[#1f1e2f] leading-relaxed">
                    <a
                      href="mailto:ihamer@onder.org.tr"
                      className="text-[#1f1e2f] no-underline hover:text-[#c3976b] transition-colors duration-300"
                    >
                      ihamer@onder.org.tr
                    </a>
                  </p>
                </div>
              </div>

              {/* Açıklama Metni */}
              <div>
                <p className="text-[1.3rem] sm:text-base italic opacity-50 text-[#1f1e2f] m-0">
                  Sorularınız, görüşleriniz veya iş birliği talepleriniz için bizimle iletişime geçmekten çekinmeyin.
                </p>
              </div>

              {/* Sosyal Medya */}
              <div className="mt-5 pt-[30px] ml-2.5">
                <h3 className="text-[1.4rem] text-[#c3976b] mb-5 font-semibold">
                  Bizi Takip Edin
                </h3>
                <div className="flex gap-[15px]">
                  <a
                    href="https://www.instagram.com/ihamer.tr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="text-[#c3976b] bg-[#1f1e2f] text-[1.2rem] w-[45px] h-[45px] rounded-full inline-flex justify-center items-center transition-all duration-300 ease-out hover:bg-[#c3976b] hover:text-[#1f1e2f] hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(195,151,107,0.3)] no-underline"
                  >
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a
                    href="https://www.facebook.com/ihamer.tr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="text-[#c3976b] bg-[#1f1e2f] text-[1.2rem] w-[45px] h-[45px] rounded-full inline-flex justify-center items-center transition-all duration-300 ease-out hover:bg-[#c3976b] hover:text-[#1f1e2f] hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(195,151,107,0.3)] no-underline"
                  >
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a
                    href="https://x.com/ihamertr"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter"
                    className="text-[#c3976b] bg-[#1f1e2f] text-[1.2rem] w-[45px] h-[45px] rounded-full inline-flex justify-center items-center transition-all duration-300 ease-out hover:bg-[#c3976b] hover:text-[#1f1e2f] hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(195,151,107,0.3)] no-underline"
                  >
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a
                    href="https://tr.linkedin.com/in/ihamertr"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="text-[#c3976b] bg-[#1f1e2f] text-[1.2rem] w-[45px] h-[45px] rounded-full inline-flex justify-center items-center transition-all duration-300 ease-out hover:bg-[#c3976b] hover:text-[#1f1e2f] hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(195,151,107,0.3)] no-underline"
                  >
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}