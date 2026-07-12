import { Link } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';

// Logos de plataforma — ajusta la ruta si difiere en tu proyecto
import logoPS from '../assets/PlayStation.png';
import logoSteam from '../assets/Steam.png';
import logoSwitch from '../assets/Switch.png';
import logoXbox from '../assets/Xbox.png';

const PLATFORMS = [
  { key: 'PC',     label: 'PC / Steam',     logo: logoSteam,  accent: '#1a9fff', bg: 'linear-gradient(135deg,#0a1628 0%,#1a3a5c 100%)', invertLogo: true  },
  { key: 'PS5',    label: 'PlayStation',    logo: logoPS,     accent: '#00a8e8', bg: 'linear-gradient(135deg,#00074a 0%,#003087 100%)', invertLogo: true  },
  { key: 'Xbox',   label: 'Xbox',           logo: logoXbox,   accent: '#52b043', bg: 'linear-gradient(135deg,#0a1f0a 0%,#107c10 100%)', invertLogo: true  },
  { key: 'Switch', label: 'Nintendo Switch',logo: logoSwitch, accent: '#ff4444', bg: 'linear-gradient(135deg,#1a0505 0%,#c40000 100%)', invertLogo: false },
];

const getPlatformClass = (platform) => {
  switch (platform) {
    case 'PC':     return 'tag-pc';
    case 'PS5':    return 'tag-ps5';
    case 'Xbox':   return 'tag-xbox';
    case 'Switch': return 'tag-switch';
    default:       return '';
  }
};

/* ── Componente Hero con carrusel automático ── */
const Hero = ({ games }) => {
  const heroPool = useMemo(() => {
    if (!games || games.length === 0) return [];
    // Toma hasta 6 juegos aleatorios para el carrusel
    const shuffled = [...games].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(6, shuffled.length));
  }, []); // eslint-disable-line

  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = (idx) => {
    if (idx === current) return;
    setFading(true);
    setTimeout(() => {
      setCurrent(idx);
      setFading(false);
    }, 300);
  };

  // Auto-avance cada 5 s
  useEffect(() => {
    if (heroPool.length <= 1) return;
    const t = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent(c => (c + 1) % heroPool.length);
        setFading(false);
      }, 300);
    }, 5000);
    return () => clearInterval(t);
  }, [heroPool.length]);

  const game = heroPool[current];
  if (!game) return null;

  return (
    <header style={{
      position: 'relative',
      width: '100vw',
      left: '50%',
      right: '50%',
      marginLeft: '-50vw',
      marginRight: '-50vw',
      height: '580px',
      overflow: 'hidden',
      marginBottom: '48px',
    }}>
      {/* Imagen de fondo — nítida, reconocible */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${game.imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        filter: fading ? 'blur(6px) brightness(0.35)' : 'blur(0px) brightness(0.82)',
        transform: fading ? 'scale(1.04)' : 'scale(1)',
        transition: 'filter 0.4s ease, transform 0.4s ease',
        zIndex: 0,
      }} />


      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(90deg, rgba(5,8,20,0.95) 0%, rgba(5,8,20,0.75) 38%, rgba(5,8,20,0.15) 65%, rgba(5,8,20,0.0) 80%)',
        zIndex: 1,
      }} />

      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '80px',
        background: 'linear-gradient(to bottom, rgba(5,8,20,0.5), transparent)',
        zIndex: 1,
      }} />

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '100px',
        background: 'linear-gradient(to top, rgba(5,8,20,0.85), transparent)',
        zIndex: 1,
      }} />


      <div style={{
        position: 'relative', zIndex: 2,
        height: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 40px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.3s ease',
      }}>

        <span style={{
          display: 'inline-block',
          background: 'var(--primary-color)',
          color: '#fff',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          padding: '4px 10px',
          borderRadius: '4px',
          marginBottom: '14px',
          width: 'fit-content',
        }}>
          {game.platform} · {game.category || 'Destacado'}
        </span>

        <h1 style={{
          color: '#fff',
          fontSize: 'clamp(28px, 4vw, 52px)',
          fontWeight: 800,
          margin: '0 0 12px 0',
          maxWidth: '520px',
          lineHeight: 1.1,
          textShadow: '0 2px 20px rgba(0,0,0,0.5)',
        }}>
          {game.title}
        </h1>

        <p style={{
          color: 'rgba(255,255,255,0.75)',
          fontSize: '15px',
          maxWidth: '420px',
          margin: '0 0 28px 0',
          lineHeight: 1.6,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {game.description}
        </p>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ color: '#fff', fontSize: '28px', fontWeight: 800 }}>
            S/ {game.price.toFixed(2)}
          </span>
          <Link to={`/game/${game.id}`} style={{ textDecoration: 'none' }}>
            <button style={{
              background: 'var(--primary-color)',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              padding: '12px 28px',
              fontSize: '15px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(193,18,31,0.5)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 28px rgba(193,18,31,0.7)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 20px rgba(193,18,31,0.5)'; }}
            >
              Ver Detalles
            </button>
          </Link>
          <Link to="/catalog" style={{ textDecoration: 'none' }}>
            <button style={{
              background: 'rgba(255,255,255,0.15)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '6px',
              padding: '12px 24px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              backdropFilter: 'blur(4px)',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.25)'}
            onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.15)'}
            >
              Ver Catálogo
            </button>
          </Link>
        </div>
      </div>

      {heroPool.length > 1 && (
        <div style={{
          position: 'absolute', bottom: '20px', right: '40px',
          display: 'flex', gap: '8px', zIndex: 3,
        }}>
          {heroPool.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                width: i === current ? '28px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: i === current ? 'var(--primary-color)' : 'rgba(255,255,255,0.4)',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                transition: 'width 0.3s ease, background 0.3s ease',
              }}
            />
          ))}
        </div>
      )}
    </header>
  );
};


const Home = ({ games }) => {
  return (
    <div style={{ overflowX: 'hidden' }}>
      <Hero games={games} />

      <div className="home-container" style={{ paddingTop: 0 }}>

  
        <section style={{ marginBottom: '48px' }}>
          <h2 className="section-title">Elige tu Plataforma</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {PLATFORMS.map(({ key, label, logo, bg, accent, invertLogo }) => (
              <Link key={key} to="/catalog" state={{ platform: key }} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: bg,
                  borderRadius: '12px',
                  padding: '28px 20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  boxShadow: `0 4px 16px rgba(0,0,0,0.3)`,
                  border: `1px solid ${accent}33`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '14px',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = `0 16px 32px rgba(0,0,0,0.35), 0 0 0 1px ${accent}66`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 4px 16px rgba(0,0,0,0.3)`;
                }}>
                  <img
                    src={logo}
                    alt={label}
                    style={{
                      height: '46px',
                      objectFit: 'contain',
                      filter: invertLogo ? 'brightness(0) invert(1)' : 'none',
                      opacity: 0.95,
                    }}
                  />
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: '14px', letterSpacing: '0.3px' }}>
                    {label}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── TODOS LOS JUEGOS ── */}
        <section style={{ marginBottom: '60px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            paddingBottom: '12px',
            borderBottom: '2px solid var(--border-color)',
          }}>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700 }}>Todos los Juegos</h2>
            <span style={{
              color: 'var(--text-muted)',
              fontSize: '13px',
              background: '#f1f5f9',
              padding: '4px 12px',
              borderRadius: '20px',
              fontWeight: 600,
            }}>
              {games.length} títulos
            </span>
          </div>

          <div className="games-grid">
            {games.map(game => (
              <article key={game.id} className="game-card-simple">
                <img src={game.imageUrl} alt={game.title} className="game-card-img" />
                <div className="game-card-info">
                  <p className="game-card-title">{game.title}</p>
                  <span className={`game-card-platform ${getPlatformClass(game.platform)}`}>
                    {game.platform}
                  </span>
                  <p className="game-card-price">S/ {game.price.toFixed(2)}</p>
                </div>
                <div style={{ padding: '0 16px 16px 16px' }}>
                  <Link to={`/game/${game.id}`} style={{ textDecoration: 'none' }}>
                    <button className="add-button btn-secondary">Ver Detalles</button>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <footer className="home-footer">
          <p>&copy; 2026 PeKeys Store. Todos los derechos reservados. Compras 100% seguras y confiables.</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
