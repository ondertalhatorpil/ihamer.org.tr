import { Link, useLocation } from 'react-router-dom';
import { Home, Building2, BookOpen, School, GraduationCap, BarChart2, ChevronRight } from 'lucide-react';
import { useState, useEffect, createContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ═══════════════════════════════════════════════════
   PALETTE
═══════════════════════════════════════════════════ */
export const THEME = {
  bg:          '#faf8f4',
  bgDeep:      '#f4f0e8',
  bgCard:      '#ffffff',
  sidebar:     '#1c1f2e',
  sidebarDark: '#151824',
  border:      'rgba(28,31,46,0.10)',
  borderCard:  'rgba(28,31,46,0.08)',
  borderNav:   'rgba(255,255,255,0.07)',
  borderNavAct:'rgba(196,154,108,0.45)',
  text:        '#1c1f2e',
  textSub:     '#4a4e65',
  textMuted:   '#8a8ea8',
  textInv:     '#f4f0e8',
  textInvMuted:'rgba(244,240,232,0.45)',
  navy:        '#1c1f2e',
  navyMid:     '#2d3250',
  navyLight:   '#4a4e65',
  brown:       '#8b5e3c',
  brownLight:  '#c49a6c',
  brownPale:   '#f0e4d0',
  cream:       '#f4f0e8',
  shadow:      'rgba(28,31,46,0.08)',
  shadowMd:    'rgba(28,31,46,0.14)',
};

export const ThemeContext = createContext(THEME);
const T = THEME;

const FONT_BODY    = '"Plus Jakarta Sans", system-ui, sans-serif';
const FONT_DISPLAY = '"Playfair Display", serif';
const SIDEBAR_W    = 260;

const NAV = [
  { name: 'Genel Bakış',   href: '/v2',             icon: Home,          desc: 'Özet & İstatistikler'   },
  { name: 'Üniversiteler', href: '/universities/v2', icon: Building2,     desc: 'Okullara göre analiz'   },
  { name: 'Bölümler',      href: '/programs/v2',     icon: BookOpen,      desc: 'Programlar & tercihler' },
  { name: 'İHL Köken',     href: '/ihl/v2',          icon: School,        desc: 'Lise bazlı veriler'     },
  { name: 'Fakülte',       href: '/fakulte/v2',      icon: GraduationCap, desc: 'Fakülte dağılımları'    },
  { name: 'Puan Türü',     href: '/puan-turu/v2',    icon: BarChart2,     desc: 'SAY, SÖZ, EA, DİL'     },
];

/* ═══════════════════════════════════════════════════
   MORPH BUTTON (mobile hamburger)
═══════════════════════════════════════════════════ */
const MorphButton = ({ open, onClick }) => (
  <motion.button
    onClick={onClick}
    whileTap={{ scale: 0.88 }}
    style={{
      position: 'relative', width: 40, height: 40, borderRadius: 11,
      border: `1px solid ${open ? T.brown + '55' : T.border}`,
      background: open ? T.brownPale : 'transparent',
      cursor: 'pointer', outline: 'none', flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'background 0.22s, border-color 0.22s',
    }}
  >
    <svg width="17" height="13" viewBox="0 0 17 13" fill="none">
      <motion.line x1="1" y1="1.5"  x2="16" y2="1.5"
        stroke={open ? T.brown : T.text} strokeWidth="1.7" strokeLinecap="round"
        animate={open ? { x1:2, y1:2, x2:15, y2:11 } : { x1:1, y1:1.5, x2:16, y2:1.5 }}
        transition={{ duration: 0.28, ease: [0.22,1,0.36,1] }}
      />
      <motion.line x1="1" y1="6.5" x2="11" y2="6.5"
        stroke={open ? T.brown : T.text} strokeWidth="1.7" strokeLinecap="round"
        animate={open ? { opacity:0 } : { opacity:1 }}
        transition={{ duration: 0.18 }}
      />
      <motion.line x1="1" y1="11.5" x2="16" y2="11.5"
        stroke={open ? T.brown : T.text} strokeWidth="1.7" strokeLinecap="round"
        animate={open ? { x1:2, y1:11, x2:15, y2:2 } : { x1:1, y1:11.5, x2:16, y2:11.5 }}
        transition={{ duration: 0.28, ease: [0.22,1,0.36,1] }}
      />
    </svg>
  </motion.button>
);

/* ═══════════════════════════════════════════════════
   SIDEBAR CONTENT
═══════════════════════════════════════════════════ */
const SidebarContent = ({ onClose }) => {
  const location = useLocation();
  const isActive = (href) =>
    href === '/v2' ? location.pathname === '/v2' : location.pathname.startsWith(href);

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      background: T.sidebar,
      position: 'relative', overflow: 'hidden',
      fontFamily: FONT_BODY,
    }}>

      {/* Horizontal line texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.016,
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 23px, #fff 23px, #fff 24px)`,
      }}/>

      {/* Bottom ambient glow */}
      <div style={{
        position: 'absolute', bottom: -100, left: '50%', transform: 'translateX(-50%)',
        width: 280, height: 220, pointerEvents: 'none',
        background: `radial-gradient(ellipse at center, ${T.brown}18 0%, transparent 68%)`,
      }}/>

      {/* Top accent stripe */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2, zIndex: 10,
        background: `linear-gradient(90deg, transparent, ${T.brown} 25%, ${T.brownLight} 65%, transparent)`,
      }}/>

      {/* ────────────────────────────────────────
          LOGO AREA
      ──────────────────────────────────────── */}
      <div style={{
        padding: '26px 18px 20px',
        borderBottom: `1px solid rgba(255,255,255,0.06)`,
        position: 'relative', zIndex: 2, marginTop: 2,
      }}>

        {/* Logo placeholder — sol üst köşe
            Gerçek logo geldiğinde bu div'in içini değiştir */}
        <div style={{
          width: 46, height: 46, borderRadius: 13,
          border: `1.5px dashed ${T.brown}50`,
          background: `linear-gradient(145deg, rgba(139,94,60,0.12), rgba(196,154,108,0.06))`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 16, flexShrink: 0,
          position: 'relative',
        }}>
          <GraduationCap size={19} color={T.brownLight} style={{ opacity: 0.65 }}/>
          {/* Tiny corner dot */}
          <div style={{
            position: 'absolute', top: 4, left: 4,
            width: 4, height: 4, borderRadius: '50%',
            background: T.brown, opacity: 0.45,
          }}/>
        </div>

        {/* Brand name */}
        <p style={{
          fontSize: 21, fontWeight: 800,
          color: T.textInv,
          fontFamily: FONT_DISPLAY, fontStyle: 'italic',
          lineHeight: 1, letterSpacing: '-0.02em',
          marginBottom: 6,
        }}>İhamer</p>

        {/* Subtitle with decorative dash */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
          <div style={{
            width: 20, height: 1.5, borderRadius: 1,
            background: `linear-gradient(90deg, ${T.brown}, transparent)`,
          }}/>
          <p style={{
            fontSize: 8.5, color: T.brownLight, fontWeight: 700,
            letterSpacing: '0.22em', textTransform: 'uppercase',
          }}>Veri &amp; Analiz</p>
        </div>

        <p style={{
          fontSize: 10.5, color: 'rgba(244,240,232,0.38)',
          lineHeight: 1.6, fontWeight: 400,
        }}>
          İHL Mezunu Üniversite<br/>Yerleşim Verileri
        </p>
      </div>

      {/* ── Section divider label ── */}
      <div style={{ padding: '16px 18px 4px', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            flex: 1, height: 1,
            background: 'linear-gradient(90deg, rgba(255,255,255,0.07), transparent)',
          }}/>
          <p style={{
            fontSize: 8, fontWeight: 700,
            color: 'rgba(244,240,232,0.20)',
            letterSpacing: '0.22em', textTransform: 'uppercase',
          }}>Menü</p>
          <div style={{
            flex: 1, height: 1,
            background: 'linear-gradient(270deg, rgba(255,255,255,0.07), transparent)',
          }}/>
        </div>
      </div>

      {/* ── Nav items ── */}
      <nav style={{
        flex: 1, padding: '4px 8px 8px',
        overflowY: 'auto', position: 'relative', zIndex: 2,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {NAV.map((item, idx) => {
            const Icon   = item.icon;
            const active = isActive(item.href);
            return (
              <motion.div key={item.name}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 + idx * 0.042, duration: 0.36, ease: [0.22,1,0.36,1] }}
              >
                <Link to={item.href} onClick={onClose} style={{ textDecoration: 'none', display: 'block' }}>
                  <motion.div
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '9px 10px', borderRadius: 9,
                      cursor: 'pointer', position: 'relative',
                      background: active ? 'rgba(139,94,60,0.14)' : 'transparent',
                      border: `1px solid ${active ? T.brown + '2a' : 'transparent'}`,
                      transition: 'background 0.18s, border-color 0.18s',
                    }}
                  >
                    {/* Active indicator bar */}
                    {active && (
                      <motion.div
                        layoutId="activeBar"
                        style={{
                          position: 'absolute', left: 0, top: '18%', bottom: '18%',
                          width: 2.5, borderRadius: 2,
                          background: `linear-gradient(180deg, ${T.brown}, ${T.brownLight})`,
                        }}
                      />
                    )}

                    {/* Icon */}
                    <div style={{
                      width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: active
                        ? 'rgba(196,154,108,0.15)'
                        : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${active ? T.brown + '25' : 'rgba(255,255,255,0.05)'}`,
                      transition: 'background 0.18s, border-color 0.18s',
                    }}>
                      <Icon
                        size={13}
                        color={active ? T.brownLight : 'rgba(244,240,232,0.35)'}
                      />
                    </div>

                    {/* Text */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontSize: 12.5, lineHeight: 1.2,
                        fontWeight: active ? 600 : 400,
                        color: active ? T.textInv : 'rgba(244,240,232,0.58)',
                        transition: 'color 0.18s',
                      }}>{item.name}</p>
                      <p style={{
                        fontSize: 9.5, lineHeight: 1.2, marginTop: 1.5,
                        color: active ? T.brownLight : 'rgba(244,240,232,0.20)',
                        transition: 'color 0.18s',
                      }}>{item.desc}</p>
                    </div>

                    {/* Active chevron */}
                    {active && (
                      <motion.div
                        initial={{ opacity: 0, x: -3 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.18 }}
                        style={{ flexShrink: 0 }}
                      >
                        <ChevronRight size={11} color={T.brownLight} style={{ opacity: 0.65 }}/>
                      </motion.div>
                    )}
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </nav>

      {/* ── Data source badge ── */}
      <div style={{
        margin: '0 8px 8px',
        padding: '9px 12px',
        borderRadius: 9,
        background: 'rgba(139,94,60,0.07)',
        border: `1px solid ${T.brown}1c`,
        position: 'relative', zIndex: 2,
      }}>
        <p style={{
          fontSize: 9.5,
          color: 'rgba(196,154,108,0.58)',
          lineHeight: 1.6, fontWeight: 400,
        }}>
          Kaynak: YÖK Atlas<br/>
          <span style={{ opacity: 0.55 }}>2023 · 2024 · 2025</span>
        </p>
      </div>

      {/* ── Footer ── */}
      <div style={{
        padding: '10px 18px 16px',
        borderTop: `1px solid rgba(255,255,255,0.05)`,
        position: 'relative', zIndex: 2,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
        <div style={{
          width: 20, height: 1,
          background: `linear-gradient(90deg, transparent, ${T.brown}44)`,
        }}/>
        <p style={{
          fontSize: 9, letterSpacing: '0.07em',
          color: 'rgba(244,240,232,0.15)',
        }}>YÖK Atlas 2023–2025</p>
        <div style={{
          width: 20, height: 1,
          background: `linear-gradient(270deg, transparent, ${T.brown}44)`,
        }}/>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   MOBILE DRAWER
═══════════════════════════════════════════════════ */
const MobileDrawer = ({ open, onClose }) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div key="backdrop"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 500,
            background: 'rgba(28,31,46,0.5)',
            backdropFilter: 'blur(6px)',
          }}
        />
        <motion.div key="drawer"
          initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
          transition={{ type: 'spring', stiffness: 380, damping: 42 }}
          style={{
            position: 'fixed', left: 0, top: 0, bottom: 0,
            width: Math.min(SIDEBAR_W, 288), zIndex: 501,
            boxShadow: `8px 0 48px rgba(28,31,46,0.28)`,
          }}
        >
          <SidebarContent onClose={onClose}/>
        </motion.div>
        <motion.div key="hint"
          initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
          transition={{ delay: 0.28 }}
          onClick={onClose}
          style={{
            position: 'fixed', bottom: 22, right: 16, zIndex: 502,
            background: T.bgCard, border: `1px solid ${T.border}`,
            borderRadius: 20, padding: '6px 14px',
            fontSize: 11, color: T.textSub, cursor: 'pointer',
            boxShadow: `0 4px 14px ${T.shadow}`,
            fontFamily: FONT_BODY,
          }}
        >Kapat ×</motion.div>
      </>
    )}
  </AnimatePresence>
);

/* ═══════════════════════════════════════════════════
   TOPBAR (mobile)
═══════════════════════════════════════════════════ */
const Topbar = ({ open, setOpen }) => {
  const location    = useLocation();
  const currentPage = NAV.find(n =>
    n.href === '/v2' ? location.pathname === '/v2' : location.pathname.startsWith(n.href)
  );

  return (
    <header
      className="mobile-topbar"
      style={{
        position: 'sticky', top: 0, zIndex: 400,
        background: 'rgba(250,248,244,0.95)',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${T.border}`,
        height: 54, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 16px',
        fontFamily: FONT_BODY,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <MorphButton open={open} onClick={() => setOpen(o => !o)}/>
        {/* Logo — mobile */}
        <div style={{
          width: 26, height: 26, borderRadius: 7, flexShrink: 0,
          background: `linear-gradient(135deg, ${T.brown}, ${T.brownLight})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <GraduationCap size={12} color="#fff"/>
        </div>
        <span style={{
          fontSize: 15, fontWeight: 800, color: T.text,
          fontFamily: FONT_DISPLAY, fontStyle: 'italic',
          letterSpacing: '-0.01em',
        }}>İhamer</span>
      </div>

      <AnimatePresence mode="wait">
        {currentPage && (
          <motion.div key={currentPage.name}
            initial={{ opacity: 0, y: -5, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.92 }}
            transition={{ duration: 0.2 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: T.brownPale, border: `1px solid ${T.brownLight}44`,
              borderRadius: 15, padding: '4px 10px',
            }}
          >
            <currentPage.icon size={10} color={T.brown}/>
            <span style={{ fontSize: 11, fontWeight: 600, color: T.brown }}>
              {currentPage.name}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

/* ═══════════════════════════════════════════════════
   LAYOUT
═══════════════════════════════════════════════════ */
const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  return (
    <ThemeContext.Provider value={T}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700;1,800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body {
          height: 100%;
          background: ${T.bg};
          color: ${T.text};
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }
        html { scroll-behavior: auto !important; }
        a { text-decoration: none; color: inherit; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(28,31,46,0.12); border-radius: 2px; }
        @media (min-width: 768px) {
          .desktop-sidebar { display: flex !important; }
          .mobile-topbar   { display: none  !important; }
        }
        @media (max-width: 767px) {
          .desktop-sidebar { display: none  !important; }
          .mobile-topbar   { display: flex  !important; }
        }
      `}</style>

      <Topbar open={mobileOpen} setOpen={setMobileOpen}/>
      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)}/>

      <div style={{ display: 'flex', minHeight: '100vh', background: T.bg }}>
        <div
          className="desktop-sidebar"
          style={{
            width: SIDEBAR_W, flexShrink: 0,
            position: 'sticky', top: 0, height: '100vh',
            display: 'none',
          }}
        >
          <SidebarContent onClose={() => {}}/>
        </div>
        <main style={{ flex: 1, minWidth: 0, position: 'relative', background: T.bg }}>
          {children}
        </main>
      </div>
    </ThemeContext.Provider>
  );
};

export default Layout;