/**
 * İstatistik hesaplama fonksiyonları
 * ✅ AĞIRLIKLI ORTALAMA ile düzeltildi
 */

import { hasAnyData, getLatestYearData, calculateTrend, extractCity, getDepartmentCategory } from './dataProcessor';

/**
 * ✅ DÜZELTİLDİ: Belirli bir yıl için istatistik hesapla
 * Ağırlıklı ortalama kullanılıyor
 */
export function calculateYearStats(data, year) {
  const yearKey = `data${year}`;
  const validRecords = data.filter(d => d[yearKey] !== null && d[yearKey].oran > 0);
  
  if (validRecords.length === 0) {
    return {
      totalStudents: 0,
      averageRate: 0,
      recordCount: 0,
      maxRate: 0,
      minRate: 0
    };
  }
  
  const totalStudents = validRecords.reduce((sum, d) => sum + (d[yearKey].sayi || 0), 0);
  
  // ✅ Ağırlıklı ortalama için toplam kontenjan hesapla
  const toplamKontenjan = validRecords.reduce((sum, d) => {
    const oran = d[yearKey].oran;
    const sayi = d[yearKey].sayi;
    if (oran > 0) {
      // Kontenjan = sayi / (oran/100)
      return sum + (sayi / (oran / 100));
    }
    return sum;
  }, 0);
  
  const rates = validRecords.map(d => d[yearKey].oran).filter(r => r > 0);
  
  return {
    totalStudents,
    // ✅ Ağırlıklı ortalama: (Toplam Öğrenci / Toplam Kontenjan) * 100
    averageRate: toplamKontenjan > 0 
      ? ((totalStudents / toplamKontenjan) * 100).toFixed(2)
      : 0,
    recordCount: validRecords.length,
    maxRate: Math.max(...rates).toFixed(2),
    minRate: Math.min(...rates).toFixed(2)
  };
}

/**
 * Genel özet istatistikler
 */
export function getGeneralStatistics(data) {
  const validData = data.filter(hasAnyData);
  
  // Unique sayıları
  const uniqueUniversities = [...new Set(validData.map(d => d.universiteName))];
  const uniqueDepartments = [...new Set(validData.map(d => d.bolum))];
  const uniqueCities = [...new Set(validData.map(d => extractCity(d.universiteName)))];
  
  return {
    totalRecords: data.length,
    validRecords: validData.length,
    uniqueUniversities: uniqueUniversities.length,
    uniqueDepartments: uniqueDepartments.length,
    uniqueCities: uniqueCities.length,
    
    // Yıllara göre (ağırlıklı ortalama ile)
    stats2023: calculateYearStats(data, 2023),
    stats2024: calculateYearStats(data, 2024),
    stats2025: calculateYearStats(data, 2025),
    
    // Tip dağılımı (2025 yılı öğrenci sayıları)
    byType: {
      Devlet: validData
        .filter(d => d.universityType === 'Devlet' && d.data2025)
        .reduce((sum, d) => sum + d.data2025.sayi, 0),
      Vakıf: validData
        .filter(d => d.universityType === 'Vakıf' && d.data2025)
        .reduce((sum, d) => sum + d.data2025.sayi, 0),
      KKTC: validData
        .filter(d => d.universityType === 'KKTC' && d.data2025)
        .reduce((sum, d) => sum + d.data2025.sayi, 0)
    }
  };
}

/**
 * ✅ DÜZELTİLDİ: Üniversite bazlı istatistikler
 * Ağırlıklı ortalama kullanılıyor
 */
export function getUniversityStatistics(data) {
  const universities = {};
  
  data.forEach(record => {
    // Sadece 2025 verisi olanları işle
    if (!record.data2025) return;
    
    const uniName = record.universiteName;
    
    if (!universities[uniName]) {
      universities[uniName] = {
        name: uniName,
        type: record.universityType,
        city: extractCity(uniName),
        departments: [],
        totalStudents2023: 0,
        totalStudents2024: 0,
        totalStudents2025: 0,
        // ✅ Kontenjan toplamları eklendi
        totalKontenjan2023: 0,
        totalKontenjan2024: 0,
        totalKontenjan2025: 0
      };
    }
    
    universities[uniName].departments.push(record.bolum);
    
    // ✅ Her yıl için öğrenci ve kontenjan topla
    if (record.data2023 && record.data2023.oran > 0) {
      universities[uniName].totalStudents2023 += record.data2023.sayi;
      universities[uniName].totalKontenjan2023 += record.data2023.sayi / (record.data2023.oran / 100);
    }
    if (record.data2024 && record.data2024.oran > 0) {
      universities[uniName].totalStudents2024 += record.data2024.sayi;
      universities[uniName].totalKontenjan2024 += record.data2024.sayi / (record.data2024.oran / 100);
    }
    if (record.data2025 && record.data2025.oran > 0) {
      universities[uniName].totalStudents2025 += record.data2025.sayi;
      universities[uniName].totalKontenjan2025 += record.data2025.sayi / (record.data2025.oran / 100);
    }
  });
  
  // ✅ Ağırlıklı ortalama oranları hesapla
  Object.values(universities).forEach(uni => {
    uni.avgRate2023 = uni.totalKontenjan2023 > 0 
      ? ((uni.totalStudents2023 / uni.totalKontenjan2023) * 100).toFixed(2)
      : 0;
    uni.avgRate2024 = uni.totalKontenjan2024 > 0 
      ? ((uni.totalStudents2024 / uni.totalKontenjan2024) * 100).toFixed(2)
      : 0;
    uni.avgRate2025 = uni.totalKontenjan2025 > 0 
      ? ((uni.totalStudents2025 / uni.totalKontenjan2025) * 100).toFixed(2)
      : 0;
    
    uni.departmentCount = uni.departments.length;
    
    // Kontenjan alanlarını temizle (ihtiyaç yoksa)
    delete uni.totalKontenjan2023;
    delete uni.totalKontenjan2024;
    delete uni.totalKontenjan2025;
  });
  
  return Object.values(universities);
}

/**
 * ✅ DÜZELTİLDİ: Bölüm bazlı istatistikler
 * Ağırlıklı ortalama kullanılıyor
 */
export function getDepartmentStatistics(data) {
  const departments = {};
  
  data.forEach(record => {
    if (!hasAnyData(record)) return;
    
    const deptName = record.bolum;
    
    if (!departments[deptName]) {
      departments[deptName] = {
        name: deptName,
        category: getDepartmentCategory(deptName),
        universities: [],
        totalStudents2023: 0,
        totalStudents2024: 0,
        totalStudents2025: 0,
        // ✅ Kontenjan toplamları eklendi
        totalKontenjan2023: 0,
        totalKontenjan2024: 0,
        totalKontenjan2025: 0
      };
    }
    
    departments[deptName].universities.push({
      name: record.universiteName,
      type: record.universityType
    });
    
    // ✅ Her yıl için öğrenci ve kontenjan topla
    if (record.data2023 && record.data2023.oran > 0) {
      departments[deptName].totalStudents2023 += record.data2023.sayi;
      departments[deptName].totalKontenjan2023 += record.data2023.sayi / (record.data2023.oran / 100);
    }
    if (record.data2024 && record.data2024.oran > 0) {
      departments[deptName].totalStudents2024 += record.data2024.sayi;
      departments[deptName].totalKontenjan2024 += record.data2024.sayi / (record.data2024.oran / 100);
    }
    if (record.data2025 && record.data2025.oran > 0) {
      departments[deptName].totalStudents2025 += record.data2025.sayi;
      departments[deptName].totalKontenjan2025 += record.data2025.sayi / (record.data2025.oran / 100);
    }
  });
  
  // ✅ Ağırlıklı ortalama oranları hesapla
  Object.values(departments).forEach(dept => {
    dept.avgRate2023 = dept.totalKontenjan2023 > 0 
      ? ((dept.totalStudents2023 / dept.totalKontenjan2023) * 100).toFixed(2)
      : 0;
    dept.avgRate2024 = dept.totalKontenjan2024 > 0 
      ? ((dept.totalStudents2024 / dept.totalKontenjan2024) * 100).toFixed(2)
      : 0;
    dept.avgRate2025 = dept.totalKontenjan2025 > 0 
      ? ((dept.totalStudents2025 / dept.totalKontenjan2025) * 100).toFixed(2)
      : 0;
    
    dept.universityCount = dept.universities.length;
    
    // Kontenjan alanlarını temizle
    delete dept.totalKontenjan2023;
    delete dept.totalKontenjan2024;
    delete dept.totalKontenjan2025;
  });
  
  return Object.values(departments);
}

/**
 * Top N kayıt al (sıralama ile)
 * NOT: Küçük kontenjanlar (minStudents öğrenciden az) anlamlı olmadığı için filtrelenir
 */
export function getTopRecords(data, sortBy, limit = 20, year = 2025, minStudents = 5, minContenjan = 0) {
  const yearKey = `data${year}`;
  // En az minStudents öğrenci olan kayıtları al (küçük kontenjanları filtrele)
  let validData = data.filter(d => d[yearKey] !== null && d[yearKey].sayi >= minStudents && d[yearKey].oran > 0);
  
  // Eğer minimum kontenjan şartı varsa onu da uygula (oran sıralaması için)
  if (minContenjan > 0 && sortBy === 'rate') {
    validData = validData.filter(d => {
      // Oran üzerinden kontenjan hesapla: sayi / (oran/100)
      const estimatedKontenjan = d[yearKey].oran > 0 
        ? Math.round(d[yearKey].sayi / (d[yearKey].oran / 100))
        : 0;
      return estimatedKontenjan >= minContenjan;
    });
  }
  
  let sorted;
  if (sortBy === 'rate') {
    sorted = validData.sort((a, b) => b[yearKey].oran - a[yearKey].oran);
  } else if (sortBy === 'students') {
    sorted = validData.sort((a, b) => b[yearKey].sayi - a[yearKey].sayi);
  } else {
    sorted = validData;
  }
  
  return sorted.slice(0, limit);
}

/**
 * Trend bazlı kayıtlar (en çok artan/azalan)
 * NOT: Minimum 5 öğrenci ve mantıklı artış kontrolü ile küçük kontenjanlar filtrelenir
 */
export function getTrendingRecords(data, trendType = 'rising', limit = 20, minStudents = 5) {
  const dataWithTrends = data
    .filter(hasAnyData)
    .filter(record => {
      const students2023 = record.data2023?.sayi || 0;
      const students2025 = record.data2025?.sayi || 0;
      return students2023 >= minStudents && students2025 >= minStudents;
    })
    .map(record => ({
      ...record,
      trendData: calculateTrend(record)
    }))
    .filter(d => d.trendData.trend !== 'YETERSİZ_VERİ')
    .filter(d => Math.abs(d.trendData.percentChange) <= 500);
  
  let sorted;
  if (trendType === 'rising') {
    sorted = dataWithTrends
      .filter(d => d.trendData.trend === 'ARTAN')
      .sort((a, b) => b.trendData.percentChange - a.trendData.percentChange);
  } else if (trendType === 'falling') {
    sorted = dataWithTrends
      .filter(d => d.trendData.trend === 'AZALAN')
      .sort((a, b) => a.trendData.percentChange - b.trendData.percentChange);
  } else {
    sorted = dataWithTrends.filter(d => d.trendData.trend === 'STABIL');
  }
  
  return sorted.slice(0, limit);
}

/**
 * ✅ DÜZELTİLDİ: Şehir bazlı istatistikler
 * Ağırlıklı ortalama kullanılıyor
 */
export function getCityStatistics(data) {
  const cities = {};
  
  data.forEach(record => {
    if (!hasAnyData(record)) return;
    
    const city = extractCity(record.universiteName);
    
    if (!cities[city]) {
      cities[city] = {
        name: city,
        universities: new Set(),
        departments: new Set(),
        totalRecords: 0,
        totalStudents2025: 0,
        // ✅ Kontenjan eklendi
        totalKontenjan2025: 0
      };
    }
    
    cities[city].universities.add(record.universiteName);
    cities[city].departments.add(record.bolum);
    cities[city].totalRecords++;
    
    if (record.data2025 && record.data2025.oran > 0) {
      cities[city].totalStudents2025 += record.data2025.sayi;
      cities[city].totalKontenjan2025 += record.data2025.sayi / (record.data2025.oran / 100);
    }
  });
  
  // Set'leri array'e çevir ve ağırlıklı ortalama hesapla
  Object.values(cities).forEach(city => {
    city.universities = city.universities.size;
    city.departments = city.departments.size;
    
    // ✅ Ağırlıklı ortalama
    city.avgRate2025 = city.totalKontenjan2025 > 0
      ? ((city.totalStudents2025 / city.totalKontenjan2025) * 100).toFixed(2)
      : 0;
    
    // Kontenjan alanını temizle
    delete city.totalKontenjan2025;
  });
  
  return Object.values(cities).sort((a, b) => b.totalStudents2025 - a.totalStudents2025);
}
