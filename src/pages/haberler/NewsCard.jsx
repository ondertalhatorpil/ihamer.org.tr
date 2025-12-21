import React from "react";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom"; // React Router'dan Link import edildi

// 'onClick' prop'u kaldırıldı
const NewsCard = ({ item }) => {
  return (
    // Tüm kart 'Link' bileşeni ile sarmalandı
    <Link
      to={`/haber/${item.id}`} // Dinamik URL oluşturuldu
      className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:-translate-y-1 block"
      // 'block' class'ı eklendi, 'cursor-pointer' kaldırıldı
    >
      {/* 'onClick' özelliği kaldırıldı */}
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 group-hover:bg-black/60 transition-all duration-300">
          {/* Logo Resmi */}
          <img
            // BURAYA KENDİ LOGO URL'NİZİ YAZIN:
            src="/src/assets/images/kalem.png"
            alt="Logo Watermark"
            // opacity-0: Başlangıçta görünmez.
            // group-hover:opacity-40: Üzerine gelince %40 opaklıkla görünür (sayıyı artırıp azaltabilirsiniz).
            // w-1/2: Kutusunun yarısı kadar genişlikte olsun.
            className="w-1/2 h-auto object-contain opacity-0 group-hover:opacity-100 transition-opacity duration-500 select-none pointer-events-none filter drop-shadow-lg"
          />
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`text-md font-bold ${
              item.category === "Haberler"
                ? "text-amber-700"
                : "text-indigo-900"
            }`}
          >
            {item.category}
          </span>
        </div>

        <h2 className="text-base font-bold text-gray-900 mb-3 line-clamp-3 min-h-[4.5rem] leading-tight">
          {item.title}
        </h2>

        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <Calendar size={14} />
          <span>{item.date}</span>
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;
