import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Toast from './pages/Toast';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Cart from './pages/Cart';
import Library from './pages/Library';
import Login from './pages/Login';
import Admin from './pages/Admin';
import GameDetails from './pages/GameDetails';
import * as api from './services/api';

const App = () => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = window.localStorage.getItem('pekeys-user');
    return saved ? JSON.parse(saved) : null;
  });
  const [cart, setCart] = useState([]);
  const [purchasedKeys, setPurchasedKeys] = useState([]);
  const [toast, setToast] = useState(null);
  const [games, setGames] = useState([]);
  const [loadingGames, setLoadingGames] = useState(true);
  const [apiError, setApiError] = useState(null);

  // ── Cargar juegos desde el backend ───────────────────────────────────────
  useEffect(() => {
    setLoadingGames(true);
    api.getGames()
      .then(data => {
        setGames(data);
        setApiError(null);
      })
      .catch(() => setApiError('No se pudo conectar con el servidor. Verifica que el backend esté corriendo.'))
      .finally(() => setLoadingGames(false));
  }, []);

  // ── Persistencia de sesión y carrito en localStorage ─────────────────────
  useEffect(() => {
    if (currentUser) {
      window.localStorage.setItem('pekeys-user', JSON.stringify(currentUser));
      const savedCart    = window.localStorage.getItem(`pekeys-cart-${currentUser.username}`);
      const savedLibrary = window.localStorage.getItem(`pekeys-library-${currentUser.username}`);
      setCart(savedCart    ? JSON.parse(savedCart)    : []);
      setPurchasedKeys(savedLibrary ? JSON.parse(savedLibrary) : []);
    } else {
      window.localStorage.removeItem('pekeys-user');
      setCart([]);
      setPurchasedKeys([]);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      window.localStorage.setItem(`pekeys-cart-${currentUser.username}`, JSON.stringify(cart));
    }
  }, [cart, currentUser]);

  useEffect(() => {
    if (currentUser) {
      window.localStorage.setItem(`pekeys-library-${currentUser.username}`, JSON.stringify(purchasedKeys));
    }
  }, [purchasedKeys, currentUser]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleLogin  = (user) => setCurrentUser(user);
  const handleLogout = ()     => setCurrentUser(null);

  const addToCart = (game) => {
    setCart(prev => [...prev, game]);
    setToast({ message: game.title, imageUrl: game.imageUrl });
  };
  const removeFromCart  = (idx) => setCart(prev => prev.filter((_, i) => i !== idx));
  const clearCart       = ()    => setCart([]);
  const addPurchasedKeys = (newKeys) => setPurchasedKeys(prev => [...prev, ...newKeys]);

  // ── setGames con callback para Admin (operaciones CRUD sobre la API) ──────
  const handleSetGames = (updater) => {
    setGames(typeof updater === 'function' ? updater : () => updater);
  };

  // ── Banner de error de conexión ───────────────────────────────────────────
  const ErrorBanner = () => apiError ? (
    <div style={{
      background: '#fef2f2', color: '#991b1b',
      border: '1px solid #fca5a5',
      padding: '12px 24px', textAlign: 'center',
      fontSize: '14px', fontWeight: 500,
    }}>
      ⚠️ {apiError}
    </div>
  ) : null;

  return (
    <BrowserRouter>
      <Navbar cartCount={cart.length} currentUser={currentUser?.username} onLogout={handleLogout} />
      <ErrorBanner />

      {loadingGames ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', flexDirection: 'column', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: 'var(--primary-color)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Conectando con el servidor...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        <Routes>
          <Route path="/"        element={<Home games={games} />} />
          <Route path="/catalog" element={<Catalog games={games} onAdd={addToCart} currentUser={currentUser?.username} />} />
          <Route path="/login"   element={<Login onLogin={handleLogin} />} />
          <Route path="/admin"   element={<Admin games={games} setGames={handleSetGames} currentUser={currentUser?.username} />} />
          <Route path="/game/:id" element={<GameDetails games={games} onAdd={addToCart} currentUser={currentUser?.username} />} />
          <Route path="/cart"    element={
            currentUser
              ? <Cart cartItems={cart} onRemove={removeFromCart} onClear={clearCart} onCompletePurchase={addPurchasedKeys} />
              : <Navigate to="/login" />
          } />
          <Route path="/library" element={
            currentUser
              ? <Library purchasedKeys={purchasedKeys} />
              : <Navigate to="/login" />
          } />
        </Routes>
      )}

      {toast && (
        <Toast message={toast.message} imageUrl={toast.imageUrl} onDone={() => setToast(null)} />
      )}
    </BrowserRouter>
  );
};

export default App;