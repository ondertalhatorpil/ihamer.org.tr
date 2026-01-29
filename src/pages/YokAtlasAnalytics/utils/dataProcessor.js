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

// ===================================
// 🆕 PROGRAM VARYANT BİRLEŞTİRME
// ===================================

/**
 * URL'den program kodunu çıkar
 */
export function extractProgramCode(url) {
  if (!url) return null;
  const match = url.match(/y=(\d+)/);
  return match ? match[1] : null;
}

/**
 * Aynı üniversite ve bölüm kayıtlarını grupla
 * Key: "ÜNİVERSİTE ADI|BÖLÜM ADI"
 */
export function groupProgramVariants(records) {
  const grouped = new Map();
  
  records.forEach(record => {
    // Anahtar: Üniversite + Bölüm
    const key = `${record.universiteName}|${record.bolum}`;
    
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    
    // Program kodunu ekle
    const programCode = extractProgramCode(record.url);
    grouped.get(key).push({
      ...record,
      programCode
    });
  });
  
  return grouped;
}

/**
 * ✅ DÜZELTİLDİ: Birden fazla varyantın toplam istatistiklerini hesapla
 * AĞIRLIKLI ORTALAMA kullanarak doğru oran hesabı
 */
function calculateCombinedStats(variants) {
  const stats = {
    total2023: { sayi: 0, toplamKontenjan: 0, count: 0 },
    total2024: { sayi: 0, toplamKontenjan: 0, count: 0 },
    total2025: { sayi: 0, toplamKontenjan: 0, count: 0 }
  };
  
  variants.forEach(variant => {
    ['2023', '2024', '2025'].forEach(year => {
      const data = variant[`data${year}`];
      if (data && data.oran > 0) {
        const key = `total${year}`;
        
        // Öğrenci sayısını topla
        stats[key].sayi += data.sayi;
        
        // Kontenjanı hesapla: sayi / (oran/100)
        // Örnek: 10 öğrenci, %50 oran → 10 / 0.5 = 20 kontenjan
        const kontenjan = data.sayi / (data.oran / 100);
        stats[key].toplamKontenjan += kontenjan;
        stats[key].count += 1;
      }
    });
  });
  
  // ✅ Ağırlıklı ortalama hesapla: (Toplam Öğrenci / Toplam Kontenjan) * 100
  return {
    data2023: stats.total2023.count > 0 && stats.total2023.toplamKontenjan > 0 ? {
      sayi: stats.total2023.sayi,
      oran: parseFloat(((stats.total2023.sayi / stats.total2023.toplamKontenjan) * 100).toFixed(2))
    } : null,
    data2024: stats.total2024.count > 0 && stats.total2024.toplamKontenjan > 0 ? {
      sayi: stats.total2024.sayi,
      oran: parseFloat(((stats.total2024.sayi / stats.total2024.toplamKontenjan) * 100).toFixed(2))
    } : null,
    data2025: stats.total2025.count > 0 && stats.total2025.toplamKontenjan > 0 ? {
      sayi: stats.total2025.sayi,
      oran: parseFloat(((stats.total2025.sayi / stats.total2025.toplamKontenjan) * 100).toFixed(2))
    } : null,
    variantCount2023: stats.total2023.count,
    variantCount2024: stats.total2024.count,
    variantCount2025: stats.total2025.count
  };
}

/**
 * Varyantları birleştir ve ana kayıt oluştur
 */
export function mergeProgramVariants(records) {
  const grouped = groupProgramVariants(records);
  const merged = [];
  
  grouped.forEach((variants, key) => {
    // Veri olan ve olmayan varyantları ayır
    const withData = variants.filter(hasAnyData);
    const withoutData = variants.filter(v => !hasAnyData(v));
    
    // Hiçbir varyantında veri yoksa atla
    if (withData.length === 0) {
      return;
    }
    
    // En fazla veriye sahip varyantı ana program yap
    const mainVariant = withData.reduce((prev, current) => {
      const prevDataCount = [prev.data2023, prev.data2024, prev.data2025].filter(Boolean).length;
      const currentDataCount = [current.data2023, current.data2024, current.data2025].filter(Boolean).length;
      return currentDataCount > prevDataCount ? current : prev;
    });
    
    // ✅ Ağırlıklı ortalama ile toplam istatistikleri hesapla
    const combinedStats = calculateCombinedStats(withData);
    
    // Birleştirilmiş kayıt oluştur
    merged.push({
      // Ana varyantın bilgileri
      universiteName: mainVariant.universiteName,
      universityType: mainVariant.universityType,
      bolum: mainVariant.bolum,
      url: mainVariant.url,
      
      // ✅ Düzeltilmiş birleştirilmiş veriler
      data2023: combinedStats.data2023,
      data2024: combinedStats.data2024,
      data2025: combinedStats.data2025,
      
      // Varyant bilgileri
      hasVariants: variants.length > 1,
      variantCount: variants.length,
      variants: variants.map(v => ({
        programCode: v.programCode,
        url: v.url,
        hasData: hasAnyData(v),
        data2023: v.data2023,
        data2024: v.data2024,
        data2025: v.data2025
      }))
    });
  });
  
  return merged;
}

/**
 * Tüm veriyi işle ve normalize et
 * @param {Array} rawData - Ham veri
 * @param {Object} options - İşleme seçenekleri
 * @param {boolean} options.mergeVariants - Varyantları birleştir (varsayılan: true)
 */
export function processRawData(rawData, options = {}) {
  const { mergeVariants = true } = options;
  
  // 1. Normalize et
  let processed = rawData.map(normalizeRecord);
  
  // 2. Varyantları birleştir (opsiyonel)
  if (mergeVariants) {
    processed = mergeProgramVariants(processed);
  }
  
  return processed;
}