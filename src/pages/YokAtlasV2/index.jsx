import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Overview from './pages/Overview';
import Universities from './pages/Universities';
import UniversityDetail from './pages/UniversityDetail';
import Programs from './pages/Programs';
import ProgramDetail from './pages/ProgramDetail';
import ProgramUniversityDetail from './pages/ProgramUniversityDetail';
import IHLKoken from './pages/IHLKoken';
import IHLDetail from './pages/IHLDetail';
import FakulteAnaliz from './pages/FakulteAnaliz';
import PuanTuruAnaliz from './pages/PuanTuruAnaliz';

function YokAtlasV2() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        let response;
        let jsonData;

        try {
          response = await fetch('/yokatlas_data.json');
          if (!response.ok) throw new Error('yokatlas_data.json bulunamadı');
          jsonData = await response.json();
        } catch (err) {
          console.log('yokatlas_data.json bulunamadı, yokatlas_data_final.json deneniyor...');
          response = await fetch('/yokatlas_data_final.json');
          if (!response.ok) throw new Error('Veri dosyası bulunamadı');
          jsonData = await response.json();
        }

        const records = jsonData.data || jsonData;

        if (!Array.isArray(records) || records.length === 0) {
          throw new Error('Geçersiz veri formatı veya boş veri');
        }

        console.log(`✅ ${records.length} kayıt yüklendi`);
        setData(records);
        setLoading(false);
      } catch (err) {
        console.error('Veri yükleme hatası:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Veriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-2xl">
          <div className="bg-red-100 text-red-700 p-6 rounded-lg mb-4">
            <p className="font-semibold text-lg mb-2">❌ Veri Yükleme Hatası</p>
            <p className="text-sm mt-2">{error}</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg text-left">
            <p className="font-semibold text-blue-900 mb-3">📋 Çözüm Adımları:</p>

            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-900">
              <li>
                Proje klasöründe <code className="bg-blue-200 px-2 py-1 rounded">public</code> klasörü oluşturun:
                <pre className="bg-blue-900 text-blue-100 p-2 rounded mt-1 overflow-x-auto">mkdir public</pre>
              </li>
              <li>
                Veri dosyanızı kopyalayın:
                <pre className="bg-blue-900 text-blue-100 p-2 rounded mt-1 overflow-x-auto">cp yokatlas_data_final.json public/yokatlas_data.json</pre>
              </li>
              <li>
                Geliştirme sunucusunu yeniden başlatın:
                <pre className="bg-blue-900 text-blue-100 p-2 rounded mt-1 overflow-x-auto">npm run dev</pre>
              </li>
            </ol>

            <p className="text-xs text-blue-700 mt-4 italic">
              💡 Not: Vite projelerinde statik dosyalar <code>public</code> klasöründe olmalıdır.
            </p>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            🔄 Sayfayı Yenile
          </button>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/v2" element={<Overview data={data} />} />
        <Route path="/universities/v2" element={<Universities data={data} />} />
        <Route path="/universities/v2/:universityName" element={<UniversityDetail data={data} />} />
        <Route path="/programs/v2" element={<Programs data={data} />} />
        <Route path="/programs/v2/:programName" element={<ProgramDetail data={data} />} />
        <Route path="/programs/v2/:programName/:universityName" element={<ProgramUniversityDetail data={data} />} />
        <Route path="/ihl/v2" element={<IHLKoken data={data} />} />
        <Route path="/ihl/v2/:ihlName" element={<IHLDetail data={data} />} />
        <Route path="/fakulte/v2" element={<FakulteAnaliz data={data} />} />
        <Route path="/puan-turu/v2" element={<PuanTuruAnaliz data={data} />} />
      </Routes>
    </Layout>
  );
}

export default YokAtlasV2;