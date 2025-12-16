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
  Scale,
  Home
} from 'lucide-react';

import Dashboard from './components/Dashboard';
import UniversityList from './components/UniversityList';
import DepartmentList from './components/DepartmentList';
import Statistics from './components/Statistics';
import ComparisonTool from './components/ComparisonTool';
import Filters from './components/Filters';
import UniversityDetail from './components/UniversityDetail';
import DepartmentDetail from './components/DepartmentDetail';

import { processRawData } from './utils/dataProcessor';
import { applyFilters, applySearchFilter, exportToCSV } from './utils/helpers';
import './styles/globals.css';

import rawData from './data.json';

const YokAtlasAnalytics = () => {
  const { universityName, departmentName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState('dashboard');
  const [processedData, setProcessedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  
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

  const handleMenuClick = (pageId) => {

    if (pageId === 'home') {
      navigate('/');
      return;
    }

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

  const menuItems = [
    { id: 'home', label: 'Anasayfa', icon: <Home size={18} /> }, // Yeni eklenen
    { id: 'dashboard', label: 'Genel Bakış', icon: <LayoutDashboard size={18} /> },
    { id: 'universities', label: 'Üniversiteler', icon: <School size={18} /> },
    { id: 'departments', label: 'Bölümler', icon: <BookOpen size={18} /> },
    { id: 'statistics', label: 'İstatistikler', icon: <BarChart2 size={18} /> },
    { id: 'comparison', label: 'Karşılaştır', icon: <Scale size={18} /> },
  ];

 return (
    <div className="flex flex-col h-[calc(100vh-80px)] font-sans text-slate-900 relative">
      
      {/* --- DESKTOP MENU --- */}
      {/* Container şeffaf ve tam genişlikte, içerik ortalanmış */}
      <div className="hidden md:flex items-center justify-center w-full py-6">
        
        {/* Sadece NAV elementinin arkaplanı ve border'ı var (Hap Görünümü) */}
        <nav className="flex items-center gap-1 p-1.5 bg-slate-100 border border-slate-200 rounded-full shadow-sm">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-200
                ${currentPage === item.id 
                  ? 'bg-white text-blue-700 shadow-sm ring-1 ring-black/5' // Aktif Sayfa
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50' // Pasif Sayfa
                }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* --- MOBILE HEADER --- */}
      <div className="md:hidden flex items-center justify-between bg-white px-4 py-3 border-b border-slate-200 sticky top-0 z-30">
        <span className="font-bold text-slate-700 text-lg">İHAMER Analitik</span>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 bg-slate-100 rounded-lg text-slate-600 hover:bg-slate-200"
        >
          <Menu size={24} />
        </button>
      </div>


      {/* --- MOBILE POPUP MENU --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:hidden">
          <div 
            className="absolute inset-0 bg-blue-900/30 backdrop-blur-md transition-all duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-full max-w-xs bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-scale-up border border-white/50">
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <span className="text-lg font-bold text-slate-800">Menü</span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="px-4 pb-6 space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-200 font-medium
                    ${currentPage === item.id 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={currentPage === item.id ? 'opacity-100' : 'opacity-70'}>
                      {item.icon}
                    </div>
                    <span>{item.label}</span>
                  </div>
                  {currentPage !== item.id && <ChevronRight size={16} className="text-slate-300" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN CONTENT (Full Width) --- */}
      <div className="flex-1 flex flex-col w-full h-full relative overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 scroll-smooth w-full">
          {/* İçerik Container'ını ortalayarak maksimum genişlik veriyoruz */}
          <div className="max-w-7xl mx-auto space-y-6 w-full">
            
            {/* Filtreler */}
            {!isDetailPage && currentPage !== 'dashboard' && currentPage !== 'comparison' && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5 animate-fade-in-up w-full">
                 <Filters 
                    data={processedData} 
                    onFilterChange={handleFilterChange}
                    initialFilters={filters}
                 />
              </div>
            )}

            {/* Sayfa İçeriği */}
            <div className="animate-fade-in pb-10 w-full">
              {renderPage()}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default YokAtlasAnalytics;