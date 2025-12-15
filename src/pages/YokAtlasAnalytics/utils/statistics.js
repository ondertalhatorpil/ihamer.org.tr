/**
 * İstatistik hesaplama fonksiyonları
 */

import { hasAnyData, getLatestYearData, calculateTrend, extractCity, getDepartmentCategory } from './dataProcessor';

/**
 * Belirli bir yıl için istatistik hesapla
 */
export function calculateYearStats(data, year) {
  const yearKey = `data${year}`;
  const validRecords = data.filter(d => d[yearKey] !== null);
  
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
  const totalRate = validRecords.reduce((sum, d) => sum + (d[yearKey].oran || 0), 0);
  const rates = validRecords.map(d => d[yearKey].oran).filter(r => r > 0);
  
  return {
    totalStudents,
    averageRate: (totalRate / validRecords.length).toFixed(2),
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
    
    // Yıllara göre
    stats2023: calculateYearStats(data, 2023),
    stats2024: calculateYearStats(data, 2024),
    stats2025: calculateYearStats(data, 2025),
    
    // Tip dağılımı
    byType: {
      Devlet: validData.filter(d => d.universityType === 'Devlet').length,
      Vakıf: validData.filter(d => d.universityType === 'Vakıf').length,
      KKTC: validData.filter(d => d.universityType === 'KKTC').length
    }
  };
}

/**
 * Üniversite bazlı istatistikler
 */
export function getUniversityStatistics(data) {
  const universities = {};
  
  data.forEach(record => {
    if (!hasAnyData(record)) return;
    
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
        avgRate2023: [],
        avgRate2024: [],
        avgRate2025: []
      };
    }
    
    universities[uniName].departments.push(record.bolum);
    
    if (record.data2023) {
      universities[uniName].totalStudents2023 += record.data2023.sayi;
      universities[uniName].avgRate2023.push(record.data2023.oran);
    }
    if (record.data2024) {
      universities[uniName].totalStudents2024 += record.data2024.sayi;
      universities[uniName].avgRate2024.push(record.data2024.oran);
    }
    if (record.data2025) {
      universities[uniName].totalStudents2025 += record.data2025.sayi;
      universities[uniName].avgRate2025.push(record.data2025.oran);
    }
  });
  
  // Ortalama oranları hesapla
  Object.values(universities).forEach(uni => {
    uni.avgRate2023 = uni.avgRate2023.length > 0 
      ? (uni.avgRate2023.reduce((a, b) => a + b, 0) / uni.avgRate2023.length).toFixed(2)
      : 0;
    uni.avgRate2024 = uni.avgRate2024.length > 0 
      ? (uni.avgRate2024.reduce((a, b) => a + b, 0) / uni.avgRate2024.length).toFixed(2)
      : 0;
    uni.avgRate2025 = uni.avgRate2025.length > 0 
      ? (uni.avgRate2025.reduce((a, b) => a + b, 0) / uni.avgRate2025.length).toFixed(2)
      : 0;
    
    uni.departmentCount = uni.departments.length;
  });
  
  return Object.values(universities);
}

/**
 * Bölüm bazlı istatistikler
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
        avgRate2023: [],
        avgRate2024: [],
        avgRate2025: []
      };
    }
    
    departments[deptName].universities.push({
      name: record.universiteName,
      type: record.universityType
    });
    
    if (record.data2023) {
      departments[deptName].totalStudents2023 += record.data2023.sayi;
      departments[deptName].avgRate2023.push(record.data2023.oran);
    }
    if (record.data2024) {
      departments[deptName].totalStudents2024 += record.data2024.sayi;
      departments[deptName].avgRate2024.push(record.data2024.oran);
    }
    if (record.data2025) {
      departments[deptName].totalStudents2025 += record.data2025.sayi;
      departments[deptName].avgRate2025.push(record.data2025.oran);
    }
  });
  
  // Ortalama oranları hesapla
  Object.values(departments).forEach(dept => {
    dept.avgRate2023 = dept.avgRate2023.length > 0 
      ? (dept.avgRate2023.reduce((a, b) => a + b, 0) / dept.avgRate2023.length).toFixed(2)
      : 0;
    dept.avgRate2024 = dept.avgRate2024.length > 0 
      ? (dept.avgRate2024.reduce((a, b) => a + b, 0) / dept.avgRate2024.length).toFixed(2)
      : 0;
    dept.avgRate2025 = dept.avgRate2025.length > 0 
      ? (dept.avgRate2025.reduce((a, b) => a + b, 0) / dept.avgRate2025.length).toFixed(2)
      : 0;
    
    dept.universityCount = dept.universities.length;
  });
  
  return Object.values(departments);
}

/**
 * Top N kayıt al (sıralama ile)
 * NOT: Küçük kontenjanlar (minStudents öğrenciden az) anlamlı olmadığı için filtrelenir
 * minContenjan parametresi de eklenebilir (oran sıralaması için önemli)
 */
export function getTopRecords(data, sortBy, limit = 20, year = 2025, minStudents = 5, minContenjan = 0) {
  const yearKey = `data${year}`;
  // En az minStudents öğrenci olan kayıtları al (küçük kontenjanları filtrele)
  let validData = data.filter(d => d[yearKey] !== null && d[yearKey].sayi >= minStudents);
  
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
    // Hem 2023 hem 2025'te en az minStudents öğrenci olmalı
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
    // Aşırı yüksek artışları filtrele (>500% muhtemelen kontenjan değişimi)
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
 * Şehir bazlı istatistikler
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
        avgRate2025: []
      };
    }
    
    cities[city].universities.add(record.universiteName);
    cities[city].departments.add(record.bolum);
    cities[city].totalRecords++;
    
    if (record.data2025) {
      cities[city].totalStudents2025 += record.data2025.sayi;
      cities[city].avgRate2025.push(record.data2025.oran);
    }
  });
  
  // Set'leri array'e çevir ve ortalama hesapla
  Object.values(cities).forEach(city => {
    city.universities = city.universities.size;
    city.departments = city.departments.size;
    city.avgRate2025 = city.avgRate2025.length > 0
      ? (city.avgRate2025.reduce((a, b) => a + b, 0) / city.avgRate2025.length).toFixed(2)
      : 0;
  });
  
  return Object.values(cities).sort((a, b) => b.totalStudents2025 - a.totalStudents2025);
}
