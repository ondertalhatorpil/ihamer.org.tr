import React, { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Statik bileşenler
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import LogoAnimation from "./components/common/LogoAnimation";
import ScrollToTopButton from "./components/common/ScrollToTopButton";
import ScrollToTop from './components/common/ScrollToTop';
import PageTransition from "./components/common/PageTransition";

// --- Sayfaları Yükleme ---
const HomePage = lazy(() => import("./pages/anasayfa"), 1500);
const HakkımızdaPage = lazy(() => import("./pages/kurumsal/hakkımızda"), 1500);
const YönetimPage = lazy(() => import("./pages/kurumsal/yonetim"), 1500);
const TarihcePage = lazy(() => import("./pages/kurumsal/tarihce"), 1500);
const IletisimPage = lazy(() => import("./pages/iletisim"), 1500);
const BilgiPage = lazy(() => import("./pages/raporlar/bilgi"), 1500);
const CalistayPage = lazy(() => import("./pages/raporlar/calistay"), 1500);
const NewsPage = lazy(() => import("./pages/haberler/NewsPage"), 1500);
const NewsDetail = lazy(() => import("./pages/haberler/NewsDetail"), 1500);
const HafizlikLayout = lazy(() => import("./pages/anasayfa/HafizlikLayout.jsx"), 1500);
const HafizlikHomePage = lazy(() => import("./pages/anasayfa/HafizlikHomePage.jsx"), 1500);
const HafizlikEgitimiPage = lazy(() => import("./pages/anasayfa/HafizlikEgitimiPage.jsx"), 1500);
const IhoOkulListesiPage = lazy(() => import("./pages/anasayfa/IhoOkulListesiPage.jsx"), 1500);
const AihlEgitimiPage = lazy(() => import("./pages/anasayfa/AihlEgitimiPage.jsx"), 1500);
const AihlListPage = lazy(() => import("./pages/anasayfa/AihlListPage.jsx"), 1500);
const SanatHomePage = lazy(() => import("./pages/anasayfa/SanatHomePage.jsx"), 1500);
const MusikiListPage = lazy(() => import("./pages/anasayfa/MusikiListPage.jsx"), 1500);
const GorselSanatListPage = lazy(() => import("./pages/anasayfa/GorselSanatListPage.jsx"), 1500);
const SporHomePage = lazy(() => import("./pages/anasayfa/SporHomePage.jsx"), 1500);
const SporListPage = lazy(() => import("./pages/anasayfa/SporListPage.jsx"), 1500);
const DilHomePage = lazy(() => import("./pages/anasayfa/DilHomePage.jsx"), 1500);
const DilListPage = lazy(() => import("./pages/anasayfa/DilListPage.jsx"), 1500);
const UluslararasiHomePage = lazy(() => import("./pages/anasayfa/UluslararasiHomePage.jsx"), 1500);
const UluslararasiListPage = lazy(() => import("./pages/anasayfa/UluslararasiListPage.jsx"), 1500);
const TeknolojiHomePage = lazy(() => import("./pages/anasayfa/TeknolojiHomePage.jsx"), 1500);
const TeknolojiListPage = lazy(() => import("./pages/anasayfa/TeknolojiListPage.jsx"), 1500);
const KvkkPolitikası = lazy(() => import("./components/common/kvkk.jsx"), 1500);


const Router = () => {
  return (
    <>
      <BrowserRouter>
        <Header />
        <ScrollToTop />
        <PageTransition imageUrl="https://ihamer.org.tr/wp-content/uploads/2022/01/Ihamer-Kahverengi.png" />
        <Suspense fallback={<LogoAnimation />}>
          <Routes>
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
            
            {/* Hafızlık Programları Rotaları */}
            <Route path="/HafizlikProgramlari" element={<HafizlikLayout />}>
              <Route index element={<HafizlikHomePage />} />
              <Route path="iho" element={<HafizlikEgitimiPage />} />
              <Route path="iho-okul-listesi" element={<IhoOkulListesiPage />} />
              <Route path="aihl" element={<AihlEgitimiPage />} />
              <Route path="aihl-okul-listesi" element={<AihlListPage />} />
            </Route>

            {/* Sanat Programları Rotaları */}
            <Route path="/sanat-programlari" element={<SanatHomePage />} />
            <Route path="/sanat-programlari/musiki" element={<MusikiListPage />} />
            <Route path="/sanat-programlari/gorsel-sanatlar" element={<GorselSanatListPage />} />

            {/* Spor Programları Rotaları */}
            <Route path="/spor-programlari" element={<SporHomePage />} />
            <Route path="/spor-programlari/okullar" element={<SporListPage />} />
            
            {/* Dil Programları Rotaları */}
            <Route path="/dil-programlari" element={<DilHomePage />} />
            <Route path="/dil-programlari/okullar" element={<DilListPage />} />
            
            {/* Uluslararası Programlar Rotaları */}
            <Route path="/uluslararasi-programlar" element={<UluslararasiHomePage />} />
            <Route path="/uluslararasi-programlar/okullar" element={<UluslararasiListPage />} />
            
            {/* Teknoloji Programları Rotaları */}
            <Route path="/teknoloji-programlari" element={<TeknolojiHomePage />} />
            <Route path="/teknoloji-programlari/okullar" element={<TeknolojiListPage />} />
            
          </Routes>
        </Suspense>
        <ScrollToTopButton />
        <Footer />
      </BrowserRouter>
    </>
  );
};

export default Router;