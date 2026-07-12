import { useParams, useNavigate } from 'react-router-dom';

const GameDetails = ({ games, onAdd, currentUser }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const game = games.find(g => g.id === parseInt(id));

  if (!game) {
    return <main style={{ padding: '40px', textAlign: 'center' }}>Juego no encontrado.</main>;
  }

  // Generamos estadísticas únicas y fijas basadas en el ID del juego
  const rating = (4.0 + (game.id % 10) * 0.1).toFixed(1);
  const reviews = 120 + (game.id * 43) % 800;
  const sales = 10 + (game.id * 7) % 90;

  const handleAddToCart = () => {
    if (!currentUser) {
      alert("Por favor, inicia sesión para agregar juegos a tu carrito.");
      navigate('/login');
      return;
    }
    
    if (currentUser === 'admin') {
      alert("Operación denegada. La cuenta de administrador es exclusiva para gestión de inventario y no puede realizar compras.");
      return;
    }

    onAdd(game);
    navigate('/cart');
  };

  const handlePaypal = () => {
    if (currentUser === 'admin') {
      alert("Operación denegada. La cuenta de administrador no puede usar pasarelas de pago.");
      return;
    }
  };

  return (
    <main className="game-details-container">
      <div className="game-details-header">
        <h1>{game.title} (Código Digital) - GLOBAL</h1>
        <div className="game-rating">
          <span style={{ color: '#fbbf24', fontSize: '18px' }}>★★★★★</span> 
          <span style={{ marginLeft: '10px', color: 'var(--text-muted)' }}>{rating} | {reviews} reseñas</span>
        </div>
      </div>

      <div className="game-details-layout">
        
        {/* COLUMNA 1: Imagen y miniaturas */}
        <div className="gd-media-section">
          <img src={game.imageUrl} alt={game.title} className="gd-main-image" />
          <div className="gd-thumbnails">
            <img src={game.imageUrl} alt="thumb1" />
            <div className="gd-thumb-placeholder">Video</div>
            <div className="gd-thumb-placeholder">+3</div>
          </div>
        </div>

        {/* COLUMNA 2: Info y Descripción */}
        <div className="gd-info-section">
          <ul className="gd-features-list">
            <li>
              <span className="gd-icon">🎮</span>
              <div>
                <strong>Plataforma: {game.platform}</strong>
                <p>Consultar guía de activación</p>
              </div>
            </li>
            <li>
              <span className="gd-icon">✅</span>
              <div>
                <strong>Se puede activar en: Perú</strong>
                <p>Consultar las restricciones de país</p>
              </div>
            </li>
            <li>
              <span className="gd-icon">🌍</span>
              <div>
                <strong>Región:</strong>
                <p>GLOBAL</p>
              </div>
            </li>
            <li>
              <span className="gd-icon">👤</span>
              <div>
                <strong>Tipo:</strong>
                <p>Clave Digital</p>
              </div>
            </li>
          </ul>

          <div className="gd-description">
            <h3>Descripción del producto</h3>
            <p>{game.description || "Sin descripción disponible para este título."}</p>
          </div>
        </div>

        {/* COLUMNA 3: Caja de compra */}
        <div className="gd-buy-section">
          <div className="gd-seller-info">
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>PATROCINADO ⓘ</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
              <div className="gd-seller-avatar">PE</div>
              <div>
                <strong>PeKeys Oficial</strong>
                <p style={{ margin: 0, fontSize: '12px', color: '#10b981' }}>100% Comentarios positivos</p>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>🛒 {sales}k ventas</span>
              </div>
            </div>
          </div>

          <div className="gd-price-box">
            <h2>S/ {game.price.toFixed(2)}</h2>
            <button className="gd-btn-add" onClick={handleAddToCart}>
              Añadir al carrito
            </button>
            <button className="gd-btn-paypal" onClick={handlePaypal}>
              Pagar con <em>PayPal</em>
            </button>
            <p style={{ textAlign: 'center', fontSize: '12px', marginTop: '10px', color: 'var(--text-muted)' }}>
              Coste total con tasa de pago: S/ {(game.price * 1.05).toFixed(2)}
            </p>
          </div>
        </div>

      </div>
    </main>
  );
};

export default GameDetails;
