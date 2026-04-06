import React, { useState, useEffect } from "react";

const PASSWORD = "ihamer2026*";

const T = {
  bg: '#faf8f4',
  bgCard: '#ffffff',
  border: 'rgba(28,31,46,0.10)',
  borderCard: 'rgba(28,31,46,0.08)',
  text: '#1c1f2e',
  textSub: '#4a4e65',
  textMuted: '#8a8ea8',
  navy: '#1c1f2e',
  brown: '#8b5e3c',
  brownLight: '#c49a6c',
  brownPale: '#f0e4d0',
  shadow: 'rgba(28,31,46,0.08)',
  shadowMd: 'rgba(28,31,46,0.14)',
};

const FONT_BODY = '"Plus Jakarta Sans", system-ui, sans-serif';
const FONT_DISPLAY = '"Playfair Display", serif';

const V2PasswordGate = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("v2_auth") === "true") setAuthenticated(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input === PASSWORD) {
      sessionStorage.setItem("v2_auth", "true");
      setAuthenticated(true);
    } else {
      setError(true);
      setInput("");
    }
  };

  if (authenticated) return children;

  return (
    <div style={{
      minHeight: '100vh',
      background: T.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: FONT_BODY,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      {/* arka plan efektleri */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse 65% 55% at 80% 40%, ${T.brownPale} 0%, transparent 65%)` }} />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 71px, ${T.border} 71px, ${T.border} 72px)`, opacity: 0.45 }} />
      <div style={{ position: 'absolute', right: '-1%', top: '50%', transform: 'translateY(-50%)', fontSize: '30vw', fontWeight: 800, fontFamily: FONT_DISPLAY, fontStyle: 'italic', color: T.navy, opacity: 0.022, lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>A</div>

      {/* kart */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        background: T.bgCard,
        border: `1px solid ${T.borderCard}`,
        borderRadius: 16,
        padding: '40px 36px',
        width: '100%',
        maxWidth: 380,
        boxShadow: `0 4px 24px ${T.shadow}`,
        overflow: 'hidden',
      }}>
        {/* üst çizgi aksanı */}
        <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 2, background: `linear-gradient(90deg, transparent, ${T.brown}55, transparent)` }} />

        {/* logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <img
            src="/kurumsal/assest/tamlogo.png"
            alt="İHAMER"
            style={{ height: 52, objectFit: 'contain', margin: '0 auto 20px' }}
          />

          <div>
            <span style={{ fontSize: 32, fontWeight: 800, fontFamily: FONT_DISPLAY, fontStyle: 'italic', color: T.navy, letterSpacing: '-0.02em', lineHeight: 1 }}>Erişim </span>
            <span style={{ fontSize: 32, fontWeight: 800, fontFamily: FONT_DISPLAY, fontStyle: 'italic', color: T.brown, letterSpacing: '-0.02em', lineHeight: 1 }}>Paneli</span>
          </div>

          <div style={{ width: 80, height: 2, background: `linear-gradient(90deg, transparent, ${T.brown}, transparent)`, borderRadius: 1, margin: '12px auto 0' }} />

          <p style={{ fontSize: 13, color: T.textMuted, marginTop: 12, lineHeight: 1.7 }}>
             Kaynağa erişmek için şifre gereklidir
          </p>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="password"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(false); }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Şifrenizi girin"
            autoFocus
            style={{
              width: '100%',
              padding: '11px 14px',
              border: `1px solid ${error ? '#e74c3c' : focused ? T.brown : T.border}`,
              borderRadius: 10,
              fontSize: 14,
              fontFamily: FONT_BODY,
              color: T.text,
              background: error ? '#fff5f5' : '#fff',
              outline: 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              boxShadow: focused && !error ? `0 0 0 3px ${T.brown}18` : 'none',
              boxSizing: 'border-box',
              letterSpacing: input ? '0.15em' : 0,
            }}
          />

          {error && (
            <p style={{ fontSize: 12, color: '#e74c3c', margin: '-4px 0 0', paddingLeft: 2 }}>
              Hatalı şifre, tekrar deneyin.
            </p>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              background: T.navy,
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 700,
              fontFamily: FONT_BODY,
              cursor: 'pointer',
              transition: 'background 0.2s',
              marginTop: 4,
            }}
            onMouseEnter={e => e.target.style.background = '#2d3250'}
            onMouseLeave={e => e.target.style.background = T.navy}
          >
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
};

export default V2PasswordGate;