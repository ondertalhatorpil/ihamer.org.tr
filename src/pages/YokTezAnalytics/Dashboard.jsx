import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Building2, Calendar, TrendingUp, Award, PieChart, Home, GraduationCap } from 'lucide-react';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import AllThesesSection from './AllThesesPage';

const AnimatedCounter = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const numericValue = typeof value === 'number' ? value : parseInt(value) || 0;
    if (numericValue === 0) {
      setDisplayValue(0);
      return;
    }

    let start = 0;
    const duration = 800;
    const steps = 30;
    const increment = numericValue / steps;
    const intervalTime = duration / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= numericValue) {
        setDisplayValue(numericValue);
        clearInterval(timer);
      } else {
        setDisplayValue(start);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [value]);

  return <>{Math.floor(displayValue).toLocaleString('tr-TR')}</>;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [theses, setTheses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import('./data/tez.json')
      .then(module => {
        setTheses(module.default);
        setLoading(false);
      })
      .catch(err => {
        console.error('JSON yükleme hatası:', err);
        setLoading(false);
      });
  }, []);

  // Kategorizasyon fonksiyonları
  const categorizeThesis = (thesis) => {
    const bolum = thesis['Bölüm']?.toLowerCase() || '';
    
    const alanDisiKeywords = ['tıp', 'hemşirelik', 'diş hekimliği', 'gıda mühendisliği', 'beslenme', 'diyetetik'];
    if (alanDisiKeywords.some(keyword => bolum.includes(keyword))) {
      return 'Alan Dışı';
    }
    
    const dogruданKatkiKeywords = ['din eğitimi', 'ilahiyat', 'sosyoloji', 'psikoloji', 'eğitim bilimleri'];
    if (dogruданKatkiKeywords.some(keyword => bolum.includes(keyword))) {
      return 'Doğrudan Katkı';
    }
    
    return 'Diğer';
  };

  const hasImamHatipInTitle = (thesis) => {
    const baslik = thesis['Tez Başlığı']?.toLowerCase() || '';
    return baslik.includes('imam hatip') || baslik.includes('imam-hatip');
  };

  // İstatistikler
  const stats = useMemo(() => {
    if (!theses.length) return null;

    const uniqueUniversities = [...new Set(theses.map(t => t['Üniversite']))].filter(Boolean);
    const uniqueYears = [...new Set(theses.map(t => t['Yıl']))].filter(Boolean);
    
    // Yıllara göre dağılım
    const yearDistribution = theses.reduce((acc, thesis) => {
      const year = thesis['Yıl'];
      if (year) {
        acc[year] = (acc[year] || 0) + 1;
      }
      return acc;
    }, {});

    const yearData = Object.entries(yearDistribution)
      .sort((a, b) => a[0] - b[0])
      .map(([year, count]) => ({ year, count }));

    // İmam Hatip başlıklı tezler
    const imamHatipTitleCount = theses.filter(hasImamHatipInTitle).length;

    // Kategori dağılımı
    const categoryDistribution = theses.reduce((acc, thesis) => {
      const category = categorizeThesis(thesis);
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    const categoryData = Object.entries(categoryDistribution).map(([name, value]) => ({
      name,
      value
    }));

    // Doktora/Yüksek Lisans
    const doktoraCount = theses.filter(t => t['Tez Türü'] === 'Doktora').length;
    const yuksekLisansCount = theses.length - doktoraCount;

    const typeData = [
      { name: 'Doktora', value: doktoraCount },
      { name: 'Yüksek Lisans', value: yuksekLisansCount }
    ];

    // Tüm üniversiteler
    const universityCount = theses.reduce((acc, thesis) => {
      const uni = thesis['Üniversite'];
      if (uni) acc[uni] = (acc[uni] || 0) + 1;
      return acc;
    }, {});

    const allUniversities = Object.entries(universityCount)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));

    // Tüm enstitüler
    const instituteCount = theses.reduce((acc, thesis) => {
      const inst = thesis['Enstitü'];
      if (inst) acc[inst] = (acc[inst] || 0) + 1;
      return acc;
    }, {});

    const allInstitutes = Object.entries(instituteCount)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));

    // Tüm bölümler
    const departmentCount = theses.reduce((acc, thesis) => {
      const dept = thesis['Bölüm'];
      if (dept) acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {});

    const allDepartments = Object.entries(departmentCount)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));

    return {
      total: theses.length,
      universities: uniqueUniversities.length,
      years: uniqueYears.length,
      yearData,
      imamHatipTitleCount,
      categoryData,
      typeData,
      allUniversities,
      allInstitutes,
      allDepartments,
      doktoraCount,
      yuksekLisansCount
    };
  }, [theses]);

  const COLORS = {
    'Alan Dışı': '#ef4444',
    'Doğrudan Katkı': '#22c55e',
    'Diğer': '#94a3b8',
    'Doktora': '#B38F65',
    'Yüksek Lisans': '#8b6f47'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#B38F65] border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg font-medium">Veriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-[#B38F65] to-[#8b6f47] rounded-xl shadow-lg">
                <Book className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
                  İmam Hatip Tez Analitikleri
                </h1>
                <p className="text-sm text-slate-500">İstatistikler ve Veri Analizi</p>
              </div>
            </div>
            <div className="hidden md:flex items-center">
              <button 
                onClick={() => navigate('/')}
                className="text-sm font-medium text-slate-500 hover:text-[#B38F65] transition-colors flex items-center gap-2"
              >
                <Home size={16} />
                Anasayfa'ya Dön
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* İstatistik Kartları */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#B38F65]/10 rounded-lg">
                <Book className="w-5 h-5 text-[#B38F65]" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Toplam Tez</p>
                <p className="text-2xl font-bold text-slate-800 tabular-nums">
                  <AnimatedCounter value={stats.total} />
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#B38F65]/10 rounded-lg">
                <Building2 className="w-5 h-5 text-[#B38F65]" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Üniversite</p>
                <p className="text-2xl font-bold text-slate-800 tabular-nums">
                  <AnimatedCounter value={stats.universities} />
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#B38F65]/10 rounded-lg">
                <Calendar className="w-5 h-5 text-[#B38F65]" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Yıl Aralığı</p>
                <p className="text-2xl font-bold text-slate-800 tabular-nums">
                  <AnimatedCounter value={stats.years} />
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#B38F65]/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-[#B38F65]" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">İH Başlıklı</p>
                <p className="text-2xl font-bold text-slate-800 tabular-nums">
                  <AnimatedCounter value={stats.imamHatipTitleCount} />
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Grafikler */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          {/* Kategori Dağılımı */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-[#B38F65]/10 rounded-lg">
                <PieChart className="w-5 h-5 text-[#B38F65]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Kategori Dağılımı</h3>
                <p className="text-xs text-slate-500">Bölüm bazlı sınıflandırma</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPie>
                <Pie
                  data={stats.categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  onClick={(data) => navigate(`/tez-analytics/filter/category/${data.name}`)}
                  style={{ cursor: 'pointer' }}
                >
                  {stats.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#94a3b8'} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RechartsPie>
            </ResponsiveContainer>
          </div>

          {/* Tez Türü Dağılımı */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-[#B38F65]/10 rounded-lg">
                <Award className="w-5 h-5 text-[#B38F65]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Tez Türü Dağılımı</h3>
                <p className="text-xs text-slate-500">Doktora vs Yüksek Lisans</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPie>
                <Pie
                  data={stats.typeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  onClick={(data) => navigate(`/tez-analytics/filter/type/${data.name}`)}
                  style={{ cursor: 'pointer' }}
                >
                  {stats.typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RechartsPie>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Yıllara Göre Dağılım */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-[#B38F65]/10 rounded-lg">
              <Calendar className="w-5 h-5 text-[#B38F65]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Yıllara Göre Tez Sayısı</h3>
              <p className="text-xs text-slate-500">Tıklayarak yıl bazlı tezleri görüntüleyin</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.yearData} onClick={(data) => data && data.activePayload && navigate(`/tez-analytics/filter/year/${data.activePayload[0].payload.year}`)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip cursor={{ fill: 'rgba(179, 143, 101, 0.1)' }} />
              <Bar dataKey="count" fill="#B38F65" style={{ cursor: 'pointer' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Listeler Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Üniversiteler */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#B38F65]/10 rounded-lg">
                  <Building2 className="w-5 h-5 text-[#B38F65]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Üniversiteler</h3>
                  <p className="text-xs text-slate-500">{stats.allUniversities.length} üniversite</p>
                </div>
              </div>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {stats.allUniversities.map((uni, index) => (
                <div
                  key={index}
                  onClick={() => navigate(`/tez-analytics/filter/university/${encodeURIComponent(uni.name)}`)}
                  className="flex items-center justify-between p-3 hover:bg-[#B38F65]/5 rounded-lg cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                      index < 3 ? 'bg-[#B38F65] text-white shadow-sm' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {index + 1}
                    </div>
                    <p className="text-sm font-semibold text-slate-700 truncate group-hover:text-[#B38F65] transition-colors">
                      {uni.name}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-[#B38F65] tabular-nums ml-2">{uni.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Enstitüler */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#B38F65]/10 rounded-lg">
                  <GraduationCap className="w-5 h-5 text-[#B38F65]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Enstitüler</h3>
                  <p className="text-xs text-slate-500">{stats.allInstitutes.length} enstitü</p>
                </div>
              </div>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {stats.allInstitutes.map((inst, index) => (
                <div
                  key={index}
                  onClick={() => navigate(`/tez-analytics/filter/institute/${encodeURIComponent(inst.name)}`)}
                  className="flex items-center justify-between p-3 hover:bg-[#B38F65]/5 rounded-lg cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                      index < 3 ? 'bg-[#B38F65] text-white shadow-sm' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {index + 1}
                    </div>
                    <p className="text-sm font-semibold text-slate-700 truncate group-hover:text-[#B38F65] transition-colors">
                      {inst.name}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-[#B38F65] tabular-nums ml-2">{inst.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bölümler */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#B38F65]/10 rounded-lg">
                  <Book className="w-5 h-5 text-[#B38F65]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Bölümler</h3>
                  <p className="text-xs text-slate-500">{stats.allDepartments.length} bölüm</p>
                </div>
              </div>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {stats.allDepartments.map((dept, index) => (
                <div
                  key={index}
                  onClick={() => navigate(`/tez-analytics/filter/department/${encodeURIComponent(dept.name)}`)}
                  className="flex items-center justify-between p-3 hover:bg-[#B38F65]/5 rounded-lg cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                      index < 3 ? 'bg-[#B38F65] text-white shadow-sm' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {index + 1}
                    </div>
                    <p className="text-sm font-semibold text-slate-700 truncate group-hover:text-[#B38F65] transition-colors">
                      {dept.name}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-[#B38F65] tabular-nums ml-2">{dept.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
         {/* Tüm Tezler Butonu - YENİ EKLENEN */}
         <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/tez-analytics/all')}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#B38F65] to-[#8b6f47] text-white px-8 py-4 rounded-xl hover:shadow-2xl transition-all font-bold text-lg group"
          >
            <Book className="w-6 h-6 group-hover:scale-110 transition-transform" />
            Tüm Tezleri Görüntüle
            <span className="bg-white/20 px-3 py-1 rounded-lg text-sm">
              {stats.total} Tez
            </span>
          </button>
        </div>
      </main>


      {/* Footer */}
      <footer className="w-full py-8 mt-auto border-t border-slate-100 bg-white">
    <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center gap-2">
      <p className="text-sm font-medium text-slate-400">
        © 2026 İHAMER Analitik. Tüm hakları saklıdır.
      </p>
    </div>
  </footer>
    </div>
  );
};

export default Dashboard;