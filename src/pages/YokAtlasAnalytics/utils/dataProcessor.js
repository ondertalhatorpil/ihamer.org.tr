/**
 * Veri işleme ve normalize etme fonksiyonları
 */

/**
 * Yıl verisini parse et - "Bulunamadı" ve "Veri Yok" durumlarını null'a çevir
 */
export function parseYearData(yearData) {
  if (!yearData) return null;
  
  const sayi = yearData.sayi;
  const oran = yearData.oran;
  
  // "Bulunamadı" veya "Veri Yok" ise null dön
  if (sayi === "Bulunamadı" || sayi === "Veri Yok" || 
      oran === "Bulunamadı" || oran === "Veri Yok") {
    return null;
  }
  
  // Geçerli veri varsa parse et
  return {
    sayi: parseInt(sayi) || 0,
    oran: parseFloat(oran.replace('%', '').replace(',', '.').trim()) || 0
  };
}

/**
 * Tek bir kaydı normalize et
 */
export function normalizeRecord(record) {
  return {
    universiteName: record.universiteName,
    universityType: record.universityType,
    bolum: record.bolum,
    url: record.url,
    
    // Yıl verilerini normalize et
    data2023: parseYearData(record.imamHatip2023),
    data2024: parseYearData(record.imamHatip2024),
    data2025: parseYearData(record.imamHatip2025)
  };
}

/**
 * Tüm veriyi normalize et
 */
export function processRawData(rawData) {
  return rawData.map(normalizeRecord);
}

/**
 * Şehir ismini üniversite adından çıkar
 */
export function extractCity(universityName) {
  const match = universityName.match(/\(([^)]+)\)$/);
  if (match) {
    const location = match[1];
    // Eğer birden fazla şehir varsa ilkini al
    return location.split('-')[0].trim();
  }
  return 'Bilinmiyor';
}

/**
 * Üniversite tipini kısa forma çevir
 */
export function getUniversityTypeShort(type) {
  const typeMap = {
    'Devlet': 'D',
    'Vakıf': 'V',
    'KKTC': 'K'
  };
  return typeMap[type] || type;
}

/**
 * Bölüm kategorisini belirle (basit versiyon)
 */
export function getDepartmentCategory(departmentName) {
  const dept = departmentName.toUpperCase();
  
  if (dept.includes('MÜHENDİS')) return 'Mühendislik';
  if (dept.includes('TIP') || dept.includes('HEMŞİRE') || dept.includes('SAĞLIK') || 
      dept.includes('ACİL') || dept.includes('EBELİK') || dept.includes('ECZACILIK')) {
    return 'Sağlık Bilimleri';
  }
  if (dept.includes('İLAHİYAT') || dept.includes('İSLAMİ')) return 'İlahiyat';
  if (dept.includes('ÖĞRETMEN') || dept.includes('EĞİTİM') || dept.includes('OKUL ÖNCESİ')) {
    return 'Eğitim';
  }
  if (dept.includes('PSİKOLOJİ') || dept.includes('SOSYOLOJİ') || dept.includes('SOSYAL')) {
    return 'Sosyal Bilimler';
  }
  if (dept.includes('HUKUK')) return 'Hukuk';
  if (dept.includes('İŞLETME') || dept.includes('İKTİSAT') || dept.includes('EKONOMİ')) {
    return 'İşletme/İktisat';
  }
  if (dept.includes('MİMARLIK') || dept.includes('TASARIM')) return 'Mimarlık/Tasarım';
  
  return 'Diğer';
}

/**
 * Yıllara göre trend hesapla
 */
export function calculateTrend(record) {
  const rates = [
    record.data2023?.oran || null,
    record.data2024?.oran || null,
    record.data2025?.oran || null
  ].filter(r => r !== null);
  
  if (rates.length < 2) {
    return { trend: 'YETERSİZ_VERİ', change: 0 };
  }
  
  const first = rates[0];
  const last = rates[rates.length - 1];
  const change = last - first;
  const percentChange = ((change / first) * 100).toFixed(1);
  
  let trend = 'STABIL';
  if (Math.abs(change) > 0.5) {
    trend = change > 0 ? 'ARTAN' : 'AZALAN';
  }
  
  return {
    trend,
    change: change.toFixed(1),
    percentChange: parseFloat(percentChange)
  };
}

/**
 * En güncel yıl verisini al
 */
export function getLatestYearData(record) {
  if (record.data2025) return { year: 2025, data: record.data2025 };
  if (record.data2024) return { year: 2024, data: record.data2024 };
  if (record.data2023) return { year: 2023, data: record.data2023 };
  return null;
}

/**
 * Kaydın herhangi bir yılda verisi var mı?
 */
export function hasAnyData(record) {
  return record.data2023 !== null || 
         record.data2024 !== null || 
         record.data2025 !== null;
}
