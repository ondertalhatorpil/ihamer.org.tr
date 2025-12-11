import React, { useState, useEffect } from "react";

import {
  FaChevronDown,
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaCircle,
} from "react-icons/fa";

import { Link, useLocation } from "react-router-dom";

// --- Logo ve link sabitleri ---

const LOGO_SRC =
  "https://ihamer.org.tr/wp-content/uploads/2022/01/Ihamer-Kahverengi.png";

const LOGO_LINK = "/";

const ACTIVE_BTN_BG_COLOR = "bg-[#ae9242]";

// --- NavLink Bileşeni (Güncellendi: Sola hizalı ve daha modern hover) ---

const NavLink = ({ to, children }) => (
  <li className="w-full border-b border-white/5 last:border-none">
    <Link
      to={to}
      className="text-white text-2xl font-medium py-5 px-8 block relative transition-all duration-300 ease-in-out hover:bg-white/5 hover:pl-10 hover:text-[#ae9242]"
    >
      {children}
    </Link>
  </li>
);

// --- SubMenuLink Bileşeni ---

const SubMenuLink = ({ to, children }) => (
  <li>
    <Link
      to={to}
      className="text-base font-normal py-3 px-8 pl-12 text-gray-300 block hover:text-[#ae9242] transition-all duration-300 flex items-center"
    >
      <FaCircle className="text-[6px] mr-3 text-[#ae9242]" />

      {children}
    </Link>
  </li>
);

// --- SocialLink Bileşeni ---

const SocialLink = ({ href, ariaLabel, icon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={ariaLabel}
    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white text-lg transition-all duration-300 hover:bg-[#ae9242] hover:text-white hover:-translate-y-1"
  >
    {icon}
  </a>
);

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [openSubMenu, setOpenSubMenu] = useState(null);

  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      closeMenu();
    }
  }, [location.pathname]);

  const toggleMenu = () => {
    const nextMenuState = !isMenuOpen;

    setIsMenuOpen(nextMenuState);

    if (nextMenuState) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");

      setOpenSubMenu(null);
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);

    document.body.classList.remove("overflow-hidden");

    setOpenSubMenu(null);
  };

  const handleSubMenuToggle = (e, menuName) => {
    e.preventDefault();

    setOpenSubMenu(openSubMenu === menuName ? null : menuName);
  };

  const corporateMenuOpen = openSubMenu === "kurumsal";

  const reportsMenuOpen = openSubMenu === "raporlar";

  const isHeaderActive = scrolled || isMenuOpen;

  // Hamburger çizgileri

  const lineBaseClasses =
    "block w-6 h-[2px] rounded-sm transition-all duration-300 ease-in-out";

  const lineColor = isMenuOpen || scrolled ? "bg-white" : "bg-[#191825]";

  return (
    <>
      <header>
        {/* --- GÖRÜNÜR HEADER BARI --- */}

        <div
          className={`fixed w-full top-0 left-0 z-[10001] transition-all duration-500 ${
            isHeaderActive ? "bg-transparent py-2" : "bg-white shadow-sm py-4"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* Logo */}

            <div
              className={`flex-shrink-0 transition-all duration-500 ${
                isHeaderActive
                  ? "opacity-0 -translate-x-10 pointer-events-none"
                  : "opacity-100 translate-x-0"
              }`}
            >
              <Link to={LOGO_LINK}>
                <img
                  className="h-10 md:h-12 w-auto"
                  src={LOGO_SRC}
                  alt="Logo"
                />
              </Link>
            </div>

            {/* --- SABİT/HAREKETLİ HAMBURGER BUTONU --- */}

            <button
              className={`

group w-12 h-12 rounded-full cursor-pointer flex flex-col justify-center items-center gap-1.5 transition-all duration-500 z-[10002]

${
  isHeaderActive
    ? ACTIVE_BTN_BG_COLOR + " shadow-lg"
    : "bg-transparent hover:bg-gray-100"
}

${scrolled ? "fixed top-10 right-6 -translate-y-1/4 scale-110" : "relative"}

`}
              onClick={toggleMenu}
              aria-label="Menü"
            >
              <span
                className={`${lineBaseClasses} ${lineColor} ${
                  isMenuOpen
                    ? "translate-y-[8px] rotate-45 w-6"
                    : "group-hover:w-8"
                }`}
              ></span>

              <span
                className={`${lineBaseClasses} ${lineColor} ${
                  isMenuOpen ? "opacity-0" : "w-4 group-hover:w-8"
                }`}
              ></span>

              <span
                className={`${lineBaseClasses} ${lineColor} ${
                  isMenuOpen
                    ? "-translate-y-[8px] -rotate-45 w-6"
                    : "w-6 group-hover:w-8"
                }`}
              ></span>
            </button>
          </div>
        </div>

        {/* --- BACKDROP OVERLAY (Menü arkasındaki karartı) --- */}

        <div
          className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] transition-opacity duration-500 ${
            isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          onClick={closeMenu}
        />

        {/* --- SIDE DRAWER (YAN PANEL MENÜ) --- */}

        <nav
          className={`

fixed top-0 right-0 h-full w-full sm:w-[400px] z-[10000]

bg-[#191825] shadow-2xl border-l-4 border-[#ae9242]

transform transition-transform duration-500 cubic-bezier(0.77, 0, 0.175, 1)

flex flex-col

${isMenuOpen ? "translate-x-0" : "translate-x-full"}

`}
        >
          {/* Menü İçeriği - Scroll Edilebilir Alan */}

          <div className="flex-1 overflow-y-auto pt-28 pb-10 custom-scrollbar">
            <ul className="list-none p-0 m-0 text-left">
              <NavLink to="/">Anasayfa</NavLink>

              {/* Kurumsal Dropdown */}

              <li className="w-full border-b border-white/5">
                <a
                  href="#"
                  onClick={(e) => handleSubMenuToggle(e, "kurumsal")}
                  className="text-white text-2xl font-medium py-5 px-8 flex justify-between items-center transition-all hover:text-[#ae9242] hover:bg-white/5"
                >
                  Kurumsal
                  <FaChevronDown
                    className={`text-sm transition-transform duration-300 ${
                      corporateMenuOpen
                        ? "rotate-180 text-[#ae9242]"
                        : "text-gray-500"
                    }`}
                  />
                </a>

                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    corporateMenuOpen ? "max-h-60 bg-black/20" : "max-h-0"
                  }`}
                >
                  <ul className="py-2">
                    <SubMenuLink to="/hakkimizda">Hakkımızda</SubMenuLink>

                    <SubMenuLink to="/kurumsal/tarihce">Tarihçe</SubMenuLink>

                    <SubMenuLink to="yonetim">Yönetim Kurulu</SubMenuLink>
                  </ul>
                </div>
              </li>

              {/* Raporlar Dropdown */}

              <li className="w-full border-b border-white/5">
                <a
                  href="#"
                  onClick={(e) => handleSubMenuToggle(e, "raporlar")}
                  className="text-white text-2xl font-medium py-5 px-8 flex justify-between items-center transition-all hover:text-[#ae9242] hover:bg-white/5"
                >
                  Raporlar
                  <FaChevronDown
                    className={`text-sm transition-transform duration-300 ${
                      reportsMenuOpen
                        ? "rotate-180 text-[#ae9242]"
                        : "text-gray-500"
                    }`}
                  />
                </a>

                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    reportsMenuOpen ? "max-h-60 bg-black/20" : "max-h-0"
                  }`}
                >
                  <ul className="py-2">
                    <SubMenuLink to="/calistay">Çalıştaylar</SubMenuLink>

                    <SubMenuLink to="/bilgi">Bilgi Notları</SubMenuLink>
                  </ul>
                </div>
              </li>

              <NavLink to="/haberler">Etkinlik & Haberler</NavLink>

              <li className="w-full border-b border-white/5">
                <a
                  href="https://dergipark.org.tr/tr/pub/talim"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  className="text-white text-2xl font-medium py-5 px-8 block relative transition-all duration-300 ease-in-out hover:bg-white/5 hover:pl-10 hover:text-[#ae9242]"
                >
                  Talim Dergisi
                </a>
              </li>

              <NavLink to="/iletisim">İletişim</NavLink>
            </ul>
          </div>

          {/* Menü Altı - Sosyal Medya */}

          <div className="p-8 border-t border-white/10 bg-[#15141f]">
            <p className="text-gray-400 text-sm mb-4">Bizi Takip Edin</p>

            <div className="flex gap-4">
              <SocialLink
                href="https://www.instagram.com/ihamer.tr/"
                ariaLabel="Instagram"
                icon={<FaInstagram />}
              />

              <SocialLink
                href="https://www.facebook.com/ihamer.tr/"
                ariaLabel="Facebook"
                icon={<FaFacebookF />}
              />

              <SocialLink
                href="https://x.com/ihamertr"
                ariaLabel="Twitter"
                icon={<FaTwitter />}
              />

              <SocialLink
                href="https://tr.linkedin.com/in/ihamertr"
                ariaLabel="LinkedIn"
                icon={<FaLinkedinIn />}
              />
            </div>
          </div>
        </nav>
      </header>

      {/* Sabit header boşluğu */}

      <div className="h-20" />
    </>
  );
};

export default Header;
