// src/components/Toast.jsx
import { useEffect, useState } from 'react';

const Toast = ({ message, imageUrl, onDone }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Frame delay para que la transición CSS se dispare
    const show = setTimeout(() => setVisible(true), 10);
    const hide = setTimeout(() => setVisible(false), 2800);
    const done = setTimeout(() => onDone(), 3200); // espera al fade-out
    return () => { clearTimeout(show); clearTimeout(hide); clearTimeout(done); };
  }, [onDone]);

  return (
    <div style={{
      position: 'fixed',
      bottom: '28px',
      right: '28px',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      background: '#0f172a',
      color: '#f8fafc',
      padding: '12px 16px',
      borderRadius: '10px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      maxWidth: '320px',
      transform: visible ? 'translateY(0)' : 'translateY(20px)',
      opacity: visible ? 1 : 0,
      transition: 'transform 0.3s ease, opacity 0.3s ease',
    }}>
      {imageUrl && (
        <img src={imageUrl} alt="" style={{
          width: '40px', height: '52px',
          objectFit: 'cover', borderRadius: '5px', flexShrink: 0,
        }} />
      )}
      <div>
        <p style={{ margin: '0 0 2px 0', fontSize: '13px', color: '#94a3b8' }}>
          Añadido al carrito
        </p>
        <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>
          {message}
        </p>
      </div>
      <span style={{ color: '#4ade80', fontSize: '20px', marginLeft: 'auto', flexShrink: 0 }}>✓</span>
    </div>
  );
};

export default Toast;
