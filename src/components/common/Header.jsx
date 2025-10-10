import { useState } from 'react';
import { FaChevronDown, FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn, FaCircle } from 'react-icons/fa';

// --- Kolayca değiştirmek için logoyu ve linkini buraya ekledim ---
const LOGO_SRC = "https://ihamer.org.tr/wp-content/uploads/2022/01/Ihamer-Kahverengi.png"; // Public klasöründeki logo yolunuz
const LOGO_LINK = "/"; // Logonun yönlendirileceği link (örneğin ana sayfa)

const NavLink = ({ href, children }) => (
  <li className="py-3">
    <a href={href} className="text-white text-3xl font-semibold p-2.5 block relative transition-all duration-300 ease-in-out hover:text-accent-gold hover:translate-x-2.5">
      {children}
    </a>
  </li>
);

const SubMenuLink = ({ href, children }) => (
  <li>
    <a href={href} className="text-lg font-normal py-3 px-6 text-accent-gold text-center block hover:bg-black/30 hover:text-accent-gold hover:translate-x-1 transition-all duration-300">
       <FaCircle className="inline-block text-white text-[8px] mr-2" /> {children}
    </a>
  </li>
);

const SocialLink = ({ href, ariaLabel, icon }) => (
    <a href={href} aria-label={ariaLabel} className="text-white text-3xl transition-colors duration-300 hover:text-accent-gold hover:scale-125 hover:-translate-y-1">
        {icon}
    </a>
);

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openSubMenu, setOpenSubMenu] = useState(null);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        document.body.classList.toggle('overflow-hidden'); 
    };

    const handleSubMenuToggle = (e, menuName) => {
        e.preventDefault();
        setOpenSubMenu(openSubMenu === menuName ? null : menuName);
    };

    const corporateMenuOpen = openSubMenu === 'kurumsal';
    const reportsMenuOpen = openSubMenu === 'raporlar';

    return (
        <header>
            {/* --- YENİ EKLENEN GÖRÜNÜR HEADER BARI --- */}
            <div className="bg-white shadow-md relative lg:fixed w-full top-0 left-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
                    {/* Sol Köşe: Logo */}
                    <div className="flex-shrink-0">
                        <a href={LOGO_LINK}>
                            <img className="h-12 w-auto" src={LOGO_SRC} alt="Şirket Logosu" />
                        </a>
                    </div>

                    {/* Sağ Köşe: Hamburger Menü Butonu */}
                    <button
                        className="w-12 h-12 bg-transparent rounded-xl cursor-pointer flex flex-col justify-around p-2.5 transition-transform duration-300"
                        onClick={toggleMenu}
                        aria-label="Menüyü Aç/Kapat"
                    >
                        <span className={`block w-full h-1 bg-[#191825] rounded-sm transition-all duration-300 ease-in-out ${isMenuOpen ? "translate-y-2 rotate-45" : ""}`}></span>
                        <span className={`block w-full h-1 bg-[#191825] rounded-sm transition-all duration-300 ease-in-out ${isMenuOpen ? "opacity-0" : ""}`}></span>
                        <span className={`block w-full h-1 bg-[#191825] rounded-sm transition-all duration-300 ease-in-out ${isMenuOpen ? "-translate-y-2.5 -rotate-45" : ""}`}></span>
                    </button>
                </div>
            </div>

            {/* Sabit header'ın içeriği ezmemesi için boşluk (sadece geniş ekranda görünür) */}
            <div className="hidden lg:block h-20" /> 
            
            {/* --- TAM EKRAN NAVİGASYON MENÜSÜ (Değişiklik yok) --- */}
            <nav className={`fixed z-[1000] bg-[#191825] shadow-2xl flex flex-col justify-center items-center overflow-hidden transition-transform duration-500 ease-in-out inset-0
                ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
                <ul className="list-none p-0 m-auto w-4/5 text-center">
                    <NavLink href="/anasayfa/index.html">Anasayfa</NavLink>
                    
                    <li className="py-3">
                        <a href="#" onClick={(e) => handleSubMenuToggle(e, 'kurumsal')} className="text-white text-3xl font-semibold p-2.5 block relative transition-all duration-300 ease-in-out hover:text-accent-gold hover:translate-x-2.5 flex items-center justify-center">
                            Kurumsal <FaChevronDown className={`text-base ml-2.5 text-accent-gold transition-transform duration-300 ${corporateMenuOpen ? 'rotate-180' : ''}`} />
                        </a>
                        <ul className={`list-none max-h-0 overflow-hidden m-2.5 transition-all duration-500 ease-out ${corporateMenuOpen ? 'max-h-60' : ''}`}>
                            <SubMenuLink href="/kurumsal/hakkimizda.html">Hakkımızda</SubMenuLink>
                            <SubMenuLink href="/kurumsal/tarihce.html">Tarihçe</SubMenuLink>
                            <SubMenuLink href="/kurumsal/yönetim.html">Yönetim Kurulu</SubMenuLink>
                        </ul>
                    </li>

                     <li className="py-3">
                        <a href="#" onClick={(e) => handleSubMenuToggle(e, 'raporlar')} className="text-white text-3xl font-semibold p-2.5 block relative transition-all duration-300 ease-in-out hover:text-accent-gold hover:translate-x-2.5 flex items-center justify-center">
                            Raporlar <FaChevronDown className={`text-base ml-2.5 text-accent-gold transition-transform duration-300 ${reportsMenuOpen ? 'rotate-180' : ''}`} />
                        </a>
                        <ul className={`list-none max-h-0 overflow-hidden m-2.5 transition-all duration-500 ease-out ${reportsMenuOpen ? 'max-h-60' : ''}`}>
                            <SubMenuLink href="/Raporlar/calistaylar.html">Çalıştaylar</SubMenuLink>
                            <SubMenuLink href="/Raporlar/bilgi-notlari.html">Bilgi Notları</SubMenuLink>
                        </ul>
                    </li>
                    
                    <NavLink href="/etkinlik/etkinlik.html">Etkinlik & Haberler</NavLink>
                    <NavLink href="https://dergipark.org.tr/tr/pub/talim">Talim Dergisi</NavLink>
                    <NavLink href="/iletisim/iletisim.html">İletişim</NavLink>
                </ul>

                 <div className="mt-12 pb-6 pt-6 border-t border-white/20 w-4/5 text-center flex justify-center gap-5">
                    <SocialLink href="https://www.instagram.com/ihamer.tr/" ariaLabel="Instagram" icon={<FaInstagram />} />
                    <SocialLink href="https://www.facebook.com/ihamer.tr/" ariaLabel="Facebook" icon={<FaFacebookF />} />
                    <SocialLink href="https://x.com/ihamertr" ariaLabel="Twitter" icon={<FaTwitter />} />
                    <SocialLink href="https://tr.linkedin.com/in/ihamertr" ariaLabel="LinkedIn" icon={<FaLinkedinIn />} />
                </div>
            </nav>
        </header>
    );
};

export default Header;