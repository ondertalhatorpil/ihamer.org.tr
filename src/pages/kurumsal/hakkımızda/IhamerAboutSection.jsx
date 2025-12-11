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
      <div
        // bg-center sınıfı resmin ortasını odaklar
        className="w-full px-5 h-[220px] relative flex flex-col md:justify-start md:items-start justify-center items-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/public/kurumsal/assest/wrapper-2.png')",
        }}
      >
        {/* Overlay - DEĞİŞTİRİLDİ: Soldan sağa gradient (Solda koyu, sağa doğru şeffaflaşan) */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>

        {/* Content */}
        <div className="relative z-[2] text-white md:text-left text-center">
          <p className="text-white text-4xl font-black mt-2.5 text-center md:text-left mb-7 mt-14">
            Hakkımızda
          </p>
          <h1 className="mt-2">
            <a
              href="/"
              className="text-white no-underline font-bold text-xl hover:opacity-80 transition-opacity"
            >
              <span>Anasayfa</span>
              <i className="fas fa-angle-right text-[0.8rem] mx-2"></i>
            </a>
            <a
              href="/hakkimizda"
              className="text-white no-underline font-bold hover:opacity-80 text-xl"
            >
              <span>Hakkımızda</span>
            </a>
          </h1>
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
              <p className="text-[1.1rem] leading-[1.9] mb-[1.5em] italic">
                <strong>İmam Hatip Araştırmaları Merkezi (İHAMER)</strong>, 2023
                yılında ÖNDER İmam Hatipliler Derneği çatısı altında, Türkiye
                genelindeki İmam Hatip okullarına yönelik akademik ve ilmî
                faaliyetlere destek sunmak ve imam hatip modelini geliştirmek
                için kurulmuştur.
              </p>
              <p className="text-[1.1rem] leading-[1.9] mb-[1.5em] italic">
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
              <p className="text-[1.1rem] leading-[1.9] mb-[1.5em] italic">
                Türkiye’nin ve Ümmet Coğrafyası’nın istikbalinde söz sahibi
                olacak İmam Hatip okulları ve mensuplarının milli, manevi,
                ahlaki ve kültürel olarak tekamülüne katkı sağlayacak akademik
                çalışmalar ve kültür faaliyetlerinde bulunmaktır.
              </p>
              <h2 className="text-[2.5rem] font-bold text-[#1a3a5d] mb-[25px]">
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
                    “Olayları zahirine göre değil, hakikatine göre
                    değerlendirir.”
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
