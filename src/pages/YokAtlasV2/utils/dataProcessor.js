// Puan türlerini kategorilere ayır
export const categorizePuanTuru = (puanTuru) => {
  if (!puanTuru) return 'Diğer';
  
  const sayisal = ['MF', 'TM', 'SAY'];
  const sozel = ['TM', 'SÖZ', 'DIL'];
  const ea = ['EA', 'TM'];
  
  const upper = puanTuru.toUpperCase();
  
  if (sayisal.includes(upper)) return 'Sayısal';
  if (sozel.includes(upper)) return 'Sözel';
  if (ea.includes(upper)) return 'Eşit Ağırlık';
  
  return 'Dil';
};

// Bölüm ismini normalize et (parantez içi bilgileri kaldır)
export const normalizeProgramName = (programName) => {
  if (!programName) return '';
  
  // Parantez içindeki bilgileri kaldır
  // Örnek: "İngilizce Öğretmenliği (İngilizce)" -> "İngilizce Öğretmenliği"
  // Örnek: "Hukuk (Tam Burslu)" -> "Hukuk"
  // Örnek: "İşletme (%50 İndirimli)" -> "İşletme"
  
  const normalized = programName.replace(/\s*\([^)]*\)\s*/g, '').trim();
  return normalized;
};

// Bölüm detaylarını çıkar (parantez içi)
export const extractProgramDetails = (programName) => {
  if (!programName) return [];
  
  const details = [];
  const regex = /\(([^)]+)\)/g;
  let match;
  
  while ((match = regex.exec(programName)) !== null) {
    details.push(match[1].trim());
  }
  
  return details;
};

// Açıköğretim kontrolü
export const isAcikogretim = (programName, universityName) => {
  const lowerProgram = programName?.toLowerCase() || '';
  const lowerUniv = universityName?.toLowerCase() || '';
  
  return lowerProgram.includes('açıköğretim') || 
         lowerProgram.includes('aof') ||
         lowerUniv.includes('açıköğretim') ||
         lowerUniv.includes('anadolu üniversitesi açıköğretim');
};

// Toplam İHL öğrenci sayısını hesapla
export const calculateTotalIHLStudents = (records, year) => {
  return records
    .filter(r => r.year === year)
    .reduce((sum, record) => {
      const ihlCount = record.imam_hatip_lise_tipi?.reduce((s, tip) => 
        s + (tip.yerlesen || 0), 0) || 0;
      return sum + ihlCount;
    }, 0);
};

// Trend hesapla (artış/azalış)
export const calculateTrend = (currentValue, previousValue) => {
  if (!previousValue || previousValue === 0) return { percentage: 0, direction: 'neutral' };
  
  const change = ((currentValue - previousValue) / previousValue) * 100;
  
  return {
    percentage: Math.abs(change).toFixed(1),
    direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
  };
};

// Şehir bazlı gruplama
export const groupByCity = (records, year) => {
  const cityMap = {};
  
  records
    .filter(r => r.year === year && r.city)
    .forEach(record => {
      const city = record.city;
      const ihlCount = record.imam_hatip_lise_tipi?.reduce((s, tip) => 
        s + (tip.yerlesen || 0), 0) || 0;
      
      if (!cityMap[city]) {
        cityMap[city] = { count: 0, total: 0 };
      }
      
      cityMap[city].count += ihlCount;
      cityMap[city].total += record.toplam_yerlesen || 0;
    });
  
  return Object.entries(cityMap).map(([city, data]) => ({
    city,
    count: data.count,
    total: data.total,
    percentage: data.total > 0 ? ((data.count / data.total) * 100).toFixed(2) : 0
  }));
};

// Üniversite bazlı gruplama
export const groupByUniversity = (records, year) => {
  const univMap = {};
  
  records
    .filter(r => r.year === year && r.university_name)
    .forEach(record => {
      const univ = record.university_name;
      const ihlCount = record.imam_hatip_lise_tipi?.reduce((s, tip) => 
        s + (tip.yerlesen || 0), 0) || 0;
      
      if (!univMap[univ]) {
        univMap[univ] = {
          name: univ,
          type: record.university_type,
          city: record.city,
          count: 0,
          total: 0,
          programs: new Set()
        };
      }
      
      univMap[univ].count += ihlCount;
      univMap[univ].total += record.toplam_yerlesen || 0;
      univMap[univ].programs.add(record.program_name);
    });
  
  return Object.values(univMap).map(univ => ({
    ...univ,
    programCount: univ.programs.size,
    percentage: univ.total > 0 ? ((univ.count / univ.total) * 100).toFixed(2) : 0
  }));
};

// Program bazlı gruplama
export const groupByProgram = (records, year) => {
  const programMap = {};
  
  records
    .filter(r => r.year === year && r.program_name)
    .forEach(record => {
      // Normalize edilmiş ismi kullan
      const normalizedName = normalizeProgramName(record.program_name);
      const ihlCount = record.imam_hatip_lise_tipi?.reduce((s, tip) => 
        s + (tip.yerlesen || 0), 0) || 0;
      
      if (!programMap[normalizedName]) {
        programMap[normalizedName] = {
          name: normalizedName,
          originalNames: new Set([record.program_name]), // Orijinal isimleri sakla
          count: 0,
          total: 0,
          universities: new Set(),
          puanTuru: record.puan_turu
        };
      } else {
        // Orijinal isimleri ekle
        programMap[normalizedName].originalNames.add(record.program_name);
      }
      
      programMap[normalizedName].count += ihlCount;
      programMap[normalizedName].total += record.toplam_yerlesen || 0;
      programMap[normalizedName].universities.add(record.university_name);
    });
  
  return Object.values(programMap).map(prog => ({
    name: prog.name,
    count: prog.count,
    total: prog.total,
    universityCount: prog.universities.size,
    percentage: prog.total > 0 ? ((prog.count / prog.total) * 100).toFixed(2) : 0,
    category: categorizePuanTuru(prog.puanTuru),
    variants: prog.originalNames.size // Kaç farklı varyant var
  }));
};

// ─── 1. İHL KÖKEN ANALİZİ ───────────────────────────────────────────────────

const extractSchoolAndCity = (lise) => {
  if (!lise) return { name: '', displayName: '', city: '', district: '' };
  const match = lise.match(/^(.+?)\s*\(([^-]+?)(?:\s*-\s*(.+?))?\)\s*$/);
  if (match) {
    return { name: lise.trim(), displayName: match[1].trim(), city: match[2].trim(), district: match[3]?.trim() || '' };
  }
  return { name: lise.trim(), displayName: lise.trim(), city: '', district: '' };
};

// Veri yapısı iki farklı formatta gelebiliyor:
// Format 1 (yeni): imam_hatip_liseler = [{ lise: "...", yerlesen: 1 }]
// Format 2 (eski): imam_hatip_liseler = [{ imam_hatip_liseler: [{ lise: "...", yerlesen: 1 }] }]
const extractSchools = (imlArray) => {
  if (!imlArray || !Array.isArray(imlArray)) return [];
  const schools = [];
  imlArray.forEach(item => {
    if (item.lise !== undefined) {
      // Format 1: Direkt okul objesi
      schools.push(item);
    } else if (item.imam_hatip_liseler && Array.isArray(item.imam_hatip_liseler)) {
      // Format 2: İç içe yapı
      item.imam_hatip_liseler.forEach(s => schools.push(s));
    }
  });
  return schools;
};

export const groupByIHL = (records, year) => {
  const ihlMap = {};
  records.filter(r => r.year === year).forEach(record => {
    if (!record.imam_hatip_liseler) return;
    const schools = extractSchools(record.imam_hatip_liseler);
    schools.forEach(school => {
      const raw = school.lise;
      const count = school.yerlesen || 0;
      if (!raw || count === 0) return;
      const { name, displayName, city, district } = extractSchoolAndCity(raw);
      if (!ihlMap[name]) {
        ihlMap[name] = { name, displayName, city, district, totalCount: 0, universities: new Set(), programs: new Set() };
      }
      ihlMap[name].totalCount += count;
      if (record.university_name) ihlMap[name].universities.add(record.university_name);
      if (record.program_name) ihlMap[name].programs.add(normalizeProgramName(record.program_name));
    });
  });
  return Object.values(ihlMap).map(ihl => ({
    name: ihl.name, displayName: ihl.displayName, city: ihl.city, district: ihl.district,
    totalCount: ihl.totalCount, universityCount: ihl.universities.size, programCount: ihl.programs.size
  })).sort((a, b) => b.totalCount - a.totalCount);
};

export const groupIHLByCity = (records, year) => {
  const cityMap = {};
  records.filter(r => r.year === year).forEach(record => {
    if (!record.imam_hatip_liseler) return;
    const schools = extractSchools(record.imam_hatip_liseler);
    schools.forEach(school => {
      const { city } = extractSchoolAndCity(school.lise || '');
      const count = school.yerlesen || 0;
      if (!city || count === 0) return;
      if (!cityMap[city]) { cityMap[city] = { city, count: 0, schools: new Set() }; }
      cityMap[city].count += count;
      if (school.lise) cityMap[city].schools.add(school.lise);
    });
  });
  return Object.values(cityMap).map(c => ({
    city: c.city, count: c.count, schoolCount: c.schools.size
  })).sort((a, b) => b.count - a.count);
};

export const getIHLUniversityFlow = (records, ihlName, year) => {
  const univMap = {};
  records.filter(r => r.year === year).forEach(record => {
    if (!record.imam_hatip_liseler) return;
    const schools = extractSchools(record.imam_hatip_liseler);
    schools.forEach(school => {
      if (school.lise !== ihlName) return;
      const count = school.yerlesen || 0;
      if (count === 0) return;
      const univName = record.university_name;
      if (!univMap[univName]) {
        univMap[univName] = { name: univName, type: record.university_type, city: record.city, count: 0, programs: new Set() };
      }
      univMap[univName].count += count;
      univMap[univName].programs.add(normalizeProgramName(record.program_name));
    });
  });
  return Object.values(univMap).map(u => ({ ...u, programCount: u.programs.size })).sort((a, b) => b.count - a.count);
};

// ─── 2. FAKÜLTE ANALİZİ ─────────────────────────────────────────────────────

// Fakülte kategorileştirme (İlahiyat, Tıp, Hukuk vs.)
export const categorizeFakulte = (fakulte) => {
  if (!fakulte) return 'Diğer';

  // Türkçe büyük harfleri önce manuel çevir, sonra toLowerCase
  const f = fakulte
    .replace(/İ/g, 'i').replace(/I/g, 'ı')
    .replace(/Ğ/g, 'ğ').replace(/Ü/g, 'ü')
    .replace(/Ş/g, 'ş').replace(/Ö/g, 'ö')
    .replace(/Ç/g, 'ç')
    .toLowerCase();

  if (
    f.includes('ilahiyat') ||
    f.includes('islami ilim') ||
    f.includes('islam ilim') ||
    f.includes('islam bilim') ||
    f.includes('dini ilim') ||
    f.includes('islamic')
  ) return 'İlahiyat & İslami İlimler';

  if (f.includes('tıp') || f.includes('tip fakül')) return 'Tıp';
  if (f.includes('hukuk')) return 'Hukuk';
  if (f.includes('eğitim') || f.includes('egitim')) return 'Eğitim';
  if (f.includes('mühendis') || f.includes('muhendis') || f.includes('muhendis')) return 'Mühendislik';
  if (f.includes('fen') && (f.includes('bilim') || f.includes('edebiyat'))) return 'Fen-Edebiyat';
  if (f.includes('iktisat') || f.includes('ekonomi') || f.includes('iktisa'))  return 'İktisat';
  if (f.includes('işletme') || f.includes('isletme')) return 'İşletme';
  if (f.includes('sosyal') || f.includes('beşeri') || f.includes('beseri')) return 'Sosyal Bilimler';
  if (f.includes('sağlık') || f.includes('saglik')) return 'Sağlık';
  if (f.includes('güzel sanat') || f.includes('guzel sanat')) return 'Güzel Sanatlar';
  if (f.includes('mimarlık') || f.includes('mimarlik')) return 'Mimarlık';
  if (f.includes('eczacılık') || f.includes('eczacilik')) return 'Eczacılık';
  if (f.includes('iletişim') || f.includes('iletisim')) return 'İletişim';
  if (f.includes('edebiyat') || f.includes('edebiyat')) return 'Edebiyat';
  if (f.includes('diş') || f.includes('dis')) return 'Diş Hekimliği';
  
  return 'Diğer';
};



// Fakülte ismini normalize et (Türkçe karakterler, büyük/küçük harf)
const basicNormalize = (text) => {
  if (!text) return '';
  return text
    .toUpperCase()
    .replace(/Ğ/g, 'G')
    .replace(/Ü/g, 'U')
    .replace(/Ş/g, 'S')
    .replace(/İ/g, 'I')
    .replace(/I/g, 'I')
    .replace(/Ö/g, 'O')
    .replace(/Ç/g, 'C')
    .trim();
};

// Kelime köklerini çıkar ve standartlaştır
const extractRootWords = (fakulte) => {
  const normalized = basicNormalize(fakulte);
  
  // Ortak kelimeleri temizle
  const stopWords = ['FAKULTESI', 'FAKULTE', 'YUKSEKOKULU', 'YUKSEK', 'OKULU', 
                     'ENSTITUSU', 'BOLUMU', 'VE', 'VEYA', 'ILE', 'BIR'];
  
  let words = normalized
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.includes(w));
  
  // Kelime köklerini ve varyasyonlarını eşleştir
  const rootMap = {
    // İktisat varyasyonları
    'IKTISADI': 'IKTISAT',
    'IKTISAD': 'IKTISAT',
    'EKONOMI': 'IKTISAT',
    'EKONOMIK': 'IKTISAT',
    
    // İşletme varyasyonları
    'ISLETME': 'ISLETME',
    'ISLETMECILIK': 'ISLETME',
    
    // İlahiyat varyasyonları
    'ILAHIYAT': 'ILAHIYAT',
    'ILAHIYATI': 'ILAHIYAT',
    
    // Mühendislik varyasyonları
    'MUHENDISLIK': 'MUHENDISLIK',
    'MUHENDISLIGI': 'MUHENDISLIK',
    'MUHENDIS': 'MUHENDISLIK',
    
    // Eğitim varyasyonları
    'EGITIM': 'EGITIM',
    'EGITIMI': 'EGITIM',
    'OGRETIM': 'EGITIM',
    
    // Sağlık varyasyonları
    'SAGLIK': 'SAGLIK',
    'SAGLIGI': 'SAGLIK',
    
    // Fen varyasyonları
    'FENLER': 'FEN',
    'BILIM': 'BILIM',
    'BILIMLERI': 'BILIM',
    'BILIMLER': 'BILIM',
    
    // Edebiyat varyasyonları
    'EDEBIYAT': 'EDEBIYAT',
    'EDEBIYATI': 'EDEBIYAT',
    
    // Sosyal varyasyonları
    'SOSYAL': 'SOSYAL',
    'BESERI': 'SOSYAL',
    
    // Hukuk varyasyonları
    'HUKUK': 'HUKUK',
    'HUKUKU': 'HUKUK',
    
    // Tıp varyasyonları
    'TIP': 'TIP',
    'TIBBI': 'TIP',
    
    // Mimarlık varyasyonları
    'MIMARLIK': 'MIMARLIK',
    'MIMARI': 'MIMARLIK',
    
    // İletişim varyasyonları
    'ILETISIM': 'ILETISIM',
    'ILETISIMI': 'ILETISIM',
    
    // Güzel Sanatlar
    'GUZEL': 'GUZEL',
    'SANAT': 'SANAT',
    'SANATLAR': 'SANAT',
    'SANATLARI': 'SANAT',
    
    // Diş
    'DIS': 'DIS',
    'DISHEK': 'DIS',
    'HEKIMLIGI': 'HEKIMLIK',
    'HEKIMLIK': 'HEKIMLIK',
    
    // Eczacılık
    'ECZACILIK': 'ECZACILIK',
    'ECZACI': 'ECZACILIK',
    
    // Teknoloji
    'TEKNOLOJI': 'TEKNOLOJI',
    'TEKNOLOJIK': 'TEKNOLOJI',
    
    // Ziraat
    'ZIRAAT': 'ZIRAAT',
    'ZIRAATI': 'ZIRAAT',
    'TARIM': 'ZIRAAT',
    
    // Veteriner
    'VETERINER': 'VETERINER',
    'VETERINERLIK': 'VETERINER',
    
    // Spor
    'SPOR': 'SPOR',
    'SPORLARI': 'SPOR',
    
    // Turizm
    'TURIZM': 'TURIZM',
    'TURIZMCILIK': 'TURIZM'
  };
  
  // Kelimeleri köklere dönüştür
  words = words.map(word => rootMap[word] || word);
  
  return words.sort().join(' ');
};

// Standart fakülte ismi oluştur
const generateStandardName = (rootWords) => {
  if (!rootWords) return 'BİLİNMİYOR';
  
  const nameMap = {
    'IKTISAT': 'İktisat',
    'IKTISAT IDARI': 'İktisadi ve İdari Bilimler',
    'IDARI IKTISAT': 'İktisadi ve İdari Bilimler',
    'IDARI BILIM': 'İdari Bilimler',
    'ISLETME': 'İşletme',
    'ILAHIYAT': 'İlahiyat',
    'MUHENDISLIK': 'Mühendislik',
    'EGITIM': 'Eğitim',
    'BILIM FEN': 'Fen Bilimleri',
    'FEN': 'Fen',
    'EDEBIYAT FEN': 'Fen-Edebiyat',
    'BILIM EDEBIYAT': 'Edebiyat Bilimleri',
    'EDEBIYAT': 'Edebiyat',
    'SOSYAL': 'Sosyal Bilimler',
    'BILIM SOSYAL': 'Sosyal Bilimler',
    'BESERI': 'Beşeri Bilimler',
    'HUKUK': 'Hukuk',
    'TIP': 'Tıp',
    'MIMARLIK': 'Mimarlık',
    'GUZEL SANAT': 'Güzel Sanatlar',
    'ILETISIM': 'İletişim',
    'DIS HEKIMLIK': 'Diş Hekimliği',
    'ECZACILIK': 'Eczacılık',
    'SAGLIK': 'Sağlık Bilimleri',
    'BILIM SAGLIK': 'Sağlık Bilimleri',
    'TEKNOLOJI': 'Teknoloji',
    'ZIRAAT': 'Ziraat',
    'VETERINER': 'Veteriner',
    'SPOR': 'Spor Bilimleri',
    'TURIZM': 'Turizm'
  };
  
  return nameMap[rootWords] || rootWords;
};

export const normalizeFakulteName = (fakulte) => {
  if (!fakulte) return 'BİLİNMİYOR';
  
  const rootWords = extractRootWords(fakulte);
  return generateStandardName(rootWords);
};

// Eski fonksiyon adı ile uyumluluk için
export const normalizeFakulte = categorizeFakulte;

export const groupByFakulte = (records, year) => {
  const fakulteMap = {};
  
  records
    .filter(r => r.year === year && r.fakulte)
    .forEach(record => {
      const rawFakulte = record.fakulte;
      
      // İsmi normalize et (aynı fakülteleri birleştirmek için)
      const normalizedName = normalizeFakulteName(rawFakulte);
      
      // Kategori belirle (İlahiyat, Tıp, Hukuk vs.)
      const kategori = categorizeFakulte(rawFakulte);
      
      const ihlCount = record.imam_hatip_lise_tipi?.reduce((s, t) => 
        s + (t.yerlesen || 0), 0) || 0;
      
      if (!fakulteMap[normalizedName]) {
        fakulteMap[normalizedName] = {
          name: rawFakulte, // İlk bulunan orijinal ismi göster
          normalizedName,
          kategori,
          count: 0,
          total: 0,
          universities: new Set(),
          programs: new Set()
        };
      }
      
      fakulteMap[normalizedName].count += ihlCount;
      fakulteMap[normalizedName].total += record.toplam_yerlesen || 0;
      fakulteMap[normalizedName].universities.add(record.university_name);
      fakulteMap[normalizedName].programs.add(normalizeProgramName(record.program_name));
    });
  
  return Object.values(fakulteMap).map(f => ({
    name: f.name,
    kategori: f.kategori,
    count: f.count,
    total: f.total,
    universityCount: f.universities.size,
    programCount: f.programs.size,
    percentage: f.total > 0 ? ((f.count / f.total) * 100).toFixed(2) : 0
  })).sort((a, b) => b.count - a.count);
};

export const groupByFakulteKategori = (records, year) => {
  const katMap = {};
  
  records
    .filter(r => r.year === year && r.fakulte)
    .forEach(record => {
      const kat = categorizeFakulte(record.fakulte);
      const ihlCount = record.imam_hatip_lise_tipi?.reduce((s, t) => 
        s + (t.yerlesen || 0), 0) || 0;
      
      if (!katMap[kat]) {
        katMap[kat] = {
          name: kat,
          count: 0,
          total: 0,
          fakulteCount: new Set()
        };
      }
      
      katMap[kat].count += ihlCount;
      katMap[kat].total += record.toplam_yerlesen || 0;
      
      // Normalize edilmiş fakülte isimlerini say
      katMap[kat].fakulteCount.add(normalizeFakulteName(record.fakulte));
    });
  
  return Object.values(katMap).map(k => ({
    name: k.name,
    count: k.count,
    total: k.total,
    fakulteCount: k.fakulteCount.size,
    percentage: k.total > 0 ? ((k.count / k.total) * 100).toFixed(2) : 0
  })).sort((a, b) => b.count - a.count);
};

// ─── 3. PUAN TÜRÜ ANALİZİ ───────────────────────────────────────────────────

export const groupByPuanTuruYearly = (records) => {
  const result = {};
  ['2023', '2024', '2025'].forEach(year => {
    const puanMap = {};
    records.filter(r => r.year === year).forEach(record => {
      const puan = record.puan_turu || 'Diğer';
      const ihlCount = record.imam_hatip_lise_tipi?.reduce((s, t) => s + (t.yerlesen || 0), 0) || 0;
      if (!puanMap[puan]) { puanMap[puan] = { count: 0, total: 0 }; }
      puanMap[puan].count += ihlCount;
      puanMap[puan].total += record.toplam_yerlesen || 0;
    });
    Object.entries(puanMap).forEach(([puan, data]) => {
      if (!result[puan]) result[puan] = { puan };
      result[puan][`count_${year}`] = data.count;
      result[puan][`pct_${year}`] = data.total > 0 ? parseFloat(((data.count / data.total) * 100).toFixed(2)) : 0;
    });
  });
  return Object.values(result).sort((a, b) => (b['count_2025'] || 0) - (a['count_2025'] || 0));
};

export const groupByIHLTipi = (records, year) => {
  const tipMap = {};
  records.filter(r => r.year === year).forEach(record => {
    if (!record.imam_hatip_lise_tipi) return;
    record.imam_hatip_lise_tipi.forEach(tip => {
      const tipAdi = tip.tip || 'Diğer'; const count = tip.yerlesen || 0;
      if (!tipMap[tipAdi]) { tipMap[tipAdi] = { tip: tipAdi, count: 0 }; }
      tipMap[tipAdi].count += count;
    });
  });
  const total = Object.values(tipMap).reduce((s, t) => s + t.count, 0);
  return Object.values(tipMap).map(t => ({
    tip: t.tip, count: t.count,
    percentage: total > 0 ? ((t.count / total) * 100).toFixed(1) : 0
  })).sort((a, b) => b.count - a.count);
};