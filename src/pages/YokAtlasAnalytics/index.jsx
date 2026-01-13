import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, X, ChevronRight, LayoutDashboard, 
  School, BookOpen, BarChart2, Scale, Home, ArrowLeft
} from 'lucide-react';

import Dashboard from './components/Dashboard';
import UniversityList from './components/UniversityList';
import DepartmentList from './components/DepartmentList';
import Statistics from './components/Statistics';
import ComparisonTool from './components/ComparisonTool';
import UniversityDetail from './components/UniversityDetail';
import DepartmentDetail from './components/DepartmentDetail';

import { processRawData } from './utils/dataProcessor';
import './styles/globals.css';
import rawData from './data.json';


import Logo from '../../assets/images/tam logo.png';


const SimpleFooter = () => (
  <footer className="w-full py-8 mt-auto border-t border-slate-100 bg-white">
    <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center gap-2">
      <p className="text-sm font-medium text-slate-400">
        © 2026 İHAMER Analitik. Tüm hakları saklıdır.
      </p>
    </div>
  </footer>
);

const YokAtlasAnalytics = () => {
  const { universityName, departmentName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState('dashboard');
  const [processedData, setProcessedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
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
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="h-10 w-10 rounded-full border-2 border-[#B38F65] border-t-transparent animate-spin"></div>
          <p className="text-sm font-medium text-slate-400 tracking-wider">VERİLER YÜKLENİYOR</p>
        </div>
      </div>
    );
  }

  const isDetailPage = currentPage === 'universityDetail' || currentPage === 'departmentDetail';

  const menuItems = [
    { id: 'dashboard', label: 'Genel Bakış' },
    { id: 'universities', label: 'Üniversiteler' },
    { id: 'departments', label: 'Bölümler' },
    { id: 'statistics', label: 'İstatistikler' },
    { id: 'comparison', label: 'Karşılaştır' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 font-sans text-slate-900 relative overflow-x-hidden">
      
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <div className="h-16 flex items-center justify-between">
            
            {/* LOGO ALANI (SADECE RESİM) */}
            <div 
              className="flex items-center cursor-pointer hover:opacity-80 transition-opacity" 
              onClick={() => navigate('/')}
            >
               <img 
                 src={Logo} 
                 alt="İHAMER Logo" 
                 className="h-12 w-auto object-contain" 
               />
            </div>

            {/* SAĞ TARAFTAKİ BUTONLAR (AYNI KALDI) */}
            <div className="hidden md:flex items-center">
                <button 
                  onClick={() => navigate('/')}
                  className="text-sm font-medium text-slate-500 hover:text-[#B38F65] transition-colors flex items-center gap-2"
                >
                  <Home size={16} />
                  Anasayfa'ya Dön
                </button>
            </div>

            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>

          {/* TAB NAVİGASYON (AYNI KALDI) */}
          <div className="hidden md:flex items-center gap-8 -mb-px overflow-x-auto no-scrollbar">
            {menuItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  className={`
                    py-3 text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap
                    ${isActive 
                      ? 'border-[#B38F65] text-[#B38F65]' 
                      : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'}
                  `}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* --- MOBİL MENÜ DRAWER --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Drawer Content */}
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-white shadow-2xl animate-slide-in-right flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <span className="font-bold text-slate-800">Menü</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-slate-50 rounded-full text-slate-500">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors
                    ${currentPage === item.id 
                      ? 'bg-[#B38F65]/10 text-[#B38F65]' 
                      : 'text-slate-600 hover:bg-slate-50'}
                  `}
                >
                  {item.label}
                  {currentPage === item.id && <div className="w-1.5 h-1.5 rounded-full bg-[#B38F65]" />}
                </button>
              ))}
              
              <div className="h-px bg-slate-100 my-4" />
              
              <button 
                onClick={() => navigate('/')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50"
              >
                <ArrowLeft size={18} />
                Anasayfa'ya Dön
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- ANA İÇERİK --- */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">      

        {/* Sayfa İçeriği */}
        <div className="animate-fade-in min-h-[60vh]">
          {renderPage()}
        </div>

      </main>

      {/* --- YENİ BASİT FOOTER --- */}
      <SimpleFooter />
    </div>
  );
};

export default YokAtlasAnalytics;