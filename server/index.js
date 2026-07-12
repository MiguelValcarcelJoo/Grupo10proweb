import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';

import { initializeDatabase, getStorageMode, isDatabaseConfigured } from './database.js';
import { syncAndSeedDatabase } from './data/seedDatabase.js';
import gamesRouter from './routes/games.js';
import authRouter from './routes/auth.js';
import checkoutRouter from './routes/checkout.js';

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');
const hasFrontendBuild = fs.existsSync(distPath);

// ─── Middlewares ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

// ─── Rutas ─────────────────────────────────────────────────────────────────────
app.use('/api/games', gamesRouter);
app.use('/api/auth', authRouter);
app.use('/api/checkout', checkoutRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    storage: getStorageMode(),
    timestamp: new Date().toISOString(),
  });
});

if (hasFrontendBuild) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// 404 API / rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: `Ruta ${req.method} ${req.path} no encontrada.` });
});

// ─── Inicio ────────────────────────────────────────────────────────────────────
const startServer = async () => {
  try {
    const dbState = await initializeDatabase();

    if (isDatabaseConfigured) {
      await syncAndSeedDatabase();
      console.log('🗄️ PostgreSQL conectado y sincronizado.');
    } else {
      console.log('🧪 Base de datos no configurada. Usando datos en memoria.');
    }

    app.listen(PORT, () => {
      console.log(`\n🚀 PeKeys API corriendo en http://localhost:${PORT}`);
      console.log(`🌐 CORS habilitado para: ${FRONTEND_URL}`);
      console.log(`🗃️ Modo de almacenamiento: ${dbState.mode}`);
      console.log(`\nEndpoints disponibles:`);
      console.log(`  GET    /api/health`);
      console.log(`  GET    /api/games`);
      console.log(`  GET    /api/games/:id`);
      console.log(`  POST   /api/games`);
      console.log(`  PUT    /api/games/:id`);
      console.log(`  DELETE /api/games/:id`);
      console.log(`  POST   /api/auth/login`);
      console.log(`  POST   /api/checkout\n`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar la aplicación:', error.message);
    process.exit(1);
  }
};

startServer();
