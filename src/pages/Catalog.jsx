import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const Catalog = ({ games, onAdd, currentUser }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const initialPlatform = location.state?.platform || 'all';
  const initialSearch   = location.state?.search   || '';

  const [filterPlatform, setFilterPlatform] = useState(initialPlatform);
  const [filterCategory, setFilterCategory] = useState('all');
  const [minPrice,       setMinPrice]       = useState('');
  const [maxPrice,       setMaxPrice]       = useState('');
  const [searchQuery,    setSearchQuery]    = useState(initialSearch);

  useEffect(() => {
    if (location.state?.platform) setFilterPlatform(location.state.platform);
    if (location.state?.search !== undefined) setSearchQuery(location.state.search);
  }, [location.state]);

  const categories = ['all', ...new Set(games.map(g => g.category).filter(Boolean))];

  const filteredGames = games.filter(game => {
    const matchPlatform = filterPlatform === 'all' || game.platform === filterPlatform;
    const matchCategory = filterCategory === 'all' || game.category === filterCategory;
    const matchMin      = minPrice === '' || game.price >= parseFloat(minPrice);
    const matchMax      = maxPrice === '' || game.price <= parseFloat(maxPrice);
    const matchSearch   = searchQuery.trim() === ''
      || game.title.toLowerCase().includes(searchQuery.toLowerCase())
      || (game.category && game.category.toLowerCase().includes(searchQuery.toLowerCase()))
      || (game.description && game.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchPlatform && matchCategory && matchMin && matchMax && matchSearch;
  });

  const handleAddToCart = (game) => {
    if (!currentUser) {
      alert('Por favor, inicia sesión para agregar juegos a tu carrito.');
      navigate('/login');
      return;
    }
    if (currentUser === 'admin') {
      alert('Operación denegada. La cuenta de administrador no puede añadir productos al carrito.');
      return;
    }
    onAdd(game);
  };

  const handleClearFilters = () => {
    setFilterPlatform('all');
    setFilterCategory('all');
    setMinPrice('');
    setMaxPrice('');
    setSearchQuery('');
    navigate('/catalog', { replace: true });
  };

  const getPlatformClass = (platform) => {
    switch (platform) {
      case 'PC':     return 'tag-pc';
      case 'PS5':    return 'tag-ps5';
      case 'Xbox':   return 'tag-xbox';
      case 'Switch': return 'tag-switch';
      default:       return '';
    }
  };

  const activeFiltersCount = [
    filterPlatform !== 'all',
    filterCategory !== 'all',
    minPrice !== '',
    maxPrice !== '',
    searchQuery.trim() !== '',
  ].filter(Boolean).length;

  return (
    <main className="catalog-container" style={{ padding: '40px 20px' }}>

      {/* CABECERA: título + contador en la misma línea, fuera del grid */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 600, color: 'var(--text-main)' }}>
          Catálogo de Juegos
        </h1>
        {searchQuery && (
          <span style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
            — resultados para <strong style={{ color: 'var(--text-main)' }}>"{searchQuery}"</strong>
          </span>
        )}
        {/* Contador siempre visible, pegado al final */}
        <span style={{
          marginLeft: 'auto',
          background: '#f1f5f9',
          color: 'var(--text-muted)',
          borderRadius: '20px',
          padding: '4px 12px',
          fontSize: '13px',
          fontWeight: 600,
          whiteSpace: 'nowrap',
        }}>
          {filteredGames.length} {filteredGames.length === 1 ? 'resultado' : 'resultados'}
        </span>
      </div>

      <div className="catalog-layout" style={{ display: 'flex', gap: '30px' }}>

        {/* PANEL DE FILTROS */}
        <aside style={{
          flex: '0 0 220px',
          background: 'var(--surface-color)',
          padding: '24px',
          borderRadius: 'var(--border-radius)',
          border: '1px solid var(--border-color)',
          height: 'fit-content',
          position: 'sticky',
          top: '90px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontWeight: 600, fontSize: '16px' }}>Filtros</h3>
            {activeFiltersCount > 0 && (
              <span style={{ background: 'var(--primary-color)', color: '#fff', borderRadius: '12px', padding: '2px 8px', fontSize: '12px', fontWeight: 700 }}>
                {activeFiltersCount}
              </span>
            )}
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>Buscar</label>
            <input type="text" placeholder="Título, categoría..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', fontSize: '14px' }} />
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>Plataforma</label>
            <select value={filterPlatform} onChange={(e) => setFilterPlatform(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', fontSize: '14px' }}>
              <option value="all">Todas</option>
              <option value="PC">PC / Steam</option>
              <option value="PS5">PlayStation</option>
              <option value="Xbox">Xbox</option>
              <option value="Switch">Nintendo Switch</option>
            </select>
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>Categoría</label>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', fontSize: '14px' }}>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat === 'all' ? 'Todas' : cat}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>Precio Mínimo (S/)</label>
            <input type="number" placeholder="Ej: 50" value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)} min="0"
              style={{ width: '100%', boxSizing: 'border-box', fontSize: '14px' }} />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>Precio Máximo (S/)</label>
            <input type="number" placeholder="Ej: 200" value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)} min="0"
              style={{ width: '100%', boxSizing: 'border-box', fontSize: '14px' }} />
          </div>

          <button className="btn-secondary" onClick={handleClearFilters} style={{ width: '100%', fontSize: '14px' }}>
            Limpiar Filtros
          </button>
        </aside>

        {/* GRID DE JUEGOS — el contador NO está aquí adentro */}
        <section style={{ flex: 1, minWidth: 0 }}>
          {filteredGames.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', background: 'var(--surface-color)', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)' }}>
              <p style={{ fontSize: '18px', color: 'var(--text-muted)', margin: '0 0 16px 0' }}>
                No se encontraron juegos con esos filtros.
              </p>
              <button onClick={handleClearFilters}>Limpiar filtros</button>
            </div>
          ) : (
            <div className="games-grid">
              {filteredGames.map((game) => (
                <article key={game.id} className="game-card-simple">
                  <img src={game.imageUrl} alt={game.title} className="game-card-img" />
                  <div className="game-card-info">
                    <p className="game-card-title">{game.title}</p>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                      <span className={`game-card-platform ${getPlatformClass(game.platform)}`}>{game.platform}</span>
                      {game.category && (
                        <span style={{ borderRadius: '4px', display: 'inline-block', padding: '4px 10px', fontSize: '12px', fontWeight: 600, background: '#f1f5f9', color: 'var(--text-muted)' }}>
                          {game.category}
                        </span>
                      )}
                    </div>
                    <p className="game-card-price">S/ {game.price.toFixed(2)}</p>
                  </div>
                  <div style={{ padding: '0 20px 20px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Link to={`/game/${game.id}`} style={{ textDecoration: 'none' }}>
                      <button className="add-button btn-secondary">Ver Detalles</button>
                    </Link>
                    <button className="add-button" onClick={() => handleAddToCart(game)}>
                      Añadir al carrito
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Catalog;
