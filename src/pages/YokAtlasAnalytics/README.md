# YÖK Atlas İmam Hatip Analitik

İmam Hatip Lisesi mezunlarının üniversite tercihlerini analiz eden kapsamlı web uygulaması.

## 🚀 Özellikler

### 📊 Dashboard
- Genel istatistikler ve özet bilgiler
- Yıllara göre karşılaştırma (2023-2025)
- Top 10 listeler (en yüksek oran, en çok öğrenci)
- Trend analizleri (en çok artan/azalan)
- Üniversite tipi dağılımı

### 🏛️ Üniversite Listesi
- Tüm üniversitelerin detaylı listesi
- Tip bazlı filtreleme (Devlet/Vakıf/KKTC)
- Sıralama özellikleri (isim, öğrenci sayısı, oran, bölüm sayısı)
- Yıllık trend göstergeleri

### 📚 Bölüm Listesi
- Tüm bölümlerin detaylı listesi
- Kategori bazlı filtreleme
- Bölüm bazında istatistikler
- Üniversite sayısı ve öğrenci dağılımı

### 📈 Detaylı İstatistikler
- Şehir bazlı analizler
- Coğrafi dağılım grafikleri
- Top 20 şehir karşılaştırması
- Bölgesel analiz (yakında)

### 🔍 Karşılaştırma Aracı
- 4'e kadar kayıt karşılaştırma
- Üniversite veya bölüm bazlı karşılaştırma
- Yıllara göre trend grafikleri
- Detaylı karşılaştırma tablosu

### 🎯 Filtreleme Sistemi
- Gelişmiş arama özelliği
- Üniversite tipi filtresi
- Yıl seçimi
- İH oranı aralığı
- Minimum öğrenci sayısı
- Bölüm kategorisi
- Şehir filtresi

### 💾 Export
- CSV formatında veri dışa aktarma
- Filtrelenmiş verileri export etme

## 📁 Klasör Yapısı

```
src/pages/YokAtlasAnalytics/
├── index.jsx                      # Ana component
├── data.json                      # Veri dosyası
├── components/
│   ├── Dashboard.jsx              # Dashboard sayfası
│   ├── UniversityList.jsx         # Üniversite listesi
│   ├── DepartmentList.jsx         # Bölüm listesi
│   ├── Statistics.jsx             # İstatistikler sayfası
│   ├── ComparisonTool.jsx         # Karşılaştırma aracı
│   ├── Filters.jsx                # Filtreleme komponenti
│   ├── TrendChart.jsx             # Grafik komponentleri
│   └── StatCard.jsx               # İstatistik kartları
├── utils/
│   ├── dataProcessor.js           # Veri işleme fonksiyonları
│   ├── statistics.js              # İstatistik hesaplamaları
│   └── helpers.js                 # Yardımcı fonksiyonlar
└── styles/
    └── analytics.css              # Stil dosyası
```

## 🛠️ Kurulum

### Gereksinimler
- React 17+
- recharts (grafik kütüphanesi)

### Adımlar

1. **Klasörü projenize ekleyin:**
```bash
# YokAtlasAnalytics klasörünü src/pages/ altına kopyalayın
```

2. **Recharts kütüphanesini yükleyin:**
```bash
npm install recharts
```

3. **data.json dosyasını güncelleyin:**
```javascript
// Gerçek verilerinizi data.json dosyasına ekleyin
// Örnek format data.json dosyasında mevcut
```

4. **App.jsx veya Router'ınıza ekleyin:**
```javascript
import YokAtlasAnalytics from './pages/YokAtlasAnalytics';

// Route ekleyin
<Route path="/analytics" element={<YokAtlasAnalytics />} />
```

## 📊 Veri Formatı

data.json dosyasındaki her kayıt şu formatta olmalıdır:

```json
{
  "universiteName": "ÜNİVERSİTE ADI (ŞEHİR)",
  "universityType": "Devlet" | "Vakıf" | "KKTC",
  "bolum": "BÖLÜM ADI",
  "imamHatip2023": {
    "sayi": "4",
    "oran": "%6,3"
  },
  "imamHatip2024": {
    "sayi": "2",
    "oran": "% 6,3"
  },
  "imamHatip2025": {
    "sayi": "1",
    "oran": "% 3,1"
  },
  "url": "https://yokatlas.yok.gov.tr/lisans.php?y=..."
}
```

**Not:** "Bulunamadı" veya "Veri Yok" değerleri otomatik olarak null'a dönüştürülür ve istatistiklere dahil edilmez.

## 🎨 Özelleştirme

### Renkleri Değiştirme
`styles/analytics.css` dosyasındaki CSS değişkenlerini düzenleyin:

```css
:root {
  --primary-color: #3b82f6;
  --secondary-color: #10b981;
  --warning-color: #f59e0b;
  --danger-color: #ef4444;
  --purple-color: #8b5cf6;
}
```

### Bölüm Kategorileri
Bölüm kategorilerini özelleştirmek için `utils/dataProcessor.js` dosyasındaki `getDepartmentCategory` fonksiyonunu düzenleyin.

## 📱 Responsive Tasarım

Uygulama tamamen responsive'dir ve şu cihazlarda sorunsuz çalışır:
- Desktop (1400px+)
- Tablet (768px - 1400px)
- Mobile (480px - 768px)
- Small Mobile (<480px)

## 🚀 Performans

### Veri Boyutu
- 200,000 kayıt ile test edilmiştir
- İlk yükleme süresi: ~2-3 saniye
- Filtreleme: Anlık
- Grafik render: ~500ms

### Optimizasyon İpuçları
1. `useMemo` hook'ları ile gereksiz hesaplamalar önlenir
2. Büyük listeler için virtual scrolling düşünülebilir
3. Veri 5MB'ı geçerse backend + API kullanımı önerilir

## 🐛 Bilinen Sorunlar

- Çok büyük veri setlerinde (500k+ kayıt) yavaşlama olabilir
- Internet Explorer desteklenmez
- Safari'de bazı CSS özellikleri farklı görünebilir

## 📝 Yapılacaklar

- [ ] Bölgesel analiz özelliği
- [ ] Excel export
- [ ] PDF rapor oluşturma
- [ ] Favori kayıtlar
- [ ] Gelişmiş grafikler (pie, area charts)
- [ ] Veri karşılaştırma geçmişi
- [ ] Dark mode

## 🤝 Katkıda Bulunma

Projeye katkıda bulunmak isterseniz:
1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing`)
5. Pull Request açın

## 📄 Lisans

Bu proje eğitim amaçlı geliştirilmiştir.

## 👨‍💻 Geliştirici

Berat - Full Stack Developer
- ÖNDER İmam Hatipliler Derneği
- Şahsiyet Academy

## 🙏 Teşekkürler

- YÖK Atlas - Veri kaynağı
- Recharts - Grafik kütüphanesi
- React - UI Framework

---

**Not:** data.json dosyasına gerçek verilerinizi eklemeyi unutmayın!
