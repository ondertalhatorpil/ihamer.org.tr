/**
 * Genel yardımcı fonksiyonlar
 */

/**
 * Sayıyı formatla (1000 -> 1.000)
 */
export function formatNumber(num) {
  if (!num && num !== 0) return '-';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 * Yüzde formatla
 */
export function formatPercent(num) {
  if (!num && num !== 0) return '-';
  return `%${parseFloat(num).toFixed(1).replace('.', ',')}`;
}

/**
 * Trend ikonu al
 */
export function getTrendIcon(trend) {
  switch(trend) {
    case 'ARTAN': return '📈';
    case 'AZALAN': return '📉';
    case 'STABIL': return '➡️';
    default: return '❓';
  }
}

/**
 * Trend rengi al
 */
export function getTrendColor(trend) {
  switch(trend) {
    case 'ARTAN': return '#10b981'; // green
    case 'AZALAN': return '#ef4444'; // red
    case 'STABIL': return '#6b7280'; // gray
    default: return '#9ca3af';
  }
}

/**
 * Üniversite tipi badge rengi
 */
export function getUniversityTypeBadge(type) {
  const badges = {
    'Devlet': { color: '#3b82f6', label: 'Devlet' },
    'Vakıf': { color: '#8b5cf6', label: 'Vakıf' },
    'KKTC': { color: '#f59e0b', label: 'KKTC' }
  };
  return badges[type] || { color: '#6b7280', label: type };
}

/**
 * Kategori rengi
 */
export function getCategoryColor(category) {
  const colors = {
    'Mühendislik': '#3b82f6',
    'Sağlık Bilimleri': '#10b981',
    'İlahiyat': '#8b5cf6',
    'Eğitim': '#f59e0b',
    'Sosyal Bilimler': '#06b6d4',
    'Hukuk': '#ef4444',
    'İşletme/İktisat': '#ec4899',
    'Mimarlık/Tasarım': '#14b8a6',
    'Diğer': '#6b7280'
  };
  return colors[category] || '#6b7280';
}

/**
 * Metni kısalt
 */
export function truncateText(text, maxLength = 50) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * URL'den YÖK Atlas ID'si çıkar
 */
export function extractYokAtlasId(url) {
  const match = url.match(/y=(\d+)/);
  return match ? match[1] : null;
}

/**
 * Tam YÖK Atlas URL'si oluştur
 */
export function getYokAtlasUrl(partialUrl) {
  if (!partialUrl) return null;
  if (partialUrl.startsWith('http')) return partialUrl;
  return `https://yokatlas.yok.gov.tr/lisans.php?y=${partialUrl}`;
}

/**
 * Veriyi CSV'ye çevir
 */
export function exportToCSV(data, filename = 'yokatlas_data.csv') {
  const headers = [
    'Üniversite',
    'Tip',
    'Bölüm',
    '2023 Sayı',
    '2023 Oran',
    '2024 Sayı',
    '2024 Oran',
    '2025 Sayı',
    '2025 Oran'
  ];
  
  const rows = data.map(record => [
    record.universiteName,
    record.universityType,
    record.bolum,
    record.data2023?.sayi || '-',
    record.data2023?.oran || '-',
    record.data2024?.sayi || '-',
    record.data2024?.oran || '-',
    record.data2025?.sayi || '-',
    record.data2025?.oran || '-'
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

/**
 * Debounce fonksiyonu
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Arama filtresi uygula
 */
export function applySearchFilter(data, searchTerm) {
  if (!searchTerm || searchTerm.trim() === '') return data;
  
  const term = searchTerm.toLowerCase().trim();
  
  return data.filter(record => 
    record.universiteName.toLowerCase().includes(term) ||
    record.bolum.toLowerCase().includes(term)
  );
}

/**
 * Çoklu filtre uygula
 */
export function applyFilters(data, filters) {
  let filtered = [...data];
  
  // Üniversite tipi filtresi
  if (filters.universityType && filters.universityType.length > 0) {
    filtered = filtered.filter(d => filters.universityType.includes(d.universityType));
  }
  
  // Yıl filtresi (en az bir yılda veri olmalı)
  if (filters.year) {
    const yearKey = `data${filters.year}`;
    filtered = filtered.filter(d => d[yearKey] !== null);
  }
  
  // Oran aralığı filtresi
  if (filters.minRate !== undefined || filters.maxRate !== undefined) {
    const yearKey = filters.year ? `data${filters.year}` : 'data2025';
    filtered = filtered.filter(d => {
      if (!d[yearKey]) return false;
      const rate = d[yearKey].oran;
      if (filters.minRate !== undefined && rate < filters.minRate) return false;
      if (filters.maxRate !== undefined && rate > filters.maxRate) return false;
      return true;
    });
  }
  
  // Minimum öğrenci sayısı filtresi
  if (filters.minStudents !== undefined) {
    const yearKey = filters.year ? `data${filters.year}` : 'data2025';
    filtered = filtered.filter(d => {
      if (!d[yearKey]) return false;
      return d[yearKey].sayi >= filters.minStudents;
    });
  }
  
  // Kategori filtresi
  if (filters.categories && filters.categories.length > 0) {
    filtered = filtered.filter(d => {
      const category = getDepartmentCategory(d.bolum);
      return filters.categories.includes(category);
    });
  }
  
  // Şehir filtresi
  if (filters.cities && filters.cities.length > 0) {
    filtered = filtered.filter(d => {
      const city = extractCity(d.universiteName);
      return filters.cities.includes(city);
    });
  }
  
  return filtered;
}

// Import gerekli fonksiyonlar (circular dependency önlemek için burada import etmiyoruz)
function getDepartmentCategory(dept) {
  // Bu fonksiyon dataProcessor'dan import edilecek
  return 'Diğer';
}

function extractCity(uniName) {
  // Bu fonksiyon dataProcessor'dan import edilecek
  const match = uniName.match(/\(([^)]+)\)$/);
  return match ? match[1].split('-')[0].trim() : 'Bilinmiyor';
}
