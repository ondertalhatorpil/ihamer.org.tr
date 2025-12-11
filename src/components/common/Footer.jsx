import React from "react";
import {
  FaLinkedinIn,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#191825] text-gray-300 py-12 text-[15px] leading-relaxed">
      <div className="max-w-6xl mx-auto px-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* About Column */}
        <div className="min-w-[220px]">
          <a href="/">
            <img
              className="w-48"
              src="https://ihamer.org.tr/wp-content/uploads/2022/01/Ihamer-Kahverengi.png"
              alt="İhamer Logo"
            />
            <p className="text-lg font-medium text-white mt-6 mb-5">
              Geleceğe Aydınlık Adımlar
            </p>
          </a>
          <div className="flex space-x-4">
            <a
              href="https://www.instagram.com/ihamer.tr/"
              aria-label="Instagram"
              className="text-xl text-white transition-all hover:text-accent-gold"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.facebook.com/ihamer.tr/"
              aria-label="Facebook"
              className="text-xl text-white transition-all hover:text-accent-gold"
            >
              <FaFacebookF />
            </a>

            <a
              href="https://x.com/ihamertr"
              aria-label="Twitter"
              className="text-xl text-white transition-all hover:text-accent-gold"
            >
              <FaTwitter />
            </a>
            <a
              href="https://tr.linkedin.com/in/ihamertr"
              aria-label="LinkedIn"
              className="text-xl text-white transition-all hover:text-accent-gold"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Kurumsal Column */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-5">Kurumsal</h3>
          <ul className="space-y-3">
            <li>
              <Link
                to="/hakkimizda"
                className="transition-all hover:text-white hover:pl-1.5"
              >
                Hakkımızda
              </Link>
            </li>
            <li>
              <a
                href="/kurumsal/tarihce"
                className="transition-all hover:text-white hover:pl-1.5"
              >
                Tarihçe
              </a>
            </li>
            <li>
              <a
                href="/yonetim"
                className="transition-all hover:text-white hover:pl-1.5"
              >
                Yönetim Kurulu
              </a>
            </li>
            <li>
              <a
                href="/iletisim"
                className="transition-all hover:text-white hover:pl-1.5"
              >
                İletişim
              </a>
            </li>
            <li>
              <a
                href="/kvkk"
                className="transition-all hover:text-white hover:pl-1.5"
              >
                KVK Politikası
              </a>
            </li>
          </ul>
        </div>

        {/* İhamer Column */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-5">İhamer</h3>
          <ul className="space-y-3">
            <li>
              <a
                href="/calistay"
                className="transition-all hover:text-white hover:pl-1.5"
              >
                Çalıştaylar
              </a>
            </li>
            <li>
              <a
                href="/bilgi"
                className="transition-all hover:text-white hover:pl-1.5"
              >
                Bilgi Notları
              </a>
            </li>
            <li>
              <a
                href="/haberler"
                className="transition-all hover:text-white hover:pl-1.5"
              >
                Haberler
              </a>
            </li>
            <li>
              <a
                href="https://dergipark.org.tr/tr/pub/talim"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-all hover:text-white hover:pl-1.5"
              >
                Talim Dergisi
              </a>
            </li>
          </ul>
        </div>

        {/* İletişim Column */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-5">İletişim</h3>
          <div className="space-y-3">
            <p className="m-0 text-base text-[#1f1e2f] leading-relaxed">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.google.com/maps/place/Alemdar,+H%C3%BCk%C3%BCmet+Kona%C4%9F%C4%B1+Cd.+No:7,+34110+Fatih%2F%C4%B0stanbul/@41.010763,28.97695,16z/data=!4m6!3m5!1s0x14cab9be2d8b7adf:0x7f1d877ca0df76c3!8m2!3d41.0107631!4d28.9769497!16s%2Fg%2F11bymt2h4g?hl=tr&entry=ttu&g_ep=EgoyMDI1MDkyMi4wIKXMDSoASAFQAw%3D%3D"
                className="text-white no-underline text-sm hover:text-[#c3976b] transition-colors duration-300"
              >
                Akşemsettin, Şair Fuzuli Sk. No: 22/2, 34080 Fatih/İstanbul
              </a>
            </p>
            
            <p>
          {/*   <br/>
              <a
                href="tel:02125211958"
                className="transition-all text-white hover:text-[#c3976b]"
              >
              0212 521 19 58
              </a> */}
            </p>
            <p>
              <a
                href="mailto:ihamer@onder.org.tr"
                className="transition-all text-white hover:text-[#c3976b]"
              >
                ihamer@onder.org.tr
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="text-center pt-8 mt-10 border-t border-gray-700">
        <p>© 2025 İHAMER İmam Hatip Araştırmaları Merkezi</p>
      </div>
    </footer>
  );
};

export default Footer;
