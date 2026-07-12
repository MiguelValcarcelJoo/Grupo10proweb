const PLATFORM_COLORS = {
  PC: '#1a202c', PS5: '#00439c', Xbox: '#107c10', Switch: '#e60012',
};

const Library = ({ purchasedKeys }) => {
  return (
    <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, margin: '0 0 6px 0' }}>Mi Biblioteca</h1>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '15px' }}>
          Aquí se guardan todas tus licencias digitales adquiridas.
        </p>
      </div>

      {purchasedKeys.length === 0 ? (
        <div style={{
          padding: '60px 40px', textAlign: 'center',
          background: 'var(--surface-color)', borderRadius: 'var(--border-radius)',
          border: '1px solid var(--border-color)',
        }}>
          <div style={{ fontSize: '52px', marginBottom: '12px' }}>📚</div>
          <p style={{ fontSize: '17px', color: 'var(--text-muted)', margin: '0 0 20px 0' }}>
            Aún no has adquirido ningún código de activación.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {purchasedKeys.map((item, index) => (
            <article key={index} style={{
              display: 'flex', alignItems: 'center', gap: '20px',
              background: 'var(--surface-color)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '16px 20px',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='var(--primary-color)'; e.currentTarget.style.boxShadow='0 4px 16px rgba(0,0,0,0.07)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border-color)'; e.currentTarget.style.boxShadow='none'; }}
            >
              {/* Miniatura */}
              <img
                src={item.imageUrl}
                alt={item.title}
                style={{
                  width: '60px', height: '78px',
                  objectFit: 'cover', borderRadius: '8px',
                  flexShrink: 0, border: '1px solid var(--border-color)',
                }}
              />

              {/* Info izquierda */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.title}
                  </h3>
                  <span style={{
                    flexShrink: 0,
                    fontSize: '11px', fontWeight: 700, padding: '2px 8px',
                    borderRadius: '4px', color: '#fff',
                    background: PLATFORM_COLORS[item.platform] || '#64748b',
                  }}>
                    {item.platform}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                  Adquirido el: {item.purchaseDate}
                </p>
              </div>

              {/* Código a la derecha */}
              <div style={{ flexShrink: 0, textAlign: 'right' }}>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 600 }}>
                  Código de activación
                </label>
                <code style={{
                  display: 'inline-block',
                  background: '#0f172a', color: '#4ade80',
                  padding: '8px 18px', borderRadius: '6px',
                  fontFamily: 'monospace', fontWeight: 800,
                  fontSize: '18px', letterSpacing: '3px',
                }}>
                  {item.keyGenerated}
                </code>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
};

export default Library;
