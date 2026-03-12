import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

// Ortak Bileşenler
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import ScrollToTop from "./components/common/ScrollToTop";
import ScrollToTopButton from "./components/common/ScrollToTopButton";
import PageTransition from "./components/common/PageTransition";

// Sayfalar
import HomePage from "./pages/anasayfa";
import HakkımızdaPage from "./pages/kurumsal/hakkımızda";
import YönetimPage from "./pages/kurumsal/yonetim";
import TarihcePage from "./pages/kurumsal/tarihce";
import IletisimPage from "./pages/iletisim";
import BilgiPage from "./pages/raporlar/bilgi";
import CalistayPage from "./pages/raporlar/calistay";
import NewsPage from "./pages/haberler/NewsPage";
import NewsDetail from "./pages/haberler/NewsDetail";
import KvkkPolitikası from "./components/common/kvkk";

// Hafızlık Programları
import HafizlikLayout from "./pages/anasayfa/HafizlikLayout.jsx";
import HafizlikHomePage from "./pages/anasayfa/HafizlikHomePage.jsx";
import HafizlikEgitimiPage from "./pages/anasayfa/HafizlikEgitimiPage.jsx";
import IhoOkulListesiPage from "./pages/anasayfa/IhoOkulListesiPage.jsx";
import AihlEgitimiPage from "./pages/anasayfa/AihlEgitimiPage.jsx";
import AihlListPage from "./pages/anasayfa/AihlListPage.jsx";

// Sanat Programları
import SanatHomePage from "./pages/anasayfa/SanatHomePage.jsx";
import MusikiListPage from "./pages/anasayfa/MusikiListPage.jsx";
import GorselSanatListPage from "./pages/anasayfa/GorselSanatListPage.jsx";

// Spor Programları
import SporHomePage from "./pages/anasayfa/SporHomePage.jsx";
import SporListPage from "./pages/anasayfa/SporListPage.jsx";

// Dil Programları
import DilHomePage from "./pages/anasayfa/DilHomePage.jsx";
import DilListPage from "./pages/anasayfa/DilListPage.jsx";

// Uluslararası Programlar
import UluslararasiHomePage from "./pages/anasayfa/UluslararasiHomePage.jsx";
import UluslararasiListPage from "./pages/anasayfa/UluslararasiListPage.jsx";

// Teknoloji Programları
import TeknolojiHomePage from "./pages/anasayfa/TeknolojiHomePage.jsx";
import TeknolojiListPage from "./pages/anasayfa/TeknolojiListPage.jsx";

// YÖK Atlas Analytics (V1)
import YokAtlasAnalytics from "./pages/YokAtlasAnalytics";

// Tez Analytics
import TezAnalyticsDashboard from "./pages/YokTezAnalytics/Dashboard.jsx";
import TezAnalyticsList from "./pages/YokTezAnalytics/TezList.jsx";
import AllThesesPage from "./pages/YokTezAnalytics/AllThesesPage.jsx";
import FilteredTezList from "./pages/YokTezAnalytics/FilteredTezList.jsx";

// YÖK Atlas V2 - Layout ve Sayfalar
import V2Layout from "./pages/YokAtlasV2/components/Layout";
import V2Overview from "./pages/YokAtlasV2/pages/Overview";
import V2Universities from "./pages/YokAtlasV2/pages/Universities";
import V2UniversityDetail from "./pages/YokAtlasV2/pages/UniversityDetail";
import V2Programs from "./pages/YokAtlasV2/pages/Programs";
import V2ProgramDetail from "./pages/YokAtlasV2/pages/ProgramDetail";
import V2ProgramUniversityDetail from "./pages/YokAtlasV2/pages/ProgramUniversityDetail";
import V2IHLKoken from "./pages/YokAtlasV2/pages/IHLKoken";
import V2IHLDetail from "./pages/YokAtlasV2/pages/IHLDetail";
import V2FakulteAnaliz from "./pages/YokAtlasV2/pages/FakulteAnaliz";
import V2PuanTuruAnaliz from "./pages/YokAtlasV2/pages/PuanTuruAnaliz";
import V2SchoolDetail from "./pages/YokAtlasV2/pages/SchoolDetail"; // ← YENİ

// --- YÖK Atlas V2 Data Wrapper ---
const YokAtlasV2Wrapper = ({ children }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        let response = await fetch("/yokatlas_data.json");
        if (!response.ok) {
          response = await fetch("/yokatlas_data_final.json");
          if (!response.ok) throw new Error("Veri dosyası bulunamadı");
        }
        const jsonData = await response.json();
        const records = jsonData.data || jsonData;
        if (!Array.isArray(records) || records.length === 0)
          throw new Error("Geçersiz veri formatı veya boş veri");
        console.log(`✅ ${records.length} kayıt yüklendi`);
        setData(records);
      } catch (err) {
        console.error("Veri yükleme hatası:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Veriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-lg">
          <div className="bg-red-100 text-red-700 p-6 rounded-lg mb-4">
            <p className="font-semibold text-lg mb-2">❌ Veri Yükleme Hatası</p>
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            🔄 Sayfayı Yenile
          </button>
        </div>
      </div>
    );
  }

  return children(data);
};

// --- LAYOUT CONTENT COMPONENT ---
const AppContent = () => {
  const location = useLocation();

  const isAnalyticsPage =
    location.pathname.startsWith("/analytics") ||
    location.pathname === "/v2" ||
    location.pathname.startsWith("/universities/v2") ||
    location.pathname.startsWith("/programs/v2") ||
    location.pathname.startsWith("/ihl/v2") ||
    location.pathname.startsWith("/fakulte/v2") ||
    location.pathname.startsWith("/puan-turu/v2") ||
    location.pathname.startsWith("/schools/"); // ← YENİ

  return (
    <>
      {!isAnalyticsPage && <Header />}

      <ScrollToTop />
      <PageTransition imageUrl="https://ihamer.org.tr/kurumsal/assest/tamlogo.png" />

      <Routes>
        {/* Genel */}
        <Route path="/kvkk" element={<KvkkPolitikası />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/hakkimizda" element={<HakkımızdaPage />} />
        <Route path="/yonetim" element={<YönetimPage />} />
        <Route path="/kurumsal/tarihce" element={<TarihcePage />} />
        <Route path="/iletisim" element={<IletisimPage />} />
        <Route path="/bilgi" element={<BilgiPage />} />
        <Route path="/calistay" element={<CalistayPage />} />
        <Route path="/haberler" element={<NewsPage />} />
        <Route path="/haber/:newsId" element={<NewsDetail />} />

        {/* YÖK Atlas Analytics V1 (Navbar/Footer GİZLİ) */}
        <Route path="/analytics" element={<YokAtlasAnalytics />} />
        <Route path="/analytics/university/:universityName" element={<YokAtlasAnalytics />} />
        <Route path="/analytics/department/:departmentName" element={<YokAtlasAnalytics />} />

        {/* YÖK Atlas V2 (Navbar/Footer GİZLİ) */}
        <Route path="/v2" element={
          <YokAtlasV2Wrapper>
            {(data) => <V2Layout><V2Overview data={data} /></V2Layout>}
          </YokAtlasV2Wrapper>
        } />
        <Route path="/universities/v2" element={
          <YokAtlasV2Wrapper>
            {(data) => <V2Layout><V2Universities data={data} /></V2Layout>}
          </YokAtlasV2Wrapper>
        } />
        <Route path="/universities/v2/:universityName" element={
          <YokAtlasV2Wrapper>
            {(data) => <V2Layout><V2UniversityDetail data={data} /></V2Layout>}
          </YokAtlasV2Wrapper>
        } />
        <Route path="/programs/v2" element={
          <YokAtlasV2Wrapper>
            {(data) => <V2Layout><V2Programs data={data} /></V2Layout>}
          </YokAtlasV2Wrapper>
        } />
        <Route path="/programs/v2/:programName" element={
          <YokAtlasV2Wrapper>
            {(data) => <V2Layout><V2ProgramDetail data={data} /></V2Layout>}
          </YokAtlasV2Wrapper>
        } />
        <Route path="/programs/v2/:programName/:universityName" element={
          <YokAtlasV2Wrapper>
            {(data) => <V2Layout><V2ProgramUniversityDetail data={data} /></V2Layout>}
          </YokAtlasV2Wrapper>
        } />
        <Route path="/ihl/v2" element={
          <YokAtlasV2Wrapper>
            {(data) => <V2Layout><V2IHLKoken data={data} /></V2Layout>}
          </YokAtlasV2Wrapper>
        } />
        <Route path="/ihl/v2/:ihlName" element={
          <YokAtlasV2Wrapper>
            {(data) => <V2Layout><V2IHLDetail data={data} /></V2Layout>}
          </YokAtlasV2Wrapper>
        } />
        <Route path="/fakulte/v2" element={
          <YokAtlasV2Wrapper>
            {(data) => <V2Layout><V2FakulteAnaliz data={data} /></V2Layout>}
          </YokAtlasV2Wrapper>
        } />
        <Route path="/puan-turu/v2" element={
          <YokAtlasV2Wrapper>
            {(data) => <V2Layout><V2PuanTuruAnaliz data={data} /></V2Layout>}
          </YokAtlasV2Wrapper>
        } />

        {/* Lise → Üniversite Detay (Navbar/Footer GİZLİ) ← YENİ */}
        <Route path="/schools/:schoolName/:univName" element={
          <YokAtlasV2Wrapper>
            {(data) => <V2Layout><V2SchoolDetail data={data} /></V2Layout>}
          </YokAtlasV2Wrapper>
        } />

        {/* Tez Analytics (Navbar/Footer GÖRÜNÜR) */}
        <Route path="/tez-analytics" element={<TezAnalyticsDashboard />} />
        <Route path="/tez-analytics/list" element={<TezAnalyticsList />} />
        <Route path="/tez-analytics/all" element={<AllThesesPage />} />
        <Route path="/tez-analytics/filter/:filterType/:filterValue" element={<FilteredTezList />} />

        {/* Hafızlık Programları */}
        <Route path="/HafizlikProgramlari" element={<HafizlikLayout />}>
          <Route index element={<HafizlikHomePage />} />
          <Route path="iho" element={<HafizlikEgitimiPage />} />
          <Route path="iho-okul-listesi" element={<IhoOkulListesiPage />} />
          <Route path="aihl" element={<AihlEgitimiPage />} />
          <Route path="aihl-okul-listesi" element={<AihlListPage />} />
        </Route>

        {/* Sanat Programları */}
        <Route path="/sanat-programlari" element={<SanatHomePage />} />
        <Route path="/sanat-programlari/musiki" element={<MusikiListPage />} />
        <Route path="/sanat-programlari/gorsel-sanatlar" element={<GorselSanatListPage />} />

        {/* Spor Programları */}
        <Route path="/spor-programlari" element={<SporHomePage />} />
        <Route path="/spor-programlari/okullar" element={<SporListPage />} />

        {/* Dil Programları */}
        <Route path="/dil-programlari" element={<DilHomePage />} />
        <Route path="/dil-programlari/okullar" element={<DilListPage />} />

        {/* Uluslararası Programlar */}
        <Route path="/uluslararasi-programlar" element={<UluslararasiHomePage />} />
        <Route path="/uluslararasi-programlar/okullar" element={<UluslararasiListPage />} />

        {/* Teknoloji Programları */}
        <Route path="/teknoloji-programlari" element={<TeknolojiHomePage />} />
        <Route path="/teknoloji-programlari/okullar" element={<TeknolojiListPage />} />
      </Routes>

      <ScrollToTopButton />

      {!isAnalyticsPage && <Footer />}
    </>
  );
};

const Router = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default Router;