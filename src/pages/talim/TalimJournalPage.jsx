import React from "react";

const TalimJournalPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Wrapper Section (Header) */}
      <div className="relative w-full h-[180px] md:h-[240px] overflow-hidden bg-gradient-to-br from-[#1a1826] via-[#2d3035] to-[#1a1826]">
        {/* Overlay pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="grid-pattern"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="20" cy="20" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
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
              <svg
                className="w-3.5 h-3.5 md:w-4 md:h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span className="text-xs md:text-sm">
                Anasayfa
              </span>
            </a>
            <svg
              className="w-3 h-3 md:w-4 md:h-4 text-white/60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span className="text-white font-medium text-xs md:text-sm">
              Talim Dergisi
            </span>
          </nav>

          {/* Title */}
          <div className="space-y-1.5 md:space-y-2">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="hidden md:block w-8 md:w-12 h-1 bg-gradient-to-r from-[#b48f65] to-[#ae9242] rounded-full"></div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Talim Dergisi
              </h1>
            </div>
            <p className="text-white/80 text-xs md:text-base font-light max-w-2xl pl-0 md:pl-14">
              İmam Hatip Araştırma ve Eğitim Merkezi Talim Dergisi
            </p>
          </div>
        </div>

        {/* Dekoratif pattern - sağ alt köşe */}
        <div className="absolute bottom-0 right-0 w-24 h-24 md:w-48 md:h-48 opacity-10">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle
              cx="180"
              cy="180"
              r="100"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="2"
            />
            <circle
              cx="180"
              cy="180"
              r="70"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="1.5"
            />
            <circle
              cx="180"
              cy="180"
              r="40"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="1"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#b48f65" />
                <stop offset="100%" stopColor="#ae9242" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 md:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-[15px] shadow-xl p-6 md:p-10 lg:p-12 border border-gray-100">
          
          {/* Header & ISSN */}
          <div className="text-center mb-12 pb-8 border-b border-gray-100">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a3a5d] mb-4">
              Talim: Journal of Education in Muslim Societies and Communities
            </h2>
            <div className="inline-block bg-gray-50 px-6 py-2 rounded-full border border-gray-200">
              <p className="text-[#d4a056] font-semibold text-sm md:text-base tracking-wide">
                ISSN: 2587-1927 &nbsp;|&nbsp; e-ISSN: 2630-5887
              </p>
            </div>
          </div>

          {/* Türkçe Metin */}
          <div className="mb-12">
            <h3 className="text-xl font-bold text-[#1a3a5d] mb-4 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-[#d4a056] rounded-full inline-block"></span>
              Türkçe
            </h3>
            <p className="text-justify text-[1.1rem] leading-[1.9] text-gray-700">
              2017 yılında yayın hayatına başlayan <strong>Talim: Journal of Education in Muslim Societies and Communities</strong>, ÖNDER İmam Hatipliler Derneği bünyesindeki İmam Hatip Araştırmaları Merkezi'nin (İHAMER) akademik yayın organı olup, Mart ve Eylül aylarında olmak üzere yılda iki kez Türkçe, İngilizce ve Arapça dillerinde yayımlanan uluslararası hakemli bir dergidir. Müslüman toplumlarda ve topluluklarda eğitim ile din eğitimi süreçlerini disipliner veya disiplinlerarası perspektiflerle ele alan kuramsal ve uygulamalı çalışmalara odaklanan dergi; telif ve tercüme makaleler, araştırma notları, sempozyum, kitap ve tez değerlendirmeleri, vefayât yazıları ve edisyon kritik gibi geniş bir yelpazede bilimsel içerik kabul etmektedir. Tam açık erişim politikasını benimseyen Talim, bilimsel bilginin yaygınlaştırılması amacıyla tüm içeriğini okuyuculara ücretsiz olarak sunmaktadır.
            </p>
          </div>

          {/* English Text */}
          <div className="mb-12 bg-gray-50 p-6 md:p-8 rounded-xl border border-gray-100">
            <h3 className="text-xl font-bold text-[#1a3a5d] mb-4 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-[#1a3a5d] rounded-full inline-block"></span>
              English
            </h3>
            <p className="text-justify text-[1.1rem] leading-[1.9] text-gray-700">
              Established in 2017, <strong>Talim: Journal of Education in Muslim Societies and Communities</strong> is an international peer-reviewed journal published biannually in March and September under the auspices of the Imam Hatip Research Center (İHAMER) within the ÖNDER: Association of Imam Hatip Attendants. Featuring multilingual content in Turkish, English, and Arabic, the journal publishes theoretical and empirical studies that examine education and religious education in Muslim societies through disciplinary or interdisciplinary lenses. Its scope encompasses a diverse range of scholarly contributions, including original and translated articles, research notes, symposium, book, and thesis reviews, obituaries, and critical editions. Committed to the principles of open access, Talim provides its entire scholarly repository to the public free of charge to foster global academic exchange.
            </p>
          </div>

          {/* Arabic Text (RTL) */}
          <div className="mb-12" dir="rtl">
            <h3 className="text-xl font-bold text-[#1a3a5d] mb-4 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-[#d4a056] rounded-full inline-block"></span>
              العربية
            </h3>
            <p className="text-justify text-[1.1rem] leading-[2] text-gray-700 font-arabic">
              تُعدّ مجلة <strong>تعليم: مجلة التربية في المجتمعات والجماعات المسلمة</strong> (Talim: Journal of Education in Muslim Societies and Communities) دورية علمية دولية محكّمة، بدأت مسيرتها البحثية في عام 2017م، وتصدر مرتين في السنة (في شهري مارس وأيلول) باللغات التركية والإنجليزية والعربية. وهي الإصدار الأكاديمي لـ (مركز أبحاث الأئمة والخطباء - İHAMER) التابع لـ (جمعية "أوندر" لخريجي مدارس الأئمة والخطباء - Önder İmam Hatipliler Derneği). تُركز المجلة على نشر الدراسات النظرية والتطبيقية التي تتناول قضايا التربية والتعليم الديني في المجتمعات المسلمة من منظورات تخصصية أو بين-بينية، كما تشتمل محتوياتها على مقالات أصيلة ومترجمة، وملاحظات بحثية، وتقييمات للمؤتمرات والكتب والرسائل العلمية، بالإضافة إلى الوفيات والتحقيقات العلمية. وباعتبارها مجلة ذات وصول مفتوح (Open Access)، فإنها تتيح كافة محتوياتها للقراء بشكل مجاني دعماً لانتشار المعرفة العلمية.
            </p>
          </div>

          {/* Links Section */}
          <div className="pt-10 border-t border-gray-200 mt-10">
            <h3 className="text-lg md:text-xl font-bold text-center text-[#1a3a5d] mb-8">
              Bağlantılar &bull; Links &bull; الروابط
            </h3>
            
            {/* Website Button */}
            <div className="flex justify-center mb-8">
              <a 
                href="https://dergipark.org.tr/tr/pub/talim" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#1a3a5d] hover:bg-[#ae9242] text-white px-8 py-3.5 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                Web Adresi (DergiPark)
              </a>
            </div>

            {/* Social Media Buttons */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <a href="https://x.com/TalimDergisi" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm">
                X (Twitter)
              </a>
              <a href="https://www.instagram.com/talimdergisi/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm">
                Instagram
              </a>
              <a href="https://www.linkedin.com/in/talim-dergisi-8295823a0/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm">
                LinkedIn
              </a>
              <a href="https://nsosyal.com/talimdergisi" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm">
                Nsosyal
              </a>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default TalimJournalPage;