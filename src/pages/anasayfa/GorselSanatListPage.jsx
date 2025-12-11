import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronLeft } from 'lucide-react';
import { gorselSanatSchools } from '../../data/gorselSanatSchools';

const GorselSanatListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Yardımcı Fonksiyon: Türkçe büyük/küçük harf duyarlı metin temizleme
  const toTrLower = (text) => {
    return text ? text.toString().toLocaleLowerCase('tr') : "";
  };

  // 1. GÜNCELLENMİŞ ARAMA FONKSİYONU (Türkçe Uyumlu)
  const filterData = (data) => {
    if (!searchTerm) return data;
    const term = toTrLower(searchTerm);
    
    return data.filter(item => 
      Object.values(item).some(val => 
        toTrLower(val).includes(term)
      )
    );
  };

  // 2. GÜNCELLENMİŞ HIGHLIGHT FONKSİYONU (Regex Düzeltmesi)
  const highlightText = (text) => {
    if (!searchTerm || !text) return text;
    
    // String olduğundan emin olalım
    const textStr = text.toString();

    // Türkçe karakter eşleşmeleri için harita
    const trMap = {
      'i': '[iİ]', 'İ': '[iİ]',
      'ı': '[ıI]', 'I': '[ıI]',
      'ş': '[şŞ]', 'Ş': '[şŞ]',
      'ğ': '[ğĞ]', 'Ğ': '[ğĞ]',
      'ü': '[üÜ]', 'Ü': '[üÜ]',
      'ö': '[öÖ]', 'Ö': '[öÖ]',
      'ç': '[çÇ]', 'Ç': '[çÇ]'
    };

    // Arama terimini Regex formatına uygun hale getiriyoruz
    let regexPattern = searchTerm.split('').map(char => trMap[char] || char).join('');
    
    const regex = new RegExp(`(${regexPattern})`, 'gi');
    const parts = textStr.split(regex);

    return parts.map((part, i) => 
      toTrLower(part) === toTrLower(searchTerm) ? 
        <mark key={i} className="bg-yellow-300 px-1 rounded">{part}</mark> : part
    );
  };
  
  const filteredData = filterData(gorselSanatSchools);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-700 to-amber-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Geleneksel Ve Çağdaş Görsel Sanatlar Programı
          </h1>
          <p className="text-amber-100">
            Hat, ebru, tezhip gibi geleneksel sanatlar eğitimi veren okullar (18 Okul)
          </p>
        </div>
      </header>

      {/* Back Button */}
      <div className="container mx-auto max-w-6xl px-4 py-6">
        <Link
          to="/sanat-programlari"
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-700 text-white rounded-full font-semibold hover:bg-amber-800 transition-colors"
          >
          <ChevronLeft className="w-5 h-5" />
          Program Seçimine Geri Dön
        </Link>
      </div>

      {/* Search Bar - Sticky */}
      <div className="bg-white shadow-lg py-6 px-4 border-b-2 border-gray-200">
        <div className="container mx-auto max-w-6xl">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <input
              type="text"
              placeholder="Okul, il veya ilçe adı ile arayın..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-full focus:border-amber-500 focus:outline-none text-gray-700 bg-white shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="container mx-auto max-w-6xl px-4 pb-12">
        {/* Desktop View */}
        <div className="hidden md:block">
          {/* Table Header - STİCKY */}
          <div className="sticky top-[0px] z-[9998] bg-amber-700 text-white p-4 font-bold shadow-md rounded-t-lg">
            <div className="grid grid-cols-5 gap-4">
              <div>İl</div>
              <div>İlçe</div>
              <div>Okulun Adı</div>
              <div>Pansiyon Durumu</div>
              <div>Öğrenci Alım Şekli</div>
            </div>
          </div>
          
          {/* Table Body */}
          <div className="bg-white rounded-b-lg shadow-lg">
            {filteredData.map((item, idx) => (
              <div key={idx} className="grid grid-cols-5 gap-4 p-4 border-b hover:bg-gray-50 transition-colors">
                <div className="text-gray-800">{highlightText(item.il)}</div>
                <div className="text-gray-800">{highlightText(item.ilce)}</div>
                <div className="text-gray-800">{highlightText(item.okul)}</div>
                <div className="text-gray-600">{highlightText(item.pansiyon)}</div>
                <div className="text-gray-600">{highlightText(item.ogrenci)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4">
          {filteredData.map((item, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-amber-600">
              <div className="space-y-3">
                <div>
                  <span className="font-semibold text-amber-700">İl: </span>
                  <span className="text-gray-800">{highlightText(item.il)}</span>
                </div>
                <div>
                  <span className="font-semibold text-amber-700">İlçe: </span>
                  <span className="text-gray-800">{highlightText(item.ilce)}</span>
                </div>
                <div>
                  <span className="font-semibold text-amber-700">Okul: </span>
                  <span className="text-gray-800">{highlightText(item.okul)}</span>
                </div>
                <div>
                  <span className="font-semibold text-amber-700">Pansiyon: </span>
                  <span className="text-gray-600">{highlightText(item.pansiyon)}</span>
                </div>
                <div>
                  <span className="font-semibold text-amber-700">Öğrenci: </span>
                  <span className="text-gray-600">{highlightText(item.ogrenci)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Toplam Sonuç Sayısı */}
        <div className="mt-6 text-center text-gray-600">
          <p className="font-semibold">
            Toplam <span className="text-amber-700">{filteredData.length}</span> okul listelendi
          </p>
        </div>
      </div>
    </div>
  );
};

export default GorselSanatListPage;