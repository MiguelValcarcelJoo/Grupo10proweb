import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import logo from '../assets/Logo.png';

const Navbar = ({ cartCount, currentUser, onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (trimmed) {
      navigate('/catalog', { state: { search: trimmed } });
      setSearchTerm('');
    }
  };

  return (
    <header className="main-navbar">
      <div className="logo-container">
        <Link to="/">
          <img src={logo} alt="PeKeys Store - Inicio" className="navbar-logo" />
        </Link>
      </div>

      {/* BARRA DE BÚSQUEDA CENTRAL */}
      <div className="navbar-search-container">
        <form onSubmit={handleSearch} className="navbar-search-form">
          <input
            type="text"
            placeholder="Buscar juegos, plataformas o categorías..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="navbar-search-input"
          />
          <button type="submit" className="navbar-search-btn" title="Buscar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </form>
      </div>

      <nav className="navbar-links">
        <Link to="/catalog" className="nav-item">
          Catálogo
        </Link>

        {currentUser ? (
          <>
            {currentUser === 'admin' && (
              <Link to="/admin" className="nav-item admin-link">
                Panel Admin
              </Link>
            )}

            {/* Solo usuarios no-admin ven Mis Compras y Carrito */}
            {currentUser !== 'admin' && (
              <>
                <Link to="/library" className="nav-item">
                  Mis Compras
                </Link>
                <Link to="/cart" className="nav-item cart-link">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ marginRight: '6px', verticalAlign: 'middle' }}
                  >
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  Carrito
                  {cartCount > 0 && (
                    <span className="cart-badge">{cartCount}</span>
                  )}
                </Link>
              </>
            )}

            <div className="user-menu">
              <span className="user-greeting">Hola, {currentUser}</span>
              <button onClick={onLogout} className="btn-logout">
                Salir
              </button>
            </div>
          </>
        ) : (
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <button className="btn-login">Iniciar Sesión</button>
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
