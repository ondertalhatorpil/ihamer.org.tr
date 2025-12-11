import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ScrollToTopButton from './ScrollToTopButton';
import Highlight from './Highlight';

function SchoolListPage({ title, description, schoolsData, columns, gridTemplateCols }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Arama terimine göre okulları filtrele
  const filteredSchools = useMemo(() => {
    if (!searchTerm.trim()) {
      return schoolsData;
    }
    
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    
    return schoolsData.filter(school => {
      // Okul objesindeki tüm değerleri birleştirip ara
      const schoolDataString = Object.values(school).join(' ').toLowerCase();
      return schoolDataString.includes(lowerCaseSearchTerm);
    });
  }, [searchTerm, schoolsData]);

  return (
    <>
      <header className="list-header py-16 px-4 bg-primary text-white text-center">
        <h1 className="text-white text-4xl md:text-5xl mb-4 font-montserrat">{title}</h1>
        <p className="text-lg text-white/80">{description}</p>
      </header>

      <section className="search-container py-8 bg-light-gray sticky top-0 z-10 shadow-sm">
        <div className="container max-w-2xl mx-auto px-6">
          <div className="search-box flex max-w-xl mx-auto rounded-full overflow-hidden shadow-lg">
            <input
              type="text"
              id="searchInput"
              placeholder="Okul, il veya ilçe adı ile arayın..."
              className="w-full py-4 px-6 border-none text-base focus:outline-none focus:ring-2 focus:ring-secondary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      <div className="back-link-container text-center pt-8 pb-4">
        <Link 
          to="/" 
          className="back-link inline-block py-3 px-8 bg-primary text-white no-underline rounded-full font-semibold transition-colors duration-300 hover:bg-opacity-90"
        >
          ← Ana Sayfaya Geri Dön
        </Link>
      </div>

      <main className="container max-w-6xl mx-auto px-6">
        <div className="responsive-list py-8">
          
          {/* --- DESKTOP BAŞLIK (Sadece md ve üzeri) --- */}
          <div className={`list-header-row hidden md:grid ${gridTemplateCols} gap-4 items-center p-4 font-bold text-primary border-b-2 border-light-gray mb-4 sticky top-[116px] bg-white z-5 shadow-sm`}>
            {columns.map(col => (
              <div key={col.key} className={`data-cell ${col.gridClass}`}>
                {col.label}
              </div>
            ))}
          </div>

          {/* --- OKUL LİSTESİ --- */}
          <div id="school-list">
            {filteredSchools.map((school, index) => (
              <div 
                key={index} 
                className="list-item block md:grid ${gridTemplateCols} gap-4 items-center p-4 bg-white border-b border-light-gray
                           md:hover:bg-light-gray/50 transition-colors duration-200
                           mb-4 md:mb-0 rounded-lg md:rounded-none shadow-md md:shadow-none border-l-4 md:border-l-0 border-primary"
              >
                
                {/* --- MOBIL GÖRÜNÜM (Sadece md altı) --- */}
                <div className="data-cells-mobile md:hidden">
                  {columns.map(col => (
                    <div key={col.key} className="data-cell block py-1 text-base">
                      <span className="font-semibold text-primary inline-block w-36">
                        {col.label}
                      </span>
                      <span>
                        <Highlight text={school[col.key]} highlight={searchTerm} />
                      </span>
                    </div>
                  ))}
                </div>

                {/* --- DESKTOP GÖRÜNÜM (Sadece md ve üzeri) --- */}
                <div className={`data-cells-desktop hidden md:grid ${gridTemplateCols} gap-4 contents`}>
                  {columns.map(col => (
                    <div key={col.key} className={`data-cell ${col.gridClass}`}>
                      <Highlight text={school[col.key]} highlight={searchTerm} />
                    </div>
                  ))}
                </div>

              </div>
            ))}
            
            {filteredSchools.length === 0 && (
              <div className="text-center p-12 text-text-color/70 text-lg">
                Aramanızla eşleşen okul bulunamadı.
              </div>
            )}
          </div>
        </div>
      </main>

      <ScrollToTopButton />
    </>
  );
}

export default SchoolListPage;