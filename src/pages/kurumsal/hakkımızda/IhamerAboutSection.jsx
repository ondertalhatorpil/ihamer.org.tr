import React, { useState } from "react";

const IhamerAboutSection = () => {
  const [activeTab, setActiveTab] = useState("biz-kimiz");

  // --- Sınıf Tanımlamaları ---
  const getNavButtonClasses = (tabId) => {
    const isActive = activeTab === tabId;

    const baseClasses =
      "block cursor-pointer transition-all duration-400 ease-in-out " +
      "text-base p-[5px] md:text-[1.1rem] lg:text-[1.8rem] lg:font-bold lg:p-0 " +
      "hover:text-[#1a3a5d]";

    const mobileClasses = isActive
      ? "border-b-[3px] border-b-[#d4a056]"
      : "border-b-[3px] border-b-transparent";

    const desktopClasses = isActive
      ? "lg:border-b-0 lg:border-l-[5px] lg:border-l-[#d4a056] lg:pl-[5px]"
      : "lg:border-b-0 lg:border-l-[5px] lg:border-l-transparent";

    const colorClass = isActive ? "text-[#1a3a5d]" : "text-[#adb5bd]";

    return `${baseClasses} ${colorClass} ${mobileClasses} ${desktopClasses}`;
  };

  const getArticleClasses = (tabId) => {
    const isActive = activeTab === tabId;

    const baseClasses =
      "transition-all duration-300 ease absolute top-10 left-5 right-5 " +
      "lg:top-[60px] lg:left-[40px] lg:right-[40px]";

    const stateClasses = isActive
      ? "opacity-100 visible translate-y-0 relative top-auto left-auto right-auto"
      : "opacity-0 invisible translate-y-[90px]";

    return `${baseClasses} ${stateClasses}`;
  };

  const valueTitleClasses =
    "text-[1.3rem] text-[#1a3a5d] mb-[15px] relative pb-[10px] " +
    "after:content-[''] after:absolute after:bottom-0 after:left-0 " +
    "after:w-[30px] after:h-[3px] after:bg-[#d4a056]";

  return (
    <div className="min-h-screen bg-gray-50 py">
      {/* Wrapper Section */}
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
            <a>
              <span className="text-xs md:text-sm text-white">
                Kurumsal
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
              Hakkımızda
            </span>
          </nav>

          {/* Title */}
          <div className="space-y-1.5 md:space-y-2">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="hidden md:block w-8 md:w-12 h-1 bg-gradient-to-r from-[#b48f65] to-[#ae9242] rounded-full"></div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                Hakkımızda
              </h1>
            </div>
            <p className="text-white/80 text-xs md:text-base font-light max-w-2xl pl-0 md:pl-14">
              İmam Hatip Araştırma ve Eğitim Merkezi
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
      {/* --- ORIGINAL TABBED CONTENT --- */}
      <section className="ihamer-tabbed-about-section py-[60px] text-[#343a40]">
        <div className="tabbed-grid-container max-w-[1400px] mx-auto rounded-[15px] min-h-0 px-0 grid grid-cols-1 lg:grid-cols-[300px_1fr] lg:gap-[80px] lg:min-h-[70vh] lg:px-[40px]">
          {/* SOL PANEL (Menü) */}
          <aside className="tabbed-left-panel p-5 border-b border-[#e9ecef] lg:px-[40px] lg:py-[60px] lg:border-b-0 lg:border-r">
            <nav className="tabbed-nav">
              <ul className="relative flex justify-center lg:sticky lg:top-[150px] lg:block">
                <li className="mb-0 mx-[10px] lg:mb-5 lg:mx-0">
                  <button
                    onClick={() => setActiveTab("biz-kimiz")}
                    className={getNavButtonClasses("biz-kimiz")}
                  >
                    Biz Kimiz?
                  </button>
                </li>
                <li className="mb-0 mx-[10px] lg:mb-5 lg:mx-0">
                  <button
                    onClick={() => setActiveTab("misyon-vizyon")}
                    className={getNavButtonClasses("misyon-vizyon")}
                  >
                    Gayemiz
                  </button>
                </li>
                <li className="mb-0 mx-[10px] lg:mb-5 lg:mx-0">
                  <button
                    onClick={() => setActiveTab("degerlerimiz")}
                    className={getNavButtonClasses("degerlerimiz")}
                  >
                    Değerlerimiz
                  </button>
                </li>
              </ul>
            </nav>
          </aside>

          {/* SAĞ PANEL (İçerik) */}
          <main className="tabbed-right-panel relative px-5 py-10 lg:px-[40px] lg:py-[60px] min-h-[50vh]">
            <article id="biz-kimiz" className={getArticleClasses("biz-kimiz")}>
              <h2 className="text-[2.5rem] font-bold text-[#1a3a5d] mb-[25px]">
                Biz Kimiz
              </h2>
              <p className="text-justify text-[1.1rem] leading-[1.9] mb-[1.5em] italic">
                <strong>İmam Hatip Araştırmaları Merkezi (İHAMER)</strong>, 2023
                yılında ÖNDER İmam Hatipliler Derneği çatısı altında, Türkiye
                genelindeki İmam Hatip okullarına yönelik akademik ve ilmî
                faaliyetlere destek sunmak ve imam hatip modelini geliştirmek
                için kurulmuştur.
              </p>
              <p className="text-justify text-[1.1rem] leading-[1.9] mb-[1.5em] italic">
                Merkezimiz, İmam Hatip okullarının niteliklerini geliştirmek
                için sürekli yayın ve kitap faaliyetleri yürütür. Seminerler,
                sempozyumlar ve atölye çalışmaları düzenler. Ayrıca İmam
                Hatiplere yönelik lisansüstü akademik çalışmaları desteklemek
                amacıyla yüksek lisans ve doktora öğrencilerine rehberlik
                etmekte, burs ve çeşitli öğrenim ödenekleri imkânlarını sunarak
                desteklemektedir.
              </p>
            </article>

            <article
              id="misyon-vizyon"
              className={getArticleClasses("misyon-vizyon")}
            >
              <h2 className="text-[2.5rem] font-bold text-[#1a3a5d] mb-[25px]">
                Misyonumuz
              </h2>
              <p className="text-[1.1rem]  text-justify leading-[1.9] mb-[1.5em] italic">
                Türkiye’nin ve Ümmet Coğrafyası’nın istikbalinde söz sahibi
                olacak İmam Hatip okulları ve mensuplarının milli, manevi,
                ahlaki ve kültürel olarak tekamülüne katkı sağlayacak akademik
                çalışmalar ve kültür faaliyetlerinde bulunmaktır.
              </p>
              <h2 className="text-[2.5rem]  text-justify font-bold text-[#1a3a5d] mb-[25px]">
                Vizyonumuz
              </h2>
              <p className="text-[1.1rem] leading-[1.9] mb-[1.5em] italic">
                İmam Hatip okulları modeline ve İmam Hatip mensuplarına dair tüm
                verilere kolaylıkla ulaşılabilen doğru ve güvenilir bilginin
                kaynağı olmaktır.
              </p>
            </article>

            <article
              id="degerlerimiz"
              className={getArticleClasses("degerlerimiz")}
            >
              <h2 className="text-[2.5rem] font-bold text-[#1a3a5d] mb-[25px]">
                Değerlerimiz
              </h2>
              <div className="elegant-values-grid-v2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                <div className="elegant-value-item-v2">
                  <h4 className={valueTitleClasses}>Bilgi ve Hikmet</h4>
                  <p className="text-[1.05rem] leading-[1.7] m-0 italic">
                    “Bilgiyi hikmetle mezc eder, ilmi irfanla taçlandırır.”
                  </p>
                </div>
                <div className="elegant-value-item-v2">
                  <h4 className={valueTitleClasses}>Basiret</h4>
                  <p className="text-[1.05rem] leading-[1.7] m-0 italic">
                    “Olayları zahirine göre değil, hakikatine göre değerlendirir.”
                  </p>
                </div>
                <div className="elegant-value-item-v2">
                  <h4 className={valueTitleClasses}>Ehliyet ve Liyakat</h4>
                  <p className="text-[1.05rem] leading-[1.7] m-0 italic">
                    “Görev ve emaneti ehline tevdi eder, liyakati esas alır.”
                  </p>
                </div>
                <div className="elegant-value-item-v2">
                  <h4 className={valueTitleClasses}>İstikamet</h4>
                  <p className="text-[1.05rem] leading-[1.7] m-0 italic">
                    “Her durumda hakkaniyeti gözetir, istikametten ayrılmaz.”
                  </p>
                </div>
                <div className="elegant-value-item-v2">
                  <h4 className={valueTitleClasses}>Samimiyet</h4>
                  <p className="text-[1.05rem] leading-[1.7] m-0 italic">
                    “Niyetinde ihlâsı, sözünde sadakati merkeze alır.”
                  </p>
                </div>
                <div className="elegant-value-item-v2">
                  <h4 className={valueTitleClasses}>İrfan</h4>
                  <p className="text-[1.05rem] leading-[1.7] m-0 italic">
                    “İlmi kalp ile yoğurur, marifeti irfana dönüştürür.”
                  </p>
                </div>
              </div>
            </article>
          </main>
        </div>
      </section>
    </div>
  );
};

export default IhamerAboutSection;