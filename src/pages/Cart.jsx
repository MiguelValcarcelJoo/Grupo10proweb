import { useState } from 'react';
import { Link } from 'react-router-dom';
import { checkout as checkoutApi } from '../services/api';

const Cart = ({ cartItems, onRemove, onClear, onCompletePurchase }) => {
  const [isProcessing, setIsProcessing]     = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [newKeys, setNewKeys]               = useState([]);
  const [error, setError]                   = useState('');

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = async () => {
    setIsProcessing(true);
    setError('');
    try {
      const { purchasedItems } = await checkoutApi(cartItems);
      setNewKeys(purchasedItems);
      onCompletePurchase(purchasedItems);
      onClear();
      setPurchaseComplete(true);
    } catch (err) {
      setError(err.message || 'Error al procesar la compra. Intenta nuevamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (purchaseComplete) {
    return (
      <main style={{ maxWidth: '680px', margin: '0 auto', padding: '48px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎉</div>
        <h1 style={{ color: '#10b981', marginBottom: '8px' }}>¡Compra Procesada con Éxito!</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
          Tus licencias han sido enviadas a tu <strong>Biblioteca</strong> de manera segura.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
          {newKeys.map((item, index) => (
            <div key={index} style={{
              display: 'flex', alignItems: 'center', gap: '16px',
              border: '1px solid var(--border-color)', borderRadius: '10px',
              padding: '16px', background: 'var(--surface-color)', textAlign: 'left',
            }}>
              <img src={item.imageUrl} alt={item.title} style={{ width: '56px', height: '72px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 6px 0', fontWeight: 700, color: 'var(--text-main)', fontSize: '15px' }}>{item.title}</p>
                <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--text-muted)' }}>{item.platform}</p>
                <code style={{ display: 'inline-block', background: '#0f172a', color: '#4ade80', padding: '4px 12px', borderRadius: '4px', fontFamily: 'monospace', fontWeight: 700, fontSize: '15px', letterSpacing: '2px' }}>
                  {item.keyGenerated}
                </code>
              </div>
            </div>
          ))}
        </div>

        <Link to="/library">
          <button style={{ padding: '12px 28px', fontSize: '15px' }}>Ir a mi Biblioteca</button>
        </Link>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ marginBottom: '28px', fontSize: '26px', fontWeight: 700 }}>Mi Carrito</h1>

      <div style={{ display: 'flex', gap: '28px', alignItems: 'flex-start' }}>

        {/* LISTA DE ITEMS */}
        <section style={{ flex: 2 }}>
          {cartItems.length === 0 ? (
            <div style={{ padding: '60px 40px', textAlign: 'center', background: 'var(--surface-color)', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🛒</div>
              <p style={{ fontSize: '17px', color: 'var(--text-muted)', margin: '0 0 20px 0' }}>Tu carrito está vacío.</p>
              <Link to="/catalog"><button>Explorar Catálogo</button></Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {cartItems.map((item, index) => (
                <div key={index} style={{
                  display: 'flex', alignItems: 'center', gap: '16px',
                  background: 'var(--surface-color)', borderRadius: 'var(--border-radius)',
                  border: '1px solid var(--border-color)', padding: '14px 16px',
                  transition: 'border-color 0.2s',
                }}>
                  <img src={item.imageUrl} alt={item.title} style={{ width: '52px', height: '68px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0, border: '1px solid var(--border-color)' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: '0 0 4px 0', fontWeight: 700, color: 'var(--text-main)', fontSize: '15px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</p>
                    <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', color: '#fff', background: item.platform === 'PC' ? '#1a202c' : item.platform === 'PS5' ? '#00439c' : item.platform === 'Xbox' ? '#107c10' : '#e60012' }}>
                      {item.platform}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
                    <span style={{ fontWeight: 800, fontSize: '17px', color: 'var(--text-main)' }}>S/ {item.price.toFixed(2)}</span>
                    <button onClick={() => onRemove(index)} title="Eliminar" style={{ background: 'transparent', border: '1px solid #fca5a5', color: '#ef4444', borderRadius: '6px', padding: '6px 10px', fontSize: '13px', cursor: 'pointer', transition: 'background 0.2s, color 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.background='#ef4444'; e.currentTarget.style.color='#fff'; }}
                      onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#ef4444'; }}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* RESUMEN */}
        <aside style={{ flex: '0 0 280px', background: 'var(--surface-color)', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)', padding: '24px', position: 'sticky', top: '90px' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '17px', fontWeight: 700, borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>Resumen del pedido</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--text-muted)' }}>
              <span>{cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'}</span>
              <span>S/ {total.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--text-muted)' }}>
              <span>Entrega digital</span>
              <span style={{ color: '#10b981', fontWeight: 600 }}>Gratis</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginBottom: '20px' }}>
            <span style={{ fontWeight: 700, fontSize: '16px' }}>Total</span>
            <span style={{ fontWeight: 800, fontSize: '22px', color: 'var(--text-main)' }}>S/ {total.toFixed(2)}</span>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', borderRadius: '6px', padding: '10px 14px', fontSize: '13px', marginBottom: '14px' }}>
              ❌ {error}
            </div>
          )}

          <button
            onClick={handleCheckout}
            disabled={cartItems.length === 0 || isProcessing}
            style={{
              width: '100%', padding: '14px', fontSize: '15px', fontWeight: 700,
              background: cartItems.length === 0 || isProcessing ? '#cbd5e1' : 'var(--primary-color)',
              cursor: cartItems.length === 0 || isProcessing ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {isProcessing ? '⏳ Verificando con servidor...' : 'Proceder al Pago'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '12px', marginTop: '12px', color: 'var(--text-muted)' }}>
            🔒 Pago 100% seguro y encriptado
          </p>
        </aside>
      </div>
    </main>
  );
};

export default Cart;
