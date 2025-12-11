import React from 'react';

export default function IletisimSayfasi() {
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
          <p className="text-white text-4xl font-black mt-2.5 text-center md:text-left mb-7 mt-14">İletişim</p>
          <h1 className="mt-2">
            <a href="/" className="text-white no-underline font-bold text-xl hover:opacity-80 transition-opacity">
              <span>Anasayfa</span>
              <i className="fas fa-angle-right text-[0.8rem] mx-2"></i>
            </a>
            <a href="/iletisim" className="text-white no-underline font-bold hover:opacity-80 text-xl">
              <span>İletişim</span>
            </a>
          </h1>
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