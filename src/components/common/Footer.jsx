import React from 'react';
import { FaLinkedinIn, FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-[#191825] text-gray-300 py-12 text-[15px] leading-relaxed">
            <div className="max-w-6xl mx-auto px-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                {/* About Column */}
                <div className="min-w-[220px]">
                    <a href="/anasayfa/index.html">
                        <img className="w-48" src="https://ihamer.org.tr/wp-content/uploads/2022/01/Ihamer-Kahverengi.png" alt="İhamer Logo" />
                        <p className="text-lg font-medium text-white mt-6 mb-5">Geleceğe Aydınlık Adımlar</p>
                    </a>
                    <div className="flex space-x-4">
                        <a href="#" aria-label="LinkedIn" className="text-xl text-white transition-colors hover:text-accent-gold"><FaLinkedinIn /></a>
                        <a href="#" aria-label="Facebook" className="text-xl text-white transition-colors hover:text-accent-gold"><FaFacebookF /></a>
                        <a href="#" aria-label="Instagram" className="text-xl text-white transition-colors hover:text-accent-gold"><FaInstagram /></a>
                        <a href="#" aria-label="Twitter" className="text-xl text-white transition-colors hover:text-accent-gold"><FaTwitter /></a>
                    </div>
                </div>

                {/* Kurumsal Column */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-5">Kurumsal</h3>
                    <ul className="space-y-3">
                        <li><a href="/kurumsal/hakkimizda.html" className="transition-colors hover:text-white hover:pl-1.5">Hakkımızda</a></li>
                        <li><a href="/kurumsal/tarihce.html" className="transition-colors hover:text-white hover:pl-1.5">Tarihçe</a></li>
                        <li><a href="/kurumsal/yönetim.html" className="transition-colors hover:text-white hover:pl-1.5">Yönetim Kurulu</a></li>
                        <li><a href="/iletisim/iletisim.html" className="transition-colors hover:text-white hover:pl-1.5">İletişim</a></li>
                    </ul>
                </div>

                {/* İhamer Column */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-5">İhamer</h3>
                    <ul className="space-y-3">
                        <li><a href="/Raporlar/calistaylar.html" className="transition-colors hover:text-white hover:pl-1.5">Çalıştaylar</a></li>
                        <li><a href="/Raporlar/bilgi-notlari.html" className="transition-colors hover:text-white hover:pl-1.5">Bilgi Notları</a></li>
                        <li><a href="/etkinlik/etkinlik.html" className="transition-colors hover:text-white hover:pl-1.5">Haberler</a></li>
                        <li><a href="https://dergipark.org.tr/tr/pub/talim" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white hover:pl-1.5">Talim Dergisi</a></li>
                    </ul>
                </div>
                
                {/* İletişim Column */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-5">İletişim</h3>
                    <div className="space-y-3">
                        <p><a target="_blank" rel="noopener noreferrer" href="https://www.google.com/maps/search/?api=1&query=Akşemsettin, Şair Fuzuli Sk. No: 22/2, 34080 Fatih/İstanbul" className="transition-colors hover:text-accent-gold">Akşemsettin, Şair Fuzuli Sk. No: 22/2, 34080 Fatih/İstanbul</a></p>
                        <p><a href="tel:02125211958" className="transition-colors hover:text-accent-gold">(0212) 521 19 58</a></p>
                        <p><a href="mailto:ihamer@onder.org.tr" className="transition-colors hover:text-accent-gold">ihamer@onder.org.tr</a></p>
                    </div>
                </div>
            </div>
            <div className="text-center pt-8 mt-10 border-t border-gray-700">
                <p>© 2024 İHAMER İmam Hatip Araştırmaları Merkezi</p>
            </div>
        </footer>
    );
};

export default Footer;