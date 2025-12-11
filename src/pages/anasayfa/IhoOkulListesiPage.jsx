import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronLeft } from 'lucide-react';
import { ihoSchools } from '../../data/ihoSchools';

const IhoOkulListesiPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

   useEffect(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }, [searchTerm]);

  const toTrLower = (text) => {
    return text ? text.toString().toLocaleLowerCase('tr') : "";
  };

  const filterData = (data) => {
    if (!searchTerm) return data;
    const term = toTrLower(searchTerm);
    
    return data.filter(item => 
      Object.values(item).some(val => 
        toTrLower(val).includes(term)
      )
    );
  };

  const highlightText = (text) => {
    if (!searchTerm || !text) return text;
    
    const textStr = text.toString();

    const trMap = {
      'i': '[iİ]', 'İ': '[iİ]',
      'ı': '[ıI]', 'I': '[ıI]',
      'ş': '[şŞ]', 'Ş': '[şŞ]',
      'ğ': '[ğĞ]', 'Ğ': '[ğĞ]',
      'ü': '[üÜ]', 'Ü': '[üÜ]',
      'ö': '[öÖ]', 'Ö': '[öÖ]',
      'ç': '[çÇ]', 'Ç': '[çÇ]'
    };

    let regexPattern = searchTerm.split('').map(char => trMap[char] || char).join('');
    
    const regex = new RegExp(`(${regexPattern})`, 'gi');
    const parts = textStr.split(regex);

    return parts.map((part, i) => 
      toTrLower(part) === toTrLower(searchTerm) ? 
        <mark key={i} className="bg-yellow-300 px-1 rounded">{part}</mark> : part
    );
  };

  
  const filteredData = filterData(ihoSchools);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-teal-700 to-teal-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Hafız Yetiştiren İmam Hatip Ortaokulları
          </h1>
          <p className="text-teal-100">
            Proje kapsamında öğrenci kabul eden İmam Hatip Ortaokulları
          </p>
        </div>
      </header>

      <div className="container mx-auto max-w-6xl px-4 py-6">
        <Link
          to="/HafizlikProgramlari/iho"
          onClick={() => window.scrollTo(0, 0)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-teal-700 text-white rounded-full font-semibold hover:bg-teal-800 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Açıklamaya Geri Dön
        </Link>
      </div>

      <div className="bg-white shadow-lg py-6 px-4 border-b-2 border-gray-200">
        <div className="container mx-auto max-w-6xl">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <input
              type="text"
              placeholder="Okul, il veya ilçe adı ile arayın..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-full focus:border-teal-500 focus:outline-none text-gray-700 bg-white shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 pb-12">
        <div className="hidden md:block">
          <div className="sticky top-[0px] z-[8999] bg-teal-700 text-white p-4 font-bold shadow-md rounded-t-lg">
            <div className="grid grid-cols-4 gap-4">
              <div>İl / İlçe</div>
              <div>Okul Adı</div>
              <div>Uygulanan Proje</div>
              <div>Uygulanan Program</div>
            </div>
          </div>
          
          <div className="bg-white rounded-b-lg shadow-lg">
            {filteredData.map((item, idx) => (
              <div key={idx} className="grid grid-cols-4 gap-4 p-4 border-b hover:bg-gray-50 transition-colors">
                <div className="text-gray-800">{highlightText(`${item.il} / ${item.ilce}`)}</div>
                <div className="text-gray-800">{highlightText(item.okul)}</div>
                <div className="text-gray-600">{highlightText(item.proje)}</div>
                <div className="text-gray-600">{highlightText(item.program)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:hidden space-y-4">
          {filteredData.map((item, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-teal-600">
              <div className="space-y-3">
                <div>
                  <span className="font-semibold text-teal-700">İl / İlçe: </span>
                  <span className="text-gray-800">{highlightText(`${item.il} / ${item.ilce}`)}</span>
                </div>
                <div>
                  <span className="font-semibold text-teal-700">Okul Adı: </span>
                  <span className="text-gray-800">{highlightText(item.okul)}</span>
                </div>
                <div>
                  <span className="font-semibold text-teal-700">Proje: </span>
                  <span className="text-gray-600">{highlightText(item.proje)}</span>
                </div>
                <div>
                  <span className="font-semibold text-teal-700">Program: </span>
                  <span className="text-gray-600">{highlightText(item.program)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center text-gray-600">
          <p className="font-semibold">
            Toplam <span className="text-teal-700">{filteredData.length}</span> okul listelendi
          </p>
        </div>
      </div>
    </div>
  );
};

export default IhoOkulListesiPage;