import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  ChevronRight, 
  LayoutDashboard, 
  School, 
  BookOpen, 
  BarChart2, 
  Scale 
} from 'lucide-react';

// Bileşenler
import Dashboard from './components/Dashboard';
import UniversityList from './components/UniversityList';
import DepartmentList from './components/DepartmentList';
import Statistics from './components/Statistics';
import ComparisonTool from './components/ComparisonTool';
import Filters from './components/Filters';
import UniversityDetail from './components/UniversityDetail';
import DepartmentDetail from './components/DepartmentDetail';

// Utils ve Styles
import { processRawData } from './utils/dataProcessor';
import { applyFilters, applySearchFilter, exportToCSV } from './utils/helpers';
import './styles/globals.css';

// Data
import rawData from './data.json';

const YokAtlasAnalytics = () => {
  const { universityName, departmentName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // State'ler
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [processedData, setProcessedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  
  // Mobil Menü State'i
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Veri Yükleme
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const normalized = processRawData(rawData);
        setProcessedData(normalized);
        setFilteredData(normalized);
      } catch (error) {
        console.error('Veri yükleme hatası:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Routing Kontrolü
  useEffect(() => {
    if (universityName) {
      setCurrentPage('universityDetail');
    } else if (departmentName) {
      setCurrentPage('departmentDetail');
    } else {
      if (location.pathname === '/analytics' && (currentPage === 'universityDetail' || currentPage === 'departmentDetail')) {
        setCurrentPage('dashboard');
      }
    }
    setIsMobileMenuOpen(false); 
  }, [universityName, departmentName, location.pathname]);

  // Filtreleme
  useEffect(() => {
    if (processedData.length === 0) return;
    if (currentPage === 'universityDetail' || currentPage === 'departmentDetail') return;

    let filtered = processedData;
    if (filters.searchTerm) {
      filtered = applySearchFilter(filtered, filters.searchTerm);
    }
    filtered = applyFilters(filtered, filters);
    setFilteredData(filtered);
  }, [filters, processedData, currentPage]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleExport = () => {
    exportToCSV(filteredData, `yokatlas_export_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleMenuClick = (pageId) => {
    navigate('/analytics');
    setCurrentPage(pageId);
    setIsMobileMenuOpen(false);
  };

  const renderPage = () => {
    const dataToUse = currentPage === 'dashboard' ? processedData : filteredData;

    switch(currentPage) {
      case 'universityDetail': return <UniversityDetail data={processedData} />;
      case 'departmentDetail': return <DepartmentDetail data={processedData} />;
      case 'dashboard': return <Dashboard data={dataToUse} />;
      case 'universities': return <UniversityList data={dataToUse} />;
      case 'departments': return <DepartmentList data={dataToUse} />;
      case 'statistics': return <Statistics data={dataToUse} />;
      case 'comparison': return <ComparisonTool data={processedData} />;
      default: return <Dashboard data={dataToUse} />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-lg font-medium text-slate-600">Veriler Yükleniyor...</p>
        </div>
      </div>
    );
  }

  const isDetailPage = currentPage === 'universityDetail' || currentPage === 'departmentDetail';

  // Menü öğelerini sadeleştirdik
  const menuItems = [
    { id: 'dashboard', label: 'Genel Bakış', icon: <LayoutDashboard size={20} /> },
    { id: 'universities', label: 'Üniversiteler', icon: <School size={20} /> },
    { id: 'departments', label: 'Bölümler', icon: <BookOpen size={20} /> },
    { id: 'statistics', label: 'İstatistikler', icon: <BarChart2 size={20} /> },
    { id: 'comparison', label: 'Karşılaştır', icon: <Scale size={20} /> },
  ];

  return (
    <div className="flex h-[calc(100vh-80px)] bg-slate-50 font-sans text-slate-900 overflow-hidden relative">
      
      {/* --- YENİ MOBİL POPUP MENU --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:hidden">
          
          {/* 1. BLUE BACKDROP (Buzlu Mavi Arkaplan) */}
          <div 
            className="absolute inset-0 bg-blue-900/30 backdrop-blur-md transition-all duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* 2. SADELEŞTİRİLMİŞ POPUP KART */}
          <div className="relative w-full max-w-xs bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-scale-up border border-white/50">
            
            {/* Header: Başlık ve Kapat */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <span className="text-lg font-bold text-slate-800">Menü</span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Menü Listesi (SADE) */}
            <div className="px-4 pb-6 space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-200 font-medium
                    ${currentPage === item.id 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' // Aktif buton mavi
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100' // Pasif buton gri
                    }`}
                >
                  <div className="flex items-center gap-3">
                    {/* İkon */}
                    <div className={currentPage === item.id ? 'opacity-100' : 'opacity-70'}>
                      {item.icon}
                    </div>
                    {/* Yazı */}
                    <span>{item.label}</span>
                  </div>
                  
                  {/* Ok işareti (Sadece aktif değilken gösterilebilir veya her zaman) */}
                  {currentPage !== item.id && <ChevronRight size={16} className="text-slate-300" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden md:flex w-64 flex-shrink-0 bg-white border-r border-slate-200 flex-col z-20">
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-2">Menü</p>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
                ${currentPage === item.id 
                  ? 'bg-blue-50 text-blue-700 shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* HEADER (MOBİLDE ÖZEL TASARIM) */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shrink-0 z-10">
          <div className="flex items-center gap-4">
            
            {/* 3. YENİ TETİKLEYİCİ BUTON (PILL SHAPE) */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden flex items-center gap-2 px-4 py-2.5 bg-slate-50 text-slate-700 rounded-full border border-slate-200 shadow-sm active:scale-95 transition-all hover:bg-slate-100 hover:border-slate-300"
            >
              <Menu size={20} className="text-slate-600" />
              <span className="text-sm font-bold">Menü</span>
            </button>

            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-slate-800 line-clamp-1">
                {isDetailPage ? 'Detay' : menuItems.find(i => i.id === currentPage)?.label || 'Panel'}
              </h2>
              
            </div>
          </div>

       
        </header>

        {/* CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 scroll-smooth bg-slate-50/50">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Filtreler */}
            {!isDetailPage && currentPage !== 'dashboard' && currentPage !== 'comparison' && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5 animate-fade-in-up">
                 <Filters 
                    data={processedData} 
                    onFilterChange={handleFilterChange}
                    initialFilters={filters}
                 />
              </div>
            )}

            {/* Sayfa İçeriği */}
            <div className="animate-fade-in pb-10">
              {renderPage()}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default YokAtlasAnalytics;